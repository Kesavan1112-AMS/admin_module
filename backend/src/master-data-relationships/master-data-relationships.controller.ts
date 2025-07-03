import { Controller, Post, Body } from '@nestjs/common';
import { MasterDataRelationshipsService } from './master-data-relationships.service';
import { CreateMasterDataRelationshipsDto } from './dto/create-master-data-relationships.dto';
import { UpdateMasterDataRelationshipsDto } from './dto/update-master-data-relationships.dto';

@Controller('master-data-relationships')
export class MasterDataRelationshipsController {
  constructor(private readonly service: MasterDataRelationshipsService) {}

  @Post('create')
  create(@Body() body: CreateMasterDataRelationshipsDto) {
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
  update(@Body() body: { id: number; data: UpdateMasterDataRelationshipsDto }) {
    return this.service.update(Number(body.id), body.data);
  }

  @Post('remove')
  remove(@Body() body: { id: number }) {
    return this.service.remove(Number(body.id));
  }
}
