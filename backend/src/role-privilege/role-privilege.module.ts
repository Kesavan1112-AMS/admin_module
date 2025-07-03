import { Module } from '@nestjs/common';
import { RolePrivilegeService } from './role-privilege.service';
import { RolePrivilegeController } from './role-privilege.controller';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [RolePrivilegeController],
  providers: [RolePrivilegeService],
  exports: [RolePrivilegeService],
})
export class RolePrivilegeModule {}
