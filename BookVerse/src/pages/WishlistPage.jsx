// =====================================================
//  PAGE — WishlistPage.jsx
//  Danh sách yêu thích (Stitch-aligned)
//  Aether Verse: Grid layout, empty states, quick actions
// =====================================================

import { useSelector } from 'react-redux';
import { selectWishlistItems } from '@/redux/wishlistSlice';
import BookCard from '@/components/BookCard';
import { Link } from 'react-router-dom';

const WishlistPage = () => {
  const wishlistItems = useSelector(selectWishlistItems);

  return (
    <div className="bg-surface min-h-screen pb-20">
      
      {/* Header */}
      <section className="py-20 text-center">
        <div className="max-w-3xl mx-auto px-6 space-y-4">
          <span className="text-xs font-black text-primary uppercase tracking-[0.3em]">Cá nhân hóa</span>
          <h1 className="text-5xl font-black tracking-tight text-on-surface">Bộ sưu tập yêu thích</h1>
          <p className="text-on-surface-variant font-medium">Lưu giữ những cuốn sách bạn muốn khám phá trong tương lai.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6">
        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlistItems.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center space-y-6 bg-surface-container-low rounded-[3rem] border border-dashed border-outline-variant/30">
            <div className="w-24 h-24 bg-surface-container-high rounded-full flex items-center justify-center mx-auto text-outline-variant">
              <span className="material-symbols-outlined text-5xl">heart_broken</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-on-surface">Chưa có cuốn sách nào</h3>
              <p className="text-on-surface-variant max-w-sm mx-auto">Hãy dạo quanh Archive và nhấn biểu tượng trái tim để lưu lại những tác phẩm bạn yêu thích.</p>
            </div>
            <Link 
              to="/browse" 
              className="inline-flex px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.05] transition-transform active:scale-95"
            >
              Khám phá ngay
            </Link>
          </div>
        )}
      </section>

      {/* Recommendations for empty state */}
      {wishlistItems.length === 0 && (
        <section className="max-w-7xl mx-auto px-6 mt-32">
          <h2 className="text-2xl font-black text-on-surface mb-10">Đề xuất cho bạn</h2>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Hiển thị một vài sách gợi ý ở đây nếu cần */}
          </div>
        </section>
      )}
    </div>
  );
};

export default WishlistPage;
