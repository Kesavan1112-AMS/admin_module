import {
  Controller,
  Get,
  Query,
  UseGuards,
  Req,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuditLogService } from './audit-log.service';
import { FindAllAuditLogsParams } from './audit-log.service'; // Import interface if it's in the service file

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    companyId: number;
  };
}

@Controller('audit-logs') // Plural endpoint
@UseGuards(AuthGuard('jwt')) // Protected, likely admin only (further role guard needed)
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  // Create, Update, Delete endpoints are removed as audit logs are created internally
  // and should be immutable.

  @Get()
  async findAll(
    @Req() req: AuthenticatedRequest,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('userId', new ParseIntPipe({ optional: true })) userId?: number,
    @Query('entityType') entityType?: string,
    @Query('entityId', new ParseIntPipe({ optional: true })) entityId?: number,
    @Query('action') action?: string,
    @Query('startDate') startDate?: string, // Dates will be strings, parse in service or DTO
    @Query('endDate') endDate?: string,
  ) {
    const { companyId } = req.user;

    const params: FindAllAuditLogsParams = {
      companyId,
      page,
      limit,
      userId,
      entityType,
      entityId,
      action,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };
    return this.auditLogService.findAll(params);
  }
}
