import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateMasterHierarchyDto {
  @IsInt()
  companyId: number;

  @IsOptional()
  @IsInt()
  parentMasterTypeId?: number;

  @IsInt()
  childMasterTypeId: number;

  @IsOptional()
  @IsString()
  relationshipName?: string;

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
