package com.bhoomisetu.controller;

import com.bhoomisetu.entity.Project;
import com.bhoomisetu.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects(
            @RequestParam(required = false) String state,
            Authentication authentication
    ) {
        // If query param state is provided, filter by state
        if (state != null && !state.isEmpty()) {
            return ResponseEntity.ok(projectService.getProjectsByState(state));
        }
        // If authentication exists, return strictly authorized projects for that user
        if (authentication != null && authentication.getName() != null) {
            return ResponseEntity.ok(projectService.getAuthorizedProjects(authentication.getName()));
        }
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @GetMapping("/authorized")
    public ResponseEntity<List<Project>> getAuthorizedProjects(
            @RequestParam(required = false) String email,
            Authentication authentication
    ) {
        String queryEmail = (authentication != null && authentication.getName() != null)
                ? authentication.getName()
                : (email != null ? email : "citizen@demo.com");
        return ResponseEntity.ok(projectService.getAuthorizedProjects(queryEmail));
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<Project> getProjectById(@PathVariable String projectId) {
        return projectService.getProjectByProjectId(projectId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{projectId}/parcels")
    public ResponseEntity<List<Map<String, Object>>> getProjectParcels(
            @PathVariable String projectId,
            @RequestParam(required = false) String email,
            Authentication authentication
    ) {
        String queryEmail = (authentication != null && authentication.getName() != null)
                ? authentication.getName()
                : (email != null ? email : "");
        return ResponseEntity.ok(projectService.getProjectParcels(projectId, queryEmail));
    }

    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        return ResponseEntity.ok(projectService.saveProject(project));
    }
}
