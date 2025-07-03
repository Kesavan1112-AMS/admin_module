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
  Query,
  ParseIntPipe,
  UseInterceptors, // Added
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserMasterMappingService } from './user-master-mapping.service';
import { ApplyBusinessRules } from '../core/decorators/apply-business-rules.decorator'; // Added
import { BusinessRuleInterceptor } from '../core/interceptors/business-rule.interceptor'; // Added
import { CreateUserMasterMappingDto } from './dto/create-user-master-mapping.dto';
import { UpdateUserMasterMappingDto } from './dto/update-user-master-mapping.dto';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    companyId: number;
    // other properties from JWT payload
  };
}

@Controller('user-master-mappings') // Plural endpoint
@UseGuards(AuthGuard('jwt'))
export class UserMasterMappingController {
  constructor(
    private readonly userMasterMappingService: UserMasterMappingService,
  ) {}

  @Post()
  create(
    @Body() createUserMasterMappingDto: CreateUserMasterMappingDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { id: actingUserId, companyId } = req.user;
    return this.userMasterMappingService.create(createUserMasterMappingDto, actingUserId, companyId);
  }

  @Get()
  findAll(
    @Req() req: AuthenticatedRequest,
    @Query('userId', new ParseIntPipe({ optional: true })) mappedUserId?: number,
    @Query('masterDataId', new ParseIntPipe({ optional: true })) masterDataId?: number,
    ) {
    const { companyId } = req.user;
    return this.userMasterMappingService.findAll(companyId, mappedUserId, masterDataId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const { companyId } = req.user;
    return this.userMasterMappingService.findOne(id, companyId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserMasterMappingDto: UpdateUserMasterMappingDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { id: actingUserId, companyId } = req.user;
    return this.userMasterMappingService.update(id, updateUserMasterMappingDto, actingUserId, companyId);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const { id: actingUserId, companyId } = req.user;
    return this.userMasterMappingService.remove(id, companyId, actingUserId);
  }
}
