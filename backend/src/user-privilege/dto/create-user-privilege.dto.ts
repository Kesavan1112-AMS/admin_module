import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateUserPrivilegeDto {
  @IsInt()
  companyId: number;

  @IsInt()
  userId: number;

  @IsInt()
  privilegeId: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  overrideReason?: string;

  @IsOptional()
  @IsInt()
  grantedBy?: number;

  @IsOptional()
  expiresAt?: Date;

  @IsOptional()
  @IsInt()
  createdBy?: number;

  @IsOptional()
  @IsInt()
  updatedBy?: number;
}
