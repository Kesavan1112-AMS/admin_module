import { PartialType, OmitType } from '@nestjs/swagger'; // Using swagger's mapped-types for consistency if swagger is used
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsInt, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

// We omit username, password, and companyId as they shouldn't be updated via this DTO.
// Password changes should have a separate, dedicated flow.
export class UpdateUserDto extends OmitType(PartialType(CreateUserDto), [
  'username',
  'password',
  'companyId',
  'createdBy' // Should not be updated
] as const) {

  @ApiPropertyOptional({ example: 'user_updated@example.com', description: 'User\'s email address' })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional({ example: 'Johnathan', description: 'User\'s first name' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doer', description: 'User\'s last name' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @ApiPropertyOptional({ example: 1, description: 'ID of the user category (role)' })
  @IsOptional()
  @IsInt()
  userCategoryId?: number;

  @ApiPropertyOptional({ example: '1234567890', description: 'User\'s phone number' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({ example: 'A', description: 'Status: A (Active), I (Inactive)' })
  @IsOptional()
  @IsString()
  @MaxLength(1)
  status?: string;

  // updatedBy will be set by the service based on the authenticated user
}
