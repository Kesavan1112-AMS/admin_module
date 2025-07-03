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
  UseInterceptors, // Added
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CompanyConfigurationService } from './company-configuration.service';
import { ApplyBusinessRules } from '../core/decorators/apply-business-rules.decorator'; // Added
import { BusinessRuleInterceptor } from '../core/interceptors/business-rule.interceptor'; // Added
import { CreateCompanyConfigurationDto } from './dto/create-company-configuration.dto';
import { UpdateCompanyConfigurationDto } from './dto/update-company-configuration.dto';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    companyId: number;
  };
}

@Controller('company-configurations') // Plural endpoint
@UseGuards(AuthGuard('jwt'))
export class CompanyConfigurationController {
  constructor(private readonly configService: CompanyConfigurationService) {}

  @Post()
  create(
    @Body() createDto: CreateCompanyConfigurationDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { id: userId, companyId } = req.user;
    return this.configService.create(createDto, userId, companyId);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    const { companyId } = req.user;
    return this.configService.findAll(companyId);
  }

  @Get(':configKey')
  findOneByKey(
    @Param('configKey') configKey: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const { companyId } = req.user;
    return this.configService.findOneByKey(configKey, companyId);
  }

  @Patch(':configKey')
  update(
    @Param('configKey') configKey: string,
    @Body() updateDto: UpdateCompanyConfigurationDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { id: userId, companyId } = req.user;
    return this.configService.update(configKey, updateDto, userId, companyId);
  }

  @Delete(':configKey')
  remove(
    @Param('configKey') configKey: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const { id: userId, companyId } = req.user;
    return this.configService.remove(configKey, companyId, userId);
  }

  // Specific endpoint to get the theme, using the refined service method
  @Get('ui/theme')
  async getTheme(@Req() req: AuthenticatedRequest) {
    const { companyId } = req.user;
    const themeData = await this.configService.getThemeConfig(companyId);
    return { status: true, msg: 'Theme fetched', data: themeData };
  }

   // Endpoint for a generic config key, if needed (e.g., 'ui.config')
   @Get('ui/config/:key')
   async getSpecificUiConfig(@Param('key') key: string, @Req() req: AuthenticatedRequest) {
     const { companyId } = req.user;
     // It's good practice to namespace company-wide UI settings, e.g., 'ui.someSetting'
     const configData = await this.configService.getSpecificConfig(`ui.${key}`, companyId);
     return { status: true, msg: `Config ui.${key} fetched`, data: configData };
   }
}
