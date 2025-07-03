import { Module } from '@nestjs/common';
import { PrivilegeMasterService } from './privilege-master.service';
import { PrivilegeMasterController } from './privilege-master.controller';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [PrivilegeMasterController],
  providers: [PrivilegeMasterService],
  exports: [PrivilegeMasterService],
})
export class PrivilegeMasterModule {}
