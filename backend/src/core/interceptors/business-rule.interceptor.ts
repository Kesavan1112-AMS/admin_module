import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { BusinessRulesService } from '../../business-rules/business-rules.service';
import { APPLY_BUSINESS_RULES_KEY, BusinessRuleMetadata } from '../decorators/apply-business-rules.decorator';

@Injectable()
export class BusinessRuleInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly businessRulesService: BusinessRulesService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const ruleMetadata = this.reflector.get<BusinessRuleMetadata>(
      APPLY_BUSINESS_RULES_KEY,
      context.getHandler(),
    );

    if (!ruleMetadata) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const { user, body, method, params } = request; // Added params
    const { entityType } = ruleMetadata;

    if (!user || !user.companyId) {
      // Should be caught by AuthGuard, but as a safeguard
      throw new HttpException('User or company context not found.', HttpStatus.UNAUTHORIZED);
    }

    const companyId = user.companyId;
    let eventType = '';
    let processRules = false;

    if (method === 'POST') {
      eventType = 'beforeCreate';
      processRules = !!body;
    } else if (method === 'PATCH' || method === 'PUT') {
      eventType = 'beforeUpdate';
      processRules = !!body;
    }
    // 'beforeDelete' will be handled in service layer to have access to entity data.
    // 'afterRead' etc. would be handled in the 'tap' or 'map' operator below.

    if (processRules) {
      console.log(`[BusinessRuleInterceptor] Processing ${eventType} for ${entityType}`);
      const result = await this.businessRulesService.processEntityRules(
        companyId,
        entityType,
        eventType,
        body, // body is used for beforeCreate and beforeUpdate
      );

      if (!result.valid) {
        throw new HttpException(
          result.message || `Business rule validation failed for ${entityType}.`,
          HttpStatus.BAD_REQUEST,
        );
      }
      if (result.data) {
        request.body = result.data; // Modify the request body with transformed data
      }
    }

    return next.handle().pipe(
      // --- "After" event processing (e.g., 'afterRead', 'afterCreate', 'afterUpdate') ---
      // Example for 'afterRead' - GET requests
      // This is more complex as it depends on what data is returned.
      // For now, focusing on "before" CUD events.
      tap(async (data) => {
        // if (method === 'GET' && ruleMetadata.entityType) {
        //   const afterReadEventType = 'afterRead';
        //   // `data` here is the response from the controller
        //   // Business rules might modify this data before sending to client
        //   // This requires careful handling as `processEntityRules` might not be suitable for all response shapes
        //   console.log(`[BusinessRuleInterceptor] Processing ${afterReadEventType} for ${entityType}`);
        //   // const result = await this.businessRulesService.processEntityRules(
        //   //   companyId,
        //   //   entityType,
        //   //   afterReadEventType,
        //   //   data, // This might be an array or single object
        //   // );
        //   // if (result.data) { /* modify data if needed */ }
        // }
      })
    );
  }
}
