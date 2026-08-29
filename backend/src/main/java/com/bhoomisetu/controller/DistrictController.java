package com.bhoomisetu.controller;

import com.bhoomisetu.entity.AuditLog;
import com.bhoomisetu.entity.Notification;
import com.bhoomisetu.service.DistrictService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/district")
public class DistrictController {

    private final DistrictService districtService;

    public DistrictController(DistrictService districtService) {
        this.districtService = districtService;
    }

    @GetMapping({"", "/dashboard", "/dashboard/stats", "/stats"})
    public ResponseEntity<Map<String, Object>> getDashboardData(
            @RequestParam(required = false) String district,
            Authentication authentication
    ) {
        String email = authentication != null ? authentication.getName() : "district.officer@bhoomisetu.gov.in";
        return ResponseEntity.ok(districtService.getDashboardData(district, email, "DISTRICT_MAGISTRATE"));
    }

    @GetMapping("/projects")
    public ResponseEntity<List<Map<String, Object>>> getProjects(
            @RequestParam(required = false) String district,
            Authentication authentication
    ) {
        return ResponseEntity.ok(districtService.getProjects(district, "DISTRICT_MAGISTRATE"));
    }

    @GetMapping("/projects/{projectId}")
    public ResponseEntity<Map<String, Object>> getProjectById(
            @PathVariable String projectId,
            @RequestParam(required = false) String district
    ) {
        return ResponseEntity.ok(districtService.getProjectById(projectId, district));
    }

    @PutMapping("/projects/{projectId}/progress")
    public ResponseEntity<Map<String, Object>> updateProjectProgress(
            @PathVariable String projectId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication
    ) {
        String email = authentication != null ? authentication.getName() : "district.officer@bhoomisetu.gov.in";
        return ResponseEntity.ok(districtService.updateProjectProgress(projectId, payload, email));
    }

    @PostMapping("/projects/{projectId}/documents")
    public ResponseEntity<Map<String, Object>> uploadProjectDocument(
            @PathVariable String projectId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication
    ) {
        String email = authentication != null ? authentication.getName() : "district.officer@bhoomisetu.gov.in";
        return ResponseEntity.ok(districtService.uploadProjectDocument(projectId, payload, email));
    }

    @GetMapping("/acquisition")
    public ResponseEntity<List<Map<String, Object>>> getAcquisitionCases(
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String projectId,
            @RequestParam(required = false) String status
    ) {
        return ResponseEntity.ok(districtService.getAcquisitionCases(district, projectId, status));
    }

    @PutMapping("/acquisition/{caseId}/status")
    public ResponseEntity<Map<String, Object>> updateAcquisitionStatus(
            @PathVariable String caseId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication
    ) {
        String email = authentication != null ? authentication.getName() : "district.officer@bhoomisetu.gov.in";
        return ResponseEntity.ok(districtService.updateAcquisitionStatus(caseId, payload, email));
    }

    @PostMapping("/acquisition/{caseId}/remarks")
    public ResponseEntity<Map<String, Object>> addAcquisitionRemark(
            @PathVariable String caseId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication
    ) {
        String email = authentication != null ? authentication.getName() : "district.officer@bhoomisetu.gov.in";
        return ResponseEntity.ok(districtService.addAcquisitionRemark(caseId, payload, email));
    }

    @GetMapping("/map")
    public ResponseEntity<Map<String, Object>> getMapData(
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String projectId
    ) {
        return ResponseEntity.ok(districtService.getMapData(district, projectId));
    }

    @GetMapping("/land")
    public ResponseEntity<List<Map<String, Object>>> getLandOverview(
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String projectId
    ) {
        return ResponseEntity.ok(districtService.getAcquisitionCases(district, projectId, null));
    }

    @PostMapping("/land/{parcelId}/remark")
    public ResponseEntity<Map<String, Object>> addLandRemark(
            @PathVariable String parcelId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication
    ) {
        String email = authentication != null ? authentication.getName() : "district.officer@bhoomisetu.gov.in";
        return ResponseEntity.ok(districtService.addLandRemark(parcelId, payload, email));
    }

