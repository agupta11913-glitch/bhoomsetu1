package com.bhoomisetu.controller;

import com.bhoomisetu.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/gis")
@CrossOrigin(origins = "*", maxAge = 3600)
public class GisController {

    @Autowired
    private ProjectService projectService;

    @GetMapping({"/map-data", "/authorized-map-data", "/data"})
    public ResponseEntity<Map<String, Object>> getAuthorizedMapData(
            @RequestParam(required = false) String projectId,
            @RequestParam(required = false) String email,
            Authentication authentication
    ) {
        String queryEmail = (authentication != null && authentication.getName() != null)
                ? authentication.getName()
                : (email != null ? email : "citizen@demo.com");
        return ResponseEntity.ok(projectService.getAuthorizedGISMapData(queryEmail, projectId));
    }
}
