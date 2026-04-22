// =====================================================
//  CUSTOM HOOK — useDebounce.js
//  Tối ưu hiệu năng search: không gọi API mỗi keystroke
// =====================================================

import { useState, useEffect } from 'react';

/**
 * Debounce một giá trị - trì hoãn cập nhật sau delay milliseconds
 * Ứng dụng: Search bar, Filter bar
 * 
 * @param {T} value - Giá trị cần debounce
 * @param {number} [delay=500] - Thời gian trễ (ms)
 * @returns {T} Giá trị sau khi debounce
 * 
 * @example
 * const [query, setQuery] = useState('');
 * const debouncedQuery = useDebounce(query, 500);
 * // Chỉ gọi API khi debouncedQuery thay đổi
 * useEffect(() => { searchAPI(debouncedQuery); }, [debouncedQuery]);
 */
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: hủy timer nếu value thay đổi trước khi delay kết thúc
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
