-- Enterprise Admin Module Database Structure
-- Customizable admin module with dynamic masters, hierarchies, and user privileges

-- ================================
-- CORE SYSTEM TABLES
-- ================================

-- Companies/Tenants table
CREATE TABLE companies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    logo_url VARCHAR(500),
    theme_config JSON, -- Stores UI customization
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ================================
-- MASTER CONFIGURATION TABLES
-- ================================

-- Master Types (Region, Cluster, Country, STL, ICAM, Distributor, DSR, etc.)
CREATE TABLE master_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_id INT NOT NULL,
    name VARCHAR(100) NOT NULL, -- region, cluster, country, stl, icam, distributor, dsr
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    hierarchy_level INT NOT NULL, -- 1=top level, 2=second level, etc.
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    UNIQUE KEY unique_company_master_name (company_id, name),
    INDEX idx_company_hierarchy (company_id, hierarchy_level)
);

-- Master Hierarchy Relationships (Parent-Child mapping)
CREATE TABLE master_hierarchy (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_id INT NOT NULL,
    parent_master_type_id INT, -- NULL for root level
    child_master_type_id INT NOT NULL,
    relationship_name VARCHAR(100), -- e.g., "region_has_clusters"
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_master_type_id) REFERENCES master_types(id) ON DELETE CASCADE,
    FOREIGN KEY (child_master_type_id) REFERENCES master_types(id) ON DELETE CASCADE,
    UNIQUE KEY unique_hierarchy_relationship (company_id, parent_master_type_id, child_master_type_id)
);

-- Master Data (Actual data entries for each master type)
CREATE TABLE master_data (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_id INT NOT NULL,
    master_type_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) NOT NULL,
    display_name VARCHAR(255),
    description TEXT,
    metadata JSON, -- Store additional custom fields
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (master_type_id) REFERENCES master_types(id) ON DELETE CASCADE,
    UNIQUE KEY unique_company_master_code (company_id, master_type_id, code),
    INDEX idx_company_master_type (company_id, master_type_id)
);

-- Master Data Relationships (Parent-Child data mapping)
CREATE TABLE master_data_relationships (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_id INT NOT NULL,
    parent_master_data_id INT,
    child_master_data_id INT NOT NULL,
    relationship_type VARCHAR(100), -- based on master_hierarchy.relationship_name
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_master_data_id) REFERENCES master_data(id) ON DELETE CASCADE,
    FOREIGN KEY (child_master_data_id) REFERENCES master_data(id) ON DELETE CASCADE,
    UNIQUE KEY unique_master_relationship (parent_master_data_id, child_master_data_id),
    INDEX idx_company_relationships (company_id, relationship_type)
);

-- ================================
-- USER MANAGEMENT TABLES
-- ================================

-- User Categories/Roles (Admin, Global, Region, Cluster, etc.)
CREATE TABLE user_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_id INT NOT NULL,
    name VARCHAR(100) NOT NULL, -- admin, global, region, cluster, country, stl, icam, distributor, dsr
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    hierarchy_level INT, -- Maps to master_types hierarchy level (NULL for admin/global)
    master_type_id INT, -- Which master type this category is associated with
    access_scope ENUM('full', 'hierarchy', 'mapped', 'own') DEFAULT 'own',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (master_type_id) REFERENCES master_types(id) ON DELETE SET NULL,
    UNIQUE KEY unique_company_category (company_id, name)
);

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_id INT NOT NULL,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    user_category_id INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    password_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (user_category_id) REFERENCES user_categories(id),
    UNIQUE KEY unique_company_username (company_id, username),
    UNIQUE KEY unique_company_email (company_id, email),
    INDEX idx_company_category (company_id, user_category_id)
);

