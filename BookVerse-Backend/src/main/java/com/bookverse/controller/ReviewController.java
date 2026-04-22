package com.bookverse.controller;

import com.bookverse.entity.Review;
import com.bookverse.entity.User;
import com.bookverse.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/book/{slug}")
    public ResponseEntity<List<Review>> getBookReviews(@PathVariable String slug) {
        return ResponseEntity.ok(reviewService.getReviewsByBook(slug));
    }

    @PostMapping("/book/{bookId}")
    public ResponseEntity<Review> addReview(
            @AuthenticationPrincipal User user,
            @PathVariable Long bookId,
            @RequestParam Integer rating,
            @RequestParam String comment
    ) {
        return ResponseEntity.ok(reviewService.addReview(user, bookId, rating, comment));
    }
}
