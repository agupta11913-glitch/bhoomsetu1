package com.bhoomisetu.controller;

import com.bhoomisetu.service.AgencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/agency")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AgencyController {

    @Autowired
    private AgencyService agencyService;

    @GetMapping({"/dashboard", "/stats"})
    public ResponseEntity<Map<String, Object>> getDashboard(
            @RequestParam(required = false) String agency,
            Principal principal
    ) {
        String email = principal != null ? principal.getName() : null;
        return ResponseEntity.ok(agencyService.getAgencyDashboard(email, agency));
    }

    @GetMapping("/projects")
    public ResponseEntity<List<Map<String, Object>>> getProjects(
            @RequestParam(required = false) String agency,
            Principal principal
    ) {
        String email = principal != null ? principal.getName() : null;
        return ResponseEntity.ok(agencyService.getAssignedProjects(email, agency));
    }

    @PutMapping("/projects/{projectId}/progress")
    public ResponseEntity<Map<String, Object>> updateProjectProgress(
            @PathVariable String projectId,
            @RequestBody Map<String, Object> payload,
            Principal principal
    ) {
        String email = principal != null ? principal.getName() : null;
        return ResponseEntity.ok(agencyService.updateProjectProgress(projectId, payload, email));
    }

    @PostMapping("/projects/{projectId}/remark")
    public ResponseEntity<Map<String, Object>> addProjectRemark(
            @PathVariable String projectId,
            @RequestBody Map<String, Object> payload,
            Principal principal
    ) {
        String email = principal != null ? principal.getName() : null;
        return ResponseEntity.ok(agencyService.addProjectRemark(projectId, payload, email));
    }

    @GetMapping({"/progress", "/milestones"})
    public ResponseEntity<List<Map<String, Object>>> getMilestones(
            @RequestParam(required = false) String projectId,
            @RequestParam(required = false) String agency,
            Principal principal
    ) {
        String email = principal != null ? principal.getName() : null;
        return ResponseEntity.ok(agencyService.getProjectMilestones(projectId, email, agency));
    }

    @PutMapping("/milestones/{milestoneId}")
    public ResponseEntity<Map<String, Object>> updateMilestone(
            @PathVariable String milestoneId,
            @RequestBody Map<String, Object> payload,
            Principal principal
    ) {
        String email = principal != null ? principal.getName() : null;
        return ResponseEntity.ok(agencyService.updateMilestoneProgress(milestoneId, payload, email));
    }

    @GetMapping("/map")
    public ResponseEntity<Map<String, Object>> getAgencyMap(
            @RequestParam(required = false) String projectId,
            @RequestParam(required = false) String agency,
            Principal principal
    ) {
        String email = principal != null ? principal.getName() : null;
        return ResponseEntity.ok(agencyService.getAgencyMapData(projectId, email, agency));
    }

    @GetMapping("/acquisition")
    public ResponseEntity<List<Map<String, Object>>> getAcquisition(
            @RequestParam(required = false) String agency,
            Principal principal
    ) {
        String email = principal != null ? principal.getName() : null;
        return ResponseEntity.ok(agencyService.getAgencyAcquisition(email, agency));
    }

    @GetMapping({"/compensation-rnr", "/compensation"})
    public ResponseEntity<List<Map<String, Object>>> getCompensationRnR(
            @RequestParam(required = false) String agency,
            Principal principal
    ) {
        String email = principal != null ? principal.getName() : null;
        return ResponseEntity.ok(agencyService.getAgencyCompensationRnR(email, agency));
    }

    @GetMapping({"/issues", "/disputes"})
    public ResponseEntity<List<Map<String, Object>>> getIssues(
            @RequestParam(required = false, defaultValue = "ALL") String status,
            @RequestParam(required = false) String agency,
            Principal principal
    ) {
        String email = principal != null ? principal.getName() : null;
        return ResponseEntity.ok(agencyService.getAgencyIssues(status, email, agency));
    }

    @PostMapping({"/issues", "/disputes"})
    public ResponseEntity<Map<String, Object>> reportIssue(
            @RequestBody Map<String, Object> payload,
            Principal principal
    ) {
        String email = principal != null ? principal.getName() : null;
        return ResponseEntity.ok(agencyService.reportAgencyIssue(payload, email));
    }

    @PostMapping("/issues/{issueId}/remark")
    public ResponseEntity<Map<String, Object>> addIssueRemark(
            @PathVariable String issueId,
            @RequestBody Map<String, Object> payload,
            Principal principal
    ) {
        String email = principal != null ? principal.getName() : null;
        return ResponseEntity.ok(agencyService.addAgencyIssueRemark(issueId, payload, email));
    }

    @PostMapping("/issues/{issueId}/forward")
    public ResponseEntity<Map<String, Object>> forwardIssue(
            @PathVariable String issueId,
            @RequestBody Map<String, Object> payload,
            Principal principal
    ) {
        String email = principal != null ? principal.getName() : null;
        return ResponseEntity.ok(agencyService.forwardAgencyIssue(issueId, payload, email));
    }

    @GetMapping("/documents")
    public ResponseEntity<List<Map<String, Object>>> getDocuments(
            @RequestParam(required = false) String projectId,
            @RequestParam(required = false) String agency,
            Principal principal
    ) {
        String email = principal != null ? principal.getName() : null;
        return ResponseEntity.ok(agencyService.getAgencyDocuments(projectId, email, agency));
    }

    @PostMapping("/documents")
    public ResponseEntity<Map<String, Object>> uploadDocument(
            @RequestBody Map<String, Object> payload,
            Principal principal
    ) {
        String email = principal != null ? principal.getName() : null;
        return ResponseEntity.ok(agencyService.uploadAgencyDocument(payload, email));
    }

    @GetMapping("/reports")
    public ResponseEntity<Map<String, Object>> getReports(
            @RequestParam(required = false) String agency,
            Principal principal
    ) {
        String email = principal != null ? principal.getName() : null;
        return ResponseEntity.ok(agencyService.getAgencyReports(email, agency));
    }
}
