package com.bhoomisetu.dto;

public class UserPreferencesRequest {

    private String languagePreference;
    private String themePreference;

    public UserPreferencesRequest() {
    }

    public UserPreferencesRequest(String languagePreference, String themePreference) {
        this.languagePreference = languagePreference;
        this.themePreference = themePreference;
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
