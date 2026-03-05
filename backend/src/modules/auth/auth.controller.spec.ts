import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Request as ExpressRequest } from 'express';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    loginWithGoogle: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);

    jest.clearAllMocks();
  });

  describe('register', () => {
    const validRegisterDto: RegisterDto = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      passwordConfirm: 'password123',
      turnstileToken: 'valid-token',
    };

    it('should call authService.register with DTO and extracted IP', async () => {
      const mockRequest = {
        headers: {},
        socket: { remoteAddress: '127.0.0.1' },
      } as ExpressRequest;

      mockAuthService.register.mockResolvedValue({ message: 'REGISTER_SUCCESS' });

      await controller.register(validRegisterDto, mockRequest);

      expect(mockAuthService.register).toHaveBeenCalledWith(
        validRegisterDto,
        '127.0.0.1',
      );
    });

    it('should extract IP from cf-connecting-ip header (Cloudflare)', async () => {
      const mockRequest = {
        headers: {
          'cf-connecting-ip': '203.0.113.1',
          'x-forwarded-for': '198.51.100.1',
          'x-real-ip': '192.0.2.1',
        },
        socket: { remoteAddress: '127.0.0.1' },
      } as unknown as ExpressRequest;

      mockAuthService.register.mockResolvedValue({ message: 'REGISTER_SUCCESS' });

      await controller.register(validRegisterDto, mockRequest);

      expect(mockAuthService.register).toHaveBeenCalledWith(
        validRegisterDto,
        '203.0.113.1', // Cloudflare header takes priority
      );
    });

    it('should extract IP from x-forwarded-for header (Proxy)', async () => {
      const mockRequest = {
        headers: {
          'x-forwarded-for': '198.51.100.1, 203.0.113.1',
          'x-real-ip': '192.0.2.1',
        },
        socket: { remoteAddress: '127.0.0.1' },
      } as unknown as ExpressRequest;

      mockAuthService.register.mockResolvedValue({ message: 'REGISTER_SUCCESS' });

      await controller.register(validRegisterDto, mockRequest);

      expect(mockAuthService.register).toHaveBeenCalledWith(
        validRegisterDto,
        '198.51.100.1', // First IP in x-forwarded-for
      );
    });

    it('should extract IP from x-real-ip header (Nginx)', async () => {
      const mockRequest = {
        headers: {
          'x-real-ip': '192.0.2.1',
        },
        socket: { remoteAddress: '127.0.0.1' },
      } as unknown as ExpressRequest;

      mockAuthService.register.mockResolvedValue({ message: 'REGISTER_SUCCESS' });

      await controller.register(validRegisterDto, mockRequest);

      expect(mockAuthService.register).toHaveBeenCalledWith(
        validRegisterDto,
        '192.0.2.1',
      );
    });

    it('should fallback to socket.remoteAddress if no headers', async () => {
      const mockRequest = {
        headers: {},
        socket: { remoteAddress: '127.0.0.1' },
      } as ExpressRequest;

      mockAuthService.register.mockResolvedValue({ message: 'REGISTER_SUCCESS' });

      await controller.register(validRegisterDto, mockRequest);

      expect(mockAuthService.register).toHaveBeenCalledWith(
        validRegisterDto,
        '127.0.0.1',
      );
    });

    it('should return "unknown" if no IP available', async () => {
      const mockRequest = {
        headers: {},
        socket: {},
      } as ExpressRequest;

      mockAuthService.register.mockResolvedValue({ message: 'REGISTER_SUCCESS' });

      await controller.register(validRegisterDto, mockRequest);

      expect(mockAuthService.register).toHaveBeenCalledWith(
        validRegisterDto,
        'unknown',
      );
    });

    it('should return registration result from service', async () => {
      const mockRequest = {
        headers: {},
        socket: { remoteAddress: '127.0.0.1' },
      } as ExpressRequest;

      const expectedResult = { message: 'REGISTER_SUCCESS' };
      mockAuthService.register.mockResolvedValue(expectedResult);

      const result = await controller.register(validRegisterDto, mockRequest);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('login', () => {
    const validLoginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should call authService.login with LoginDto and IP address', async () => {
      const mockRequest = {
        headers: {},
        socket: { remoteAddress: '127.0.0.1' },
      } as ExpressRequest;

      const expectedResult = {
        access_token: 'jwt-token',
        user: {
          id: '1',
          email: 'test@example.com',
          username: 'testuser',
          role: 'USER',
          balance: 0,
        },
      };

      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(validLoginDto, mockRequest);

      expect(mockAuthService.login).toHaveBeenCalledWith(validLoginDto, '127.0.0.1');
      expect(result).toEqual(expectedResult);
    });

    it('should extract IP address from Cloudflare header for audit logging', async () => {
      const mockRequest = {
        headers: {
          'cf-connecting-ip': '203.0.113.1',
        },
        socket: { remoteAddress: '127.0.0.1' },
      } as unknown as ExpressRequest;

      const expectedResult = {
        access_token: 'jwt-token',
        user: {
          id: '1',
          email: 'test@example.com',
          username: 'testuser',
          role: 'USER',
          balance: 0,
        },
      };

      mockAuthService.login.mockResolvedValue(expectedResult);

      await controller.login(validLoginDto, mockRequest);

      expect(mockAuthService.login).toHaveBeenCalledWith(validLoginDto, '203.0.113.1');
    });

    it('should return login result from service', async () => {
      const mockRequest = {
        headers: {},
        socket: { remoteAddress: '127.0.0.1' },
      } as ExpressRequest;

      const expectedResult = {
        access_token: 'jwt-token',
        user: {
          id: '1',
          email: 'test@example.com',
          username: 'testuser',
          role: 'USER',
          balance: 0,
        },
      };

      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(validLoginDto, mockRequest);

      expect(result).toEqual(expectedResult);
    });

    it('should pass rememberMe=true to service when provided', async () => {
      const loginDtoWithRememberMe = { ...validLoginDto, rememberMe: true };
      const mockRequest = {
        headers: {},
        socket: { remoteAddress: '127.0.0.1' },
      } as ExpressRequest;

      const expectedResult = {
        access_token: 'jwt-token-7d',
        user: {
          id: '1',
          email: 'test@example.com',
          username: 'testuser',
          role: 'USER',
          balance: 0,
        },
      };

      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(loginDtoWithRememberMe, mockRequest);

      expect(mockAuthService.login).toHaveBeenCalledWith(loginDtoWithRememberMe, '127.0.0.1');
      expect(result).toEqual(expectedResult);
    });

    it('should pass rememberMe=false to service when provided', async () => {
      const loginDtoWithRememberMe = { ...validLoginDto, rememberMe: false };
      const mockRequest = {
        headers: {},
        socket: { remoteAddress: '127.0.0.1' },
      } as ExpressRequest;

      const expectedResult = {
        access_token: 'jwt-token-24h',
        user: {
          id: '1',
          email: 'test@example.com',
          username: 'testuser',
          role: 'USER',
          balance: 0,
        },
      };

      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(loginDtoWithRememberMe, mockRequest);

      expect(mockAuthService.login).toHaveBeenCalledWith(loginDtoWithRememberMe, '127.0.0.1');
      expect(result).toEqual(expectedResult);
    });
  });

  describe('googleAuth', () => {
    it('should trigger Google OAuth flow', async () => {
      const mockRequest = {} as ExpressRequest;

      // Guard redirects automatically, so this just needs to be callable
      const result = await controller.googleAuth(mockRequest);

      expect(result).toBeUndefined();
    });
  });

  describe('googleAuthRedirect', () => {
    it('should process successful OAuth and redirect with token', async () => {
      const mockRequest = {
        user: {
          googleId: 'google-123',
          email: 'test@example.com',
          name: 'Test User',
        },
      } as any;

      const mockResponse = {
        redirect: jest.fn(),
      } as any;

      const expectedResult = {
        access_token: 'jwt-token',
        user: {
          id: 'user-123',
          email: 'test@example.com',
          username: 'testuser',
          role: 'USER',
          balance: 0,
        },
      };

      mockAuthService.loginWithGoogle.mockResolvedValue(expectedResult);

      await controller.googleAuthRedirect(mockRequest, mockResponse);

      expect(mockAuthService.loginWithGoogle).toHaveBeenCalledWith(mockRequest.user);
      expect(mockResponse.redirect).toHaveBeenCalledWith(
        expect.stringContaining('token=jwt-token'),
      );
    });

    it('should extract user from req.user correctly', async () => {
      const mockRequest = {
        user: {
          googleId: 'google-456',
          email: 'user@example.com',
          name: 'Another User',
        },
      } as any;

      const mockResponse = {
        redirect: jest.fn(),
      } as any;

      mockAuthService.loginWithGoogle.mockResolvedValue({
        access_token: 'jwt-token',
        user: { id: 'user-456', email: 'user@example.com', username: 'anotheruser', role: 'USER', balance: 0 },
      });

      await controller.googleAuthRedirect(mockRequest, mockResponse);

      expect(mockAuthService.loginWithGoogle).toHaveBeenCalledWith({
        googleId: 'google-456',
        email: 'user@example.com',
        name: 'Another User',
      });
    });

    it('should handle OAuth failure and redirect with error', async () => {
      const mockRequest = {
        user: {
          googleId: 'google-error',
          email: 'error@example.com',
          name: 'Error User',
        },
      } as any;

      const mockResponse = {
        redirect: jest.fn(),
      } as any;

      mockAuthService.loginWithGoogle.mockRejectedValue(new Error('OAuth failed'));

      await controller.googleAuthRedirect(mockRequest, mockResponse);

      expect(mockResponse.redirect).toHaveBeenCalledWith(
        expect.stringContaining('error=GOOGLE_LOGIN_FAILED'),
      );
    });

    it('should redirect to frontend URL from environment', async () => {
      const mockRequest = {
        user: {
          googleId: 'google-789',
          email: 'redirect@example.com',
          name: 'Redirect User',
        },
      } as any;

      const mockResponse = {
        redirect: jest.fn(),
      } as any;

      mockAuthService.loginWithGoogle.mockResolvedValue({
        access_token: 'jwt-token',
        user: { id: 'user-789', email: 'redirect@example.com', username: 'redirectuser', role: 'USER', balance: 0 },
      });

      await controller.googleAuthRedirect(mockRequest, mockResponse);

      expect(mockResponse.redirect).toHaveBeenCalledWith(
        expect.stringContaining('http://localhost:3000'),
      );
    });

    it('should log error when OAuth fails', async () => {
      const mockRequest = {
        user: {
          googleId: 'google-log',
          email: 'log@example.com',
          name: 'Log User',
        },
      } as any;

      const mockResponse = {
        redirect: jest.fn(),
      } as any;

      const loggerSpy = jest.spyOn(controller['logger'], 'error');
      mockAuthService.loginWithGoogle.mockRejectedValue(new Error('Database error'));

      await controller.googleAuthRedirect(mockRequest, mockResponse);

      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('Google OAuth failed'),
      );
    });
  });
});
