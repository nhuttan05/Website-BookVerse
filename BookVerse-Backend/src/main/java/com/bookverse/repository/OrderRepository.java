package com.bookverse.repository;

import com.bookverse.entity.Order;
import com.bookverse.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByOrderDateDesc(User user);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(o) > 0 FROM Order o JOIN o.items i WHERE o.user = :user AND i.book.id = :bookId AND o.status = com.bookverse.entity.OrderStatus.DELIVERED")
    boolean hasPurchasedBook(@org.springframework.data.repository.query.Param("user") User user, @org.springframework.data.repository.query.Param("bookId") Long bookId);
}
