// redux/slices/teacherSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axiosInstance';

export const fetchTeachers = createAsyncThunk(
  'teachers/fetchTeachers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/teachers');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.response?.data || err.message);
    }
  }
);

export const fetchTeacherById = createAsyncThunk(
  'teachers/fetchTeacherById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/teachers/${id}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.response?.data || err.message);
    }
  }
);

export const registerTeacher = createAsyncThunk(
  'teachers/registerTeacher',
  async (teacherData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/teachers/register', teacherData);
      return response.data.teacher || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.response?.data || err.message);
    }
  }
);

export const updateTeacher = createAsyncThunk(
  'teachers/updateTeacher',
  async ({ id, teacherData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/teachers/${id}`, teacherData);
      return response.data.teacher || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.response?.data || err.message);
    }
  }
);

export const deleteTeacher = createAsyncThunk(
  'teachers/deleteTeacher',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/teachers/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.response?.data || err.message);
    }
  }
);

const teacherSlice = createSlice({
  name: 'teachers',
  initialState: {
    teachers: [],
    loading: false,
    status: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeachers.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = 'loading';
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.loading = false;
        state.teachers = action.payload || [];
        state.status = 'success';
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchTeacherById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = 'loading';
      })
      .addCase(fetchTeacherById.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.teachers.findIndex(t => t._id === action.payload._id);
        if (index === -1) {
          state.teachers.push(action.payload);
        } else {
          state.teachers[index] = action.payload;
        }
        state.status = 'success';
      })
      .addCase(fetchTeacherById.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(registerTeacher.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerTeacher.fulfilled, (state, action) => {
        state.status = 'success';
        if (action.payload) state.teachers.push(action.payload);
      })
      .addCase(registerTeacher.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(updateTeacher.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateTeacher.fulfilled, (state, action) => {
        state.status = 'success';
        const index = state.teachers.findIndex(t => t._id === action.payload._id);
        if (index !== -1) {
          state.teachers[index] = action.payload;
        }
      })
      .addCase(updateTeacher.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteTeacher.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteTeacher.fulfilled, (state, action) => {
        state.status = 'success';
        state.teachers = state.teachers.filter(t => t._id !== action.payload);
      })
      .addCase(deleteTeacher.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export default teacherSlice.reducer;
