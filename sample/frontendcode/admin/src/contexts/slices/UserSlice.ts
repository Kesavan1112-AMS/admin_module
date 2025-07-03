import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type {
  AutoLoginCredentialsProps,
  LoginResponseProps,
  LogoutCredentialsProps,
  LogoutResponseProps,
} from "../../props/Auth.props";
import authService from "../../services/Auth.service";

interface AuthReduxType {
  loggedUser: any | null;
  isLoading: boolean;
  isError: string | null;
  sessionExpired: boolean;
}

const initialState: AuthReduxType = {
  loggedUser: null,
  isLoading: false,
  isError: null,
  sessionExpired: false,
};

const userSlice = createSlice({
  name: "user_auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
    },
    loginSuccess: (state, action: PayloadAction<any>) => {
      state.loggedUser = action.payload;
      state.isLoading = false;
      state.isError = null;
      state.sessionExpired = false;
    },
    loggedUserUpdate: (state, action: PayloadAction<any>) => {
      state.loggedUser = {
        ...state.loggedUser,
        ...action.payload,
      };
      state.isLoading = false;
    },
    loginFail: (state, action: PayloadAction<string>) => {
      state.isError = action.payload;
      state.isLoading = false;
      state.sessionExpired = false;
      localStorage.removeItem("sessionExpirationTime");
    },
    logOut: (state) => {
      state.loggedUser = null;
      state.isLoading = false;
      state.isError = null;
      state.sessionExpired = false;
      localStorage.removeItem("sessionExpirationTime");
    },
    setSessionExpired: (state) => {
      state.sessionExpired = true;
    },
    clearSessionExpired: (state) => {
      state.sessionExpired = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(autoLogin.fulfilled, (state, action) => {
        state.loggedUser = action.payload;
        state.isLoading = false;
        state.isError = null;
        state.sessionExpired = false;
      })
      .addCase(autoLogin.rejected, (state) => {
        state.loggedUser = null;
        state.isLoading = false;
        state.isError = "Auto login failed";
        state.sessionExpired = false;

        localStorage.removeItem("sessionExpirationTime");
      })
      .addCase(logout.fulfilled, (state) => {
        state.loggedUser = null;
        state.isLoading = false;
        state.isError = null;
        state.sessionExpired = false;
        localStorage.removeItem("sessionExpirationTime");
      })
      .addCase(logout.rejected, (state) => {
        state.loggedUser = null;
        state.isLoading = false;
        state.isError = null;
        state.sessionExpired = false;
        localStorage.removeItem("sessionExpirationTime");
      });
  },
});

export const autoLogin = createAsyncThunk(
  "user_auth/autologin",
  async (data: AutoLoginCredentialsProps) => {
    const response: LoginResponseProps = await authService.autoLogin(data);
    if (response.status == 1) {
      return response.data[0];
    } else {
      return null;
    }
  }
);

export const logout = createAsyncThunk(
  "user_auth/logout",
  async (data: LogoutCredentialsProps) => {
    const response: LogoutResponseProps = await authService.logout(data);
    if (response.status == 1) {
      return response.data[0];
    } else {
      return null;
    }
  }
);

export const {
  loginStart,
  loginSuccess,
  loggedUserUpdate,
  loginFail,
  logOut,
  setSessionExpired,
  clearSessionExpired,
} = userSlice.actions;
export default userSlice.reducer;