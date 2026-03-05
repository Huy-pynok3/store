import { IsString, IsOptional, MinLength } from 'class-validator';

export class CreateShopDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  logo?: string;
}
