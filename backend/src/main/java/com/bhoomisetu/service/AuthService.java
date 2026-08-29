package com.bhoomisetu.service;

import com.bhoomisetu.dto.AuthResponse;
import com.bhoomisetu.dto.LoginRequest;
import com.bhoomisetu.dto.RegisterRequest;
import com.bhoomisetu.dto.UserDto;
import com.bhoomisetu.entity.Role;
import com.bhoomisetu.entity.Status;
import com.bhoomisetu.entity.User;
import com.bhoomisetu.exception.AccountStatusException;
import com.bhoomisetu.exception.DuplicateEmailException;
import com.bhoomisetu.exception.ResourceNotFoundException;
import com.bhoomisetu.repository.UserRepository;
import com.bhoomisetu.security.JwtService;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // 1. Check duplicate email
        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new DuplicateEmailException("An account with this email already exists.");
        }

        // 2. Check duplicate employee ID if present
        if (request.getEmployeeId() != null && !request.getEmployeeId().trim().isEmpty()) {
            if (userRepository.existsByEmployeeId(request.getEmployeeId().trim())) {
                throw new DuplicateEmailException("A government record with Employee ID '" + request.getEmployeeId() + "' already exists.");
            }
        }

        // 3. Determine status based on Role: CITIZEN is instant ACTIVE, all others PENDING
        Status initialStatus = (request.getRole() == Role.CITIZEN) ? Status.ACTIVE : Status.PENDING;

        // 4. Create User entity with BCrypt encrypted password
        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setMobile(request.getMobile().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setStatus(initialStatus);
        user.setDepartment(request.getDepartment());
        user.setDesignation(request.getDesignation());
        user.setEmployeeId(request.getEmployeeId());
        user.setOrganizationName(request.getOrganizationName());
        user.setState(request.getState());
        user.setDistrict(request.getDistrict());
        user.setAddress(request.getAddress());
        user.setLanguagePreference(request.getLanguagePreference() != null ? request.getLanguagePreference() : "ENGLISH");
        user.setThemePreference(request.getThemePreference() != null ? request.getThemePreference() : "LIGHT");

        User savedUser = userRepository.save(user);

        // 5. Build Response
        String appPrefix = switch (savedUser.getRole()) {
            case CITIZEN -> "APP-CIT-2026-";
            case GOVERNMENT_OFFICER -> "APP-OFF-2026-";
            case PROJECT_AGENCY -> "APP-AGN-2026-";
            default -> "APP-AUTH-2026-";
        };
        String applicationId = appPrefix + String.format("%04d", savedUser.getId());

        if (initialStatus == Status.ACTIVE) {
            String token = jwtService.generateToken(savedUser);
            return AuthResponse.success("Citizen account created and activated successfully.", token, UserDto.fromEntity(savedUser));
        } else {
            return AuthResponse.pending("Registration request submitted successfully. Account pending administrative verification.", applicationId);
        }
    }

    public AuthResponse login(LoginRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();

        // 1. Find user by email
        User user = userRepository.findByEmail(cleanEmail)
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password."));

        // 2. Verify password with BCrypt
        boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPassword());
        System.out.println("LOGIN EMAIL: " + user.getEmail());
        System.out.println("DATABASE STATUS: " + user.getStatus());
        System.out.println("DATABASE ROLE: " + user.getRole());
        System.out.println("PASSWORD MATCH: " + passwordMatches);

        if (!passwordMatches) {
            throw new BadCredentialsException("Invalid email or password.");
        }

        // 3. Check account status
        String appPrefix = switch (user.getRole()) {
            case CITIZEN -> "APP-CIT-2026-";
            case GOVERNMENT_OFFICER -> "APP-OFF-2026-";
            case PROJECT_AGENCY -> "APP-AGN-2026-";
            default -> "APP-AUTH-2026-";
        };
        String applicationId = appPrefix + String.format("%04d", user.getId());

        if (user.getStatus() == Status.PENDING) {
            throw new AccountStatusException(
                    "Your account is awaiting department/admin verification. Please check registration status.",
                    Status.PENDING,
                    applicationId
            );
        }

        if (user.getStatus() == Status.REJECTED) {
            throw new AccountStatusException(
                    "Your registration request was rejected: " + (user.getRejectionReason() != null ? user.getRejectionReason() : "Please contact the helpdesk."),
                    Status.REJECTED,
                    applicationId
            );
        }

        if (user.getStatus() == Status.SUSPENDED) {
            throw new AccountStatusException(
                    "Your account has been temporarily suspended by the security administrator.",
                    Status.SUSPENDED,
                    applicationId
            );
        }

        // 4. Generate JWT token
        String token = jwtService.generateToken(user);
        return AuthResponse.success("Login successful", token, UserDto.fromEntity(user));
    }

    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user profile not found for email: " + email));
        return UserDto.fromEntity(user);
    }
}