-- User Master Data Mapping (Which masters a user has access to)
CREATE TABLE user_master_mappings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_id INT NOT NULL,
    user_id INT NOT NULL,
    master_data_id INT NOT NULL,
    access_type ENUM('direct', 'inherited') DEFAULT 'direct',
    granted_by INT, -- Which user granted this access
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (master_data_id) REFERENCES master_data(id) ON DELETE CASCADE,
    FOREIGN KEY (granted_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_master_mapping (user_id, master_data_id),
    INDEX idx_company_user_mappings (company_id, user_id)
);

-- ================================
-- PRIVILEGE MANAGEMENT TABLES
-- ================================

-- Modules/Features in the system
CREATE TABLE modules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    module_group VARCHAR(100), -- Group related modules
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    UNIQUE KEY unique_company_module (company_id, name)
);

-- Privilege Master (CRUD operations, custom actions)
CREATE TABLE privilege_master (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_id INT NOT NULL,
    module_id INT NOT NULL,
    name VARCHAR(100) NOT NULL, -- create, read, update, delete, export, import, approve, etc.
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
    UNIQUE KEY unique_module_privilege (module_id, name)
);

-- Role-based Privileges (What privileges each user category has)
CREATE TABLE role_privileges (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_id INT NOT NULL,
    user_category_id INT NOT NULL,
    privilege_id INT NOT NULL,
    is_granted BOOLEAN DEFAULT TRUE,
    granted_by INT,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (user_category_id) REFERENCES user_categories(id) ON DELETE CASCADE,
    FOREIGN KEY (privilege_id) REFERENCES privilege_master(id) ON DELETE CASCADE,
    FOREIGN KEY (granted_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_role_privilege (user_category_id, privilege_id)
);

-- User-specific Privileges (Override role privileges)
CREATE TABLE user_privileges (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_id INT NOT NULL,
    user_id INT NOT NULL,
    privilege_id INT NOT NULL,
    is_granted BOOLEAN DEFAULT TRUE,
    override_reason TEXT,
    granted_by INT,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (privilege_id) REFERENCES privilege_master(id) ON DELETE CASCADE,
    FOREIGN KEY (granted_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_privilege (user_id, privilege_id)
);

-- ================================
-- WORKFLOW AND CONFIGURATION TABLES
-- ================================

-- Workflow Steps (For data approval, verification, etc.)
CREATE TABLE workflow_steps (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    step_order INT NOT NULL,
    required_user_category_id INT,
    required_privilege_id INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (required_user_category_id) REFERENCES user_categories(id) ON DELETE SET NULL,
    FOREIGN KEY (required_privilege_id) REFERENCES privilege_master(id) ON DELETE SET NULL,
    INDEX idx_company_workflow_order (company_id, step_order)
);

-- Workflow Instances (Track workflow execution)
CREATE TABLE workflow_instances (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_id INT NOT NULL,
    entity_type VARCHAR(100) NOT NULL, -- master_data, user, etc.
    entity_id INT NOT NULL,
    current_step_id INT,
    status ENUM('pending', 'in_progress', 'completed', 'rejected') DEFAULT 'pending',
    initiated_by INT NOT NULL,
    initiated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (current_step_id) REFERENCES workflow_steps(id) ON DELETE SET NULL,
    FOREIGN KEY (initiated_by) REFERENCES users(id),
    INDEX idx_company_workflow_status (company_id, status)
);

-- Workflow Step History
CREATE TABLE workflow_step_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    workflow_instance_id INT NOT NULL,
    step_id INT NOT NULL,
    processed_by INT,
    action ENUM('approved', 'rejected', 'forwarded') NOT NULL,
    comments TEXT,
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workflow_instance_id) REFERENCES workflow_instances(id) ON DELETE CASCADE,
    FOREIGN KEY (step_id) REFERENCES workflow_steps(id),
    FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ================================
-- AUDIT AND LOGGING TABLES
-- ================================

-- System Audit Trail
CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_id INT NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id INT NOT NULL,
    action ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    old_values JSON,
    new_values JSON,
    changed_by INT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_company_table_record (company_id, table_name, record_id),
    INDEX idx_audit_timestamp (changed_at)
);

