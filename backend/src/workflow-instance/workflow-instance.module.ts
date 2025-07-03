import { Module } from '@nestjs/common';
import { WorkflowInstanceService } from './workflow-instance.service';
import { WorkflowInstanceController } from './workflow-instance.controller';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [WorkflowInstanceController],
  providers: [WorkflowInstanceService],
  exports: [WorkflowInstanceService],
})
export class WorkflowInstanceModule {}
