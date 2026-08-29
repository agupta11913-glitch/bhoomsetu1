package com.bhoomisetu.dto;

public class UserPreferencesResponse {

    private boolean success;
    private String message;
    private String languagePreference;
    private String themePreference;

    public UserPreferencesResponse() {
    }

    public UserPreferencesResponse(boolean success, String message, String languagePreference, String themePreference) {
        this.success = success;
        this.message = message;
        this.languagePreference = languagePreference;
        this.themePreference = themePreference;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getLanguagePreference() {
        return languagePreference;
    }

    public void setLanguagePreference(String languagePreference) {
        this.languagePreference = languagePreference;
    }

    public String getThemePreference() {
        return themePreference;
    }

    public void setThemePreference(String themePreference) {
        this.themePreference = themePreference;
    }
}
