package com.bookverse.service;

import com.bookverse.entity.Book;
import com.bookverse.entity.Review;
import com.bookverse.entity.User;
import com.bookverse.repository.BookRepository;
import com.bookverse.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookRepository bookRepository;

    public List<Review> getReviewsByBook(String slug) {
        Book book = bookRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Book not found"));
        return reviewRepository.findByBookOrderByCreatedAtDesc(book);
    }

    @Transactional
    public Review addReview(User user, Long bookId, Integer rating, String comment) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        Review review = Review.builder()
                .user(user)
                .book(book)
                .rating(rating)
                .comment(comment)
                .build();

        Review savedReview = reviewRepository.save(review);

        // Update book rating
        updateBookRating(book);

        return savedReview;
    }

    private void updateBookRating(Book book) {
        List<Review> reviews = reviewRepository.findByBookOrderByCreatedAtDesc(book);
        double average = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
        
        book.setRating(average);
        book.setReviewCount(reviews.size());
        bookRepository.save(book);
    }
}
