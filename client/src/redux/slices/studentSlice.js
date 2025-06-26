// redux/slices/studentSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = 'http://localhost:5000/api/students';

// ✅ Fetch all students
export const fetchStudents = createAsyncThunk(
  'students/fetchStudents',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(API);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// ✅ Create a new student
export const createStudent = createAsyncThunk(
  'students/createStudent',
  async (studentData, { rejectWithValue }) => {
    try {
      const res = await axios.post(API, studentData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// ✅ Update student
export const updateStudent = createAsyncThunk(
  'students/updateStudent',
  async ({ id, studentData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API}/${id}`, studentData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// ✅ Delete student
export const deleteStudent = createAsyncThunk(
  'students/deleteStudent',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API}/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// ✅ Fetch students by class ID
export const fetchStudentsByClass = createAsyncThunk(
  'students/fetchStudentsByClass',
  async (classId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}/class/${classId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const fetchStudentByParent = createAsyncThunk(
  'students/fetchStudentByParent',
  async (parentId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}/parent/${parentId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const studentSlice = createSlice({
  name: 'students',
  initialState: {
    students: [],
    classStudents: [],
    status: null,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.students = action.payload;
        state.status = 'success';
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.students.push(action.payload);
        state.status = 'success';
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        const index = state.students.findIndex(s => s._id === action.payload._id);
        if (index !== -1) state.students[index] = action.payload;
        state.status = 'success';
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.students = state.students.filter(s => s._id !== action.payload);
        state.status = 'success';
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      })
      .addCase(fetchStudentsByClass.fulfilled, (state, action) => {
        state.classStudents = action.payload;
      })
      .addCase(fetchStudentsByClass.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default studentSlice.reducer;
