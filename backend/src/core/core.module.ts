import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import configuration from '../config/configuration';
import { PrismaService } from './services/prisma.service';
import { JwtService } from './services/jwt.service';
import { BusinessRulesModule } from '../business-rules/business-rules.module'; // Added
import { APP_INTERCEPTOR, Reflector } from '@nestjs/core'; // Added for global interceptor
import { BusinessRuleInterceptor } from './interceptors/business-rule.interceptor'; // Added

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: {
          expiresIn: configService.get('jwt.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
    BusinessRulesModule, // Added BusinessRulesModule to make BusinessRulesService available
  ],
  providers: [
    PrismaService,
    JwtService,
    ConfigService,
    Reflector, // Reflector must be available
    // { // Option to provide interceptor globally
    //   provide: APP_INTERCEPTOR,
    //   useClass: BusinessRuleInterceptor,
    // },
  ],
  exports: [PrismaService, JwtService, ConfigService, BusinessRulesModule], // Export BusinessRulesModule if other modules need BusinessRulesService directly
})
export class CoreModule {}
