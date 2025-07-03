import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateMasterTypeDto {
  @IsInt()
  companyId: number;

  @IsString()
  name: string;

  @IsString()
  displayName: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  hierarchyLevel: number;
}
