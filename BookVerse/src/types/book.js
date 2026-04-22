// =====================================================
//  TYPE DEFINITIONS — Book Interface
//  Định nghĩa cấu trúc dữ liệu Book để đồng bộ với Java Backend
//  Trong JS thuần, đây là JSDoc để IDE (VSCode) hỗ trợ IntelliSense
// =====================================================

/**
 * @typedef {Object} BookCategory
 * @property {number} id
 * @property {string} name
 * @property {string} slug
 */

/**
 * @typedef {Object} Author
 * @property {number} id
 * @property {string} name
 * @property {string} [bio]
 * @property {string} [avatarUrl]
 */

/**
 * @typedef {Object} BookReview
 * @property {number} id
 * @property {number} rating       - Rating từ 1-5
 * @property {string} comment
 * @property {string} reviewerName
 * @property {string} createdAt
 */

/**
 * @typedef {'IN_STOCK' | 'OUT_OF_STOCK' | 'PRE_ORDER'} BookStatus
 * Khớp với enum Java: BookStatus.java
 */

/**
 * @typedef {'PAPERBACK' | 'HARDCOVER' | 'EBOOK' | 'SIGNED_EDITION'} BookFormat
 * Khớp với enum Java: BookFormat.java
 */

/**
 * @typedef {Object} Book
 * @property {number}       id
 * @property {string}       title
 * @property {string}       slug          - URL-friendly unique identifier
 * @property {Author}       author
 * @property {BookCategory} category
 * @property {string}       description
 * @property {number}       price
 * @property {number}       [originalPrice] - Giá gốc (nếu đang giảm)
 * @property {number}       [discountPercent]
 * @property {string}       coverImageUrl
 * @property {string[]}     [galleryImages]
 * @property {BookFormat}   format
 * @property {BookStatus}   status
 * @property {number}       pageCount
 * @property {string}       isbn
 * @property {string}       publisher
 * @property {string}       publishedDate  - ISO 8601 format
 * @property {string}       language
 * @property {number}       rating         - Average rating (1-5)
 * @property {number}       reviewCount
 * @property {number}       soldCount
 * @property {boolean}      isFeatured
 * @property {boolean}      isEditorChoice - "Editor's Choice" badge
 * @property {string}       createdAt
 * @property {string}       updatedAt
 */

/**
 * @typedef {Object} PaginatedResponse
 * @property {Book[]} content
 * @property {number} totalElements
 * @property {number} totalPages
 * @property {number} currentPage
 * @property {number} pageSize
 * @property {boolean} hasNext
 * @property {boolean} hasPrevious
 */

/**
 * @typedef {Object} BooksState
 * @property {Book[]}            bestsellers
 * @property {Book[]}            featured
 * @property {Book[]}            newArrivals
 * @property {Book|null}         selectedBook
 * @property {PaginatedResponse|null} searchResults
 * @property {'idle'|'loading'|'succeeded'|'failed'} status
 * @property {string|null}       error
 */

// Xuất constants cho giá trị enum — dùng trong toàn dự án
export const BOOK_STATUS = {
  IN_STOCK:    'IN_STOCK',
  OUT_OF_STOCK:'OUT_OF_STOCK',
  PRE_ORDER:   'PRE_ORDER',
};

export const BOOK_FORMAT = {
  PAPERBACK:      'PAPERBACK',
  HARDCOVER:      'HARDCOVER',
  EBOOK:          'EBOOK',
  SIGNED_EDITION: 'SIGNED_EDITION',
};
