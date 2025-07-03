import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  MenuItem,
  PageConfig,
  ThemeConfig,
  getMenuConfiguration,
  getPageConfiguration,
  getThemeConfiguration,
} from "../../services/UiConfig.service";

interface UiConfigReduxType {
  menuItems: MenuItem[];
  currentPage: PageConfig | null;
  theme: ThemeConfig | null;
  isLoading: boolean;
  isError: string | null;
}

const initialState: UiConfigReduxType = {
  menuItems: [],
  currentPage: null,
  theme: null,
  isLoading: false,
  isError: null,
};

const uiConfigSlice = createSlice({
  name: "ui_config",
  initialState,
  reducers: {
    fetchMenuStart: (state) => {
      state.isLoading = true;
      state.isError = null;
    },
    fetchMenuSuccess: (state, action: PayloadAction<MenuItem[]>) => {
      state.menuItems = action.payload;
      state.isLoading = false;
      state.isError = null;
    },
    fetchMenuFailure: (state, action: PayloadAction<string>) => {
      state.menuItems = [];
      state.isLoading = false;
      state.isError = action.payload;
    },
    fetchPageStart: (state) => {
      state.isLoading = true;
      state.isError = null;
    },
    fetchPageSuccess: (state, action: PayloadAction<PageConfig>) => {
      state.currentPage = action.payload;
      state.isLoading = false;
      state.isError = null;
    },
    fetchPageFailure: (state, action: PayloadAction<string>) => {
      state.currentPage = null;
      state.isLoading = false;
      state.isError = action.payload;
    },
    fetchThemeStart: (state) => {
      state.isLoading = true;
      state.isError = null;
    },
    fetchThemeSuccess: (state, action: PayloadAction<ThemeConfig>) => {
      state.theme = action.payload;
      state.isLoading = false;
      state.isError = null;
    },
    fetchThemeFailure: (state, action: PayloadAction<string>) => {
      state.theme = null;
      state.isLoading = false;
      state.isError = action.payload;
    },
    clearUiError: (state) => {
      state.isError = null;
    },
    clearCurrentPage: (state) => {
      state.currentPage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuAsync.fulfilled, (state, action) => {
        state.menuItems = action.payload || [];
        state.isLoading = false;
        state.isError = null;
      })
      .addCase(fetchMenuAsync.rejected, (state, action) => {
        state.menuItems = [];
        state.isLoading = false;
        state.isError = action.error.message || "Failed to fetch menu";
      })
      .addCase(fetchPageAsync.fulfilled, (state, action) => {
        state.currentPage = action.payload;
        state.isLoading = false;
        state.isError = null;
      })
      .addCase(fetchPageAsync.rejected, (state, action) => {
        state.currentPage = null;
        state.isLoading = false;
        state.isError = action.error.message || "Failed to fetch page";
      })
      .addCase(fetchThemeAsync.fulfilled, (state, action) => {
        state.theme = action.payload;
        state.isLoading = false;
        state.isError = null;
      })
      .addCase(fetchThemeAsync.rejected, (state, action) => {
        state.theme = null;
        state.isLoading = false;
        state.isError = action.error.message || "Failed to fetch theme";
      });
  },
});

export const fetchMenuAsync = createAsyncThunk(
  "ui_config/fetchMenu",
  async (companyId: number) => {
    const response = await getMenuConfiguration(companyId);
    if (response.status === 1) {
      return response.data;
    } else {
      throw new Error(response.msg);
    }
  }
);

export const fetchPageAsync = createAsyncThunk(
  "ui_config/fetchPage",
  async ({ companyId, pageKey }: { companyId: number; pageKey: string }) => {
    const response = await getPageConfiguration(companyId, pageKey);
    if (response.status === 1) {
      return response.data;
    } else {
      throw new Error(response.msg);
    }
  }
);

export const fetchThemeAsync = createAsyncThunk(
  "ui_config/fetchTheme",
  async (companyId: number) => {
    const response = await getThemeConfiguration(companyId);
    if (response.status === 1) {
      return response.data;
    } else {
      throw new Error(response.msg);
    }
  }
);

export const {
  fetchMenuStart,
  fetchMenuSuccess,
  fetchMenuFailure,
  fetchPageStart,
  fetchPageSuccess,
  fetchPageFailure,
  fetchThemeStart,
  fetchThemeSuccess,
  fetchThemeFailure,
  clearUiError,
  clearCurrentPage,
} = uiConfigSlice.actions;

export default uiConfigSlice.reducer;
