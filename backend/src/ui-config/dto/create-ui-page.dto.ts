import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UiTableColumnDto } from './ui-table-column.dto';
import { UiActionDto } from './ui-action.dto';
import { UiFieldDto } from './ui-field.dto';

export class CreateUiPageDto {
  @ApiPropertyOptional({ description: 'Company ID - will be set from authenticated user context' })
  @IsOptional()
  @IsInt()
  companyId?: number;

  @ApiProperty({ example: 'user-management', description: 'Unique key for the page' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  key: string;

  @ApiProperty({ example: 'User Management', description: 'Title of the page' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({ example: 'Manage users and their roles', description: 'Description of the page' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'A', description: 'Status: A (Active), I (Inactive). Defaults to A.' })
  @IsOptional()
  @IsString()
  @MaxLength(1)
  status?: string;

  // createdBy, updatedBy will be handled by the service
  @IsOptional()@IsInt() createdBy?: number;
  @IsOptional()@IsInt() updatedBy?: number;
}

// This DTO is for creating a page along with its details in one go.
export class CreateUiPageWithDetailsDto extends CreateUiPageDto {
  @ApiPropertyOptional({ type: () => [UiTableColumnDto], description: 'Columns for the page\'s data table' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UiTableColumnDto)
  columns?: UiTableColumnDto[];

  @ApiPropertyOptional({ type: () => [UiActionDto], description: 'Actions available on the page' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UiActionDto)
  actions?: UiActionDto[];

  @ApiPropertyOptional({ type: () => [UiFieldDto], description: 'Form fields for the page' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UiFieldDto)
  fields?: UiFieldDto[];
}
