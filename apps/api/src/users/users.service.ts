import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }
 
    async findOne(userId: string) {
        return this.prisma.user.findUnique({
            where: { id: userId },
        });
    }

    async updateProfile(userId: string, data: { name?: string; email?: string }) {
        return this.prisma.user.update({
            where: { id: userId },
            data,
        });
    }

    async updateAvatar(userId: string, avatarUrl: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { avaterUrl: avatarUrl },
        });
    }
}