// =====================================================
//  PAGE — BrowsePage.jsx
//  Giao diện tìm kiếm và lọc sách (Stitch-aligned)
//  Layout: Sidebar (Filters) + Main Content (Results)
// =====================================================

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Search, X } from 'lucide-react';
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
  const suppliers = useMemo(() => searchParams.getAll('suppliers') || [], [searchParams]);
  const languages = useMemo(() => searchParams.getAll('languages') || [], [searchParams]);
  const ageRanges = useMemo(() => searchParams.getAll('ageRanges') || [], [searchParams]);
  const maxPrice = Number(searchParams.get('maxPrice')) || 2000000;
  const minRating = Number(searchParams.get('minRating')) || 0;
  const sortBy = searchParams.get('sortBy') || 'id';
  const direction = searchParams.get('direction') || 'desc';
  const page = Number(searchParams.get('page')) || 0;

  // Local state for sliders (Debounce)
  const [localMax, setLocalMax] = useState(maxPrice);
  // Local state for search input (Debounce)
  const [localQuery, setLocalQuery] = useState(query);
  
  // Redux state
  const searchResults = useSelector(selectSearchResults);
  const displayCategories = useSelector(selectCategories);
  const isLoading = useSelector(selectBooksLoading('search'));

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  // Sync local query khi URL thay đổi từ bên ngoài (ví dụ: click từ navbar)
  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  useEffect(() => {
    setLocalMax(maxPrice);
  }, [maxPrice]);

  // Debounced price filter
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localMax !== maxPrice) {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('maxPrice', localMax.toString());
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

  // Debounced search query
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localQuery !== query) {
        const newParams = new URLSearchParams(searchParams);
        if (localQuery) {
          newParams.set('q', localQuery);
        } else {
          newParams.delete('q');
        }
        newParams.set('page', '0');
        setSearchParams(newParams);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [localQuery, query, searchParams, setSearchParams]);

  useEffect(() => {
    const params = {
      q: query,
      categories: categories.length > 0 ? categories : null,
      suppliers: suppliers.length > 0 ? suppliers : null,
      languages: languages.length > 0 ? languages : null,
      ageRanges: ageRanges.length > 0 ? ageRanges : null,
      maxPrice,
      minRating,
      sortBy,
      page,
      direction,
      size: 20
    };
    dispatch(searchBooks(params));
    
    return () => dispatch(clearSearchResults());
  }, [dispatch, query, categories, suppliers, languages, ageRanges, maxPrice, minRating, sortBy, direction, page]);

  const toggleFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    const currentValues = newParams.getAll(key);
    
    newParams.delete(key);
    
    if (currentValues.includes(value)) {
      currentValues.filter(v => v !== value).forEach(v => newParams.append(key, v));
    } else {
      currentValues.forEach(v => newParams.append(key, v));
      newParams.append(key, value);
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
                        onChange={() => toggleFilter('categories', cat.slug)}
                      />
                      <span className="material-symbols-outlined absolute text-white text-[10px] opacity-0 peer-checked:opacity-100 left-1/2 -translate-x-1/2 pointer-events-none">check</span>
                    </div>
                    <span className="text-xs font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">{cat.name}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Nhà cung cấp */}
          <div>
            <h3 className="text-xs font-bold text-primary tracking-widest uppercase mb-6">Nhà cung cấp</h3>
            <div className="space-y-3">
              {['Fahasa', 'Nhã Nam', 'First News', 'Alphabooks', 'NXB Trẻ', 'NXB Kim Đồng'].map(s => (
                <label key={s} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input type="checkbox" className="peer appearance-none w-4 h-4 border-2 border-outline-variant rounded-md checked:bg-primary checked:border-primary transition-all"
                      checked={suppliers.includes(s)} onChange={() => toggleFilter('suppliers', s)} />
                    <span className="material-symbols-outlined absolute text-white text-[10px] opacity-0 peer-checked:opacity-100 left-1/2 -translate-x-1/2 pointer-events-none">check</span>
                  </div>
                  <span className="text-xs font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">{s}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Độ tuổi */}
          <div>
            <h3 className="text-xs font-bold text-primary tracking-widest uppercase mb-6">Độ tuổi</h3>
            <div className="space-y-3">
              {['0-6', '6-12', '12-15', '15-18', '18+'].map(a => (
                <label key={a} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input type="checkbox" className="peer appearance-none w-4 h-4 border-2 border-outline-variant rounded-md checked:bg-primary checked:border-primary transition-all"
                      checked={ageRanges.includes(a)} onChange={() => toggleFilter('ageRanges', a)} />
                    <span className="material-symbols-outlined absolute text-white text-[10px] opacity-0 peer-checked:opacity-100 left-1/2 -translate-x-1/2 pointer-events-none">check</span>
                  </div>
                  <span className="text-xs font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">{a}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Ngôn ngữ */}
          <div>
            <h3 className="text-xs font-bold text-primary tracking-widest uppercase mb-6">Ngôn ngữ</h3>
            <div className="space-y-3">
              {['Tiếng Việt', 'Tiếng Anh', 'Tiếng Nhật', 'Tiếng Pháp'].map(l => (
                <label key={l} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input type="checkbox" className="peer appearance-none w-4 h-4 border-2 border-outline-variant rounded-md checked:bg-primary checked:border-primary transition-all"
                      checked={languages.includes(l)} onChange={() => toggleFilter('languages', l)} />
                    <span className="material-symbols-outlined absolute text-white text-[10px] opacity-0 peer-checked:opacity-100 left-1/2 -translate-x-1/2 pointer-events-none">check</span>
                  </div>
                  <span className="text-xs font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">{l}</span>
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
          {/* Search + Sort row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-on-surface">
                {query ? `Kết quả cho "${query}"` : 'Duyệt Archive'}
              </h1>
              <p className="text-[11px] font-bold text-on-surface-variant mt-0.5">Đang hiển thị {books.length} trên {totalElements} kết quả</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                  <Search size={16} className={`transition-colors ${localQuery ? 'text-primary' : 'text-outline-variant'}`} />
                </div>
                <input
                  type="text"
                  value={localQuery}
                  onChange={e => setLocalQuery(e.target.value)}
                  placeholder="Tìm tên sách, tác giả..."
                  className="pl-10 pr-8 py-2.5 w-52 bg-surface-container-high border border-outline-variant/20 rounded-2xl text-sm font-medium text-on-surface placeholder:text-outline-variant/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all focus:w-64"
                />
                {localQuery && (
                  <button
                    onClick={() => setLocalQuery('')}
                    className="absolute inset-y-0 right-2.5 flex items-center text-outline-variant hover:text-on-surface transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              {/* Sort dropdown */}
              <span className="text-[10px] font-black text-outline uppercase tracking-widest whitespace-nowrap hidden sm:block">Sắp xếp</span>
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

          {/* Infinite Scroll / Load More */}
          {searchResults?.totalPages > page + 1 && (
            <div className="mt-20 flex justify-center">
              <button 
                disabled={isLoading}
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set('page', (page + 1).toString());
                  setSearchParams(newParams);
                }}
                className="group flex flex-col items-center gap-4 transition-all"
              >
                <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all shadow-lg group-active:scale-95">
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span className="material-symbols-outlined text-primary group-hover:text-white transition-colors">expand_more</span>
                  )}
                </div>
                <span className="text-[10px] font-black text-outline uppercase tracking-[0.3em] group-hover:text-primary transition-colors">
                  {isLoading ? 'Đang tải...' : 'Xem thêm kết quả'}
                </span>
              </button>
            </div>
          )}
        </main>

      </div>
    </div>
  );
};

export default BrowsePage;
