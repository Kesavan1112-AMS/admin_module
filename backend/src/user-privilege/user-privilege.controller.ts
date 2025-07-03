import { Controller, Post, Body } from '@nestjs/common';
import { UserPrivilegeService } from './user-privilege.service';
import { CreateUserPrivilegeDto } from './dto/create-user-privilege.dto';
import { UpdateUserPrivilegeDto } from './dto/update-user-privilege.dto';

@Controller('user-privilege')
export class UserPrivilegeController {
  constructor(private readonly userPrivilegeService: UserPrivilegeService) {}

  @Post('create')
  create(@Body() body: CreateUserPrivilegeDto) {
    return this.userPrivilegeService.create(body);
  }

  @Post('find-all')
  findAll(
    @Body() body: { userKey?: string; companyId?: number; status?: string },
  ) {
    // If companyId is provided, use it directly
    if (body.companyId) {
      return this.userPrivilegeService.findAll(body.companyId);
    }

    // If userKey is provided, we need to find the user's companyId
    if (body.userKey) {
      return this.userPrivilegeService.findAllByUserKey(
        body.userKey,
        body.status,
      );
    }

    throw new Error('Either companyId or userKey must be provided');
  }

  @Post('find-one')
  findOne(@Body() body: { id: number }) {
    return this.userPrivilegeService.findOne(Number(body.id));
  }

  @Post('update')
  update(@Body() body: { id: number; data: UpdateUserPrivilegeDto }) {
    return this.userPrivilegeService.update(Number(body.id), body.data);
  }

  @Post('remove')
  remove(@Body() body: { id: number }) {
    return this.userPrivilegeService.remove(Number(body.id));
  }
}
