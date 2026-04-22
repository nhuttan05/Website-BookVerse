package com.bookverse.config;

import com.bookverse.entity.Book;
import com.bookverse.entity.Category;
import com.bookverse.entity.Role;
import com.bookverse.repository.BookRepository;
import com.bookverse.repository.CategoryRepository;
import com.bookverse.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final CategoryRepository categoryRepository;
    private final BookRepository bookRepository;

    @Override
    public void run(String... args) throws Exception {
        // Initialize Roles
        initRole("ROLE_USER");
        initRole("ROLE_ADMIN");

        // Initialize Categories
        Category fiction = initCategory("Văn học & Tiểu thuyết", "van-hoc-tieu-thuyet");
        Category business = initCategory("Kinh tế & Kinh doanh", "kinh-te-kinh-doanh");
        Category psychology = initCategory("Tâm lý & Kỹ năng", "tam-ly-ky-nang");
        Category art = initCategory("Nghệ thuật & Thiết kế", "nghe-thuat-thiet-ke");
        Category history = initCategory("Lịch sử & Chính trị", "lich-su-chinh-tri");
        Category science = initCategory("Khoa học & Công nghệ", "khoa-hoc-cong-nghe");

        // Initialize / Update Books
        createOrUpdateBook(
                "Đắc Nhân Tâm",
                "dac-nhan-tam",
                "Cuốn sách nổi tiếng nhất thế giới về nghệ thuật giao tiếp.",
                "85000",
                "100000",
                15,
                "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
                psychology,
                "Dale Carnegie",
                4.8,
                1250,
                true,
                true,
                false,
                100,
                "9786045880531",
                "NXB Tổng hợp TP.HCM",
                320,
                LocalDate.of(2021, 1, 1)
        );

        createOrUpdateBook(
                "Nhà Giả Kim",
                "nha-gia-kim",
                "Một trong những cuốn sách bán chạy nhất mọi thời đại.",
                "69000",
                null,
                0,
                "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800",
                fiction,
                "Paulo Coelho",
                4.7,
                850,
                false,
                false,
                true,
                50,
                "9786045643440",
                "NXB Hội Nhà Văn",
                228,
                LocalDate.of(2020, 5, 10)
        );

        createOrUpdateBook(
                "Sapiens: Lược Sử Loài Người",
                "sapiens-luoc-su-loai-nguoi",
                "Cuốn sách khám phá lịch sử loài người từ thời đồ đá đến thế kỷ 21.",
                "125000",
                null,
                0,
                "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800",
                history,
                "Yuval Noah Harari",
                4.9,
                2500,
                false,
                false,
                false,
                30,
                "9786045880532",
                "NXB Tri Thức",
                560,
                LocalDate.of(2019, 8, 15)
        );

        createOrUpdateBook(
                "Think Again: Tư Duy Lại",
                "think-again-tu-duy-lai",
                "Nghệ thuật của việc không biết và sức mạnh của việc đặt câu hỏi.",
                "95000",
                null,
                0,
                "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800",
                psychology,
                "Adam Grant",
                4.6,
                450,
                true,
                false,
                false,
                20,
                "9786045880533",
                "NXB Trẻ",
                400,
                LocalDate.of(2022, 2, 20)
        );
    }

    private void initRole(String name) {
        if (roleRepository.findByName(name).isEmpty()) {
            roleRepository.save(Role.builder().name(name).build());
        }
    }

    private Category initCategory(String name, String slug) {
        return categoryRepository.findBySlug(slug)
                .orElseGet(() -> categoryRepository.save(Category.builder().name(name).slug(slug).build()));
    }

    private void createOrUpdateBook(
            String title, String slug, String description, String price, String originalPrice,
            int discountPercent, String imageUrl, Category category, String author,
            double rating, int reviewCount, boolean isEditorChoice, boolean isBestseller,
            boolean isNewArrival, int stock, String isbn, String publisher, int pages, LocalDate pubDate
    ) {
        Book book = bookRepository.findBySlug(slug).orElse(new Book());
        
        book.setTitle(title);
        book.setSlug(slug);
        book.setDescription(description);
        book.setPrice(new BigDecimal(price));
        book.setOriginalPrice(originalPrice != null ? new BigDecimal(originalPrice) : null);
        book.setDiscountPercent(discountPercent);
        book.setCoverImageUrl(imageUrl);
        book.setCategory(category);
        book.setAuthor(author);
        book.setRating(rating);
        book.setReviewCount(reviewCount);
        book.setIsEditorChoice(isEditorChoice);
        book.setIsBestseller(isBestseller);
        book.setIsNewArrival(isNewArrival);
        book.setStockQuantity(stock);
        book.setIsbn(isbn);
        book.setPublisher(publisher);
        book.setPageCount(pages);
        book.setPublishedDate(pubDate);
        book.setLanguage("Tiếng Việt");

        bookRepository.save(book);
    }
}
