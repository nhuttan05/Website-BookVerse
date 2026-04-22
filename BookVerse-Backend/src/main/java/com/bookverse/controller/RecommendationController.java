package com.bookverse.controller;

import com.bookverse.dto.BookDTO;
import com.bookverse.entity.User;
import com.bookverse.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/recommendations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/similar/{slug}")
    public ResponseEntity<List<BookDTO>> getSimilarBooks(
            @PathVariable String slug,
            @RequestParam(defaultValue = "5") int limit
    ) {
        return ResponseEntity.ok(recommendationService.getSimilarBooks(slug, limit));
    }

    @GetMapping("/personalized")
    public ResponseEntity<List<BookDTO>> getPersonalized(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ResponseEntity.ok(recommendationService.getPersonalizedRecommendations(user, limit));
    }
}
