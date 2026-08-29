package com.bhoomisetu.service;

import com.bhoomisetu.entity.RehabilitationBenefit;
import com.bhoomisetu.entity.RRClarificationRequest;
import com.bhoomisetu.repository.RehabilitationBenefitRepository;
import com.bhoomisetu.repository.RRClarificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RehabilitationService {

    @Autowired
    private RehabilitationBenefitRepository benefitRepository;

    @Autowired
    private RRClarificationRepository clarificationRepository;

    public List<RehabilitationBenefit> getAllBenefits() {
        return benefitRepository.findAll();
    }

    public List<RehabilitationBenefit> getBenefitsByCaseId(String caseId) {
        return benefitRepository.findByCaseId(caseId);
    }

    public List<RehabilitationBenefit> getBenefitsByKhasra(String khasra) {
        return benefitRepository.findByKhasraNumber(khasra);
    }

    public Map<String, Object> getCaseSummary(String caseId) {
        List<RehabilitationBenefit> benefits = benefitRepository.findByCaseId(caseId);
        Map<String, Object> summary = new HashMap<>();
        summary.put("caseId", caseId);
        summary.put("pafName", benefits.isEmpty() ? "Sh. Ram Kumar Family" : benefits.get(0).getPafName());
        summary.put("overallEligibility", "Eligible");
        summary.put("totalEntitlementsCount", benefits.size());

        double totalDisbursed = benefits.stream()
                .filter(b -> "DISBURSED".equalsIgnoreCase(b.getPaymentStatus()) && b.getAmountNumeric() != null)
                .mapToDouble(RehabilitationBenefit::getAmountNumeric)
                .sum();
        summary.put("totalDisbursedAmount", totalDisbursed);

        long approvedCount = benefits.stream().filter(b -> "APPROVED".equalsIgnoreCase(b.getStatus()) || "DISBURSED".equalsIgnoreCase(b.getStatus())).count();
        long pendingCount = benefits.stream().filter(b -> "PENDING".equalsIgnoreCase(b.getPaymentStatus()) || "UNDER_VERIFICATION".equalsIgnoreCase(b.getStatus())).count();

        summary.put("approvedCount", approvedCount);
        summary.put("pendingCount", pendingCount);
        summary.put("legalBasis", "RFCTLARR Act, 2013 – Second Schedule");
        return summary;
    }

    public List<Map<String, Object>> getDisbursementsByCaseId(String caseId) {
        List<RehabilitationBenefit> benefits = benefitRepository.findByCaseId(caseId);
        List<Map<String, Object>> payments = new ArrayList<>();
        for (RehabilitationBenefit b : benefits) {
            if (b.getPaymentStatus() != null && !"NOT_APPLICABLE".equalsIgnoreCase(b.getPaymentStatus())) {
                Map<String, Object> pay = new HashMap<>();
                pay.put("benefitName", b.getBenefitName());
                pay.put("amount", b.getAmountDisplay());
                pay.put("paymentStatus", b.getPaymentStatus());
                pay.put("paymentDate", b.getPaymentDate() != null ? b.getPaymentDate() : "Pending");
                pay.put("utr", b.getUtrNumber() != null ? b.getUtrNumber() : "PFMS-QUEUE-" + b.getId());
                pay.put("paymentMode", b.getPaymentMode() != null ? b.getPaymentMode() : "DBT / PFMS");
                pay.put("remarks", b.getRemarks());
                payments.add(pay);
            }
        }
        return payments;
    }

    public List<Map<String, Object>> getDocumentsByCaseId(String caseId) {
        List<Map<String, Object>> docs = new ArrayList<>();
        docs.add(createDoc("RR-ASSESS-2026-0101", "R&R Baseline Family Assessment & PAF Verification", "Assessment Report", "10 Jan 2026", "VERIFIED", "PDF"));
        docs.add(createDoc("RR-AWARD-SEC-II-0101", "Second Schedule Statutory Entitlement Determination Award", "Award Order", "25 Jan 2026", "APPROVED", "PDF"));
        docs.add(createDoc("RR-HOUSING-VER-0101", "PMAY Rural / State Gramin Awas Verification Survey", "Verification Report", "05 Feb 2026", "UNDER_REVIEW", "PDF"));
        docs.add(createDoc("PFMS-RR-SANCTION-839", "Resettlement Grant PFMS Direct Bank Mandate Order", "Sanction Order", "15 Feb 2026", "DISBURSED", "PDF"));
        docs.add(createDoc("DBT-ACK-839201", "Public Financial Management System (PFMS) Payout Acknowledgment", "Bank Receipt", "20 Feb 2026", "CREDITED", "PDF"));
        docs.add(createDoc("RR-COMPLIANCE-INT-0101", "Interim Rehabilitation Compliance & Handover Certificate", "Statutory Certificate", "22 Feb 2026", "ACTIVE", "PDF"));
        return docs;
    }

    private Map<String, Object> createDoc(String id, String title, String type, String date, String status, String format) {
        Map<String, Object> d = new HashMap<>();
        d.put("docId", id);
        d.put("title", title);
        d.put("type", type);
        d.put("date", date);
        d.put("status", status);
        d.put("format", format);
        return d;
    }

    public RRClarificationRequest saveClarification(RRClarificationRequest request) {
        return clarificationRepository.save(request);
    }

    public List<RRClarificationRequest> getClarificationsByCaseId(String caseId) {
        return clarificationRepository.findByCaseId(caseId);
    }

    public RehabilitationBenefit saveBenefit(RehabilitationBenefit benefit) {
        return benefitRepository.save(benefit);
    }
}
