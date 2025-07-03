import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, All, HttpException, HttpStatus } from '@nestjs/common';
import { ApiEndpointsService } from './api-endpoints.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('api-endpoints')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api-endpoints')
export class ApiEndpointsController {
  constructor(private readonly apiEndpointsService: ApiEndpointsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new API endpoint' })
  @ApiResponse({ status: 201, description: 'The API endpoint has been successfully created.' })
  create(@Request() req, @Body() createApiEndpointDto: any) {
    const { company, id } = req.user;
    return this.apiEndpointsService.create({
      ...createApiEndpointDto,
      company: { connect: { id: company } },
      createdBy: id,
      updatedBy: id,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all API endpoints for the company' })
  @ApiResponse({ status: 200, description: 'List of API endpoints.' })
  findAll(@Request() req) {
    const { company } = req.user;
    return this.apiEndpointsService.findAll(company);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an API endpoint by ID' })
  @ApiResponse({ status: 200, description: 'The API endpoint.' })
  @ApiResponse({ status: 404, description: 'API endpoint not found.' })
  findOne(@Request() req, @Param('id') id: string) {
    const { company } = req.user;
    return this.apiEndpointsService.findOne(company, +id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an API endpoint' })
  @ApiResponse({ status: 200, description: 'The API endpoint has been successfully updated.' })
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateApiEndpointDto: any,
  ) {
    const { company, id: userId } = req.user;
    return this.apiEndpointsService.update(company, +id, {
      ...updateApiEndpointDto,
      updatedBy: userId,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an API endpoint' })
  @ApiResponse({ status: 200, description: 'The API endpoint has been successfully deleted.' })
  remove(@Request() req, @Param('id') id: string) {
    const { company } = req.user;
    return this.apiEndpointsService.remove(company, +id);
  }

  @All('execute/:path')
  @ApiOperation({ summary: 'Execute a dynamic API endpoint' })
  @ApiResponse({ status: 200, description: 'The API endpoint has been successfully executed.' })
  @ApiResponse({ status: 404, description: 'API endpoint not found.' })
  async execute(
    @Request() req,
    @Param('path') path: string,
    @Body() body: any,
  ) {
    const { company, id: userId } = req.user;
    const method = req.method;
    
    // Find the endpoint configuration
    const endpoint = await this.apiEndpointsService.findByPathAndMethod(company, path, method);
    
    if (!endpoint) {
      throw new HttpException('API endpoint not found', HttpStatus.NOT_FOUND);
    }
    
    try {
      // Execute the endpoint with the provided parameters
      return await this.apiEndpointsService.executeEndpoint(endpoint, body, userId);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to execute API endpoint',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
