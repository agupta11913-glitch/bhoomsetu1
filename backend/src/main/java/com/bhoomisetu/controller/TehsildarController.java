package com.bhoomisetu.controller;

import com.bhoomisetu.entity.LandParcel;
import com.bhoomisetu.entity.Notification;
import com.bhoomisetu.entity.Objection;
import com.bhoomisetu.entity.RehabilitationBenefit;
import com.bhoomisetu.service.TehsildarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tehsildar")
public class TehsildarController {

    @Autowired
    private TehsildarService tehsildarService;

    @GetMapping({"/stats", "/dashboard/stats"})
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(tehsildarService.getDashboardStats());
    }

    @GetMapping("/cases")
    public ResponseEntity<List<LandParcel>> getCases(
            @RequestParam(required = false) String projectId,
            @RequestParam(required = false) String village,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String verificationStatus,
            @RequestParam(required = false) String search
    ) {
        return ResponseEntity.ok(tehsildarService.getCases(projectId, village, status, verificationStatus, search));
    }

    @GetMapping("/cases/{caseId}")
    public ResponseEntity<LandParcel> getCaseById(@PathVariable String caseId) {
        return tehsildarService.getCaseById(caseId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/cases/{caseId}/approve")
    public ResponseEntity<LandParcel> approveCase(
            @PathVariable String caseId,
            @RequestBody(required = false) Map<String, String> body,
            Principal principal
    ) {
        String remarks = body != null ? body.getOrDefault("remarks", "Approved by Tehsildar") : "Approved by Tehsildar";
        String officerEmail = principal != null ? principal.getName() : "tehsildar@demo.gov.in";
        LandParcel updated = tehsildarService.approveCase(caseId, remarks, officerEmail);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/cases/{caseId}/reject")
    public ResponseEntity<LandParcel> rejectCase(
            @PathVariable String caseId,
            @RequestBody(required = false) Map<String, String> body,
            Principal principal
    ) {
        String reason = body != null ? body.getOrDefault("reason", "Verification rejected by Tehsildar") : "Verification rejected by Tehsildar";
        String officerEmail = principal != null ? principal.getName() : "tehsildar@demo.gov.in";
        LandParcel updated = tehsildarService.rejectCase(caseId, reason, officerEmail);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/cases/{caseId}/send-back")
    public ResponseEntity<LandParcel> sendBackCase(
            @PathVariable String caseId,
            @RequestBody(required = false) Map<String, String> body,
            Principal principal
    ) {
        String remarks = body != null ? body.getOrDefault("remarks", "Sent back to Revenue Officer for rectification") : "Sent back to Revenue Officer for rectification";
        String officerEmail = principal != null ? principal.getName() : "tehsildar@demo.gov.in";
        LandParcel updated = tehsildarService.sendBackCase(caseId, remarks, officerEmail);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/objections")
    public ResponseEntity<List<Objection>> getObjections(
            @RequestParam(required = false) String projectId,
            @RequestParam(required = false) String status
    ) {
        return ResponseEntity.ok(tehsildarService.getObjections(projectId, status));
    }

    @PostMapping("/objections/{objectionId}/action")
    public ResponseEntity<Objection> actOnObjection(
            @PathVariable String objectionId,
            @RequestBody Map<String, String> body,
            Principal principal
    ) {
        String action = body.getOrDefault("action", "ACCEPT");
        String remarks = body.getOrDefault("remarks", "Processed by Tehsildar");
        String officerEmail = principal != null ? principal.getName() : "tehsildar@demo.gov.in";
        Objection updated = tehsildarService.actOnObjection(objectionId, action, remarks, officerEmail);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/compensation")
    public ResponseEntity<List<Map<String, Object>>> getCompensation() {
        return ResponseEntity.ok(tehsildarService.getCompensationAwards());
    }

    @GetMapping({"/r-and-r", "/rr-benefits"})
    public ResponseEntity<List<RehabilitationBenefit>> getRRBenefits() {
        return ResponseEntity.ok(tehsildarService.getRRBenefits());
    }

    @GetMapping("/documents")
    public ResponseEntity<List<Map<String, Object>>> getDocuments(
            @RequestParam(required = false) String caseId,
            @RequestParam(required = false) String category
    ) {
        return ResponseEntity.ok(tehsildarService.getDocuments(caseId, category));
    }

    @GetMapping("/reports")
    public ResponseEntity<Map<String, Object>> getReports(
            @RequestParam(required = false) String projectId,
            @RequestParam(required = false) String village
    ) {
        return ResponseEntity.ok(tehsildarService.getReports(projectId, village));
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<Notification>> getNotifications(Principal principal) {
        String officerEmail = principal != null ? principal.getName() : "tehsildar@demo.gov.in";
        return ResponseEntity.ok(tehsildarService.getNotifications(officerEmail));
    }

    // =========================================================================
    // VILLAGE-WISE & HIGHWAY CORRIDOR GIS INTEGRATION ENDPOINTS
    // =========================================================================

    @GetMapping("/gis/hierarchy")
    public ResponseEntity<Map<String, Object>> getGisHierarchy() {
        return ResponseEntity.ok(tehsildarService.getGisHierarchy());
    }

    @GetMapping("/gis/village/{villageName}/stats")
    public ResponseEntity<Map<String, Object>> getVillageGisStats(@PathVariable String villageName) {
        return ResponseEntity.ok(tehsildarService.getVillageGisStats(villageName));
    }

    @GetMapping("/gis/village/{villageName}/parcels")
    public ResponseEntity<List<LandParcel>> getVillageAffectedParcels(@PathVariable String villageName) {
        return ResponseEntity.ok(tehsildarService.getVillageAffectedParcels(villageName));
    }

    @GetMapping("/gis/highway-corridor")
    public ResponseEntity<Map<String, Object>> getHighwayCorridorGis(@RequestParam(required = false) String projectId) {
        return ResponseEntity.ok(tehsildarService.getHighwayCorridorGis(projectId));
    }
}
