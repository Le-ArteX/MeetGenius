import { Controller, Get, Patch, Post, Body, UseGuards, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('profile')
    async getProfile(@CurrentUser('id') userId: string) {
        return this.usersService.findOne(userId);
    }

    @Patch('profile')
    async updateProfile(
        @CurrentUser('id') userId: string,
        @Body() data: { name?: string; email?: string }
    ) {
        return this.usersService.updateProfile(userId, data);
    }

    @Post('avatar')
    @UseInterceptors(FileInterceptor('file'))
    async uploadAvatar(
        @CurrentUser('id') userId: string,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }), // 2MB
                    new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
                ],
            }),
        ) file: Express.Multer.File,
    ) {
        // In a real app, you would upload this 'file' to Cloudinary/S3 here.
        // For now, we'll return a mock URL to show it works.
        const mockUrl = `https://ui-avatars.com/api/?name=${userId}&background=random`;
        
        await this.usersService.updateAvatar(userId, mockUrl);
        
        return { avatarUrl: mockUrl };
    }
}