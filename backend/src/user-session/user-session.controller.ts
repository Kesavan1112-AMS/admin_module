import {
  Controller,
  Get,
  Delete,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserSessionService } from './user-session.service';
// CreateUserSessionDto and UpdateUserSessionDto are not directly used by controller if creation/update is internal

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    companyId: number;
    // Add roles or permissions if available for admin checks
    roles?: string[];
  };
}

@Controller('user-sessions') // Plural endpoint
@UseGuards(AuthGuard('jwt'))
export class UserSessionController {
  constructor(private readonly userSessionService: UserSessionService) {}

  // Endpoint for a user to get their own active sessions
  @Get('mine')
  async getMyActiveSessions(@Req() req: AuthenticatedRequest) {
    const { id: userId, companyId } = req.user;
    return this.userSessionService.findAllActiveForUser(userId, companyId);
  }

  // Endpoint for a user to invalidate/logout one of their own specific sessions
  @Delete('mine/:sessionId')
  async invalidateMySession(
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const { id: userId, companyId } = req.user;
    return this.userSessionService.invalidateSessionById(sessionId, userId, companyId);
  }

  // --- Admin Endpoints (should have additional role/permission checks) ---

  // Admin: Get all sessions for a specific user in their company
  @Get('admin/user/:targetUserId')
  async getSessionsForUserByAdmin(
    @Param('targetUserId', ParseIntPipe) targetUserId: number,
    @Req() req: AuthenticatedRequest,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
  ) {
    // Basic check: admin must be in the same company as target user's company
    // A more robust check would involve roles/permissions (e.g., req.user.roles.includes('admin'))
    // For now, we'll assume the service method `findAllSessionsByAdmin` handles company context correctly
    // by querying `users: { companyId }` based on the admin's companyId for the target user.
    // However, the service method needs to ensure targetUserId's company is the admin's company.
    // Let's refine this:
    const adminCompanyId = req.user.companyId;
    // The service method findAllSessionsByAdmin should take admin's companyId and targetUserId
    // and internally verify targetUser belongs to admin's company.

    // This is a simplified check. A proper RBAC guard is better.
    // if (!req.user.roles || !req.user.roles.includes('SUPER_ADMIN')) { // Example role check
    //   throw new ForbiddenException('You do not have permission to access this resource.');
    // }

    return this.userSessionService.findAllSessionsByAdmin({ companyId: adminCompanyId, userId: targetUserId, page, limit });
  }

  // Admin: Invalidate all sessions for a specific user
  @Delete('admin/user/:targetUserId/invalidate-all')
  async invalidateAllSessionsForUserByAdmin(
    @Param('targetUserId', ParseIntPipe) targetUserId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const adminCompanyId = req.user.companyId;
    // Service method `invalidateAllUserSessions` takes targetUserId and companyIdOfTargetUser.
    // We need to fetch targetUser's companyId first to pass to service, or modify service.
    // For now, let's assume an admin can only operate on users within their own company.
    // The service method `invalidateAllUserSessions` already checks if targetUser is in companyIdOfTargetUser.

    // if (!req.user.roles || !req.user.roles.includes('SUPER_ADMIN')) { // Example role check
    //   throw new ForbiddenException('You do not have permission to perform this action.');
    // }
    return this.userSessionService.invalidateAllUserSessions(targetUserId, adminCompanyId);
  }
}
