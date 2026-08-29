package com.bhoomisetu.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "rehabilitation_benefits")
public class RehabilitationBenefit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "case_id", nullable = false)
    private String caseId;

    @Column(name = "khasra_number")
    private String khasraNumber;

    @Column(name = "paf_name", nullable = false)
    private String pafName;

    @Column(name = "benefit_name", nullable = false)
    private String benefitName;

    @Column(name = "benefit_type", nullable = false)
    private String benefitType;

    @Column(name = "eligibility", nullable = false)
    private String eligibility; // ELIGIBLE, NOT_ELIGIBLE, UNDER_VERIFICATION, NOT_APPLICABLE

    @Column(name = "amount_display")
    private String amountDisplay;

    @Column(name = "amount_numeric")
    private Double amountNumeric;

    @Column(name = "duration")
    private String duration;

    @Column(name = "status", nullable = false)
    private String status; // APPROVED, UNDER_VERIFICATION, ASSIGNED, NOT_APPLICABLE, DISBURSED, PENDING

    @Column(name = "payment_status")
    private String paymentStatus; // DISBURSED, PENDING, IN_PROCESS, NOT_APPLICABLE

    @Column(name = "payment_date")
    private String paymentDate;

    @Column(name = "utr_number")
    private String utrNumber;

    @Column(name = "payment_mode")
    private String paymentMode;

    @Column(name = "legal_basis")
    private String legalBasis;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public RehabilitationBenefit() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCaseId() { return caseId; }
    public void setCaseId(String caseId) { this.caseId = caseId; }

    public String getKhasraNumber() { return khasraNumber; }
    public void setKhasraNumber(String khasraNumber) { this.khasraNumber = khasraNumber; }

    public String getPafName() { return pafName; }
    public void setPafName(String pafName) { this.pafName = pafName; }

    public String getBenefitName() { return benefitName; }
    public void setBenefitName(String benefitName) { this.benefitName = benefitName; }

    public String getBenefitType() { return benefitType; }
    public void setBenefitType(String benefitType) { this.benefitType = benefitType; }

    public String getEligibility() { return eligibility; }
    public void setEligibility(String eligibility) { this.eligibility = eligibility; }

    public String getAmountDisplay() { return amountDisplay; }
    public void setAmountDisplay(String amountDisplay) { this.amountDisplay = amountDisplay; }

    public Double getAmountNumeric() { return amountNumeric; }
    public void setAmountNumeric(Double amountNumeric) { this.amountNumeric = amountNumeric; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getPaymentDate() { return paymentDate; }
    public void setPaymentDate(String paymentDate) { this.paymentDate = paymentDate; }

    public String getUtrNumber() { return utrNumber; }
    public void setUtrNumber(String utrNumber) { this.utrNumber = utrNumber; }

    public String getPaymentMode() { return paymentMode; }
    public void setPaymentMode(String paymentMode) { this.paymentMode = paymentMode; }

    public String getLegalBasis() { return legalBasis; }
    public void setLegalBasis(String legalBasis) { this.legalBasis = legalBasis; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
