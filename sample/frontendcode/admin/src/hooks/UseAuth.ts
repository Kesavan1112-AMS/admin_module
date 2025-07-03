import { useAuthProps, useCaptchaAuthProps } from "../props/CustomHooks.props";
import { LoginCredentialsProps, LoginResponseProps } from "../props/Auth.props";
import authService from "../services/Auth.service";

export const useAuthentication = (): useAuthProps => {
  const login = async (
    credentials: LoginCredentialsProps
  ): Promise<LoginResponseProps> => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error) {
      console.log(error);
      return {
        status: 0,
        msg: "Login failed with api error...!",
        data: [],
      };
    }
  };

  return { login };
};

export const useCaptcheAuthentication = (): useCaptchaAuthProps => {
  const captchalogin = async (
    credentials: LoginCredentialsProps
  ): Promise<LoginResponseProps> => {
    try {
      const response = await authService.loginCaptcha(credentials);
      return response;
    } catch (error) {
      console.log(error);
      return {
        status: 0,
        msg: "Login failed with api error...!",
        data: [],
      };
    }
  };

  return { captchalogin };
};
