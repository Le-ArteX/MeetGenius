import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { EmailUnique } from "./validation/email-unique.validator";

@Module({
    providers: [UsersService, EmailUnique],
    exports: [UsersService],
    controllers: [UsersController],
})
export class UsersModule { }