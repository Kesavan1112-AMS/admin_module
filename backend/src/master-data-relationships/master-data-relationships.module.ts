import { Module } from '@nestjs/common';
import { MasterDataRelationshipsService } from './master-data-relationships.service';
import { MasterDataRelationshipsController } from './master-data-relationships.controller';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [MasterDataRelationshipsController],
  providers: [MasterDataRelationshipsService],
  exports: [MasterDataRelationshipsService],
})
export class MasterDataRelationshipsModule {}
