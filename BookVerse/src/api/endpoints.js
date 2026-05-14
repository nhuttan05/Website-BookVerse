// =====================================================
//  API ENDPOINTS — Centralized Endpoint Registry
//  Lý do: Tránh magic strings, dễ thay đổi khi API thay đổi
// =====================================================

export const ENDPOINTS = {
  // --- Auth ---
  AUTH: {
    LOGIN:           '/auth/login',
    REGISTER:        '/auth/register',
    REFRESH:         '/auth/refresh',
    LOGOUT:          '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD:  '/auth/reset-password',
  },

  // --- Books ---
  BOOKS: {
    BASE:          '/books',
    BY_ID:         (id) => `/books/${id}`,
    BY_SLUG:       (slug) => `/books/slug/${slug}`,
    BESTSELLERS:   '/books/bestsellers',
    SEARCH:        '/books/search',
    BY_CATEGORY:   (slug) => `/books/category/${slug}`,
    BY_AUTHOR:     (authorId) => `/books/author/${authorId}`,
    FEATURED:      '/books/featured',
    NEW_ARRIVALS:  '/books/new-arrivals',
  },

  // --- Categories ---
  CATEGORIES: {
    BASE:  '/categories',
    BY_ID: (id) => `/categories/${id}`,
  },

  // --- Authors ---
  AUTHORS: {
    BASE:  '/authors',
    BY_ID: (id) => `/authors/${id}`,
  },

  // --- Cart ---
  CART: {
    BASE:       '/cart',
    ADD:        '/cart/add',
    REMOVE:     (itemId) => `/cart/items/${itemId}`,
    UPDATE:     (itemId) => `/cart/items/${itemId}`,
    CLEAR:      '/cart/clear',
  },

  // --- Orders ---
  ORDERS: {
    BASE:    '/orders',
    BY_ID:   (id) => `/orders/${id}`,
    HISTORY: '/orders/history',
    RETURN:  (id) => `/orders/${id}/return`,
  },

  // --- Coupons ---
  COUPONS: {
    VALIDATE: '/coupons/validate',
  },

  // --- User ---
  USER: {
    PROFILE:  '/user/profile',
    UPDATE:   '/user/profile',
    STATS:    '/user/stats',
  },

  // --- Wishlist ---
  WISHLIST: {
    BASE:     '/wishlist',
    TOGGLE:   (bookId) => `/wishlist/${bookId}`,
    CHECK:    (bookId) => `/wishlist/check/${bookId}`,
  },

  // --- Admin ---
  ADMIN: {
    OVERVIEW:         '/admin/overview',
    STATS:            '/admin/stats',
    BOOKS:            '/admin/books',
    CATEGORIES:       '/admin/categories',
    ORDERS:           '/admin/orders',
    ORDER_STATUS:     (id) => `/admin/orders/${id}/status`,
    USERS:            '/admin/users',
    ANALYTICS:        '/admin/analytics',
    COUPONS:          '/admin/coupons',
    COUPON_BY_ID:     (id) => `/admin/coupons/${id}`,
  },

  // --- Reviews ---
  REVIEWS: {
    BY_BOOK: (bookId) => `/books/${bookId}/reviews`,
    CREATE:  (bookId) => `/books/${bookId}/reviews`,
  },

  // --- Recommendations & AI ---
  RECOMMENDATIONS: {
    SIMILAR: (slug) => `/recommendations/similar/${slug}`,
    PERSONALIZED: '/recommendations/personalized',
  },
  
  // --- AI Assistant ---
  AI: {
    CHAT: '/ai/chat',
  },
};
