import { ForbiddenException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateNoteDto } from "./dto/create-note.dto";
import { OpenAI, toFile } from 'openai';
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
            this.logger.log(`Triggering background processing for note ${note.id} with transcript length ${dto.transcript.length}`);
            this.processNote(note.id, dto.transcript).catch(err => {
                this.logger.error(`Background process execution error for note ${note.id}: ${err.message}`);
            });
        } else {
            this.logger.warn(`No transcript found for note ${note.id}, skipping background processing.`);
        }

        return note;
    }

    async transcribeAudio(file: Express.Multer.File): Promise<string> {
        if (!this.openai) {
            throw new Error('AI transcription is currently disabled (missing API key)');
        }
        try {
            const response = await this.openai.audio.transcriptions.create({
                file: await toFile(file.buffer, file.originalname),
                model: 'whisper-large-v3-turbo',
            });
            this.logger.log(`Transcription completed for ${file.originalname}. Result length: ${response.text?.length || 0}`);
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
                const pdfModule = require('pdf-parse');
                const PDFParse = pdfModule.PDFParse || pdfModule;

                const parser = new PDFParse({
                    data: new Uint8Array(file.buffer),
                    verbosity: 0,
                    useWorkerFetch: false,
                    isEvalSupported: false,
                });

                const result = await parser.getText();
                const text = result.text?.trim() || '';

                this.logger.log(`PDF parsed successfully. Extracted ${text.length} characters.`);

                if (!text) {
                    this.logger.warn('PDF extraction returned empty text.');
                    throw new Error('PDF extraction returned empty text. The file might be scanned (OCR required) or empty.');
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

            // Truncate transcript if it's too long for the model (approx 15k words)
            const truncatedTranscript = transcript.length > 60000 
                ? transcript.substring(0, 60000) + "... [Truncated]" 
                : transcript;

            const prompt = `
                Analyze the following meeting transcript and provide a comprehensive and detailed summary, 
                key decisions made, and specific action items.
                
                The "summary" field should be thorough, capturing the context, main discussion points, 
                and any important nuances from the conversation. 

                Format the response as JSON with exactly these keys:
                {
                    "summary": "detailed summary here",
                    "keyDecisions": "key decisions here",
                    "actionItems": [
                        { "text": "task description", "assignee": "name or null" }
                    ]
                }

                Transcript:
                ${truncatedTranscript}
            `;

            const response = await this.openai.chat.completions.create({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: prompt }],
                response_format: { type: 'json_object' },
            });

            const content = response.choices[0].message.content;
            if (!content) {
                this.logger.error(`AI returned empty content for note ${noteId}`);
                throw new Error('No content returned from OpenAI');
            }

            this.logger.log(`AI response received for note ${noteId}. Content length: ${content.length}`);
            
            let result;
            try {
                result = JSON.parse(content);
            } catch (parseError) {
                this.logger.error(`Failed to parse AI JSON for note ${noteId}: ${content}`);
                throw new Error(`Invalid JSON format from AI: ${parseError.message}`);
            }

            // Normalize results (handle camelCase vs snake_case)
            const summary = result.summary || result.detailed_summary || '';
            const keyDecisions = result.keyDecisions || result.key_decisions || result.decisions || '';
            const actionItems = result.actionItems || result.action_items || [];

            await this.prisma.$transaction(async (tx) => {
                await tx.note.update({
                    where: { id: noteId },
                    data: {
                        summary,
                        keyDecision: keyDecisions,
                        wordCount: transcript.trim() ? transcript.trim().split(/\s+/).length : 0,
                    },
                });

                if (Array.isArray(actionItems) && actionItems.length > 0) {
                    await tx.actionItem.createMany({
                        data: actionItems.map((item: any) => ({
                            text: item.text || item.description || '',
                            assignee: item.assignee || item.owner || null,
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

    async findAll(userId: string, workspaceId?: string, page: number = 1, limit: number = 15) {
        const skip = (page - 1) * limit;

        let where: any = {};

        if (workspaceId === 'personal') {
            // Filter for notes that belong to the user but HAVE NO workspace
            where = {
                userId,
                workspaceId: null,
            };
        } else if (workspaceId) {
            // Filter by a specific workspace ID (ensure user is a member)
            where = {
                workspaceId,
                workspace: {
                    members: {
                        some: { userId }
                    }
                }
            };
        } else {
            // No filter: Show ALL notes user has access to
            where = {
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
            };
        }

        const [data, total] = await Promise.all([
            this.prisma.note.findMany({
                where,
                include: {
                    actionItems: true,
                    workspace: {
                        select: { name: true }
                    }
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: limit,
            }),
            this.prisma.note.count({ where }),
        ]);

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
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

    async update(userId: string, id: string, data: Partial<{ title: string, summary: string, keyDecision: string, transcript: string }>) {
        const note = await this.findOne(userId, id);
        if (!note) throw new NotFoundException('Note not found or no permission to edit');

        return this.prisma.note.update({
            where: { id },
            data,
            include: { 
                actionItems: true,
                workspace: { select: { name: true } }
            },
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