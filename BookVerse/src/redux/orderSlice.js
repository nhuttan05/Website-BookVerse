// =====================================================
//  REDUX — orderSlice.js
//  Quản lý đơn hàng, mã giảm giá, và lịch sử mua hàng
// =====================================================

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';
import { ENDPOINTS } from '@/api/endpoints';

// --- Thunks ---

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(ENDPOINTS.ORDERS.BASE, orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tạo đơn hàng');
    }
  }
);

export const fetchOrderHistory = createAsyncThunk(
  'orders/fetchOrderHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.ORDERS.HISTORY);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải lịch sử đơn hàng');
    }
  }
);

export const fetchOrderDetail = createAsyncThunk(
  'orders/fetchOrderDetail',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.ORDERS.BY_ID(orderId));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không tìm thấy đơn hàng');
    }
  }
);

export const validateCoupon = createAsyncThunk(
  'orders/validateCoupon',
  async ({ code, orderAmount }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(ENDPOINTS.COUPONS.VALIDATE, { code, orderAmount });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể kiểm tra mã giảm giá');
    }
  }
);

// Admin thunks
export const adminFetchOrders = createAsyncThunk(
  'orders/adminFetchOrders',
  async ({ page = 0, size = 20 } = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.ADMIN.ORDERS, { params: { page, size } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi tải danh sách đơn hàng');
    }
  }
);

export const adminUpdateOrderStatus = createAsyncThunk(
  'orders/adminUpdateOrderStatus',
  async ({ orderId, status, note }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(ENDPOINTS.ADMIN.ORDER_STATUS(orderId), { status, note });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể cập nhật trạng thái');
    }
  }
);

export const adminFetchCoupons = createAsyncThunk(
  'orders/adminFetchCoupons',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.ADMIN.COUPONS);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi tải danh sách mã giảm giá');
    }
  }
);

export const adminCreateCoupon = createAsyncThunk(
  'orders/adminCreateCoupon',
  async (couponData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(ENDPOINTS.ADMIN.COUPONS, couponData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tạo mã giảm giá');
    }
  }
);

export const adminUpdateCoupon = createAsyncThunk(
  'orders/adminUpdateCoupon',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(ENDPOINTS.ADMIN.COUPON_BY_ID(id), data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể cập nhật mã giảm giá');
    }
  }
);

export const adminDeleteCoupon = createAsyncThunk(
  'orders/adminDeleteCoupon',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(ENDPOINTS.ADMIN.COUPON_BY_ID(id));
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể xóa mã giảm giá');
    }
  }
);

const initialState = {
  orders: [],
  currentOrder: null,
  adminOrders: [],
  adminOrdersTotal: 0,
  coupons: [],
  couponResult: null,
  couponLoading: false,
  loading: false,
  error: null,
  success: false,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrderState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.currentOrder = null;
    },
    clearCouponResult: (state) => {
      state.couponResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => { state.loading = true; state.error = null; state.success = false; })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentOrder = action.payload;
        state.orders.unshift(action.payload);
        state.couponResult = null;
      })
      .addCase(createOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Fetch History
      .addCase(fetchOrderHistory.pending, (state) => { state.loading = true; })
      .addCase(fetchOrderHistory.fulfilled, (state, action) => { state.loading = false; state.orders = action.payload; })
      .addCase(fetchOrderHistory.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Fetch Detail
      .addCase(fetchOrderDetail.pending, (state) => { state.loading = true; })
      .addCase(fetchOrderDetail.fulfilled, (state, action) => { state.loading = false; state.currentOrder = action.payload; })
      .addCase(fetchOrderDetail.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Validate Coupon
      .addCase(validateCoupon.pending, (state) => { state.couponLoading = true; state.couponResult = null; })
      .addCase(validateCoupon.fulfilled, (state, action) => { state.couponLoading = false; state.couponResult = action.payload; })
      .addCase(validateCoupon.rejected, (state, action) => { state.couponLoading = false; state.couponResult = { valid: false, message: action.payload }; })

      // Admin: Fetch Orders
      .addCase(adminFetchOrders.fulfilled, (state, action) => {
        state.adminOrders = action.payload.content || [];
        state.adminOrdersTotal = action.payload.totalElements || 0;
      })

      // Admin: Update Status
      .addCase(adminUpdateOrderStatus.fulfilled, (state, action) => {
        const idx = state.adminOrders.findIndex(o => o.id === action.payload.id);
        if (idx !== -1) state.adminOrders[idx] = { ...state.adminOrders[idx], status: action.payload.status };
      })

      // Admin: Coupons
      .addCase(adminFetchCoupons.fulfilled, (state, action) => { state.coupons = action.payload; })
      .addCase(adminCreateCoupon.fulfilled, (state, action) => { state.coupons.unshift(action.payload); })
      .addCase(adminUpdateCoupon.fulfilled, (state, action) => {
        const idx = state.coupons.findIndex(c => c.id === action.payload.id);
        if (idx !== -1) state.coupons[idx] = action.payload;
      })
      .addCase(adminDeleteCoupon.fulfilled, (state, action) => {
        state.coupons = state.coupons.filter(c => c.id !== action.payload);
      });
  }
});

export const { resetOrderState, clearCouponResult } = orderSlice.actions;

// Selectors
export const selectOrders            = (state) => state.orders.orders;
export const selectOrderLoading      = (state) => state.orders.loading;
export const selectOrderSuccess      = (state) => state.orders.success;
export const selectOrderError        = (state) => state.orders.error;
export const selectCurrentOrder      = (state) => state.orders.currentOrder;
export const selectCouponResult      = (state) => state.orders.couponResult;
export const selectCouponLoading     = (state) => state.orders.couponLoading;
export const selectAdminOrders       = (state) => state.orders.adminOrders;
export const selectAdminOrdersTotal  = (state) => state.orders.adminOrdersTotal;
export const selectCoupons           = (state) => state.orders.coupons;

export default orderSlice.reducer;
