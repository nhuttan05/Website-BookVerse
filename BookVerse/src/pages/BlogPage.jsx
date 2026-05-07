// =====================================================
//  PAGE — BlogPage.jsx
//  Stitch Design: Editorial Blog
// =====================================================
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BlogPage = () => {
  const navigate = useNavigate();
  const featuredPost = {
    category: 'VĂN HÓA ĐỌC',
    title: 'Tại sao việc đọc sách giấy vẫn chưa bao giờ lỗi thời trong thời đại số?',
    description: 'Dù cho máy đọc sách hay sách nói có phát triển đến đâu, trải nghiệm lật từng trang giấy, ngửi mùi mực in vẫn mang lại một cảm giác không thể thay thế.',
    author: 'Minh Tuấn',
    date: '10 Tháng 5, 2024',
    readTime: '5 phút đọc',
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=1200'
  };

  const standardPosts = [
    {
      category: 'TÀI CHÍNH',
      title: 'Top 10 cuốn sách thay đổi tư duy tài chính của bạn',
      description: 'Những kiến thức cơ bản đến nâng cao về quản lý tài chính cá nhân mà bạn không nên bỏ lỡ nếu muốn tự do tài chính tuổi 30.',
      author: 'Ngọc Lan',
      date: '8 Tháng 5, 2024',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800'
    },
    {
      category: 'REVIEW',
      title: 'Review: Khi Hơi Thở Hóa Thinh Không - Paul Kalanithi',
      description: 'Một cuốn hồi ký đầy xúc động về cuộc đời, cái chết và ý nghĩa của việc được sống thực thụ từ góc nhìn của một bác sĩ mắc bệnh hiểm nghèo.',
      author: 'Phương Uyên',
      date: '5 Tháng 5, 2024',
      image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=800'
    },
    {
      category: 'KỸ NĂNG',
      title: 'Làm thế nào để đọc 100 cuốn sách mỗi năm mà vẫn nhớ được nội dung?',
      description: 'Đừng chỉ chạy theo số lượng. Bài viết này sẽ hướng dẫn bạn các kỹ thuật ghi nhớ và hệ thống hóa kiến thức sau khi đọc.',
      author: 'Thanh Bình',
      date: '1 Tháng 5, 2024',
      image: 'https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?auto=format&fit=crop&q=80&w=800'
    },
    {
      category: 'TÁC GIẢ',
      title: 'Hành trình sáng tác của Haruki Murakami - Sự kết hợp giữa mộng tưởng và hiện thực',
      description: 'Cùng phân tích những chủ đề lặp đi lặp lại trong các tác phẩm nổi tiếng của nhà văn Nhật Bản Haruki Murakami.',
      author: 'Mai Phương',
      date: '28 Tháng 4, 2024',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800'
    }
  ];

  return (
    <div className="bg-surface min-h-screen">
      {/* Blog Header */}
      <div className="py-20 border-b border-outline-variant/10 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent z-0"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-on-surface mb-6">Nhật Ký <span className="text-primary">BookVerse</span></h1>
          <p className="text-xl text-on-surface-variant leading-relaxed">
            Nơi chia sẻ góc nhìn sâu sắc về những cuốn sách hay, kỹ năng đọc hiệu quả và những câu chuyện truyền cảm hứng từ cộng đồng yêu sách.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Featured Post */}
        <div className="mb-20">
          <h2 className="text-2xl font-black uppercase tracking-widest text-outline mb-8">Tiêu Điểm</h2>
          <article onClick={() => navigate('/blog/1')} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center group cursor-pointer">
            <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl relative">
              <img 
                src={featuredPost.image} 
                alt={featuredPost.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
            </div>
            <div className="space-y-6 lg:pl-8">
              <div className="flex items-center gap-3 text-xs font-black text-primary uppercase tracking-widest">
                <span>{featuredPost.category}</span>
                <span className="text-outline-variant">•</span>
                <span>{featuredPost.readTime}</span>
              </div>
              <h3 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] group-hover:text-primary transition-colors">
                {featuredPost.title}
              </h3>
              <p className="text-lg text-on-surface-variant leading-relaxed">
                {featuredPost.description}
              </p>
              <div className="pt-6 border-t border-outline-variant/20 flex items-center justify-between">
                <div>
                  <p className="font-bold text-on-surface">{featuredPost.author}</p>
                  <p className="text-sm text-outline-variant font-medium">{featuredPost.date}</p>
                </div>
                <button className="w-12 h-12 rounded-full border-2 border-primary/20 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          </article>
        </div>

        {/* Latest Posts */}
        <div>
          <h2 className="text-2xl font-black uppercase tracking-widest text-outline mb-8">Bài Viết Mới</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {standardPosts.map((post, index) => (
              <article key={index} onClick={() => navigate(`/blog/${index + 2}`)} className="group cursor-pointer flex flex-col gap-6">
                <div className="aspect-[16/9] rounded-3xl overflow-hidden shadow-lg relative">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-primary shadow-sm">
                    {post.category}
                  </div>
                </div>
                <div className="space-y-3 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-on-surface-variant line-clamp-2">
                    {post.description}
                  </p>
                  <div className="mt-auto pt-6 flex items-center gap-3 text-sm text-outline-variant font-medium">
                    <span className="text-on-surface font-bold">{post.author}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-20 text-center">
          <button className="px-10 py-4 border-2 border-outline/20 rounded-2xl font-bold text-on-surface hover:border-primary hover:text-primary transition-all active:scale-95">
            Xem thêm bài viết
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
