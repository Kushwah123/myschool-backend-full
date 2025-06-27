
// redux/slices/accountantSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

     const API = process.env.REACT_APP_API_URL  
export const fetchReceipts = createAsyncThunk('accountant/fetchReceipts', async () => {
  const res = await axios.get(`${API}api/fees/receipts`);
  return res.data;
});

const accountantSlice = createSlice({
  name: 'accountant',
  initialState: {
    receipts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReceipts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReceipts.fulfilled, (state, action) => {
        state.loading = false;
        state.receipts = action.payload;
      })
      .addCase(fetchReceipts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default accountantSlice.reducer;
