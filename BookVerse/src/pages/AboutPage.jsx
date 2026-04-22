// =====================================================
//  PAGE — AboutPage.jsx
//  Trang giới thiệu (Stitch-aligned)
//  Aether Verse: Story-telling layout, premium typography
// =====================================================

const AboutPage = () => {
  return (
    <div className="bg-surface min-h-screen">
      {/* Hero Story */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-10"></div>
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <span className="text-xs font-black text-primary uppercase tracking-[0.3em]">Câu chuyện của chúng tôi</span>
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-on-surface leading-tight">
            Nơi tri thức <br/>
            <span className="text-primary-container italic font-serif">được trân trọng.</span>
          </h1>
          <p className="text-xl text-on-surface-variant leading-relaxed font-light">
            BookVerse không chỉ là một cửa hàng sách trực tuyến. Chúng tôi là một cộng đồng dành cho những người tin rằng mỗi cuốn sách là một vũ trụ riêng biệt đang chờ được khám phá.
          </p>
        </div>
      </section>

      {/* Values Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-6 p-10 bg-surface-container-low rounded-[3rem] border border-outline-variant/10">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-3xl">verified</span>
            </div>
            <h3 className="text-2xl font-bold">Chất lượng tuyển chọn</h3>
            <p className="text-on-surface-variant leading-relaxed">Mọi cuốn sách trên BookVerse đều qua tay các biên tập viên để đảm bảo giá trị nội dung tốt nhất cho độc giả.</p>
          </div>
          <div className="space-y-6 p-10 bg-surface-container-low rounded-[3rem] border border-outline-variant/10">
            <div className="w-16 h-16 bg-tertiary/10 rounded-2xl flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-3xl">eco</span>
            </div>
            <h3 className="text-2xl font-bold">Trách nhiệm xã hội</h3>
            <p className="text-on-surface-variant leading-relaxed">Chúng tôi cam kết sử dụng bao bì thân thiện với môi trường và trích một phần lợi nhuận cho các quỹ khuyến học.</p>
          </div>
          <div className="space-y-6 p-10 bg-surface-container-low rounded-[3rem] border border-outline-variant/10">
            <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-3xl">auto_awesome</span>
            </div>
            <h3 className="text-2xl font-bold">Trải nghiệm cá nhân</h3>
            <p className="text-on-surface-variant leading-relaxed">Hệ thống AI của chúng tôi học hỏi từ sở thích của bạn để đưa ra những gợi ý thực sự chạm đến trái tim.</p>
          </div>
        </div>
      </section>

      {/* Team/Mission Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-outline-variant/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="aspect-square rounded-[4rem] overflow-hidden shadow-float">
            <img 
              className="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=1200" 
              alt="Library" 
            />
          </div>
          <div className="space-y-10">
            <h2 className="text-4xl font-black tracking-tight">Sứ mệnh của chúng tôi là kết nối con người thông qua những trang sách.</h2>
            <div className="space-y-6 text-on-surface-variant leading-loose">
              <p>Thành lập từ năm 2021, BookVerse bắt đầu từ một nhóm nhỏ những người yêu sách tại Hà Nội. Chúng tôi nhận thấy rằng trong thế giới số vội vã, việc dành thời gian bên một cuốn sách thực thụ đang trở nên quý giá hơn bao giờ hết.</p>
              <p>Mục tiêu của chúng tôi là xây dựng một nền tảng mua sắm hiện đại nhưng vẫn giữ được cái "hồn" của những hiệu sách truyền thống - nơi bạn có thể tình cờ tìm thấy một báu vật tri thức thay đổi cả cuộc đời mình.</p>
            </div>
            <div className="flex gap-12 pt-4">
              <div>
                <p className="text-4xl font-black text-primary">500k+</p>
                <p className="text-xs font-bold text-outline uppercase tracking-widest mt-1">Độc giả tin dùng</p>
              </div>
              <div>
                <p className="text-4xl font-black text-primary">20k+</p>
                <p className="text-xs font-bold text-outline uppercase tracking-widest mt-1">Đầu sách tuyển chọn</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
