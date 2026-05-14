package com.bookverse.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailDTO {
    private Long id;
    private String userEmail;
    private String userFullName;
    private String status;
    private LocalDateTime orderDate;
    private BigDecimal totalAmount;
    private BigDecimal discountAmount;
    private String couponCode;
    private String shippingAddress;
    private String phoneNumber;
    private String paymentMethod;
    private List<OrderItemDTO> items;
    private List<StatusHistoryDTO> statusHistory;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemDTO {
        private Long bookId;
        private String bookTitle;
        private String bookAuthor;
        private String coverImageUrl;
        private Integer quantity;
        private BigDecimal price;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatusHistoryDTO {
        private String status;
        private String note;
        private LocalDateTime changedAt;
    }
}
