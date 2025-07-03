import { Module } from '@nestjs/common';
import { UserPrivilegeService } from './user-privilege.service';
import { UserPrivilegeController } from './user-privilege.controller';
import { CoreModule } from '../core/core.module';
import { UserModule } from '../user/user.module'; // Added
import { RolePrivilegeModule } from '../role-privilege/role-privilege.module'; // Added

@Module({
  imports: [CoreModule, UserModule, RolePrivilegeModule], // Added UserModule and RolePrivilegeModule
  controllers: [UserPrivilegeController],
  providers: [UserPrivilegeService],
  exports: [UserPrivilegeService],
})
export class UserPrivilegeModule {}
