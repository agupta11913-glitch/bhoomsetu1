package com.bhoomisetu.repository;

import com.bhoomisetu.entity.Role;
import com.bhoomisetu.entity.Status;
import com.bhoomisetu.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByEmployeeId(String employeeId);

    List<User> findByStatus(Status status);

    List<User> findByRole(Role role);

    List<User> findByStatusAndRole(Status status, Role role);
}
