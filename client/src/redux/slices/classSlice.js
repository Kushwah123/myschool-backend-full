import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axiosInstance';

export const fetchClasses = createAsyncThunk(
  'class/fetchClasses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/classes');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const createClass = createAsyncThunk(
  'class/createClass',
  async (classData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/classes', classData);
      return response.data.classData || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const classSlice = createSlice({
  name: 'class',
  initialState: {
    classes: [],
    loading: false,
    createStatus: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.classes || [];
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(createClass.pending, (state) => {
        state.createStatus = 'loading';
        state.error = null;
      })
      .addCase(createClass.fulfilled, (state, action) => {
        state.createStatus = 'success';
        if (action.payload) state.classes.push(action.payload);
      })
      .addCase(createClass.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export default classSlice.reducer;
