import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Import reducers
import authReducer from './slices/authSlice';
import uiConfigReducer from './slices/uiConfigSlice';
import masterDataReducer from './slices/masterDataSlice';
import userReducer from './slices/userSlice';
import businessRulesReducer from './slices/businessRulesSlice';
import dynamicFormsReducer from './slices/dynamicFormsSlice';
import apiEndpointsReducer from './slices/apiEndpointsSlice';

// Configure the Redux store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    uiConfig: uiConfigReducer,
    masterData: masterDataReducer,
    user: userReducer,
    businessRules: businessRulesReducer,
    dynamicForms: dynamicFormsReducer,
    apiEndpoints: apiEndpointsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Export types for Redux
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain useDispatch and useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
