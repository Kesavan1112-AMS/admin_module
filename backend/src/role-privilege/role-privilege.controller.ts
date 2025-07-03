import { Controller, Post, Body } from '@nestjs/common';
import { RolePrivilegeService } from './role-privilege.service';
import { CreateRolePrivilegeDto } from './dto/create-role-privilege.dto';
import { UpdateRolePrivilegeDto } from './dto/update-role-privilege.dto';

@Controller('role-privilege')
export class RolePrivilegeController {
  constructor(private readonly rolePrivilegeService: RolePrivilegeService) {}

  @Post('create')
  create(@Body() body: CreateRolePrivilegeDto) {
    return this.rolePrivilegeService.create(body);
  }

  @Post('find-all')
  findAll(@Body() body: { companyId: number }) {
    return this.rolePrivilegeService.findAll(Number(body.companyId));
  }

  @Post('find-one')
  findOne(@Body() body: { id: number }) {
    return this.rolePrivilegeService.findOne(Number(body.id));
  }

  @Post('update')
  update(@Body() body: { id: number; data: UpdateRolePrivilegeDto }) {
    return this.rolePrivilegeService.update(Number(body.id), body.data);
  }

  @Post('remove')
  remove(@Body() body: { id: number }) {
    return this.rolePrivilegeService.remove(Number(body.id));
  }
}
