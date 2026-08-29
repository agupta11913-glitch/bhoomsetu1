package com.bhoomisetu.controller;

import com.bhoomisetu.dto.AIQueryRequest;
import com.bhoomisetu.dto.AIQueryResponse;
import com.bhoomisetu.service.AIService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiAssistantController {

    private static final Logger log = LoggerFactory.getLogger(AiAssistantController.class);
    private final AIService aiService;

    public AiAssistantController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping({"/chat", "/query"})
    public ResponseEntity<AIQueryResponse> chat(@RequestBody AIQueryRequest request) {
        log.info("AI CHAT REQUEST RECEIVED | method = POST | message = {}", request != null ? request.getEffectiveMessage() : "null");
        AIQueryResponse response = aiService.processQuery(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getAIStatus() {
        return ResponseEntity.ok(Map.of(
                "status", "ONLINE",
                "model", "BhoomiSetu-ContextAware-NLU-2026",
                "endpoints", new String[]{"POST /api/ai/chat", "POST /api/ai/query", "GET /api/ai/status"},
                "capabilities", new String[]{"Hinglish", "Hindi", "English", "RoleScopedRBAC", "WebsiteInteractiveActions", "GISIntegration", "PageContextBinding"}
        ));
    }
}
