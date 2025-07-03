import { LoginCredentialsProps, LoginResponseProps } from "./Auth.props";

export interface useAuthProps {
  login: (crendentials: LoginCredentialsProps) => Promise<LoginResponseProps>;
}

export interface useCaptchaAuthProps {
  captchalogin: (
    credentials: LoginCredentialsProps
  ) => Promise<LoginResponseProps>;
}
