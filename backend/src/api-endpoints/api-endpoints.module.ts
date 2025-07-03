import { Module } from '@nestjs/common';
import { ApiEndpointsService } from './api-endpoints.service';
import { ApiEndpointsController } from './api-endpoints.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ApiEndpointsController],
  providers: [ApiEndpointsService],
  exports: [ApiEndpointsService],
})
export class ApiEndpointsModule {}
