// redux/slices/teacherSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL

// ✅ Fetch all teachers
export const fetchTeachers = createAsyncThunk(
  'teachers/fetchTeachers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}api/teachers`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// ✅ Register a teacher
export const registerTeacher = createAsyncThunk(
  'teachers/registerTeacher',
  async (teacherData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API}api/teachers/register`, teacherData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const teacherSlice = createSlice({
  name: 'teachers',
  initialState: {
    teachers: [],
    status: null,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.teachers = action.payload;
        state.status = 'success';
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      })
      .addCase(registerTeacher.fulfilled, (state, action) => {
        state.teachers.push(action.payload);
        state.status = 'success';
      })
      .addCase(registerTeacher.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      });
  },
});

export default teacherSlice.reducer;
