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
  Query,
  UseInterceptors, // Added
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MasterDataService } from './master-data.service';
import { ApplyBusinessRules } from '../core/decorators/apply-business-rules.decorator'; // Added
import { BusinessRuleInterceptor } from '../core/interceptors/business-rule.interceptor'; // Added
import { CreateMasterDataDto } from './dto/create-master-data.dto';
import { UpdateMasterDataDto } from './dto/update-master-data.dto';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    companyId: number;
    // other properties from JWT payload
  };
}

@Controller('master-data')
@UseGuards(AuthGuard('jwt'))
export class MasterDataController {
  constructor(private readonly masterDataService: MasterDataService) {}

  @Post()
  create(
    @Body() createMasterDataDto: CreateMasterDataDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { id: userId, companyId } = req.user;
    // companyId in DTO is ignored; service uses companyId from token.
    return this.masterDataService.create(createMasterDataDto, userId, companyId);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest, @Query('masterTypeId', new ParseIntPipe({ optional: true })) masterTypeId?: number) {
    const { companyId } = req.user;
    // TODO: Add filtering by masterTypeId if provided
    // For now, just returning all for the company
    return this.masterDataService.findAll(companyId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const { companyId } = req.user;
    return this.masterDataService.findOne(id, companyId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMasterDataDto: UpdateMasterDataDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { id: userId, companyId } = req.user;
    return this.masterDataService.update(id, updateMasterDataDto, userId, companyId);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const { id: userId, companyId } = req.user;
    return this.masterDataService.remove(id, companyId, userId);
  }
}
