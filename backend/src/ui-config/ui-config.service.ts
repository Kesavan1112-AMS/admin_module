import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';

@Injectable()
export class UiConfigService {
  constructor(private readonly prisma: PrismaService) {}

  async getMenuConfiguration(companyId: number) {
    try {
      const menuItems = await this.prisma.uiMenu.findMany({
        where: {
          companyId,
          status: 'A',
          parentId: null,
        },
        orderBy: { order: 'asc' },
        include: {
          children: {
            where: { status: 'A' },
            orderBy: { order: 'asc' },
          },
        },
      });

      const formatMenu = (items: any[]) =>
        items.map((item) => ({
          id: item.id,
          label: item.label,
          route: item.route,
          icon: item.icon,
          order: item.order,
          children:
            item.children && item.children.length > 0
              ? formatMenu(item.children)
              : undefined,
        }));

      return {
        status: 1,
        msg: 'Menu configuration retrieved successfully',
        data: formatMenu(menuItems),
      };
    } catch (error) {
      return {
        status: 0,
        msg: 'Failed to retrieve menu configuration',
        data: [],
        error: error.message,
      };
    }
  }

  async getPageConfiguration(companyId: number, pageKey: string) {
    try {
      const page = await this.prisma.uiPage.findFirst({
        where: {
          companyId,
          key: pageKey,
          status: 'A',
        },
        include: {
          columns: {
            where: { visible: true },
            orderBy: { order: 'asc' },
          },
          actions: {
            where: { visible: true },
            orderBy: { order: 'asc' },
          },
          fields: {
            where: { visible: true },
            orderBy: { order: 'asc' },
          },
        },
      });

      if (!page) {
        return {
          status: 0,
          msg: 'Page configuration not found',
          data: null,
        };
      }

      return {
        status: 1,
        msg: 'Page configuration retrieved successfully',
        data: {
          id: page.id,
          key: page.key,
          title: page.title,
          description: page.description,
          columns: page.columns,
          actions: page.actions,
          fields: page.fields,
        },
      };
    } catch (error) {
      return {
        status: 0,
        msg: 'Failed to retrieve page configuration',
        data: null,
        error: error.message,
      };
    }
  }

  async getThemeConfiguration(companyId: number) {
    try {
      const company = await this.prisma.company.findUnique({
        where: { id: companyId },
        select: { themeConfig: true },
      });

      return {
        status: 1,
        msg: 'Theme configuration retrieved successfully',
        data: company?.themeConfig || this.getDefaultTheme(),
      };
    } catch (error) {
      return {
        status: 0,
        msg: 'Failed to retrieve theme configuration',
        data: this.getDefaultTheme(),
        error: error.message,
      };
    }
  }

  private getDefaultTheme() {
    return {
      primary: '#3B82F6',
      secondary: '#6B7280',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      background: '#FFFFFF',
      surface: '#F9FAFB',
      text: '#111827',
      textSecondary: '#6B7280',
    };
  }

  async createMenu(companyId: number, menuData: any) {
    try {
      const menu = await this.prisma.uiMenu.create({
        data: {
          companyId,
          label: menuData.label,
          route: menuData.route,
          icon: menuData.icon,
          parentId: menuData.parentId,
          order: menuData.order,
          status: 'A',
        },
      });

      return {
        status: 1,
        msg: 'Menu created successfully',
        data: [menu],
      };
    } catch (error) {
      return {
        status: 0,
        msg: 'Failed to create menu',
        data: [],
        error: error.message,
      };
    }
  }

  async createPage(companyId: number, pageData: any) {
    try {
      const page = await this.prisma.uiPage.create({
        data: {
          companyId,
          key: pageData.key,
          title: pageData.title,
          description: pageData.description,
          status: 'A',
        },
      });

      // Create columns if provided
      if (pageData.columns && pageData.columns.length > 0) {
        await this.prisma.uiTableColumn.createMany({
          data: pageData.columns.map((col: any) => ({
            pageId: page.id,
            key: col.key,
            label: col.label,
            type: col.type,
            order: col.order,
            visible: col.visible !== false,
            sortable: col.sortable || false,
          })),
        });
      }

      // Create actions if provided
      if (pageData.actions && pageData.actions.length > 0) {
        await this.prisma.uiAction.createMany({
          data: pageData.actions.map((action: any) => ({
            pageId: page.id,
            key: action.key,
            label: action.label,
            order: action.order,
            visible: action.visible !== false,
          })),
        });
      }

      // Create fields if provided
      if (pageData.fields && pageData.fields.length > 0) {
        await this.prisma.uiField.createMany({
          data: pageData.fields.map((field: any) => ({
            pageId: page.id,
            key: field.key,
            label: field.label,
            type: field.type,
            required: field.required || false,
            visible: field.visible !== false,
            order: field.order,
          })),
        });
      }

      return {
        status: 1,
        msg: 'Page created successfully',
        data: [page],
      };
    } catch (error) {
      return {
        status: 0,
        msg: 'Failed to create page',
        data: [],
        error: error.message,
      };
    }
  }
}
