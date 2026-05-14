package com.bookverse.service;

import com.bookverse.dto.BookDTO;
import com.bookverse.entity.Book;
import com.bookverse.repository.BookRepository;
import com.bookverse.repository.CategoryRepository;
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
    private final CategoryRepository categoryRepository;

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

    public Page<BookDTO> searchBooks(String q, List<String> categories, List<String> suppliers, List<String> languages, List<String> ageRanges, Double minPrice, Double maxPrice, Double minRating, Pageable pageable) {
        // Log để debug trên server
        System.out.println("Search API called with - q: [" + q + "], categories: " + categories + 
                           ", suppliers: " + suppliers + ", languages: " + languages + ", ageRanges: " + ageRanges +
                           ", minPrice: " + minPrice + ", maxPrice: " + maxPrice + ", minRating: " + minRating);

        String queryParam = (q == null || q.trim().isEmpty()) ? null : q;
        List<String> categoriesParam = (categories == null || categories.isEmpty()) ? null : categories;
        List<String> suppliersParam = (suppliers == null || suppliers.isEmpty()) ? null : suppliers;
        List<String> languagesParam = (languages == null || languages.isEmpty()) ? null : languages;
        List<String> ageRangesParam = (ageRanges == null || ageRanges.isEmpty()) ? null : ageRanges;
        
        return bookRepository.searchBooksAdvanced(queryParam, categoriesParam, suppliersParam, languagesParam, ageRangesParam, minPrice, maxPrice, minRating, pageable)
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

    public BookDTO createBook(BookDTO bookDTO) {
        Book book = convertToEntity(bookDTO);
        // Tự động tạo slug nếu chưa có
        if (book.getSlug() == null || book.getSlug().isEmpty()) {
            book.setSlug(generateSlug(book.getTitle()));
        }
        Book savedBook = bookRepository.save(book);
        return convertToDTO(savedBook);
    }

    public BookDTO updateBook(Long id, BookDTO bookDTO) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));
        
        updateBookFromDTO(book, bookDTO);
        Book updatedBook = bookRepository.save(book);
        return convertToDTO(updatedBook);
    }

    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

    private void updateBookFromDTO(Book book, BookDTO dto) {
        book.setTitle(dto.getTitle());
        book.setDescription(dto.getDescription());
        book.setPrice(dto.getPrice());
        book.setOriginalPrice(dto.getOriginalPrice());
        book.setDiscountPercent(dto.getDiscountPercent());
        book.setCoverImageUrl(dto.getCoverImageUrl());
        book.setAuthor(dto.getAuthor());
        book.setIsFeatured(dto.getIsFeatured());
        book.setIsBestseller(dto.getIsBestseller());
        book.setIsNewArrival(dto.getIsNewArrival());
        book.setIsbn(dto.getIsbn());
        book.setPublisher(dto.getPublisher());
        book.setPageCount(dto.getPageCount());
        book.setPublishedDate(dto.getPublishedDate());
        book.setLanguage(dto.getLanguage());
        book.setSupplier(dto.getSupplier());
        book.setAgeRange(dto.getAgeRange());
        book.setPreviewUrl(dto.getPreviewUrl());
        book.setPreviewType(dto.getPreviewType());

        if (dto.getCategorySlug() != null) {
            categoryRepository.findBySlug(dto.getCategorySlug())
                    .ifPresent(book::setCategory);
        }
    }

    private Book convertToEntity(BookDTO dto) {
        Book book = Book.builder()
                .title(dto.getTitle())
                .slug(dto.getSlug())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .originalPrice(dto.getOriginalPrice())
                .discountPercent(dto.getDiscountPercent())
                .coverImageUrl(dto.getCoverImageUrl())
                .author(dto.getAuthor())
                .isFeatured(dto.getIsFeatured() != null ? dto.getIsFeatured() : false)
                .isBestseller(dto.getIsBestseller() != null ? dto.getIsBestseller() : false)
                .isNewArrival(dto.getIsNewArrival() != null ? dto.getIsNewArrival() : false)
                .isbn(dto.getIsbn())
                .publisher(dto.getPublisher())
                .pageCount(dto.getPageCount())
                .publishedDate(dto.getPublishedDate())
                .language(dto.getLanguage())
                .supplier(dto.getSupplier())
                .ageRange(dto.getAgeRange())
                .previewUrl(dto.getPreviewUrl())
                .previewType(dto.getPreviewType())
                .rating(0.0)
                .reviewCount(0)
                .build();

        if (dto.getCategorySlug() != null) {
            categoryRepository.findBySlug(dto.getCategorySlug())
                    .ifPresent(book::setCategory);
        }
        
        return book;
    }

    private String generateSlug(String title) {
        return title.toLowerCase()
                .replaceAll("[^a-z0-9\\s]", "")
                .replaceAll("\\s+", "-");
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
                .supplier(book.getSupplier())
                .ageRange(book.getAgeRange())
                .previewUrl(book.getPreviewUrl())
                .previewType(book.getPreviewType())
                .images(book.getImages() != null ? 
                        book.getImages().stream().map(com.bookverse.entity.BookImage::getImageUrl).collect(Collectors.toList()) : 
                        null)
                .build();
    }
}