    @GetMapping("/land/{parcelId}/remarks")
    public ResponseEntity<List<Map<String, Object>>> getLandRemarks(@PathVariable String parcelId) {
        return ResponseEntity.ok(districtService.getLandRemarks(parcelId));
    }

    @GetMapping("/disputes")
    public ResponseEntity<List<Map<String, Object>>> getDisputes(
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String projectId
    ) {
        return ResponseEntity.ok(districtService.getDisputes(district, projectId));
    }

    @PostMapping("/disputes")
    public ResponseEntity<Map<String, Object>> addDispute(
            @RequestBody Map<String, Object> payload,
            Authentication authentication
    ) {
        String email = authentication != null ? authentication.getName() : "district.officer@bhoomisetu.gov.in";
        return ResponseEntity.ok(districtService.addDispute(payload, email));
    }

    @PutMapping("/disputes/{disputeId}/review")
    public ResponseEntity<Map<String, Object>> reviewDispute(
            @PathVariable String disputeId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication
    ) {
        String email = authentication != null ? authentication.getName() : "district.officer@bhoomisetu.gov.in";
        return ResponseEntity.ok(districtService.reviewDispute(disputeId, payload, email));
    }

    @PostMapping("/disputes/{disputeId}/escalate")
    public ResponseEntity<Map<String, Object>> escalateDispute(
            @PathVariable String disputeId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication
    ) {
        String email = authentication != null ? authentication.getName() : "district.officer@bhoomisetu.gov.in";
        return ResponseEntity.ok(districtService.escalateDispute(disputeId, payload, email));
    }

    @PostMapping("/disputes/{disputeId}/resolve")
    public ResponseEntity<Map<String, Object>> resolveDispute(
            @PathVariable String disputeId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication
    ) {
        String email = authentication != null ? authentication.getName() : "district.officer@bhoomisetu.gov.in";
        return ResponseEntity.ok(districtService.resolveDispute(disputeId, payload, email));
    }

    @GetMapping("/compensation")
    public ResponseEntity<Map<String, Object>> getCompensationOverview(
            @RequestParam(required = false) String district
    ) {
        return ResponseEntity.ok(districtService.getCompensationOverview(district));
    }

    @PutMapping("/compensation/{caseId}/status")
    public ResponseEntity<Map<String, Object>> updateCompensationStatus(
            @PathVariable String caseId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication
    ) {
        String email = authentication != null ? authentication.getName() : "district.officer@bhoomisetu.gov.in";
        return ResponseEntity.ok(districtService.updateCompensationStatus(caseId, payload, email));
    }

    @GetMapping("/r-and-r")
    public ResponseEntity<Map<String, Object>> getRnROverview(
            @RequestParam(required = false) String district
    ) {
        return ResponseEntity.ok(districtService.getRnROverview(district));
    }

    @PutMapping("/r-and-r/{caseId}/status")
    public ResponseEntity<Map<String, Object>> updateRnRStatus(
            @PathVariable String caseId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication
    ) {
        String email = authentication != null ? authentication.getName() : "district.officer@bhoomisetu.gov.in";
        return ResponseEntity.ok(districtService.updateRnRStatus(caseId, payload, email));
    }

    @GetMapping("/officers")
    public ResponseEntity<List<Map<String, Object>>> getOfficers(
            @RequestParam(required = false) String district
    ) {
        return ResponseEntity.ok(districtService.getOfficers(district));
    }

    @GetMapping("/coordination")
    public ResponseEntity<List<Map<String, Object>>> getCoordinationRequests(
            @RequestParam(required = false) String district
    ) {
        return ResponseEntity.ok(districtService.getCoordinationRequests(district));
    }

