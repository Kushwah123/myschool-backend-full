// redux/slices/resultSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = 'http://localhost:5000/api/marks';

// ✅ Fetch results by student ID
export const fetchMarksByStudent = createAsyncThunk(
  'results/fetchMarksByStudent',
  async (studentId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/marks/student/${studentId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// ✅ Fetch all results (for admin/teacher view)
export const fetchResults = createAsyncThunk(
  'results/fetchResults',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const resultSlice = createSlice({
  name: 'results',
  initialState: {
    marks: [],
    status: null,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchMarksByStudent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMarksByStudent.fulfilled, (state, action) => {
        state.marks = action.payload;
        state.status = 'success';
      })
      .addCase(fetchMarksByStudent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchResults.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchResults.fulfilled, (state, action) => {
        state.marks = action.payload;
        state.status = 'success';
      })
      .addCase(fetchResults.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default resultSlice.reducer;
