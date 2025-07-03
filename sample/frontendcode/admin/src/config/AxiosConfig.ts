import axios from "axios";
import { RootState, store } from "../stores/Auth";
import { API_CONFIG } from "./Api.config";
import { convertor } from "../utils/Conversion.utils";

const api = axios.create({
  baseURL: API_CONFIG.BACKEND_URL,
});

api.interceptors.request.use(
  async (config) => {
    const state: RootState = store.getState();
    const loggedUser = state.loggedUserInfo.loggedUser;

    if (loggedUser) {
      config.headers["sessionId"] = loggedUser.sessionId;
      config.headers["userId"] = loggedUser.id;
      if (!config.headers["userKey"]) {
        config.headers["userKey"] = await convertor(
          "base64",
          "decrypt",
          API_CONFIG.USER_KEY
        );
      }

      if (!config.headers["securityKey"]) {
        config.headers["securityKey"] = await convertor(
          "base64",
          "decrypt",
          API_CONFIG.SECURITY_KEY
        );
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
