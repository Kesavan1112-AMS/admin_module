import { Injectable, NotFoundException, ForbiddenException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiEndpoint, Prisma } from '@prisma/client';
import { CreateApiEndpointDto } from './dto/create-api-endpoint.dto';
import { UpdateApiEndpointDto } from './dto/update-api-endpoint.dto';
import { UserPrivilegeService } from '../user-privilege/user-privilege.service'; // Added

interface FindAllApiEndpointsParams {
  companyId: number;
  page?: number;
  limit?: number;
  status?: string;
  orderBy?: Prisma.ApiEndpointOrderByWithRelationInput;
}

@Injectable()
export class ApiEndpointsService {
  constructor(
    private prisma: PrismaService,
    // private rolePrivilegeService: RolePrivilegeService, // Inject if checking privileges
  ) {}

  private parseJsonStringSafe(jsonString: string | undefined, fieldName: string): Prisma.JsonValue | undefined {
    if (jsonString === undefined || jsonString === null) return undefined;
    try {
      return JSON.parse(jsonString) as Prisma.JsonValue;
    } catch (error) {
      throw new BadRequestException(`Invalid JSON format for ${fieldName}.`);
    }
  }

  async create(dto: CreateApiEndpointDto, actingUserId: number, companyId: number): Promise<ApiEndpoint> {
    if (dto.companyId && dto.companyId !== companyId) {
      throw new ForbiddenException('CompanyId mismatch for API endpoint creation.');
    }

    const existing = await this.prisma.apiEndpoint.findUnique({
        where: { companyId_path_method: { companyId, path: dto.path, method: dto.method }}
    });
    if (existing && existing.status !== 'D') {
        throw new ConflictException(`API endpoint with path '${dto.path}' and method '${dto.method}' already exists for this company.`);
    }

    if (dto.requiredPrivilegeId) {
      const privilege = await this.prisma.privilegemaster.findFirst({ where: { id: dto.requiredPrivilegeId, companyId }});
      if (!privilege) {
        throw new NotFoundException(`RequiredPrivilegeId ${dto.requiredPrivilegeId} not found in this company.`);
      }
    }

    const handlerConfigJson = this.parseJsonStringSafe(dto.handlerConfig, 'handlerConfig');

    const dataToCreate: Prisma.ApiEndpointCreateInput = {
      path: dto.path,
      method: dto.method,
      handlerType: dto.handlerType,
      handlerConfig: handlerConfigJson || Prisma.JsonNull,
      status: dto.status || 'A',
      company: { connect: { id: companyId } },
      createdBy: actingUserId,
      updatedBy: actingUserId,
      ...(dto.requiredPrivilegeId && { privilege: { connect: { id: dto.requiredPrivilegeId } } }),
    };
    return this.prisma.apiEndpoint.create({ data: dataToCreate });
  }

