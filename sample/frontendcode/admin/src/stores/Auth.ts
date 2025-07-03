import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../contexts/slices/UserSlice";
import { themeSlice } from "../contexts/slices/ThemeSlice";
import dateInfoReducer from "../contexts/slices/DataTillSlice";

export const store = configureStore({
  reducer: {
    loggedUserInfo: userReducer,
    themeInfo: themeSlice.reducer,
    dateInfo: dateInfoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
