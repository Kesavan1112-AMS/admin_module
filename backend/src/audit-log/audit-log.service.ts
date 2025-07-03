import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';

interface AuditLogActionParams {
  companyId: number;
  userId: number; // User performing the action
  entityType: string;
  entityId: number;
  action: string; // e.g., CREATE, UPDATE, DELETE, LOGIN_SUCCESS, LOGIN_FAILURE
  oldValue?: any;
  newValue?: any;
  ipAddress?: string;
  userAgent?: string;
}

interface FindAllAuditLogsParams {
  companyId: number;
  page?: number;
  limit?: number;
  userId?: number;
  entityType?: string;
  entityId?: number;
  action?: string;
  startDate?: Date;
  endDate?: Date;
}

@Injectable()
export class AuditLogService {
  constructor(private readonly prisma: PrismaService) {}

  async logAction(params: AuditLogActionParams) {
    const createDto: CreateAuditLogDto = {
      companyId: params.companyId,
      userId: params.userId,
      entityType: params.entityType,
      entityId: params.entityId,
      action: params.action,
      oldValue: params.oldValue,
      newValue: params.newValue,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    };
    return this.prisma.auditlogs.create({ data: createDto });
  }

  async findAll(params: FindAllAuditLogsParams) {
    const {
        companyId,
        page = 1,
        limit = 10,
        userId,
        entityType,
        entityId,
        action,
        startDate,
        endDate
    } = params;

    const whereClause: any = { companyId };
    if (userId) whereClause.userId = userId;
    if (entityType) whereClause.entityType = { contains: entityType, mode: 'insensitive' };
    if (entityId) whereClause.entityId = entityId;
    if (action) whereClause.action = { contains: action, mode: 'insensitive' };
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt.gte = startDate;
      if (endDate) whereClause.createdAt.lte = endDate;
    }

    const totalRecords = await this.prisma.auditlogs.count({ where: whereClause });
    const auditLogs = await this.prisma.auditlogs.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        users: { select: { id: true, username: true, email: true } }, // User who performed the action
      },
    });

    return {
      data: auditLogs,
      totalRecords,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
    };
  }

  // findOne, update, and remove are not appropriate for audit logs.
}
