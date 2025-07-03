import { Controller, Post, Body } from '@nestjs/common';
import { UserSessionService } from './user-session.service';
import { CreateUserSessionDto } from './dto/create-user-session.dto';
import { UpdateUserSessionDto } from './dto/update-user-session.dto';

@Controller('user-session')
export class UserSessionController {
  constructor(private readonly userSessionService: UserSessionService) {}

  @Post('create')
  create(@Body() body: CreateUserSessionDto) {
    return this.userSessionService.create(body);
  }

  @Post('find-all')
  findAll(@Body() body: { companyId: number }) {
    return this.userSessionService.findAll(Number(body.companyId));
  }

  @Post('find-one')
  findOne(@Body() body: { id: number }) {
    return this.userSessionService.findOne(Number(body.id));
  }

  @Post('update')
  update(@Body() body: { id: number; data: UpdateUserSessionDto }) {
    return this.userSessionService.update(Number(body.id), body.data);
  }

  @Post('remove')
  remove(@Body() body: { id: number }) {
    return this.userSessionService.remove(Number(body.id));
  }
}
