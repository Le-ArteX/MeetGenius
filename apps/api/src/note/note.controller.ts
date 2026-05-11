import { Controller, Get, Post, Patch, Body, Param, Delete, UseGuards, Query, UseInterceptors, UploadedFile, BadRequestException, ForbiddenException, Res, NotFoundException } from "@nestjs/common";
import { NoteService } from "./note.service";
import { CreateNoteDto } from "./dto/create-note.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NoteController {
    constructor(private readonly noteService: NoteService) { }

    @Get('usage')
    async getUsage(@CurrentUser('id') userId: string) {
        return this.noteService.getUsage(userId);
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async create(
        @CurrentUser('id') userId: string,
        @Body() dto: CreateNoteDto,
        @UploadedFile() file?: Express.Multer.File
    ) {
        let transcript = dto.transcript;
        const logger = new (require('@nestjs/common').Logger)('NoteController');

        if (file) {
            // --- ENFORCE PLAN LIMITS FOR FILE UPLOADS ---
            const user = await this.noteService.getUserPlan(userId);
            if (user?.plan === 'FREE') {
                throw new ForbiddenException('File uploads are a Pro feature. Please upgrade to Pro to upload audio or documents.');
            }
            // --------------------------------------------

            logger.log(`Received file: ${file.originalname}, size: ${file.size}, mimetype: ${file.mimetype}`);
            
            const isAudio = file.mimetype.startsWith('audio/') || 
                            file.mimetype === 'video/webm' || 
                            file.originalname.match(/\.(mp3|wav|m4a|mp4|webm|ogg)$/i);
            
            if (isAudio) {
                transcript = await this.noteService.transcribeAudio(file);
            } else {
                transcript = await this.noteService.parseDocument(file);
            }
        } else {
            logger.warn('No file received in request');
        }

        if (!transcript && !dto.title) {
            throw new BadRequestException('Title or audio/transcript is required');
        }

        return this.noteService.create(userId, {
            ...dto,
            transcript,
        });
    }

    @Get()
    async findAll(
        @CurrentUser('id') userId: string,
        @Query('workspaceId') workspaceId?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string
    ) {
        return this.noteService.findAll(
            userId, 
            workspaceId, 
            page ? parseInt(page) : 1, 
            limit ? parseInt(limit) : 15
        );
    }

    @Get(':id')
    async findOne(
        @CurrentUser('id') userId: string,
        @Param('id') id: string
    ) {
        return this.noteService.findOne(userId, id);
    }

    @Patch(':id')
    async update(
        @CurrentUser('id') userId: string,
        @Param('id') id: string,
        @Body() data: any
    ) {
        return this.noteService.update(userId, id, data);
    }

    @Delete(':id')
    async remove(
        @CurrentUser('id') userId: string,
        @Param('id') id: string
    ) {
        return this.noteService.delete(userId, id);
    }

    @Get(':id/export')
    async export(
        @CurrentUser('id') userId: string,
        @Param('id') id: string,
        @Res() res: any
    ) {
        // --- ENFORCE PLAN LIMITS FOR EXPORT ---
        const user = await this.noteService.getUserPlan(userId);
        if (user?.plan === 'FREE') {
            throw new ForbiddenException('PDF Export is a Pro feature. Please upgrade to Pro to download your notes.');
        }
        // --------------------------------------

        const note = await this.noteService.findOne(userId, id);
        if (!note) throw new NotFoundException('Note not found');

        const content = `
            MEETING NOTE: ${note.title}
            DATE: ${note.createdAt.toLocaleDateString()}
            
            SUMMARY:
            ${note.summary || 'No summary available.'}
            
            KEY DECISIONS:
            ${note.keyDecision || 'No decisions recorded.'}
            
            TRANSCRIPT:
            ${note.transcript || 'No transcript available.'}
        `;

        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Disposition', `attachment; filename="${note.title.replace(/\s+/g, '_')}.txt"`);
        return res.send(content);
    }
}