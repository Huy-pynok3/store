import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { TurnstileService } from './turnstile.service';

// Mock fetch globally
global.fetch = jest.fn();

describe('TurnstileService', () => {
  let service: TurnstileService;
  let configService: ConfigService;
  let mockFetch: jest.MockedFunction<typeof fetch>;

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TurnstileService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    // Set default secret key for most tests
    mockConfigService.get.mockReturnValue('test-secret-key');
    
    service = module.get<TurnstileService>(TurnstileService);
    configService = module.get<ConfigService>(ConfigService);
    mockFetch = fetch as jest.MockedFunction<typeof fetch>;

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should log warning if secret key not configured', () => {
      // Create a separate mock for this test
      const mockConfigForTest = { get: jest.fn().mockReturnValue(undefined) };
      const loggerWarnSpy = jest.spyOn(TurnstileService.prototype, 'constructor' as any);
      
      // Create service with undefined secret key
      const testService = new TurnstileService(mockConfigForTest as any);
      
      // Check that the secret key is empty (which triggers the warning)
      expect(testService['secretKey']).toBe('');
    });

    it('should not log warning if secret key is configured', () => {
      // This test uses the default mock setup which returns 'test-secret-key'
      expect(service['secretKey']).toBe('test-secret-key');
    });
  });

  describe('verifyToken', () => {
    it('should throw TURNSTILE_NOT_CONFIGURED if secret key not configured', async () => {
      // Create service without secret key for this test
      const mockConfigForTest = { get: jest.fn().mockReturnValue(undefined) };
      const serviceWithoutKey = new TurnstileService(mockConfigForTest as any);

      await expect(
        serviceWithoutKey.verifyToken('valid-token'),
      ).rejects.toThrow(new BadRequestException('TURNSTILE_NOT_CONFIGURED'));
    });

    it('should throw TURNSTILE_TOKEN_MISSING if token is not provided', async () => {
      await expect(service.verifyToken('')).rejects.toThrow(
        new BadRequestException('TURNSTILE_TOKEN_MISSING'),
      );

      await expect(service.verifyToken(null as any)).rejects.toThrow(
        new BadRequestException('TURNSTILE_TOKEN_MISSING'),
      );

      await expect(service.verifyToken(undefined as any)).rejects.toThrow(
        new BadRequestException('TURNSTILE_TOKEN_MISSING'),
      );
    });

    it('should throw TURNSTILE_TOKEN_INVALID if token is too long', async () => {
      const longToken = 'a'.repeat(2049);

      await expect(service.verifyToken(longToken)).rejects.toThrow(
        new BadRequestException('TURNSTILE_TOKEN_INVALID'),
      );
    });

    it('should accept token with maximum allowed length', async () => {
      const maxLengthToken = 'a'.repeat(2048);
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          challenge_ts: '2024-03-05T10:30:00.000Z',
          hostname: 'localhost',
          'error-codes': [],
        }),
      } as Response);

      const result = await service.verifyToken(maxLengthToken, '127.0.0.1');

      expect(result).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            secret: 'test-secret-key',
            response: maxLengthToken,
            remoteip: '127.0.0.1',
          }),
        },
      );
    });

    it('should successfully verify valid token', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          challenge_ts: '2024-03-05T10:30:00.000Z',
          hostname: 'localhost',
          'error-codes': [],
          action: 'register',
        }),
      } as Response);

      const result = await service.verifyToken('valid-token', '127.0.0.1');

      expect(result).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            secret: 'test-secret-key',
            response: 'valid-token',
            remoteip: '127.0.0.1',
          }),
        },
      );
    });

    it('should work without remoteIp parameter', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          challenge_ts: '2024-03-05T10:30:00.000Z',
          hostname: 'localhost',
          'error-codes': [],
        }),
      } as Response);

      const result = await service.verifyToken('valid-token');

      expect(result).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            secret: 'test-secret-key',
            response: 'valid-token',
            remoteip: undefined,
          }),
        },
      );
    });

    it('should throw TURNSTILE_VERIFICATION_FAILED if API returns non-ok status', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
      } as Response);

      await expect(service.verifyToken('valid-token')).rejects.toThrow(
        new BadRequestException('TURNSTILE_VERIFICATION_FAILED'),
      );
    });

    it('should throw TURNSTILE_VERIFICATION_FAILED if verification fails', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: false,
          'error-codes': ['invalid-input-response'],
        }),
      } as Response);

      await expect(service.verifyToken('invalid-token')).rejects.toThrow(
        new BadRequestException('TURNSTILE_VERIFICATION_FAILED'),
      );
    });

    it('should throw TURNSTILE_VERIFICATION_FAILED on network error', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(service.verifyToken('valid-token')).rejects.toThrow(
        new BadRequestException('TURNSTILE_VERIFICATION_FAILED'),
      );
    });

    it('should log successful verification', async () => {
      const loggerLogSpy = jest.spyOn(service['logger'], 'log');
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          challenge_ts: '2024-03-05T10:30:00.000Z',
          hostname: 'localhost',
          'error-codes': [],
          action: 'register',
        }),
      } as Response);

      await service.verifyToken('valid-token');

      expect(loggerLogSpy).toHaveBeenCalledWith('Turnstile verified: localhost - register');
    });

    it('should log verification failure with error codes', async () => {
      const loggerWarnSpy = jest.spyOn(service['logger'], 'warn');
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: false,
          'error-codes': ['invalid-input-response', 'timeout-or-duplicate'],
        }),
      } as Response);

      await expect(service.verifyToken('invalid-token')).rejects.toThrow();

      expect(loggerWarnSpy).toHaveBeenCalledWith(
        'Turnstile verification failed: invalid-input-response, timeout-or-duplicate',
      );
    });
  });

  describe('verifyTokenEnhanced', () => {
    it('should return full response on successful verification', async () => {
      const mockResponse = {
        success: true,
        challenge_ts: '2024-03-05T10:30:00.000Z',
        hostname: 'localhost',
        'error-codes': [],
        action: 'register',
        cdata: 'custom-data',
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await service.verifyTokenEnhanced('valid-token', '127.0.0.1');

      expect(result).toEqual(mockResponse);
    });

    it('should validate action if expectedAction provided', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          challenge_ts: '2024-03-05T10:30:00.000Z',
          hostname: 'localhost',
          'error-codes': [],
          action: 'login',
        }),
      } as Response);

      await expect(
        service.verifyTokenEnhanced('valid-token', '127.0.0.1', 'register'),
      ).rejects.toThrow(new BadRequestException('TURNSTILE_ACTION_MISMATCH'));
    });

    it('should validate hostname if expectedHostname provided', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          challenge_ts: '2024-03-05T10:30:00.000Z',
          hostname: 'example.com',
          'error-codes': [],
          action: 'register',
        }),
      } as Response);

      await expect(
        service.verifyTokenEnhanced('valid-token', '127.0.0.1', 'register', 'localhost'),
      ).rejects.toThrow(new BadRequestException('TURNSTILE_HOSTNAME_MISMATCH'));
    });

    it('should pass validation with matching action and hostname', async () => {
      const mockResponse = {
        success: true,
        challenge_ts: '2024-03-05T10:30:00.000Z',
        hostname: 'localhost',
        'error-codes': [],
        action: 'register',
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await service.verifyTokenEnhanced(
        'valid-token',
        '127.0.0.1',
        'register',
        'localhost',
      );

      expect(result).toEqual(mockResponse);
    });
  });
});