  async findAll(params: FindAllApiEndpointsParams) {
    const { companyId, page = 1, limit = 10, status, orderBy } = params;
    const whereClause: Prisma.ApiEndpointWhereInput = { companyId };
    if (status) whereClause.status = status; else whereClause.status = 'A';

    const totalRecords = await this.prisma.apiEndpoint.count({ where: whereClause });
    const endpoints = await this.prisma.apiEndpoint.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: whereClause,
      orderBy: orderBy || { path: 'asc' },
      include: { privilege: true }
    });
     return {
        data: endpoints,
        totalRecords,
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
    };
  }

  async findOne(id: number, companyId: number): Promise<ApiEndpoint> {
    const endpoint = await this.prisma.apiEndpoint.findUnique({ where: { id }, include: { privilege: true } });
    if (!endpoint || endpoint.companyId !== companyId) {
      throw new NotFoundException(`API Endpoint with ID ${id} not found in this company.`);
    }
    return endpoint;
  }

  async findByPathAndMethod(companyId: number, path: string, method: string): Promise<ApiEndpoint | null> {
    return this.prisma.apiEndpoint.findUnique({ // Path+Method+Company is unique
      where: {
        companyId_path_method: { companyId, path, method },
        status: 'A' // Only active endpoints can be executed
    },
    include: { privilege: true }
    });
  }

  async update(id: number, dto: UpdateApiEndpointDto, actingUserId: number, companyId: number): Promise<ApiEndpoint> {
    const endpoint = await this.findOne(id, companyId); // Ensures endpoint exists and belongs to company

    if (dto.requiredPrivilegeId && dto.requiredPrivilegeId !== endpoint.requiredPrivilegeId) {
      const privilege = await this.prisma.privilegemaster.findFirst({ where: { id: dto.requiredPrivilegeId, companyId }});
      if (!privilege) {
        throw new NotFoundException(`New RequiredPrivilegeId ${dto.requiredPrivilegeId} not found in this company.`);
      }
    }

    const dataToUpdate: Prisma.ApiEndpointUpdateInput = {
        updatedBy: actingUserId,
        ...(dto.handlerType && { handlerType: dto.handlerType }),
        ...(dto.handlerConfig && { handlerConfig: this.parseJsonStringSafe(dto.handlerConfig, 'handlerConfig') || Prisma.JsonNull }),
        ...(dto.status && { status: dto.status }),
        ...(dto.requiredPrivilegeId && { privilege: { connect: { id: dto.requiredPrivilegeId } } }),
    };
    if (dto.requiredPrivilegeId === null) { // Explicitly set to null if DTO sends null
        dataToUpdate.privilege = { disconnect: true };
    }


    return this.prisma.apiEndpoint.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async remove(id: number, companyId: number, actingUserId: number): Promise<ApiEndpoint> {
    await this.findOne(id, companyId); // Ensures endpoint exists and belongs to company
    return this.prisma.apiEndpoint.update({
      where: { id },
      data: { status: 'D', updatedBy: actingUserId }, // Soft delete
    });
  }

  async executeSqlQuery(companyId: number, sqlQuery: string, params: Record<string, any>): Promise<any> {
    // IMPORTANT: sqlQuery MUST come from trusted storage (handlerConfig), NOT from user input in the request.
    // Parameters should be named in the query string e.g. @paramName or $paramName (depending on DB & Prisma raw query conventions)
    // Prisma's $queryRaw and $executeRaw typically use template literals with `${ Prisma.sql`...`}` for safety
    // or pass parameters as subsequent arguments.
    // For $queryRawUnsafe, it's critical that `sqlQuery` is fixed and only `params` vary.
    // For this example, assuming `sqlQuery` is safe and `params` are used as values.
    // A more robust solution would involve parsing `sqlQuery` for placeholders and mapping `params` carefully.
    
    // Example: If query is "SELECT * FROM users WHERE companyId = $1 AND id = $2"
    // Then params should be [companyId, params.someUserId]
    // The current implementation `...Object.values(secureParams)` might not map correctly if order is not guaranteed
    // or if the query expects named parameters.
    // For now, this is a placeholder for a more secure dynamic SQL execution strategy.

    // This is a simplified and potentially UNSAFE example.
    // Production use would require a much more robust and secure way to handle dynamic SQL.
    // Consider using a query builder or stored procedures if possible for more complex dynamic needs.
    const secureParams = { ...params, companyId }; // Ensure companyId is part of the context

    try {
      // This is a placeholder. Actual implementation needs careful security review.
      // For instance, if SQL has placeholders like ?, ?, then values must be in order.
      // If SQL has named placeholders, a different approach for $queryRawUnsafe may be needed or use $queryRaw.
      console.warn("Executing potentially unsafe SQL query. Ensure query string is from trusted storage and parameters are sanitized/typed.", sqlQuery, secureParams);
      const result = await this.prisma.$queryRawUnsafe(sqlQuery, ...Object.values(secureParams).map(val => String(val))); // Example, forcing string conversion
      return result;
    } catch (error) {
      console.error('Error executing SQL query:', error);
      throw new Error(`Failed to execute dynamic SQL query: ${error.message}`);
    }
  }

  async executeEndpoint(endpoint: ApiEndpoint, params: Record<string, any>, reqUser: {id: number, companyId: number, roles?: string[]}): Promise<any> {
    // 1. Authorization Check (Placeholder - needs proper RBAC service)
    if (endpoint.requiredPrivilegeId) {
        // const userHasPrivilege = await this.rolePrivilegeService.checkUserPrivilege(reqUser.id, endpoint.requiredPrivilegeId, reqUser.companyId);
        // if (!userHasPrivilege) {
        //   throw new ForbiddenException('User does not have the required privilege for this endpoint.');
        // }
        console.warn(`TODO: Implement privilege check for endpoint ${endpoint.id}, required: ${endpoint.requiredPrivilegeId}`);
    }

    const handlerConfig = endpoint.handlerConfig as Prisma.JsonObject; // Already parsed JSON

    switch (endpoint.handlerType) {
      case 'sql':
        if (handlerConfig && typeof handlerConfig.query === 'string') {
          // Pass reqUser for potential use in query params (e.g. @currentUserId)
          return this.executeSqlQuery(endpoint.companyId, handlerConfig.query, { ...params, currentUserId: reqUser.id });
        }
        throw new BadRequestException('SQL query not defined or invalid in handler configuration for SQL endpoint.');
      case 'function':
        throw new Error('Function handlers are not implemented yet');
      case 'remote':
        throw new Error('Remote handlers are not implemented yet');
      default:
        throw new Error(`Unsupported handler type: ${endpoint.handlerType}`);
    }
  }
}
