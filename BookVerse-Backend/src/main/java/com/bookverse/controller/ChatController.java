package com.bookverse.controller;

import com.bookverse.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChatController {

    private final AiService aiService;

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> request) {
        String userMessage = request.getOrDefault("message", "");
        if (userMessage.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("reply", "Vui lòng nhập nội dung câu hỏi."));
        }

        String reply = aiService.generateResponse(userMessage);
        return ResponseEntity.ok(Map.of("reply", reply));
    }
}
