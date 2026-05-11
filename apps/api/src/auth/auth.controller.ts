import { Body, Controller, Get, Post, Res, UseGuards, Req } from '@nestjs/common';
import * as express from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordOtpDto } from './dto/reset-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { AuthGuard } from '@nestjs/passport';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto, @Res({ passthrough: true }) res: express.Response) {
    const result = await this.authService.verifyRegisterOtp(dto);
    this.setTokenCookie(res, result.access_token);
    return result;
  }

  @Post('resend-otp')
  async resendOtp(@Body() dto: ForgotPasswordDto) {
    return this.authService.resendOtp(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: express.Response) {
    const result = await this.authService.login(dto);
    this.setTokenCookie(res, result.access_token, dto.rememberMe);
    return result;
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // This initiates the Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: express.Response) {
    const result = await this.authService.validateGoogleUser(req.user);
    this.setTokenCookie(res, result.access_token, true); // Google login defaults to rememberMe: true
    
    // Redirect back to frontend dashboard
    return res.redirect('http://localhost:3000/dashboard');
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: express.Response) {
    res.clearCookie('access_token');
    return { message: 'Logged out successfully' };
  }

  private setTokenCookie(res: express.Response, token: string, rememberMe: boolean = false) {
    const maxAge = rememberMe 
      ? 30 * 24 * 60 * 60 * 1000 // 30 days
      : 10 * 60 * 1000;          // 10 minutes

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: maxAge,
    });
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordOtpDto) {
    return this.authService.resetPassword(dto);
  }
}