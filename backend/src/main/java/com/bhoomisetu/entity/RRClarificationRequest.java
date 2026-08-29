package com.bhoomisetu.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "rr_clarifications")
public class RRClarificationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "case_id", nullable = false)
    private String caseId;

    @Column(name = "claimant_name", nullable = false)
    private String claimantName;

    @Column(name = "claimant_email")
    private String claimantEmail;

    @Column(name = "claimant_phone")
    private String claimantPhone;

    @Column(name = "subject", nullable = false)
    private String subject;

    @Column(name = "category")
    private String category;

    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "supporting_doc_name")
    private String supportingDocName;

    @Column(name = "status", nullable = false)
    private String status = "SUBMITTED"; // SUBMITTED, UNDER_REVIEW, RESPONDED, RESOLVED

    @Column(name = "response_text", columnDefinition = "TEXT")
    private String responseText;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public RRClarificationRequest() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCaseId() { return caseId; }
    public void setCaseId(String caseId) { this.caseId = caseId; }

    public String getClaimantName() { return claimantName; }
    public void setClaimantName(String claimantName) { this.claimantName = claimantName; }

    public String getClaimantEmail() { return claimantEmail; }
    public void setClaimantEmail(String claimantEmail) { this.claimantEmail = claimantEmail; }

    public String getClaimantPhone() { return claimantPhone; }
    public void setClaimantPhone(String claimantPhone) { this.claimantPhone = claimantPhone; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getSupportingDocName() { return supportingDocName; }
    public void setSupportingDocName(String supportingDocName) { this.supportingDocName = supportingDocName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getResponseText() { return responseText; }
    public void setResponseText(String responseText) { this.responseText = responseText; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
