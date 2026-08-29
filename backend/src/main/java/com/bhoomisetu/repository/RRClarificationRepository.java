package com.bhoomisetu.repository;

import com.bhoomisetu.entity.RRClarificationRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RRClarificationRepository extends JpaRepository<RRClarificationRequest, Long> {
    List<RRClarificationRequest> findByCaseId(String caseId);
    List<RRClarificationRequest> findByClaimantEmail(String claimantEmail);
}
