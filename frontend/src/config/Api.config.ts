export const API_CONFIG = {
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api/",
  USER_KEY: import.meta.env.VITE_USER_KEY || "dXNlcl9rZXk=",
  SECURITY_KEY: import.meta.env.VITE_SECURITY_KEY || "c2VjdXJpdHlfa2V5",
  FUSIONCHARTS_LICENSE_KEY: import.meta.env.VITE_FUSIONCHARTS_LICENSE_KEY || "",
  APP_NAME: import.meta.env.VITE_APP_NAME || "Admin Module",
  APP_VERSION: import.meta.env.VITE_APP_VERSION || "1.0.0",
};

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "auth/login",
    LOGOUT: "auth/logout",
    REGISTER: "auth/register",
    ME: "auth/me",
  },

  // UI Configuration
  UI_CONFIG: {
    MENU: "ui-config/menu",
    PAGE: "ui-config/page",
    THEME: "ui-config/theme",
  },

  // Company Management
  COMPANY: {
    BASE: "company",
    CONFIG: "company-configuration",
  },

  // User Management
  USER: {
    BASE: "user",
    CATEGORY: "user-category",
    PRIVILEGE: "user-privilege",
    MASTER_MAPPING: "user-master-mapping",
  },

  // Master Data
  MASTER: {
    TYPE: "master-type",
    DATA: "master-data",
    HIERARCHY: "master-hierarchy",
    RELATIONSHIPS: "master-data-relationships",
  },

  // Privilege Management
  PRIVILEGE: {
    MASTER: "privilege-master",
    ROLE: "role-privilege",
  },

  // Workflow
  WORKFLOW: {
    STEP: "workflow-step",
    INSTANCE: "workflow-instance",
    HISTORY: "workflow-step-history",
  },
};
