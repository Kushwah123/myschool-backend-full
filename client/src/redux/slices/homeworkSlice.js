import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 🔄 Fetch homework by classId
export const fetchHomeworkByClass = createAsyncThunk(
  'homework/fetchHomeworkByClass',
  async (classId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/homework/class/${classId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// ➕ Add new homework (by teacher)
export const addHomework = createAsyncThunk(
  'homework/addHomework',
  async (homeworkData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/homework', homeworkData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// 📤 Upload homework file (optional)
export const uploadHomeworkFile = createAsyncThunk(
  'homework/uploadFile',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/homework/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


export const fetchHomeworkByStudent = createAsyncThunk(
  'homework/fetchHomeworkByStudent',
  async (studentId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`api/homework/student/${studentId}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const homeworkSlice = createSlice({
  name: 'homework',
  initialState: {
    homeworks: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearHomeworkState: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // 🔄 Fetch homework
      .addCase(fetchHomeworkByClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeworkByClass.fulfilled, (state, action) => {
        state.loading = false;
        state.homeworks = action.payload;
      })
      .addCase(fetchHomeworkByClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ➕ Add homework
      .addCase(addHomework.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addHomework.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Homework added successfully';
        state.homeworks.push(action.payload);
      })
      .addCase(addHomework.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📤 Upload homework file
      .addCase(uploadHomeworkFile.fulfilled, (state, action) => {
        state.successMessage = 'File uploaded successfully';
      })
      .addCase(uploadHomeworkFile.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { clearHomeworkState } = homeworkSlice.actions;
export default homeworkSlice.reducer;
