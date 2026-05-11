import { ForbiddenException, Injectable, Logger, NotFoundException } from "@nestjs/common";
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
                throw new ForbiddenException('You are not a member of this workspace');
            }

            if (membership.role === 'VIEWER') {
                throw new ForbiddenException('Viewers cannot create notes in this workspace');
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

    async parseDocument(file: Express.Multer.File): Promise<string> {
        const mimeType = file.mimetype;
        const filename = file.originalname.toLowerCase();

        try {
            if (filename.endsWith('.pdf') || mimeType === 'application/pdf') {
                // pdf-parse v2.x uses a class-based API: PDFParse
                const { PDFParse } = require('pdf-parse');

                const parser = new PDFParse({
                    data: new Uint8Array(file.buffer),
                    verbosity: 0,
                    useWorkerFetch: false,
                    isEvalSupported: false,
                });

                const result = await parser.getText();
                const text = result.text?.trim() || '';

                if (!text) {
                    throw new Error('PDF extraction returned empty text.');
                }

                // Clean up pdfjs-dist resources
                await parser.destroy().catch(() => {});

                return text;
            }

            if (filename.endsWith('.docx') || mimeType.includes('wordprocessingml')) {
                const mammothModule = require('mammoth');
                const mammoth = mammothModule.extractRawText 
                    ? mammothModule 
                    : (mammothModule.default || mammothModule);

                const result = await mammoth.extractRawText({ buffer: file.buffer });
                
                if (!result.value.trim()) {
                    throw new Error('Word document extraction resulted in empty text.');
                }
                
                return result.value;
            }

            if (filename.endsWith('.txt') || mimeType === 'text/plain') {
                const text = file.buffer.toString('utf-8');
                if (!text.trim()) throw new Error('Text file is empty.');
                return text;
            }

            throw new Error('Unsupported document format.');
        } catch (error) {
            this.logger.error(`Document parsing failed: ${error.message}\n${error.stack}`);
            const { InternalServerErrorException } = require('@nestjs/common');
            throw new InternalServerErrorException(`Failed to parse document. Reason: ${error.message}`);
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
                Analyze the following meeting transcript and provide a comprehensive and detailed summary, 
                key decisions made, and specific action items.
                
                The "summary" field should be thorough, capturing the context, main discussion points, 
                and any important nuances from the conversation. Aim for a detailed overview rather than a brief sentence.
                
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
                    : {
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
                    }
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
        const note = await this.prisma.note.findUnique({
            where: { id },
            include: {
                workspace: {
                    include: {
                        members: { where: { userId } }
                    }
                }
            }
        });

        if (!note) throw new NotFoundException('Note not found');

        // Allow deletion if:
        // 1. User is the creator
        // 2. User is an OWNER or EDITOR in the workspace where the note belongs
        const isCreator = note.userId === userId;
        const workspaceMember = note.workspace?.members[0];
        const hasWorkspacePermission = workspaceMember && ['OWNER', 'EDITOR'].includes(workspaceMember.role);

        if (!isCreator && !hasWorkspacePermission) {
            throw new ForbiddenException('You do not have permission to delete this note');
        }

        return this.prisma.note.delete({
            where: { id },
        });
    }
}