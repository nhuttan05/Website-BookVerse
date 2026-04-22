package com.bookverse.repository;

import com.bookverse.entity.Book;
import com.bookverse.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByBookOrderByCreatedAtDesc(Book book);
}
