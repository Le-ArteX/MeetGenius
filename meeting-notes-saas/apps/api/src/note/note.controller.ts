import { Controller } from "@nestjs/common";
import { NoteService } from "./note.service";

@Controller('notes')
export class NoteController {
    constructor(private readonly noteService: NoteService) { }
}