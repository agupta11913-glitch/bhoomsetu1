package com.bhoomisetu.service;

import com.bhoomisetu.entity.Notification;
import com.bhoomisetu.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public List<Notification> getByTargetRole(String role) {
        return notificationRepository.findByTargetRoleOrderByCreatedAtDesc(role);
    }

    public List<Notification> getByUserEmail(String email) {
        return notificationRepository.findByTargetUserEmailOrderByCreatedAtDesc(email);
    }

    public Notification createNotification(Notification n) {
        return notificationRepository.save(n);
    }
}
