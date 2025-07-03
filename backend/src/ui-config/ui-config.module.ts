import { Module } from '@nestjs/common';
import { UiConfigController } from './ui-config.controller';
import { UiConfigService } from './ui-config.service';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [UiConfigController],
  providers: [UiConfigService],
  exports: [UiConfigService],
})
export class UiConfigModule {}
