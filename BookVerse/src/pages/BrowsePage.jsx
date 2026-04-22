// =====================================================
//  PAGE — BrowsePage.jsx
//  Giao diện tìm kiếm và lọc sách (Stitch-aligned)
//  Layout: Sidebar (Filters) + Main Content (Results)
// =====================================================

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import BookCard from '@/components/BookCard';
import { 
  searchBooks, 
  selectSearchResults, 
  selectBooksLoading,
  clearSearchResults 
} from '@/redux/bookSlice';
import { BOOK_CATEGORIES } from '@/data/constants';

const BrowsePage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const maxPrice = Number(searchParams.get('maxPrice')) || 2000000;
  const page = Number(searchParams.get('page')) || 0;
  
  // Redux state
  const searchResults = useSelector(selectSearchResults);
  const isLoading = useSelector(selectBooksLoading('search'));

  useEffect(() => {
    const params = {
      query,
      category,
      maxPrice,
      page,
      size: 12
    };
    dispatch(searchBooks(params));
    
    // Cleanup khi unmount
    return () => dispatch(clearSearchResults());
  }, [dispatch, query, category, maxPrice, page]);

  const toggleCat = (slug) => {
    const newParams = new URLSearchParams(searchParams);
    if (category === slug) {
      newParams.delete('category');
    } else {
      newParams.set('category', slug);
    }
    newParams.set('page', '0'); // Reset page
    setSearchParams(newParams);
  };

  const handlePriceChange = (value) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('maxPrice', value.toString());
    newParams.set('page', '0');
    setSearchParams(newParams);
  };

  // Extract real books from paginated response
  const books = searchResults?.content || [];
  const totalElements = searchResults?.totalElements || 0;

  return (
    <div className="bg-surface min-h-screen pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-12">
        
        {/* ══════════ SIDEBAR FILTERS ══════════ */}
        <aside className="w-full md:w-64 shrink-0 space-y-10">
          
          {/* Thể loại */}
          <div>
            <h3 className="text-xs font-bold text-primary tracking-widest uppercase mb-6">Thể loại</h3>
            <div className="space-y-3">
              {BOOK_CATEGORIES.map(cat => (
                <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      className="peer appearance-none w-5 h-5 border-2 border-outline-variant rounded-md checked:bg-primary checked:border-primary transition-all"
                      checked={category === cat.slug}
                      onChange={() => toggleCat(cat.slug)}
                    />
                    <span className="material-symbols-outlined absolute text-white text-sm opacity-0 peer-checked:opacity-100 left-1/2 -translate-x-1/2 pointer-events-none">check</span>
                  </div>
                  <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Giá */}
          <div>
            <h3 className="text-xs font-bold text-primary tracking-widest uppercase mb-6">Giá tối đa (VNĐ)</h3>
            <input 
              type="range" 
              min="0" 
              max="2000000" 
              step="50000"
              value={maxPrice}
              onChange={(e) => handlePriceChange(e.target.value)}
              className="w-full h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between mt-3 text-[10px] font-bold text-outline uppercase tracking-wider">
              <span>0đ</span>
              <span>{maxPrice.toLocaleString()}đ</span>
            </div>
          </div>

          {/* Đánh giá */}
          <div>
            <h3 className="text-xs font-bold text-primary tracking-widest uppercase mb-6">Đánh giá</h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map(stars => (
                <label key={stars} className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="rating" className="w-5 h-5 border-2 border-outline-variant rounded-full appearance-none checked:border-primary checked:border-[6px] transition-all" />
                  <div className="flex gap-0.5 text-tertiary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: `'FILL' ${i < stars ? 1 : 0}` }}>star</span>
                    ))}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Tình trạng */}
          <div>
            <h3 className="text-xs font-bold text-primary tracking-widest uppercase mb-6">Tình trạng</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 border-2 border-outline-variant rounded-md appearance-none checked:bg-primary checked:border-primary transition-all" />
              <span className="text-sm font-medium text-on-surface-variant">Còn hàng</span>
            </label>
          </div>

        </aside>

        {/* ══════════ MAIN CONTENT ══════════ */}
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">Duyệt Archive</h1>
              <p className="text-on-surface-variant mt-1">Đang hiển thị {books.length} trên {totalElements} kết quả</p>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-outline uppercase tracking-widest whitespace-nowrap">Sắp xếp theo</span>
              <select 
                className="bg-surface-container-low px-4 py-2 rounded-xl text-sm font-bold text-on-surface outline-none border-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="bestseller">Bán chạy nhất</option>
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
              </select>
            </div>
          </div>

          {/* Results Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6).fill(0).map((_, idx) => (
                <div key={idx} className="aspect-[2/3] bg-surface-container-low animate-pulse rounded-3xl"></div>
              ))}
            </div>
          ) : books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {books.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center space-y-4">
              <span className="material-symbols-outlined text-6xl text-outline-variant">search_off</span>
              <p className="text-xl font-bold text-on-surface-variant">Không tìm thấy cuốn sách nào khớp với lựa chọn của bạn.</p>
              <button 
                onClick={() => setSearchParams({})}
                className="text-primary font-bold hover:underline"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}

          {/* Pagination */}
          {books.length > 0 && searchResults?.totalPages > 1 && (
            <div className="mt-16 flex justify-center items-center gap-2">
              <button 
                disabled={page === 0}
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set('page', (page - 1).toString());
                  setSearchParams(newParams);
                }}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-container transition-colors disabled:opacity-30"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              
              {Array.from({ length: searchResults.totalPages }).map((_, i) => (
                <button 
                  key={i}
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.set('page', i.toString());
                    setSearchParams(newParams);
                  }}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all font-bold ${
                    page === i ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-surface-container'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                disabled={page === searchResults.totalPages - 1}
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set('page', (page + 1).toString());
                  setSearchParams(newParams);
                }}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-container transition-colors disabled:opacity-30"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          )}
        </main>

      </div>
    </div>
  );
};

export default BrowsePage;
