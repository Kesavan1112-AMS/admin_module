import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateUserSessionDto {
  @IsInt()
  userId: number;

  @IsString()
  token: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  expiresAt?: Date;
}
