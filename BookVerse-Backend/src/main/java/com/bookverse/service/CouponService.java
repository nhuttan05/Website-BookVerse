package com.bookverse.service;

import com.bookverse.dto.CouponValidationResponse;
import com.bookverse.entity.Coupon;
import com.bookverse.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;

    public CouponValidationResponse validateCoupon(String code, BigDecimal orderAmount) {
        Coupon coupon = couponRepository.findByCodeIgnoreCase(code).orElse(null);

        if (coupon == null) {
            return CouponValidationResponse.builder()
                    .valid(false).message("Mã giảm giá không tồn tại.").build();
        }
        if (!coupon.isValid(orderAmount)) {
            String reason = "Mã giảm giá không hợp lệ.";
            if (Boolean.FALSE.equals(coupon.getIsActive())) {
                reason = "Mã giảm giá đã bị vô hiệu hóa.";
            } else if (coupon.getExpiryDate() != null && java.time.LocalDateTime.now().isAfter(coupon.getExpiryDate())) {
                reason = "Mã giảm giá đã hết hạn.";
            } else if (coupon.getMaxUses() != null && coupon.getUsedCount() >= coupon.getMaxUses()) {
                reason = "Mã giảm giá đã được sử dụng hết.";
            } else if (coupon.getMinOrderAmount() != null && orderAmount.compareTo(coupon.getMinOrderAmount()) < 0) {
                reason = String.format("Đơn hàng tối thiểu %,.0f₫ để dùng mã này.", coupon.getMinOrderAmount().doubleValue());
            }
            return CouponValidationResponse.builder().valid(false).message(reason).build();
        }

        BigDecimal discount = coupon.calculateDiscount(orderAmount);
        BigDecimal finalAmount = orderAmount.subtract(discount);

        return CouponValidationResponse.builder()
                .valid(true)
                .message("Áp dụng mã thành công!")
                .code(coupon.getCode())
                .discountType(coupon.getDiscountType().name())
                .discountValue(coupon.getDiscountValue())
                .discountAmount(discount)
                .finalAmount(finalAmount)
                .build();
    }

    @Transactional
    public void incrementUsage(String code) {
        couponRepository.findByCodeIgnoreCase(code).ifPresent(coupon -> {
            coupon.setUsedCount(coupon.getUsedCount() + 1);
            couponRepository.save(coupon);
        });
    }

    // Admin CRUD
    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    public Coupon createCoupon(Coupon coupon) {
        if (couponRepository.existsByCodeIgnoreCase(coupon.getCode())) {
            throw new RuntimeException("Mã giảm giá '" + coupon.getCode() + "' đã tồn tại.");
        }
        coupon.setCode(coupon.getCode().toUpperCase());
        return couponRepository.save(coupon);
    }

    public Coupon updateCoupon(Long id, Coupon updated) {
        Coupon existing = couponRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coupon not found: " + id));
        existing.setDescription(updated.getDescription());
        existing.setDiscountType(updated.getDiscountType());
        existing.setDiscountValue(updated.getDiscountValue());
        existing.setMinOrderAmount(updated.getMinOrderAmount());
        existing.setMaxDiscountAmount(updated.getMaxDiscountAmount());
        existing.setMaxUses(updated.getMaxUses());
        existing.setExpiryDate(updated.getExpiryDate());
        existing.setIsActive(updated.getIsActive());
        return couponRepository.save(existing);
    }

    public void deleteCoupon(Long id) {
        couponRepository.deleteById(id);
    }
}
