import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import axiosInstance from '../../config/api.config';

// Types
export interface BusinessRule {
  id: number;
  companyId: number;
  name: string;
  description?: string;
  entityType: string; 
  eventType: string;
  condition: any;
  action: any;
  priority: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: number;
  updatedBy?: number;
}

interface BusinessRulesState {
  businessRules: BusinessRule[];
  loading: boolean;
  error: string | null;
  currentBusinessRule: BusinessRule | null;
}

// Initial state
const initialState: BusinessRulesState = {
  businessRules: [],
  loading: false,
  error: null,
  currentBusinessRule: null,
};

// Async thunks
export const fetchBusinessRules = createAsyncThunk(
  'businessRules/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/business-rules');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch business rules');
    }
  }
);

export const fetchBusinessRuleById = createAsyncThunk(
  'businessRules/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/business-rules/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch business rule');
    }
  }
);

export const createBusinessRule = createAsyncThunk(
  'businessRules/create',
  async (data: Partial<BusinessRule>, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/business-rules', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create business rule');
    }
  }
);

export const updateBusinessRule = createAsyncThunk(
  'businessRules/update',
  async ({ id, data }: { id: number; data: Partial<BusinessRule> }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/business-rules/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update business rule');
    }
  }
);

export const deleteBusinessRule = createAsyncThunk(
  'businessRules/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/business-rules/${id}`);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete business rule');
    }
  }
);

export const evaluateBusinessRules = createAsyncThunk(
  'businessRules/evaluate',
  async (
    { entityType, eventType, data }: { entityType: string; eventType: string; data: any },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post(
        `/business-rules/evaluate/${entityType}/${eventType}`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to evaluate business rules');
    }
  }
);

// Slice
const businessRulesSlice = createSlice({
  name: 'businessRules',
  initialState,
  reducers: {
    clearCurrentBusinessRule: (state) => {
      state.currentBusinessRule = null;
    },
    setCurrentBusinessRule: (state, action) => {
      state.currentBusinessRule = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all business rules
      .addCase(fetchBusinessRules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusinessRules.fulfilled, (state, action) => {
        state.loading = false;
        state.businessRules = action.payload;
      })
      .addCase(fetchBusinessRules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch business rule by ID
      .addCase(fetchBusinessRuleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusinessRuleById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBusinessRule = action.payload;
      })
      .addCase(fetchBusinessRuleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create business rule
      .addCase(createBusinessRule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBusinessRule.fulfilled, (state, action) => {
        state.loading = false;
        state.businessRules.push(action.payload);
        state.currentBusinessRule = action.payload;
      })
      .addCase(createBusinessRule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update business rule
      .addCase(updateBusinessRule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBusinessRule.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.businessRules.findIndex((rule) => rule.id === action.payload.id);
        if (index !== -1) {
          state.businessRules[index] = action.payload;
        }
        state.currentBusinessRule = action.payload;
      })
      .addCase(updateBusinessRule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete business rule
      .addCase(deleteBusinessRule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBusinessRule.fulfilled, (state, action) => {
        state.loading = false;
        state.businessRules = state.businessRules.filter((rule) => rule.id !== action.payload.id);
        if (state.currentBusinessRule?.id === action.payload.id) {
          state.currentBusinessRule = null;
        }
      })
      .addCase(deleteBusinessRule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Selectors
export const selectAllBusinessRules = (state: RootState) => state.businessRules.businessRules;
export const selectBusinessRuleById = (id: number) => (state: RootState) =>
  state.businessRules.businessRules.find((rule) => rule.id === id);
export const selectCurrentBusinessRule = (state: RootState) => state.businessRules.currentBusinessRule;
export const selectBusinessRulesLoading = (state: RootState) => state.businessRules.loading;
export const selectBusinessRulesError = (state: RootState) => state.businessRules.error;

// Actions
export const { clearCurrentBusinessRule, setCurrentBusinessRule } = businessRulesSlice.actions;

export default businessRulesSlice.reducer;
