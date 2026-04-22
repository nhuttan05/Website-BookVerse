package com.bookverse.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "books")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(name = "original_price")
    private BigDecimal originalPrice;

    @Column(name = "discount_percent")
    private Integer discountPercent;

    @Column(name = "cover_image_url")
    private String coverImageUrl;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    private String author;

    private Double rating;

    @Column(name = "review_count")
    private Integer reviewCount;

    @Column(name = "is_editor_choice")
    private Boolean isEditorChoice;

    @Column(name = "is_featured")
    private Boolean isFeatured;

    @Column(name = "is_bestseller")
    private Boolean isBestseller;

    @Column(name = "is_new_arrival")
    private Boolean isNewArrival;

    private String isbn;

    private String publisher;

    @Column(name = "page_count")
    private Integer pageCount;

    @Column(name = "published_date")
    private LocalDate publishedDate;

    private String language;

    @Column(name = "stock_quantity")
    private Integer stockQuantity;
}
