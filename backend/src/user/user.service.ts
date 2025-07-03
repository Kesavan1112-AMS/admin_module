import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findByUsername(companyId: number, username: string) {
    return this.prisma.user.findUnique({
      where: { companyId_username: { companyId, username } },
    });
  }

  async findByEmail(companyId: number, email: string) {
    return this.prisma.user.findUnique({
      where: { companyId_email: { companyId, email } },
    });
  }

  async createUser(data: any) {
    return this.prisma.user.create({ data });
  }

  // Add more user management methods as needed
}
