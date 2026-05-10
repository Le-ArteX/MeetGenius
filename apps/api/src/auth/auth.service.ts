import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordOtpDto } from './dto/reset-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(dto: RegisterDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    let user;
    if (existingUser) {
        if (existingUser.isVerified) {
            throw new BadRequestException('User already exists and is verified');
        }
        // Update unverified user with new password if they try to register again
        user = await this.prisma.user.update({
            where: { id: existingUser.id },
            data: { password: hashedPassword }
        });
    } else {
        user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                isVerified: false,
            },
        });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    await this.prisma.otpCode.create({
        data: {
            userId: user.id,
            code: otp,
            type: 'REGISTER',
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        }
    });

    await this.mailService.sendOtpEmail(user.email, otp, 'REGISTER');

    return {
      message: 'OTP sent to your email for verification',
      email: user.email,
    };
  }

  async verifyRegisterOtp(dto: VerifyOtpDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const otpRecord = await this.prisma.otpCode.findFirst({
      where: {
        userId: user.id,
        code: dto.code,
        type: 'REGISTER',
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!otpRecord) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    await this.prisma.$transaction([
        this.prisma.otpCode.update({
            where: { id: otpRecord.id },
            data: { used: true },
        }),
        this.prisma.user.update({
            where: { id: user.id },
            data: { isVerified: true },
        }),
    ]);

    const token = await this.generateToken(user.id, user.email);
    return {
      user,
      access_token: token,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    
    if (!user) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    if (!user.isVerified) {
        throw new UnauthorizedException('Please verify your email before logging in');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    const token = await this.generateToken(user.id, user.email);
    return {
      user,
      access_token: token,
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (user) {
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      await this.prisma.otpCode.create({
        data: {
          userId: user.id,
          code: otp,
          type: 'RESET',
          expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        },
      });

      await this.mailService.sendOtpEmail(user.email, otp, 'RESET');
    }

    return {
      message: 'If an account with that email exists, an OTP has been sent.',
    };
  }

  async resetPassword(dto: ResetPasswordOtpDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new BadRequestException('Invalid request');
    }

    const otpRecord = await this.prisma.otpCode.findFirst({
      where: {
        userId: user.id,
        code: dto.code,
        type: 'RESET',
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!otpRecord) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    
    await this.prisma.$transaction([
      this.prisma.otpCode.update({
        where: { id: otpRecord.id },
        data: { used: true },
      }),
      this.prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      }),
    ]);

    return { message: 'Your password has been reset successfully.' };
  }

  private async generateToken(userId: string, email: string) {
    return this.jwtService.signAsync({
      sub: userId,
      email,
    });
  }
}