package com.bookverse.service;

import com.bookverse.dto.OrderDetailDTO;
import com.bookverse.dto.OrderRequest;
import com.bookverse.entity.*;
import com.bookverse.repository.BookRepository;
import com.bookverse.repository.CouponRepository;
import com.bookverse.repository.OrderRepository;
import com.bookverse.repository.OrderStatusHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final BookRepository bookRepository;
    private final CouponRepository couponRepository;
    private final OrderStatusHistoryRepository statusHistoryRepository;

    @Transactional
    public Order createOrder(User user, OrderRequest request) {
        Order order = Order.builder()
                .user(user)
                .shippingAddress(request.getShippingAddress())
                .phoneNumber(request.getPhoneNumber())
                .paymentMethod(request.getPaymentMethod())
                .discountAmount(BigDecimal.ZERO)
                .items(new ArrayList<>())
                .statusHistory(new ArrayList<>())
                .build();

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;

        for (OrderRequest.OrderItemRequest itemRequest : request.getItems()) {
            Book book = bookRepository.findById(itemRequest.getBookId())
                    .orElseThrow(() -> new RuntimeException("Book not found: " + itemRequest.getBookId()));

            if (book.getStockQuantity() < itemRequest.getQuantity()) {
                throw new RuntimeException("Không đủ hàng trong kho: " + book.getTitle());
            }

            book.setStockQuantity(book.getStockQuantity() - itemRequest.getQuantity());
            bookRepository.save(book);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .book(book)
                    .quantity(itemRequest.getQuantity())
                    .price(book.getPrice())
                    .build();

            orderItems.add(orderItem);
            subtotal = subtotal.add(book.getPrice().multiply(new BigDecimal(itemRequest.getQuantity())));
        }

        // Apply coupon if provided
        BigDecimal discountAmount = BigDecimal.ZERO;
        if (request.getCouponCode() != null && !request.getCouponCode().isBlank()) {
            Coupon coupon = couponRepository.findByCodeIgnoreCase(request.getCouponCode()).orElse(null);
            if (coupon != null && coupon.isValid(subtotal)) {
                discountAmount = coupon.calculateDiscount(subtotal);
                coupon.setUsedCount(coupon.getUsedCount() + 1);
                couponRepository.save(coupon);
                order.setCouponCode(coupon.getCode());
            }
        }

        order.setItems(orderItems);
        order.setDiscountAmount(discountAmount);
        order.setTotalAmount(subtotal.subtract(discountAmount));

        Order saved = orderRepository.save(order);

        // Record initial status history
        OrderStatusHistory initialHistory = OrderStatusHistory.builder()
                .order(saved)
                .status(OrderStatus.PENDING)
                .note("Đơn hàng đã được tạo thành công.")
                .build();
        statusHistoryRepository.save(initialHistory);

        return saved;
    }

    public List<Order> getUserOrders(User user) {
        return orderRepository.findByUserOrderByOrderDateDesc(user);
    }

    public OrderDetailDTO getOrderDetail(Long orderId, User user) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng #" + orderId));

        // Ensure user can only see their own orders (unless admin)
        boolean isAdmin = user.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin && !order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Bạn không có quyền xem đơn hàng này.");
        }

        return toDetailDTO(order);
    }

    @Transactional
    public OrderDetailDTO updateOrderStatus(Long orderId, String newStatus, String note) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        OrderStatus status = OrderStatus.valueOf(newStatus.toUpperCase());
        order.setStatus(status);
        orderRepository.save(order);

        OrderStatusHistory history = OrderStatusHistory.builder()
                .order(order)
                .status(status)
                .note(note != null ? note : getDefaultNote(status))
                .build();
        statusHistoryRepository.save(history);

        return toDetailDTO(order);
    }

    public Page<OrderDetailDTO> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable).map(this::toDetailDTO);
    }

    private String getDefaultNote(OrderStatus status) {
        return switch (status) {
            case PENDING -> "Đơn hàng đang chờ xử lý.";
            case PROCESSING -> "Đơn hàng đang được xử lý và đóng gói.";
            case SHIPPED -> "Đơn hàng đã được bàn giao cho đơn vị vận chuyển.";
            case DELIVERED -> "Đơn hàng đã giao thành công.";
            case CANCELLED -> "Đơn hàng đã bị hủy.";
        };
    }

    private OrderDetailDTO toDetailDTO(Order order) {
        List<OrderDetailDTO.OrderItemDTO> itemDTOs = order.getItems().stream().map(item ->
            OrderDetailDTO.OrderItemDTO.builder()
                .bookId(item.getBook().getId())
                .bookTitle(item.getBook().getTitle())
                .bookAuthor(item.getBook().getAuthor())
                .coverImageUrl(item.getBook().getCoverImageUrl())
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .build()
        ).collect(Collectors.toList());

        List<OrderDetailDTO.StatusHistoryDTO> historyDTOs = order.getStatusHistory().stream().map(h ->
            OrderDetailDTO.StatusHistoryDTO.builder()
                .status(h.getStatus().name())
                .note(h.getNote())
                .changedAt(h.getChangedAt())
                .build()
        ).collect(Collectors.toList());

        return OrderDetailDTO.builder()
                .id(order.getId())
                .userEmail(order.getUser() != null ? order.getUser().getEmail() : "N/A")
                .userFullName(order.getUser() != null ? order.getUser().getFullName() : "N/A")
                .status(order.getStatus().name())
                .orderDate(order.getOrderDate())
                .totalAmount(order.getTotalAmount())
                .discountAmount(order.getDiscountAmount())
                .couponCode(order.getCouponCode())
                .shippingAddress(order.getShippingAddress())
                .phoneNumber(order.getPhoneNumber())
                .paymentMethod(order.getPaymentMethod())
                .items(itemDTOs)
                .statusHistory(historyDTOs)
                .build();
    }
}
