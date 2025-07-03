import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BusinessRule, Prisma } from '@prisma/client';

@Injectable()
export class BusinessRulesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.BusinessRuleCreateInput): Promise<BusinessRule> {
    return this.prisma.businessRule.create({
      data,
    });
  }

  async findAll(companyId: number, params: {
    skip?: number;
    take?: number;
    where?: Prisma.BusinessRuleWhereInput;
    orderBy?: Prisma.BusinessRuleOrderByWithRelationInput;
  } = {}) {
    const { skip, take, where, orderBy } = params;
    return this.prisma.businessRule.findMany({
      skip,
      take,
      where: {
        ...where,
        companyId,
        status: 'A',
      },
      orderBy,
    });
  }

  async findOne(companyId: number, id: number): Promise<BusinessRule | null> {
    return this.prisma.businessRule.findFirst({
      where: {
        id,
        companyId,
        status: 'A',
      },
    });
  }

  async update(companyId: number, id: number, data: Prisma.BusinessRuleUpdateInput): Promise<BusinessRule> {
    return this.prisma.businessRule.update({
      where: {
        id,
      },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async remove(companyId: number, id: number): Promise<BusinessRule> {
    return this.prisma.businessRule.update({
      where: {
        id,
      },
      data: {
        status: 'I',
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Get all applicable business rules for a specific entity and event
   */
  async getApplicableRules(companyId: number, entityType: string, eventType: string): Promise<BusinessRule[]> {
    return this.prisma.businessRule.findMany({
      where: {
        companyId,
        entityType,
        eventType,
        status: 'A',
      },
      orderBy: {
        priority: 'desc', // Higher priority rules first
      },
    });
  }

  /**
   * Evaluate a rule condition against entity data
   * @param condition The rule condition JSON
   * @param entityData The entity data to evaluate against
   * @returns boolean indicating if condition is met
   */
  evaluateCondition(condition: any, entityData: any): boolean {
    try {
      // Simple condition evaluation
      if (condition.operator === 'equals') {
        return entityData[condition.field] === condition.value;
      } else if (condition.operator === 'notEquals') {
        return entityData[condition.field] !== condition.value;
      } else if (condition.operator === 'contains') {
        return entityData[condition.field]?.includes(condition.value);
      } else if (condition.operator === 'greaterThan') {
        return entityData[condition.field] > condition.value;
      } else if (condition.operator === 'lessThan') {
        return entityData[condition.field] < condition.value;
      } else if (condition.operator === 'in') {
        return condition.value.includes(entityData[condition.field]);
      } else if (condition.operator === 'matches') {
        const regex = new RegExp(condition.value);
        return regex.test(entityData[condition.field]);
      } else if (condition.operator === 'and' && Array.isArray(condition.conditions)) {
        return condition.conditions.every(c => this.evaluateCondition(c, entityData));
      } else if (condition.operator === 'or' && Array.isArray(condition.conditions)) {
        return condition.conditions.some(c => this.evaluateCondition(c, entityData));
      }
      return false;
    } catch (error) {
      console.error('Error evaluating condition:', error);
      return false;
    }
  }

  /**
   * Execute the rule action on entity data
   * @param action The rule action JSON
   * @param entityData The entity data to apply the action to
   * @returns The modified entity data or validation error
   */
  executeAction(action: any, entityData: any): { valid: boolean; data?: any; message?: string } {
    try {
      if (action.type === 'validation') {
        return {
          valid: false,
          message: action.message,
        };
      } else if (action.type === 'transform') {
        const result = { ...entityData };
        result[action.field] = action.value;
        return {
          valid: true,
          data: result,
        };
      } else if (action.type === 'compute') {
        // Simple expression evaluation for computed fields
        const result = { ...entityData };
        if (action.expression === 'concat') {
          result[action.field] = action.fields.map(f => entityData[f]).join(action.separator || '');
        } else if (action.expression === 'sum') {
          result[action.field] = action.fields.reduce((sum, f) => sum + (Number(entityData[f]) || 0), 0);
        }
        return {
          valid: true,
          data: result,
        };
      }
      return { valid: true, data: entityData };
    } catch (error) {
      console.error('Error executing action:', error);
      return { valid: false, message: 'Error executing business rule action' };
    }
  }

  /**
   * Process an entity through all applicable business rules
   * @param companyId The company ID
   * @param entityType The entity type (e.g., 'masterData', 'user')
   * @param eventType The event type (e.g., 'create', 'update')
   * @param entityData The entity data to process
   * @returns The processed entity data or validation error
   */
  async processEntityRules(
    companyId: number,
    entityType: string,
    eventType: string,
    entityData: any,
  ): Promise<{ valid: boolean; data?: any; message?: string }> {
    // Get all applicable rules for this entity and event
    const rules = await this.getApplicableRules(companyId, entityType, eventType);
    
    let processedData = { ...entityData };
    let isValid = true;
let errorMessage: string | undefined = '';

    // Process each rule in priority order
    for (const rule of rules) {
      const condition = rule.condition as any;
      const action = rule.action as any;

      // Check if rule condition applies to this entity
      if (this.evaluateCondition(condition, processedData)) {
        // Apply the rule action
        const result = this.executeAction(action, processedData);
        
        if (!result.valid) {
          isValid = false;
          errorMessage = result.message;
          break;
        }
        
        if (result.data) {
          processedData = result.data;
        }
      }
    }

    return {
      valid: isValid,
      data: isValid ? processedData : undefined,
      message: !isValid ? errorMessage : undefined,
    };
  }
}
