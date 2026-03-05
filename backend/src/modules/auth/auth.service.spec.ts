import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { TurnstileService } from './services/turnstile.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    update: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockTurnstileService = {
    verifyToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: TurnstileService,
          useValue: mockTurnstileService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('register', () => {
    const validRegisterDto: RegisterDto = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      passwordConfirm: 'password123',
      turnstileToken: 'valid-turnstile-token',
    };

    it('should create user and return success message', async () => {
      mockTurnstileService.verifyToken.mockResolvedValue(true);
      mockUsersService.create.mockResolvedValue({
        id: '1',
        email: validRegisterDto.email,
        username: validRegisterDto.username,
        passwordHash: 'hashed_password',
      });

      const result = await service.register(validRegisterDto, '127.0.0.1');

      expect(result).toEqual({ message: 'REGISTER_SUCCESS' });
      expect(mockTurnstileService.verifyToken).toHaveBeenCalledWith(
        validRegisterDto.turnstileToken,
        '127.0.0.1',
      );
      expect(mockUsersService.create).toHaveBeenCalledWith({
        email: validRegisterDto.email,
        username: validRegisterDto.username,
        passwordHash: expect.any(String),
      });
    });

    it('should hash password with bcrypt before storing', async () => {
      const bcryptHashSpy = jest.spyOn(bcrypt, 'hash');
      mockTurnstileService.verifyToken.mockResolvedValue(true);
      mockUsersService.create.mockResolvedValue({
        id: '1',
        email: validRegisterDto.email,
        username: validRegisterDto.username,
        passwordHash: 'hashed_password',
      });

      await service.register(validRegisterDto, '127.0.0.1');

      expect(bcryptHashSpy).toHaveBeenCalledWith(validRegisterDto.password, 10);
    });

    it('should not auto-login user after registration', async () => {
      mockTurnstileService.verifyToken.mockResolvedValue(true);
      mockUsersService.create.mockResolvedValue({
        id: '1',
        email: validRegisterDto.email,
        username: validRegisterDto.username,
        passwordHash: 'hashed_password',
      });

      const result = await service.register(validRegisterDto, '127.0.0.1');

      expect(result).not.toHaveProperty('access_token');
      expect(result).not.toHaveProperty('user');
      expect(result).toEqual({ message: 'REGISTER_SUCCESS' });
    });

    it('should preserve original ConflictException message for duplicate email', async () => {
      mockTurnstileService.verifyToken.mockResolvedValue(true);
      const originalError = new ConflictException('EMAIL_ALREADY_EXISTS');
      mockUsersService.create.mockRejectedValue(originalError);

      await expect(service.register(validRegisterDto, '127.0.0.1')).rejects.toThrow(
        originalError,
      );
    });

    it('should preserve original ConflictException message for duplicate username', async () => {
      mockTurnstileService.verifyToken.mockResolvedValue(true);
      const originalError = new ConflictException('USERNAME_ALREADY_EXISTS');
      mockUsersService.create.mockRejectedValue(originalError);

      await expect(service.register(validRegisterDto, '127.0.0.1')).rejects.toThrow(
        originalError,
      );
    });

    it('should pass email, username, and passwordHash to UsersService', async () => {
      mockTurnstileService.verifyToken.mockResolvedValue(true);
      mockUsersService.create.mockResolvedValue({
        id: '1',
        email: validRegisterDto.email,
        username: validRegisterDto.username,
        passwordHash: 'hashed_password',
      });

      await service.register(validRegisterDto, '127.0.0.1');

      const createCall = mockUsersService.create.mock.calls[0][0];
      expect(createCall).toHaveProperty('email', validRegisterDto.email);
      expect(createCall).toHaveProperty('username', validRegisterDto.username);
      expect(createCall).toHaveProperty('passwordHash');
      expect(createCall.passwordHash).not.toBe(validRegisterDto.password);
    });

    it('should not pass passwordConfirm to UsersService', async () => {
      mockTurnstileService.verifyToken.mockResolvedValue(true);
      mockUsersService.create.mockResolvedValue({
        id: '1',
        email: validRegisterDto.email,
        username: validRegisterDto.username,
        passwordHash: 'hashed_password',
      });

      await service.register(validRegisterDto, '127.0.0.1');

      const createCall = mockUsersService.create.mock.calls[0][0];
      expect(createCall).not.toHaveProperty('passwordConfirm');
    });

    it('should rethrow non-ConflictException errors', async () => {
      mockTurnstileService.verifyToken.mockResolvedValue(true);
      const genericError = new Error('Database connection failed');
      mockUsersService.create.mockRejectedValue(genericError);

      await expect(service.register(validRegisterDto, '127.0.0.1')).rejects.toThrow(
        genericError,
      );
    });

    it('should work without Turnstile token (log warning)', async () => {
      const loggerWarnSpy = jest.spyOn(service['logger'], 'warn');
      const dtoWithoutToken = { ...validRegisterDto };
      delete dtoWithoutToken.turnstileToken;

      mockUsersService.create.mockResolvedValue({
        id: '1',
        email: validRegisterDto.email,
        username: validRegisterDto.username,
        passwordHash: 'hashed_password',
      });

      const result = await service.register(dtoWithoutToken, '127.0.0.1');

      expect(result).toEqual({ message: 'REGISTER_SUCCESS' });
      expect(loggerWarnSpy).toHaveBeenCalledWith('Registration without Turnstile token');
      expect(mockTurnstileService.verifyToken).not.toHaveBeenCalled();
    });

    it('should pass remoteIp to Turnstile verification', async () => {
      mockTurnstileService.verifyToken.mockResolvedValue(true);
      mockUsersService.create.mockResolvedValue({
        id: '1',
        email: validRegisterDto.email,
        username: validRegisterDto.username,
        passwordHash: 'hashed_password',
      });

      await service.register(validRegisterDto, '192.168.1.1');

      expect(mockTurnstileService.verifyToken).toHaveBeenCalledWith(
        validRegisterDto.turnstileToken,
        '192.168.1.1',
      );
    });

    it('should work without remoteIp parameter', async () => {
      mockTurnstileService.verifyToken.mockResolvedValue(true);
      mockUsersService.create.mockResolvedValue({
        id: '1',
        email: validRegisterDto.email,
        username: validRegisterDto.username,
        passwordHash: 'hashed_password',
      });

      await service.register(validRegisterDto);

      expect(mockTurnstileService.verifyToken).toHaveBeenCalledWith(
        validRegisterDto.turnstileToken,
        undefined,
      );
    });
  });

  describe('login', () => {
    const validLoginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      username: 'testuser',
      passwordHash: 'hashed_password',
      role: 'USER',
      isActive: true,
      balance: 0,
    };

    it('should login successfully with valid credentials', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.login(validLoginDto, '127.0.0.1');

      expect(result).toEqual({
        access_token: 'jwt-token',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          username: mockUser.username,
          role: mockUser.role,
          balance: mockUser.balance,
        },
      });
    });

    it('should throw INVALID_CREDENTIALS when user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(service.login(validLoginDto, '127.0.0.1')).rejects.toThrow(
        new UnauthorizedException('INVALID_CREDENTIALS'),
      );
    });

    it('should throw INVALID_CREDENTIALS when password is incorrect', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(service.login(validLoginDto, '127.0.0.1')).rejects.toThrow(
        new UnauthorizedException('INVALID_CREDENTIALS'),
      );
    });

    it('should throw INVALID_CREDENTIALS when user has no passwordHash (OAuth user)', async () => {
      const oauthUser = { ...mockUser, passwordHash: null };
      mockUsersService.findByEmail.mockResolvedValue(oauthUser);

      await expect(service.login(validLoginDto, '127.0.0.1')).rejects.toThrow(
        new UnauthorizedException('INVALID_CREDENTIALS'),
      );
    });

    it('should throw INVALID_CREDENTIALS when user account is inactive', async () => {
      const inactiveUser = { ...mockUser, isActive: false };
      mockUsersService.findByEmail.mockResolvedValue(inactiveUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      await expect(service.login(validLoginDto, '127.0.0.1')).rejects.toThrow(
        new UnauthorizedException('INVALID_CREDENTIALS'),
      );
    });

    it('should generate JWT with correct payload and 24h expiration', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      mockJwtService.sign.mockReturnValue('jwt-token');

      await service.login(validLoginDto, '127.0.0.1');

      expect(mockJwtService.sign).toHaveBeenCalledWith(
        {
          email: mockUser.email,
          sub: mockUser.id,
          role: mockUser.role,
        },
        { expiresIn: '24h' },
      );
    });

    it('should exclude sensitive fields from user response', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.login(validLoginDto, '127.0.0.1');

      expect(result.user).not.toHaveProperty('passwordHash');
      expect(result.user).not.toHaveProperty('twoFactorSecret');
    });

    it('should use bcrypt.compare for password verification', async () => {
      const bcryptCompareSpy = jest.spyOn(bcrypt, 'compare');
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      bcryptCompareSpy.mockResolvedValue(true as never);
      mockJwtService.sign.mockReturnValue('jwt-token');

      await service.login(validLoginDto, '127.0.0.1');

      expect(bcryptCompareSpy).toHaveBeenCalledWith(
        validLoginDto.password,
        mockUser.passwordHash,
      );
    });

    it('should verify Turnstile token when provided', async () => {
      const loginDtoWithToken = { ...validLoginDto, turnstileToken: 'valid-token' };
      mockTurnstileService.verifyToken.mockResolvedValue(true);
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      mockJwtService.sign.mockReturnValue('jwt-token');

      await service.login(loginDtoWithToken, '127.0.0.1');

      expect(mockTurnstileService.verifyToken).toHaveBeenCalledWith(
        'valid-token',
        '127.0.0.1',
      );
    });

    it('should throw INVALID_CREDENTIALS when Turnstile verification fails', async () => {
      const loginDtoWithToken = { ...validLoginDto, turnstileToken: 'invalid-token' };
      mockTurnstileService.verifyToken.mockRejectedValue(new Error('Turnstile verification failed'));

      await expect(service.login(loginDtoWithToken, '127.0.0.1')).rejects.toThrow(
        new UnauthorizedException('INVALID_CREDENTIALS'),
      );
    });

    it('should work without Turnstile token (optional)', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.login(validLoginDto, '127.0.0.1');

      expect(mockTurnstileService.verifyToken).not.toHaveBeenCalled();
      expect(result).toHaveProperty('access_token');
    });

    it('should generate JWT with 7d expiration when rememberMe is true', async () => {
      const loginDtoWithRememberMe = { ...validLoginDto, rememberMe: true };
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      mockJwtService.sign.mockReturnValue('jwt-token');

      await service.login(loginDtoWithRememberMe, '127.0.0.1');

      expect(mockJwtService.sign).toHaveBeenCalledWith(
        {
          email: mockUser.email,
          sub: mockUser.id,
          role: mockUser.role,
        },
        { expiresIn: '7d' },
      );
    });

    it('should generate JWT with 24h expiration when rememberMe is false', async () => {
      const loginDtoWithRememberMe = { ...validLoginDto, rememberMe: false };
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      mockJwtService.sign.mockReturnValue('jwt-token');

      await service.login(loginDtoWithRememberMe, '127.0.0.1');

      expect(mockJwtService.sign).toHaveBeenCalledWith(
        {
          email: mockUser.email,
          sub: mockUser.id,
          role: mockUser.role,
        },
        { expiresIn: '24h' },
      );
    });

    it('should default to 24h expiration when rememberMe is undefined', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      mockJwtService.sign.mockReturnValue('jwt-token');

      await service.login(validLoginDto, '127.0.0.1');

      expect(mockJwtService.sign).toHaveBeenCalledWith(
        {
          email: mockUser.email,
          sub: mockUser.id,
          role: mockUser.role,
        },
        { expiresIn: '24h' },
      );
    });

    it('should maintain consistent JWT payload regardless of rememberMe value', async () => {
      const loginDtoWithRememberMe = { ...validLoginDto, rememberMe: true };
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      mockJwtService.sign.mockReturnValue('jwt-token');

      await service.login(loginDtoWithRememberMe, '127.0.0.1');

      expect(mockJwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          email: mockUser.email,
          sub: mockUser.id,
          role: mockUser.role,
        }),
        expect.any(Object),
      );
    });
  });

  describe('loginWithGoogle', () => {
    it('should link google_id to existing user when email matches', async () => {
      const googleUser = {
        googleId: 'google-123',
        email: 'existing@example.com',
        name: 'John Doe',
      };

      const existingUser = {
        id: 'user-123',
        email: 'existing@example.com',
        username: 'existinguser',
        googleId: null,
        passwordHash: 'hashed-password',
        role: 'USER',
        balance: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedUser = { ...existingUser, googleId: 'google-123' };

      mockUsersService.findByEmail.mockResolvedValue(existingUser);
      mockUsersService.update.mockResolvedValue(updatedUser);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.loginWithGoogle(googleUser);

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith('existing@example.com');
      expect(mockUsersService.update).toHaveBeenCalledWith('user-123', { googleId: 'google-123' });
      expect(result.access_token).toBeDefined();
      expect(result.user.email).toBe('existing@example.com');
    });

    it('should not update google_id if already linked', async () => {
      const googleUser = {
        googleId: 'google-123',
        email: 'linked@example.com',
        name: 'Jane Smith',
      };

      const linkedUser = {
        id: 'user-456',
        email: 'linked@example.com',
        username: 'linkeduser',
        googleId: 'google-123',
        passwordHash: null,
        role: 'USER',
        balance: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.findByEmail.mockResolvedValue(linkedUser);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.loginWithGoogle(googleUser);

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith('linked@example.com');
      expect(mockUsersService.update).not.toHaveBeenCalled();
      expect(result.access_token).toBeDefined();
    });

    it('should create new user when email does not exist', async () => {
      const googleUser = {
        googleId: 'google-789',
        email: 'newuser@example.com',
        name: 'Bob Johnson',
      };

      const newUser = {
        id: 'user-789',
        email: 'newuser@example.com',
        username: 'Bob Johnson',
        googleId: 'google-789',
        passwordHash: null,
        role: 'USER',
        balance: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(newUser);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.loginWithGoogle(googleUser);

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith('newuser@example.com');
      expect(mockUsersService.create).toHaveBeenCalledWith({
        email: 'newuser@example.com',
        username: 'Bob Johnson',
        googleId: 'google-789',
        passwordHash: null,
      });
      expect(result.access_token).toBeDefined();
      expect(result.user.email).toBe('newuser@example.com');
    });

    it('should generate username from displayName if provided', async () => {
      const googleUser = {
        googleId: 'google-999',
        email: 'test@example.com',
        name: 'Alice Wonder',
      };

      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue({
        id: 'user-999',
        email: 'test@example.com',
        username: 'Alice Wonder',
        googleId: 'google-999',
        passwordHash: null,
        role: 'USER',
        balance: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      mockJwtService.sign.mockReturnValue('jwt-token');

      await service.loginWithGoogle(googleUser);

      expect(mockUsersService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          username: 'Alice Wonder',
        }),
      );
    });

    it('should generate username from email if displayName missing', async () => {
      const googleUser = {
        googleId: 'google-111',
        email: 'noname@example.com',
        name: '',
      };

      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue({
        id: 'user-111',
        email: 'noname@example.com',
        username: 'noname',
        googleId: 'google-111',
        passwordHash: null,
        role: 'USER',
        balance: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      mockJwtService.sign.mockReturnValue('jwt-token');

      await service.loginWithGoogle(googleUser);

      expect(mockUsersService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          username: 'noname',
        }),
      );
    });

    it('should generate JWT token with correct payload for OAuth user', async () => {
      const googleUser = {
        googleId: 'google-payload',
        email: 'payload@example.com',
        name: 'Payload User',
      };

      const user = {
        id: 'user-payload',
        email: 'payload@example.com',
        username: 'payloaduser',
        googleId: 'google-payload',
        passwordHash: null,
        role: 'USER',
        balance: 100,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.findByEmail.mockResolvedValue(user);
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await service.loginWithGoogle(googleUser);

      expect(mockJwtService.sign).toHaveBeenCalledWith(
        { email: 'payload@example.com', sub: 'user-payload', role: 'USER' },
        { expiresIn: '24h' },
      );
      expect(result.access_token).toBe('mock-jwt-token');
    });

    it('should set JWT token expiration to 24h for OAuth users', async () => {
      const googleUser = {
        googleId: 'google-expiry',
        email: 'expiry@example.com',
        name: 'Expiry User',
      };

      const user = {
        id: 'user-expiry',
        email: 'expiry@example.com',
        username: 'expiryuser',
        googleId: 'google-expiry',
        passwordHash: null,
        role: 'USER',
        balance: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.findByEmail.mockResolvedValue(user);
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      await service.loginWithGoogle(googleUser);

      expect(mockJwtService.sign).toHaveBeenCalledWith(
        expect.any(Object),
        { expiresIn: '24h' },
      );
    });

    it('should log OAuth login attempts', async () => {
      const googleUser = {
        googleId: 'google-log',
        email: 'log@example.com',
        name: 'Log User',
      };

      const user = {
        id: 'user-log',
        email: 'log@example.com',
        username: 'loguser',
        googleId: 'google-log',
        passwordHash: null,
        role: 'USER',
        balance: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUsersService.findByEmail.mockResolvedValue(user);
      mockJwtService.sign.mockReturnValue('jwt-token');
      const loggerSpy = jest.spyOn(service['logger'], 'log');

      await service.loginWithGoogle(googleUser);

      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('Google OAuth login'),
      );
    });
  });
});
