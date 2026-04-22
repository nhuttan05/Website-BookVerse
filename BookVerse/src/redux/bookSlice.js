// =====================================================
//  REDUX — bookSlice.js
//  Advanced State Management cho Books
//  Pattern: Redux Toolkit với createAsyncThunk
// =====================================================

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as bookService from '@/services/bookService';

// =====================================================
//  ASYNC THUNKS — "Actions" gọi API
//  Mỗi thunk tự động tạo ra 3 action: pending/fulfilled/rejected
// =====================================================

export const getBestsellers = createAsyncThunk(
  'books/getBestsellers',
  async (limit = 8, { rejectWithValue }) => {
    try {
      return await bookService.fetchBestsellers(limit);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi tải sách bán chạy');
    }
  }
);

export const getFeaturedBooks = createAsyncThunk(
  'books/getFeaturedBooks',
  async (_, { rejectWithValue }) => {
    try {
      return await bookService.fetchFeaturedBooks();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi tải sách nổi bật');
    }
  }
);

export const getNewArrivals = createAsyncThunk(
  'books/getNewArrivals',
  async (limit = 6, { rejectWithValue }) => {
    try {
      return await bookService.fetchNewArrivals(limit);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi tải sách mới');
    }
  }
);

export const getBookById = createAsyncThunk(
  'books/getBookById',
  async (id, { rejectWithValue }) => {
    try {
      return await bookService.fetchBookById(id);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi tải thông tin sách');
    }
  }
);

export const getBookBySlug = createAsyncThunk(
  'books/getBookBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      return await bookService.fetchBookBySlug(slug);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi tải thông tin sách');
    }
  }
);

