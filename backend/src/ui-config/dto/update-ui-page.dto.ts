import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateUiPageDto, CreateUiPageWithDetailsDto } from './create-ui-page.dto';
import { UiTableColumnDto } from './ui-table-column.dto';
import { UiActionDto } from './ui-action.dto';
import { UiFieldDto } from './ui-field.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUiPageDto extends OmitType(PartialType(CreateUiPageDto), [
  'companyId', // companyId should not be changed
  'key',       // page key should not be changed
  'createdBy'
] as const) {}

// For updating a page along with its details.
// Handling updates to collections (columns, actions, fields) can be complex:
// - Option 1: Replace all existing with the new set.
// - Option 2: Identify new, updated (by ID or key), and deleted items.
// For simplicity, this DTO implies a "replace all" strategy for sub-items if provided.
// More granular updates would require IDs for sub-items and specific logic in the service.
export class UpdateUiPageWithDetailsDto extends UpdateUiPageDto {
  @ApiPropertyOptional({ type: () => [UiTableColumnDto], description: 'Full new set of columns for the page\'s data table' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UiTableColumnDto)
  columns?: UiTableColumnDto[]; // Note: These DTOs don't have IDs. Service needs to handle diff or replace.

  @ApiPropertyOptional({ type: () => [UiActionDto], description: 'Full new set of actions available on the page' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UiActionDto)
  actions?: UiActionDto[];

  @ApiPropertyOptional({ type: () => [UiFieldDto], description: 'Full new set of form fields for the page' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UiFieldDto)
  fields?: UiFieldDto[];
}
