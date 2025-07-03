import { Module } from '@nestjs/common';
import { MasterHierarchyService } from './master-hierarchy.service';
import { MasterHierarchyController } from './master-hierarchy.controller';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [MasterHierarchyController],
  providers: [MasterHierarchyService],
  exports: [MasterHierarchyService],
})
export class MasterHierarchyModule {}
