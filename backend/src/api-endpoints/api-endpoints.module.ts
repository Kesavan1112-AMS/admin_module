import { Module } from '@nestjs/common';
import { ApiEndpointsService } from './api-endpoints.service';
import { ApiEndpointsManagementController, DynamicApiExecutionController } from './api-endpoints.controller'; // Updated controller import
import { PrismaModule } from '../prisma/prisma.module';
import { UserPrivilegeModule } from '../user-privilege/user-privilege.module'; // Added

@Module({
  imports: [PrismaModule, UserPrivilegeModule], // Added UserPrivilegeModule
  controllers: [ApiEndpointsManagementController, DynamicApiExecutionController], // Updated
  providers: [ApiEndpointsService],
  exports: [ApiEndpointsService],
})
export class ApiEndpointsModule {}
