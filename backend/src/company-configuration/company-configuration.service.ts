import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';
import { CreateCompanyConfigurationDto } from './dto/create-company-configuration.dto';
import { UpdateCompanyConfigurationDto } from './dto/update-company-configuration.dto';

@Injectable()
export class CompanyConfigurationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCompanyConfigurationDto) {
    const { updatedAt, ...createData } = data as any;
    return this.prisma.companyconfigurations.create({ data: createData });
  }

  async findAll(companyId: number) {
    return this.prisma.companyconfigurations.findMany({ where: { companyId } });
  }

  async findOne(id: number) {
    return this.prisma.companyconfigurations.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateCompanyConfigurationDto) {
    return this.prisma.companyconfigurations.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.companyconfigurations.delete({ where: { id } });
  }

  async getConfig(companyId: number) {
    const config = await this.prisma.companyconfigurations.findFirst({
      where: { companyId, configKey: 'ui.config' },
    });
    return {
      status: true,
      msg: 'Config fetched',
      data: config?.configValue || {},
    };
  }

  async getMenu(companyId: number) {
    const menuItems = await this.prisma.uiMenu.findMany({
      where: { companyId, status: 'A', parentId: null },
      orderBy: { order: 'asc' },
      include: { children: true },
    });
    const formatMenu = (items: any[]) =>
      items.map((item) => ({
        label: item.label,
        route: item.route,
        icon: item.icon,
        order: item.order,
        children:
          item.children && item.children.length > 0
            ? formatMenu(item.children)
            : undefined,
      }));
    return { status: true, msg: 'Menu fetched', data: formatMenu(menuItems) };
  }

  async getPage(companyId: number, pageKey: string) {
    const page = await this.prisma.uiPage.findFirst({
      where: { companyId, key: pageKey, status: 'A' },
      include: {
        columns: { orderBy: { order: 'asc' } },
        actions: { orderBy: { order: 'asc' } },
        fields: { orderBy: { order: 'asc' } },
      },
    });
    if (!page) {
      return { status: false, msg: 'Page not found', data: null };
    }
    return {
      status: true,
      msg: 'Page config fetched',
      data: {
        key: page.key,
        title: page.title,
        description: page.description,
        columns: page.columns,
        actions: page.actions,
        fields: page.fields,
      },
    };
  }

  async getTheme(companyId: number) {
    const theme = await this.prisma.companyconfigurations.findFirst({
      where: { companyId, configKey: 'ui.theme' },
    });
    return {
      status: true,
      msg: 'Theme fetched',
      data: theme?.configValue || {},
    };
  }
}
