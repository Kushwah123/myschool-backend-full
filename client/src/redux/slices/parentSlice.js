import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API = process.env.REACT_APP_API_URL
// 📌 GET: Fetch all parents (with pagination & search)
export const fetchParents = createAsyncThunk("parents/fetchAll", async (query = "", thunkAPI) => {
  try {
    const { data } = await axios.get(`${API}api/parents${query}`);
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch parents");
  }
});

// 📌 POST: Create parent
export const createParent = createAsyncThunk("parents/create", async (parentData, thunkAPI) => {
  try {
    const { data } = await axios.post(`${API}api/parents`, parentData);
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to create parent");
  }
});

// 📌 PUT: Update parent
export const updateParent = createAsyncThunk("parents/update", async ({ id, parentData }, thunkAPI) => {
  try {
    const { data } = await axios.put(`${API}api/parents/${id}`, parentData);
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to update parent");
  }
});

// 📌 DELETE: Delete parent
export const deleteParent = createAsyncThunk("parents/delete", async (id, thunkAPI) => {
  try {
    await axios.delete(`${API}api/parents/${id}`);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to delete parent");
  }
});

const parentSlice = createSlice({
  name: "parents",
  initialState: {
    parents: [],
    loading: false,
    error: null,
    success: false,
    total: 0,
  },
  reducers: {
    resetParentState: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchParents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchParents.fulfilled, (state, action) => {
        state.loading = false;
        state.parents = action.payload.parents || [];
        state.total = action.payload.total || 0;
      })
      .addCase(fetchParents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createParent.pending, (state) => {
        state.loading = true;
      })
      .addCase(createParent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.parents.push(action.payload);
      })
      .addCase(createParent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateParent.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateParent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const index = state.parents.findIndex(p => p._id === action.payload._id);
        if (index !== -1) state.parents[index] = action.payload;
      })
      .addCase(updateParent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteParent.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteParent.fulfilled, (state, action) => {
        state.loading = false;
        state.parents = state.parents.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteParent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetParentState } = parentSlice.actions;
export default parentSlice.reducer;
