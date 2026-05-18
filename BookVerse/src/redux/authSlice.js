import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';
import { ENDPOINTS } from '@/api/endpoints';

// --- Thunks ---

// Đăng nhập
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(ENDPOINTS.AUTH.LOGIN, credentials);
      const { token, id, email, fullName, roles } = response.data;
      
      // Lưu token vào localStorage
      localStorage.setItem('bookverse_access_token', token);
      
      return { 
        token, 
        user: { id, email, fullName, roles } 
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  }
);

// Đăng ký
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(ENDPOINTS.AUTH.REGISTER, userData);
      return response.data;
    } catch (error) {
      // Sau khi có GlobalExceptionHandler, backend trả về {message: "..."}
      // Fallback cho cả trường hợp string thuần
      const data = error.response?.data;
      const errMsg = typeof data === 'string'
        ? data
        : data?.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.';
      return rejectWithValue(errMsg);
    }
  }
);

// Lấy thông tin user hiện tại (sau khi reload trang)
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.USER.PROFILE);
      return response.data;
    } catch (error) {
      // Nếu lỗi, xóa token để logout
      localStorage.removeItem('bookverse_access_token');
      localStorage.removeItem('bookverse_refresh_token');
      return rejectWithValue(error.response?.data?.message || 'Phiên làm việc hết hạn');
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('bookverse_access_token'),
  isAuthenticated: !!localStorage.getItem('bookverse_access_token'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('bookverse_access_token');
      localStorage.removeItem('bookverse_refresh_token');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
      })

      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, clearError } = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;
