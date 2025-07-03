import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UiTableColumnDto {
  @ApiProperty({ example: 'username', description: 'Key/data field for the column' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  key: string;

  @ApiProperty({ example: 'Username', description: 'Display label for the column header' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  label: string;

  @ApiPropertyOptional({ example: 'text', description: 'Type of data/renderer (e.g., text, date, toggle, actions)' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  type?: string;

  @ApiPropertyOptional({ example: 10, description: 'Order of the column' })
  @IsOptional()
  @IsInt()
  order?: number;

  @ApiPropertyOptional({ example: true, description: 'Is the column visible by default?' })
  @IsOptional()
  @IsBoolean()
  visible?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Is the column sortable?' })
  @IsOptional()
  @IsBoolean()
  sortable?: boolean;
}
