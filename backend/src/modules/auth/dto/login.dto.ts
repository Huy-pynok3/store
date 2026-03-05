import { IsEmail, IsString, MinLength, IsOptional, IsBoolean } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1)
  password: string;

  @IsString()
  @IsOptional()
  turnstileToken?: string;

  @IsBoolean()
  @IsOptional()
  rememberMe?: boolean;
}
