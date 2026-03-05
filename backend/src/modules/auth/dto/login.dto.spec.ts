import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { LoginDto } from './login.dto';

describe('LoginDto', () => {
  describe('email validation', () => {
    it('should pass with valid email', async () => {
      const dto = plainToClass(LoginDto, {
        email: 'test@example.com',
        password: 'password123',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail with invalid email format', async () => {
      const dto = plainToClass(LoginDto, {
        email: 'invalid-email',
        password: 'password123',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('email');
      expect(errors[0].constraints).toHaveProperty('isEmail');
    });

    it('should fail with empty email', async () => {
      const dto = plainToClass(LoginDto, {
        email: '',
        password: 'password123',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('email');
    });

    it('should fail with missing email', async () => {
      const dto = plainToClass(LoginDto, {
        password: 'password123',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('email');
    });
  });

  describe('password validation', () => {
    it('should pass with valid password', async () => {
      const dto = plainToClass(LoginDto, {
        email: 'test@example.com',
        password: 'password123',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail with empty password', async () => {
      const dto = plainToClass(LoginDto, {
        email: 'test@example.com',
        password: '',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('password');
      expect(errors[0].constraints).toHaveProperty('minLength');
    });

    it('should fail with missing password', async () => {
      const dto = plainToClass(LoginDto, {
        email: 'test@example.com',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('password');
    });
  });

  describe('turnstileToken validation', () => {
    it('should pass with valid turnstileToken', async () => {
      const dto = plainToClass(LoginDto, {
        email: 'test@example.com',
        password: 'password123',
        turnstileToken: 'valid-token',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass without turnstileToken (optional field)', async () => {
      const dto = plainToClass(LoginDto, {
        email: 'test@example.com',
        password: 'password123',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail with non-string turnstileToken', async () => {
      const dto = plainToClass(LoginDto, {
        email: 'test@example.com',
        password: 'password123',
        turnstileToken: 123,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('turnstileToken');
      expect(errors[0].constraints).toHaveProperty('isString');
    });
  });
});

  describe('rememberMe validation', () => {
    it('should pass with rememberMe=true', async () => {
      const dto = plainToClass(LoginDto, {
        email: 'test@example.com',
        password: 'password123',
        rememberMe: true,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass with rememberMe=false', async () => {
      const dto = plainToClass(LoginDto, {
        email: 'test@example.com',
        password: 'password123',
        rememberMe: false,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass without rememberMe (optional field)', async () => {
      const dto = plainToClass(LoginDto, {
        email: 'test@example.com',
        password: 'password123',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail with non-boolean rememberMe', async () => {
      const dto = plainToClass(LoginDto, {
        email: 'test@example.com',
        password: 'password123',
        rememberMe: 'true',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('rememberMe');
      expect(errors[0].constraints).toHaveProperty('isBoolean');
    });
  });
