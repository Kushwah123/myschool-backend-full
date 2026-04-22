// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axiosInstance';

const API = process.env.NODE_ENV === "development"
  ? ""
  : process.env.REACT_APP_API_URL || '';

// 🧠 Restore state from localStorage if available
const userFromStorage = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : null;

const tokenFromStorage = localStorage.getItem('token')
  ? localStorage.getItem('token')
  : null;

const roleFromStorage = localStorage.getItem('role')
  ? localStorage.getItem('role')
  : null;

// 👤 Login User
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API}/auth/login`, credentials);
      const { user, token } = res.data;
      const role = user?.role;

      // ✅ Save to localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.response?.data?.msg || 'Login failed');
    }
  }
);

// 👨‍👩‍👧 Parent Login
export const parentLogin = createAsyncThunk(
  'auth/parentLogin',
  async ({ identifier, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API}/parents/login`, { identifier, password });
      const { user, token } = res.data;
      const role = user?.role;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.response?.data?.msg || 'Login failed');
    }
  }
);

// 🔒 Logout User
export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('role');
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: userFromStorage,
    token: tokenFromStorage,
    role: roleFromStorage,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.role = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    },
  },
  extraReducers: (builder) => {
    builder
      // loginUser
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
        state.error = action.payload;
      })

      // parentLogin
      .addCase(parentLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(parentLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.role;
      })
      .addCase(parentLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // logoutUser
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.role = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
