import axios, { AxiosResponse } from "axios";
import {
  ApiHeaderProps,
  AutoLoginCredentialsProps,
  fetchUserPrivProps,
  UserUpdateProps,
  LoginCredentialsProps,
  LoginResponseProps,
  LogoutCredentialsProps,
  LogoutResponseProps,
  UserPrivResponseProps,
  ChangePasswordProps,
} from "../props/Auth.props";
import { classToPlain } from "class-transformer";
import { API_CONFIG, API_ENDPOINTS } from "../config/Api.config";
import { convertor } from "../utils/Conversion.utils";

const baseUrl = API_CONFIG.BACKEND_URL;

const login = async (
  credentials: LoginCredentialsProps
): Promise<LoginResponseProps> => {
  try {
    const response: AxiosResponse = await axios.post(
      baseUrl + API_ENDPOINTS.AUTH.LOGIN,
      credentials,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    const data: LoginResponseProps = response.data;
    return data;
  } catch (error) {
    console.error("Login error:", error);
    return {
      status: 0,
      msg: "Login failed. Please check your credentials.",
      data: [],
    };
  }
};

const loginCaptcha = async (
  credentials: LoginCredentialsProps
): Promise<LoginResponseProps> => {
  try {
    const response: AxiosResponse = await axios.post(
      baseUrl + API_ENDPOINTS.AUTH.LOGIN,
      credentials,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    const data: LoginResponseProps = response.data;
    return data;
  } catch (error) {
    console.error("Login captcha error:", error);
    return {
      status: 0,
      msg: "Login failed. Please check your credentials.",
      data: [],
      passwordErrorCount: 0,
      loginLockedExpiryDateTime: "",
    };
  }
};

const autoLogin = async (
  credentials: AutoLoginCredentialsProps
): Promise<LoginResponseProps> => {
  try {
    const response: AxiosResponse = await axios.post(
      baseUrl + API_ENDPOINTS.AUTH.ME,
      credentials,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    const data: LoginResponseProps = response.data;
    return data;
  } catch (error) {
    console.error("Auto login error:", error);
    return {
      status: 0,
      msg: "Auto login failed.",
      data: [],
    };
  }
};

const userPrivilegesApi = async (
  header: ApiHeaderProps,
  input: fetchUserPrivProps
) => {
  try {
    const response: AxiosResponse = await axios.post(
      baseUrl + API_ENDPOINTS.USER.PRIVILEGE + "/find-all",
      input,
      {
        headers: {
          "Content-Type": "application/json",
          ...header,
        },
        withCredentials: true,
      }
    );

    const data: UserPrivResponseProps = response.data;
    return data;
  } catch (error) {
    console.error("User privileges error:", error);
    return {
      status: 0,
      msg: "Failed to fetch user privileges.",
      data: [],
    };
  }
};

const forgotPassword = async (email: string): Promise<UserUpdateProps> => {
  try {
    const response: AxiosResponse = await axios.post(
      baseUrl + "auth/forgot-password",
      { email },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Forgot password error:", error);
    return {
      status: 0,
      msg: "Failed to process forgot password request.",
      data: [],
    };
  }
};

const changePassword = async (
  header: ApiHeaderProps,
  input: ChangePasswordProps
): Promise<UserUpdateProps> => {
  try {
    const response: AxiosResponse = await axios.post(
      baseUrl + "auth/change-password",
      input,
      {
        headers: {
          "Content-Type": "application/json",
          ...header,
        },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Change password error:", error);
    return {
      status: 0,
      msg: "Failed to change password.",
      data: [],
    };
  }
};

const logout = async (
  credentials: LogoutCredentialsProps
): Promise<LogoutResponseProps> => {
  try {
    const response: AxiosResponse = await axios.post(
      baseUrl + API_ENDPOINTS.AUTH.LOGOUT,
      credentials,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    const data: LogoutResponseProps = response.data;
    return data;
  } catch (error) {
    console.error("Logout error:", error);
    return {
      status: 0,
      msg: "Logout failed.",
      data: [],
    };
  }
};

const validateSession = async (): Promise<LoginResponseProps> => {
  try {
    const response: AxiosResponse = await axios.post(
      baseUrl + API_ENDPOINTS.AUTH.ME,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    const data: LoginResponseProps = response.data;
    return data;
  } catch (error) {
    console.error("Session validation error:", error);
    return {
      status: 0,
      msg: "Session validation failed.",
      data: [],
    };
  }
};

export {
  login,
  loginCaptcha,
  autoLogin,
  userPrivilegesApi,
  forgotPassword,
  changePassword,
  logout,
  validateSession,
};
