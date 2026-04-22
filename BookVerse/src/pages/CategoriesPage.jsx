// =====================================================
//  PAGE — CategoriesPage.jsx
//  Danh mục sách (Stitch-aligned)
//  Aether Verse: Visual grid, category cards
// =====================================================

import { Link } from 'react-router-dom';
import { BOOK_CATEGORIES } from '@/data/constants';

const CategoriesPage = () => {
  return (
    <div className="bg-surface min-h-screen pb-20">
      
      {/* Header */}
      <section className="py-24 bg-primary/5">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
          <h1 className="text-6xl font-black tracking-tight text-on-surface">Khám phá vũ trụ <br/> <span className="text-primary">tri thức</span></h1>
          <p className="text-xl text-on-surface-variant font-medium max-w-2xl mx-auto">Duyệt qua các danh mục được tuyển chọn kỹ lưỡng để tìm thấy nguồn cảm hứng tiếp theo của bạn.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 -mt-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {BOOK_CATEGORIES.map((cat, idx) => (
            <Link 
              key={cat.id}
              to={`/browse?category=${cat.slug}`}
              className="group bg-white p-10 rounded-[3rem] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all border border-outline-variant/10 text-center space-y-4"
            >
              <div className="w-20 h-20 bg-surface-container rounded-3xl flex items-center justify-center mx-auto group-hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined text-4xl text-primary">{['auto_stories', 'history_edu', 'psychology', 'menu_book', 'science', 'palette', 'business_center', 'public'][idx % 8]}</span>
              </div>
              <h3 className="text-xl font-bold text-on-surface">{cat.name}</h3>
              <p className="text-sm text-outline-variant">Khám phá hàng ngàn tựa sách hấp dẫn trong lĩnh vực này.</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Authors/Publishers */}
      <section className="max-w-7xl mx-auto px-6 mt-32">
        <div className="p-16 bg-on-surface text-white rounded-[4rem] flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-4 max-w-lg">
            <h2 className="text-4xl font-black tracking-tight">Tìm kiếm theo tác giả yêu thích?</h2>
            <p className="text-white/60 text-lg">Chúng tôi lưu trữ tác phẩm của hơn 5.000 tác giả nổi tiếng từ khắp nơi trên thế giới.</p>
          </div>
          <Link 
            to="/browse"
            className="px-10 py-5 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-container transition-colors"
          >
            Duyệt danh sách tác giả
          </Link>
        </div>
      </section>
    </div>
  );
};

export default CategoriesPage;
