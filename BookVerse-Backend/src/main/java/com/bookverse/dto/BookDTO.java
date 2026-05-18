package com.bookverse.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookDTO {
    private Long id;
    private String title;
    private String slug;
    private String description;
    private java.math.BigDecimal price;
    private java.math.BigDecimal originalPrice;
    private Integer discountPercent;
    private String coverImageUrl;
    private Long categoryId;      // Nhận từ frontend khi tạo/sửa
    private String categoryName;  // Trả về cho frontend hiển thị
    private String categorySlug;
    private String author;
    private Double rating;
    private Integer reviewCount;
    private Boolean isEditorChoice;
    private Boolean isFeatured;
    private Boolean isBestseller;
    private Boolean isNewArrival;
    private String isbn;
    private String publisher;
    private Integer pageCount;
    private java.time.LocalDate publishedDate;
    private String language;
    private String supplier;
    private String ageRange;
    private String previewUrl;
    private String previewType;
    private Integer stockQuantity;
    private java.util.List<String> images;
}
