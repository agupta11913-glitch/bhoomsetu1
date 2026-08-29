package com.bhoomisetu.controller;

import com.bhoomisetu.entity.Notification;
import com.bhoomisetu.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*", maxAge = 3600)
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String email
    ) {
        if (role != null && !role.isEmpty()) {
            return ResponseEntity.ok(notificationService.getByTargetRole(role));
        }
        if (email != null && !email.isEmpty()) {
            return ResponseEntity.ok(notificationService.getByUserEmail(email));
        }
        return ResponseEntity.ok(notificationService.getAllNotifications());
    }

    @PostMapping
    public ResponseEntity<Notification> createNotification(@RequestBody Notification notification) {
        return ResponseEntity.ok(notificationService.createNotification(notification));
    }
}
