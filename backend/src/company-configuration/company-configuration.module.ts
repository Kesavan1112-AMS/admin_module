import { Module } from '@nestjs/common';
import { CompanyConfigurationService } from './company-configuration.service';
import { CompanyConfigurationController } from './company-configuration.controller';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [CompanyConfigurationController],
  providers: [CompanyConfigurationService],
  exports: [CompanyConfigurationService],
})
export class CompanyConfigurationModule {}
