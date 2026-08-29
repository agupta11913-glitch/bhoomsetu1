package com.bhoomisetu.repository;

import com.bhoomisetu.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    Optional<Project> findByProjectId(String projectId);
    List<Project> findByState(String state);
    List<Project> findByStatus(String status);
}
