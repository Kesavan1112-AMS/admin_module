import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiPropertyOptional({ description: 'Company ID will be set from the authenticated user context' })
  @IsOptional()
  @IsInt()
  companyId?: number;

  @ApiProperty({ example: 'newuser', description: 'Username for login' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores' })
  username: string;

  @ApiProperty({ example: 'user@example.com', description: 'User\'s email address' })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @ApiProperty({ example: 'P@$$wOrd123', description: 'User\'s password (will be hashed)' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  // Add more password complexity rules if needed, e.g., using @Matches
  password: string;

  @ApiProperty({ example: 'John', description: 'User\'s first name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'User\'s last name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName: string;

  @ApiPropertyOptional({ example: '1234567890', description: 'User\'s phone number' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiProperty({ example: 1, description: 'ID of the user category (role)' })
  @IsInt()
  @IsNotEmpty()
  userCategoryId: number;

  @ApiPropertyOptional({ example: 'A', description: 'Status: A (Active), I (Inactive). Defaults to A.' })
  @IsOptional()
  @IsString()
  @MaxLength(1)
  status?: string;

  @IsOptional()
  @IsInt()
  createdBy?: number;

  @IsOptional()
  @IsInt()
  updatedBy?: number;
}
