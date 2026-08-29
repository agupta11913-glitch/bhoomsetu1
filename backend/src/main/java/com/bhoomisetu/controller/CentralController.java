package com.bhoomisetu.controller;

import com.bhoomisetu.service.CentralService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/central")
public class CentralController {

    @Autowired
    private CentralService centralService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getCentralDashboard() {
        return ResponseEntity.ok(centralService.getCentralDashboard());
    }

    @GetMapping("/states")
    public ResponseEntity<List<Map<String, Object>>> getCentralStates() {
        return ResponseEntity.ok(centralService.getCentralStates());
    }

    @GetMapping("/projects")
    public ResponseEntity<List<Map<String, Object>>> getCentralProjects(
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String district) {
        return ResponseEntity.ok(centralService.getCentralProjects(state, district));
    }

    @GetMapping("/map")
    public ResponseEntity<Map<String, Object>> getCentralMap(
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String district) {
        return ResponseEntity.ok(centralService.getCentralMapData(state, district));
    }

    @GetMapping("/acquisition")
    public ResponseEntity<List<Map<String, Object>>> getCentralAcquisition() {
        return ResponseEntity.ok(centralService.getCentralAcquisition());
    }

    @GetMapping("/compensation-rnr")
    public ResponseEntity<List<Map<String, Object>>> getCentralCompensationRnR() {
        return ResponseEntity.ok(centralService.getCentralCompensationRnR());
    }

    @GetMapping("/compensation")
    public ResponseEntity<List<Map<String, Object>>> getCentralCompensation() {
        return ResponseEntity.ok(centralService.getCentralCompensationRnR());
    }

    @GetMapping("/r-and-r")
    public ResponseEntity<List<Map<String, Object>>> getCentralRnR() {
        return ResponseEntity.ok(centralService.getCentralCompensationRnR());
    }

    @GetMapping("/disputes")
    public ResponseEntity<List<Map<String, Object>>> getCentralDisputes() {
        return ResponseEntity.ok(centralService.getCentralDisputes());
    }

    @GetMapping("/escalations")
    public ResponseEntity<List<Map<String, Object>>> getCentralEscalations(
            @RequestParam(required = false, defaultValue = "ALL") String status) {
        return ResponseEntity.ok(centralService.getCentralEscalations(status));
    }

    @PostMapping("/escalations/{id}/remark")
    public ResponseEntity<Map<String, Object>> addEscalationRemark(
            @PathVariable String id,
            @RequestBody Map<String, Object> payload,
            Authentication auth) {
        String email = auth != null ? auth.getName() : "central.officer@bhoomisetu.gov.in";
        return ResponseEntity.ok(centralService.addEscalationRemark(id, payload, email));
    }

    @PostMapping("/escalations/{id}/forward")
    public ResponseEntity<Map<String, Object>> forwardEscalation(
            @PathVariable String id,
            @RequestBody Map<String, Object> payload,
            Authentication auth) {
        String email = auth != null ? auth.getName() : "central.officer@bhoomisetu.gov.in";
        return ResponseEntity.ok(centralService.forwardEscalation(id, payload, email));
    }

    @PutMapping("/escalations/{id}/status")
    public ResponseEntity<Map<String, Object>> updateEscalationStatus(
            @PathVariable String id,
            @RequestBody Map<String, Object> payload,
            Authentication auth) {
        String email = auth != null ? auth.getName() : "central.officer@bhoomisetu.gov.in";
        return ResponseEntity.ok(centralService.updateEscalationStatus(id, payload, email));
    }

    @GetMapping("/reports")
    public ResponseEntity<Map<String, Object>> getCentralReports() {
        return ResponseEntity.ok(centralService.getCentralReports());
    }
}
