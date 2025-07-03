import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt, IsJSON, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DynamicFormFieldDto } from './dynamic-form-field.dto';

export class CreateDynamicFormDto {
  @ApiPropertyOptional({ description: 'Company ID - will be set from authenticated user context' })
  @IsOptional()
  @IsInt()
  companyId?: number;

  @ApiProperty({ example: 'userRegistrationForm', description: 'Unique name/key for the form within the company' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: 'Form for new user registration', description: 'Description of the form' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'user', description: 'Entity type this form is associated with (e.g., user, masterData)' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  entityType?: string;

  @ApiPropertyOptional({ example: 1, description: 'If entityType is masterData, this can specify the masterType ID' })
  @IsOptional()
  @IsInt()
  masterTypeId?: number;

  @ApiPropertyOptional({ description: 'Layout hints or configuration for the form (JSON string)' })
  @IsOptional()
  @IsJSON()
  layout?: string; // Stored as string, parsed in service. Prisma expects Json type.

  @ApiPropertyOptional({ example: 'A', description: 'Status: A (Active), I (Inactive). Defaults to A.' })
  @IsOptional()
  @IsString()
  @MaxLength(1)
  status?: string;

  // createdBy, updatedBy will be handled by the service
  @IsOptional()@IsInt() createdBy?: number;
  @IsOptional()@IsInt() updatedBy?: number;
}

export class CreateDynamicFormWithFieldsDto extends CreateDynamicFormDto {
  @ApiPropertyOptional({ type: () => [DynamicFormFieldDto], description: 'Fields for this form' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DynamicFormFieldDto)
  fields?: DynamicFormFieldDto[];
}
