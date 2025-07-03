import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';
import { CreateUserCategoryDto } from './dto/create-user-category.dto';
import { UpdateUserCategoryDto } from './dto/update-user-category.dto';

@Injectable()
export class UserCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserCategoryDto) {
    const { updatedAt, ...createData } = data as any;
    return this.prisma.usercategories.create({ data: createData });
  }

  async findAll(companyId: number) {
    return this.prisma.usercategories.findMany({ where: { companyId } });
  }

  async findOne(id: number) {
    return this.prisma.usercategories.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateUserCategoryDto) {
    return this.prisma.usercategories.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.usercategories.delete({ where: { id } });
  }
}
