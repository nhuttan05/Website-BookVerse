package com.bookverse.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CouponValidationResponse {
    private boolean valid;
    private String message;
    private String code;
    private String discountType;
    private BigDecimal discountValue;
    private BigDecimal discountAmount;
    private BigDecimal finalAmount;
}
