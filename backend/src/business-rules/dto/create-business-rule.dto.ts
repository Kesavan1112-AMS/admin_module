import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsJSON, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateBusinessRuleDto {
  @ApiPropertyOptional({ description: 'Company ID - will be set from authenticated user context' })
  @IsOptional()
  @IsInt()
  companyId?: number;

  @ApiProperty({ example: 'Validate User Email Domain', description: 'Name of the business rule' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ description: 'Detailed description of the rule' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'user', description: 'Entity type this rule applies to (e.g., user, masterData)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  entityType: string;

  @ApiProperty({ example: 'beforeCreate', description: 'Event type that triggers this rule (e.g., beforeCreate, afterUpdate)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  eventType: string;

  @ApiProperty({ example: '{"field": "email", "operator": "endsWith", "value": "@example.com"}', description: 'Condition for rule execution (JSON format)' })
  @IsJSON() // Validates if the string is a valid JSON
  @IsNotEmpty()
  condition: string; // Stored as string, parsed in service. Prisma expects Json type.

  @ApiProperty({ example: '{"type": "validation", "message": "Email must end with @example.com"}', description: 'Action to take when condition is met (JSON format)' })
  @IsJSON()
  @IsNotEmpty()
  action: string; // Stored as string, parsed in service.

  @ApiPropertyOptional({ example: 10, description: 'Priority of the rule (higher executes first)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  priority?: number;

  @ApiPropertyOptional({ example: 'A', description: 'Status: A (Active), I (Inactive). Defaults to A.' })
  @IsOptional()
  @IsString()
  @MaxLength(1)
  status?: string;

  // createdBy, updatedBy will be handled by the service
  @IsOptional()@IsInt() createdBy?: number;
  @IsOptional()@IsInt() updatedBy?: number;
}
