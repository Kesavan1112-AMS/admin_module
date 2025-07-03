import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';
import { CreateUserSessionDto } from './dto/create-user-session.dto';

interface UserSessionCreationPayload {
    userId: number;
    token: string;
    expiresAt: Date;
    ipAddress?: string;
    userAgent?: string;
}

@Injectable()
export class UserSessionService {
  constructor(private readonly prisma: PrismaService) {}

  async createSession(payload: UserSessionCreationPayload) {
    const createDto: CreateUserSessionDto = {
        userId: payload.userId,
        token: payload.token, // This should be the unique token identifier (e.g., JTI from JWT)
        expiresAt: payload.expiresAt,
        ipAddress: payload.ipAddress,
        userAgent: payload.userAgent,
        status: 'A', // Active
    };
    // Prisma schema has updatedAt field which is auto-managed.
    return this.prisma.usersessions.create({ data: createDto });
  }

  async findActiveSessionByToken(token: string) {
    // It's crucial that the 'token' field in usersessions is indexed for performance.
    // And that it stores a unique reference (like JTI) not the full JWT if JWTs are long.
    // For this example, assuming 'token' stores what's needed for lookup.
    return this.prisma.usersessions.findFirst({
      where: {
        token: token, // This implies the token itself or its JTI is stored
        status: 'A',
        expiresAt: { gt: new Date() }, // Check for expiry
      },
    });
  }

  async invalidateToken(token: string): Promise<boolean> {
    const result = await this.prisma.usersessions.updateMany({
      where: {
        token: token, // Assuming token is the unique JWT ID (JTI)
        status: 'A',
      },
      data: { status: 'I' }, // Inactive
    });
    return result.count > 0;
  }

  async invalidateSessionById(sessionId: number, userId: number, companyId: number): Promise<boolean> {
    const session = await this.prisma.usersessions.findUnique({ where: { id: sessionId }, include: { users: true } });
    if (!session || session.users.companyId !== companyId || session.users.id !== userId) {
        throw new NotFoundException('Session not found or access denied.');
    }
    if (session.status === 'I') return true; // Already inactive

    const result = await this.prisma.usersessions.update({
      where: { id: sessionId },
      data: { status: 'I', updatedAt: new Date() }, // Explicitly set updatedAt if not auto by Prisma
    });
    return !!result;
  }

  async invalidateAllUserSessions(targetUserId: number, companyIdOfTargetUser: number): Promise<number> {
    // Ensure targetUserId belongs to companyIdOfTargetUser for safety, though Prisma relation should handle this.
    const user = await this.prisma.user.findFirst({where: {id: targetUserId, companyId: companyIdOfTargetUser}});
    if(!user) {
        throw new NotFoundException('User not found in the specified company.');
    }

    const result = await this.prisma.usersessions.updateMany({
      where: {
        userId: targetUserId,
        status: 'A',
      },
      data: { status: 'I', updatedAt: new Date() },
    });
    return result.count;
  }

  async findAllActiveForUser(userId: number, companyId: number) {
    // Ensure user belongs to company for this query as well
     const user = await this.prisma.user.findFirst({where: {id: userId, companyId: companyId}});
     if(!user) {
         throw new NotFoundException('User not found in the specified company.');
     }

    return this.prisma.usersessions.findMany({
      where: {
        userId: userId,
        status: 'A',
        expiresAt: { gt: new Date() },
      },
      select: { id: true, ipAddress: true, userAgent: true, createdAt: true, expiresAt: true }, // Don't return token
      orderBy: { createdAt: 'desc' },
    });
  }

  // Admin function to list sessions, e.g., for a specific company or user, with pagination
  async findAllSessionsByAdmin(params: { companyId: number, userId?: number, page?: number, limit?: number}) {
    const { companyId, userId, page = 1, limit = 10 } = params;
    const whereClause: any = { users: { companyId } };
    if (userId) {
        whereClause.userId = userId;
    }

    const totalRecords = await this.prisma.usersessions.count({ where: whereClause });
    const sessions = await this.prisma.usersessions.findMany({
        where: whereClause,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { users: {select: {id: true, username: true, email: true}}}
    });
    return {
        data: sessions,
        totalRecords,
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
      };
  }
}
