package com.bookverse.controller;

import com.bookverse.dto.BookDTO;
import com.bookverse.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping
    public ResponseEntity<Page<BookDTO>> getAllBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(bookService.getAllBooks(pageable));
    }

    @GetMapping("/bestsellers")
    public ResponseEntity<List<BookDTO>> getBestsellers() {
        return ResponseEntity.ok(bookService.getBestsellers());
    }

    @GetMapping("/new-arrivals")
    public ResponseEntity<List<BookDTO>> getNewArrivals() {
        return ResponseEntity.ok(bookService.getNewArrivals());
    }

    @GetMapping("/featured")
    public ResponseEntity<List<BookDTO>> getFeaturedBooks() {
        return ResponseEntity.ok(bookService.getFeaturedBooks());
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<BookDTO> getBookBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(bookService.getBookBySlug(slug));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<BookDTO>> searchBooks(
            @RequestParam(required = false, name = "q") String q,
            @RequestParam(required = false) List<String> categories,
            @RequestParam(required = false) List<String> suppliers,
            @RequestParam(required = false) List<String> languages,
            @RequestParam(required = false) List<String> ageRanges,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Double minRating,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(bookService.searchBooks(q, categories, suppliers, languages, ageRanges, minPrice, maxPrice, minRating, pageable));
    }

    @GetMapping("/category/{slug}")
    public ResponseEntity<Page<BookDTO>> getBooksByCategory(
            @PathVariable String slug,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(bookService.getBooksByCategory(slug, pageable));
    }
}
