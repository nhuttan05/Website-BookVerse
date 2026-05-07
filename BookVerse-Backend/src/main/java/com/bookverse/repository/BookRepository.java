package com.bookverse.repository;

import com.bookverse.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
    
    @Query("SELECT b FROM Book b LEFT JOIN b.category c WHERE " +
           "(:q IS NULL OR LOWER(b.title) LIKE LOWER(concat('%', :q, '%')) OR LOWER(b.author) LIKE LOWER(concat('%', :q, '%'))) AND " +
           "(:categories IS NULL OR c.slug IN :categories) AND " +
           "(:minPrice IS NULL OR b.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR b.price <= :maxPrice) AND " +
           "(:minRating IS NULL OR b.rating >= :minRating)")
    Page<Book> searchBooksAdvanced(
            @Param("q") String q,
            @Param("categories") List<String> categories,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("minRating") Double minRating,
            Pageable pageable);
}
