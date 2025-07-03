import { Controller, Post, Body } from '@nestjs/common';
import { PrivilegeMasterService } from './privilege-master.service';
import { CreatePrivilegeMasterDto } from './dto/create-privilege-master.dto';
import { UpdatePrivilegeMasterDto } from './dto/update-privilege-master.dto';

@Controller('privilege-master')
export class PrivilegeMasterController {
  constructor(
    private readonly privilegeMasterService: PrivilegeMasterService,
  ) {}

  @Post('create')
  create(@Body() body: CreatePrivilegeMasterDto) {
    return this.privilegeMasterService.create(body);
  }

  @Post('find-all')
  findAll(@Body() body: { companyId: number }) {
    return this.privilegeMasterService.findAll(Number(body.companyId));
  }

  @Post('find-one')
  findOne(@Body() body: { id: number }) {
    return this.privilegeMasterService.findOne(Number(body.id));
  }

  @Post('update')
  update(@Body() body: { id: number; data: UpdatePrivilegeMasterDto }) {
    return this.privilegeMasterService.update(Number(body.id), body.data);
  }

  @Post('remove')
  remove(@Body() body: { id: number }) {
    return this.privilegeMasterService.remove(Number(body.id));
  }
}
