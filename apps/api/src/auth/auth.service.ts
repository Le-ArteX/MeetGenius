import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) { }

    async register(dto: RegisterDto) {

        if (dto.password != dto.confirmPassword) {
            throw new UnauthorizedException('Passwords do not match');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
            }
        });

        return user;
    }

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            throw new UnauthorizedException('Incorrect email or password');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Incorrect email or password');
        }
        return user;
    }
}