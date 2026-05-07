package com.bookverse.controller;

import com.bookverse.dto.UserDTO;
import com.bookverse.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class UserController {
    private final com.bookverse.repository.UserRepository userRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal User user) {
        log.info("[BookVerse API] Fetching profile for user: {}", user != null ? user.getEmail() : "NULL");
        
        if (user == null) {
            return ResponseEntity.status(401).body("User not authenticated");
        }

        try {
            UserDTO userDTO = UserDTO.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .fullName(user.getFullName())
                    .roles(user.getAuthorities().stream()
                            .map(item -> item.getAuthority())
                            .collect(Collectors.toList()))
                    .build();
            return ResponseEntity.ok(userDTO);
        } catch (Exception e) {
            log.error("[BookVerse API] Error building user profile DTO", e);
            return ResponseEntity.status(500).body("Error processing user profile");
        }
    }
}
