package com.bhoomisetu.service;

import com.bhoomisetu.dto.UserPreferencesRequest;
import com.bhoomisetu.dto.UserPreferencesResponse;
import com.bhoomisetu.entity.User;
import com.bhoomisetu.exception.ResourceNotFoundException;
import com.bhoomisetu.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserPreferencesService {

    private final UserRepository userRepository;

    public UserPreferencesService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserPreferencesResponse getPreferences(String email) {
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found for email: " + email));

        String lang = user.getLanguagePreference() != null ? user.getLanguagePreference() : "ENGLISH";
        String theme = user.getThemePreference() != null ? user.getThemePreference() : "LIGHT";

        return new UserPreferencesResponse(true, "User preferences retrieved successfully", lang, theme);
    }

    @Transactional
    public UserPreferencesResponse updatePreferences(String email, UserPreferencesRequest request) {
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found for email: " + email));

        if (request.getLanguagePreference() != null && !request.getLanguagePreference().trim().isEmpty()) {
            String cleanLang = request.getLanguagePreference().trim().toUpperCase();
            if (cleanLang.equals("HINDI") || cleanLang.equals("HI")) {
                user.setLanguagePreference("HINDI");
            } else {
                user.setLanguagePreference("ENGLISH");
            }
        }

        if (request.getThemePreference() != null && !request.getThemePreference().trim().isEmpty()) {
            String cleanTheme = request.getThemePreference().trim().toUpperCase();
            if (cleanTheme.equals("DARK")) {
                user.setThemePreference("DARK");
            } else {
                user.setThemePreference("LIGHT");
            }
        }

        User updatedUser = userRepository.save(user);

        return new UserPreferencesResponse(
                true,
                "Preferences updated successfully",
                updatedUser.getLanguagePreference(),
                updatedUser.getThemePreference()
        );
    }
}
