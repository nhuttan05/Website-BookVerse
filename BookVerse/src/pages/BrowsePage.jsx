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
  clearSearchResults,
  getCategories,
  selectCategories
} from '@/redux/bookSlice';
import { BOOK_CATEGORIES } from '@/data/constants';

const BrowsePage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const categories = useMemo(() => searchParams.getAll('categories') || [], [searchParams]);
  const maxPrice = Number(searchParams.get('maxPrice')) || 2000000;
  const minRating = Number(searchParams.get('minRating')) || 0;
  const sortBy = searchParams.get('sortBy') || 'id';
  const direction = searchParams.get('direction') || 'desc';
  const page = Number(searchParams.get('page')) || 0;

  // Local state for sliders (Debounce)
  const [localMax, setLocalMax] = useState(maxPrice);
  
  // Redux state
  const searchResults = useSelector(selectSearchResults);
  const displayCategories = useSelector(selectCategories);
  const isLoading = useSelector(selectBooksLoading('search'));

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  // Sync local state when URL changes
  useEffect(() => {
    setLocalMax(maxPrice);
  }, [maxPrice]);

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localMax !== maxPrice) {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('maxPrice', localMax.toString());
        
        // Chỉ tự động chuyển sang Giá cao nếu người dùng CHƯA chọn sắp xếp theo giá
        if (sortBy !== 'price') {
          newParams.set('sortBy', 'price');
          newParams.set('direction', 'desc');
        }
        
        newParams.set('page', '0');
        setSearchParams(newParams);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [localMax, sortBy, maxPrice, searchParams, setSearchParams]);

  useEffect(() => {
    const params = {
      q: query,
      categories: categories.length > 0 ? categories : null,
      maxPrice,
      minRating,
      sortBy,
      page,
      direction,
      size: 20
    };
    dispatch(searchBooks(params));
    
    return () => dispatch(clearSearchResults());
  }, [dispatch, query, categories, maxPrice, minRating, sortBy, direction, page]);

  const toggleCat = (slug) => {
    const newParams = new URLSearchParams(searchParams);
    const currentCats = newParams.getAll('categories');
    
    newParams.delete('categories'); // Remove all first
    
    if (currentCats.includes(slug)) {
      // If it was already checked, add back the others
      currentCats.filter(c => c !== slug).forEach(c => newParams.append('categories', c));
    } else {
      // If it wasn't checked, add all existing + the new one
      currentCats.forEach(c => newParams.append('categories', c));
      newParams.append('categories', slug);
    }
    
    newParams.set('page', '0');
    setSearchParams(newParams);
  };


  const handleRatingChange = (value) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('minRating', value.toString());
    newParams.set('page', '0');
    setSearchParams(newParams);
  };

  const handleSortChange = (value) => {
    const newParams = new URLSearchParams(searchParams);
    const [field, dir] = value.split(':');
    newParams.set('sortBy', field);
    newParams.set('direction', dir);
    newParams.set('page', '0');
    setSearchParams(newParams);
  };

  // Extract real books from paginated response
  const books = searchResults?.content || [];
  const totalElements = searchResults?.totalElements || 0;

  return (
    <div className="bg-surface min-h-screen pt-8 pb-20">
      <div className="max-w-[1600px] mx-auto px-6 flex flex-col md:flex-row gap-8">
        
        {/* ══════════ SIDEBAR FILTERS ══════════ */}
        <aside className="w-full md:w-56 shrink-0 space-y-10">
          
          {/* Thể loại */}
          <div>
            <h3 className="text-xs font-bold text-primary tracking-widest uppercase mb-6">Thể loại</h3>
            <div className="space-y-3">
              {(displayCategories.length > 0 ? displayCategories : BOOK_CATEGORIES).map(cat => (
                <label key={cat.id || cat.slug} className="flex items-center justify-between gap-3 cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        className="peer appearance-none w-4 h-4 border-2 border-outline-variant rounded-md checked:bg-primary checked:border-primary transition-all"
                        checked={categories.includes(cat.slug)}
                        onChange={() => toggleCat(cat.slug)}
                      />
                      <span className="material-symbols-outlined absolute text-white text-[10px] opacity-0 peer-checked:opacity-100 left-1/2 -translate-x-1/2 pointer-events-none">check</span>
                    </div>
                    <span className="text-xs font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">{cat.name}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Giá */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-bold text-primary tracking-widest uppercase">Giá tối đa</h3>
              <span className="text-[11px] font-black text-on-surface bg-surface-container px-2 py-0.5 rounded-md">
                {localMax.toLocaleString()}đ
              </span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="2000000" 
              step="50000"
              value={localMax}
              onChange={(e) => setLocalMax(Number(e.target.value))}
              className="w-full h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between mt-3 text-[10px] font-bold text-outline-variant uppercase tracking-wider">
              <span>Min: 0đ</span>
              <span>Max: 2M+</span>
            </div>
          </div>

          {/* Đánh giá */}
          <div>
            <h3 className="text-xs font-bold text-primary tracking-widest uppercase mb-6">Đánh giá</h3>
            <div className="space-y-2.5">
              {[5, 4, 3, 2, 1].map(stars => (
                <label key={stars} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="rating" 
                    checked={minRating === stars}
                    onChange={() => handleRatingChange(stars)}
                    className="w-4 h-4 border-2 border-outline-variant rounded-full appearance-none checked:border-primary checked:border-[5px] transition-all" 
                  />
                  <div className="flex gap-0.5 text-tertiary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: `'FILL' ${i < stars ? 1 : 0}` }}>star</span>
                    ))}
                  </div>
                </label>
              ))}
            </div>
          </div>

        </aside>

        {/* ══════════ MAIN CONTENT ══════════ */}
        <main className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-on-surface">
                {query ? `Kết quả cho "${query}"` : 'Duyệt Archive'}
              </h1>
              <p className="text-[11px] font-bold text-on-surface-variant mt-0.5">Đang hiển thị {books.length} trên {totalElements} kết quả</p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-outline uppercase tracking-widest whitespace-nowrap">Sắp xếp</span>
              <div className="relative group">
                <button className="flex items-center gap-3 bg-surface-container-low hover:bg-surface-container px-4 py-2 rounded-2xl border border-outline-variant/30 transition-all cursor-pointer group-hover:ring-4 group-hover:ring-primary/10">
                  <span className="text-xs font-black text-on-surface">
                    {sortBy === 'price' ? (direction === 'asc' ? 'Giá: Thấp đến Cao' : 'Giá: Cao đến Thấp') : 
                     sortBy === 'rating' ? 'Đánh giá' : 'Mới nhất'}
                  </span>
                  <span className="material-symbols-outlined text-sm text-primary transition-transform group-hover:rotate-180">expand_more</span>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-52 bg-surface-container-high rounded-3xl shadow-2xl border border-outline-variant/20 py-3 z-50 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300">
                  {[
                    { label: 'Mới nhất', val: 'id:desc', icon: 'schedule' },
                    { label: 'Giá: Thấp đến Cao', val: 'price:asc', icon: 'trending_up' },
                    { label: 'Giá: Cao đến Thấp', val: 'price:desc', icon: 'trending_down' },
                    { label: 'Đánh giá', val: 'rating:desc', icon: 'star' }
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => handleSortChange(opt.val)}
                      className={`w-full flex items-center gap-3 px-5 py-2.5 text-xs font-bold transition-all hover:bg-primary/10 hover:text-primary ${
                        `${sortBy}:${direction}` === opt.val ? 'text-primary bg-primary/5' : 'text-on-surface-variant'
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">{opt.icon}</span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
              {Array(12).fill(0).map((_, idx) => (
                <div key={idx} className="aspect-[2/3] bg-surface-container-low animate-pulse rounded-3xl"></div>
              ))}
            </div>
          ) : books.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-5 gap-y-8">
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
            <div className="mt-20 flex justify-center items-center gap-2">
              {/* Previous */}
              <button 
                disabled={page === 0}
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set('page', (page - 1).toString());
                  setSearchParams(newParams);
                }}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-container transition-all disabled:opacity-20 disabled:cursor-not-allowed group"
              >
                <span className="material-symbols-outlined text-outline group-hover:text-primary">chevron_left</span>
              </button>
              
              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {(() => {
                  const total = searchResults.totalPages;
                  const current = page;
                  const pages = [];
                  
                  // Logic: Always show first, last, and range around current
                  const range = 1; // Number of neighbors to show
                  
                  for (let i = 0; i < total; i++) {
                    if (
                      i === 0 || // First
                      i === total - 1 || // Last
                      (i >= current - range && i <= current + range) // Around current
                    ) {
                      pages.push(i);
                    } else if (
                      (i === current - range - 1 && i > 0) ||
                      (i === current + range + 1 && i < total - 1)
                    ) {
                      pages.push('...');
                    }
                  }
                  
                  // Filter out consecutive dots
                  return pages.filter((p, idx) => p !== '...' || pages[idx - 1] !== '...').map((p, i) => (
                    p === '...' ? (
                      <span key={`dot-${i}`} className="w-10 text-center text-outline-variant font-bold">...</span>
                    ) : (
                      <button 
                        key={p}
                        onClick={() => {
                          const newParams = new URLSearchParams(searchParams);
                          newParams.set('page', p.toString());
                          setSearchParams(newParams);
                        }}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all text-xs font-black tracking-tighter ${
                          page === p 
                            ? 'bg-primary text-on-primary shadow-lg shadow-primary/30 scale-110' 
                            : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
                        }`}
                      >
                        {p + 1}
                      </button>
                    )
                  ));
                })()}
              </div>

              {/* Next */}
              <button 
                disabled={page === searchResults.totalPages - 1}
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set('page', (page + 1).toString());
                  setSearchParams(newParams);
                }}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-container transition-all disabled:opacity-20 disabled:cursor-not-allowed group"
              >
                <span className="material-symbols-outlined text-outline group-hover:text-primary">chevron_right</span>
              </button>
            </div>
          )}
        </main>

      </div>
    </div>
  );
};

export default BrowsePage;
