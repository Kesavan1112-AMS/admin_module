import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsJSON, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UiFieldDto {
  @ApiProperty({ example: 'username', description: 'Key/name for the form field' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  key: string;

  @ApiProperty({ example: 'Username', description: 'Display label for the form field' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  label: string;

  @ApiPropertyOptional({ example: 'text', description: 'Type of the form field (e.g., text, number, select, date)' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  type?: string;

  @ApiPropertyOptional({ example: true, description: 'Is the field required?' })
  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Is the field visible by default?' })
  @IsOptional()
  @IsBoolean()
  visible?: boolean;

  @ApiPropertyOptional({ example: 10, description: 'Order of the field in the form' })
  @IsOptional()
  @IsInt()
  order?: number;

  @ApiPropertyOptional({ example: 'Enter username', description: 'Placeholder text for the field' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  placeholder?: string;

  @ApiPropertyOptional({ description: 'Validation rules as a JSON object/string' })
  @IsOptional()
  @IsJSON() // Prisma expects Json type, class-validator can check if string is valid JSON
  validation?: string; // Or Record<string, any> if auto-transformed

  @ApiPropertyOptional({ description: 'Options for select/radio/checkbox group as a JSON object/string (e.g., [{value: "1", label: "One"}])' })
  @IsOptional()
  @IsJSON()
  options?: string; // Or array of {value: string, label: string}
}
