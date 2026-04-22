// redux/slices/subjectSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axiosInstance';

export const fetchSubjects = createAsyncThunk(
  'subjects/fetchSubjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/subjects');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.response?.data || err.message);
    }
  }
);

export const createSubject = createAsyncThunk(
  'subjects/createSubject',
  async (subjectData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/subjects', subjectData);
      return response.data.subject || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.response?.data || err.message);
    }
  }
);

export const updateSubject = createAsyncThunk(
  'subjects/updateSubject',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/subjects/${id}`, updates);
      return response.data.updated || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.response?.data || err.message);
    }
  }
);

export const deleteSubject = createAsyncThunk(
  'subjects/deleteSubject',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/subjects/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.response?.data || err.message);
    }
  }
);

const subjectSlice = createSlice({
  name: 'subjects',
  initialState: {
    subjects: [],
    loading: false,
    status: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = 'loading';
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload || [];
        state.status = 'success';
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(createSubject.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createSubject.fulfilled, (state, action) => {
        state.status = 'success';
        if (action.payload) state.subjects.push(action.payload);
      })
      .addCase(createSubject.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(updateSubject.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateSubject.fulfilled, (state, action) => {
        state.status = 'success';
        const index = state.subjects.findIndex((subject) => subject._id === action.payload?._id);
        if (index !== -1) {
          state.subjects[index] = action.payload;
        }
      })
      .addCase(updateSubject.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteSubject.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.status = 'success';
        state.subjects = state.subjects.filter((subject) => subject._id !== action.payload);
      })
      .addCase(deleteSubject.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export default subjectSlice.reducer;
