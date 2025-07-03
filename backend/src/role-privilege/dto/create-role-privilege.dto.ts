import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateRolePrivilegeDto {
  @IsInt()
  companyId: number;

  @IsInt()
  userCategoryId: number;

  @IsInt()
  privilegeId: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsInt()
  grantedBy?: number;

  @IsOptional()
  @IsInt()
  createdBy?: number;

  @IsOptional()
  @IsInt()
  updatedBy?: number;
}
