import { IsOptional, IsString, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum SortOption {
  POPULAR = 'popular',
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
}

export class GetProductListDto {
  @IsOptional()
  @IsString()
  subTypes?: string; // Comma-separated list: "GMAIL,HOTMAIL,OUTLOOKMAIL"

  @IsOptional()
  @IsEnum(SortOption)
  sort?: SortOption = SortOption.POPULAR;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 12;
}
