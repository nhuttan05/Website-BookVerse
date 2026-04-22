// =====================================================
//  CONSTANTS & ENUMS — constants.js
//  Dữ liệu tĩnh và constants dùng toàn dự án
// =====================================================

// Tên app
export const APP_NAME = 'BookVerse';
export const APP_TAGLINE = 'The Ultimate Curated Digital Archive';

// Navigation links (TopAppBar)
export const NAV_LINKS = [
  { label: 'Trang chủ',   path: '/',            id: 'nav-home' },
  { label: 'Khám phá',    path: '/browse',       id: 'nav-browse' },
  { label: 'Danh mục',    path: '/categories',   id: 'nav-categories' },
  { label: 'Tác giả',     path: '/authors',      id: 'nav-authors' },
  { label: 'Blog',        path: '/blog',         id: 'nav-blog' },
  { label: 'Về chúng tôi',path: '/about',        id: 'nav-about' },
];

// Book categories từ PRD
export const BOOK_CATEGORIES = [
  { id: 1, name: 'Nghệ thuật & Thiết kế',  slug: 'arts-design',   icon: '🎨', color: '#E8D5FF' },
  { id: 2, name: 'Khoa học',                slug: 'science',        icon: '🔬', color: '#D5E8FF' },
  { id: 3, name: 'Lịch sử',                 slug: 'history',        icon: '📜', color: '#FFE8D5' },
  { id: 4, name: 'Văn học',                 slug: 'literature',     icon: '📖', color: '#D5FFE8' },
  { id: 5, name: 'Kinh doanh',              slug: 'business',       icon: '💼', color: '#FFECD5' },
  { id: 6, name: 'Triết học',               slug: 'philosophy',     icon: '🧠', color: '#FFD5E8' },
  { id: 7, name: 'Công nghệ',               slug: 'technology',     icon: '💻', color: '#D5F0FF' },
  { id: 8, name: 'Tự phát triển',           slug: 'self-development',icon: '🌱', color: '#E8FFD5' },
];

// Sort options cho search/browse
export const SORT_OPTIONS = [
  { value: 'relevance',   label: 'Liên quan nhất' },
  { value: 'newest',      label: 'Mới nhất' },
  { value: 'bestseller',  label: 'Bán chạy nhất' },
  { value: 'price_asc',   label: 'Giá: Thấp → Cao' },
  { value: 'price_desc',  label: 'Giá: Cao → Thấp' },
  { value: 'rating',      label: 'Đánh giá cao nhất' },
];

// Price ranges cho filter
export const PRICE_RANGES = [
  { label: 'Dưới 50.000đ',         min: 0,      max: 50000 },
  { label: '50.000đ - 100.000đ',   min: 50000,  max: 100000 },
  { label: '100.000đ - 200.000đ',  min: 100000, max: 200000 },
  { label: '200.000đ - 500.000đ',  min: 200000, max: 500000 },
  { label: 'Trên 500.000đ',        min: 500000, max: null },
];

// LocalStorage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN:  'bookverse_access_token',
  REFRESH_TOKEN: 'bookverse_refresh_token',
  USER_PROFILE:  'bookverse_user',
  THEME:         'bookverse_theme',
  CART:          'bookverse_cart',
};

// Book status labels
export const BOOK_STATUS_LABEL = {
  IN_STOCK:    { label: 'Còn hàng',      color: '#16a34a' },
  OUT_OF_STOCK:{ label: 'Hết hàng',      color: '#dc2626' },
  PRE_ORDER:   { label: 'Đặt trước',     color: '#d97706' },
};

// Book format labels
export const BOOK_FORMAT_LABEL = {
  PAPERBACK:      'Bìa mềm',
  HARDCOVER:      'Bìa cứng',
  EBOOK:          'Ebook',
  SIGNED_EDITION: 'Phiên bản đặc biệt',
};

// Pagination
export const DEFAULT_PAGE_SIZE = 12;
export const BESTSELLER_LIMIT  = 8;
export const FEATURED_LIMIT    = 4;
export const NEW_ARRIVALS_LIMIT = 6;
