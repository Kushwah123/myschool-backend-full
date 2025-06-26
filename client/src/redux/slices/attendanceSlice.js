// redux/slices/attendanceSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAttendance = createAsyncThunk('attendance/fetchAttendance', async () => {
  const res = await axios.get('/api/attendance');
  return res.data;
});

export const markAttendance = createAsyncThunk('attendance/markAttendance', async (data) => {
  const res = await axios.post('/api/attendance/mark', data);
  return res.data;
});

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    records: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(markAttendance.fulfilled, (state, action) => {
        state.records.push(action.payload);
      });
  },
});

export default attendanceSlice.reducer;