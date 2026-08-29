package com.bhoomisetu.controller;

import com.bhoomisetu.entity.RehabilitationBenefit;
import com.bhoomisetu.entity.RRClarificationRequest;
import com.bhoomisetu.service.RehabilitationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rr")
@CrossOrigin(origins = "*", maxAge = 3600)
public class RehabilitationController {

    @Autowired
    private RehabilitationService rrService;

    @GetMapping("/benefits")
    public ResponseEntity<List<RehabilitationBenefit>> getAllBenefits() {
        return ResponseEntity.ok(rrService.getAllBenefits());
    }

    @GetMapping("/case/{caseId}")
    public ResponseEntity<Map<String, Object>> getCaseSummary(@PathVariable String caseId) {
        return ResponseEntity.ok(rrService.getCaseSummary(caseId));
    }

    @GetMapping("/case/{caseId}/benefits")
    public ResponseEntity<List<RehabilitationBenefit>> getCaseBenefits(@PathVariable String caseId) {
        return ResponseEntity.ok(rrService.getBenefitsByCaseId(caseId));
    }

    @GetMapping("/case/{caseId}/payments")
    public ResponseEntity<List<Map<String, Object>>> getCasePayments(@PathVariable String caseId) {
        return ResponseEntity.ok(rrService.getDisbursementsByCaseId(caseId));
    }

    @GetMapping("/case/{caseId}/documents")
    public ResponseEntity<List<Map<String, Object>>> getCaseDocuments(@PathVariable String caseId) {
        return ResponseEntity.ok(rrService.getDocumentsByCaseId(caseId));
    }

    @PostMapping("/case/{caseId}/clarification")
    public ResponseEntity<RRClarificationRequest> submitClarification(
            @PathVariable String caseId,
            @RequestBody RRClarificationRequest request
    ) {
        request.setCaseId(caseId);
        return ResponseEntity.ok(rrService.saveClarification(request));
    }

    @GetMapping("/case/{caseId}/clarifications")
    public ResponseEntity<List<RRClarificationRequest>> getClarifications(@PathVariable String caseId) {
        return ResponseEntity.ok(rrService.getClarificationsByCaseId(caseId));
    }
}
