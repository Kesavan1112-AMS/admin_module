import { ApiHeaderProps } from "../props/Auth.props";
import { convertor } from "./Conversion.utils";
import { API_CONFIG } from "../config/Api.config";

export const getApiHeaders = async (header: ApiHeaderProps) => {
  return {
    userKey: await convertor("base64", "decrypt", API_CONFIG.USER_KEY),
    securityKey: await convertor("base64", "decrypt", API_CONFIG.SECURITY_KEY),
    ...header,
  };
};
