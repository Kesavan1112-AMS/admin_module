import { Controller, Post, Body } from '@nestjs/common';
import { CompanyConfigurationService } from './company-configuration.service';
import { CreateCompanyConfigurationDto } from './dto/create-company-configuration.dto';
import { UpdateCompanyConfigurationDto } from './dto/update-company-configuration.dto';

@Controller('company-configuration')
export class CompanyConfigurationController {
  constructor(private readonly service: CompanyConfigurationService) {}

  @Post('create')
  create(@Body() body: CreateCompanyConfigurationDto) {
    return this.service.create(body);
  }

  @Post('find-all')
  findAll(@Body() body: { companyId: number }) {
    return this.service.findAll(Number(body.companyId));
  }

  @Post('find-one')
  findOne(@Body() body: { id: number }) {
    return this.service.findOne(Number(body.id));
  }

  @Post('update')
  update(@Body() body: { id: number; data: UpdateCompanyConfigurationDto }) {
    return this.service.update(Number(body.id), body.data);
  }

  @Post('remove')
  remove(@Body() body: { id: number }) {
    return this.service.remove(Number(body.id));
  }

  @Post('config')
  async getConfig(@Body() body: { companyId: number }) {
    return this.service.getConfig(Number(body.companyId));
  }

  @Post('menu')
  async getMenu(@Body() body: { companyId: number }) {
    return this.service.getMenu(Number(body.companyId));
  }

  @Post('page')
  async getPage(@Body() body: { companyId: number; pageName: string }) {
    return this.service.getPage(Number(body.companyId), body.pageName);
  }

  @Post('theme')
  async getTheme(@Body() body: { companyId: number }) {
    return this.service.getTheme(Number(body.companyId));
  }
}
