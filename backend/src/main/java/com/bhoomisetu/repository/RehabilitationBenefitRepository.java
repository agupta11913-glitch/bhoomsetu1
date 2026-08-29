package com.bhoomisetu.repository;

import com.bhoomisetu.entity.RehabilitationBenefit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RehabilitationBenefitRepository extends JpaRepository<RehabilitationBenefit, Long> {
    List<RehabilitationBenefit> findByCaseId(String caseId);
    List<RehabilitationBenefit> findByKhasraNumber(String khasraNumber);
    List<RehabilitationBenefit> findByPaymentStatus(String paymentStatus);
}
