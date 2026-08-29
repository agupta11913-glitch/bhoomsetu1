package com.bhoomisetu.dto;

import com.bhoomisetu.entity.Status;

public class AuthResponse {

    private boolean success;
    private String message;
    private String token;
    private UserDto user;
    private Status status;
    private String applicationId;

    public AuthResponse() {
    }

    public static AuthResponse success(String message, String token, UserDto user) {
        AuthResponse response = new AuthResponse();
        response.setSuccess(true);
        response.setMessage(message);
        response.setToken(token);
        response.setUser(user);
        if (user != null) {
            response.setStatus(user.getStatus());
        }
        return response;
    }

    public static AuthResponse pending(String message, String applicationId) {
        AuthResponse response = new AuthResponse();
        response.setSuccess(false);
        response.setMessage(message);
        response.setStatus(Status.PENDING);
        response.setApplicationId(applicationId);
        return response;
    }

    public static AuthResponse error(String message, Status status) {
        AuthResponse response = new AuthResponse();
        response.setSuccess(false);
        response.setMessage(message);
        response.setStatus(status);
        return response;
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

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(String applicationId) {
        this.applicationId = applicationId;
    }
}
