import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query, UseInterceptors, UploadedFile, BadRequestException } from "@nestjs/common";
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

        if (file) {
            transcript = await this.noteService.transcribeAudio(file);
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
        @Query('workspaceId') workspaceId?: string
    ) {
        return this.noteService.findAll(userId, workspaceId);
    }

    @Get(':id')
    async findOne(
        @CurrentUser('id') userId: string,
        @Param('id') id: string
    ) {
        return this.noteService.findOne(userId, id);
    }

    @Delete(':id')
    async remove(
        @CurrentUser('id') userId: string,
        @Param('id') id: string
    ) {
        return this.noteService.delete(userId, id);
    }
}