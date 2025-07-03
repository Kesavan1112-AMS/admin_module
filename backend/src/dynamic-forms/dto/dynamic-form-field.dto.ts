import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsJSON, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class DynamicFormFieldDto {
  @ApiPropertyOptional({ description: 'ID of the field, used for updates' })
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiProperty({ example: 'username', description: 'Key/name for the form field, unique within the form' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  key: string;

  @ApiProperty({ example: 'Username', description: 'Display label for the form field' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  label: string;

  @ApiProperty({ example: 'text', description: 'Type of the form field (e.g., text, number, select, date, textarea, checkbox)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  type: string;

  @ApiPropertyOptional({ example: 'Enter your username', description: 'Placeholder text' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  placeholder?: string;

  @ApiPropertyOptional({ example: 'Default username', description: 'Default value for the field' })
  @IsOptional()
  @IsString() // Can be any type, but string is common for DTO transport
  defaultValue?: string;

  @ApiPropertyOptional({ example: true, description: 'Is the field required?' })
  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Is the field read-only?' })
  @IsOptional()
  @IsBoolean()
  readOnly?: boolean;

  @ApiPropertyOptional({ description: 'Validation rules as a JSON string (e.g., {"minLength": 3, "pattern": "^[a-zA-Z]+$"})' })
  @IsOptional()
  @IsJSON()
  validation?: string; // Stored as string, parsed in service. Prisma expects Json type.

  @ApiPropertyOptional({ description: 'Options for select/radio/checkbox group as a JSON string (e.g., [{"value": "1", "label": "Option 1"}])' })
  @IsOptional()
  @IsJSON()
  options?: string; // Stored as string, parsed in service. Prisma expects JsonArray.

  @ApiPropertyOptional({ example: 10, description: 'Order index of the field within the form' })
  @IsOptional()
  @IsInt()
  orderIndex?: number;

  @ApiPropertyOptional({ example: 'A', description: 'Status: A (Active), I (Inactive). Defaults to A.' })
  @IsOptional()
  @IsString()
  @MaxLength(1)
  status?: string;

  // companyId, formId, createdBy, updatedBy will be handled by the service or parent context
}
