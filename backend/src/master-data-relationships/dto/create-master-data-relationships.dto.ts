import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateMasterDataRelationshipsDto {
  @IsInt()
  companyId: number;

  @IsOptional()
  @IsInt()
  parentMasterDataId?: number;

  @IsInt()
  childMasterDataId: number;

  @IsOptional()
  @IsString()
  relationshipType?: string;

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
