// feeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = process.env.NODE_ENV === "development"
    ? "http://localhost:5000/"
    : process.env.REACT_APP_API_URL;

// ✅ Create Fee Structure
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

// ✅ Fetch All Fee Structures
export const fetchFeeStructures = createAsyncThunk(
  'fees/fetchFeeStructures',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}api/fees/structure`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
export const collectFee = createAsyncThunk(
  'fees/assignFee',
  async (assignmentData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API}api/fees/collect`, assignmentData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


// ✅ Assign Fee
export const assignFee = createAsyncThunk(
  'fees/assignFee',
  async (assignmentData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API}api/fees/assign`, assignmentData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Fetch Student Fees
export const fetchStudents = createAsyncThunk(
  'fees/fetchStudents',
  async (studentId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}api/fees/${studentId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Fetch Fee History by Parent
export const fetchFeeHistoryByParent = createAsyncThunk(
  'fees/fetchFeeHistoryByParent',
  async (parentId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}api/fee/history/parent/${parentId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Fetch Fees Parent Wise
export const fetchFeesParentWise = createAsyncThunk(
  'fees/fetchFeesParentWise',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}api/fees/assigned-fees/parent-wise`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Collect Payment for Specific Installment
export const collectInstallmentPayment = createAsyncThunk(
  'fees/collectInstallmentPayment',
  async ({ assignedFeeId, installmentId, paidAmount, paymentMode }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API}api/fees/assign/${assignedFeeId}/installment/${installmentId}/pay`,
        { paidAmount, paymentMode }
      );
      if (res.data?.success) {
        return res.data.receipt; // backend se receipt object
      } else {
        return rejectWithValue(res.data?.message || 'Payment failed');
      }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const feeSlice = createSlice({
  name: 'fees',
  initialState: {
    students: [],
    fees: [],
    parentFees: [],
    structures: [],
    receipts: [],
    lastReceipt: null, // ✅ latest payment ka receipt
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Fee Structures
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
        state.error = action.payload;
      })

      // Parent Wise Fees
      .addCase(fetchFeesParentWise.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeesParentWise.fulfilled, (state, action) => {
        state.loading = false;
        state.parentFees = action.payload;
      })
      .addCase(fetchFeesParentWise.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Collect Payment
      .addCase(collectInstallmentPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastReceipt = null;
      })
      .addCase(collectInstallmentPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.lastReceipt = action.payload;
        state.receipts.push(action.payload);
      })
      .addCase(collectInstallmentPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default feeSlice.reducer;
