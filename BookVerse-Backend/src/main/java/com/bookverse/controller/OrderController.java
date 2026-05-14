package com.bookverse.controller;

import com.bookverse.dto.OrderDetailDTO;
import com.bookverse.dto.OrderRequest;
import com.bookverse.entity.Order;
import com.bookverse.entity.User;
import com.bookverse.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> createOrder(
            @AuthenticationPrincipal User user,
            @RequestBody OrderRequest request
    ) {
        return ResponseEntity.ok(orderService.createOrder(user, request));
    }

    @GetMapping("/history")
    public ResponseEntity<List<Order>> getOrderHistory(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.getUserOrders(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDetailDTO> getOrderDetail(
            @AuthenticationPrincipal User user,
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(orderService.getOrderDetail(id, user));
    }
}
