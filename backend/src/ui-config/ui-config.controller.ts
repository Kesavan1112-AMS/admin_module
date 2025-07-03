import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UiConfigService } from './ui-config.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('ui-config')
export class UiConfigController {
  constructor(private readonly uiConfigService: UiConfigService) {}

  @Get('menu/:companyId')
  @UseGuards(AuthGuard('jwt'))
  async getMenuConfiguration(@Param('companyId') companyId: string) {
    return this.uiConfigService.getMenuConfiguration(+companyId);
  }

  @Get('page/:companyId/:pageKey')
  @UseGuards(AuthGuard('jwt'))
  async getPageConfiguration(
    @Param('companyId') companyId: string,
    @Param('pageKey') pageKey: string,
  ) {
    return this.uiConfigService.getPageConfiguration(+companyId, pageKey);
  }

  @Get('theme/:companyId')
  @UseGuards(AuthGuard('jwt'))
  async getThemeConfiguration(@Param('companyId') companyId: string) {
    return this.uiConfigService.getThemeConfiguration(+companyId);
  }

  @Post('menu/:companyId')
  @UseGuards(AuthGuard('jwt'))
  async createMenu(
    @Param('companyId') companyId: string,
    @Body() menuData: any,
  ) {
    return this.uiConfigService.createMenu(+companyId, menuData);
  }

  @Post('page/:companyId')
  @UseGuards(AuthGuard('jwt'))
  async createPage(
    @Param('companyId') companyId: string,
    @Body() pageData: any,
  ) {
    return this.uiConfigService.createPage(+companyId, pageData);
  }
}
