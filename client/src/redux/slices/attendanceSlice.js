// redux/slices/attendanceSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axiosInstance';

const API = process.env.NODE_ENV === 'development' ? '' : process.env.REACT_APP_API_URL;

export const fetchAttendance = createAsyncThunk('attendance/fetchAttendance', async () => {
  const res = await axios.get(`${API}/attendance`);
  return res.data;
});

export const fetchAttendanceStats = createAsyncThunk(
  'attendance/fetchAttendanceStats',
  async ({ date, classId, teacherId } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (date) params.append('date', date);
      if (classId) params.append('classId', classId);
      if (teacherId) params.append('teacherId', teacherId);

      const res = await axios.get(`${API}/attendance/stats?${params.toString()}`);
      return res.data;
    } catch (err) {
      console.error('❌ Error fetching attendance stats:', err.response?.data || err.message);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchWhatsAppHistory = createAsyncThunk(
  'attendance/fetchWhatsAppHistory',
  async ({ limit } = {}, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}/attendance/whatsapp/history?limit=${limit || 20}`);
      return res.data;
    } catch (err) {
      console.error('❌ Error fetching WhatsApp history:', err.response?.data || err.message);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const markAttendance = createAsyncThunk('attendance/markAttendance', async (data, { rejectWithValue }) => {
  try {
    // ✅ Log data before sending for debugging
    console.log('📤 Sending attendance data:', data);
    
    // ✅ Validate required fields
    if (!data.classId || !data.date || !data.teacherId || !data.records || data.records.length === 0) {
      const error = {
        missingFields: {
          classId: !data.classId ? 'missing' : '✓',
          date: !data.date ? 'missing' : '✓',
          teacherId: !data.teacherId ? 'missing' : '✓',
          records: !data.records || data.records.length === 0 ? 'missing/empty' : '✓',
        }
      };
      console.error('❌ Validation error:', error);
      return rejectWithValue(error);
    }
    
    const res = await axios.post(`${API}/attendance/mark`, data);
    return res.data;
  } catch (err) {
    console.error('❌ Error marking attendance:', err.response?.data || err.message);
    return rejectWithValue(err.response?.data || err.message);
  }
});

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    records: [],
    stats: {
      present: 0,
      absent: 0,
      total: 0,
      records: [],
    },
    whatsappHistory: [],
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
      .addCase(fetchAttendanceStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAttendanceStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats || {
          present: 0,
          absent: 0,
          total: 0,
          records: [],
        };
        state.records = action.payload.records || [];
      })
      .addCase(fetchAttendanceStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchWhatsAppHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWhatsAppHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.whatsappHistory = action.payload.history || [];
      })
      .addCase(fetchWhatsAppHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(markAttendance.fulfilled, (state, action) => {
        if (Array.isArray(action.payload.attendance)) {
          state.records = state.records.concat(action.payload.attendance);
        } else {
          state.records.push(action.payload);
        }
      });
  },
});

export default attendanceSlice.reducer;