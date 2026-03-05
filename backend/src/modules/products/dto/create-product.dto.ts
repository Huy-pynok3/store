import { IsString, IsNumber, IsEnum, IsBoolean, IsOptional, IsArray, Min } from 'class-validator';
import { ProductType } from '@prisma/client';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(ProductType)
  type: ProductType;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsBoolean()
  @IsOptional()
  autoDeliver?: boolean;

  @IsOptional()
  metadata?: any;
}
