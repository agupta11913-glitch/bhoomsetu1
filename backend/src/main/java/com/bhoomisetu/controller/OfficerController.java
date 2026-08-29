package com.bhoomisetu.controller;

import com.bhoomisetu.entity.LandParcel;
import com.bhoomisetu.service.OfficerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.*;

@RestController
@RequestMapping("/api/officer")
public class OfficerController {

    @Autowired
    private OfficerService officerService;

    private String extractRole(Authentication auth) {
        if (auth == null || auth.getAuthorities() == null || auth.getAuthorities().isEmpty()) {
            return "TEHSILDAR";
        }
        for (GrantedAuthority ga : auth.getAuthorities()) {
            String role = ga.getAuthority().replace("ROLE_", "");
            if ("TEHSILDAR".equalsIgnoreCase(role) || "EXECUTIVE_OFFICER".equalsIgnoreCase(role) ||
                "GOVERNMENT_OFFICER".equalsIgnoreCase(role) || "PROJECT_AGENCY".equalsIgnoreCase(role)) {
                return role;
            }
        }
        return "TEHSILDAR";
    }

    /**
     * Unified Role-Aware Officer Dashboard
     */
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(Authentication auth, Principal principal) {
        String role = extractRole(auth);
        String email = principal != null ? principal.getName() : "officer@demo.gov.in";
        return ResponseEntity.ok(officerService.getDashboard(role, email));
    }

    /**
     * Cases Management (Role-Scoped)
     */
    @GetMapping("/cases")
    public ResponseEntity<List<LandParcel>> getCases(
            @RequestParam(required = false, defaultValue = "ALL") String status,
            @RequestParam(required = false) String village,
            @RequestParam(required = false) String search,
            Authentication auth
    ) {
        String role = extractRole(auth);
        return ResponseEntity.ok(officerService.getCases(role, status, village, search));
    }

    @GetMapping("/cases/{caseId}")
    public ResponseEntity<LandParcel> getCaseDetails(@PathVariable String caseId) {
        Optional<LandParcel> details = officerService.getCaseDetails(caseId);
        return details.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Statutory Case Decisions (Strictly RBAC Enforced)
     */
    @PostMapping("/cases/{caseId}/approve")
    public ResponseEntity<?> approveCase(
            @PathVariable String caseId,
            @RequestBody(required = false) Map<String, String> body,
            Authentication auth,
            Principal principal
    ) {
        String role = extractRole(auth);
        String remarks = body != null ? body.getOrDefault("remarks", "Statutory Tehsildar Approval Granted") : "Statutory Tehsildar Approval Granted";
        String officerEmail = principal != null ? principal.getName() : "tehsildar@demo.gov.in";

        try {
            LandParcel updated = officerService.approveCase(caseId, remarks, officerEmail, role);
            if (updated != null) {
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Case " + caseId + " approved successfully by Tehsildar.",
                        "case", updated
                ));
            }
            return ResponseEntity.notFound().build();
        } catch (org.springframework.security.access.AccessDeniedException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                    "success", false,
                    "error", "FORBIDDEN",
                    "message", ex.getMessage()
            ));
        }
    }

    @PostMapping("/cases/{caseId}/reject")
    public ResponseEntity<?> rejectCase(
            @PathVariable String caseId,
            @RequestBody Map<String, String> body,
            Authentication auth,
            Principal principal
    ) {
        String role = extractRole(auth);
        String reason = body != null ? body.getOrDefault("reason", "Discrepancy in revenue records") : "Discrepancy in revenue records";
        String officerEmail = principal != null ? principal.getName() : "tehsildar@demo.gov.in";

        try {
            LandParcel updated = officerService.rejectCase(caseId, reason, officerEmail, role);
            if (updated != null) {
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Case " + caseId + " rejected by Tehsildar.",
                        "case", updated
                ));
            }
            return ResponseEntity.notFound().build();
        } catch (org.springframework.security.access.AccessDeniedException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                    "success", false,
                    "error", "FORBIDDEN",
                    "message", ex.getMessage()
            ));
        }
    }

    @PostMapping("/cases/{caseId}/send-back")
    public ResponseEntity<?> sendBackCase(
            @PathVariable String caseId,
            @RequestBody(required = false) Map<String, String> body,
            Authentication auth,
            Principal principal
    ) {
        String role = extractRole(auth);
        String remarks = body != null ? body.getOrDefault("remarks", "Sent back to Revenue Officer for rectification") : "Sent back to Revenue Officer for rectification";
        String officerEmail = principal != null ? principal.getName() : "tehsildar@demo.gov.in";

        try {
            LandParcel updated = officerService.sendBackCase(caseId, remarks, officerEmail, role);
            if (updated != null) {
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Case " + caseId + " returned to Revenue Officer for rectification.",
                        "case", updated
                ));
            }
            return ResponseEntity.notFound().build();
        } catch (org.springframework.security.access.AccessDeniedException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                    "success", false,
                    "error", "FORBIDDEN",
                    "message", ex.getMessage()
            ));
        }
    }

    /**
     * Projects & Issues
     */
    @GetMapping("/projects")
    public ResponseEntity<List<Map<String, Object>>> getProjects() {
        return ResponseEntity.ok(officerService.getProjects());
    }

    @GetMapping("/issues")
    public ResponseEntity<List<Map<String, Object>>> getIssues() {
        return ResponseEntity.ok(officerService.getIssues());
    }

    @PostMapping("/issues")
    public ResponseEntity<Map<String, Object>> createIssue(
            @RequestBody Map<String, Object> body,
            Principal principal
    ) {
        String officerEmail = principal != null ? principal.getName() : "officer@demo.gov.in";
        return ResponseEntity.ok(officerService.createIssue(body, officerEmail));
    }

    /**
     * Unified GIS Infrastructure
     */
    @GetMapping("/gis/hierarchy")
    public ResponseEntity<Map<String, Object>> getGisHierarchy() {
        return ResponseEntity.ok(officerService.getGisHierarchy());
    }

    @GetMapping("/gis/village/{villageName}/stats")
    public ResponseEntity<Map<String, Object>> getVillageGisStats(@PathVariable String villageName) {
        return ResponseEntity.ok(officerService.getVillageGisStats(villageName));
    }

    @GetMapping("/gis/village/{villageName}/parcels")
    public ResponseEntity<List<LandParcel>> getVillageAffectedParcels(@PathVariable String villageName) {
        return ResponseEntity.ok(officerService.getVillageAffectedParcels(villageName));
    }

    @GetMapping("/gis/highway-corridor")
    public ResponseEntity<Map<String, Object>> getHighwayCorridorGis(@RequestParam(required = false) String projectId) {
        return ResponseEntity.ok(officerService.getHighwayCorridorGis(projectId));
    }
}
