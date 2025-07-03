import { Module } from '@nestjs/common';
import { UserPrivilegeService } from './user-privilege.service';
import { UserPrivilegeController } from './user-privilege.controller';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [UserPrivilegeController],
  providers: [UserPrivilegeService],
  exports: [UserPrivilegeService],
})
export class UserPrivilegeModule {}
