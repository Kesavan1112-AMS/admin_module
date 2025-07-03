import { Controller, Post, Body, Param, Query } from '@nestjs/common';
import { MasterDataService } from './master-data.service';

@Controller('master-data')
export class MasterDataController {
  constructor(private readonly masterDataService: MasterDataService) {}

  @Post('create')
  create(@Body() body) {
    return this.masterDataService.create(body);
  }

  @Post('find-all')
  findAll(@Body() body: { companyId: number }) {
    return this.masterDataService.findAll(Number(body.companyId));
  }

  @Post('find-one')
  findOne(@Body() body: { id: number }) {
    return this.masterDataService.findOne(Number(body.id));
  }

  @Post('update')
  update(@Body() body: { id: number; data: any }) {
    return this.masterDataService.update(Number(body.id), body.data);
  }

  @Post('remove')
  remove(@Body() body: { id: number }) {
    return this.masterDataService.remove(Number(body.id));
  }
}
