import { IsString, IsBoolean, IsOptional, IsUrl } from 'class-validator';

export class UpdateWarehouseConfigDto {
  @IsBoolean()
  usePrivateWarehouse: boolean;

  @IsString()
  @IsUrl({}, { message: 'warehouseApiUrl phải là một URL hợp lệ' })
  @IsOptional()
  warehouseApiUrl?: string;

  @IsString()
  @IsOptional()
  warehouseApiKey?: string;
}
