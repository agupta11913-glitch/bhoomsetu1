package com.bhoomisetu.dto;

import java.util.Map;

public class AIQueryRequest {
    private String message;
    private String query;
    private String currentPage;
    private String projectId;
    private String currentProjectId;
    private String parcelId;
    private String currentKhasraId;
    private String caseId;
    private String currentCaseId;
    private String currentDistrict;
    private String userEmail;
    private String userRole;
    private Map<String, Object> additionalContext;

    public AIQueryRequest() {}

    public String getEffectiveMessage() {
        if (message != null && !message.trim().isEmpty()) {
            return message.trim();
        }
        if (query != null && !query.trim().isEmpty()) {
            return query.trim();
        }
        return "";
    }

    public String getEffectiveProjectId() {
        if (projectId != null && !projectId.trim().isEmpty()) {
            return projectId.trim();
        }
        if (currentProjectId != null && !currentProjectId.trim().isEmpty()) {
            return currentProjectId.trim();
        }
        return null;
    }

    public String getEffectiveParcelId() {
        if (parcelId != null && !parcelId.trim().isEmpty()) {
            return parcelId.trim();
        }
        if (currentKhasraId != null && !currentKhasraId.trim().isEmpty()) {
            return currentKhasraId.trim();
        }
        return null;
    }

    public String getEffectiveCaseId() {
        if (caseId != null && !caseId.trim().isEmpty()) {
            return caseId.trim();
        }
        if (currentCaseId != null && !currentCaseId.trim().isEmpty()) {
            return currentCaseId.trim();
        }
        return null;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public String getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(String currentPage) {
        this.currentPage = currentPage;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getCurrentProjectId() {
        return currentProjectId;
    }

    public void setCurrentProjectId(String currentProjectId) {
        this.currentProjectId = currentProjectId;
    }

    public String getParcelId() {
        return parcelId;
    }

    public void setParcelId(String parcelId) {
        this.parcelId = parcelId;
    }

    public String getCurrentKhasraId() {
        return currentKhasraId;
    }

    public void setCurrentKhasraId(String currentKhasraId) {
        this.currentKhasraId = currentKhasraId;
    }

    public String getCaseId() {
        return caseId;
    }

    public void setCaseId(String caseId) {
        this.caseId = caseId;
    }

    public String getCurrentCaseId() {
        return currentCaseId;
    }

    public void setCurrentCaseId(String currentCaseId) {
        this.currentCaseId = currentCaseId;
    }

    public String getCurrentDistrict() {
        return currentDistrict;
    }

    public void setCurrentDistrict(String currentDistrict) {
        this.currentDistrict = currentDistrict;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserRole() {
        return userRole;
    }

    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }

    public Map<String, Object> getAdditionalContext() {
        return additionalContext;
    }

    public void setAdditionalContext(Map<String, Object> additionalContext) {
        this.additionalContext = additionalContext;
    }
}
