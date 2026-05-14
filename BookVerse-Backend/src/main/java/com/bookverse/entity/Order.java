package com.bookverse.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(name = "order_date")
    private LocalDateTime orderDate;

    @Column(name = "total_amount")
    private BigDecimal totalAmount;

    @Column(name = "discount_amount")
    @Builder.Default
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "coupon_code", length = 50)
    private String couponCode;

    @Column(columnDefinition = "VARCHAR(255)")
    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @Column(name = "shipping_address")
    private String shippingAddress;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "payment_method")
    private String paymentMethod;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @OrderBy("changedAt ASC")
    @Builder.Default
    private List<OrderStatusHistory> statusHistory = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        orderDate = LocalDateTime.now();
        if (status == null) status = OrderStatus.PENDING;
        if (discountAmount == null) discountAmount = BigDecimal.ZERO;
    }
}
