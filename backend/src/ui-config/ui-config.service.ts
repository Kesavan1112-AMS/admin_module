import { Injectable, NotFoundException, ForbiddenException, ConflictException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../core/services/prisma.service';
import { CreateUiMenuDto } from './dto/create-ui-menu.dto';
import { UpdateUiMenuDto } from './dto/update-ui-menu.dto';
import { CreateUiPageWithDetailsDto } from './dto/create-ui-page.dto';
import { UpdateUiPageWithDetailsDto } from './dto/update-ui-page.dto';
import { Prisma } from '@prisma/client';
import { BusinessRulesService } from '../business-rules/business-rules.service'; // Added

@Injectable()
export class UiConfigService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly businessRulesService: BusinessRulesService, // Injected
    ) {}

  // --- Menu Configuration (Runtime Fetch) ---
  async getMenuConfiguration(companyId: number) {
    // This method remains largely the same, used by frontend to fetch live menu
    const menuItems = await this.prisma.uiMenu.findMany({
      where: { companyId, status: 'A', parentId: null },
      orderBy: { order: 'asc' },
      include: {
        children: {
          where: { status: 'A' },
          orderBy: { order: 'asc' },
          include: { children: true } // Recursive fetch if more levels needed, or handle on client
        },
      },
    });
    // Recursive formatting can be complex, Prisma's include handles nesting.
    // The service should return data that's easy for the client to use.
    return menuItems;
  }

  // --- Page Configuration (Runtime Fetch) ---
  async getPageConfiguration(companyId: number, pageKey: string) {
    const page = await this.prisma.uiPage.findFirst({
      where: { companyId, key: pageKey, status: 'A' },
      include: {
        columns: { where: { visible: true }, orderBy: { order: 'asc' } },
        actions: { where: { visible: true }, orderBy: { order: 'asc' } },
        fields: { where: { visible: true }, orderBy: { order: 'asc' } },
      },
    });
    if (!page) {
      throw new NotFoundException(`Page configuration with key '${pageKey}' not found.`);
    }
    return page;
  }

  // --- Theme Configuration (Runtime Fetch) ---
  async getThemeConfiguration(companyId: number) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      select: { themeConfig: true },
    });
    if (!company) {
        throw new NotFoundException(`Company with ID ${companyId} not found.`);
    }
    return company.themeConfig || this.getDefaultTheme();
  }

  private getDefaultTheme() { // This can be moved to a config file or constants
    return { /* ... default theme properties ... */ };
  }

  // --- CRUD for UiMenu (Admin Operations) ---
  async createMenu(dto: CreateUiMenuDto, actingUserId: number, companyId: number) {
    if (dto.companyId && dto.companyId !== companyId) {
      throw new ForbiddenException("Cannot create menu for another company.");
    }
    if (dto.parentId) {
      const parentMenu = await this.prisma.uiMenu.findFirst({ where: { id: dto.parentId, companyId }});
      if (!parentMenu) {
        throw new NotFoundException(`Parent menu with ID ${dto.parentId} not found in this company.`);
      }
    }
    const dataToCreate = {
      ...dto,
      companyId: companyId,
      status: dto.status || 'A',
      createdBy: actingUserId,
      updatedBy: actingUserId,
    };
    return this.prisma.uiMenu.create({ data: dataToCreate });
  }

  async findAllMenus(companyId: number) {
    return this.prisma.uiMenu.findMany({
        where: { companyId }, // Fetch all statuses for admin view
        orderBy: [{ parentId: 'asc' }, { order: 'asc' }],
        include: { children: true }
    });
  }

  async findOneMenu(id: number, companyId: number) {
    const menu = await this.prisma.uiMenu.findUnique({ where: {id}});
    if(!menu || menu.companyId !== companyId) {
        throw new NotFoundException(`Menu with ID ${id} not found in this company.`);
    }
    return menu;
  }

  async updateMenu(id: number, dto: UpdateUiMenuDto, actingUserId: number, companyId: number) {
    const menuToUpdate = await this.findOneMenu(id, companyId); // Ensures it belongs to company

    if (dto.parentId && dto.parentId !== menuToUpdate.parentId) {
        if (dto.parentId === id) throw new ConflictException("Menu cannot be its own parent.");
        const parentMenu = await this.prisma.uiMenu.findFirst({ where: { id: dto.parentId, companyId }});
        if (!parentMenu) {
          throw new NotFoundException(`New parent menu with ID ${dto.parentId} not found in this company.`);
        }
    }
    const dataToUpdate = { ...dto, updatedBy: actingUserId };
    return this.prisma.uiMenu.update({ where: { id }, data: dataToUpdate });
  }

  async deleteMenu(id: number, companyId: number, actingUserId: number) {
    const menuToDelete = await this.findOneMenu(id, companyId); // Ensures it belongs to company
    const childrenCount = await this.prisma.uiMenu.count({where: {parentId: id, status: 'A'}});
    if (childrenCount > 0) {
        throw new ConflictException("Cannot delete menu with active children. Please delete or re-parent children first.");
    }
    return this.prisma.uiMenu.update({ where: { id }, data: { status: 'D', updatedBy: actingUserId } });
  }

  // --- CRUD for UiPage & Details (Admin Operations) ---
  async createPageWithDetails(dto: CreateUiPageWithDetailsDto, actingUserId: number, companyId: number) {
    if (dto.companyId && dto.companyId !== companyId) {
      throw new ForbiddenException("Cannot create page for another company.");
    }

    const { columns, actions, fields, ...pageData } = dto;

    return this.prisma.$transaction(async (tx) => {
      const newPage = await tx.uiPage.create({
        data: {
          ...pageData,
          companyId: companyId,
          status: pageData.status || 'A',
          createdBy: actingUserId,
          updatedBy: actingUserId,
        },
      });

      if (columns && columns.length > 0) {
        await tx.uiTableColumn.createMany({
          data: columns.map(col => ({ ...col, pageId: newPage.id })),
        });
      }
      if (actions && actions.length > 0) {
        await tx.uiAction.createMany({
          data: actions.map(act => ({ ...act, pageId: newPage.id })),
        });
      }
      if (fields && fields.length > 0) {
        await tx.uiField.createMany({
          data: fields.map(fld => ({
            ...fld,
            pageId: newPage.id,
            validation: fld.validation ? JSON.parse(fld.validation) as Prisma.JsonObject : undefined,
            options: fld.options ? JSON.parse(fld.options) as Prisma.JsonArray : undefined,
        })),
        });
      }
      return newPage;
    });
  }

  async findAllPages(companyId: number) {
    return this.prisma.uiPage.findMany({
        where: { companyId }, // Fetch all statuses for admin view
        orderBy: { key: 'asc' },
    });
  }

  async findOnePage(id: number, companyId: number) {
    const page = await this.prisma.uiPage.findUnique({
        where: {id},
        include: { columns: true, actions: true, fields: true }
    });
    if(!page || page.companyId !== companyId) {
        throw new NotFoundException(`Page with ID ${id} not found in this company.`);
    }
    return page;
  }

  async updatePageWithDetails(id: number, dto: UpdateUiPageWithDetailsDto, actingUserId: number, companyId: number) {
    const pageToUpdate = await this.findOnePage(id, companyId); // Ensures it belongs to company
    const { columns, actions, fields, ...pageData } = dto;

    return this.prisma.$transaction(async (tx) => {
      const updatedPage = await tx.uiPage.update({
        where: { id },
        data: {
          ...pageData,
          updatedBy: actingUserId,
        },
      });

      // Replace strategy for sub-details
      if (columns !== undefined) {
        await tx.uiTableColumn.deleteMany({ where: { pageId: id } });
        if (columns.length > 0) await tx.uiTableColumn.createMany({ data: columns.map(col => ({ ...col, pageId: id })) });
      }
      if (actions !== undefined) {
        await tx.uiAction.deleteMany({ where: { pageId: id } });
        if (actions.length > 0) await tx.uiAction.createMany({ data: actions.map(act => ({ ...act, pageId: id })) });
      }
      if (fields !== undefined) {
        await tx.uiField.deleteMany({ where: { pageId: id } });
        if (fields.length > 0) await tx.uiField.createMany({
            data: fields.map(fld => ({
                ...fld,
                pageId: id,
                validation: fld.validation ? JSON.parse(fld.validation) as Prisma.JsonObject : undefined,
                options: fld.options ? JSON.parse(fld.options) as Prisma.JsonArray : undefined,
            }))
        });
      }
      return updatedPage; // Or fetch the full page with details again: await this.findOnePage(id, companyId)
    });
  }

  async deletePage(id: number, companyId: number, actingUserId: number) {
    await this.findOnePage(id, companyId); // Ensures it belongs to company
    // Soft delete page and its children (if desired, or hard delete children)
    // For simplicity, soft-delete only the page. Children might become orphans or need specific handling.
    // A better approach might be to soft-delete children too, or prevent page deletion if children are critical.
    return this.prisma.uiPage.update({
        where: {id},
        data: { status: 'D', updatedBy: actingUserId }
    });
    // If children should also be soft-deleted:
    // return this.prisma.$transaction(async (tx) => {
    //   await tx.uiTableColumn.updateMany({ where: { pageId: id }, data: { /* status: 'D' or similar if applicable */ } });
    //   await tx.uiAction.updateMany({ where: { pageId: id }, data: { /* status: 'D' */ } });
    //   await tx.uiField.updateMany({ where: { pageId: id }, data: { /* status: 'D' */ } });
    //   return tx.uiPage.update({ where: {id}, data: { status: 'D', updatedBy: actingUserId }});
    // });
  }
}
