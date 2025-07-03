import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateApiEndpointDto } from './create-api-endpoint.dto';

// companyId, path, and method are generally not updatable for an existing endpoint definition.
// If they need to change, it's often better to create a new endpoint.
export class UpdateApiEndpointDto extends OmitType(PartialType(CreateApiEndpointDto), [
  'companyId',
  'path',
  'method',
  'createdBy'
] as const) {}
