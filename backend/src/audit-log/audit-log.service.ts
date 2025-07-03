import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { UpdateAuditLogDto } from './dto/update-audit-log.dto';

@Injectable()
export class AuditLogService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAuditLogDto) {
    return this.prisma.auditlogs.create({ data });
  }

  async findAll(companyId: number) {
    return this.prisma.auditlogs.findMany({ where: { companyId } });
  }

  async findOne(id: number) {
    return this.prisma.auditlogs.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateAuditLogDto) {
    return this.prisma.auditlogs.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.auditlogs.delete({ where: { id } });
  }
}
