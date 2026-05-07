import { useParams, useNavigate } from 'react-router-dom';

const BlogPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="bg-surface min-h-screen pb-24">
      {/* Hero Banner */}
      <div className="w-full h-[50vh] relative">
        <img 
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=2000" 
          alt="Blog Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-8 max-w-4xl mx-auto">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-bold text-primary bg-surface/80 backdrop-blur-md px-4 py-2 rounded-full mb-6 hover:bg-surface transition-colors w-fit">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Trở lại
          </button>
          <div className="flex items-center gap-2 text-sm font-bold text-primary tracking-widest uppercase mb-4 bg-surface/80 backdrop-blur-md px-3 py-1 rounded-full w-fit">
            <span>Sự kiện</span>
            <span>•</span>
            <span>5 phút đọc</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-on-surface leading-[1.1]">
            Tại sao việc đọc sách giấy vẫn chưa bao giờ lỗi thời?
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 mt-12">
        <div className="flex items-center gap-4 mb-12 border-b border-outline-variant/20 pb-8">
          <img src="https://i.pravatar.cc/150?img=32" alt="Author" className="w-12 h-12 rounded-full object-cover" />
          <div>
            <h4 className="font-bold text-on-surface">Minh Tuấn</h4>
            <p className="text-sm text-on-surface-variant">Biên tập viên BookVerse • 12 tháng 5, 2026</p>
          </div>
        </div>

        <div className="prose prose-lg prose-headings:text-on-surface prose-p:text-on-surface-variant max-w-none">
          <p className="text-xl font-medium leading-relaxed text-on-surface mb-8">
            Trong thời đại mà màn hình điện tử thống trị mọi ngóc ngách của cuộc sống, việc cầm trên tay một cuốn sách giấy dường như mang lại một cảm giác bình yên đến lạ kỳ.
          </p>

          <p>
            Bạn có nhớ lần cuối cùng bạn thực sự đắm chìm vào một cuốn sách mà không bị làm phiền bởi những thông báo tin nhắn, email hay mạng xã hội? Sách giấy mang lại một trải nghiệm mà các thiết bị đọc sách điện tử (E-readers) khó lòng sao chép được: cảm giác lật từng trang giấy, mùi hương đặc trưng của giấy mới, và sự thỏa mãn khi nhìn thấy dấu trang (bookmark) di chuyển dần về phía cuối cuốn sách.
          </p>

          <h2>Sự tập trung tuyệt đối</h2>
          <p>
            Nhiều nghiên cứu đã chỉ ra rằng, việc đọc trên màn hình điện tử làm giảm khả năng tập trung và ghi nhớ thông tin. Ánh sáng xanh từ màn hình khiến mắt nhanh mỏi, và sự cám dỗ từ các tab trình duyệt khác luôn rình rập. Ngược lại, một cuốn sách giấy là một thế giới đóng. Nó chỉ có bạn và câu chuyện.
          </p>

          <blockquote className="border-l-4 border-primary pl-6 italic text-on-surface-variant my-8">
            "Sách là một thiết bị kỳ diệu mà bạn có thể mang theo bất cứ đâu, mở ra bất cứ lúc nào, và nó không bao giờ hết pin."
          </blockquote>

          <h2>Một món đồ sưu tầm vô giá</h2>
          <p>
            Mỗi cuốn sách trên kệ không chỉ là một kho tàng tri thức, mà còn là một kỷ niệm. Vết gấp ở góc trang, dòng chữ ghi chú viết tay bên lề, hay một bông hoa khô kẹp giữa những trang sách... Tất cả tạo nên một phiên bản độc nhất vô nhị mà chỉ có bạn mới sở hữu.
          </p>

          <div className="w-full aspect-[2/1] rounded-3xl overflow-hidden my-12 shadow-2xl">
            <img src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2000" alt="Books on shelf" className="w-full h-full object-cover" />
          </div>

          <p>
            Tại BookVerse, chúng tôi tin rằng cả sách giấy và sách điện tử đều có chỗ đứng riêng của mình. Nhưng để trải nghiệm sự sâu lắng và chậm rãi, sách giấy vẫn mãi là một biểu tượng không thể thay thế.
          </p>
        </div>

        {/* Share & Tags */}
        <div className="mt-16 pt-8 border-t border-outline-variant/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex gap-2">
            {['Sách Giấy', 'Văn Hóa Đọc', 'BookVerse'].map(tag => (
              <span key={tag} className="px-4 py-2 bg-surface-container-low text-on-surface-variant rounded-xl text-sm font-bold hover:bg-surface-container cursor-pointer transition-colors">
                #{tag}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="font-bold text-sm text-on-surface-variant">Chia sẻ bài viết:</span>
            <button className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">f</button>
            <button className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">in</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
