// feeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL
// ✅ Create Fee Structure Thunk
export const createFeeStructure = createAsyncThunk(
  'fees/createFeeStructure',
  async (feeData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API}api/fees/structure`, feeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchFeeStructures = createAsyncThunk('fee/fetchFeeStructures', async () => {
  const res = await axios.get(`${API}api/fees/structure`);
  return res.data;
});

export const collectFee = createAsyncThunk('fee/collectFee', async (data) => {
  const res = await axios.post(`${API}api/fees/collect`, data);
  return res.data;
});
// ✅ Assign Fee to Students
export const assignFee = createAsyncThunk(
  'fees/assignFee',
  async (assignmentData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API}api/fees/assign`, assignmentData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
// ✅ Fetch All Students
export const fetchStudents = createAsyncThunk(
  'fees/fetchStudents',
  async (studentId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}api/fees/${studentId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const fetchFeeHistoryByParent = createAsyncThunk(
  'fee/fetchFeeHistoryByParent',
  async (parentId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}api/fee/history/parent/${parentId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const feeSlice = createSlice({
  name: 'fee',
  initialState: {
    students: [], // ✅ Default value देने से error नहीं आएगा
    fees: [],
    structures: [],
    receipts: [],
    loading: false,
    error: null,
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeStructures.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeeStructures.fulfilled, (state, action) => {
        state.loading = false;
        state.structures = action.payload;
      })
      .addCase(fetchFeeStructures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(collectFee.fulfilled, (state, action) => {
        state.receipts.push(action.payload);
      });
  },
});

export default feeSlice.reducer;
