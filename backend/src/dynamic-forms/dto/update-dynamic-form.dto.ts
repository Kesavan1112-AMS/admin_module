import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateDynamicFormDto, CreateDynamicFormWithFieldsDto } from './create-dynamic-form.dto';
import { DynamicFormFieldDto } from './dynamic-form-field.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// companyId, name, entityType, masterTypeId are generally not updatable for an existing form.
export class UpdateDynamicFormDto extends OmitType(PartialType(CreateDynamicFormDto), [
  'companyId',
  'name',
  'entityType',
  'masterTypeId',
  'createdBy'
] as const) {}

export class UpdateDynamicFormWithFieldsDto extends UpdateDynamicFormDto {
  @ApiPropertyOptional({ type: () => [DynamicFormFieldDto], description: 'Full new set of fields for this form. Existing fields not included will be removed.' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DynamicFormFieldDto)
  fields?: DynamicFormFieldDto[]; // For updates, DTO fields might include IDs for existing fields to update, or no ID for new ones.
                                // A "replace all" strategy is simpler: delete all existing fields and create these.
}
