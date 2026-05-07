package com.bookverse.controller;

import com.bookverse.entity.User;
import com.bookverse.entity.WishlistItem;
import com.bookverse.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wishlist")
@RequiredArgsConstructor
@org.springframework.security.access.prepost.PreAuthorize("hasRole('USER')")
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<WishlistItem>> getWishlist(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(wishlistService.getUserWishlist(user));
    }

    @PostMapping("/{bookId}")
    public ResponseEntity<WishlistItem> addToWishlist(
            @AuthenticationPrincipal User user,
            @PathVariable Long bookId) {
        return ResponseEntity.ok(wishlistService.addToWishlist(user, bookId));
    }

    @DeleteMapping("/{bookId}")
    public ResponseEntity<Void> removeFromWishlist(
            @AuthenticationPrincipal User user,
            @PathVariable Long bookId) {
        wishlistService.removeFromWishlist(user, bookId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/check/{bookId}")
    public ResponseEntity<Boolean> isInWishlist(
            @AuthenticationPrincipal User user,
            @PathVariable Long bookId) {
        return ResponseEntity.ok(wishlistService.isInWishlist(user, bookId));
    }
}
