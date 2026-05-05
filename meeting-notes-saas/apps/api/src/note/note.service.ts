import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateNoteDto } from "./dto/create-note.dto";
import { OpenAI } from 'openai';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class NoteService {
    private openai: OpenAI;
    private readonly logger = new Logger(NoteService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService
    ) {
        const apiKey = this.configService.get<string>('GROQ_API_KEY');
        
        if (apiKey) {
            this.openai = new OpenAI({
                apiKey: apiKey,
                baseURL: 'https://api.groq.com/openai/v1',
            });
        } else {
            this.logger.warn('GROQ_API_KEY is missing. AI features will not work.');
        }
    }

    async create(userId: string, dto: CreateNoteDto) {
        // If workspaceId is provided, verify membership
        if (dto.workspaceId) {
            const membership = await this.prisma.workspaceMember.findUnique({
                where: {
                    userId_workspaceId: {
                        userId,
                        workspaceId: dto.workspaceId,
                    },
                },
            });
            if (!membership) {
                throw new Error('You are not a member of this workspace');
            }
        }

        const note = await this.prisma.note.create({
            data: {
                title: dto.title,
                transcript: dto.transcript,
                userId: userId,
                workspaceId: dto.workspaceId,
            },
        });

        // Trigger background processing if transcript exists
        if (dto.transcript) {
            this.processNote(note.id, dto.transcript).catch(err => {
                this.logger.error(`Failed to process note ${note.id}: ${err.message}`);
            });
        }

        return note;
    }

    async transcribeAudio(file: Express.Multer.File): Promise<string> {
        if (!this.openai) {
            throw new Error('AI transcription is currently disabled (missing API key)');
        }
        try {
            const response = await this.openai.audio.transcriptions.create({
                file: await OpenAI.toFile(file.buffer, file.originalname),
                model: 'whisper-large-v3-turbo',
            });
            return response.text;
        } catch (error) {
            this.logger.error(`Transcription failed: ${error.message}`);
            throw error;
        }
    }

    async processNote(noteId: string, transcript: string) {
        if (!this.openai) {
            this.logger.error('Cannot process note: AI is disabled');
            return;
        }
        this.logger.log(`Processing note ${noteId}...`);

        try {
            const prompt = `
                Analyze the following meeting transcript and provide a summary, key decisions, and action items.
                Format the response as JSON with the following structure:
                {
                    "summary": "...",
                    "keyDecisions": "...",
                    "actionItems": [
                        { "text": "...", "assignee": "..." },
                        ...
                    ]
                }

                Transcript:
                ${transcript}
            `;

            const response = await this.openai.chat.completions.create({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: prompt }],
                response_format: { type: 'json_object' },
            });

            const content = response.choices[0].message.content;
            if (!content) throw new Error('No content returned from OpenAI');
            
            const result = JSON.parse(content);

            await this.prisma.$transaction(async (tx) => {
                await tx.note.update({
                    where: { id: noteId },
                    data: {
                        summary: result.summary,
                        keyDecision: result.keyDecisions,
                        wordCount: transcript.trim() ? transcript.trim().split(/\s+/).length : 0,
                    },
                });

                if (result.actionItems && result.actionItems.length > 0) {
                    await tx.actionItem.createMany({
                        data: result.actionItems.map((item: any) => ({
                            text: item.text,
                            assignee: item.assignee || null,
                            noteId: noteId,
                        })),
                    });
                }
            });

            this.logger.log(`Note ${noteId} processed successfully.`);
        } catch (error) {
            this.logger.error(`Processing failed for note ${noteId}: ${error.message}`);
        }
    }

    async findAll(userId: string, workspaceId?: string) {
        return this.prisma.note.findMany({
            where: {
                ...(workspaceId
                    ? {
                        workspaceId,
                        workspace: {
                            members: {
                                some: { userId }
                            }
                        }
                    }
                    : { userId }
                ),
            },
            include: {
                actionItems: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findOne(userId: string, id: string) {
        return this.prisma.note.findFirst({
            where: {
                id,
                OR: [
                    { userId },
                    {
                        workspace: {
                            members: {
                                some: { userId }
                            }
                        }
                    }
                ]
            },
            include: { actionItems: true },
        });
    }

    async delete(userId: string, id: string) {
        return this.prisma.note.delete({
            where: { id, userId },
        });
    }
}