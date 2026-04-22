// =====================================================
//  UTILITY FUNCTIONS — formatters.js
//  Hàm tiện ích dùng chung toàn dự án
// =====================================================

/**
 * Format giá tiền theo định dạng Việt Nam
 * @param {number} price - Giá bằng VND hoặc USD
 * @param {'VND'|'USD'} [currency='VND']
 * @returns {string}
 * @example formatPrice(125000) → "125.000 ₫"
 */
export const formatPrice = (price, currency = 'VND') => {
  if (!price && price !== 0) return '—';

  const formatter = new Intl.NumberFormat(
    currency === 'VND' ? 'vi-VN' : 'en-US',
    {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }
  );
  return formatter.format(price);
};

/**
 * Tính phần trăm giảm giá
 * @param {number} originalPrice
 * @param {number} currentPrice
 * @returns {number} Phần trăm giảm (0-100)
 */
export const calcDiscountPercent = (originalPrice, currentPrice) => {
  if (!originalPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

/**
 * Format ngày tháng
 * @param {string} isoDate - ISO 8601 string
 * @param {'short'|'long'|'year'} [format='short']
 * @returns {string}
 */
export const formatDate = (isoDate, format = 'short') => {
  if (!isoDate) return '—';
  const date = new Date(isoDate);

  const options = {
    short: { day: '2-digit', month: '2-digit', year: 'numeric' },
    long:  { day: 'numeric', month: 'long', year: 'numeric' },
    year:  { year: 'numeric' },
  };

  return new Intl.DateTimeFormat('vi-VN', options[format]).format(date);
};

/**
 * Rút gọn text quá dài
 * @param {string} text
 * @param {number} [maxLength=150]
 * @returns {string}
 */
export const truncateText = (text, maxLength = 150) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
};

/**
 * Tạo slug từ string (dùng cho URL)
 * @param {string} text
 * @returns {string}
 * @example slugify("Harry Potter") → "harry-potter"
 */
export const slugify = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
};

/**
 * Format rating thành chuỗi sao
 * @param {number} rating - Rating 1-5
 * @returns {{ full: number, half: boolean, empty: number }}
 */
export const formatRating = (rating) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return { full, half, empty };
};

/**
 * Hợp nhất class names (giống clsx + tailwind-merge)
 * @param {...string} classes
 * @returns {string}
 */
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
