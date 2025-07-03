import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Patch,
  Delete,
  ParseIntPipe,
  ForbiddenException,
  UseInterceptors, // Added
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UiConfigService } from './ui-config.service';
import { ApplyBusinessRules } from '../core/decorators/apply-business-rules.decorator'; // Added
import { BusinessRuleInterceptor } from '../core/interceptors/business-rule.interceptor'; // Added
import { CreateUiMenuDto } from './dto/create-ui-menu.dto';
import { UpdateUiMenuDto } from './dto/update-ui-menu.dto';
import { CreateUiPageWithDetailsDto } from './dto/create-ui-page.dto';
import { UpdateUiPageWithDetailsDto } from './dto/update-ui-page.dto';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    companyId: number;
    // roles?: string[];
  };
}

@Controller('ui-config') // Base path for UI configurations
@UseGuards(AuthGuard('jwt'))
export class UiConfigController {
  constructor(private readonly uiConfigService: UiConfigService) {}

  // --- Runtime Endpoints for Frontend ---
  @Get('live/menu') // No companyId in path, derived from user
  async getLiveMenuConfiguration(@Req() req: AuthenticatedRequest) {
    const { companyId } = req.user;
    const menu = await this.uiConfigService.getMenuConfiguration(companyId);
    return { status: 1, msg: 'Menu configuration retrieved.', data: menu };
  }

  @Get('live/page/:pageKey') // No companyId in path, derived from user
  async getLivePageConfiguration(
    @Param('pageKey') pageKey: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const { companyId } = req.user;
    const pageConfig = await this.uiConfigService.getPageConfiguration(companyId, pageKey);
    return { status: 1, msg: 'Page configuration retrieved.', data: pageConfig };
  }

  @Get('live/theme') // No companyId in path, derived from user
  async getLiveThemeConfiguration(@Req() req: AuthenticatedRequest) {
    const { companyId } = req.user;
    const theme = await this.uiConfigService.getThemeConfiguration(companyId);
    return { status: 1, msg: 'Theme configuration retrieved.', data: theme };
  }

  // --- Admin CRUD Endpoints for UiMenu ---
  @Post('admin/menus')
  async createMenu(
    @Body() createUiMenuDto: CreateUiMenuDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { id: actingUserId, companyId } = req.user;
    // Admin role check would be good here
    const menu = await this.uiConfigService.createMenu(createUiMenuDto, actingUserId, companyId);
    return { status: 1, msg: 'Menu created successfully.', data: menu };
  }

  @Get('admin/menus')
  async findAllMenus(@Req() req: AuthenticatedRequest) {
    const { companyId } = req.user;
    const menus = await this.uiConfigService.findAllMenus(companyId);
    return { status: 1, msg: 'All menus retrieved.', data: menus };
  }

  @Get('admin/menus/:id')
  async findOneMenu(@Param('id', ParseIntPipe) id: number, @Req() req: AuthenticatedRequest) {
    const { companyId } = req.user;
    const menu = await this.uiConfigService.findOneMenu(id, companyId);
    return { status: 1, msg: 'Menu retrieved.', data: menu };
  }

  @Patch('admin/menus/:id')
  async updateMenu(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUiMenuDto: UpdateUiMenuDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { id: actingUserId, companyId } = req.user;
    const menu = await this.uiConfigService.updateMenu(id, updateUiMenuDto, actingUserId, companyId);
    return { status: 1, msg: 'Menu updated successfully.', data: menu };
  }

  @Delete('admin/menus/:id')
  async deleteMenu(@Param('id', ParseIntPipe) id: number, @Req() req: AuthenticatedRequest) {
    const { id: actingUserId, companyId } = req.user;
    await this.uiConfigService.deleteMenu(id, companyId, actingUserId);
    return { status: 1, msg: 'Menu deleted successfully.' };
  }

  // --- Admin CRUD Endpoints for UiPage ---
  @Post('admin/pages')
  async createPageWithDetails(
    @Body() createUiPageDto: CreateUiPageWithDetailsDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { id: actingUserId, companyId } = req.user;
    const page = await this.uiConfigService.createPageWithDetails(createUiPageDto, actingUserId, companyId);
    return { status: 1, msg: 'Page created successfully.', data: page };
  }

  @Get('admin/pages')
  async findAllPages(@Req() req: AuthenticatedRequest) {
    const { companyId } = req.user;
    const pages = await this.uiConfigService.findAllPages(companyId);
    return { status: 1, msg: 'All pages retrieved.', data: pages };
  }

  @Get('admin/pages/:id')
  async findOnePage(@Param('id', ParseIntPipe) id: number, @Req() req: AuthenticatedRequest) {
    const { companyId } = req.user;
    const page = await this.uiConfigService.findOnePage(id, companyId);
    return { status: 1, msg: 'Page retrieved.', data: page };
  }

  @Patch('admin/pages/:id')
  async updatePageWithDetails(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUiPageDto: UpdateUiPageWithDetailsDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const { id: actingUserId, companyId } = req.user;
    const page = await this.uiConfigService.updatePageWithDetails(id, updateUiPageDto, actingUserId, companyId);
    return { status: 1, msg: 'Page updated successfully.', data: page };
  }

  @Delete('admin/pages/:id')
  async deletePage(@Param('id', ParseIntPipe) id: number, @Req() req: AuthenticatedRequest) {
    const { id: actingUserId, companyId } = req.user;
    await this.uiConfigService.deletePage(id, companyId, actingUserId);
    return { status: 1, msg: 'Page deleted successfully.' };
  }
}
