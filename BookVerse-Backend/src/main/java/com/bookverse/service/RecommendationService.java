package com.bookverse.service;

import com.bookverse.dto.BookDTO;
import com.bookverse.entity.Book;
import com.bookverse.entity.Category;
import com.bookverse.entity.User;
import com.bookverse.repository.BookRepository;
import com.bookverse.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final BookRepository bookRepository;
    private final OrderRepository orderRepository;
    private final BookService bookService; // Re-use conversion logic

    /**
     * Gợi ý sách tương tự dựa trên Category và Author
     */
    public List<BookDTO> getSimilarBooks(String slug, int limit) {
        Book currentBook = bookRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        Category category = currentBook.getCategory();
        String author = currentBook.getAuthor();

        // Tìm sách cùng chuyên mục hoặc cùng tác giả, loại trừ sách hiện tại
        List<Book> similar = bookRepository.findAll().stream()
                .filter(b -> !b.getSlug().equals(slug))
                .filter(b -> (b.getCategory() != null && b.getCategory().equals(category)) || b.getAuthor().equals(author))
                .limit(limit)
                .collect(Collectors.toList());

        return similar.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Gợi ý cá nhân hóa dựa trên lịch sử mua hàng (Mock AI logic)
     */
    public List<BookDTO> getPersonalizedRecommendations(User user, int limit) {
        if (user == null) {
            // Nếu khách vãng lai, gợi ý sách Bestseller hoặc Featured
            return bookService.getFeaturedBooks().stream().limit(limit).collect(Collectors.toList());
        }

        // Lấy danh sách các category người dùng đã mua
        List<Category> purchasedCategories = orderRepository.findByUserOrderByOrderDateDesc(user).stream()
                .flatMap(order -> order.getItems().stream())
                .map(item -> item.getBook().getCategory())
                .distinct()
                .collect(Collectors.toList());

        if (purchasedCategories.isEmpty()) {
            return bookService.getBestsellers().stream().limit(limit).collect(Collectors.toList());
        }

        // Gợi ý sách thuộc các category này mà người dùng chưa mua
        List<Book> recommended = bookRepository.findAll().stream()
                .filter(b -> purchasedCategories.contains(b.getCategory()))
                .limit(limit)
                .collect(Collectors.toList());

        Collections.shuffle(recommended); // Giả lập AI lựa chọn ngẫu nhiên trong tập hợp phù hợp

        return recommended.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private BookDTO convertToDTO(Book book) {
        // Simple mapping (re-implementing to avoid circular dependency if BookService is injected incorrectly)
        return BookDTO.builder()
                .id(book.getId())
                .title(book.getTitle())
                .slug(book.getSlug())
                .price(book.getPrice())
                .coverImageUrl(book.getCoverImageUrl())
                .author(book.getAuthor())
                .rating(book.getRating())
                .categoryName(book.getCategory() != null ? book.getCategory().getName() : null)
                .isEditorChoice(book.getIsEditorChoice())
                .build();
    }
}
