import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateBusinessRuleDto } from './create-business-rule.dto';

// companyId, entityType, eventType are generally not updatable for an existing rule.
// If they need to change, it's often better to create a new rule.
export class UpdateBusinessRuleDto extends OmitType(PartialType(CreateBusinessRuleDto), [
  'companyId',
  'entityType',
  'eventType',
  'createdBy'
] as const) {}