    @PostMapping("/coordination")
    public ResponseEntity<Map<String, Object>> createCoordinationRequest(
            @RequestBody Map<String, Object> payload,
            Authentication authentication
    ) {
        String email = authentication != null ? authentication.getName() : "district.officer@bhoomisetu.gov.in";
        return ResponseEntity.ok(districtService.createCoordinationRequest(payload, email));
    }

    @PutMapping("/coordination/{coordinationId}/status")
    public ResponseEntity<Map<String, Object>> updateCoordinationStatus(
            @PathVariable String coordinationId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication
    ) {
        String email = authentication != null ? authentication.getName() : "district.officer@bhoomisetu.gov.in";
        return ResponseEntity.ok(districtService.updateCoordinationStatus(coordinationId, payload, email));
    }

    @GetMapping("/escalations")
    public ResponseEntity<List<Map<String, Object>>> getEscalations(
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String status
    ) {
        return ResponseEntity.ok(districtService.getEscalations(district, status));
    }

    @PostMapping("/escalations")
    public ResponseEntity<Map<String, Object>> createEscalation(
            @RequestBody Map<String, Object> payload,
            Authentication authentication
    ) {
        String email = authentication != null ? authentication.getName() : "district.officer@bhoomisetu.gov.in";
        return ResponseEntity.ok(districtService.createEscalation(payload, email));
    }

    @PostMapping("/escalations/{escalationId}/action")
    public ResponseEntity<Map<String, Object>> actionEscalation(
            @PathVariable String escalationId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication
    ) {
        String email = authentication != null ? authentication.getName() : "district.officer@bhoomisetu.gov.in";
        return ResponseEntity.ok(districtService.actionEscalation(escalationId, payload, email));
    }

    @PutMapping("/escalations/{escalationId}/status")
    public ResponseEntity<Map<String, Object>> updateEscalationStatus(
            @PathVariable String escalationId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication
    ) {
        String email = authentication != null ? authentication.getName() : "district.officer@bhoomisetu.gov.in";
        return ResponseEntity.ok(districtService.updateEscalationStatus(escalationId, payload, email));
    }

    @PostMapping("/escalations/{escalationId}/remark")
    public ResponseEntity<Map<String, Object>> addEscalationRemark(
            @PathVariable String escalationId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication
    ) {
        String email = authentication != null ? authentication.getName() : "district.officer@bhoomisetu.gov.in";
        return ResponseEntity.ok(districtService.addEscalationRemark(escalationId, payload, email));
    }

    @PostMapping("/escalations/{escalationId}/forward")
    public ResponseEntity<Map<String, Object>> forwardEscalation(
            @PathVariable String escalationId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication
    ) {
        String email = authentication != null ? authentication.getName() : "district.officer@bhoomisetu.gov.in";
        return ResponseEntity.ok(districtService.forwardEscalation(escalationId, payload, email));
    }

    @PostMapping("/escalations/{escalationId}/escalate-state")
    public ResponseEntity<Map<String, Object>> escalateToState(
            @PathVariable String escalationId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication
    ) {
        String email = authentication != null ? authentication.getName() : "district.officer@bhoomisetu.gov.in";
        return ResponseEntity.ok(districtService.escalateToState(escalationId, payload, email));
    }

    @PostMapping("/escalations/{escalationId}/resolve")
    public ResponseEntity<Map<String, Object>> resolveEscalation(
            @PathVariable String escalationId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication
    ) {
        String email = authentication != null ? authentication.getName() : "district.officer@bhoomisetu.gov.in";
        return ResponseEntity.ok(districtService.actionEscalation(escalationId, payload, email));
    }

    @GetMapping("/delayed-cases")
    public ResponseEntity<List<Map<String, Object>>> getDelayedCases(
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String category
    ) {
        return ResponseEntity.ok(districtService.getDelayedCases(district, category));
    }

    @PostMapping("/delayed-cases/{caseId}/action")
    public ResponseEntity<Map<String, Object>> actionDelayedCase(
            @PathVariable String caseId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication
    ) {
        String email = authentication != null ? authentication.getName() : "district.officer@bhoomisetu.gov.in";
        return ResponseEntity.ok(districtService.actionDelayedCase(caseId, payload, email));
    }

