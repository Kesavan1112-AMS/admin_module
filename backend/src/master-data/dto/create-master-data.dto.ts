import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateMasterDataDto {
  @IsInt()
  companyId: number;

  @IsInt()
  masterTypeId: number;

  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  metadata?: any;

  @IsOptional()
  @IsInt()
  createdBy?: number;

  @IsOptional()
  @IsInt()
  updatedBy?: number;
}
