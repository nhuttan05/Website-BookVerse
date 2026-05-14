package com.bookverse.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String code;

    @Column(length = 255)
    private String description;

    @Column(name = "discount_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private DiscountType discountType; // PERCENTAGE | FIXED

    @Column(name = "discount_value", nullable = false)
    private BigDecimal discountValue;

    @Column(name = "min_order_amount")
    private BigDecimal minOrderAmount;

    @Column(name = "max_discount_amount")
    private BigDecimal maxDiscountAmount;

    @Column(name = "max_uses")
    private Integer maxUses;

    @Column(name = "used_count")
    @Builder.Default
    private Integer usedCount = 0;

    @Column(name = "expiry_date")
    private LocalDateTime expiryDate;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (usedCount == null) usedCount = 0;
        if (isActive == null) isActive = true;
    }

    public boolean isValid(BigDecimal orderAmount) {
        if (!Boolean.TRUE.equals(isActive)) return false;
        if (expiryDate != null && LocalDateTime.now().isAfter(expiryDate)) return false;
        if (maxUses != null && usedCount >= maxUses) return false;
        if (minOrderAmount != null && orderAmount.compareTo(minOrderAmount) < 0) return false;
        return true;
    }

    public BigDecimal calculateDiscount(BigDecimal orderAmount) {
        BigDecimal discount;
        if (discountType == DiscountType.PERCENTAGE) {
            discount = orderAmount.multiply(discountValue).divide(BigDecimal.valueOf(100));
            if (maxDiscountAmount != null && discount.compareTo(maxDiscountAmount) > 0) {
                discount = maxDiscountAmount;
            }
        } else {
            discount = discountValue;
        }
        return discount.min(orderAmount);
    }
}