    @PostMapping("/delayed-cases/{caseId}/remark")
    public ResponseEntity<Map<String, Object>> addDelayedRemark(
            @PathVariable String caseId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication
    ) {
        String email = authentication != null ? authentication.getName() : "district.officer@bhoomisetu.gov.in";
        return ResponseEntity.ok(districtService.addDelayedRemark(caseId, payload, email));
    }

    @PutMapping("/delayed-cases/{caseId}/status")
    public ResponseEntity<Map<String, Object>> updateDelayedStatus(
            @PathVariable String caseId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication
    ) {
        String email = authentication != null ? authentication.getName() : "district.officer@bhoomisetu.gov.in";
        return ResponseEntity.ok(districtService.updateDelayedStatus(caseId, payload, email));
    }

    @PostMapping("/delayed-cases/{caseId}/delay-reason")
    public ResponseEntity<Map<String, Object>> updateDelayedReason(
            @PathVariable String caseId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication
    ) {
        String email = authentication != null ? authentication.getName() : "district.officer@bhoomisetu.gov.in";
        return ResponseEntity.ok(districtService.updateDelayedReason(caseId, payload, email));
    }

    @PostMapping("/delayed-cases/{caseId}/forward")
    public ResponseEntity<Map<String, Object>> forwardDelayedCase(
            @PathVariable String caseId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication
    ) {
        String email = authentication != null ? authentication.getName() : "district.officer@bhoomisetu.gov.in";
        return ResponseEntity.ok(districtService.forwardDelayedCase(caseId, payload, email));
    }

    @PostMapping("/delayed-cases/{caseId}/escalate")
    public ResponseEntity<Map<String, Object>> escalateDelayedCase(
            @PathVariable String caseId,
            @RequestBody Map<String, Object> payload,
            Authentication authentication
    ) {
        String email = authentication != null ? authentication.getName() : "district.officer@bhoomisetu.gov.in";
        return ResponseEntity.ok(districtService.escalateDelayedCase(caseId, payload, email));
    }

    @GetMapping("/reports")
    public ResponseEntity<Map<String, Object>> getReports(
            @RequestParam(required = false) String district
    ) {
        return ResponseEntity.ok(districtService.getReports(district));
    }

    @PostMapping("/reports/generate")
    public ResponseEntity<Map<String, Object>> generateDistrictReport(
            @RequestBody Map<String, Object> payload,
            Authentication authentication
    ) {
        String email = authentication != null ? authentication.getName() : "district.officer@bhoomisetu.gov.in";
        return ResponseEntity.ok(districtService.generateDistrictReport(payload, email));
    }

    @GetMapping("/documents")
    public ResponseEntity<List<Map<String, Object>>> getDocuments(
            @RequestParam(required = false) String district
    ) {
        return ResponseEntity.ok(districtService.getDocuments(district));
    }

    @PostMapping("/documents/upload")
    public ResponseEntity<Map<String, Object>> uploadDistrictDocument(
            @RequestBody Map<String, Object> payload,
            Authentication authentication
    ) {
        String email = authentication != null ? authentication.getName() : "district.officer@bhoomisetu.gov.in";
        return ResponseEntity.ok(districtService.uploadDistrictDocument(payload, email));
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<Notification>> getNotifications(
            @RequestParam(required = false) String district
    ) {
        return ResponseEntity.ok(districtService.getNotifications(district));
    }

    @GetMapping("/audit")
    public ResponseEntity<List<AuditLog>> getAuditTrail(
            @RequestParam(required = false) String district
    ) {
        return ResponseEntity.ok(districtService.getAuditTrail(district));
    }

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile(Authentication authentication) {
        String email = authentication != null ? authentication.getName() : "district.officer@bhoomisetu.gov.in";
        return ResponseEntity.ok(districtService.getProfile(email));
    }
}
