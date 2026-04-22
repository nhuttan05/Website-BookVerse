package com.bookverse.repository;

import com.bookverse.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    Optional<Book> findBySlug(String slug);
    
    List<Book> findByIsBestsellerTrue();
    List<Book> findByIsNewArrivalTrue();
    List<Book> findByIsFeaturedTrue();
    
    Page<Book> findByCategory_Slug(String categorySlug, Pageable pageable);
    
    @Query("SELECT b FROM Book b WHERE LOWER(b.title) LIKE LOWER(concat('%', :query, '%')) OR LOWER(b.author) LIKE LOWER(concat('%', :query, '%'))")
    Page<Book> searchBooks(String query, Pageable pageable);
}
