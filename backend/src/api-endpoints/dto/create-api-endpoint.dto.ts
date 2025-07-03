import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsJSON, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

// Define supported HTTP methods and handler types if they are fixed sets
export enum ApiEndpointMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export enum ApiEndpointHandlerType {
  SQL = 'sql',
  FUNCTION = 'function', // Placeholder
  REMOTE = 'remote',     // Placeholder
}

export class CreateApiEndpointDto {
  @ApiPropertyOptional({ description: 'Company ID - will be set from authenticated user context' })
  @IsOptional()
  @IsInt()
  companyId?: number;

  @ApiProperty({ example: '/custom/users', description: 'Path for the custom API endpoint (e.g., /custom/users)' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\/[a-zA-Z0-9_/-]*$/, { message: 'Path must start with / and contain only letters, numbers, underscores, hyphens, and slashes.' })
  path: string;

  @ApiProperty({ enum: ApiEndpointMethod, example: ApiEndpointMethod.GET, description: 'HTTP method' })
  @IsEnum(ApiEndpointMethod)
  @IsNotEmpty()
  method: ApiEndpointMethod;

  @ApiProperty({ enum: ApiEndpointHandlerType, example: ApiEndpointHandlerType.SQL, description: 'Type of handler for this endpoint' })
  @IsEnum(ApiEndpointHandlerType)
  @IsNotEmpty()
  handlerType: ApiEndpointHandlerType;

  @ApiProperty({ example: '{"query": "SELECT * FROM users WHERE companyId = @companyId AND status = \\'A\\';"}', description: 'Configuration for the handler (JSON format). For SQL, expects a "query" field.' })
  @IsJSON() // Validates if the string is a valid JSON
  @IsNotEmpty()
  handlerConfig: string; // Stored as string, parsed in service. Prisma expects Json type.

  @ApiPropertyOptional({ example: 1, description: 'ID of the privilege master record required to access this endpoint' })
  @IsOptional()
  @IsInt()
  requiredPrivilegeId?: number;

  @ApiPropertyOptional({ example: 'A', description: 'Status: A (Active), I (Inactive). Defaults to A.' })
  @IsOptional()
  @IsString()
  status?: string;

  // createdBy, updatedBy will be handled by the service
  @IsOptional()@IsInt() createdBy?: number;
  @IsOptional()@IsInt() updatedBy?: number;
}
