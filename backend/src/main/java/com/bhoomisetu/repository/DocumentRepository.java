package com.bhoomisetu.repository;

import com.bhoomisetu.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByCaseId(String caseId);
    List<Document> findByKhasraNumber(String khasraNumber);
}
