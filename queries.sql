-- Enterprise Admin Module - Database Structure
-- Optimized for complete customizability and multi-tenancy
-- All business logic, hierarchies, and UI elements are data-driven

-- ================================
-- CORE SYSTEM TABLES
-- ================================

CREATE TABLE companies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    logo_url VARCHAR(500),
    theme_config JSON, -- Stores UI customization
    status VARCHAR(20) DEFAULT 'A',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy INT,
    updatedBy INT
);

-- ================================
-- MASTER CONFIGURATION TABLES
-- ================================

-- Master Types (Region, Cluster, Country, STL, ICAM, Distributor, DSR, etc.)
CREATE TABLE masterTypes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    companyId INT NOT NULL,
    name VARCHAR(100) NOT NULL, -- region, cluster, country, stl, icam, distributor, dsr
    displayName VARCHAR(100) NOT NULL,
    description TEXT,
    hierarchyLevel INT NOT NULL, -- 1=top level, 2=second level, etc.
    status VARCHAR(20) DEFAULT 'A',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy INT,
    updatedBy INT,
    FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE CASCADE,
    UNIQUE KEY unique_company_master_name (companyId, name),
    INDEX idx_company_hierarchy (companyId, hierarchyLevel)
);

-- Master Hierarchy Relationships (Parent-Child mapping)
CREATE TABLE masterHierarchy (
    id INT PRIMARY KEY AUTO_INCREMENT,
    companyId INT NOT NULL,
    parentMasterTypeId INT, -- NULL for root level
    childMasterTypeId INT NOT NULL,
    relationshipName VARCHAR(100), -- e.g., "regionHasClusters"
    status VARCHAR(20) DEFAULT 'A',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy INT,
    updatedBy INT,
    FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (parentMasterTypeId) REFERENCES masterTypes(id) ON DELETE CASCADE,
    FOREIGN KEY (childMasterTypeId) REFERENCES masterTypes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_hierarchy_relationship (companyId, parentMasterTypeId, childMasterTypeId)
);

-- Master Data (Actual data entries for each master type)
CREATE TABLE masterData (
    id INT PRIMARY KEY AUTO_INCREMENT,
    companyId INT NOT NULL,
    masterTypeId INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) NOT NULL,
    displayName VARCHAR(255),
    description TEXT,
    metadata JSON, -- Store additional custom fields
    status VARCHAR(20) DEFAULT 'A',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy INT,
    updatedBy INT,
    FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (masterTypeId) REFERENCES masterTypes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_company_master_code (companyId, masterTypeId, code),
    INDEX idx_company_master_type (companyId, masterTypeId)
);

-- Master Data Relationships (Parent-Child data mapping)
CREATE TABLE masterDataRelationships (
    id INT PRIMARY KEY AUTO_INCREMENT,
    companyId INT NOT NULL,
    parentMasterDataId INT,
    childMasterDataId INT NOT NULL,
    relationshipType VARCHAR(100), -- based on masterHierarchy.relationshipName
    status VARCHAR(20) DEFAULT 'A',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy INT,
    updatedBy INT,
    FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (parentMasterDataId) REFERENCES masterData(id) ON DELETE CASCADE,
    FOREIGN KEY (childMasterDataId) REFERENCES masterData(id) ON DELETE CASCADE,
    UNIQUE KEY unique_master_relationship (parentMasterDataId, childMasterDataId),
    INDEX idx_company_relationships (companyId, relationshipType)
);

-- ================================
-- USER MANAGEMENT TABLES
-- ================================

-- User Categories/Roles (Admin, Global, Region, Cluster, etc.)
CREATE TABLE userCategories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    companyId INT NOT NULL,
    name VARCHAR(100) NOT NULL, -- admin, global, region, cluster, country, stl, icam, distributor, dsr
    displayName VARCHAR(100) NOT NULL,
    description TEXT,
    hierarchyLevel INT, -- Maps to masterTypes hierarchy level (NULL for admin/global)
    masterTypeId INT, -- Which master type this category is associated with
    accessScope VARCHAR(20) DEFAULT 'own',
    status VARCHAR(20) DEFAULT 'A',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy INT,
    updatedBy INT,
    FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (masterTypeId) REFERENCES masterTypes(id) ON DELETE SET NULL,
    UNIQUE KEY unique_company_category (companyId, name)
);

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    companyId INT NOT NULL,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    passwordHash VARCHAR(255) NOT NULL,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    userCategoryId INT NOT NULL,
    status VARCHAR(20) DEFAULT 'A',
    lastLogin TIMESTAMP NULL,
    passwordChangedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy INT,
    updatedBy INT,
    FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (userCategoryId) REFERENCES userCategories(id),
    UNIQUE KEY unique_company_username (companyId, username),
    UNIQUE KEY unique_company_email (companyId, email),
    INDEX idx_company_category (companyId, userCategoryId)
);

-- User Master Data Mapping (Which masters a user has access to)
CREATE TABLE userMasterMappings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    companyId INT NOT NULL,
    userId INT NOT NULL,
    masterDataId INT NOT NULL,
    accessType VARCHAR(20) DEFAULT 'direct',
    grantedBy INT, -- Which user granted this access
    status VARCHAR(20) DEFAULT 'A',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy INT,
    updatedBy INT,
    FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (masterDataId) REFERENCES masterData(id) ON DELETE CASCADE,
    FOREIGN KEY (grantedBy) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_master_mapping (userId, masterDataId),
    INDEX idx_company_user_mappings (companyId, userId)
);

-- ================================
-- PRIVILEGE MANAGEMENT TABLES
-- ================================

