import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchYear } from "../../services/Year.service";
import { TillDate } from "../../props/DataTill.props";

interface DateInfoState {
  dateInfo: TillDate;
  isLoading: boolean;
  isError: string | null;
}

const initialState: DateInfoState = {
  dateInfo: {
    date: "",
    month: "",
    year: "",
  },
  isLoading: false,
  isError: null,
};

export const fetchDateInfo = createAsyncThunk(
  "dateInfo/fetchDateInfo",
  async ({
    credentials,
    countryId,
  }: {
    credentials: any;
    countryId: string[];
  }) => {
    const response = await fetchYear(credentials, countryId);
    return response;
  }
);

const dateInfoSlice = createSlice({
  name: "dateInfo",
  initialState,
  reducers: {
    clearDateInfo: (state) => {
      (state.dateInfo = {
        date: "",
        month: "",
        year: "",
      }),
        (state.isError = null);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDateInfo.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(fetchDateInfo.fulfilled, (state, action) => {
        state.dateInfo = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchDateInfo.rejected, (state, action) => {
        state.isError = action.error.message || "Failed to fetch date info";
        state.isLoading = false;
      });
  },
});

export const { clearDateInfo } = dateInfoSlice.actions;
export default dateInfoSlice.reducer;
