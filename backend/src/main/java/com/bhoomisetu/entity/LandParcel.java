package com.bhoomisetu.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "land_parcels")
public class LandParcel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "khasra_number", nullable = false, length = 50)
    private String khasraNumber;

    @Column(name = "khata_number", length = 50)
    private String khataNumber;

    @Column(name = "case_id", length = 100)
    private String caseId;

    @Column(name = "project_id", length = 50)
    private String projectId;

    @Column(name = "project_name", length = 200)
    private String projectName;

    @Column(name = "owner_name", nullable = false, length = 150)
    private String ownerName;

    @Column(name = "father_name", length = 150)
    private String fatherName;

    @Column(name = "aadhaar_masked", length = 50)
    private String aadhaarMasked;

    @Column(name = "pan_masked", length = 50)
    private String panMasked;

    @Column(name = "phone", length = 50)
    private String phone;

    @Column(name = "email", length = 150)
    private String email;

    @Column(name = "bank_account", length = 100)
    private String bankAccount;

    @Column(name = "area_acre")
    private Double areaAcre;

    @Column(name = "area_hectare")
    private Double areaHectare;

    @Column(name = "land_type", length = 100)
    private String landType;

    @Column(name = "soil_classification", length = 100)
    private String soilClassification;

    @Column(name = "village", length = 100)
    private String village;

    @Column(name = "tehsil", length = 100)
    private String tehsil;

    @Column(name = "district", length = 100)
    private String district;

    @Column(name = "state", length = 100)
    private String state;

    @Column(name = "pincode", length = 20)
    private String pincode;

    @Column(name = "status", length = 50)
    private String status;

    @Column(name = "gis_status", length = 50)
    private String gisStatus;

    @Column(name = "assigned_officer", length = 150)
    private String assignedOfficer;

    @Column(name = "dispute_status", length = 100)
    private String disputeStatus;

    @Column(name = "circle_rate_per_acre")
    private Double circleRatePerAcre;

    @Column(name = "market_value")
    private Double marketValue;

    @Column(name = "multiplying_factor")
    private Double multiplyingFactor;

    @Column(name = "base_compensation")
    private Double baseCompensation;

    @Column(name = "solatium_percentage")
    private Double solatiumPercentage;

    @Column(name = "total_compensation")
    private Double totalCompensation;

    @Column(name = "payment_status", length = 50)
    private String paymentStatus;

    @Column(name = "payment_utr", length = 100)
    private String paymentUtr;

    @Column(name = "payment_date", length = 50)
    private String paymentDate;

    @Column(name = "revenue_verified")
    private Boolean revenueVerified;

    @Column(name = "revenue_officer_notes", columnDefinition = "TEXT")
    private String revenueOfficerNotes;

    @Column(name = "gis_verified")
    private Boolean gisVerified;

    @Column(name = "gis_officer_notes", columnDefinition = "TEXT")
    private String gisOfficerNotes;

    @Column(name = "selected_for_acquisition")
    private Boolean selectedForAcquisition;

    @Column(name = "notice_issued")
    private Boolean noticeIssued;

    @Column(name = "notice_id", length = 100)
    private String noticeId;

    @Column(name = "notice_date", length = 50)
    private String noticeDate;

    @Column(name = "objection_deadline", length = 50)
    private String objectionDeadline;

    @Column(name = "has_objection")
    private Boolean hasObjection;

    @Column(name = "objection_id", length = 100)
    private String objectionId;

    @Column(name = "authority_approved")
    private Boolean authorityApproved;

    @Column(name = "authority_approval_date", length = 50)
    private String authorityApprovalDate;

    @Column(name = "is_acquired")
    private Boolean isAcquired;

    @Column(name = "acquisition_date", length = 50)
    private String acquisitionDate;

    @Column(name = "coordinates_json", columnDefinition = "TEXT")
    private String coordinatesJson;

    @Column(name = "affected_area_acre")
    private Double affectedAreaAcre;

    @Column(name = "affected_area_hectare")
    private Double affectedAreaHectare;

    @Column(name = "remaining_area_acre")
    private Double remainingAreaAcre;

    @Column(name = "remaining_area_hectare")
    private Double remainingAreaHectare;

    @Column(name = "affected_coordinates_json", columnDefinition = "TEXT")
    private String affectedCoordinatesJson;

    @Column(name = "tehsildar_status", length = 50)
    private String tehsildarStatus;

    @Column(name = "tehsildar_remarks", columnDefinition = "TEXT")
    private String tehsildarRemarks;

    @Column(name = "tehsildar_action_date", length = 50)
    private String tehsildarActionDate;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "verification_status", length = 50)
    private String verificationStatus;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public LandParcel() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getKhasraNumber() { return khasraNumber; }
    public void setKhasraNumber(String khasraNumber) { this.khasraNumber = khasraNumber; }

    public String getKhataNumber() { return khataNumber; }
    public void setKhataNumber(String khataNumber) { this.khataNumber = khataNumber; }

    public String getCaseId() { return caseId; }
    public void setCaseId(String caseId) { this.caseId = caseId; }

    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }

    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getFatherName() { return fatherName; }
    public void setFatherName(String fatherName) { this.fatherName = fatherName; }

    public String getAadhaarMasked() { return aadhaarMasked; }
    public void setAadhaarMasked(String aadhaarMasked) { this.aadhaarMasked = aadhaarMasked; }

    public String getPanMasked() { return panMasked; }
    public void setPanMasked(String panMasked) { this.panMasked = panMasked; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getBankAccount() { return bankAccount; }
    public void setBankAccount(String bankAccount) { this.bankAccount = bankAccount; }

    public Double getAreaAcre() { return areaAcre; }
    public void setAreaAcre(Double areaAcre) { this.areaAcre = areaAcre; }

    public Double getAreaHectare() { return areaHectare; }
    public void setAreaHectare(Double areaHectare) { this.areaHectare = areaHectare; }

    public String getLandType() { return landType; }
    public void setLandType(String landType) { this.landType = landType; }

    public String getSoilClassification() { return soilClassification; }
    public void setSoilClassification(String soilClassification) { this.soilClassification = soilClassification; }

    public String getVillage() { return village; }
    public void setVillage(String village) { this.village = village; }

    public String getTehsil() { return tehsil; }
    public void setTehsil(String tehsil) { this.tehsil = tehsil; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getGisStatus() { return gisStatus; }
    public void setGisStatus(String gisStatus) { this.gisStatus = gisStatus; }

    public String getAssignedOfficer() { return assignedOfficer; }
    public void setAssignedOfficer(String assignedOfficer) { this.assignedOfficer = assignedOfficer; }

    public String getDisputeStatus() { return disputeStatus; }
    public void setDisputeStatus(String disputeStatus) { this.disputeStatus = disputeStatus; }

    public Double getCircleRatePerAcre() { return circleRatePerAcre; }
    public void setCircleRatePerAcre(Double circleRatePerAcre) { this.circleRatePerAcre = circleRatePerAcre; }

    public Double getMarketValue() { return marketValue; }
    public void setMarketValue(Double marketValue) { this.marketValue = marketValue; }

    public Double getMultiplyingFactor() { return multiplyingFactor; }
    public void setMultiplyingFactor(Double multiplyingFactor) { this.multiplyingFactor = multiplyingFactor; }

    public Double getBaseCompensation() { return baseCompensation; }
    public void setBaseCompensation(Double baseCompensation) { this.baseCompensation = baseCompensation; }

    public Double getSolatiumPercentage() { return solatiumPercentage; }
    public void setSolatiumPercentage(Double solatiumPercentage) { this.solatiumPercentage = solatiumPercentage; }

    public Double getTotalCompensation() { return totalCompensation; }
    public void setTotalCompensation(Double totalCompensation) { this.totalCompensation = totalCompensation; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getPaymentUtr() { return paymentUtr; }
    public void setPaymentUtr(String paymentUtr) { this.paymentUtr = paymentUtr; }

    public String getPaymentDate() { return paymentDate; }
    public void setPaymentDate(String paymentDate) { this.paymentDate = paymentDate; }

    public Boolean getRevenueVerified() { return revenueVerified; }
    public void setRevenueVerified(Boolean revenueVerified) { this.revenueVerified = revenueVerified; }

    public String getRevenueOfficerNotes() { return revenueOfficerNotes; }
    public void setRevenueOfficerNotes(String revenueOfficerNotes) { this.revenueOfficerNotes = revenueOfficerNotes; }

    public Boolean getGisVerified() { return gisVerified; }
    public void setGisVerified(Boolean gisVerified) { this.gisVerified = gisVerified; }

    public String getGisOfficerNotes() { return gisOfficerNotes; }
    public void setGisOfficerNotes(String gisOfficerNotes) { this.gisOfficerNotes = gisOfficerNotes; }

    public Boolean getSelectedForAcquisition() { return selectedForAcquisition; }
    public void setSelectedForAcquisition(Boolean selectedForAcquisition) { this.selectedForAcquisition = selectedForAcquisition; }

    public Boolean getNoticeIssued() { return noticeIssued; }
    public void setNoticeIssued(Boolean noticeIssued) { this.noticeIssued = noticeIssued; }

    public String getNoticeId() { return noticeId; }
    public void setNoticeId(String noticeId) { this.noticeId = noticeId; }

    public String getNoticeDate() { return noticeDate; }
    public void setNoticeDate(String noticeDate) { this.noticeDate = noticeDate; }

    public String getObjectionDeadline() { return objectionDeadline; }
    public void setObjectionDeadline(String objectionDeadline) { this.objectionDeadline = objectionDeadline; }

    public Boolean getHasObjection() { return hasObjection; }
    public void setHasObjection(Boolean hasObjection) { this.hasObjection = hasObjection; }

    public String getObjectionId() { return objectionId; }
    public void setObjectionId(String objectionId) { this.objectionId = objectionId; }

    public Boolean getAuthorityApproved() { return authorityApproved; }
    public void setAuthorityApproved(Boolean authorityApproved) { this.authorityApproved = authorityApproved; }

    public String getAuthorityApprovalDate() { return authorityApprovalDate; }
    public void setAuthorityApprovalDate(String authorityApprovalDate) { this.authorityApprovalDate = authorityApprovalDate; }

    public Boolean getIsAcquired() { return isAcquired; }
    public void setIsAcquired(Boolean isAcquired) { this.isAcquired = isAcquired; }

    public String getAcquisitionDate() { return acquisitionDate; }
    public void setAcquisitionDate(String acquisitionDate) { this.acquisitionDate = acquisitionDate; }

    public String getCoordinatesJson() { return coordinatesJson; }
    public void setCoordinatesJson(String coordinatesJson) { this.coordinatesJson = coordinatesJson; }

    public Double getAffectedAreaAcre() { return affectedAreaAcre; }
    public void setAffectedAreaAcre(Double affectedAreaAcre) { this.affectedAreaAcre = affectedAreaAcre; }

    public Double getAffectedAreaHectare() { return affectedAreaHectare; }
    public void setAffectedAreaHectare(Double affectedAreaHectare) { this.affectedAreaHectare = affectedAreaHectare; }

    public Double getRemainingAreaAcre() { return remainingAreaAcre; }
    public void setRemainingAreaAcre(Double remainingAreaAcre) { this.remainingAreaAcre = remainingAreaAcre; }

    public Double getRemainingAreaHectare() { return remainingAreaHectare; }
    public void setRemainingAreaHectare(Double remainingAreaHectare) { this.remainingAreaHectare = remainingAreaHectare; }

    public String getAffectedCoordinatesJson() { return affectedCoordinatesJson; }
    public void setAffectedCoordinatesJson(String affectedCoordinatesJson) { this.affectedCoordinatesJson = affectedCoordinatesJson; }

    public String getTehsildarStatus() { return tehsildarStatus; }
    public void setTehsildarStatus(String tehsildarStatus) { this.tehsildarStatus = tehsildarStatus; }

    public String getTehsildarRemarks() { return tehsildarRemarks; }
    public void setTehsildarRemarks(String tehsildarRemarks) { this.tehsildarRemarks = tehsildarRemarks; }

    public String getTehsildarActionDate() { return tehsildarActionDate; }
    public void setTehsildarActionDate(String tehsildarActionDate) { this.tehsildarActionDate = tehsildarActionDate; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
