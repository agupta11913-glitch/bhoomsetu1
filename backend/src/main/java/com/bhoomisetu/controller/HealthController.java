package com.bhoomisetu.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> getRoot() {
        Map<String, Object> response = new HashMap<>();
        response.put("service", "BhoomiSetu National Land Acquisition & Management System");
        response.put("status", "ACTIVE");
        response.put("version", "1.0.0");
        response.put("frontend_url", "http://localhost:3000");
        response.put("health_endpoint", "/api/health");
        response.put("projects_endpoint", "/api/projects");
        response.put("lands_endpoint", "/api/lands");
        response.put("auth_endpoint", "/api/auth/login");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    @GetMapping({"/api", "/api/health"})
    public ResponseEntity<Map<String, Object>> getHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "BhoomiSetu Backend");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }
}