-- User Sessions (JWT tracking)
CREATE TABLE user_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token_id VARCHAR(255) NOT NULL UNIQUE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_sessions (user_id, is_active),
    INDEX idx_session_expiry (expires_at)
);

-- ================================
-- SYSTEM CONFIGURATION TABLES
-- ================================

-- System Settings (Company-specific configurations)
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_id INT NOT NULL,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    is_editable BOOLEAN DEFAULT TRUE,
    updated_by INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_company_setting (company_id, setting_key)
);

-- ================================
-- INDEXES FOR PERFORMANCE
-- ================================

-- Additional indexes for frequently queried columns
CREATE INDEX idx_master_data_company_active ON master_data(company_id, is_active);
CREATE INDEX idx_users_company_active ON users(company_id, is_active);
CREATE INDEX idx_user_categories_company_active ON user_categories(company_id, is_active);
CREATE INDEX idx_master_types_company_hierarchy ON master_types(company_id, hierarchy_level, is_active);

-- ================================
-- SAMPLE DATA INSERTION
-- ================================

-- Sample Company
INSERT INTO companies (name, code, theme_config, status) VALUES 
('Sample Enterprise', 'SAMPLE_ENT', '{"primaryColor": "#007bff", "secondaryColor": "#6c757d"}', 'active');

-- Sample Master Types (Traditional hierarchy)
INSERT INTO master_types (company_id, name, display_name, hierarchy_level) VALUES 
(1, 'region', 'Region', 1),
(1, 'cluster', 'Cluster', 2),
(1, 'country', 'Country', 3),
(1, 'stl', 'STL', 4),
(1, 'icam', 'ICAM', 5),
(1, 'distributor', 'Distributor', 6),
(1, 'dsr', 'DSR', 7);

-- Sample Master Hierarchy
INSERT INTO master_hierarchy (company_id, parent_master_type_id, child_master_type_id, relationship_name) VALUES 
(1, 1, 2, 'region_has_clusters'),
(1, 2, 3, 'cluster_has_countries'),
(1, 3, 4, 'country_has_stls'),
(1, 4, 5, 'stl_has_icams'),
(1, 5, 6, 'icam_has_distributors'),
(1, 6, 7, 'distributor_has_dsrs');

-- Sample User Categories
INSERT INTO user_categories (company_id, name, display_name, access_scope) VALUES 
(1, 'admin', 'Administrator', 'full'),
(1, 'global', 'Global Manager', 'full'),
(1, 'region', 'Regional Manager', 'hierarchy'),
(1, 'cluster', 'Cluster Manager', 'hierarchy'),
(1, 'country', 'Country Manager', 'hierarchy'),
(1, 'stl', 'STL Manager', 'hierarchy'),
(1, 'icam', 'ICAM Manager', 'hierarchy'),
(1, 'distributor', 'Distributor', 'hierarchy'),
(1, 'dsr', 'DSR', 'own');

-- Sample Modules
INSERT INTO modules (company_id, name, display_name, module_group) VALUES 
(1, 'master_management', 'Master Management', 'core'),
(1, 'user_management', 'User Management', 'core'),
(1, 'reports', 'Reports', 'analytics'),
(1, 'dashboard', 'Dashboard', 'core');

-- Sample Privileges
INSERT INTO privilege_master (company_id, module_id, name, display_name) VALUES 
(1, 1, 'create', 'Create'),
(1, 1, 'read', 'Read'),
(1, 1, 'update', 'Update'),
(1, 1, 'delete', 'Delete'),
(1, 2, 'create', 'Create'),
(1, 2, 'read', 'Read'),
(1, 2, 'update', 'Update'),
(1, 2, 'delete', 'Delete'),
(1, 3, 'read', 'Read'),
(1, 3, 'export', 'Export'),
(1, 4, 'read', 'Read');