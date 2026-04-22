// =====================================================
//  SERVICES LAYER — bookService.js
//  Nhiệm vụ: Frontend business logic + API calls
//  Lý do tách biệt: Page/Component KHÔNG gọi API trực tiếp
//  Clean Architecture: View → Hook → Service → API
// =====================================================

import axiosInstance from '@/api/axiosInstance';
import { ENDPOINTS } from '@/api/endpoints';

/**
 * Lấy danh sách sách bán chạy nhất
 * @param {number} [limit=8] - Số lượng sách muốn lấy
 * @returns {Promise<import('@/types/book').Book[]>}
 */
export const fetchBestsellers = async (limit = 8) => {
  const response = await axiosInstance.get(ENDPOINTS.BOOKS.BESTSELLERS, {
    params: { limit },
  });
  return response.data;
};

/**
 * Lấy thông tin chi tiết một cuốn sách
 * @param {number} id - Book ID
 * @returns {Promise<import('@/types/book').Book>}
 */
export const fetchBookById = async (id) => {
  const response = await axiosInstance.get(ENDPOINTS.BOOKS.BY_ID(id));
  return response.data;
};

/**
 * Lấy thông tin chi tiết một cuốn sách qua slug
 * @param {string} slug - Book Slug
 * @returns {Promise<import('@/types/book').Book>}
 */
export const fetchBookBySlug = async (slug) => {
  const response = await axiosInstance.get(ENDPOINTS.BOOKS.BY_SLUG(slug));
  return response.data;
};

export const fetchSimilarBooks = async (slug) => {
  const response = await axiosInstance.get(ENDPOINTS.RECOMMENDATIONS.SIMILAR(slug));
  return response.data;
};

export const fetchPersonalizedRecommendations = async () => {
  const response = await axiosInstance.get(ENDPOINTS.RECOMMENDATIONS.PERSONALIZED);
  return response.data;
};

/**
 * Tìm kiếm sách theo từ khóa và filter
 * @param {Object} params
 * @param {string} [params.query]
 * @param {string} [params.category]
 * @param {string} [params.author]
 * @param {number} [params.minPrice]
 * @param {number} [params.maxPrice]
 * @param {number} [params.minRating]
 * @param {'IN_STOCK'|'OUT_OF_STOCK'|'PRE_ORDER'} [params.status]
 * @param {string} [params.sortBy] - 'price_asc', 'price_desc', 'rating', 'newest'
 * @param {number} [params.page=0]
 * @param {number} [params.size=12]
 * @returns {Promise<import('@/types/book').PaginatedResponse>}
 */
export const searchBooks = async (params = {}) => {
  const response = await axiosInstance.get(ENDPOINTS.BOOKS.SEARCH, {
    params: {
      page: 0,
      size: 12,
      ...params,
    },
  });
  return response.data;
};

/**
 * Lấy sách theo danh mục
 * @param {string} categorySlug
 * @param {number} [page=0]
 * @returns {Promise<import('@/types/book').PaginatedResponse>}
 */
export const fetchBooksByCategory = async (categorySlug, page = 0) => {
  const response = await axiosInstance.get(
    ENDPOINTS.BOOKS.BY_CATEGORY(categorySlug),
    { params: { page } }
  );
  return response.data;
};

/**
 * Lấy sách nổi bật (Hero/Featured)
 * @returns {Promise<import('@/types/book').Book[]>}
 */
export const fetchFeaturedBooks = async () => {
  const response = await axiosInstance.get(ENDPOINTS.BOOKS.FEATURED);
  return response.data;
};

/**
 * Lấy sách mới nhất
 * @param {number} [limit=6]
 * @returns {Promise<import('@/types/book').Book[]>}
 */
export const fetchNewArrivals = async (limit = 6) => {
  const response = await axiosInstance.get(ENDPOINTS.BOOKS.NEW_ARRIVALS, {
    params: { limit },
  });
  return response.data;
};
