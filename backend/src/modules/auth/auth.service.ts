import { Injectable, UnauthorizedException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { TurnstileService } from './services/turnstile.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private turnstileService: TurnstileService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is disabled');
    }

    const { passwordHash: _, ...result } = user;
    return result;
  }

  /**
   * Authenticate user with email and password
   * @param loginDto - Login credentials (email, password, optional turnstileToken)
   * @param remoteIp - Client IP address for audit logging
   * @returns Access token and user data
   * @throws UnauthorizedException if credentials are invalid or account is inactive
   */
  async login(loginDto: LoginDto, remoteIp?: string) {
    // Verify Turnstile token if provided (for failed attempt protection)
    if (loginDto.turnstileToken) {
      try {
        await this.turnstileService.verifyToken(
          loginDto.turnstileToken,
          remoteIp,
        );
      } catch (error) {
        this.logger.warn(`Turnstile verification failed for login attempt from ${remoteIp}`);
        throw new UnauthorizedException('INVALID_CREDENTIALS');
      }
    }

    // Look up user by email
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      this.logger.warn(`Login attempt for non-existent email from ${remoteIp}`);
      throw new UnauthorizedException('INVALID_CREDENTIALS');
    }

    // Check if user has passwordHash (not OAuth user)
    if (!user.passwordHash) {
      this.logger.warn(`Login attempt for OAuth-only user ${user.email} from ${remoteIp}`);
      throw new UnauthorizedException('INVALID_CREDENTIALS');
    }

    // Verify password using bcrypt
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isPasswordValid) {
      this.logger.warn(`Failed login attempt for ${user.email} from ${remoteIp}`);
      throw new UnauthorizedException('INVALID_CREDENTIALS');
    }

    // Check if user account is active
    if (!user.isActive) {
      this.logger.warn(`Login attempt for inactive account ${user.email} from ${remoteIp}`);
      throw new UnauthorizedException('INVALID_CREDENTIALS');
    }

    // Generate JWT token with conditional expiration based on rememberMe
    const payload = { email: user.email, sub: user.id, role: user.role };
    const expiresIn = loginDto.rememberMe ? '7d' : '24h';
    const access_token = this.jwtService.sign(payload, { expiresIn });

    this.logger.log(`Successful login for ${user.email} from ${remoteIp}`);

    // Return access token and user data (excluding sensitive fields)
    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        balance: user.balance,
      },
    };
  }

  async loginWithUser(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        balance: user.balance,
      },
    };
  }

  async register(registerDto: RegisterDto, remoteIp?: string) {
    // Check if Turnstile is enabled
    const isTurnstileEnabled = process.env.TURNSTILE_ENABLED === 'true';
    
    // Verify Turnstile token if enabled
    if (isTurnstileEnabled) {
      if (!registerDto.turnstileToken) {
        throw new BadRequestException('TURNSTILE_TOKEN_REQUIRED');
      }
      
      await this.turnstileService.verifyToken(
        registerDto.turnstileToken,
        remoteIp,
      );
    } else if (registerDto.turnstileToken) {
      // If Turnstile is disabled but token is provided, still verify it
      await this.turnstileService.verifyToken(
        registerDto.turnstileToken,
        remoteIp,
      );
    }

    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    try {
      // Create user (UsersService already checks for duplicates)
      await this.usersService.create({
        email: registerDto.email,
        username: registerDto.username,
        passwordHash: hashedPassword,
      });

      // Return success message (no auto-login)
      return { message: 'REGISTER_SUCCESS' };
    } catch (error) {
      if (error instanceof ConflictException) {
        // Re-throw the original ConflictException with its specific message
        // (EMAIL_ALREADY_EXISTS or USERNAME_ALREADY_EXISTS)
        throw error;
      }
      throw error;
    }
  }

  /**
   * Authenticate user with Google OAuth
   * @param googleUser - Google profile data (googleId, email, name)
   * @returns Access token and user data
   */
  async loginWithGoogle(googleUser: { googleId: string; email: string; name: string }) {
    // Check if user exists by email
    let user = await this.usersService.findByEmail(googleUser.email);

    if (user) {
      // Account linking: Update google_id if not already set
      if (!user.googleId) {
        user = await this.usersService.update(user.id, { googleId: googleUser.googleId });
        this.logger.log(`Linked Google account to existing user ${user.email}`);
      }
    } else {
      // Create new user with Google data
      const username = googleUser.name || googleUser.email.split('@')[0];
      user = await this.usersService.create({
        email: googleUser.email,
        username: username,
        googleId: googleUser.googleId,
        passwordHash: null,
      });
      this.logger.log(`Created new user via Google OAuth: ${user.email}`);
    }

    // Generate JWT token (same as Story 1.4)
    const payload = { email: user.email, sub: user.id, role: user.role };
    const access_token = this.jwtService.sign(payload, { expiresIn: '24h' });

    this.logger.log(`Google OAuth login successful for ${user.email}`);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        balance: user.balance,
      },
    };
  }
}
