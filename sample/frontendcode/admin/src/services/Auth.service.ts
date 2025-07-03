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
import { API_CONFIG } from "../config/Api.config";
import { convertor } from "../utils/Conversion.utils";

const baseUrl = API_CONFIG.BACKEND_URL;

const login = async (
  credentials: LoginCredentialsProps
): Promise<LoginResponseProps> => {
  try {
    let headers = {
      userKey: await convertor("base64", "decrypt", API_CONFIG.USER_KEY),
      securityKey: await convertor(
        "base64",
        "decrypt",
        API_CONFIG.SECURITY_KEY
      ),
    };

    let body = classToPlain(credentials);
    body.password = btoa(body.password);

    const response: AxiosResponse = await axios.post(
      baseUrl + "user_management/login",
      new URLSearchParams(body),
      { headers }
    );

    const data: LoginResponseProps = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return {
      status: 0,
      msg: "Login failed with api calling...!",
      data: [],
    };
  }
};

const loginCaptcha = async (
  credentials: LoginCredentialsProps
): Promise<LoginResponseProps> => {
  try {
    let headers = {
      userKey: await convertor("base64", "decrypt", API_CONFIG.USER_KEY),
      securityKey: await convertor(
        "base64",
        "decrypt",
        API_CONFIG.SECURITY_KEY
      ),
    };

    let body = classToPlain(credentials);
    body.password = btoa(body.password);
    if (credentials.captcha) {
      body.captcha = credentials.captcha;
    } else {
      delete body.captcha;
    }

    const response: AxiosResponse = await axios.post(
      baseUrl + "user_management/loginCaptcha",
      new URLSearchParams(body),
      { headers }
    );

    const data: LoginResponseProps = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return {
      status: 0,
      msg: "Login failed with api calling...!",
      data: [],
      // Optionally include default values for lockout fields
      passwordErrorCount: 0,
      loginLockedExpiryDateTime: "",
    };
  }
};

const autoLogin = async (
  credentials: AutoLoginCredentialsProps
): Promise<LoginResponseProps> => {
  try {
    let headers = {
      userKey: await convertor("base64", "decrypt", API_CONFIG.USER_KEY),
      securityKey: await convertor(
        "base64",
        "decrypt",
        API_CONFIG.SECURITY_KEY
      ),
      sessionId: credentials.sessionId,
    };

    let body = classToPlain(credentials);

    const response: AxiosResponse = await axios.post(
      baseUrl + "user_management/autologin",
      new URLSearchParams(body),
      { headers }
    );

    const data: LoginResponseProps = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return {
      status: 0,
      msg: "Login failed with api calling...!",
      data: [],
    };
  }
};

const userPrivilegesApi = async (
  header: ApiHeaderProps,
  input: fetchUserPrivProps
) => {
  try {
    let headers = {
      userKey: await convertor("base64", "decrypt", API_CONFIG.USER_KEY),
      securityKey: await convertor(
        "base64",
        "decrypt",
        API_CONFIG.SECURITY_KEY
      ),
      ...header,
    };

    let body = classToPlain(input);

    const response: AxiosResponse = await axios.post(
      baseUrl + "privileges/fetchUserPrivileges",
      new URLSearchParams(body),
      { headers }
    );

    const data: UserPrivResponseProps = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return {
      status: 0,
      msg: "Login failed with api calling...!",
      data: [],
    };
  }
};

const forgotPassword = async (email: string): Promise<UserUpdateProps> => {
  try {
    let headers = {
      userKey: await convertor("base64", "decrypt", API_CONFIG.USER_KEY),
      securityKey: await convertor(
        "base64",
        "decrypt",
        API_CONFIG.SECURITY_KEY
      ),
    };

    let body = { email: email };

    const response: AxiosResponse = await axios.post(
      baseUrl + "user_management/forgot_password",
      new URLSearchParams(body),
      { headers }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    return {
      status: 0,
      msg: "Login failed with api calling...!",
      data: [],
    };
  }
};

const changePassword = async (
  header: ApiHeaderProps,
  input: ChangePasswordProps
): Promise<UserUpdateProps> => {
  try {
    let headers = {
      userKey: await convertor("base64", "decrypt", API_CONFIG.USER_KEY),
      securityKey: await convertor(
        "base64",
        "decrypt",
        API_CONFIG.SECURITY_KEY
      ),
      ...header,
    };

    let body = classToPlain(input);

    const response: AxiosResponse = await axios.post(
      baseUrl + "user_management/update",
      body,
      { headers }
    );

    return response.data;
  } catch (err) {
    console.log(err);
    return {
      status: 0,
      msg: "Error in api...!",
      data: [],
    };
  }
};

const logout = async (
  credentials: LogoutCredentialsProps
): Promise<LogoutResponseProps> => {
  try {
    let headers = {
      userKey: await convertor("base64", "decrypt", API_CONFIG.USER_KEY),
      securityKey: await convertor(
        "base64",
        "decrypt",
        API_CONFIG.SECURITY_KEY
      ),
      user_id: credentials.userId,
      session_id: credentials.sessionId,
    };
    let body = classToPlain(credentials);

    const response = await axios.post(
      baseUrl + "user_management/logout",
      new URLSearchParams(body),
      { headers }
    );
    const data: LogoutResponseProps = response.data;
    return data;
  } catch (error) {
    console.error(error);
    return {
      status: 0,
      msg: "Logout failed with api calling...!",
      data: [],
    };
  }
};

const authService = {
  login,
  loginCaptcha,
  autoLogin,
  userPrivilegesApi,
  forgotPassword,
  changePassword,
  logout,
};

export default authService;

