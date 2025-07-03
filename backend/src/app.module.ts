import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Core Infrastructure
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CompanyModule } from './company/company.module';

// Master Data Management
import { MasterTypeModule } from './master-type/master-type.module';
import { MasterDataModule } from './master-data/master-data.module';
import { MasterHierarchyModule } from './master-hierarchy/master-hierarchy.module';
import { MasterDataRelationshipsModule } from './master-data-relationships/master-data-relationships.module';

// User & Role Management
import { UserCategoryModule } from './user-category/user-category.module';
import { UserMasterMappingModule } from './user-master-mapping/user-master-mapping.module';

// Privilege Management
import { ModuleModule } from './module/module.module';
import { PrivilegeMasterModule } from './privilege-master/privilege-master.module';
import { RolePrivilegeModule } from './role-privilege/role-privilege.module';
import { UserPrivilegeModule } from './user-privilege/user-privilege.module';

// Workflow Management
import { WorkflowStepModule } from './workflow-step/workflow-step.module';
import { WorkflowInstanceModule } from './workflow-instance/workflow-instance.module';
import { WorkflowStepHistoryModule } from './workflow-step-history/workflow-step-history.module';

// System Management
import { CompanyConfigurationModule } from './company-configuration/company-configuration.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { UserSessionModule } from './user-session/user-session.module';

// UI Configuration
import { UiConfigModule } from './ui-config/ui-config.module';

// Dynamic Customization
import { BusinessRulesModule } from './business-rules/business-rules.module';
import { DynamicFormsModule } from './dynamic-forms/dynamic-forms.module';
import { ApiEndpointsModule } from './api-endpoints/api-endpoints.module';

@Module({
  imports: [
    // Core Infrastructure
    CoreModule,
    AuthModule,
    UserModule,
    CompanyModule,

    // Master Data Management
    MasterTypeModule,
    MasterDataModule,
    MasterHierarchyModule,
    MasterDataRelationshipsModule,

    // User & Role Management
    UserCategoryModule,
    UserMasterMappingModule,

    // Privilege Management
    ModuleModule,
    PrivilegeMasterModule,
    RolePrivilegeModule,
    UserPrivilegeModule,

    // Workflow Management
    WorkflowStepModule,
    WorkflowInstanceModule,
    WorkflowStepHistoryModule,

    // System Management
    CompanyConfigurationModule,
    AuditLogModule,
    UserSessionModule,

    // UI Configuration
    UiConfigModule,

    // Dynamic Customization
    BusinessRulesModule,
    DynamicFormsModule,
    ApiEndpointsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
