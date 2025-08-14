// src/redux/slices/villageSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = 'http://localhost:5000/api/villages';

export const fetchVillages = createAsyncThunk('village/fetchAll', async () => {
  const res = await axios.get(`${API}/all`);
  return res.data;
});

export const addVillage = createAsyncThunk('village/add', async (villageName) => {
  const res = await axios.post(`${API}/add`, { villageName });
  return res.data;
});

export const updateVillage = createAsyncThunk('village/update', async ({ id, villageName }) => {
  const res = await axios.put(`${API}/${id}`, { villageName });
  return res.data;
});

export const deleteVillage = createAsyncThunk('village/delete', async (id) => {
  await axios.delete(`${API}/${id}`);
  return id;
});

const villageSlice = createSlice({
  name: 'village',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchVillages.pending, (state) => { state.loading = true; })
      .addCase(fetchVillages.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchVillages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add
      .addCase(addVillage.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      // Update
      .addCase(updateVillage.fulfilled, (state, action) => {
        const index = state.list.findIndex(v => v._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })
      // Delete
      .addCase(deleteVillage.fulfilled, (state, action) => {
        state.list = state.list.filter(v => v._id !== action.payload);
      });
  },
});

export default villageSlice.reducer;
