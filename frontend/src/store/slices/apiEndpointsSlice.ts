import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import axiosInstance from '../../config/api.config';

// Types
export interface ApiEndpoint {
  id: number;
  companyId: number;
  path: string;
  method: string;
  handlerType: string;
  handlerConfig: any;
  requiredPrivilegeId?: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: number;
  updatedBy?: number;
}

interface ApiEndpointsState {
  apiEndpoints: ApiEndpoint[];
  loading: boolean;
  error: string | null;
  currentApiEndpoint: ApiEndpoint | null;
  executionResult: any | null;
  executionLoading: boolean;
  executionError: string | null;
}

// Initial state
const initialState: ApiEndpointsState = {
  apiEndpoints: [],
  loading: false,
  error: null,
  currentApiEndpoint: null,
  executionResult: null,
  executionLoading: false,
  executionError: null,
};

// Async thunks
export const fetchApiEndpoints = createAsyncThunk(
  'apiEndpoints/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api-endpoints');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch API endpoints');
    }
  }
);

export const fetchApiEndpointById = createAsyncThunk(
  'apiEndpoints/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api-endpoints/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch API endpoint');
    }
  }
);

export const createApiEndpoint = createAsyncThunk(
  'apiEndpoints/create',
  async (data: Partial<ApiEndpoint>, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api-endpoints', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create API endpoint');
    }
  }
);

export const updateApiEndpoint = createAsyncThunk(
  'apiEndpoints/update',
  async ({ id, data }: { id: number; data: Partial<ApiEndpoint> }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/api-endpoints/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update API endpoint');
    }
  }
);

export const deleteApiEndpoint = createAsyncThunk(
  'apiEndpoints/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/api-endpoints/${id}`);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete API endpoint');
    }
  }
);

export const executeApiEndpoint = createAsyncThunk(
  'apiEndpoints/execute',
  async (
    { path, method, data }: { path: string; method: string; data: any },
    { rejectWithValue }
  ) => {
    try {
      let response;
      
      switch (method.toUpperCase()) {
        case 'GET':
          response = await axiosInstance.get(`/api-endpoints/execute/${path}`, { params: data });
          break;
        case 'POST':
          response = await axiosInstance.post(`/api-endpoints/execute/${path}`, data);
          break;
        case 'PUT':
          response = await axiosInstance.put(`/api-endpoints/execute/${path}`, data);
          break;
        case 'PATCH':
          response = await axiosInstance.patch(`/api-endpoints/execute/${path}`, data);
          break;
        case 'DELETE':
          response = await axiosInstance.delete(`/api-endpoints/execute/${path}`, { data });
          break;
        default:
          return rejectWithValue(`Unsupported method: ${method}`);
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to execute API endpoint');
    }
  }
);

// Slice
const apiEndpointsSlice = createSlice({
  name: 'apiEndpoints',
  initialState,
  reducers: {
    clearCurrentApiEndpoint: (state) => {
      state.currentApiEndpoint = null;
    },
    setCurrentApiEndpoint: (state, action) => {
      state.currentApiEndpoint = action.payload;
    },
    clearExecutionResult: (state) => {
      state.executionResult = null;
      state.executionError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all API endpoints
      .addCase(fetchApiEndpoints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApiEndpoints.fulfilled, (state, action) => {
        state.loading = false;
        state.apiEndpoints = action.payload;
      })
      .addCase(fetchApiEndpoints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch API endpoint by ID
      .addCase(fetchApiEndpointById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApiEndpointById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentApiEndpoint = action.payload;
      })
      .addCase(fetchApiEndpointById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create API endpoint
      .addCase(createApiEndpoint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createApiEndpoint.fulfilled, (state, action) => {
        state.loading = false;
        state.apiEndpoints.push(action.payload);
        state.currentApiEndpoint = action.payload;
      })
      .addCase(createApiEndpoint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update API endpoint
      .addCase(updateApiEndpoint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApiEndpoint.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.apiEndpoints.findIndex((endpoint) => endpoint.id === action.payload.id);
        if (index !== -1) {
          state.apiEndpoints[index] = action.payload;
        }
        state.currentApiEndpoint = action.payload;
      })
      .addCase(updateApiEndpoint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete API endpoint
      .addCase(deleteApiEndpoint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteApiEndpoint.fulfilled, (state, action) => {
        state.loading = false;
        state.apiEndpoints = state.apiEndpoints.filter(
          (endpoint) => endpoint.id !== action.payload.id
        );
        if (state.currentApiEndpoint?.id === action.payload.id) {
          state.currentApiEndpoint = null;
        }
      })
      .addCase(deleteApiEndpoint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Execute API endpoint
      .addCase(executeApiEndpoint.pending, (state) => {
        state.executionLoading = true;
        state.executionError = null;
        state.executionResult = null;
      })
      .addCase(executeApiEndpoint.fulfilled, (state, action) => {
        state.executionLoading = false;
        state.executionResult = action.payload;
      })
      .addCase(executeApiEndpoint.rejected, (state, action) => {
        state.executionLoading = false;
        state.executionError = action.payload as string;
      });
  },
});

// Selectors
export const selectAllApiEndpoints = (state: RootState) => state.apiEndpoints.apiEndpoints;
export const selectApiEndpointById = (id: number) => (state: RootState) =>
  state.apiEndpoints.apiEndpoints.find((endpoint) => endpoint.id === id);
export const selectCurrentApiEndpoint = (state: RootState) => state.apiEndpoints.currentApiEndpoint;
export const selectApiEndpointsLoading = (state: RootState) => state.apiEndpoints.loading;
export const selectApiEndpointsError = (state: RootState) => state.apiEndpoints.error;
export const selectExecutionResult = (state: RootState) => state.apiEndpoints.executionResult;
export const selectExecutionLoading = (state: RootState) => state.apiEndpoints.executionLoading;
export const selectExecutionError = (state: RootState) => state.apiEndpoints.executionError;

// Actions
export const { clearCurrentApiEndpoint, setCurrentApiEndpoint, clearExecutionResult } = apiEndpointsSlice.actions;

export default apiEndpointsSlice.reducer;
