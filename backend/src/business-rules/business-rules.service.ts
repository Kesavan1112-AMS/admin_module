import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BusinessRule, Prisma } from '@prisma/client';
import { CreateBusinessRuleDto } from './dto/create-business-rule.dto';
import { UpdateBusinessRuleDto } from './dto/update-business-rule.dto';

interface FindAllBusinessRulesParams {
  companyId: number;
  page?: number;
  limit?: number;
  entityType?: string;
  eventType?: string;
  status?: string; // Allow filtering by status for admin views
  orderBy?: Prisma.BusinessRuleOrderByWithRelationInput;
}

@Injectable()
export class BusinessRulesService {
  constructor(private prisma: PrismaService) {}

  private parseJsonString(jsonString: string, fieldName: string): Prisma.JsonObject | Prisma.JsonArray {
    try {
      return JSON.parse(jsonString) as Prisma.JsonObject | Prisma.JsonArray;
    } catch (error) {
      throw new BadRequestException(`Invalid JSON format for ${fieldName}.`);
    }
  }

  async create(dto: CreateBusinessRuleDto, actingUserId: number, companyId: number): Promise<BusinessRule> {
    if (dto.companyId && dto.companyId !== companyId) {
      throw new ForbiddenException('CompanyId mismatch for business rule creation.');
    }

    const conditionJson = this.parseJsonString(dto.condition, 'condition');
    const actionJson = this.parseJsonString(dto.action, 'action');

    const dataToCreate: Prisma.BusinessRuleCreateInput = {
      name: dto.name,
      description: dto.description,
      entityType: dto.entityType,
      eventType: dto.eventType,
      condition: conditionJson,
      action: actionJson,
      priority: dto.priority ?? 0,
      status: dto.status || 'A',
      company: { connect: { id: companyId } },
      createdBy: actingUserId,
      updatedBy: actingUserId,
    };
    return this.prisma.businessRule.create({ data: dataToCreate });
  }

