package com.bhoomisetu.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "objections")
public class Objection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "objection_id", unique = true, nullable = false, length = 50)
    private String objectionId;

    @Column(name = "khasra_number", nullable = false, length = 50)
    private String khasraNumber;

    @Column(name = "case_id", length = 100)
    private String caseId;

    @Column(name = "project_id", length = 50)
    private String projectId;

    @Column(name = "claimant_name", nullable = false, length = 150)
    private String claimantName;

    @Column(name = "claimant_phone", length = 50)
    private String claimantPhone;

    @Column(name = "claimant_email", length = 150)
    private String claimantEmail;

    @Column(name = "objection_type", length = 100)
    private String objectionType;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "evidence_doc_name", length = 200)
    private String evidenceDocName;

    @Column(name = "status", length = 50)
    private String status = "PENDING_HEARING";

    @Column(name = "hearing_date", length = 50)
    private String hearingDate;

    @Column(name = "authority_order", columnDefinition = "TEXT")
    private String authorityOrder;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Objection() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getObjectionId() { return objectionId; }
    public void setObjectionId(String objectionId) { this.objectionId = objectionId; }

    public String getKhasraNumber() { return khasraNumber; }
    public void setKhasraNumber(String khasraNumber) { this.khasraNumber = khasraNumber; }

    public String getCaseId() { return caseId; }
    public void setCaseId(String caseId) { this.caseId = caseId; }

    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }

    public String getClaimantName() { return claimantName; }
    public void setClaimantName(String claimantName) { this.claimantName = claimantName; }

    public String getClaimantPhone() { return claimantPhone; }
    public void setClaimantPhone(String claimantPhone) { this.claimantPhone = claimantPhone; }

    public String getClaimantEmail() { return claimantEmail; }
    public void setClaimantEmail(String claimantEmail) { this.claimantEmail = claimantEmail; }

    public String getObjectionType() { return objectionType; }
    public void setObjectionType(String objectionType) { this.objectionType = objectionType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getEvidenceDocName() { return evidenceDocName; }
    public void setEvidenceDocName(String evidenceDocName) { this.evidenceDocName = evidenceDocName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getHearingDate() { return hearingDate; }
    public void setHearingDate(String hearingDate) { this.hearingDate = hearingDate; }

    public String getAuthorityOrder() { return authorityOrder; }
    public void setAuthorityOrder(String authorityOrder) { this.authorityOrder = authorityOrder; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
