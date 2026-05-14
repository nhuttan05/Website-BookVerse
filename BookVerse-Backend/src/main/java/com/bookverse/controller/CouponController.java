package com.bookverse.controller;

import com.bookverse.dto.CouponValidationResponse;
import com.bookverse.entity.User;
import com.bookverse.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/coupons")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CouponController {

    private final CouponService couponService;

    @PostMapping("/validate")
    public ResponseEntity<CouponValidationResponse> validateCoupon(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> body
    ) {
        String code = (String) body.get("code");
        BigDecimal orderAmount = new BigDecimal(body.get("orderAmount").toString());
        return ResponseEntity.ok(couponService.validateCoupon(code, orderAmount));
    }
}
