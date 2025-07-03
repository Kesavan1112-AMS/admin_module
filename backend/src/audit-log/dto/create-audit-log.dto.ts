import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateAuditLogDto {
  @IsInt()
  companyId: number;

  @IsInt()
  userId: number;

  @IsString()
  entityType: string;

  @IsInt()
  entityId: number;

  @IsString()
  action: string;

  @IsOptional()
  oldValue?: any;

  @IsOptional()
  newValue?: any;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;
}
