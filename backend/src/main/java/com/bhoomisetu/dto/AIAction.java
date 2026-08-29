package com.bhoomisetu.dto;

import java.util.LinkedHashMap;
import java.util.Map;

public class AIAction {
    private String type;
    private String label;
    private String path;
    private String projectId;
    private String parcelId;
    private String caseId;
    private Map<String, Object> payload;

    public AIAction() {
        this.payload = new LinkedHashMap<>();
    }

    public AIAction(String type, String label, String path, Map<String, Object> payload) {
        this.type = type;
        this.label = label;
        this.path = path;
        this.payload = payload != null ? payload : new LinkedHashMap<>();
        if (payload != null) {
            if (payload.containsKey("projectId")) this.projectId = String.valueOf(payload.get("projectId"));
            if (payload.containsKey("khasraNumber")) this.parcelId = String.valueOf(payload.get("khasraNumber"));
            if (payload.containsKey("parcelId")) this.parcelId = String.valueOf(payload.get("parcelId"));
            if (payload.containsKey("caseId")) this.caseId = String.valueOf(payload.get("caseId"));
        }
    }

    public AIAction(String type, String label, String path, String projectId, String parcelId) {
        this.type = type;
        this.label = label;
        this.path = path;
        this.projectId = projectId;
        this.parcelId = parcelId;
        this.payload = new LinkedHashMap<>();
        if (projectId != null) this.payload.put("projectId", projectId);
        if (parcelId != null) this.payload.put("khasraNumber", parcelId);
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getParcelId() {
        return parcelId;
    }

    public void setParcelId(String parcelId) {
        this.parcelId = parcelId;
    }

    public String getCaseId() {
        return caseId;
    }

    public void setCaseId(String caseId) {
        this.caseId = caseId;
    }

    public Map<String, Object> getPayload() {
        return payload;
    }

    public void setPayload(Map<String, Object> payload) {
        this.payload = payload;
    }
}
