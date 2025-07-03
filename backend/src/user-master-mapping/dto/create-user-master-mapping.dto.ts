import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateUserMasterMappingDto {
  @IsInt()
  companyId: number;

  @IsInt()
  userId: number;

  @IsInt()
  masterDataId: number;

  @IsOptional()
  @IsString()
  accessType?: string;

  @IsOptional()
  @IsInt()
  grantedBy?: number;

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