-- Modules/Features in the system
CREATE TABLE modules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    companyId INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    displayName VARCHAR(100) NOT NULL,
    description TEXT,
    moduleGroup VARCHAR(100), -- Group related modules
    status VARCHAR(20) DEFAULT 'A',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy INT,
    updatedBy INT,
    FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE CASCADE,
    UNIQUE KEY unique_company_module (companyId, name)
);

-- Privilege Master (CRUD operations, custom actions)
CREATE TABLE privilegeMaster (
    id INT PRIMARY KEY AUTO_INCREMENT,
    companyId INT NOT NULL,
    moduleId INT NOT NULL,
    name VARCHAR(100) NOT NULL, -- create, read, update, delete, export, import, approve, etc.
    displayName VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'A',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy INT,
    updatedBy INT,
    FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (moduleId) REFERENCES modules(id) ON DELETE CASCADE,
    UNIQUE KEY unique_module_privilege (moduleId, name)
);

-- Role-based Privileges (What privileges each user category has)
CREATE TABLE rolePrivileges (
    id INT PRIMARY KEY AUTO_INCREMENT,
    companyId INT NOT NULL,
    userCategoryId INT NOT NULL,
    privilegeId INT NOT NULL,
    status VARCHAR(20) DEFAULT 'A',
    grantedBy INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy INT,
    updatedBy INT,
    FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (userCategoryId) REFERENCES userCategories(id) ON DELETE CASCADE,
    FOREIGN KEY (privilegeId) REFERENCES privilegeMaster(id) ON DELETE CASCADE,
    FOREIGN KEY (grantedBy) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_role_privilege (userCategoryId, privilegeId)
);

-- User-specific Privileges (Override role privileges)
CREATE TABLE userPrivileges (
    id INT PRIMARY KEY AUTO_INCREMENT,
    companyId INT NOT NULL,
    userId INT NOT NULL,
    privilegeId INT NOT NULL,
    status VARCHAR(20) DEFAULT 'A',
    overrideReason TEXT,
    grantedBy INT,
    expiresAt TIMESTAMP NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy INT,
    updatedBy INT,
    FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (privilegeId) REFERENCES privilegeMaster(id) ON DELETE CASCADE,
    FOREIGN KEY (grantedBy) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_privilege (userId, privilegeId)
);

-- ================================
-- WORKFLOW AND CONFIGURATION TABLES
-- ================================

-- Workflow Steps (For data approval, verification, etc.)
CREATE TABLE workflowSteps (
    id INT PRIMARY KEY AUTO_INCREMENT,
    companyId INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    stepOrder INT NOT NULL,
    requiredUserCategoryId INT,
    requiredPrivilegeId INT,
    status VARCHAR(20) DEFAULT 'A',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy INT,
    updatedBy INT,
    FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (requiredUserCategoryId) REFERENCES userCategories(id) ON DELETE SET NULL,
    FOREIGN KEY (requiredPrivilegeId) REFERENCES privilegeMaster(id) ON DELETE SET NULL,
    INDEX idx_company_workflow_order (companyId, stepOrder)
);

-- Workflow Instances (Track workflow execution)
CREATE TABLE workflowInstances (
    id INT PRIMARY KEY AUTO_INCREMENT,
    companyId INT NOT NULL,
    entityType VARCHAR(100) NOT NULL, -- masterData, user, etc.
    entityId INT NOT NULL,
    currentStepId INT,
    status VARCHAR(20) DEFAULT 'pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy INT,
    updatedBy INT,
    FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (currentStepId) REFERENCES workflowSteps(id) ON DELETE SET NULL,
    INDEX idx_company_workflow_status (companyId, status)
);

-- Workflow Step History
CREATE TABLE workflowStepHistory (
    id INT PRIMARY KEY AUTO_INCREMENT,
    workflowInstanceId INT NOT NULL,
    stepId INT NOT NULL,
    actionTaken VARCHAR(50) NOT NULL, -- approve, reject, return
    comments TEXT,
    actionBy INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workflowInstanceId) REFERENCES workflowInstances(id) ON DELETE CASCADE,
    FOREIGN KEY (stepId) REFERENCES workflowSteps(id) ON DELETE CASCADE,
    FOREIGN KEY (actionBy) REFERENCES users(id) ON DELETE NO ACTION
);

-- Company Configurations (UI, Features, etc.)
CREATE TABLE companyConfigurations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    companyId INT NOT NULL,
    configKey VARCHAR(100) NOT NULL,
    configValue JSON,
    description TEXT,
    status VARCHAR(20) DEFAULT 'A',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    createdBy INT,
    updatedBy INT,
    FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE CASCADE,
    UNIQUE KEY unique_company_config (companyId, configKey)
);

-- Audit Logs
CREATE TABLE auditLogs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    companyId INT NOT NULL,
    userId INT NOT NULL,
    entityType VARCHAR(100) NOT NULL,
    entityId INT NOT NULL,
    action VARCHAR(50) NOT NULL,
    oldValue JSON,
    newValue JSON,
    ipAddress VARCHAR(45),
    userAgent VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE NO ACTION,
    INDEX idx_company_audit (companyId, entityType, createdAt)
);

-- User Sessions (JWT Token Management)
CREATE TABLE userSessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    token VARCHAR(500) NOT NULL,
    ipAddress VARCHAR(45),
    userAgent VARCHAR(255),
    status VARCHAR(20) DEFAULT 'A',
    expiresAt TIMESTAMP NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_valid_token (userId, status, expiresAt)
);

-- Performance Optimization Indexes
CREATE INDEX idx_master_data_company_active ON masterData(companyId, status);
CREATE INDEX idx_users_company_active ON users(companyId, status);
CREATE INDEX idx_user_categories_company_active ON userCategories(companyId, status);
CREATE INDEX idx_master_types_company_hierarchy ON masterTypes(companyId, hierarchyLevel, status); 