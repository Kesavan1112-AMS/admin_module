import { Module } from '@nestjs/common';
import { MasterTypeService } from './master-type.service';
import { MasterTypeController } from './master-type.controller';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [MasterTypeController],
  providers: [MasterTypeService],
  exports: [MasterTypeService],
})
export class MasterTypeModule {}
