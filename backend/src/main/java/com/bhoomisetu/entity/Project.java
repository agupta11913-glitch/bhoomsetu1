package com.bhoomisetu.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", unique = true, nullable = false, length = 50)
    private String projectId;

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(name = "short_name", length = 100)
    private String shortName;

    @Column(name = "project_type", length = 100)
    private String projectType;

    @Column(name = "requiring_agency", length = 150)
    private String requiringAgency;

    @Column(name = "authority", length = 150)
    private String authority;

    @Column(name = "state", length = 100)
    private String state;

    @Column(name = "districts", length = 255)
    private String districts;

    @Column(name = "estimated_cost")
    private Double estimatedCost;

    @Column(name = "total_land_required")
    private Double totalLandRequired;

    @Column(name = "land_proposed")
    private Double landProposed;

    @Column(name = "land_notified")
    private Double landNotified;

    @Column(name = "land_acquired")
    private Double landAcquired;

    @Column(name = "land_remaining")
    private Double landRemaining;

    @Column(name = "affected_families")
    private Integer affectedFamilies;

    @Column(name = "displaced_families")
    private Integer displacedFamilies;

    @Column(name = "compensation_assessed")
    private Double compensationAssessed;

    @Column(name = "compensation_paid")
    private Double compensationPaid;

    @Column(name = "possession_percentage")
    private Double possessionPercentage;

    @Column(name = "rr_progress")
    private Double rrProgress;

    @Column(name = "current_stage", length = 100)
    private String currentStage;

    @Column(name = "status", length = 50)
    private String status;

    @Column(name = "start_date", length = 50)
    private String startDate;

    @Column(name = "expected_completion_date", length = 50)
    private String expectedCompletionDate;

    @Column(name = "timeline_status", length = 50)
    private String timelineStatus;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "coordinates_json", columnDefinition = "TEXT")
    private String coordinatesJson;

    @Column(name = "alignment_coordinates_json", columnDefinition = "TEXT")
    private String alignmentCoordinatesJson;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Project() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getProjectId() { return projectId; }
    public void setProjectId(String projectId) { this.projectId = projectId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getShortName() { return shortName; }
    public void setShortName(String shortName) { this.shortName = shortName; }

    public String getProjectType() { return projectType; }
    public void setProjectType(String projectType) { this.projectType = projectType; }

    public String getRequiringAgency() { return requiringAgency; }
    public void setRequiringAgency(String requiringAgency) { this.requiringAgency = requiringAgency; }

    public String getAuthority() { return authority; }
    public void setAuthority(String authority) { this.authority = authority; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getDistricts() { return districts; }
    public void setDistricts(String districts) { this.districts = districts; }

    public Double getEstimatedCost() { return estimatedCost; }
    public void setEstimatedCost(Double estimatedCost) { this.estimatedCost = estimatedCost; }

    public Double getTotalLandRequired() { return totalLandRequired; }
    public void setTotalLandRequired(Double totalLandRequired) { this.totalLandRequired = totalLandRequired; }

    public Double getLandProposed() { return landProposed; }
    public void setLandProposed(Double landProposed) { this.landProposed = landProposed; }

    public Double getLandNotified() { return landNotified; }
    public void setLandNotified(Double landNotified) { this.landNotified = landNotified; }

    public Double getLandAcquired() { return landAcquired; }
    public void setLandAcquired(Double landAcquired) { this.landAcquired = landAcquired; }

    public Double getLandRemaining() { return landRemaining; }
    public void setLandRemaining(Double landRemaining) { this.landRemaining = landRemaining; }

    public Integer getAffectedFamilies() { return affectedFamilies; }
    public void setAffectedFamilies(Integer affectedFamilies) { this.affectedFamilies = affectedFamilies; }

    public Integer getDisplacedFamilies() { return displacedFamilies; }
    public void setDisplacedFamilies(Integer displacedFamilies) { this.displacedFamilies = displacedFamilies; }

    public Double getCompensationAssessed() { return compensationAssessed; }
    public void setCompensationAssessed(Double compensationAssessed) { this.compensationAssessed = compensationAssessed; }

    public Double getCompensationPaid() { return compensationPaid; }
    public void setCompensationPaid(Double compensationPaid) { this.compensationPaid = compensationPaid; }

    public Double getPossessionPercentage() { return possessionPercentage; }
    public void setPossessionPercentage(Double possessionPercentage) { this.possessionPercentage = possessionPercentage; }

    public Double getRrProgress() { return rrProgress; }
    public void setRrProgress(Double rrProgress) { this.rrProgress = rrProgress; }

    public String getCurrentStage() { return currentStage; }
    public void setCurrentStage(String currentStage) { this.currentStage = currentStage; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }

    public String getExpectedCompletionDate() { return expectedCompletionDate; }
    public void setExpectedCompletionDate(String expectedCompletionDate) { this.expectedCompletionDate = expectedCompletionDate; }

    public String getTimelineStatus() { return timelineStatus; }
    public void setTimelineStatus(String timelineStatus) { this.timelineStatus = timelineStatus; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCoordinatesJson() { return coordinatesJson; }
    public void setCoordinatesJson(String coordinatesJson) { this.coordinatesJson = coordinatesJson; }

    public String getAlignmentCoordinatesJson() { return alignmentCoordinatesJson; }
    public void setAlignmentCoordinatesJson(String alignmentCoordinatesJson) { this.alignmentCoordinatesJson = alignmentCoordinatesJson; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
