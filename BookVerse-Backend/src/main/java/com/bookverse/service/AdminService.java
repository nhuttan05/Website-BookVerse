package com.bookverse.service;

import com.bookverse.repository.BookRepository;
import com.bookverse.repository.OrderRepository;
import com.bookverse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final OrderRepository orderRepository;

    public Map<String, Object> getOverviewStats() {
        Map<String, Object> stats = new HashMap<>();
        
        List<com.bookverse.entity.Order> orders = orderRepository.findAll();
        List<com.bookverse.entity.User> users = userRepository.findAll();
        List<com.bookverse.entity.Book> books = bookRepository.findAll();

        stats.put("totalUsers", users.size());
        stats.put("totalBooks", books.size());
        stats.put("totalOrders", orders.size());
        
        BigDecimal totalRevenue = orders.stream()
                .map(order -> order.getTotalAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.put("totalRevenue", totalRevenue);

        // 1. Monthly Revenue (Current Year)
        int currentYear = java.time.LocalDate.now().getYear();
        Map<Integer, BigDecimal> monthlyRevenue = orders.stream()
                .filter(order -> order.getOrderDate().getYear() == currentYear)
                .collect(java.util.stream.Collectors.groupingBy(
                        order -> order.getOrderDate().getMonthValue(),
                        java.util.stream.Collectors.reducing(BigDecimal.ZERO, order -> order.getTotalAmount(), BigDecimal::add)
                ));
        stats.put("monthlyRevenue", monthlyRevenue);

        // 2. Sales by Category
        Map<String, Integer> categorySales = orders.stream()
                .flatMap(order -> order.getItems().stream())
                .collect(java.util.stream.Collectors.groupingBy(
                        item -> item.getBook().getCategory() != null ? item.getBook().getCategory().getName() : "Unknown",
                        java.util.stream.Collectors.summingInt(item -> item.getQuantity())
                ));
        stats.put("categorySales", categorySales);

        // 3. New Users by Month (Current Year)
        Map<Integer, Long> monthlyUsers = users.stream()
                .filter(user -> user.getCreatedAt() != null && user.getCreatedAt().getYear() == currentYear)
                .collect(java.util.stream.Collectors.groupingBy(
                        user -> user.getCreatedAt().getMonthValue(),
                        java.util.stream.Collectors.counting()
                ));
        stats.put("monthlyUsers", monthlyUsers);

        // 4. Low Stock Alerts (stock < 5)
        List<Map<String, Object>> lowStockBooks = books.stream()
                .filter(book -> book.getStockQuantity() != null && book.getStockQuantity() < 5)
                .map(book -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", book.getId());
                    map.put("title", book.getTitle());
                    map.put("stock", book.getStockQuantity());
                    return map;
                })
                .collect(java.util.stream.Collectors.toList());
        stats.put("lowStockAlerts", lowStockBooks);
        
        return stats;
    }
}
