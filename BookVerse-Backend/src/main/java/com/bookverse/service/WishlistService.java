package com.bookverse.service;

import com.bookverse.entity.Book;
import com.bookverse.entity.User;
import com.bookverse.entity.WishlistItem;
import com.bookverse.repository.BookRepository;
import com.bookverse.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final BookRepository bookRepository;

    public List<WishlistItem> getUserWishlist(User user) {
        return wishlistRepository.findByUserOrderByAddedAtDesc(user);
    }

    @Transactional
    public WishlistItem addToWishlist(User user, Long bookId) {
        if (wishlistRepository.existsByUserAndBookId(user, bookId)) {
            return wishlistRepository.findByUserAndBookId(user, bookId).orElse(null);
        }

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        WishlistItem item = WishlistItem.builder()
                .user(user)
                .book(book)
                .build();

        return wishlistRepository.save(item);
    }

    @Transactional
    public void removeFromWishlist(User user, Long bookId) {
        wishlistRepository.deleteByUserAndBookId(user, bookId);
    }

    public boolean isInWishlist(User user, Long bookId) {
        return wishlistRepository.existsByUserAndBookId(user, bookId);
    }
}
