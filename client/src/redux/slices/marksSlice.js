// redux/slices/marksSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = 'http://localhost:5000/api/marks';

export const createMarks = createAsyncThunk(
  'marks/createMarks',
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`/api/marks/add`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchMarks = createAsyncThunk(
  'marks/fetchMarks',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateMarks = createAsyncThunk(
  'marks/updateMarks',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/api/marks/${id}`, updatedData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const marksSlice = createSlice({
  name: 'marks',
  initialState: {
    marks: [],
    status: null,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(createMarks.pending, state => {
        state.status = 'loading';
      })
      .addCase(createMarks.fulfilled, (state, action) => {
        state.marks.push(action.payload);
        state.status = 'success';
      })
      .addCase(createMarks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchMarks.fulfilled, (state, action) => {
        state.marks = action.payload;
        state.status = 'success';
      })
      .addCase(updateMarks.fulfilled, (state, action) => {
        const index = state.marks.findIndex(m => m._id === action.payload._id);
        if (index !== -1) state.marks[index] = action.payload;
        state.status = 'success';
      });
  },
});

export default marksSlice.reducer;
