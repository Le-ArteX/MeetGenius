import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class NoteService {
    constructor(private readonly prisma: PrismaService) { }
}