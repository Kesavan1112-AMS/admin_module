import { Controller, Post, Body } from '@nestjs/common';
import { UserMasterMappingService } from './user-master-mapping.service';
import { CreateUserMasterMappingDto } from './dto/create-user-master-mapping.dto';
import { UpdateUserMasterMappingDto } from './dto/update-user-master-mapping.dto';

@Controller('user-master-mapping')
export class UserMasterMappingController {
  constructor(
    private readonly userMasterMappingService: UserMasterMappingService,
  ) {}

  @Post('create')
  create(@Body() body: CreateUserMasterMappingDto) {
    return this.userMasterMappingService.create(body);
  }

  @Post('find-all')
  findAll(@Body() body: { companyId: number }) {
    return this.userMasterMappingService.findAll(Number(body.companyId));
  }

  @Post('find-one')
  findOne(@Body() body: { id: number }) {
    return this.userMasterMappingService.findOne(Number(body.id));
  }

  @Post('update')
  update(@Body() body: { id: number; data: UpdateUserMasterMappingDto }) {
    return this.userMasterMappingService.update(Number(body.id), body.data);
  }

  @Post('remove')
  remove(@Body() body: { id: number }) {
    return this.userMasterMappingService.remove(Number(body.id));
  }
}
