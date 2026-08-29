package com.bhoomisetu.dto;

import com.bhoomisetu.entity.Role;
import com.bhoomisetu.entity.Status;
import com.bhoomisetu.entity.User;

import java.time.LocalDateTime;

public class UserDto {

    private Long id;
    private String name;
    private String email;
    private String mobile;
    private Role role;
    private Status status;
    private String department;
    private String designation;
    private String employeeId;
    private String organizationName;
    private String state;
    private String district;
    private String address;
    private String rejectionReason;
    private String languagePreference;
    private String themePreference;
    private LocalDateTime createdAt;

    public UserDto() {
    }

    public static UserDto fromEntity(User user) {
        if (user == null) return null;
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setMobile(user.getMobile());
        dto.setRole(user.getRole());
        dto.setStatus(user.getStatus());
        dto.setDepartment(user.getDepartment());
        dto.setDesignation(user.getDesignation());
        dto.setEmployeeId(user.getEmployeeId());
        dto.setOrganizationName(user.getOrganizationName());
        dto.setState(user.getState());
        dto.setDistrict(user.getDistrict());
        dto.setAddress(user.getAddress());
        dto.setRejectionReason(user.getRejectionReason());
        dto.setLanguagePreference(user.getLanguagePreference());
        dto.setThemePreference(user.getThemePreference());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public String getLanguagePreference() {
        return languagePreference != null ? languagePreference : "ENGLISH";
    }

    public void setLanguagePreference(String languagePreference) {
        this.languagePreference = languagePreference;
    }

    public String getThemePreference() {
        return themePreference != null ? themePreference : "LIGHT";
    }

    public void setThemePreference(String themePreference) {
        this.themePreference = themePreference;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
