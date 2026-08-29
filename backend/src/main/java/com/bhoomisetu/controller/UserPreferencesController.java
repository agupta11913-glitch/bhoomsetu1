package com.bhoomisetu.controller;

import com.bhoomisetu.dto.UserPreferencesRequest;
import com.bhoomisetu.dto.UserPreferencesResponse;
import com.bhoomisetu.entity.User;
import com.bhoomisetu.service.UserPreferencesService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/preferences")
public class UserPreferencesController {

    private final UserPreferencesService userPreferencesService;

    public UserPreferencesController(UserPreferencesService userPreferencesService) {
        this.userPreferencesService = userPreferencesService;
    }

    private String extractEmail(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        if (authentication.getPrincipal() instanceof User u) {
            return u.getEmail();
        }
        return authentication.getName();
    }

    @GetMapping
    public ResponseEntity<UserPreferencesResponse> getPreferences(Authentication authentication) {
        String email = extractEmail(authentication);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        UserPreferencesResponse response = userPreferencesService.getPreferences(email);
        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<UserPreferencesResponse> updatePreferences(
            Authentication authentication,
            @RequestBody UserPreferencesRequest request
    ) {
        String email = extractEmail(authentication);
        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        UserPreferencesResponse response = userPreferencesService.updatePreferences(email, request);
        return ResponseEntity.ok(response);
    }
}