  async findAll(params: FindAllBusinessRulesParams) {
    const { companyId, page = 1, limit = 10, entityType, eventType, status, orderBy } = params;

    const whereClause: Prisma.BusinessRuleWhereInput = { companyId };
    if (entityType) whereClause.entityType = entityType;
    if (eventType) whereClause.eventType = eventType;
    if (status) whereClause.status = status; else whereClause.status = 'A'; // Default to active if not specified for general findAll

    const totalRecords = await this.prisma.businessRule.count({ where: whereClause });
    const rules = await this.prisma.businessRule.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: whereClause,
      orderBy: orderBy || { priority: 'desc' },
    });
    return {
        data: rules,
        totalRecords,
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
    };
  }

  async findOne(id: number, companyId: number): Promise<BusinessRule> {
    const rule = await this.prisma.businessRule.findUnique({ where: { id } });
    if (!rule || rule.companyId !== companyId) {
      throw new NotFoundException(`BusinessRule with ID ${id} not found in this company.`);
    }
    return rule;
  }

  async update(id: number, dto: UpdateBusinessRuleDto, actingUserId: number, companyId: number): Promise<BusinessRule> {
    const rule = await this.findOne(id, companyId); // Ensures rule exists and belongs to company

    const dataToUpdate: Prisma.BusinessRuleUpdateInput = { ...dto, updatedBy: actingUserId };

    if (dto.condition) {
        dataToUpdate.condition = this.parseJsonString(dto.condition, 'condition');
    }
    if (dto.action) {
        dataToUpdate.action = this.parseJsonString(dto.action, 'action');
    }

    // Remove fields that should not be updated this way
    delete (dataToUpdate as any).companyId;
    delete (dataToUpdate as any).entityType;
    delete (dataToUpdate as any).eventType;
    delete (dataToUpdate as any).createdBy;


    return this.prisma.businessRule.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async remove(id: number, companyId: number, actingUserId: number): Promise<BusinessRule> {
    await this.findOne(id, companyId); // Ensures rule exists and belongs to company
    return this.prisma.businessRule.update({
      where: { id },
      data: { status: 'D', updatedBy: actingUserId }, // Soft delete
    });
  }

  async getApplicableRules(companyId: number, entityType: string, eventType: string): Promise<BusinessRule[]> {
    return this.prisma.businessRule.findMany({
      where: { companyId, entityType, eventType, status: 'A' },
      orderBy: { priority: 'desc' },
    });
  }

  evaluateCondition(condition: any, entityData: any): boolean {
    // This evaluation logic can be significantly expanded (e.g., using a dedicated library like JSONLogic)
    // For now, keeping the existing simple evaluation
    try {
      if (!condition || typeof condition !== 'object') return true; // No condition or malformed, assume true or handle error

      const field = entityData[condition.field];
      const value = condition.value;

      switch (condition.operator) {
        case 'equals': return field === value;
        case 'notEquals': return field !== value;
        case 'contains': return typeof field === 'string' && field.includes(value);
        case 'greaterThan': return typeof field === 'number' && field > value;
        case 'lessThan': return typeof field === 'number' && field < value;
        case 'in': return Array.isArray(value) && value.includes(field);
        case 'matches': return typeof field === 'string' && new RegExp(value).test(field);
        case 'and': return Array.isArray(condition.conditions) && condition.conditions.every(c => this.evaluateCondition(c, entityData));
        case 'or': return Array.isArray(condition.conditions) && condition.conditions.some(c => this.evaluateCondition(c, entityData));
        default: return false; // Unknown operator
      }
    } catch (error) {
      console.error('Error evaluating condition:', error, 'Condition:', condition, 'EntityData:', entityData);
      return false; // Error in evaluation, treat as condition not met
    }
  }

  executeAction(action: any, entityData: any): { valid: boolean; data?: any; message?: string } {
    // This action logic can also be expanded
    // Keeping existing simple actions
     try {
      if (!action || typeof action !== 'object') return { valid: true, data: entityData }; // No action or malformed

      const resultData = { ...entityData };

      switch (action.type) {
        case 'validation':
          return { valid: false, message: action.message || 'Validation failed.' };
        case 'transform':
          if (action.field) resultData[action.field] = action.value;
          return { valid: true, data: resultData };
        case 'compute':
          if (action.field && action.expression === 'concat' && Array.isArray(action.fields)) {
            resultData[action.field] = action.fields.map(f => resultData[f]).join(action.separator || '');
          } else if (action.field && action.expression === 'sum' && Array.isArray(action.fields)) {
            resultData[action.field] = action.fields.reduce((sum, f) => sum + (Number(resultData[f]) || 0), 0);
          }
          return { valid: true, data: resultData };
        default:
          return { valid: true, data: entityData }; // Unknown action type
      }
    } catch (error) {
      console.error('Error executing action:', error, 'Action:', action, 'EntityData:', entityData);
      return { valid: false, message: 'Error executing business rule action.' };
    }
  }

  async processEntityRules(
    companyId: number,
    entityType: string,
    eventType: string,
    entityData: any,
  ): Promise<{ valid: boolean; data?: any; message?: string }> {
    const rules = await this.getApplicableRules(companyId, entityType, eventType);
    let currentData = { ...entityData };
    
    for (const rule of rules) {
      // Prisma stores JSON as Prisma.JsonValue, need to cast for evaluation if not already objects
      const condition = rule.condition as any;
      const action = rule.action as any;

      if (this.evaluateCondition(condition, currentData)) {
        const result = this.executeAction(action, currentData);
        if (!result.valid) {
          return { valid: false, message: result.message }; // Stop on first validation failure
        }
        if (result.data) {
          currentData = result.data; // Apply transformations/computations
        }
      }
    }
    return { valid: true, data: currentData };
  }
}
