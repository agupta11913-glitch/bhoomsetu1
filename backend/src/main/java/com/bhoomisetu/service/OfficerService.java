package com.bhoomisetu.service;

import com.bhoomisetu.entity.*;
import com.bhoomisetu.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class OfficerService {

    @Autowired
    private TehsildarService tehsildarService;

    @Autowired
    private ExecutiveService executiveService;

    @Autowired
    private LandParcelRepository landParcelRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ObjectionRepository objectionRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Unified Role-Aware Dashboard Aggregator
     */
    public Map<String, Object> getDashboard(String userRole, String userEmail) {
        Map<String, Object> response = new LinkedHashMap<>();
        String normalizedRole = (userRole != null) ? userRole.toUpperCase() : "TEHSILDAR";

        response.put("role", normalizedRole);
        response.put("officerEmail", userEmail);

        if ("EXECUTIVE_OFFICER".equalsIgnoreCase(normalizedRole) || "PROJECT_AGENCY".equalsIgnoreCase(normalizedRole)) {
            // Executive Officer: Project Portfolio, Corridor Acreage, 6-Stage Lifecycle Progress
            response.put("portalMode", "EXECUTIVE_MONITORING");
            response.put("portalTitle", "Executive Officer Dashboard — Infrastructure Corridor & Project Monitoring");
            response.put("stats", executiveService.getExecutiveStats());
            response.put("projects", executiveService.getProjects());
            response.put("issues", executiveService.getIssues());
        } else {
            // Tehsildar / Revenue Officer: Land, RoR, Verification, Case Review, Objections
            response.put("portalMode", "TEHSILDAR_REVENUE_REVIEW");
            response.put("portalTitle", "Tehsildar Dashboard — Land & Revenue Acquisition Management");
            response.put("stats", tehsildarService.getDashboardStats());
            response.put("recentCases", tehsildarService.getCases("ALL", null, null, null, null));
            response.put("objections", tehsildarService.getObjections(null, "PENDING"));
        }

        return response;
    }

    /**
     * Case Dossier Retrieval
     */
    public List<LandParcel> getCases(String userRole, String status, String village, String search) {
        return tehsildarService.getCases(null, village, status, null, search);
    }

    public Optional<LandParcel> getCaseDetails(String caseId) {
        return tehsildarService.getCaseById(caseId);
    }

    /**
     * Strict Role-Enforced Case Approval Workflow
     */
    public LandParcel approveCase(String caseId, String remarks, String officerEmail, String userRole) {
        if ("EXECUTIVE_OFFICER".equalsIgnoreCase(userRole)) {
            throw new org.springframework.security.access.AccessDeniedException(
                "FORBIDDEN: Executive Officers are not authorized to make statutory revenue acquisition decisions. Only Tehsildars can approve."
            );
        }
        return tehsildarService.approveCase(caseId, remarks, officerEmail);
    }

    public LandParcel rejectCase(String caseId, String reason, String officerEmail, String userRole) {
        if ("EXECUTIVE_OFFICER".equalsIgnoreCase(userRole)) {
            throw new org.springframework.security.access.AccessDeniedException(
                "FORBIDDEN: Executive Officers are not authorized to reject revenue acquisition cases. Only Tehsildars can reject."
            );
        }
        return tehsildarService.rejectCase(caseId, reason, officerEmail);
    }

    public LandParcel sendBackCase(String caseId, String remarks, String officerEmail, String userRole) {
        if ("EXECUTIVE_OFFICER".equalsIgnoreCase(userRole)) {
            throw new org.springframework.security.access.AccessDeniedException(
                "FORBIDDEN: Executive Officers are not authorized to send back revenue verification cases. Only Tehsildars can send back."
            );
        }
        return tehsildarService.sendBackCase(caseId, remarks, officerEmail);
    }

    /**
     * Projects and Issues Monitoring
     */
    public List<Map<String, Object>> getProjects() {
        return executiveService.getProjects();
    }

    public List<Map<String, Object>> getIssues() {
        return executiveService.getIssues();
    }

    public Map<String, Object> createIssue(Map<String, Object> body, String officerEmail) {
        return executiveService.raiseIssue(body);
    }

    /**
     * Unified GIS Infrastructure
     */
    public Map<String, Object> getGisHierarchy() {
        return tehsildarService.getGisHierarchy();
    }

    public Map<String, Object> getVillageGisStats(String villageName) {
        return tehsildarService.getVillageGisStats(villageName);
    }

    public List<LandParcel> getVillageAffectedParcels(String villageName) {
        return tehsildarService.getVillageAffectedParcels(villageName);
    }

    public Map<String, Object> getHighwayCorridorGis(String projectId) {
        return tehsildarService.getHighwayCorridorGis(projectId);
    }
}
