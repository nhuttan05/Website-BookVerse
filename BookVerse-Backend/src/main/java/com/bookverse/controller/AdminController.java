package com.bookverse.controller;

import com.bookverse.dto.BookDTO;
import com.bookverse.dto.OrderDetailDTO;
import com.bookverse.entity.Coupon;
import com.bookverse.service.AdminService;
import com.bookverse.service.BookService;
import com.bookverse.service.CategoryService;
import com.bookverse.service.CouponService;
import com.bookverse.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final BookService bookService;
    private final CategoryService categoryService;
    private final CouponService couponService;
    private final OrderService orderService;
    private final com.bookverse.repository.UserRepository userRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(adminService.getOverviewStats());
    }

    // --- Book Management ---

    @GetMapping("/books")
    public ResponseEntity<Page<BookDTO>> getAllBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(bookService.getAllBooks(pageable));
    }

    @PostMapping("/books")
    public ResponseEntity<BookDTO> createBook(@RequestBody BookDTO bookDTO) {
        return ResponseEntity.ok(bookService.createBook(bookDTO));
    }

    @PutMapping("/books/{id}")
    public ResponseEntity<BookDTO> updateBook(@PathVariable Long id, @RequestBody BookDTO bookDTO) {
        return ResponseEntity.ok(bookService.updateBook(id, bookDTO));
    }

    @DeleteMapping("/books/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }

    // --- Category Management ---

    @GetMapping("/categories")
    public ResponseEntity<List<com.bookverse.entity.Category>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @PostMapping("/categories")
    public ResponseEntity<com.bookverse.entity.Category> createCategory(@RequestBody com.bookverse.entity.Category category) {
        return ResponseEntity.ok(categoryService.createCategory(category));
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<com.bookverse.entity.Category> updateCategory(@PathVariable Long id, @RequestBody com.bookverse.entity.Category category) {
        return ResponseEntity.ok(categoryService.updateCategory(id, category));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    // --- User Management ---

    @GetMapping("/users")
    public ResponseEntity<List<com.bookverse.entity.User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // --- Order Management ---

    @GetMapping("/orders")
    public ResponseEntity<Page<OrderDetailDTO>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("orderDate").descending());
        return ResponseEntity.ok(orderService.getAllOrders(pageable));
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<OrderDetailDTO> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        String status = body.get("status");
        String note = body.get("note");
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status, note));
    }

    // --- Coupon Management ---

    @GetMapping("/coupons")
    public ResponseEntity<List<Coupon>> getAllCoupons() {
        return ResponseEntity.ok(couponService.getAllCoupons());
    }

    @PostMapping("/coupons")
    public ResponseEntity<Coupon> createCoupon(@RequestBody Coupon coupon) {
        return ResponseEntity.ok(couponService.createCoupon(coupon));
    }

    @PutMapping("/coupons/{id}")
    public ResponseEntity<Coupon> updateCoupon(@PathVariable Long id, @RequestBody Coupon coupon) {
        return ResponseEntity.ok(couponService.updateCoupon(id, coupon));
    }

    @DeleteMapping("/coupons/{id}")
    public ResponseEntity<Void> deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.noContent().build();
    }
}
