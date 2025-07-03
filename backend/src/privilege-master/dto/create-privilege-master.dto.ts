import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreatePrivilegeMasterDto {
  @IsInt()
  companyId: number;

  @IsInt()
  moduleId: number;

  @IsString()
  name: string;

  @IsString()
  displayName: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsInt()
  createdBy?: number;

  @IsOptional()
  @IsInt()
  updatedBy?: number;
}
