import { Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus, Req, Get, Res, Logger } from '@nestjs/common';
import { Request as ExpressRequest, Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto, @Req() req: ExpressRequest) {
    // Extract IP address from request
    const remoteIp = this.getClientIp(req);
    
    return this.authService.register(registerDto, remoteIp);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Req() req: ExpressRequest) {
    // Extract IP address for audit logging
    const remoteIp = this.getClientIp(req);
    
    return this.authService.login(loginDto, remoteIp);
  }

  /**
   * Extract client IP address from request
   * Handles proxies and load balancers
   */
  private getClientIp(req: ExpressRequest): string {
    return (
      (req.headers['cf-connecting-ip'] as string) || // Cloudflare
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] || // Proxy
      (req.headers['x-real-ip'] as string) || // Nginx
      req.socket.remoteAddress ||
      'unknown'
    );
  }

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Req() req: ExpressRequest) {
    // Guard redirects to Google login
  }

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    try {
      const result = await this.authService.loginWithGoogle(req.user);

      // Get first frontend URL from comma-separated list
      const frontendUrls = process.env.FRONTEND_URL || 'http://localhost:3000';
      const frontendUrl = frontendUrls.split(',')[0].trim();
      
      this.logger.log(`Redirecting to: ${frontendUrl}?token=${result.access_token}`);
      res.redirect(`${frontendUrl}?token=${result.access_token}`);
    } catch (error) {
      this.logger.error(`Google OAuth failed: ${error.message}`);
      const frontendUrls = process.env.FRONTEND_URL || 'http://localhost:3000';
      const frontendUrl = frontendUrls.split(',')[0].trim();
      res.redirect(`${frontendUrl}/dang-ky?error=GOOGLE_LOGIN_FAILED`);
    }
  }
}
