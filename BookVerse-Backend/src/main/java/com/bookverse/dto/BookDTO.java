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
    private BigDecimal price;
    private BigDecimal originalPrice;
    private Integer discountPercent;
    private String coverImageUrl;
    private String categoryName;
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
    private LocalDate publishedDate;
    private String language;
    private java.util.List<String> images;
}
