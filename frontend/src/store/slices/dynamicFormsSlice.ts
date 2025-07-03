import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import axiosInstance from '../../config/api.config';

// Types
export interface DynamicFormField {
  id: number;
  formId: number;
  companyId: number;
  key: string;
  label: string;
  type: string;
  defaultValue?: string;
  placeholder?: string;
  required: boolean;
  readOnly: boolean;
  validation?: any;
  options?: any;
  orderIndex?: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: number;
  updatedBy?: number;
}

export interface DynamicForm {
  id: number;
  companyId: number;
  name: string;
  description?: string;
  entityType?: string;
  masterTypeId?: number;
  layout?: any;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: number;
  updatedBy?: number;
  fields: DynamicFormField[];
}

interface DynamicFormsState {
  forms: DynamicForm[];
  loading: boolean;
  error: string | null;
  currentForm: DynamicForm | null;
  validationResult: {
    valid: boolean;
    errors?: Record<string, string>;
  } | null;
}

// Initial state
const initialState: DynamicFormsState = {
  forms: [],
  loading: false,
  error: null,
  currentForm: null,
  validationResult: null,
};

// Async thunks
export const fetchForms = createAsyncThunk(
  'dynamicForms/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/dynamic-forms');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch forms');
    }
  }
);

export const fetchFormById = createAsyncThunk(
  'dynamicForms/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/dynamic-forms/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch form');
    }
  }
);

export const fetchFormByName = createAsyncThunk(
  'dynamicForms/fetchByName',
  async (name: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/dynamic-forms/by-name/${name}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch form');
    }
  }
);

export const fetchFormsByEntityType = createAsyncThunk(
  'dynamicForms/fetchByEntityType',
  async (
    { entityType, masterTypeId }: { entityType: string; masterTypeId?: number },
    { rejectWithValue }
  ) => {
    try {
      const url = masterTypeId
        ? `/dynamic-forms/by-entity-type/${entityType}?masterTypeId=${masterTypeId}`
        : `/dynamic-forms/by-entity-type/${entityType}`;
      
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch forms');
    }
  }
);

export const createForm = createAsyncThunk(
  'dynamicForms/create',
  async (data: Partial<DynamicForm>, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/dynamic-forms', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create form');
    }
  }
);

export const updateForm = createAsyncThunk(
  'dynamicForms/update',
  async ({ id, data }: { id: number; data: Partial<DynamicForm> }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/dynamic-forms/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update form');
    }
  }
);

export const deleteForm = createAsyncThunk(
  'dynamicForms/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/dynamic-forms/${id}`);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete form');
    }
  }
);

export const createFormField = createAsyncThunk(
  'dynamicForms/createField',
  async (data: Partial<DynamicFormField>, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/dynamic-forms/field', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create form field');
    }
  }
);

export const updateFormField = createAsyncThunk(
  'dynamicForms/updateField',
  async ({ id, data }: { id: number; data: Partial<DynamicFormField> }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/dynamic-forms/field/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update form field');
    }
  }
);

export const deleteFormField = createAsyncThunk(
  'dynamicForms/deleteField',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/dynamic-forms/field/${id}`);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete form field');
    }
  }
);

export const validateFormData = createAsyncThunk(
  'dynamicForms/validate',
  async ({ formId, data }: { formId: number; data: any }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/dynamic-forms/validate/${formId}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to validate form data');
    }
  }
);

// Slice
const dynamicFormsSlice = createSlice({
  name: 'dynamicForms',
  initialState,
  reducers: {
    clearCurrentForm: (state) => {
      state.currentForm = null;
    },
    setCurrentForm: (state, action) => {
      state.currentForm = action.payload;
    },
    clearValidationResult: (state) => {
      state.validationResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all forms
      .addCase(fetchForms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchForms.fulfilled, (state, action) => {
        state.loading = false;
        state.forms = action.payload;
      })
      .addCase(fetchForms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch form by ID
      .addCase(fetchFormById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFormById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentForm = action.payload;
      })
      .addCase(fetchFormById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch form by name
      .addCase(fetchFormByName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFormByName.fulfilled, (state, action) => {
        state.loading = false;
        state.currentForm = action.payload;
      })
      .addCase(fetchFormByName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch forms by entity type
      .addCase(fetchFormsByEntityType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFormsByEntityType.fulfilled, (state, action) => {
        state.loading = false;
        state.forms = action.payload;
      })
      .addCase(fetchFormsByEntityType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create form
      .addCase(createForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createForm.fulfilled, (state, action) => {
        state.loading = false;
        state.forms.push(action.payload);
        state.currentForm = action.payload;
      })
      .addCase(createForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update form
      .addCase(updateForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateForm.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.forms.findIndex((form) => form.id === action.payload.id);
        if (index !== -1) {
          state.forms[index] = action.payload;
        }
        state.currentForm = action.payload;
      })
      .addCase(updateForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete form
      .addCase(deleteForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteForm.fulfilled, (state, action) => {
        state.loading = false;
        state.forms = state.forms.filter((form) => form.id !== action.payload.id);
        if (state.currentForm?.id === action.payload.id) {
          state.currentForm = null;
        }
      })
      .addCase(deleteForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create form field
      .addCase(createFormField.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFormField.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentForm && state.currentForm.id === action.payload.formId) {
          state.currentForm.fields.push(action.payload);
        }
      })
      .addCase(createFormField.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update form field
      .addCase(updateFormField.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFormField.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentForm) {
          const fieldIndex = state.currentForm.fields.findIndex(
            (field) => field.id === action.payload.id
          );
          if (fieldIndex !== -1) {
            state.currentForm.fields[fieldIndex] = action.payload;
          }
        }
      })
      .addCase(updateFormField.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete form field
      .addCase(deleteFormField.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFormField.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentForm) {
          state.currentForm.fields = state.currentForm.fields.filter(
            (field) => field.id !== action.payload.id
          );
        }
      })
      .addCase(deleteFormField.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Validate form data
      .addCase(validateFormData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateFormData.fulfilled, (state, action) => {
        state.loading = false;
        state.validationResult = action.payload;
      })
      .addCase(validateFormData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Selectors
export const selectAllForms = (state: RootState) => state.dynamicForms.forms;
export const selectFormById = (id: number) => (state: RootState) =>
  state.dynamicForms.forms.find((form) => form.id === id);
export const selectCurrentForm = (state: RootState) => state.dynamicForms.currentForm;
export const selectFormValidationResult = (state: RootState) => state.dynamicForms.validationResult;
export const selectDynamicFormsLoading = (state: RootState) => state.dynamicForms.loading;
export const selectDynamicFormsError = (state: RootState) => state.dynamicForms.error;

// Actions
export const { clearCurrentForm, setCurrentForm, clearValidationResult } = dynamicFormsSlice.actions;

export default dynamicFormsSlice.reducer;
