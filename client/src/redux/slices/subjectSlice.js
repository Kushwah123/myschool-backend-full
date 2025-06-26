// redux/slices/subjectSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = 'http://localhost:5000/api/subjects';

// ✅ Fetch subjects
export const fetchSubjects = createAsyncThunk(
  'subjects/fetchSubjects',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// ✅ Create subject
export const createSubject = createAsyncThunk(
  'subjects/createSubject',
  async (subjectData, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/subjects", subjectData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
// ✅ Assign subject to class/teacher
export const assignSubject = createAsyncThunk(
  'subjects/assignSubject',
  async (assignmentData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API}/assign`, assignmentData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const subjectSlice = createSlice({
  name: 'subjects',
  initialState: {
    subjects: [],
    status: null,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.subjects = action.payload;
        state.status = 'success';
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      })
      .addCase(createSubject.fulfilled, (state, action) => {
        state.subjects.push(action.payload);
        state.status = 'success';
      })
      .addCase(createSubject.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      });
  },
});

export default subjectSlice.reducer;
