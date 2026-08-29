package com.bhoomisetu.service;

import com.bhoomisetu.entity.Document;
import com.bhoomisetu.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    public List<Document> getByCaseId(String caseId) {
        return documentRepository.findByCaseId(caseId);
    }

    public List<Document> getByKhasraNumber(String khasraNumber) {
        return documentRepository.findByKhasraNumber(khasraNumber);
    }

    public Document saveDocument(Document doc) {
        return documentRepository.save(doc);
    }
}
