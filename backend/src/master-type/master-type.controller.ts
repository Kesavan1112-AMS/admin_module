import { Controller, Post, Body } from '@nestjs/common';
import { MasterTypeService } from './master-type.service';
import { CreateMasterTypeDto } from './dto/create-master-type.dto';
import { UpdateMasterTypeDto } from './dto/update-master-type.dto';

@Controller('master-type')
export class MasterTypeController {
  constructor(private readonly masterTypeService: MasterTypeService) {}

  @Post('create')
  create(@Body() body: CreateMasterTypeDto) {
    return this.masterTypeService.create(body);
  }

  @Post('find-all')
  findAll(@Body() body: { companyId: number }) {
    return this.masterTypeService.findAll(Number(body.companyId));
  }

  @Post('find-one')
  findOne(@Body() body: { id: number }) {
    return this.masterTypeService.findOne(Number(body.id));
  }

  @Post('update')
  update(@Body() body: { id: number; data: UpdateMasterTypeDto }) {
    return this.masterTypeService.update(Number(body.id), body.data);
  }

  @Post('remove')
  remove(@Body() body: { id: number }) {
    return this.masterTypeService.remove(Number(body.id));
  }
}
