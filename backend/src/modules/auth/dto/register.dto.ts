import { IsEmail, IsString, MinLength, MaxLength, Matches, IsOptional } from 'class-validator';
import { Match } from '../decorators/match.decorator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers and underscores',
  })
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @Match('password', { message: 'Passwords do not match' })
  passwordConfirm: string;

  @IsString()
  @IsOptional() // Optional for testing, but required in production
  turnstileToken?: string;
}
