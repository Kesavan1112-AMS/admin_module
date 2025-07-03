import { Controller, Post, Body } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { UpdateAuditLogDto } from './dto/update-audit-log.dto';

@Controller('audit-log')
export class AuditLogController {
  constructor(private readonly service: AuditLogService) {}

  @Post('create')
  create(@Body() body: CreateAuditLogDto) {
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
  update(@Body() body: { id: number; data: UpdateAuditLogDto }) {
    return this.service.update(Number(body.id), body.data);
  }

  @Post('remove')
  remove(@Body() body: { id: number }) {
    return this.service.remove(Number(body.id));
  }
}
