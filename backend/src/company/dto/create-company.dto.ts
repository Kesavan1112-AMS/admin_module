import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsJSON, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, Matches } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Awesome Corp Inc.', description: 'Full name of the company' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'AWESOME_CORP', description: 'Unique code for the company' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^[A-Z0-9_]+$/, { message: 'Company code can only contain uppercase letters, numbers, and underscores' })
  code: string;

  @ApiPropertyOptional({ example: 'https://example.com/logo.png', description: 'URL of the company logo' })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  logoUrl?: string;

  @ApiPropertyOptional({ description: 'Initial theme configuration as a JSON object' })
  @IsOptional()
  @IsJSON() // Validates if the string is a valid JSON
  themeConfig?: string; // Store as string, parse in service if needed, or use Prisma JSON type

  @ApiPropertyOptional({ example: 'A', description: 'Status: A (Active), I (Inactive). Defaults to A.' })
  @IsOptional()
  @IsString()
  @MaxLength(1)
  status?: string;

  // createdBy and updatedBy will be set by the service
}
