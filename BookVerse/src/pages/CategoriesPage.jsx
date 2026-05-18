// =====================================================
//  PAGE — CategoriesPage.jsx
//  Danh mục sách với thanh tìm kiếm lọc real-time
// =====================================================

import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories, selectCategories } from '@/redux/bookSlice';
import { BOOK_CATEGORIES } from '@/data/constants';
import { Search, X } from 'lucide-react';

// Mỗi danh mục có icon riêng
const CATEGORY_ICONS = [
  'auto_stories', 'history_edu', 'psychology', 'menu_book',
  'science', 'palette', 'business_center', 'public',
  'calculate', 'music_note', 'sports_soccer', 'restaurant',
  'travel_explore', 'child_care', 'biotech', 'gavel',
];

const CATEGORY_GRADIENTS = [
  { from: '#6366f1', to: '#8b5cf6', light: '#eef2ff' },
  { from: '#ec4899', to: '#f43f5e', light: '#fdf2f8' },
  { from: '#f59e0b', to: '#ef4444', light: '#fffbeb' },
  { from: '#10b981', to: '#14b8a6', light: '#ecfdf5' },
  { from: '#3b82f6', to: '#6366f1', light: '#eff6ff' },
  { from: '#8b5cf6', to: '#a855f7', light: '#f5f3ff' },
  { from: '#f97316', to: '#f59e0b', light: '#fff7ed' },
  { from: '#06b6d4', to: '#3b82f6', light: '#ecfeff' },
];

const CategoriesPage = () => {
  const dispatch = useDispatch();
  const dynamicCategories = useSelector(selectCategories);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const allCategories = dynamicCategories.length > 0 ? dynamicCategories : BOOK_CATEGORIES;

  // Lọc real-time theo tên
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allCategories;
    return allCategories.filter(cat =>
      cat.name.toLowerCase().includes(q)
    );
  }, [allCategories, searchQuery]);

  return (
    <div className="bg-surface min-h-screen pb-24">

      {/* ══════════ HERO HEADER ══════════ */}
      <section className="relative py-24 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-surface to-secondary/5 pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-tertiary/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-xs font-black uppercase tracking-widest rounded-full">
            <span className="material-symbols-outlined text-sm">category</span>
            {allCategories.length} danh mục
          </div>

          <h1 className="text-6xl font-black tracking-tight text-on-surface leading-tight">
            Khám phá vũ trụ{' '}
            <span className="text-primary relative">
              tri thức
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary/30 rounded-full" />
            </span>
          </h1>

          <p className="text-xl text-on-surface-variant font-medium max-w-2xl mx-auto leading-relaxed">
            Duyệt qua các danh mục được tuyển chọn kỹ lưỡng để tìm thấy nguồn cảm hứng tiếp theo của bạn.
          </p>

          {/* ── Thanh tìm kiếm ── */}
          <div className="max-w-xl mx-auto mt-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Search
                  size={20}
                  className={`transition-colors duration-200 ${
                    searchQuery ? 'text-primary' : 'text-outline-variant'
                  }`}
                />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Tìm danh mục... (ví dụ: Văn học, Khoa học)"
                className="w-full pl-14 pr-14 py-5 bg-white border-2 border-outline-variant/20 rounded-2xl text-base font-medium text-on-surface placeholder:text-outline-variant/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 shadow-sm transition-all duration-200 group-hover:shadow-md"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-4 flex items-center px-1 text-outline-variant hover:text-on-surface transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Kết quả lọc */}
            {searchQuery && (
              <p className="mt-3 text-sm font-semibold text-on-surface-variant">
                {filtered.length > 0 ? (
                  <>
                    Tìm thấy{' '}
                    <span className="text-primary font-black">{filtered.length}</span>
                    {' '}danh mục phù hợp với &ldquo;
                    <span className="text-on-surface font-bold">{searchQuery}</span>
                    &rdquo;
                  </>
                ) : (
                  <>
                    Không tìm thấy danh mục nào phù hợp với &ldquo;
                    <span className="text-on-surface font-bold">{searchQuery}</span>
                    &rdquo;
                  </>
                )}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ══════════ CATEGORIES GRID ══════════ */}
      <section className="max-w-7xl mx-auto px-6 -mt-4">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((cat, idx) => {
              const gradient = CATEGORY_GRADIENTS[idx % CATEGORY_GRADIENTS.length];
              const icon = CATEGORY_ICONS[idx % CATEGORY_ICONS.length];
              return (
                <Link
                  key={cat.id || cat.slug}
                  to={`/browse?categories=${cat.slug}`}
                  className="group relative bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-outline-variant/10 overflow-hidden text-center"
                >
                  {/* Background blob on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(135deg, ${gradient.light}, white)` }}
                  />

                  {/* Badge số lượng */}
                  {cat.bookCount !== undefined && (
                    <div
                      className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-black"
                      style={{ background: gradient.light, color: gradient.from }}
                    >
                      {cat.bookCount.toLocaleString()}
                    </div>
                  )}

                  {/* Icon */}
                  <div
                    className="relative w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
                  >
                    <span className="material-symbols-outlined text-3xl text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {icon}
                    </span>
                  </div>

                  {/* Text */}
                  <div className="relative space-y-2">
                    <h3 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors duration-200 leading-tight">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-outline-variant leading-relaxed">
                      {cat.bookCount !== undefined
                        ? `${cat.bookCount.toLocaleString()} cuốn sách`
                        : 'Khám phá bộ sưu tập'}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="relative mt-4 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-y-2 group-hover:translate-y-0">
                    <span
                      className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest"
                      style={{ color: gradient.from }}
                    >
                      Xem ngay
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <div className="py-24 text-center space-y-6">
            <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mx-auto">
              <Search size={32} className="text-outline-variant" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-on-surface">Không tìm thấy kết quả</h3>
              <p className="text-on-surface-variant font-medium">
                Không có danh mục nào khớp với &ldquo;{searchQuery}&rdquo;
              </p>
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="px-6 py-3 bg-primary text-on-primary rounded-2xl font-bold text-sm hover:scale-105 transition-transform active:scale-95"
            >
              Xem tất cả danh mục
            </button>
          </div>
        )}
      </section>

      {/* ══════════ CTA SECTION ══════════ */}
      {!searchQuery && (
        <section className="max-w-7xl mx-auto px-6 mt-20">
          <div className="p-14 bg-on-surface text-white rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-3 max-w-lg relative">
              <span className="text-xs font-black uppercase tracking-widest text-white/40">Tìm kiếm nâng cao</span>
              <h2 className="text-4xl font-black tracking-tight">Tìm kiếm theo tác giả yêu thích?</h2>
              <p className="text-white/60 text-base leading-relaxed">
                Chúng tôi lưu trữ tác phẩm của hơn 5.000 tác giả nổi tiếng từ khắp nơi trên thế giới.
              </p>
            </div>
            <Link
              to="/browse"
              className="relative px-10 py-5 bg-primary text-on-primary rounded-2xl font-bold text-base hover:scale-105 transition-transform active:scale-95 shadow-xl shadow-primary/30 whitespace-nowrap no-underline"
            >
              Duyệt tất cả sách
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default CategoriesPage;
