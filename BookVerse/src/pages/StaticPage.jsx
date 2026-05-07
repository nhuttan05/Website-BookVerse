import React from 'react';
import { useLocation } from 'react-router-dom';

const StaticPage = () => {
  const { pathname } = useLocation();
  
  // Ánh xạ URL sang Tiêu đề trang
  const routeTitles = {
    '/privacy-policy': 'Privacy Policy (Chính sách bảo mật)',
    '/terms-of-service': 'Terms of Service (Điều khoản dịch vụ)',
    '/shipping-returns': 'Shipping & Returns (Giao hàng & Hoàn trả)',
    '/faqs': 'FAQs (Câu hỏi thường gặp)',
    '/about': 'Về BookVerse (About Us)',
    '/contact': 'Liên hệ (Contact)'
  };

  const title = routeTitles[pathname] || 'Trang thông tin';

  return (
    <div className="bg-surface min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-8">{title}</h1>
        
        <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-outline-variant/20 prose prose-lg prose-headings:text-on-surface prose-p:text-on-surface-variant max-w-none">
          <p>
            Chào mừng bạn đến với <strong>{title}</strong>. Nội dung của trang này hiện đang được đội ngũ biên tập của BookVerse soạn thảo và sẽ sớm được cập nhật.
          </p>
          <p>
            BookVerse cam kết mang đến trải nghiệm minh bạch, an toàn và chuyên nghiệp nhất cho mọi độc giả. Nếu bạn có bất kỳ thắc mắc nào trong thời gian này, vui lòng liên hệ trực tiếp với bộ phận chăm sóc khách hàng của chúng tôi qua địa chỉ email <strong>support@bookverse.vn</strong>.
          </p>
          <h2>Tại sao chọn BookVerse?</h2>
          <ul>
            <li>Hệ sinh thái tri thức đa dạng với hàng ngàn đầu sách cập nhật mỗi ngày.</li>
            <li>Trải nghiệm mua sắm mượt mà, gợi ý thông minh từ AI.</li>
            <li>Đội ngũ hỗ trợ tận tâm, giao hàng nhanh chóng.</li>
          </ul>
          <p>
            Cảm ơn bạn đã luôn đồng hành cùng BookVerse!
          </p>
        </div>
      </div>
    </div>
  );
};

export default StaticPage;
