// =====================================================
//  REDUX — cartSlice.js
//  Quản lý giỏ hàng của người dùng
//  Persistence: Tự động lưu vào localStorage
// =====================================================

import { createSlice } from '@reduxjs/toolkit';

// Helper: Tải giỏ hàng từ localStorage
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('bookverse_cart');
    if (savedCart) return JSON.parse(savedCart);
  } catch (e) {
    console.error('Lỗi tải giỏ hàng từ storage', e);
  }
  return { items: [], totalAmount: 0, totalQuantity: 0 };
};

// Helper: Lưu giỏ hàng vào localStorage
const saveCartToStorage = (state) => {
  try {
    localStorage.setItem('bookverse_cart', JSON.stringify(state));
  } catch (e) {
    console.error('Lỗi lưu giỏ hàng vào storage', e);
  }
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Thêm sản phẩm vào giỏ
    addItem: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);
      
      if (!existingItem) {
        state.items.push({
          ...newItem,
          quantity: newItem.quantity || 1,
          totalPrice: newItem.price * (newItem.quantity || 1)
        });
      } else {
        existingItem.quantity += (newItem.quantity || 1);
        existingItem.totalPrice += newItem.price * (newItem.quantity || 1);
      }
      
      state.totalQuantity += (newItem.quantity || 1);
      state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice, 0);
      
      saveCartToStorage(state);
    },

    // Xóa sản phẩm khỏi giỏ
    removeItem: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.items = state.items.filter(item => item.id !== id);
        state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice, 0);
      }
      
      saveCartToStorage(state);
    },

    // Cập nhật số lượng
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem && quantity > 0) {
        const quantityDiff = quantity - existingItem.quantity;
        existingItem.quantity = quantity;
        existingItem.totalPrice = existingItem.price * quantity;
        
        state.totalQuantity += quantityDiff;
        state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice, 0);
      }
      
      saveCartToStorage(state);
    },

    // Xóa toàn bộ giỏ hàng
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalQuantity = 0;
      saveCartToStorage(state);
    }
  }
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalAmount = (state) => state.cart.totalAmount;
export const selectCartTotalQuantity = (state) => state.cart.totalQuantity;

export default cartSlice.reducer;
