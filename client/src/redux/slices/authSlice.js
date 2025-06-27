// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL
export const loginUser = createAsyncThunk('auth/loginUser', async (credentials) => {
  const res = await axios.post(`${API}api/auth/login`, credentials);
  return res.data;
});
export const parentLogin = createAsyncThunk(
  'auth/parentLogin',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API}api/parents/login`, { email, password });
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message || 'Login failed');
    }
  }
);

// 🔒 Logout
export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  localStorage.removeItem('token');
});


const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    role: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.role = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.role;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
