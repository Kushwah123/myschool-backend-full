// redux/slices/subjectSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = process.env.NODE_ENV === "development"
    ? "http://localhost:5000/" // ✅ Localhost
    : process.env.REACT_APP_API_URL; // ✅ Render or production 

// ✅ Fetch subjects
export const fetchSubjects = createAsyncThunk(
  'subjects/fetchSubjects',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}api/subjects/fetchSubjects`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
// Update subject thunk
export const updateSubject = createAsyncThunk(
  'subjects/updateSubject',
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API}api/subjects/${id}`, { name });
      return res.data;  // Updated subject object return kare
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
// ✅ Create subject
export const createSubject = createAsyncThunk(
  'subjects/createSubject',
  async (name, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API}api/subjects`, name);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
// ✅ Assign subject to class/teacher
export const assignSubject = createAsyncThunk(
  'subjects/assignSubject',
  async (name, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API}api/subjects/assign`, name);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
export const deleteSubject = createAsyncThunk(
  'subjects/deleteSubject',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API}api/subjects/${id}`);
      return id;  // Return deleted subject id to update state
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
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
      })
             // Update subject cases
      .addCase(updateSubject.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateSubject.fulfilled, (state, action) => {
        const index = state.subjects.findIndex(subj => subj._id === action.payload._id);
        if (index !== -1) {
          state.subjects[index] = action.payload;  // State me updated subject ko replace karo
        }
        state.status = 'success';
      })
      .addCase(updateSubject.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
            // Delete subject cases
      .addCase(deleteSubject.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.subjects = state.subjects.filter(subj => subj._id !== action.payload);
        state.status = 'success';
      })
      .addCase(deleteSubject.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default subjectSlice.reducer;
