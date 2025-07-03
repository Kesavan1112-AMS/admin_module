import { Module } from '@nestjs/common';
import { UserMasterMappingService } from './user-master-mapping.service';
import { UserMasterMappingController } from './user-master-mapping.controller';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [UserMasterMappingController],
  providers: [UserMasterMappingService],
  exports: [UserMasterMappingService],
})
export class UserMasterMappingModule {}
