package com.bookverse.repository;

import com.bookverse.entity.User;
import com.bookverse.entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<WishlistItem, Long> {
    List<WishlistItem> findByUserOrderByAddedAtDesc(User user);
    Optional<WishlistItem> findByUserAndBookId(User user, Long bookId);
    void deleteByUserAndBookId(User user, Long bookId);
    boolean existsByUserAndBookId(User user, Long bookId);
}
