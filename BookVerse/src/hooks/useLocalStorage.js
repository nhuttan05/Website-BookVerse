// =====================================================
//  CUSTOM HOOK — useLocalStorage.js
//  Persisted state with localStorage sync
// =====================================================

import { useState, useEffect, useCallback } from 'react';

/**
 * State hook đồng bộ với localStorage
 * 
 * @param {string} key - localStorage key
 * @param {T} initialValue - Giá trị mặc định nếu key chưa tồn tại
 * @returns {[T, (value: T) => void, () => void]}
 * 
 * @example
 * const [theme, setTheme, removeTheme] = useLocalStorage('bookverse_theme', 'light');
 */
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`[useLocalStorage] Error reading key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`[useLocalStorage] Error setting key "${key}":`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`[useLocalStorage] Error removing key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

export default useLocalStorage;
