package com.bhoomisetu.controller;

import com.bhoomisetu.service.StateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/state")
@CrossOrigin(origins = "*", maxAge = 3600)
public class StateController {

    @Autowired
    private StateService stateService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getStateDashboard(@RequestParam(required = false, defaultValue = "Uttar Pradesh") String state) {
        return ResponseEntity.ok(stateService.getStateDashboard(state));
    }

    @GetMapping("/districts")
    public ResponseEntity<List<Map<String, Object>>> getStateDistricts(@RequestParam(required = false, defaultValue = "Uttar Pradesh") String state) {
        return ResponseEntity.ok(stateService.getStateDistricts(state));
    }

    @GetMapping("/projects")
    public ResponseEntity<List<Map<String, Object>>> getStateProjects(
            @RequestParam(required = false, defaultValue = "Uttar Pradesh") String state,
            @RequestParam(required = false) String district) {
        return ResponseEntity.ok(stateService.getStateProjects(state, district));
    }

    @GetMapping("/map")
    public ResponseEntity<Map<String, Object>> getStateMap(
            @RequestParam(required = false, defaultValue = "Uttar Pradesh") String state,
            @RequestParam(required = false) String district) {
        return ResponseEntity.ok(stateService.getStateMapData(state, district));
    }

    @GetMapping("/acquisition")
    public ResponseEntity<List<Map<String, Object>>> getStateAcquisition(@RequestParam(required = false, defaultValue = "Uttar Pradesh") String state) {
        return ResponseEntity.ok(stateService.getStateAcquisition(state));
    }

    @GetMapping("/compensation")
    public ResponseEntity<Map<String, Object>> getStateCompensation(@RequestParam(required = false, defaultValue = "Uttar Pradesh") String state) {
        Map<String, Object> res = new LinkedHashMap<>();
        res.put("state", state);
        res.put("totalPoolCr", 840.0);
        res.put("disbursedCr", 612.4);
        res.put("pendingCr", 227.6);
        res.put("dbtSuccessRatePct", 98.4);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/r-and-r")
    public ResponseEntity<Map<String, Object>> getStateRnR(@RequestParam(required = false, defaultValue = "Uttar Pradesh") String state) {
        Map<String, Object> res = new LinkedHashMap<>();
        res.put("state", state);
        res.put("totalFamilies", 4120);
        res.put("resettledFamilies", 3450);
        res.put("housingUnitsDelivered", 2890);
        res.put("grantsDisbursedCr", 34.5);
        res.put("complianceRatePct", 83.7);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/compensation-rnr")
    public ResponseEntity<List<Map<String, Object>>> getStateCompensationRnR(@RequestParam(required = false, defaultValue = "Uttar Pradesh") String state) {
        return ResponseEntity.ok(stateService.getStateCompensationRnR(state));
    }

    @GetMapping("/disputes")
    public ResponseEntity<List<Map<String, Object>>> getStateDisputes(@RequestParam(required = false, defaultValue = "Uttar Pradesh") String state) {
        return ResponseEntity.ok(stateService.getStateDisputes(state));
    }

    @GetMapping("/escalations")
    public ResponseEntity<List<Map<String, Object>>> getStateEscalations(
            @RequestParam(required = false, defaultValue = "Uttar Pradesh") String state,
            @RequestParam(required = false, defaultValue = "ALL") String status) {
        return ResponseEntity.ok(stateService.getStateEscalations(state, status));
    }

    @PostMapping("/escalations/{id}/remark")
    public ResponseEntity<Map<String, Object>> addEscalationRemark(
            @PathVariable String id,
            @RequestBody Map<String, Object> payload,
            Authentication auth) {
        String email = auth != null ? auth.getName() : "state.officer@bhoomisetu.gov.in";
        return ResponseEntity.ok(stateService.addEscalationRemark(id, payload, email));
    }

    @PostMapping("/escalations/{id}/forward")
    public ResponseEntity<Map<String, Object>> forwardEscalation(
            @PathVariable String id,
            @RequestBody Map<String, Object> payload,
            Authentication auth) {
        String email = auth != null ? auth.getName() : "state.officer@bhoomisetu.gov.in";
        return ResponseEntity.ok(stateService.forwardEscalation(id, payload, email));
    }

    @PostMapping("/escalations/{id}/escalate")
    public ResponseEntity<Map<String, Object>> escalateToChiefSecretary(
            @PathVariable String id,
            @RequestBody Map<String, Object> payload,
            Authentication auth) {
        String email = auth != null ? auth.getName() : "state.officer@bhoomisetu.gov.in";
        return ResponseEntity.ok(stateService.escalateToChiefSecretary(id, payload, email));
    }

    @PutMapping("/escalations/{id}/status")
    public ResponseEntity<Map<String, Object>> updateEscalationStatus(
            @PathVariable String id,
            @RequestBody Map<String, Object> payload,
            Authentication auth) {
        String email = auth != null ? auth.getName() : "state.officer@bhoomisetu.gov.in";
        return ResponseEntity.ok(stateService.updateEscalationStatus(id, payload, email));
    }

    @GetMapping("/reports")
    public ResponseEntity<Map<String, Object>> getStateReports(@RequestParam(required = false, defaultValue = "Uttar Pradesh") String state) {
        return ResponseEntity.ok(stateService.getStateReports(state));
    }
}
