import { Controller, Post, Body } from '@nestjs/common';
import { UserCategoryService } from './user-category.service';
import { CreateUserCategoryDto } from './dto/create-user-category.dto';
import { UpdateUserCategoryDto } from './dto/update-user-category.dto';

@Controller('user-category')
export class UserCategoryController {
  constructor(private readonly userCategoryService: UserCategoryService) {}

  @Post('create')
  create(@Body() body: CreateUserCategoryDto) {
    return this.userCategoryService.create(body);
  }

  @Post('find-all')
  findAll(@Body() body: { companyId: number }) {
    return this.userCategoryService.findAll(Number(body.companyId));
  }

  @Post('find-one')
  findOne(@Body() body: { id: number }) {
    return this.userCategoryService.findOne(Number(body.id));
  }

  @Post('update')
  update(@Body() body: { id: number; data: UpdateUserCategoryDto }) {
    return this.userCategoryService.update(Number(body.id), body.data);
  }

  @Post('remove')
  remove(@Body() body: { id: number }) {
    return this.userCategoryService.remove(Number(body.id));
  }
}
