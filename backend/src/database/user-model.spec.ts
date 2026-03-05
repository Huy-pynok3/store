import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { PrismaModule } from './prisma.module';

describe('User Model - Database Schema Tests', () => {
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  afterEach(async () => {
    // Clean up test data after each test
    await prismaService.user.deleteMany({
      where: {
        email: {
          contains: 'test-',
        },
      },
    });
  });

  describe('Email/Password Authentication', () => {
    it('should create user with email and password hash', async () => {
      const user = await prismaService.user.create({
        data: {
          email: 'test-user1@example.com',
          username: 'testuser1',
          passwordHash: '$2b$10$hashedpassword',
          role: 'USER',
        },
      });

      expect(user).toBeDefined();
      expect(user.email).toBe('test-user1@example.com');
      expect(user.username).toBe('testuser1');
      expect(user.passwordHash).toBe('$2b$10$hashedpassword');
      expect(user.googleId).toBeNull();
    });

    it('should enforce email uniqueness', async () => {
      await prismaService.user.create({
        data: {
          email: 'test-duplicate@example.com',
          username: 'testdup1',
          passwordHash: '$2b$10$hashedpassword',
        },
      });

      await expect(
        prismaService.user.create({
          data: {
            email: 'test-duplicate@example.com',
            username: 'testdup2',
            passwordHash: '$2b$10$hashedpassword',
          },
        }),
      ).rejects.toThrow();
    });

    it('should enforce username uniqueness', async () => {
      await prismaService.user.create({
        data: {
          email: 'test-user2@example.com',
          username: 'sameusername',
          passwordHash: '$2b$10$hashedpassword',
        },
      });

      await expect(
        prismaService.user.create({
          data: {
            email: 'test-user3@example.com',
            username: 'sameusername',
            passwordHash: '$2b$10$hashedpassword',
          },
        }),
      ).rejects.toThrow();
    });

    it('should enforce username max length of 20 characters', async () => {
      const longUsername = 'a'.repeat(21);

      await expect(
        prismaService.user.create({
          data: {
            email: 'test-longusername@example.com',
            username: longUsername,
            passwordHash: '$2b$10$hashedpassword',
          },
        }),
      ).rejects.toThrow();
    });

    it('should accept username with exactly 20 characters', async () => {
      const maxUsername = 'a'.repeat(20);

      const user = await prismaService.user.create({
        data: {
          email: 'test-maxusername@example.com',
          username: maxUsername,
          passwordHash: '$2b$10$hashedpassword',
        },
      });

      expect(user.username).toBe(maxUsername);
      expect(user.username.length).toBe(20);
    });
  });

  describe('Google OAuth Authentication', () => {
    it('should create user with Google ID and null password', async () => {
      const user = await prismaService.user.create({
        data: {
          email: 'test-google@example.com',
          username: 'googleuser',
          googleId: 'google-oauth-id-12345',
          passwordHash: null,
        },
      });

      expect(user).toBeDefined();
      expect(user.email).toBe('test-google@example.com');
      expect(user.googleId).toBe('google-oauth-id-12345');
      expect(user.passwordHash).toBeNull();
    });

    it('should enforce Google ID uniqueness', async () => {
      await prismaService.user.create({
        data: {
          email: 'test-google1@example.com',
          username: 'googleuser1',
          googleId: 'same-google-id',
        },
      });

      await expect(
        prismaService.user.create({
          data: {
            email: 'test-google2@example.com',
            username: 'googleuser2',
            googleId: 'same-google-id',
          },
        }),
      ).rejects.toThrow();
    });

    it('should allow null Google ID for multiple users', async () => {
      const user1 = await prismaService.user.create({
        data: {
          email: 'test-email1@example.com',
          username: 'emailuser1',
          passwordHash: '$2b$10$hash1',
          googleId: null,
        },
      });

      const user2 = await prismaService.user.create({
        data: {
          email: 'test-email2@example.com',
          username: 'emailuser2',
          passwordHash: '$2b$10$hash2',
          googleId: null,
        },
      });

      expect(user1.googleId).toBeNull();
      expect(user2.googleId).toBeNull();
    });
  });

  describe('Dual Authentication (Account Linking)', () => {
    it('should support both password and Google ID', async () => {
      const user = await prismaService.user.create({
        data: {
          email: 'test-linked@example.com',
          username: 'linkeduser',
          passwordHash: '$2b$10$hashedpassword',
          googleId: 'google-linked-id',
        },
      });

      expect(user.passwordHash).toBe('$2b$10$hashedpassword');
      expect(user.googleId).toBe('google-linked-id');
    });

    it('should allow updating user to add Google ID', async () => {
      const user = await prismaService.user.create({
        data: {
          email: 'test-update@example.com',
          username: 'updateuser',
          passwordHash: '$2b$10$hashedpassword',
        },
      });

      const updated = await prismaService.user.update({
        where: { id: user.id },
        data: { googleId: 'newly-linked-google-id' },
      });

      expect(updated.passwordHash).toBe('$2b$10$hashedpassword');
      expect(updated.googleId).toBe('newly-linked-google-id');
    });
  });

  describe('Nullable Fields', () => {
    it('should allow null passwordHash', async () => {
      const user = await prismaService.user.create({
        data: {
          email: 'test-nullpass@example.com',
          username: 'nullpassuser',
          passwordHash: null,
          googleId: 'google-id-123',
        },
      });

      expect(user.passwordHash).toBeNull();
    });

    it('should allow null googleId', async () => {
      const user = await prismaService.user.create({
        data: {
          email: 'test-nullgoogle@example.com',
          username: 'nullgoogleuser',
          passwordHash: '$2b$10$hashedpassword',
          googleId: null,
        },
      });

      expect(user.googleId).toBeNull();
    });
  });

  describe('Timestamps', () => {
    it('should auto-generate createdAt timestamp', async () => {
      const beforeCreate = new Date();

      const user = await prismaService.user.create({
        data: {
          email: 'test-timestamp@example.com',
          username: 'timestampuser',
          passwordHash: '$2b$10$hashedpassword',
        },
      });

      const afterCreate = new Date();

      expect(user.createdAt).toBeDefined();
      expect(user.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
      expect(user.createdAt.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
    });

    it('should auto-update updatedAt timestamp', async () => {
      const user = await prismaService.user.create({
        data: {
          email: 'test-updatetime@example.com',
          username: 'updatetimeuser',
          passwordHash: '$2b$10$hashedpassword',
        },
      });

      const originalUpdatedAt = user.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 100));

      const updated = await prismaService.user.update({
        where: { id: user.id },
        data: { username: 'updatedusername' },
      });

      expect(updated.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('Default Values', () => {
    it('should set default role to USER', async () => {
      const user = await prismaService.user.create({
        data: {
          email: 'test-defaultrole@example.com',
          username: 'defaultroleuser',
          passwordHash: '$2b$10$hashedpassword',
        },
      });

      expect(user.role).toBe('USER');
    });

    it('should set default balance to 0', async () => {
      const user = await prismaService.user.create({
        data: {
          email: 'test-balance@example.com',
          username: 'balanceuser',
          passwordHash: '$2b$10$hashedpassword',
        },
      });

      expect(user.balance).toBe(0);
    });

    it('should set default isActive to true', async () => {
      const user = await prismaService.user.create({
        data: {
          email: 'test-active@example.com',
          username: 'activeuser',
          passwordHash: '$2b$10$hashedpassword',
        },
      });

      expect(user.isActive).toBe(true);
    });
  });
});
