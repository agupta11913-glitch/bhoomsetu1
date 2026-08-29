package com.bhoomisetu.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class AIQueryResponse {
    private boolean success;
    private String message;
    private String answer;
    private String language;
    private String scope;
    private List<AIAction> actions;
    private AIAction action;
    private List<Map<String, Object>> references;
    private Map<String, Object> userContext;
    private List<String> suggestedFollowUps;
    private Long timestamp;

    public AIQueryResponse() {
        this.timestamp = System.currentTimeMillis();
        this.actions = new ArrayList<>();
        this.references = new ArrayList<>();
        this.suggestedFollowUps = new ArrayList<>();
    }

    public AIQueryResponse(boolean success, String message, String language, String scope, AIAction singleAction, List<String> suggestedFollowUps) {
        this.success = success;
        this.message = message;
        this.answer = message;
        this.language = language;
        this.scope = scope;
        this.action = singleAction;
        this.actions = new ArrayList<>();
        if (singleAction != null) {
            this.actions.add(singleAction);
        }
        this.references = new ArrayList<>();
        this.suggestedFollowUps = suggestedFollowUps != null ? suggestedFollowUps : new ArrayList<>();
        this.timestamp = System.currentTimeMillis();
    }

    public static AIQueryResponse success(String message, String language, String scope, AIAction action, List<String> suggestedFollowUps) {
        return new AIQueryResponse(true, message, language, scope, action, suggestedFollowUps);
    }

    public static AIQueryResponse fallback(String message, String language) {
        return new AIQueryResponse(true, message, language, "FALLBACK", null, List.of("Meri land ka status kya hai?", "District ke projects dikhao", "GIS map kholo"));
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message != null ? message : answer;
    }

    public void setMessage(String message) {
        this.message = message;
        this.answer = message;
    }

    public String getAnswer() {
        return answer != null ? answer : message;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
        this.message = answer;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getScope() {
        return scope;
    }

    public void setScope(String scope) {
        this.scope = scope;
    }

    public List<AIAction> getActions() {
        return actions;
    }

    public void setActions(List<AIAction> actions) {
        this.actions = actions;
        if (actions != null && !actions.isEmpty()) {
            this.action = actions.get(0);
        }
    }

    public AIAction getAction() {
        return action;
    }

    public void setAction(AIAction action) {
        this.action = action;
        if (action != null) {
            this.actions = new ArrayList<>();
            this.actions.add(action);
        }
    }

    public List<Map<String, Object>> getReferences() {
        return references;
    }

    public void setReferences(List<Map<String, Object>> references) {
        this.references = references;
    }

    public Map<String, Object> getUserContext() {
        return userContext;
    }

    public void setUserContext(Map<String, Object> userContext) {
        this.userContext = userContext;
    }

    public List<String> getSuggestedFollowUps() {
        return suggestedFollowUps;
    }

    public void setSuggestedFollowUps(List<String> suggestedFollowUps) {
        this.suggestedFollowUps = suggestedFollowUps;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }
}
