import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { GoogleOAuthStrategy } from './google-oauth.strategy';
import { Profile } from 'passport-google-oauth20';

describe('GoogleOAuthStrategy', () => {
  let strategy: GoogleOAuthStrategy;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleOAuthStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config = {
                GOOGLE_CLIENT_ID: 'test-client-id',
                GOOGLE_CLIENT_SECRET: 'test-client-secret',
                GOOGLE_CALLBACK_URL: 'http://localhost:3001/api/auth/google/callback',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    strategy = module.get<GoogleOAuthStrategy>(GoogleOAuthStrategy);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should validate Google profile successfully', async () => {
    const mockProfile: Partial<Profile> = {
      id: 'google-123',
      displayName: 'John Doe',
      emails: [{ value: 'john@example.com', verified: true }],
    };

    const done = jest.fn();

    await strategy.validate('access-token', 'refresh-token', mockProfile as Profile, done);

    expect(done).toHaveBeenCalledWith(null, {
      googleId: 'google-123',
      email: 'john@example.com',
      name: 'John Doe',
    });
  });

  it('should extract email from profile.emails[0].value', async () => {
    const mockProfile: Partial<Profile> = {
      id: 'google-456',
      displayName: 'Jane Smith',
      emails: [{ value: 'jane@example.com', verified: true }],
    };

    const done = jest.fn();

    await strategy.validate('access-token', 'refresh-token', mockProfile as Profile, done);

    expect(done).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        email: 'jane@example.com',
      }),
    );
  });

  it('should extract googleId from profile.id', async () => {
    const mockProfile: Partial<Profile> = {
      id: 'google-789',
      displayName: 'Bob Johnson',
      emails: [{ value: 'bob@example.com', verified: true }],
    };

    const done = jest.fn();

    await strategy.validate('access-token', 'refresh-token', mockProfile as Profile, done);

    expect(done).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        googleId: 'google-789',
      }),
    );
  });

  it('should extract name from profile.displayName', async () => {
    const mockProfile: Partial<Profile> = {
      id: 'google-999',
      displayName: 'Alice Wonder',
      emails: [{ value: 'alice@example.com', verified: true }],
    };

    const done = jest.fn();

    await strategy.validate('access-token', 'refresh-token', mockProfile as Profile, done);

    expect(done).toHaveBeenCalledWith(
      null,
      expect.objectContaining({
        name: 'Alice Wonder',
      }),
    );
  });

  it('should return normalized user object', async () => {
    const mockProfile: Partial<Profile> = {
      id: 'google-normalized',
      displayName: 'Test User',
      emails: [{ value: 'test@example.com', verified: true }],
    };

    const done = jest.fn();

    await strategy.validate('access-token', 'refresh-token', mockProfile as Profile, done);

    const expectedUser = {
      googleId: 'google-normalized',
      email: 'test@example.com',
      name: 'Test User',
    };

    expect(done).toHaveBeenCalledWith(null, expectedUser);
  });
});
