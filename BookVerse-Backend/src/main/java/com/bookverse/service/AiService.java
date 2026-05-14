package com.bookverse.service;

import com.bookverse.entity.Book;
import com.bookverse.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiService {

    private final BookRepository bookRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    public String generateResponse(String userMessage) {
        // 1. Tìm kiếm sách liên quan trong DB dựa trên từ khóa từ câu hỏi
        String query = userMessage.trim();
        // Lấy tối đa 10 cuốn sách liên quan (theo tiêu đề hoặc tác giả)
        List<Book> relevantBooks = bookRepository.searchBooksAdvanced(
                query, null, null, null, null, null, null, null, PageRequest.of(0, 10)
        ).getContent();

        // Nếu không tìm thấy sách theo từ khóa, lấy danh sách sách tiêu biểu làm dự phòng
        if (relevantBooks.isEmpty()) {
            relevantBooks = bookRepository.findByIsBestsellerTrue();
            if (relevantBooks.size() > 8) {
                relevantBooks = relevantBooks.subList(0, 8);
            }
        }
        
        String contextStr = relevantBooks.stream()
                .map(b -> String.format("- %s (Tác giả: %s, Giá: %d VNĐ, Thể loại: %s, Mô tả: %s)", 
                        b.getTitle(), 
                        b.getAuthor(), 
                        b.getPrice().intValue(), 
                        b.getCategory() != null ? b.getCategory().getName() : "Khác",
                        b.getDescription() != null ? (b.getDescription().length() > 100 ? b.getDescription().substring(0, 100) + "..." : b.getDescription()) : "Chưa có mô tả"))
                .collect(Collectors.joining("\n"));

        String systemPrompt = "Bạn là BookVerse AI, một trợ lý tư vấn sách thông minh, thân thiện và chuyên nghiệp trên nền tảng BookVerse.\n" +
                "Dưới đây là danh sách sách từ cơ sở dữ liệu có liên quan đến câu hỏi hoặc là sách tiêu biểu để bạn tham khảo:\n" +
                contextStr + "\n\n" +
                "Nhiệm vụ của bạn:\n" +
                "1. Dựa vào danh sách trên để trả lời chính xác thông tin về sách (tên, tác giả, giá, thể loại).\n" +
                "2. Luôn trả lời bằng Tiếng Việt, giọng điệu nhiệt tình, hiếu khách.\n" +
                "3. Nếu người dùng hỏi về cuốn sách có trong danh sách, hãy giới thiệu chi tiết.\n" +
                "4. Nếu người dùng hỏi về cuốn sách KHÔNG có trong danh sách, hãy nói rằng hiện tại hệ thống chưa cập nhật cuốn đó và gợi ý họ xem các cuốn tương tự trong danh sách trên.\n" +
                "5. Giữ câu trả lời ngắn gọn (dưới 3 đoạn văn).";

        String url = "https://text.pollinations.ai/";

        Map<String, Object> requestBody = new HashMap<>();
        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", systemPrompt));
        messages.add(Map.of("role", "user", "content", userMessage));
        
        requestBody.put("messages", messages);
        requestBody.put("model", "openai");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            if (response.getBody() != null && !response.getBody().trim().isEmpty()) {
                return response.getBody();
            }
        } catch (Exception e) {
            System.err.println("AI API Error: " + e.getMessage());
            return "Hệ thống AI đang được nâng cấp. Vui lòng thử lại sau ít phút.";
        }

        return "Xin lỗi, tôi không thể kết nối tới máy chủ AI lúc này.";
    }
}
