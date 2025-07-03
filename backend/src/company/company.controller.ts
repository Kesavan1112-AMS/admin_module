import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll() {
    const companies = await this.companyService.findAll();
    return {
      status: 1,
      msg: 'Companies retrieved successfully',
      data: companies,
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') id: string) {
    const company = await this.companyService.findOne(+id);
    if (!company) {
      return {
        status: 0,
        msg: 'Company not found',
        data: [],
      };
    }
    return {
      status: 1,
      msg: 'Company retrieved successfully',
      data: [company],
    };
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() data: any, @Request() req: any) {
    try {
      const company = await this.companyService.create({
        ...data,
        createdBy: req.user.id,
        updatedBy: req.user.id,
      });
      return {
        status: 1,
        msg: 'Company created successfully',
        data: [company],
      };
    } catch (error) {
      return {
        status: 0,
        msg: error.message || 'Failed to create company',
        data: [],
      };
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id') id: string,
    @Body() data: any,
    @Request() req: any,
  ) {
    try {
      const company = await this.companyService.update(+id, {
        ...data,
        updatedBy: req.user.id,
      });
      return {
        status: 1,
        msg: 'Company updated successfully',
        data: [company],
      };
    } catch (error) {
      return {
        status: 0,
        msg: error.message || 'Failed to update company',
        data: [],
      };
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id') id: string, @Request() req: any) {
    try {
      await this.companyService.delete(+id);
      return {
        status: 1,
        msg: 'Company deleted successfully',
        data: [],
      };
    } catch (error) {
      return {
        status: 0,
        msg: error.message || 'Failed to delete company',
        data: [],
      };
    }
  }

  // Configuration Management Endpoints
  @Get(':id/config/:configKey')
  @UseGuards(AuthGuard('jwt'))
  async getConfiguration(
    @Param('id') companyId: string,
    @Param('configKey') configKey: string,
  ) {
    const config = await this.companyService.getConfiguration(
      +companyId,
      configKey,
    );
    return {
      status: 1,
      msg: 'Configuration retrieved successfully',
      data: config ? [config] : [],
    };
  }

  @Post(':id/config/:configKey')
  @UseGuards(AuthGuard('jwt'))
  async setConfiguration(
    @Param('id') companyId: string,
    @Param('configKey') configKey: string,
    @Body() data: any,
    @Request() req: any,
  ) {
    try {
      const config = await this.companyService.setConfiguration(
        +companyId,
        configKey,
        data.configValue,
        data.description,
      );
      return {
        status: 1,
        msg: 'Configuration updated successfully',
        data: [config],
      };
    } catch (error) {
      return {
        status: 0,
        msg: error.message || 'Failed to update configuration',
        data: [],
      };
    }
  }

  // UI Configuration Endpoints
  @Get(':id/config/menu')
  @UseGuards(AuthGuard('jwt'))
  async getMenuConfiguration(@Param('id') companyId: string) {
    const menu = await this.companyService.getMenuConfiguration(+companyId);
    return {
      status: 1,
      msg: 'Menu configuration retrieved successfully',
      data: [menu],
    };
  }

  @Get(':id/config/theme')
  @UseGuards(AuthGuard('jwt'))
  async getThemeConfiguration(@Param('id') companyId: string) {
    const theme = await this.companyService.getThemeConfiguration(+companyId);
    return {
      status: 1,
      msg: 'Theme configuration retrieved successfully',
      data: [theme],
    };
  }

  @Get(':id/config/page/:pageName')
  @UseGuards(AuthGuard('jwt'))
  async getPageConfiguration(
    @Param('id') companyId: string,
    @Param('pageName') pageName: string,
  ) {
    const pageConfig = await this.companyService.getPageConfiguration(
      +companyId,
      pageName,
    );
    return {
      status: 1,
      msg: 'Page configuration retrieved successfully',
      data: [pageConfig],
    };
  }
}
