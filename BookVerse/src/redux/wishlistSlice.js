// =====================================================
//  REDUX — wishlistSlice.js
//  Quản lý danh sách sách yêu thích (Backend Sync)
// =====================================================

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosInstance';
import { ENDPOINTS } from '@/api/endpoints';

// --- Thunks ---

// Lấy danh sách yêu thích từ server
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.WISHLIST.BASE);
      // Backend trả về mảng WishlistItem { id, book, addedAt }
      // Chúng ta chỉ cần mảng Book để hiển thị dễ dàng
      return response.data.map(item => item.book);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải danh sách yêu thích');
    }
  }
);

// Thêm/Xóa khỏi danh sách yêu thích
// Ở Backend: POST thêm, DELETE xóa. Ở đây chúng ta nhận vào book và trạng thái hiện tại
export const toggleWishlistItem = createAsyncThunk(
  'wishlist/toggleWishlistItem',
  async ({ book, isInWishlist }, { rejectWithValue }) => {
    try {
      if (isInWishlist) {
        await axiosInstance.delete(ENDPOINTS.WISHLIST.TOGGLE(book.id));
        return { bookId: book.id, action: 'remove' };
      } else {
        await axiosInstance.post(ENDPOINTS.WISHLIST.TOGGLE(book.id));
        return { book, action: 'add' };
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Thao tác thất bại');
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleWishlistItem.fulfilled, (state, action) => {
        if (action.payload.action === 'remove') {
          state.items = state.items.filter(item => item.id !== action.payload.bookId);
        } else {
          state.items.push(action.payload.book);
        }
      });
  }
});

export const { clearWishlist } = wishlistSlice.actions;

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectIsWishlistLoading = (state) => state.wishlist.loading;
export const selectIsInWishlist = (id) => (state) => state.wishlist.items.some(item => item.id === id);

export default wishlistSlice.reducer;
