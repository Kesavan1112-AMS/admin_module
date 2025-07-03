import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.company.findMany({
      where: { status: 'A' },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.company.findUnique({
      where: { id },
      include: {
        companyconfigurations: true,
      },
    });
  }

  async findByCode(code: string) {
    return this.prisma.company.findUnique({
      where: { code },
      include: {
        companyconfigurations: true,
      },
    });
  }

  async create(data: any) {
    return this.prisma.company.create({
      data,
      include: {
        companyconfigurations: true,
      },
    });
  }

  async update(id: number, data: any) {
    return this.prisma.company.update({
      where: { id },
      data,
      include: {
        companyconfigurations: true,
      },
    });
  }

  async delete(id: number) {
    return this.prisma.company.update({
      where: { id },
      data: { status: 'I' },
    });
  }

  // Company Configuration Management
  async getConfiguration(companyId: number, configKey: string) {
    return this.prisma.companyconfigurations.findUnique({
      where: {
        companyId_configKey: {
          companyId,
          configKey,
        },
      },
    });
  }

  async setConfiguration(
    companyId: number,
    configKey: string,
    configValue: any,
    description?: string,
  ) {
    const now = new Date();
    return this.prisma.companyconfigurations.upsert({
      where: {
        companyId_configKey: {
          companyId,
          configKey,
        },
      },
      update: {
        configValue,
        description,
        updatedAt: now,
      },
      create: {
        companyId,
        configKey,
        configValue,
        description,
        status: 'A',
        createdAt: now,
        updatedAt: now,
      },
    });
  }

  async getMenuConfiguration(companyId: number) {
    const config = await this.getConfiguration(companyId, 'menu');
    return config?.configValue || this.getDefaultMenu();
  }

  async getThemeConfiguration(companyId: number) {
    const config = await this.getConfiguration(companyId, 'theme');
    return config?.configValue || this.getDefaultTheme();
  }

  async getPageConfiguration(companyId: number, pageName: string) {
    const config = await this.getConfiguration(companyId, `page_${pageName}`);
    return config?.configValue || this.getDefaultPageConfig(pageName);
  }

  private getDefaultMenu() {
    return [
      {
        label: 'Company Management',
        route: '/company-management',
        icon: '🏢',
        requiredPrivilege: 'company_manage',
      },
      {
        label: 'User Management',
        route: '/user-management',
        icon: '👤',
        requiredPrivilege: 'user_manage',
      },
      {
        label: 'Master Data',
        icon: '📊',
        children: [
          {
            label: 'Master Types',
            route: '/master-types',
            requiredPrivilege: 'master_type_view',
          },
          {
            label: 'Master Data',
            route: '/master-data',
            requiredPrivilege: 'master_data_view',
          },
        ],
      },
    ];
  }

  private getDefaultTheme() {
    return {
      primaryColor: '#15396a',
      secondaryColor: '#1e4a8a',
      backgroundColor: '#f6f8fa',
      textColor: '#333333',
      borderRadius: '8px',
      fontFamily: 'Inter, sans-serif',
    };
  }

  private getDefaultPageConfig(pageName: string) {
    const defaults = {
      'company-management': {
        title: 'Company Management',
        description: 'Manage company information and settings',
        columns: [
          { key: 'name', label: 'Company Name', sortable: true },
          { key: 'code', label: 'Code', sortable: true },
          { key: 'status', label: 'Status', type: 'toggle' },
        ],
        actions: ['create', 'edit', 'delete', 'export'],
        requiredPrivileges: [
          'company_view',
          'company_create',
          'company_edit',
          'company_delete',
        ],
      },
      'user-management': {
        title: 'User Management',
        description: 'Manage users and their permissions',
        columns: [
          { key: 'username', label: 'Username', sortable: true },
          { key: 'email', label: 'Email', sortable: true },
          { key: 'userCategory', label: 'Role', sortable: true },
          { key: 'status', label: 'Status', type: 'toggle' },
        ],
        actions: ['create', 'edit', 'delete', 'export'],
        requiredPrivileges: [
          'user_view',
          'user_create',
          'user_edit',
          'user_delete',
        ],
      },
    };

    return defaults[pageName] || {};
  }
}
