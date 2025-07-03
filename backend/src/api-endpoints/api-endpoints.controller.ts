import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req, // Standardized
  All,
  HttpException,
  HttpStatus,
  Query,
  ParseIntPipe,
  DefaultValuePipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'; // Standardized
import { ApiEndpointsService } from './api-endpoints.service';
import { CreateApiEndpointDto } from './dto/create-api-endpoint.dto';
import { UpdateApiEndpointDto } from './dto/update-api-endpoint.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

interface AuthenticatedRequest extends Request { // Standardized
  user: {
    id: number;
    companyId: number;
    roles?: string[]; // For privilege checks
  };
}

@ApiTags('api-endpoints-management') // For managing endpoint definitions
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('admin/api-endpoints') // Scoped under admin
export class ApiEndpointsManagementController { // Renamed for clarity
  constructor(private readonly apiEndpointsService: ApiEndpointsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new API endpoint definition' })
  @ApiResponse({ status: 201, description: 'The API endpoint definition has been successfully created.' })
  create(@Req() req: AuthenticatedRequest, @Body() createDto: CreateApiEndpointDto) {
    const { companyId, id: actingUserId } = req.user;
    return this.apiEndpointsService.create(createDto, actingUserId, companyId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all API endpoint definitions for the company' })
  @ApiResponse({ status: 200, description: 'List of API endpoint definitions.' })
  findAll(
    @Req() req: AuthenticatedRequest,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('status') status?: string,
    ) {
    const { companyId } = req.user;
    return this.apiEndpointsService.findAll({ companyId, page, limit, status });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an API endpoint definition by ID' })
  @ApiResponse({ status: 200, description: 'The API endpoint definition.' })
  @ApiResponse({ status: 404, description: 'API endpoint definition not found.' })
  findOne(@Req() req: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number) {
    const { companyId } = req.user;
    return this.apiEndpointsService.findOne(id, companyId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an API endpoint definition' })
  @ApiResponse({ status: 200, description: 'The API endpoint definition has been successfully updated.' })
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateApiEndpointDto,
  ) {
    const { companyId, id: actingUserId } = req.user;
    return this.apiEndpointsService.update(id, updateDto, actingUserId, companyId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an API endpoint definition (soft delete)' })
  @ApiResponse({ status: 200, description: 'The API endpoint definition has been successfully deactivated.' })
  remove(@Req() req: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number) {
    const { companyId, id: actingUserId } = req.user;
    return this.apiEndpointsService.remove(id, companyId, actingUserId);
  }
}


@ApiTags('dynamic-api') // For executing the defined endpoints
@ApiBearerAuth() // Most dynamic APIs would likely require auth
@Controller('api/v1/dynamic') // Base path for all dynamic API calls
export class DynamicApiExecutionController {
    constructor(private readonly apiEndpointsService: ApiEndpointsService) {}

    @All('*') // Catches all paths under /api/v1/dynamic
    @UseGuards(AuthGuard('jwt')) // Ensure user is authenticated
    @ApiOperation({ summary: 'Execute a dynamically defined API endpoint' })
    @ApiResponse({ status: 200, description: 'API endpoint executed successfully.' })
    @ApiResponse({ status: 404, description: 'Dynamic API endpoint not found for this path and method.' })
    @ApiResponse({ status: 403, description: 'User does not have permission for this dynamic API endpoint.'})
    async execute(
        @Req() req: AuthenticatedRequest, // Use AuthenticatedRequest
        @Body() body: any, // Body can be anything
        @Query() queryParams: any, // Query params can also be anything
    ) {
        const { companyId, id: userId, roles } = req.user;
        const path = req.path.replace('/api/v1/dynamic', ''); // Extract path relative to /dynamic
        const method = req.method.toUpperCase();

        const endpoint = await this.apiEndpointsService.findByPathAndMethod(companyId, path, method);

        if (!endpoint) {
            throw new HttpException(`Dynamic API endpoint not found for ${method} ${path}`, HttpStatus.NOT_FOUND);
        }

        // Combine params from body and query. Body takes precedence.
        const params = { ...queryParams, ...body };

        try {
            return await this.apiEndpointsService.executeEndpoint(endpoint, params, {id: userId, companyId, roles});
        } catch (error) {
            if (error instanceof ForbiddenException || error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            console.error(`Error executing dynamic endpoint ${path} (${method}):`, error);
            throw new HttpException(
                error.message || 'Failed to execute dynamic API endpoint',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
