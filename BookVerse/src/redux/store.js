// =====================================================
//  REDUX — store.js
//  Root Store của toàn bộ ứng dụng
// =====================================================

import { configureStore } from '@reduxjs/toolkit';
import bookReducer from './bookSlice';
import authReducer from './authSlice';
import cartReducer from './cartSlice';
import wishlistReducer from './wishlistSlice';

const store = configureStore({
  reducer: {
    books: bookReducer,
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
  // Bật Redux DevTools chỉ trong development mode
  devTools: import.meta.env.DEV,
});

export default store;
