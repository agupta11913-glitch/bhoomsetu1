package com.bhoomisetu.controller;

import com.bhoomisetu.entity.Notification;
import com.bhoomisetu.service.RevenueOfficerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/revenue-officer", "/api/revenue"})
@CrossOrigin(origins = "*", maxAge = 3600)
public class RevenueOfficerController {

    private final RevenueOfficerService revenueOfficerService;

    public RevenueOfficerController(RevenueOfficerService revenueOfficerService) {
        this.revenueOfficerService = revenueOfficerService;
    }

    @GetMapping({"/dashboard", "/dashboard/stats", "/stats"})
    public ResponseEntity<Map<String, Object>> getDashboardStats(Authentication authentication) {
        String email = authentication != null ? authentication.getName() : "officer@demo.gov.in";
        return ResponseEntity.ok(revenueOfficerService.getDashboardStats(email));
    }

    @GetMapping("/cases")
    public ResponseEntity<List<Map<String, Object>>> getAssignedCases(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String village,
            Authentication authentication
    ) {
        String email = authentication != null ? authentication.getName() : "officer@demo.gov.in";
        return ResponseEntity.ok(revenueOfficerService.getAssignedCases(email, status, village));
    }

    @GetMapping("/cases/{caseId}")
    public ResponseEntity<Map<String, Object>> getCaseDetails(@PathVariable String caseId) {
        return ResponseEntity.ok(revenueOfficerService.getCaseDetails(caseId));
    }

    @GetMapping("/cases/{caseId}/land")
    public ResponseEntity<Map<String, Object>> getCaseLandInfo(@PathVariable String caseId) {
        return ResponseEntity.ok(revenueOfficerService.getCaseDetails(caseId));
    }

    @GetMapping("/cases/{caseId}/documents")
    public ResponseEntity<List<Map<String, Object>>> getCaseDocuments(@PathVariable String caseId) {
        Map<String, Object> details = revenueOfficerService.getCaseDetails(caseId);
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> docs = (List<Map<String, Object>>) details.get("documents");
        return ResponseEntity.ok(docs != null ? docs : List.of());
    }

    @PostMapping("/cases/{caseId}/verification")
    public ResponseEntity<Map<String, Object>> saveVerificationDraft(
            @PathVariable String caseId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication
    ) {
        String email = authentication != null ? authentication.getName() : "officer@demo.gov.in";
        return ResponseEntity.ok(revenueOfficerService.saveVerificationDraft(caseId, payload, email));
    }

    @PostMapping("/cases/{caseId}/verification/submit")
    public ResponseEntity<Map<String, Object>> submitVerificationToTehsildar(
            @PathVariable String caseId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication
    ) {
        String email = authentication != null ? authentication.getName() : "officer@demo.gov.in";
        return ResponseEntity.ok(revenueOfficerService.submitVerificationToTehsildar(caseId, payload, email));
    }

    @PostMapping("/cases/{caseId}/field-verification")
    public ResponseEntity<Map<String, Object>> recordFieldVerification(
            @PathVariable String caseId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication
    ) {
        String email = authentication != null ? authentication.getName() : "officer@demo.gov.in";
        return ResponseEntity.ok(revenueOfficerService.recordFieldVerification(caseId, payload, email));
    }

    @PutMapping("/cases/{caseId}/documents/{docId}")
    public ResponseEntity<Map<String, Object>> updateDocumentStatus(
            @PathVariable String caseId,
            @PathVariable String docId,
            @RequestBody Map<String, Object> payload
    ) {
        String status = (String) payload.getOrDefault("status", "VERIFIED");
        String remarks = (String) payload.getOrDefault("remarks", "");
        return ResponseEntity.ok(revenueOfficerService.updateDocumentStatus(caseId, docId, status, remarks));
    }

    @GetMapping("/objections")
    public ResponseEntity<List<Map<String, Object>>> getAssignedObjections(Authentication authentication) {
        String email = authentication != null ? authentication.getName() : "officer@demo.gov.in";
        return ResponseEntity.ok(revenueOfficerService.getAssignedObjections(email));
    }

    @PostMapping("/objections/{objectionId}/report")
    public ResponseEntity<Map<String, Object>> submitObjectionFactReport(
            @PathVariable String objectionId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication
    ) {
        String email = authentication != null ? authentication.getName() : "officer@demo.gov.in";
        return ResponseEntity.ok(revenueOfficerService.submitObjectionFactReport(objectionId, payload, email));
    }

    @GetMapping("/map")
    public ResponseEntity<Map<String, Object>> getAssignedMapData(@RequestParam(required = false) String village) {
        return ResponseEntity.ok(revenueOfficerService.getAssignedMapData(village));
    }

    @GetMapping("/reports")
    public ResponseEntity<Map<String, Object>> getVerificationReports(Authentication authentication) {
        String email = authentication != null ? authentication.getName() : "officer@demo.gov.in";
        return ResponseEntity.ok(revenueOfficerService.getVerificationReports(email));
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<Notification>> getNotifications(Authentication authentication) {
        String email = authentication != null ? authentication.getName() : "officer@demo.gov.in";
        return ResponseEntity.ok(revenueOfficerService.getNotifications(email));
    }

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile(Authentication authentication) {
        String email = authentication != null ? authentication.getName() : "officer@demo.gov.in";
        return ResponseEntity.ok(revenueOfficerService.getOfficerProfile(email));
    }
}
