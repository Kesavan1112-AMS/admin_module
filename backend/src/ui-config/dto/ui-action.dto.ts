import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UiActionDto {
  @ApiProperty({ example: 'edit', description: 'Key for the action (e.g., create, edit, delete)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  key: string;

  @ApiProperty({ example: 'Edit User', description: 'Display label for the action button/link' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  label: string;

  @ApiPropertyOptional({ example: 10, description: 'Order of the action' })
  @IsOptional()
  @IsInt()
  order?: number;

  @ApiPropertyOptional({ example: true, description: 'Is the action visible by default?' })
  @IsOptional()
  @IsBoolean()
  visible?: boolean;

  // Future: Add properties like 'icon', 'handlerType' (e.g., 'navigate', 'apiCall', 'modal'), 'handlerConfig'
}
