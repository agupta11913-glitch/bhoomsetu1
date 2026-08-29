package com.bhoomisetu.exception;

import com.bhoomisetu.entity.Status;

public class AccountStatusException extends RuntimeException {

    private final Status status;
    private final String applicationId;

    public AccountStatusException(String message, Status status, String applicationId) {
        super(message);
        this.status = status;
        this.applicationId = applicationId;
    }

    public Status getStatus() {
        return status;
    }

    public String getApplicationId() {
        return applicationId;
    }
}
