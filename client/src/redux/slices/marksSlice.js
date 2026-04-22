// redux/slices/marksSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axiosInstance';

export const createMarks = createAsyncThunk(
  'marks/createMarks',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post('/marks', data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.response?.data || err.message);
    }
  }
);

export const updateMarks = createAsyncThunk(
  'marks/updateMarks',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/marks/${id}`, updatedData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.response?.data || err.message);
    }
  }
);

export const fetchMarksByStudent = createAsyncThunk(
  'marks/fetchMarksByStudent',
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/marks/student/${studentId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.response?.data || err.message);
    }
  }
);

export const fetchMarksByClass = createAsyncThunk(
  'marks/fetchMarksByClass',
  async (classId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/marks/class/${classId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.response?.data || err.message);
    }
  }
);

export const fetchStudentReport = createAsyncThunk(
  'marks/fetchStudentReport',
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/marks/report/${studentId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.response?.data || err.message);
    }
  }
);

const marksSlice = createSlice({
  name: 'marks',
  initialState: {
    marks: [],
    report: null,
    loading: false,
    status: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createMarks.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createMarks.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'success';
        if (action.payload) state.marks.push(action.payload);
      })
      .addCase(createMarks.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(updateMarks.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateMarks.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'success';
        const updatedMark = action.payload;
        const index = state.marks.findIndex((m) => m._id === updatedMark?._id);
        if (index !== -1) state.marks[index] = updatedMark;
      })
      .addCase(updateMarks.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchMarksByStudent.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMarksByStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'success';
        state.marks = action.payload;
      })
      .addCase(fetchMarksByStudent.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchMarksByClass.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMarksByClass.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'success';
        state.marks = action.payload;
      })
      .addCase(fetchMarksByClass.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchStudentReport.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchStudentReport.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'success';
        state.report = action.payload;
      })
      .addCase(fetchStudentReport.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export default marksSlice.reducer;
