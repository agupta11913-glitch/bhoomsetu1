package com.bhoomisetu.controller;

import com.bhoomisetu.entity.AuditLog;
import com.bhoomisetu.entity.LandParcel;
import com.bhoomisetu.entity.Notification;
import com.bhoomisetu.service.ExecutiveService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/executive")
public class ExecutiveController {

    private final ExecutiveService executiveService;

    public ExecutiveController(ExecutiveService executiveService) {
        this.executiveService = executiveService;
    }

    @GetMapping({"/stats", "/dashboard/stats", "/dashboard"})
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(executiveService.getExecutiveStats());
    }

    @GetMapping("/projects")
    public ResponseEntity<List<Map<String, Object>>> getProjects() {
        return ResponseEntity.ok(executiveService.getProjects());
    }

    @GetMapping("/projects/{projectId}")
    public ResponseEntity<Map<String, Object>> getProjectById(@PathVariable String projectId) {
        return ResponseEntity.ok(executiveService.getProjectById(projectId));
    }

    @GetMapping("/projects/{projectId}/parcels")
    public ResponseEntity<Map<String, Object>> getProjectParcels(@PathVariable String projectId) {
        return ResponseEntity.ok(executiveService.getProjectParcels(projectId));
    }

    @GetMapping("/map")
    public ResponseEntity<Map<String, Object>> getExecutiveMapData(
            @RequestParam(required = false) String projectId,
            @RequestParam(required = false) String village
    ) {
        return ResponseEntity.ok(executiveService.getExecutiveMapData(projectId, village));
    }

    @GetMapping("/acquisition")
    public ResponseEntity<List<LandParcel>> getAcquisitionCases(
            @RequestParam(required = false) String projectId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String village
    ) {
        return ResponseEntity.ok(executiveService.getAcquisitionCases(projectId, status, village));
    }

    @GetMapping("/compensation")
    public ResponseEntity<Map<String, Object>> getCompensationMonitoring() {
        return ResponseEntity.ok(executiveService.getCompensationMonitoring());
    }

    @GetMapping("/r-and-r")
    public ResponseEntity<Map<String, Object>> getRnRMonitoring() {
        return ResponseEntity.ok(executiveService.getRnRMonitoring());
    }

    @GetMapping({"/issues", "/escalations"})
    public ResponseEntity<List<Map<String, Object>>> getIssues() {
        return ResponseEntity.ok(executiveService.getIssues());
    }

    @PostMapping({"/issues", "/escalations"})
    public ResponseEntity<Map<String, Object>> raiseIssue(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(executiveService.raiseIssue(payload));
    }

    @PutMapping({"/issues/{issueId}", "/escalations/{issueId}"})
    public ResponseEntity<Map<String, Object>> updateIssue(@PathVariable String issueId, @RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(executiveService.updateIssue(issueId, payload));
    }

    @GetMapping("/coordination")
    public ResponseEntity<List<Map<String, Object>>> getCoordinationItems() {
        return ResponseEntity.ok(executiveService.getCoordinationItems());
    }

    @GetMapping("/delayed-cases")
    public ResponseEntity<List<Map<String, Object>>> getDelayedCases() {
        return ResponseEntity.ok(executiveService.getDelayedCases());
    }

    @GetMapping("/officers")
    public ResponseEntity<List<Map<String, Object>>> getOfficers() {
        return ResponseEntity.ok(executiveService.getOfficerPerformance());
    }

    @GetMapping("/audit")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(executiveService.getAuditLogs());
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<Notification>> getNotifications() {
        return ResponseEntity.ok(executiveService.getNotifications());
    }
}