export const searchBooks = createAsyncThunk(
  'books/searchBooks',
  async (params, { rejectWithValue }) => {
    try {
      return await bookService.searchBooks(params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi tìm kiếm sách');
    }
  }
);

export const getSimilarBooks = createAsyncThunk(
  'books/getSimilarBooks',
  async (slug, { rejectWithValue }) => {
    try {
      return await bookService.fetchSimilarBooks(slug);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi tải sách tương tự');
    }
  }
);

export const getPersonalizedRecommendations = createAsyncThunk(
  'books/getPersonalizedRecommendations',
  async (_, { rejectWithValue }) => {
    try {
      return await bookService.fetchPersonalizedRecommendations();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi tải gợi ý cá nhân hóa');
    }
  }
);

// =====================================================
//  INITIAL STATE
// =====================================================
const initialState = {
  bestsellers:   [],
  featured:      [],
  newArrivals:   [],
  selectedBook:  null,
  searchResults: null,
  similarBooks:  [],
  personalized:  [],
  // Mỗi loại request có status riêng để UI biết loading gì
  loading: {
    bestsellers:   false,
    featured:      false,
    newArrivals:   false,
    selectedBook:  false,
    search:        false,
    similarBooks:  false,
    personalized:  false,
  },
  error: {
    bestsellers:   null,
    featured:      null,
    newArrivals:   null,
    selectedBook:  null,
    search:        null,
    similarBooks:  null,
    personalized:  null,
  },
};

// =====================================================
//  SLICE — Kết hợp Reducers + Actions
// =====================================================
const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    // Synchronous action: xóa sách đang xem
    clearSelectedBook: (state) => {
      state.selectedBook = null;
      state.error.selectedBook = null;
    },
    // Synchronous action: xóa kết quả tìm kiếm
    clearSearchResults: (state) => {
      state.searchResults = null;
      state.error.search = null;
    },
  },
  extraReducers: (builder) => {
    // --- getBestsellers ---
    builder
      .addCase(getBestsellers.pending, (state) => {
        state.loading.bestsellers = true;
        state.error.bestsellers = null;
      })
      .addCase(getBestsellers.fulfilled, (state, action) => {
        state.loading.bestsellers = false;
        state.bestsellers = action.payload;
      })
      .addCase(getBestsellers.rejected, (state, action) => {
        state.loading.bestsellers = false;
        state.error.bestsellers = action.payload;
      });

    // --- getFeaturedBooks ---
    builder
      .addCase(getFeaturedBooks.pending, (state) => {
        state.loading.featured = true;
        state.error.featured = null;
      })
      .addCase(getFeaturedBooks.fulfilled, (state, action) => {
        state.loading.featured = false;
        state.featured = action.payload;
      })
      .addCase(getFeaturedBooks.rejected, (state, action) => {
        state.loading.featured = false;
        state.error.featured = action.payload;
      });

    // --- getNewArrivals ---
    builder
      .addCase(getNewArrivals.pending, (state) => {
        state.loading.newArrivals = true;
        state.error.newArrivals = null;
      })
      .addCase(getNewArrivals.fulfilled, (state, action) => {
        state.loading.newArrivals = false;
        state.newArrivals = action.payload;
      })
      .addCase(getNewArrivals.rejected, (state, action) => {
        state.loading.newArrivals = false;
        state.error.newArrivals = action.payload;
      });

    // --- getBookById ---
    builder
      .addCase(getBookById.pending, (state) => {
        state.loading.selectedBook = true;
        state.error.selectedBook = null;
      })
      .addCase(getBookById.fulfilled, (state, action) => {
        state.loading.selectedBook = false;
        state.selectedBook = action.payload;
      })
      .addCase(getBookById.rejected, (state, action) => {
        state.loading.selectedBook = false;
        state.error.selectedBook = action.payload;
      });

    // --- getBookBySlug ---
    builder
      .addCase(getBookBySlug.pending, (state) => {
        state.loading.selectedBook = true;
        state.error.selectedBook = null;
      })
      .addCase(getBookBySlug.fulfilled, (state, action) => {
        state.loading.selectedBook = false;
        state.selectedBook = action.payload;
      })
      .addCase(getBookBySlug.rejected, (state, action) => {
        state.loading.selectedBook = false;
        state.error.selectedBook = action.payload;
      });

    // --- searchBooks ---
    builder
      .addCase(searchBooks.pending, (state) => {
        state.loading.search = true;
        state.error.search = null;
      })
      .addCase(searchBooks.fulfilled, (state, action) => {
        state.loading.search = false;
        state.searchResults = action.payload;
      })
      .addCase(searchBooks.rejected, (state, action) => {
        state.loading.search = false;
        state.error.search = action.payload;
      });

    // --- getSimilarBooks ---
    builder
      .addCase(getSimilarBooks.pending, (state) => {
        state.loading.similarBooks = true;
        state.error.similarBooks = null;
      })
      .addCase(getSimilarBooks.fulfilled, (state, action) => {
        state.loading.similarBooks = false;
        state.similarBooks = action.payload;
      })
      .addCase(getSimilarBooks.rejected, (state, action) => {
        state.loading.similarBooks = false;
        state.error.similarBooks = action.payload;
      });

    // --- getPersonalizedRecommendations ---
    builder
      .addCase(getPersonalizedRecommendations.pending, (state) => {
        state.loading.personalized = true;
        state.error.personalized = null;
      })
      .addCase(getPersonalizedRecommendations.fulfilled, (state, action) => {
        state.loading.personalized = false;
        state.personalized = action.payload;
      })
      .addCase(getPersonalizedRecommendations.rejected, (state, action) => {
        state.loading.personalized = false;
        state.error.personalized = action.payload;
      });
  },
});

export const { clearSelectedBook, clearSearchResults } = bookSlice.actions;

// =====================================================
//  SELECTORS — Memoized, reusable state selectors
// =====================================================
export const selectBestsellers       = (state) => state.books.bestsellers;
export const selectFeaturedBooks     = (state) => state.books.featured;
export const selectNewArrivals       = (state) => state.books.newArrivals;
export const selectSelectedBook      = (state) => state.books.selectedBook;
export const selectSearchResults     = (state) => state.books.searchResults;
export const selectSimilarBooks      = (state) => state.books.similarBooks;
export const selectPersonalized      = (state) => state.books.personalized;
export const selectBooksLoading      = (key) => (state) => state.books.loading[key];
export const selectBooksError        = (key) => (state) => state.books.error[key];

export default bookSlice.reducer;
