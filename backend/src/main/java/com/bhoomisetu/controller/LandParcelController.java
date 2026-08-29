package com.bhoomisetu.controller;

import com.bhoomisetu.entity.LandParcel;
import com.bhoomisetu.service.LandParcelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", maxAge = 3600)
public class LandParcelController {

    @Autowired
    private LandParcelService landParcelService;

    @GetMapping({"/lands", "/khasras"})
    public ResponseEntity<List<LandParcel>> getAllLandParcels(
            @RequestParam(required = false) String projectId,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String email
    ) {
        if (projectId != null && !projectId.isEmpty()) {
            return ResponseEntity.ok(landParcelService.getByProjectId(projectId));
        }
        if (district != null && !district.isEmpty()) {
            return ResponseEntity.ok(landParcelService.getByDistrict(district));
        }
        if (email != null && !email.isEmpty()) {
            return ResponseEntity.ok(landParcelService.getByEmail(email));
        }
        return ResponseEntity.ok(landParcelService.getAllLandParcels());
    }

    @GetMapping({"/lands/{khasraNumber}", "/khasras/{khasraNumber}"})
    public ResponseEntity<LandParcel> getByKhasraNumber(@PathVariable String khasraNumber) {
        return landParcelService.getByKhasraNumber(khasraNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping({"/citizen/my-land", "/citizens/{citizenId}/land-records", "/lands/owner/{ownerEmailPath}"})
    public ResponseEntity<List<LandParcel>> getCitizenLandRecords(
            @PathVariable(required = false) String citizenId,
            @PathVariable(required = false) String ownerEmailPath,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String userEmail,
            @RequestParam(required = false) String ownerEmail
    ) {
        String queryEmail = null;
        if (email != null && email.contains("@")) {
            queryEmail = email;
        } else if (ownerEmailPath != null && ownerEmailPath.contains("@")) {
            queryEmail = ownerEmailPath;
        } else if (citizenId != null && citizenId.contains("@")) {
            queryEmail = citizenId;
        } else if (userEmail != null && userEmail.contains("@")) {
            queryEmail = userEmail;
        } else if (ownerEmail != null && ownerEmail.contains("@")) {
            queryEmail = ownerEmail;
        } else if ("USR-001".equalsIgnoreCase(citizenId) || "CIT-001".equalsIgnoreCase(citizenId)) {
            queryEmail = "citizen@demo.com";
        } else if ("USR-002".equalsIgnoreCase(citizenId) || "CIT-002".equalsIgnoreCase(citizenId)) {
            queryEmail = "ramesh.chandra@example.com";
        } else {
            queryEmail = "citizen@demo.com";
        }

        List<LandParcel> parcels = landParcelService.getByEmail(queryEmail);
        return ResponseEntity.ok(parcels);
    }

    @PostMapping({"/lands", "/khasras"})
    public ResponseEntity<LandParcel> createLandParcel(@RequestBody LandParcel parcel) {
        return ResponseEntity.ok(landParcelService.saveLandParcel(parcel));
    }

    @PostMapping({"/lands/{khasraNumber}/verify-revenue", "/khasras/{khasraNumber}/verify-revenue"})
    public ResponseEntity<LandParcel> verifyRevenueRecord(
            @PathVariable String khasraNumber,
            @RequestBody(required = false) Map<String, String> body
    ) {
        String notes = body != null ? body.getOrDefault("notes", "Revenue verification completed.") : "Revenue verification completed.";
        LandParcel updated = landParcelService.verifyRevenueRecord(khasraNumber, notes);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping({"/lands/{khasraNumber}/verify-gis", "/khasras/{khasraNumber}/verify-gis"})
    public ResponseEntity<LandParcel> verifyGISBoundary(
            @PathVariable String khasraNumber,
            @RequestBody(required = false) Map<String, String> body
    ) {
        String notes = body != null ? body.getOrDefault("notes", "GIS boundary demarcated.") : "GIS boundary demarcated.";
        LandParcel updated = landParcelService.verifyGISBoundary(khasraNumber, notes);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }
}
