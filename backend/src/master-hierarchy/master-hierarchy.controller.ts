import { Controller, Post, Body } from '@nestjs/common';
import { MasterHierarchyService } from './master-hierarchy.service';
import { CreateMasterHierarchyDto } from './dto/create-master-hierarchy.dto';
import { UpdateMasterHierarchyDto } from './dto/update-master-hierarchy.dto';

@Controller('master-hierarchy')
export class MasterHierarchyController {
  constructor(
    private readonly masterHierarchyService: MasterHierarchyService,
  ) {}

  @Post('create')
  create(@Body() body: CreateMasterHierarchyDto) {
    return this.masterHierarchyService.create(body);
  }

  @Post('find-all')
  findAll(@Body() body: { companyId: number }) {
    return this.masterHierarchyService.findAll(Number(body.companyId));
  }

  @Post('find-one')
  findOne(@Body() body: { id: number }) {
    return this.masterHierarchyService.findOne(Number(body.id));
  }

  @Post('update')
  update(@Body() body: { id: number; data: UpdateMasterHierarchyDto }) {
    return this.masterHierarchyService.update(Number(body.id), body.data);
  }

  @Post('remove')
  remove(@Body() body: { id: number }) {
    return this.masterHierarchyService.remove(Number(body.id));
  }
}
