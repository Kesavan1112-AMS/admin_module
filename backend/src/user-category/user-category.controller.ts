import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
  UseInterceptors, // Added
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserCategoryService } from './user-category.service';
import { ApplyBusinessRules } from '../core/decorators/apply-business-rules.decorator'; // Added
import { BusinessRuleInterceptor } from '../core/interceptors/business-rule.interceptor'; // Added
import { CreateUserCategoryDto } from './dto/create-user-category.dto';
import { UpdateUserCategoryDto } from './dto/update-user-category.dto';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    companyId: number;
    // other properties from JWT payload
  };
}

@Controller('user-categories') // Changed to plural form for consistency
@UseGuards(AuthGuard('jwt'))
export class UserCategoryController {
  constructor(private readonly userCategoryService: UserCategoryService) {}

  @Post()
  create(
    @Body() createUserCategoryDto: CreateUserCategoryDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { id: userId, companyId } = req.user;
    // companyId in DTO is ignored by service if already set; service uses companyId from token.
    return this.userCategoryService.create(createUserCategoryDto, userId, companyId);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    const { companyId } = req.user;
    return this.userCategoryService.findAll(companyId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const { companyId } = req.user;
    return this.userCategoryService.findOne(id, companyId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserCategoryDto: UpdateUserCategoryDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { id: userId, companyId } = req.user;
    return this.userCategoryService.update(id, updateUserCategoryDto, userId, companyId);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const { id: userId, companyId } = req.user;
    return this.userCategoryService.remove(id, companyId, userId);
  }
}
