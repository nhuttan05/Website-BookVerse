package com.bookverse.service;

import com.bookverse.dto.BookDTO;
import com.bookverse.entity.Book;
import com.bookverse.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;

    public List<BookDTO> getBestsellers() {
        return bookRepository.findByIsBestsellerTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<BookDTO> getNewArrivals() {
        return bookRepository.findByIsNewArrivalTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<BookDTO> getFeaturedBooks() {
        return bookRepository.findByIsFeaturedTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public BookDTO getBookBySlug(String slug) {
        return bookRepository.findBySlug(slug)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Book not found"));
    }

    public Page<BookDTO> searchBooks(String query, Pageable pageable) {
        return bookRepository.searchBooks(query, pageable)
                .map(this::convertToDTO);
    }

    public Page<BookDTO> getBooksByCategory(String categorySlug, Pageable pageable) {
        return bookRepository.findByCategory_Slug(categorySlug, pageable)
                .map(this::convertToDTO);
    }

    public Page<BookDTO> getAllBooks(Pageable pageable) {
        return bookRepository.findAll(pageable)
                .map(this::convertToDTO);
    }

    private BookDTO convertToDTO(Book book) {
        return BookDTO.builder()
                .id(book.getId())
                .title(book.getTitle())
                .slug(book.getSlug())
                .description(book.getDescription())
                .price(book.getPrice())
                .originalPrice(book.getOriginalPrice())
                .discountPercent(book.getDiscountPercent())
                .coverImageUrl(book.getCoverImageUrl())
                .categoryName(book.getCategory() != null ? book.getCategory().getName() : null)
                .categorySlug(book.getCategory() != null ? book.getCategory().getSlug() : null)
                .author(book.getAuthor())
                .rating(book.getRating())
                .reviewCount(book.getReviewCount())
                .isEditorChoice(book.getIsEditorChoice())
                .isFeatured(book.getIsFeatured())
                .isBestseller(book.getIsBestseller())
                .isNewArrival(book.getIsNewArrival())
                .isbn(book.getIsbn())
                .publisher(book.getPublisher())
                .pageCount(book.getPageCount())
                .publishedDate(book.getPublishedDate())
                .language(book.getLanguage())
                .build();
    }
}
