package com.bhoomisetu.controller;

import com.bhoomisetu.entity.Objection;
import com.bhoomisetu.service.ObjectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/objections")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ObjectionController {

    @Autowired
    private ObjectionService objectionService;

    @GetMapping
    public ResponseEntity<List<Objection>> getObjections(
            @RequestParam(required = false) String projectId,
            @RequestParam(required = false) String khasraNumber,
            @RequestParam(required = false) String claimantEmail
    ) {
        if (projectId != null && !projectId.isEmpty()) {
            return ResponseEntity.ok(objectionService.getByProjectId(projectId));
        }
        if (khasraNumber != null && !khasraNumber.isEmpty()) {
            return ResponseEntity.ok(objectionService.getByKhasraNumber(khasraNumber));
        }
        if (claimantEmail != null && !claimantEmail.isEmpty()) {
            return ResponseEntity.ok(objectionService.getByClaimantEmail(claimantEmail));
        }
        return ResponseEntity.ok(objectionService.getAllObjections());
    }

    @GetMapping("/{objectionId}")
    public ResponseEntity<Objection> getByObjectionId(@PathVariable String objectionId) {
        return objectionService.getByObjectionId(objectionId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Objection> submitObjection(@RequestBody Objection objection) {
        return ResponseEntity.ok(objectionService.saveObjection(objection));
    }
}
