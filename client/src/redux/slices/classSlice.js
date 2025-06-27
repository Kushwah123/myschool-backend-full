import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL
export const fetchClasses = createAsyncThunk('class/fetchClasses', async () => {
  const response = await axios.get(`${API}api/classes`); // backend route
  return response.data;
});
// ✅ Create class
export const createClass = createAsyncThunk(
  'classes/createClass',
  async (classData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API}api/classes`, classData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const classSlice = createSlice({
  name: 'class',
  initialState: {
    classes: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default classSlice.reducer;
