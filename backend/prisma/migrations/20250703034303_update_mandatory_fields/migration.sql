-- CreateTable
CREATE TABLE `companies` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `logo_url` VARCHAR(191) NULL,
    `theme_config` JSON NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'A',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER NULL,
    `updatedBy` INTEGER NULL,

    UNIQUE INDEX `companies_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyId` INTEGER NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `userCategoryId` INTEGER NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'A',
    `lastLogin` DATETIME(3) NULL,
    `passwordChangedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER NULL,
    `updatedBy` INTEGER NULL,

    INDEX `users_companyId_userCategoryId_idx`(`companyId`, `userCategoryId`),
    INDEX `users_companyId_status_idx`(`companyId`, `status`),
    INDEX `users_userCategoryId_fkey`(`userCategoryId`),
    UNIQUE INDEX `users_companyId_username_key`(`companyId`, `username`),
    UNIQUE INDEX `users_companyId_email_key`(`companyId`, `email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `modules` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `displayName` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `moduleGroup` VARCHAR(191) NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'A',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER NULL,
    `updatedBy` INTEGER NULL,

    UNIQUE INDEX `modules_companyId_name_key`(`companyId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `auditlogs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `entityType` VARCHAR(191) NOT NULL,
    `entityId` INTEGER NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `oldValue` JSON NULL,
    `newValue` JSON NULL,
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `auditLogs_companyId_entityType_createdAt_idx`(`companyId`, `entityType`, `createdAt`),
    INDEX `auditLogs_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `companyconfigurations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyId` INTEGER NOT NULL,
    `configKey` VARCHAR(191) NOT NULL,
    `configValue` JSON NULL,
    `description` VARCHAR(191) NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'A',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER NULL,
    `updatedBy` INTEGER NULL,

    UNIQUE INDEX `companyConfigurations_companyId_configKey_key`(`companyId`, `configKey`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `masterdata` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyId` INTEGER NOT NULL,
    `masterTypeId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `displayName` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `metadata` JSON NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'A',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER NULL,
    `updatedBy` INTEGER NULL,

    INDEX `masterData_companyId_masterTypeId_idx`(`companyId`, `masterTypeId`),
    INDEX `masterData_companyId_status_idx`(`companyId`, `status`),
    INDEX `masterData_masterTypeId_fkey`(`masterTypeId`),
    UNIQUE INDEX `masterData_companyId_masterTypeId_code_key`(`companyId`, `masterTypeId`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `masterdatarelationships` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyId` INTEGER NOT NULL,
    `parentMasterDataId` INTEGER NULL,
    `childMasterDataId` INTEGER NOT NULL,
    `relationshipType` VARCHAR(191) NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'A',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER NULL,
    `updatedBy` INTEGER NULL,

    INDEX `masterDataRelationships_childMasterDataId_fkey`(`childMasterDataId`),
    INDEX `masterDataRelationships_companyId_relationshipType_idx`(`companyId`, `relationshipType`),
    UNIQUE INDEX `masterDataRelationships_parentMasterDataId_childMasterDataId_key`(`parentMasterDataId`, `childMasterDataId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `masterhierarchy` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyId` INTEGER NOT NULL,
    `parentMasterTypeId` INTEGER NULL,
    `childMasterTypeId` INTEGER NOT NULL,
    `relationshipName` VARCHAR(191) NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'A',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER NULL,
    `updatedBy` INTEGER NULL,

    INDEX `masterHierarchy_childMasterTypeId_fkey`(`childMasterTypeId`),
    INDEX `masterHierarchy_parentMasterTypeId_fkey`(`parentMasterTypeId`),
    UNIQUE INDEX `masterHierarchy_companyId_parentMasterTypeId_childMasterType_key`(`companyId`, `parentMasterTypeId`, `childMasterTypeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mastertypes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `displayName` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `hierarchyLevel` INTEGER NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'A',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER NULL,
    `updatedBy` INTEGER NULL,

    INDEX `masterTypes_companyId_hierarchyLevel_status_idx`(`companyId`, `hierarchyLevel`, `status`),
    UNIQUE INDEX `masterTypes_companyId_name_key`(`companyId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `privilegemaster` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyId` INTEGER NOT NULL,
    `moduleId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `displayName` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'A',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER NULL,
    `updatedBy` INTEGER NULL,

    INDEX `privilegeMaster_companyId_fkey`(`companyId`),
    UNIQUE INDEX `privilegeMaster_moduleId_name_key`(`moduleId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roleprivileges` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyId` INTEGER NOT NULL,
    `userCategoryId` INTEGER NOT NULL,
    `privilegeId` INTEGER NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'A',
    `grantedBy` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER NULL,
    `updatedBy` INTEGER NULL,

    INDEX `rolePrivileges_companyId_fkey`(`companyId`),
    INDEX `rolePrivileges_grantedBy_fkey`(`grantedBy`),
    INDEX `rolePrivileges_privilegeId_fkey`(`privilegeId`),
    UNIQUE INDEX `rolePrivileges_userCategoryId_privilegeId_key`(`userCategoryId`, `privilegeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usercategories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `displayName` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `hierarchyLevel` INTEGER NULL,
    `masterTypeId` INTEGER NULL,
    `accessScope` VARCHAR(20) NOT NULL DEFAULT 'own',
    `status` VARCHAR(20) NOT NULL DEFAULT 'A',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER NULL,
    `updatedBy` INTEGER NULL,

    INDEX `userCategories_companyId_status_idx`(`companyId`, `status`),
    INDEX `userCategories_masterTypeId_fkey`(`masterTypeId`),
    UNIQUE INDEX `userCategories_companyId_name_key`(`companyId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usermastermappings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `masterDataId` INTEGER NOT NULL,
    `accessType` VARCHAR(20) NOT NULL DEFAULT 'direct',
    `grantedBy` INTEGER NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'A',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER NULL,
    `updatedBy` INTEGER NULL,

    INDEX `userMasterMappings_companyId_userId_idx`(`companyId`, `userId`),
    INDEX `userMasterMappings_grantedBy_fkey`(`grantedBy`),
    INDEX `userMasterMappings_masterDataId_fkey`(`masterDataId`),
    UNIQUE INDEX `userMasterMappings_userId_masterDataId_key`(`userId`, `masterDataId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `userprivileges` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `privilegeId` INTEGER NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'A',
    `overrideReason` VARCHAR(191) NULL,
    `grantedBy` INTEGER NULL,
    `expiresAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER NULL,
    `updatedBy` INTEGER NULL,

    INDEX `userPrivileges_companyId_fkey`(`companyId`),
    INDEX `userPrivileges_grantedBy_fkey`(`grantedBy`),
    INDEX `userPrivileges_privilegeId_fkey`(`privilegeId`),
    UNIQUE INDEX `userPrivileges_userId_privilegeId_key`(`userId`, `privilegeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usersessions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'A',
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `userSessions_userId_status_expiresAt_idx`(`userId`, `status`, `expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `workflowinstances` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyId` INTEGER NOT NULL,
    `entityType` VARCHAR(191) NOT NULL,
    `entityId` INTEGER NOT NULL,
    `currentStepId` INTEGER NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER NULL,
    `updatedBy` INTEGER NULL,

    INDEX `workflowInstances_companyId_status_idx`(`companyId`, `status`),
    INDEX `workflowInstances_currentStepId_fkey`(`currentStepId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `workflowstephistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `workflowInstanceId` INTEGER NOT NULL,
    `stepId` INTEGER NOT NULL,
    `actionTaken` VARCHAR(191) NOT NULL,
    `comments` VARCHAR(191) NULL,
    `actionBy` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `workflowStepHistory_actionBy_fkey`(`actionBy`),
    INDEX `workflowStepHistory_stepId_fkey`(`stepId`),
    INDEX `workflowStepHistory_workflowInstanceId_fkey`(`workflowInstanceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `workflowsteps` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `stepOrder` INTEGER NOT NULL,
    `requiredUserCategoryId` INTEGER NULL,
    `requiredPrivilegeId` INTEGER NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'A',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER NULL,
    `updatedBy` INTEGER NULL,

    INDEX `workflowSteps_companyId_stepOrder_idx`(`companyId`, `stepOrder`),
    INDEX `workflowSteps_requiredPrivilegeId_fkey`(`requiredPrivilegeId`),
    INDEX `workflowSteps_requiredUserCategoryId_fkey`(`requiredUserCategoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UiMenu` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyId` INTEGER NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `route` VARCHAR(191) NULL,
    `icon` VARCHAR(191) NULL,
    `parentId` INTEGER NULL,
    `order` INTEGER NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'A',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UiPage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyId` INTEGER NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'A',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UiTableColumn` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pageId` INTEGER NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NULL,
    `order` INTEGER NULL,
    `visible` BOOLEAN NOT NULL DEFAULT true,
    `sortable` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UiAction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pageId` INTEGER NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `order` INTEGER NULL,
    `visible` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UiField` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pageId` INTEGER NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NULL,
    `required` BOOLEAN NOT NULL DEFAULT false,
    `visible` BOOLEAN NOT NULL DEFAULT true,
    `order` INTEGER NULL,
    `placeholder` VARCHAR(191) NULL,
    `validation` JSON NULL,
    `options` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DynamicForm` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `entityType` VARCHAR(191) NULL,
    `masterTypeId` INTEGER NULL,
    `layout` JSON NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'A',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER NULL,
    `updatedBy` INTEGER NULL,

    UNIQUE INDEX `DynamicForm_companyId_name_key`(`companyId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DynamicFormField` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `formId` INTEGER NOT NULL,
    `companyId` INTEGER NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `defaultValue` VARCHAR(191) NULL,
    `placeholder` VARCHAR(191) NULL,
    `required` BOOLEAN NOT NULL DEFAULT false,
    `readOnly` BOOLEAN NOT NULL DEFAULT false,
    `validation` JSON NULL,
    `options` JSON NULL,
    `orderIndex` INTEGER NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'A',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER NULL,
    `updatedBy` INTEGER NULL,

    UNIQUE INDEX `DynamicFormField_formId_key_key`(`formId`, `key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BusinessRule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `entityType` VARCHAR(191) NOT NULL,
    `eventType` VARCHAR(191) NOT NULL,
    `condition` JSON NOT NULL,
    `action` JSON NOT NULL,
    `priority` INTEGER NOT NULL DEFAULT 0,
    `status` VARCHAR(191) NOT NULL DEFAULT 'A',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER NULL,
    `updatedBy` INTEGER NULL,

    INDEX `BusinessRule_companyId_entityType_eventType_status_idx`(`companyId`, `entityType`, `eventType`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApiEndpoint` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyId` INTEGER NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `method` VARCHAR(191) NOT NULL,
    `handlerType` VARCHAR(191) NOT NULL,
    `handlerConfig` JSON NOT NULL,
    `requiredPrivilegeId` INTEGER NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'A',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` INTEGER NULL,
    `updatedBy` INTEGER NULL,

    UNIQUE INDEX `ApiEndpoint_companyId_path_method_key`(`companyId`, `path`, `method`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_userCategoryId_fkey` FOREIGN KEY (`userCategoryId`) REFERENCES `usercategories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `modules` ADD CONSTRAINT `modules_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `auditlogs` ADD CONSTRAINT `auditLogs_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `auditlogs` ADD CONSTRAINT `auditLogs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `companyconfigurations` ADD CONSTRAINT `companyConfigurations_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `masterdata` ADD CONSTRAINT `masterData_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `masterdata` ADD CONSTRAINT `masterData_masterTypeId_fkey` FOREIGN KEY (`masterTypeId`) REFERENCES `mastertypes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `masterdatarelationships` ADD CONSTRAINT `masterDataRelationships_childMasterDataId_fkey` FOREIGN KEY (`childMasterDataId`) REFERENCES `masterdata`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `masterdatarelationships` ADD CONSTRAINT `masterDataRelationships_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `masterdatarelationships` ADD CONSTRAINT `masterDataRelationships_parentMasterDataId_fkey` FOREIGN KEY (`parentMasterDataId`) REFERENCES `masterdata`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `masterhierarchy` ADD CONSTRAINT `masterHierarchy_childMasterTypeId_fkey` FOREIGN KEY (`childMasterTypeId`) REFERENCES `mastertypes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `masterhierarchy` ADD CONSTRAINT `masterHierarchy_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `masterhierarchy` ADD CONSTRAINT `masterHierarchy_parentMasterTypeId_fkey` FOREIGN KEY (`parentMasterTypeId`) REFERENCES `mastertypes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mastertypes` ADD CONSTRAINT `masterTypes_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `privilegemaster` ADD CONSTRAINT `privilegeMaster_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `privilegemaster` ADD CONSTRAINT `privilegeMaster_moduleId_fkey` FOREIGN KEY (`moduleId`) REFERENCES `modules`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `roleprivileges` ADD CONSTRAINT `rolePrivileges_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `roleprivileges` ADD CONSTRAINT `rolePrivileges_grantedBy_fkey` FOREIGN KEY (`grantedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `roleprivileges` ADD CONSTRAINT `rolePrivileges_privilegeId_fkey` FOREIGN KEY (`privilegeId`) REFERENCES `privilegemaster`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `roleprivileges` ADD CONSTRAINT `rolePrivileges_userCategoryId_fkey` FOREIGN KEY (`userCategoryId`) REFERENCES `usercategories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usercategories` ADD CONSTRAINT `userCategories_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usercategories` ADD CONSTRAINT `userCategories_masterTypeId_fkey` FOREIGN KEY (`masterTypeId`) REFERENCES `mastertypes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usermastermappings` ADD CONSTRAINT `userMasterMappings_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usermastermappings` ADD CONSTRAINT `userMasterMappings_grantedBy_fkey` FOREIGN KEY (`grantedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usermastermappings` ADD CONSTRAINT `userMasterMappings_masterDataId_fkey` FOREIGN KEY (`masterDataId`) REFERENCES `masterdata`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usermastermappings` ADD CONSTRAINT `userMasterMappings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userprivileges` ADD CONSTRAINT `userPrivileges_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userprivileges` ADD CONSTRAINT `userPrivileges_grantedBy_fkey` FOREIGN KEY (`grantedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userprivileges` ADD CONSTRAINT `userPrivileges_privilegeId_fkey` FOREIGN KEY (`privilegeId`) REFERENCES `privilegemaster`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userprivileges` ADD CONSTRAINT `userPrivileges_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usersessions` ADD CONSTRAINT `userSessions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workflowinstances` ADD CONSTRAINT `workflowInstances_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workflowinstances` ADD CONSTRAINT `workflowInstances_currentStepId_fkey` FOREIGN KEY (`currentStepId`) REFERENCES `workflowsteps`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workflowstephistory` ADD CONSTRAINT `workflowStepHistory_actionBy_fkey` FOREIGN KEY (`actionBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workflowstephistory` ADD CONSTRAINT `workflowStepHistory_stepId_fkey` FOREIGN KEY (`stepId`) REFERENCES `workflowsteps`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workflowstephistory` ADD CONSTRAINT `workflowStepHistory_workflowInstanceId_fkey` FOREIGN KEY (`workflowInstanceId`) REFERENCES `workflowinstances`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workflowsteps` ADD CONSTRAINT `workflowSteps_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workflowsteps` ADD CONSTRAINT `workflowSteps_requiredPrivilegeId_fkey` FOREIGN KEY (`requiredPrivilegeId`) REFERENCES `privilegemaster`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workflowsteps` ADD CONSTRAINT `workflowSteps_requiredUserCategoryId_fkey` FOREIGN KEY (`requiredUserCategoryId`) REFERENCES `usercategories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UiMenu` ADD CONSTRAINT `UiMenu_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UiMenu` ADD CONSTRAINT `UiMenu_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `UiMenu`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UiPage` ADD CONSTRAINT `UiPage_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UiTableColumn` ADD CONSTRAINT `UiTableColumn_pageId_fkey` FOREIGN KEY (`pageId`) REFERENCES `UiPage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UiAction` ADD CONSTRAINT `UiAction_pageId_fkey` FOREIGN KEY (`pageId`) REFERENCES `UiPage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UiField` ADD CONSTRAINT `UiField_pageId_fkey` FOREIGN KEY (`pageId`) REFERENCES `UiPage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DynamicForm` ADD CONSTRAINT `DynamicForm_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DynamicForm` ADD CONSTRAINT `DynamicForm_masterTypeId_fkey` FOREIGN KEY (`masterTypeId`) REFERENCES `mastertypes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DynamicFormField` ADD CONSTRAINT `DynamicFormField_formId_fkey` FOREIGN KEY (`formId`) REFERENCES `DynamicForm`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DynamicFormField` ADD CONSTRAINT `DynamicFormField_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BusinessRule` ADD CONSTRAINT `BusinessRule_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApiEndpoint` ADD CONSTRAINT `ApiEndpoint_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApiEndpoint` ADD CONSTRAINT `ApiEndpoint_requiredPrivilegeId_fkey` FOREIGN KEY (`requiredPrivilegeId`) REFERENCES `privilegemaster`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
