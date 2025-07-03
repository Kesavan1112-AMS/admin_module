import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiEndpoint, Prisma } from '@prisma/client';

@Injectable()
export class ApiEndpointsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ApiEndpointCreateInput): Promise<ApiEndpoint> {
    return this.prisma.apiEndpoint.create({
      data,
    });
  }

  async findAll(companyId: number, params: {
    skip?: number;
    take?: number;
    where?: Prisma.ApiEndpointWhereInput;
    orderBy?: Prisma.ApiEndpointOrderByWithRelationInput;
  } = {}) {
    const { skip, take, where, orderBy } = params;
    return this.prisma.apiEndpoint.findMany({
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

  async findOne(companyId: number, id: number): Promise<ApiEndpoint | null> {
    return this.prisma.apiEndpoint.findFirst({
      where: {
        id,
        companyId,
        status: 'A',
      },
    });
  }

  async findByPathAndMethod(companyId: number, path: string, method: string): Promise<ApiEndpoint | null> {
    return this.prisma.apiEndpoint.findFirst({
      where: {
        companyId,
        path,
        method,
        status: 'A',
      },
    });
  }

  async update(companyId: number, id: number, data: Prisma.ApiEndpointUpdateInput): Promise<ApiEndpoint> {
    return this.prisma.apiEndpoint.update({
      where: {
        id,
      },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async remove(companyId: number, id: number): Promise<ApiEndpoint> {
    return this.prisma.apiEndpoint.update({
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
   * Execute a dynamic SQL query
   * @param companyId The company ID for data isolation
   * @param sqlQuery The SQL query to execute
   * @param params The parameters to use in the query
   * @returns The query results
   */
  async executeSqlQuery(companyId: number, sqlQuery: string, params: Record<string, any>): Promise<any> {
    // Always include companyId in parameters for security
    const secureParams = { ...params, companyId };
    
    try {
      // Use Prisma's $queryRawUnsafe for dynamic SQL
      // This is risky but necessary for dynamic endpoints
      // Ensure the query is properly validated and sanitized before this point
      const result = await this.prisma.$queryRawUnsafe(sqlQuery, ...Object.values(secureParams));
      return result;
    } catch (error) {
      console.error('Error executing SQL query:', error);
      throw new Error(`Failed to execute dynamic SQL query: ${error.message}`);
    }
  }

  /**
   * Execute a dynamic API endpoint based on its configuration
   * @param endpoint The API endpoint configuration
   * @param params The parameters for the endpoint
   * @param userId The ID of the user making the request
   * @returns The result of the endpoint execution
   */
  async executeEndpoint(endpoint: ApiEndpoint, params: Record<string, any>, userId: number): Promise<any> {
    const handlerConfig = endpoint.handlerConfig as any;

    switch (endpoint.handlerType) {
      case 'sql':
        // For SQL handlers, execute the SQL query
        if (handlerConfig.query) {
          return this.executeSqlQuery(endpoint.companyId, handlerConfig.query, { ...params, userId });
        }
        throw new Error('SQL query not defined in handler configuration');

      case 'function':
        // For function handlers, execute a predefined function
        // This would typically be implemented in a separate service
        // For now, we'll throw an error as this requires additional implementation
        throw new Error('Function handlers are not implemented yet');

      case 'remote':
        // For remote handlers, make an HTTP request to another service
        // This would require an HTTP client to be injected
        // For now, we'll throw an error as this requires additional implementation
        throw new Error('Remote handlers are not implemented yet');

      default:
        throw new Error(`Unsupported handler type: ${endpoint.handlerType}`);
    }
  }
}
