package com.bhoomisetu.repository;

import com.bhoomisetu.entity.Objection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ObjectionRepository extends JpaRepository<Objection, Long> {
    Optional<Objection> findByObjectionId(String objectionId);
    List<Objection> findByKhasraNumber(String khasraNumber);
    List<Objection> findByProjectId(String projectId);
    List<Objection> findByClaimantEmail(String claimantEmail);
}
