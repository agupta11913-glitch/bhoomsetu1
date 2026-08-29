package com.bhoomisetu.controller;

import com.bhoomisetu.dto.RejectRequest;
import com.bhoomisetu.dto.UserDto;
import com.bhoomisetu.entity.Role;
import com.bhoomisetu.entity.Status;
import com.bhoomisetu.service.AdminService;
import com.bhoomisetu.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserService userService;
    private final AdminService adminService;

    public AdminController(UserService userService, AdminService adminService) {
        this.userService = userService;
        this.adminService = adminService;
    }

    // 1. Dashboard
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        return ResponseEntity.ok(adminService.getDashboardMetrics());
    }

    // 2. Users Management
    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PostMapping("/users")
    public ResponseEntity<Map<String, Object>> createUser(@RequestBody Map<String, Object> req) {
        return ResponseEntity.ok(adminService.createUser(req));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        UserDto user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<Map<String, Object>> updateUser(@PathVariable Long id, @RequestBody Map<String, Object> req) {
        return ResponseEntity.ok(adminService.updateUser(id, req));
    }

    @PutMapping("/users/{id}/toggle-status")
    public ResponseEntity<Map<String, Object>> toggleStatus(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.toggleUserStatus(id));
    }

    @PostMapping("/users/{id}/reset-access")
    public ResponseEntity<Map<String, Object>> resetAccess(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.resetUserAccess(id));
    }

    @PutMapping("/users/{id}/approve")
    public ResponseEntity<UserDto> approveUser(@PathVariable Long id) {
        UserDto approvedUser = userService.approveUser(id);
        return ResponseEntity.ok(approvedUser);
    }

    @PutMapping("/users/{id}/reject")
    public ResponseEntity<UserDto> rejectUser(
            @PathVariable Long id,
            @Valid @RequestBody RejectRequest request
    ) {
        UserDto rejectedUser = userService.rejectUser(id, request.getReason());
        return ResponseEntity.ok(rejectedUser);
    }

    // 3. Roles & Permissions
    @GetMapping("/roles-permissions")
    public ResponseEntity<Map<String, Object>> getRolesPermissions() {
        return ResponseEntity.ok(adminService.getRolesPermissions());
    }

    @PutMapping("/roles-permissions")
    public ResponseEntity<Map<String, Object>> updateRolesPermissions(@RequestBody Map<String, Object> req) {
        return ResponseEntity.ok(adminService.updateRolesPermissions(req));
    }

    // 4. Projects & Departments
    @GetMapping("/projects-departments")
    public ResponseEntity<List<Map<String, Object>>> getProjectsAndDepartments() {
        return ResponseEntity.ok(adminService.getProjectsAndDepartments());
    }

    @PostMapping("/projects")
    public ResponseEntity<Map<String, Object>> createProject(@RequestBody Map<String, Object> req) {
        return ResponseEntity.ok(adminService.createProject(req));
    }

    @PutMapping("/projects/{id}")
    public ResponseEntity<Map<String, Object>> updateProject(@PathVariable Long id, @RequestBody Map<String, Object> req) {
        return ResponseEntity.ok(adminService.updateProjectMaster(id, req));
    }

    // 5. System Monitoring
    @GetMapping("/monitoring")
    public ResponseEntity<Map<String, Object>> getSystemMonitoring() {
        return ResponseEntity.ok(adminService.getSystemMonitoring());
    }

    // 6. System Notifications
    @GetMapping("/notifications")
    public ResponseEntity<List<Map<String, Object>>> getNotifications() {
        return ResponseEntity.ok(adminService.getNotifications());
    }

    @PostMapping("/notifications")
    public ResponseEntity<Map<String, Object>> createNotification(@RequestBody Map<String, Object> req) {
        return ResponseEntity.ok(adminService.createNotification(req));
    }

    // 7. System Settings
    @GetMapping("/settings")
    public ResponseEntity<Map<String, Object>> getSettings() {
        return ResponseEntity.ok(adminService.getSystemSettings());
    }

    @PutMapping("/settings")
    public ResponseEntity<Map<String, Object>> updateSettings(@RequestBody Map<String, Object> req) {
        return ResponseEntity.ok(adminService.updateSystemSettings(req));
    }
}
