import { Controller, Get, Post, Patch, Body, Param, Delete, UseGuards, Query, UseInterceptors, UploadedFile, BadRequestException, ForbiddenException } from "@nestjs/common";
import { NoteService } from "./note.service";
import { CreateNoteDto } from "./dto/create-note.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NoteController {
    constructor(private readonly noteService: NoteService) { }

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
}