import { Module } from '@nestjs/common';
import { UserCategoryService } from './user-category.service';
import { UserCategoryController } from './user-category.controller';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [UserCategoryController],
  providers: [UserCategoryService],
  exports: [UserCategoryService],
})
export class UserCategoryModule {}
