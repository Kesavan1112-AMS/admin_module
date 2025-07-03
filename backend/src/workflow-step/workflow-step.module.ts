import { Module } from '@nestjs/common';
import { WorkflowStepService } from './workflow-step.service';
import { WorkflowStepController } from './workflow-step.controller';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [WorkflowStepController],
  providers: [WorkflowStepService],
  exports: [WorkflowStepService],
})
export class WorkflowStepModule {}
