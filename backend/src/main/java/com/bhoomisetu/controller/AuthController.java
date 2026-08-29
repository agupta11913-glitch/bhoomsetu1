package com.bhoomisetu.controller;

import com.bhoomisetu.dto.AuthResponse;
import com.bhoomisetu.dto.LoginRequest;
import com.bhoomisetu.dto.RegisterRequest;
import com.bhoomisetu.dto.UserDto;
import com.bhoomisetu.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        HttpStatus status = response.isSuccess() ? HttpStatus.CREATED : HttpStatus.ACCEPTED;
        return ResponseEntity.status(status).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String email = authentication.getName();
        if (authentication.getPrincipal() instanceof com.bhoomisetu.entity.User u) {
            email = u.getEmail();
        }
        UserDto user = authService.getCurrentUser(email);
        return ResponseEntity.ok(user);
    }
}
