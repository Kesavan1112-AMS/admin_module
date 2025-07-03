import axios, { AxiosResponse } from "axios";
import { API_CONFIG, API_ENDPOINTS } from "../config/Api.config";

const baseUrl = API_CONFIG.BACKEND_URL;

export interface MenuItem {
  id: number;
  label: string;
  route?: string;
  icon?: string;
  order?: number;
  children?: MenuItem[];
}

export interface PageConfig {
  id: number;
  key: string;
  title: string;
  description?: string;
  columns: TableColumn[];
  actions: PageAction[];
  fields: PageField[];
}

export interface TableColumn {
  id: number;
  key: string;
  label: string;
  type?: string;
  order?: number;
  visible: boolean;
  sortable: boolean;
}

export interface PageAction {
  id: number;
  key: string;
  label: string;
  order?: number;
  visible: boolean;
}

export interface PageField {
  id: number;
  key: string;
  label: string;
  type?: string;
  required: boolean;
  visible: boolean;
  order?: number;
}

export interface ThemeConfig {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
}

export interface ApiResponse<T> {
  status: number;
  msg: string;
  data: T;
  error?: string;
}

const getMenuConfiguration = async (
  companyId: number
): Promise<ApiResponse<MenuItem[]>> => {
  try {
    const response: AxiosResponse = await axios.get(
      `${baseUrl}${API_ENDPOINTS.UI_CONFIG.MENU}/${companyId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Menu configuration error:", error);
    return {
      status: 0,
      msg: "Failed to fetch menu configuration.",
      data: [],
      error: error?.message || "Unknown error",
    };
  }
};

const getPageConfiguration = async (
  companyId: number,
  pageKey: string
): Promise<ApiResponse<PageConfig | null>> => {
  try {
    const response: AxiosResponse = await axios.get(
      `${baseUrl}${API_ENDPOINTS.UI_CONFIG.PAGE}/${companyId}/${pageKey}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Page configuration error:", error);
    return {
      status: 0,
      msg: "Failed to fetch page configuration.",
      data: null,
      error: error?.message || "Unknown error",
    };
  }
};

const getThemeConfiguration = async (
  companyId: number
): Promise<ApiResponse<ThemeConfig>> => {
  try {
    const response: AxiosResponse = await axios.get(
      `${baseUrl}${API_ENDPOINTS.UI_CONFIG.THEME}/${companyId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Theme configuration error:", error);
    return {
      status: 0,
      msg: "Failed to fetch theme configuration.",
      data: {
        primary: "#3B82F6",
        secondary: "#6B7280",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        background: "#FFFFFF",
        surface: "#F9FAFB",
        text: "#111827",
        textSecondary: "#6B7280",
      },
      error: error?.message || "Unknown error",
    };
  }
};

const createMenu = async (
  companyId: number,
  menuData: Partial<MenuItem>
): Promise<ApiResponse<any[]>> => {
  try {
    const response: AxiosResponse = await axios.post(
      `${baseUrl}${API_ENDPOINTS.UI_CONFIG.MENU}/${companyId}`,
      menuData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Create menu error:", error);
    return {
      status: 0,
      msg: "Failed to create menu.",
      data: [],
      error: error?.message || "Unknown error",
    };
  }
};

const createPage = async (
  companyId: number,
  pageData: Partial<PageConfig>
): Promise<ApiResponse<any[]>> => {
  try {
    const response: AxiosResponse = await axios.post(
      `${baseUrl}${API_ENDPOINTS.UI_CONFIG.PAGE}/${companyId}`,
      pageData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Create page error:", error);
    return {
      status: 0,
      msg: "Failed to create page.",
      data: [],
      error: error?.message || "Unknown error",
    };
  }
};

export {
  getMenuConfiguration,
  getPageConfiguration,
  getThemeConfiguration,
  createMenu,
  createPage,
};
