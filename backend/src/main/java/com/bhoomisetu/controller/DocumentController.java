package com.bhoomisetu.controller;

import com.bhoomisetu.entity.Document;
import com.bhoomisetu.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @GetMapping
    public ResponseEntity<List<Document>> getDocuments(
            @RequestParam(required = false) String caseId,
            @RequestParam(required = false) String khasraNumber
    ) {
        if (caseId != null && !caseId.isEmpty()) {
            return ResponseEntity.ok(documentService.getByCaseId(caseId));
        }
        if (khasraNumber != null && !khasraNumber.isEmpty()) {
            return ResponseEntity.ok(documentService.getByKhasraNumber(khasraNumber));
        }
        return ResponseEntity.ok(documentService.getAllDocuments());
    }

    @PostMapping
    public ResponseEntity<Document> uploadDocument(@RequestBody Document document) {
        return ResponseEntity.ok(documentService.saveDocument(document));
    }
}
