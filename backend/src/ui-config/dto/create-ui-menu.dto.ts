import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateUiMenuDto {
  @ApiPropertyOptional({ description: 'Company ID - will be set from authenticated user context' })
  @IsOptional()
  @IsInt()
  companyId?: number;

  @ApiProperty({ example: 'Dashboard', description: 'Label for the menu item' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  label: string;

  @ApiPropertyOptional({ example: '/dashboard', description: 'Route path for navigation' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  route?: string;

  @ApiPropertyOptional({ example: 'home-icon', description: 'Icon identifier for the menu item' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  icon?: string;

  @ApiPropertyOptional({ example: 1, description: 'ID of the parent menu item, if this is a submenu' })
  @IsOptional()
  @IsInt()
  parentId?: number;

  @ApiPropertyOptional({ example: 10, description: 'Order of the menu item' })
  @IsOptional()
  @IsInt()
  order?: number;

  @ApiPropertyOptional({ example: 'A', description: 'Status: A (Active), I (Inactive). Defaults to A.' })
  @IsOptional()
  @IsString()
  @MaxLength(1)
  status?: string;

  // createdBy, updatedBy will be handled by the service
  @IsOptional()@IsInt() createdBy?: number;
  @IsOptional()@IsInt() updatedBy?: number;
}
