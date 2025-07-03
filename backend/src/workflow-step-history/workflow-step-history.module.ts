import { Module } from '@nestjs/common';
import { WorkflowStepHistoryService } from './workflow-step-history.service';
import { WorkflowStepHistoryController } from './workflow-step-history.controller';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [WorkflowStepHistoryController],
  providers: [WorkflowStepHistoryService],
  exports: [WorkflowStepHistoryService],
})
export class WorkflowStepHistoryModule {}
