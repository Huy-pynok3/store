import { validate } from 'class-validator';
import { RegisterDto } from './register.dto';

describe('RegisterDto', () => {
  it('should pass validation with valid data', async () => {
    const dto = new RegisterDto();
    dto.email = 'test@example.com';
    dto.username = 'testuser';
    dto.password = 'password123';
    dto.passwordConfirm = 'password123';
    dto.turnstileToken = 'valid-turnstile-token';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  describe('email validation', () => {
    it('should fail if email is not provided', async () => {
      const dto = new RegisterDto();
      dto.username = 'testuser';
      dto.password = 'password123';
      dto.passwordConfirm = 'password123';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
    });

    it('should fail if email format is invalid', async () => {
      const dto = new RegisterDto();
      dto.email = 'invalid-email';
      dto.username = 'testuser';
      dto.password = 'password123';
      dto.passwordConfirm = 'password123';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('email');
    });
  });

  describe('username validation', () => {
    it('should fail if username is too short (< 3 chars)', async () => {
      const dto = new RegisterDto();
      dto.email = 'test@example.com';
      dto.username = 'ab';
      dto.password = 'password123';
      dto.passwordConfirm = 'password123';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('username');
    });

    it('should fail if username is too long (> 20 chars)', async () => {
      const dto = new RegisterDto();
      dto.email = 'test@example.com';
      dto.username = 'a'.repeat(21);
      dto.password = 'password123';
      dto.passwordConfirm = 'password123';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('username');
    });

    it('should fail if username contains special characters', async () => {
      const dto = new RegisterDto();
      dto.email = 'test@example.com';
      dto.username = 'test@user';
      dto.password = 'password123';
      dto.passwordConfirm = 'password123';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('username');
    });

    it('should pass if username contains alphanumeric and underscore', async () => {
      const dto = new RegisterDto();
      dto.email = 'test@example.com';
      dto.username = 'test_user_123';
      dto.password = 'password123';
      dto.passwordConfirm = 'password123';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('password validation', () => {
    it('should fail if password is too short (< 6 chars)', async () => {
      const dto = new RegisterDto();
      dto.email = 'test@example.com';
      dto.username = 'testuser';
      dto.password = '12345';
      dto.passwordConfirm = '12345';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('password');
    });

    it('should pass if password is exactly 6 characters', async () => {
      const dto = new RegisterDto();
      dto.email = 'test@example.com';
      dto.username = 'testuser';
      dto.password = '123456';
      dto.passwordConfirm = '123456';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('passwordConfirm validation', () => {
    it('should fail if passwordConfirm does not match password', async () => {
      const dto = new RegisterDto();
      dto.email = 'test@example.com';
      dto.username = 'testuser';
      dto.password = 'password123';
      dto.passwordConfirm = 'different123';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const passwordConfirmError = errors.find(
        (e) => e.property === 'passwordConfirm',
      );
      expect(passwordConfirmError).toBeDefined();
      expect(passwordConfirmError?.constraints).toHaveProperty('match');
    });

    it('should pass if passwordConfirm matches password', async () => {
      const dto = new RegisterDto();
      dto.email = 'test@example.com';
      dto.username = 'testuser';
      dto.password = 'password123';
      dto.passwordConfirm = 'password123';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail if passwordConfirm is not provided', async () => {
      const dto = new RegisterDto();
      dto.email = 'test@example.com';
      dto.username = 'testuser';
      dto.password = 'password123';

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const passwordConfirmError = errors.find(
        (e) => e.property === 'passwordConfirm',
      );
      expect(passwordConfirmError).toBeDefined();
    });
  });

  describe('turnstileToken validation', () => {
    it('should pass validation without turnstileToken (optional)', async () => {
      const dto = new RegisterDto();
      dto.email = 'test@example.com';
      dto.username = 'testuser';
      dto.password = 'password123';
      dto.passwordConfirm = 'password123';
      // turnstileToken not provided

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should pass validation with turnstileToken', async () => {
      const dto = new RegisterDto();
      dto.email = 'test@example.com';
      dto.username = 'testuser';
      dto.password = 'password123';
      dto.passwordConfirm = 'password123';
      dto.turnstileToken = 'valid-turnstile-token';

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail if turnstileToken is not a string', async () => {
      const dto = new RegisterDto();
      dto.email = 'test@example.com';
      dto.username = 'testuser';
      dto.password = 'password123';
      dto.passwordConfirm = 'password123';
      (dto as any).turnstileToken = 123; // Invalid type

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const turnstileError = errors.find(
        (e) => e.property === 'turnstileToken',
      );
      expect(turnstileError).toBeDefined();
    });
  });
});
