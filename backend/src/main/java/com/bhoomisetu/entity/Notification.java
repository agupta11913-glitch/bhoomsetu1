package com.bhoomisetu.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "notification_id", length = 50)
    private String notificationId;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "message", columnDefinition = "TEXT")
    private String message;

    @Column(name = "type", length = 50)
    private String type;

    @Column(name = "target_role", length = 50)
    private String targetRole;

    @Column(name = "target_user_email", length = 150)
    private String targetUserEmail;

    @Column(name = "related_case_id", length = 100)
    private String relatedCaseId;

    @Column(name = "related_khasra", length = 50)
    private String relatedKhasra;

    @Column(name = "is_read")
    private Boolean isRead = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Notification() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNotificationId() { return notificationId; }
    public void setNotificationId(String notificationId) { this.notificationId = notificationId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }

    public String getTargetUserEmail() { return targetUserEmail; }
    public void setTargetUserEmail(String targetUserEmail) { this.targetUserEmail = targetUserEmail; }

    public String getRelatedCaseId() { return relatedCaseId; }
    public void setRelatedCaseId(String relatedCaseId) { this.relatedCaseId = relatedCaseId; }

    public String getRelatedKhasra() { return relatedKhasra; }
    public void setRelatedKhasra(String relatedKhasra) { this.relatedKhasra = relatedKhasra; }

    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
