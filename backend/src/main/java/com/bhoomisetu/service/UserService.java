package com.bhoomisetu.service;

import com.bhoomisetu.dto.UserDto;
import com.bhoomisetu.entity.Role;
import com.bhoomisetu.entity.Status;
import com.bhoomisetu.entity.User;
import com.bhoomisetu.exception.ResourceNotFoundException;
import com.bhoomisetu.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserDto> getUsers(Status status, Role role) {
        List<User> users;
        if (status != null && role != null) {
            users = userRepository.findByStatusAndRole(status, role);
        } else if (status != null) {
            users = userRepository.findByStatus(status);
        } else if (role != null) {
            users = userRepository.findByRole(role);
        } else {
            users = userRepository.findAll();
        }
        return users.stream().map(UserDto::fromEntity).collect(Collectors.toList());
    }

    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return UserDto.fromEntity(user);
    }

    @Transactional
    public UserDto approveUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setStatus(Status.ACTIVE);
        user.setRejectionReason(null);
        User saved = userRepository.save(user);
        return UserDto.fromEntity(saved);
    }

    @Transactional
    public UserDto rejectUser(Long id, String reason) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setStatus(Status.REJECTED);
        user.setRejectionReason(reason != null ? reason : "Application rejected by administrative authority.");
        User saved = userRepository.save(user);
        return UserDto.fromEntity(saved);
    }
}
