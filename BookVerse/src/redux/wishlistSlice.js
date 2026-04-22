// =====================================================
//  REDUX — wishlistSlice.js
//  Quản lý danh sách sách yêu thích
// =====================================================

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: JSON.parse(localStorage.getItem('bookverse_wishlist')) || [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action) => {
      const book = action.payload;
      const index = state.items.findIndex(item => item.id === book.id);
      
      if (index >= 0) {
        // Nếu đã có thì xóa
        state.items.splice(index, 1);
      } else {
        // Nếu chưa có thì thêm
        state.items.push(book);
      }
      
      localStorage.setItem('bookverse_wishlist', JSON.stringify(state.items));
    },
    clearWishlist: (state) => {
      state.items = [];
      localStorage.removeItem('bookverse_wishlist');
    }
  }
});

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;

export const selectWishlistItems = (state) => state.wishlist.items;
export const selectIsInWishlist = (id) => (state) => state.wishlist.items.some(item => item.id === id);

export default wishlistSlice.reducer;
