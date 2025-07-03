import { SetMetadata } from '@nestjs/common';

export const APPLY_BUSINESS_RULES_KEY = 'apply_business_rules';

export interface BusinessRuleMetadata {
  entityType: string;
  // eventType will be inferred (e.g., 'beforeCreate', 'beforeUpdate', 'afterRead')
  // Or can be explicitly set if needed: eventType?: string;
}

/**
 * Decorator to mark controller methods where business rules should be applied.
 * @param entityType The type of entity being processed (e.g., 'user', 'masterData').
 */
export const ApplyBusinessRules = (entityType: string) => SetMetadata(APPLY_BUSINESS_RULES_KEY, { entityType });
