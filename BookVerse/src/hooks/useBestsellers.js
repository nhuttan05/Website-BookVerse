// =====================================================
//  CUSTOM HOOK — useBestsellers.js
//  Đây chính là "CONTROLLER" trong mô hình Controller-View
//  
//  Nhiệm vụ:
//  1. Kết nối Redux Store với Component
//  2. Trigger side effects (gọi API khi cần)
//  3. Trả về data + state cho View sử dụng
//  4. Component (View) KHÔNG cần biết Redux hay API tồn tại
// =====================================================

import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getBestsellers,
  selectBestsellers,
  selectBooksLoading,
  selectBooksError,
} from '@/redux/bookSlice';

/**
 * Controller Hook cho tính năng "Bestseller Books"
 * 
 * @param {Object} options
 * @param {number} [options.limit=8] - Số sách muốn hiển thị
 * @param {boolean} [options.autoFetch=true] - Tự động gọi API khi mount
 * 
 * @returns {{
 *   books: import('@/types/book').Book[],
 *   isLoading: boolean,
 *   error: string | null,
 *   refetch: () => void,
 * }}
 * 
 * @example
 * // Trong BestsellerSection.jsx:
 * const { books, isLoading, error, refetch } = useBestsellers({ limit: 6 });
 */
const useBestsellers = ({ limit = 8, autoFetch = true } = {}) => {
  const dispatch = useDispatch();

  // Lấy data từ Redux Store thông qua selectors
  const books     = useSelector(selectBestsellers);
  const isLoading = useSelector(selectBooksLoading('bestsellers'));
  const error     = useSelector(selectBooksError('bestsellers'));

  // Action để dispatch (có thể gọi lại từ ngoài)
  const refetch = useCallback(() => {
    dispatch(getBestsellers(limit));
  }, [dispatch, limit]);

  // Side Effect: Tự động gọi API khi component mount
  // Chỉ gọi lại nếu chưa có data hoặc limit thay đổi
  useEffect(() => {
    if (autoFetch && books.length === 0) {
      refetch();
    }
  }, [autoFetch, books.length, refetch]);

  return {
    books,
    isLoading,
    error,
    refetch,
  };
};

export default useBestsellers;
