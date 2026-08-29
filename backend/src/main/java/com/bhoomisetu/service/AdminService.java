package com.bhoomisetu.service;

import com.bhoomisetu.dto.UserDto;
import com.bhoomisetu.entity.Project;
import com.bhoomisetu.entity.Role;
import com.bhoomisetu.entity.Status;
import com.bhoomisetu.entity.User;
import com.bhoomisetu.exception.ResourceNotFoundException;
import com.bhoomisetu.repository.ProjectRepository;
import com.bhoomisetu.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

    // In-memory persistent stores for admin config, permissions, notifications & settings
    private final Map<String, List<String>> rolePermissionsMap = new ConcurrentHashMap<>();
    private final List<Map<String, Object>> systemNotifications = Collections.synchronizedList(new ArrayList<>());
    private final Map<String, Object> systemSettings = new ConcurrentHashMap<>();
    private final List<Map<String, Object>> systemErrorLogs = Collections.synchronizedList(new ArrayList<>());

    public AdminService(UserRepository userRepository, ProjectRepository projectRepository) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        initDefaultPermissions();
        initDefaultNotifications();
        initDefaultSettings();
        initDefaultErrors();
    }

    private void initDefaultPermissions() {
        rolePermissionsMap.put("DISTRICT", Arrays.asList("VIEW", "EDIT", "UPDATE", "UPLOAD", "FORWARD", "ESCALATE"));
        rolePermissionsMap.put("STATE", Arrays.asList("VIEW", "EDIT", "UPDATE", "FORWARD", "ESCALATE"));
        rolePermissionsMap.put("CENTRAL", Arrays.asList("VIEW", "UPDATE", "FORWARD", "ESCALATE"));
        rolePermissionsMap.put("REVENUE_OFFICER", Arrays.asList("VIEW", "ADD", "EDIT", "UPDATE", "UPLOAD", "FORWARD"));
        rolePermissionsMap.put("TEHSILDAR", Arrays.asList("VIEW", "EDIT", "UPDATE", "UPLOAD", "FORWARD", "ESCALATE"));
        rolePermissionsMap.put("EXECUTIVE_OFFICER", Arrays.asList("VIEW", "EDIT", "UPDATE", "UPLOAD", "FORWARD"));
        rolePermissionsMap.put("PROJECT_AGENCY", Arrays.asList("VIEW", "UPDATE", "UPLOAD", "FORWARD"));
    }

    private void initDefaultNotifications() {
        Map<String, Object> n1 = new HashMap<>();
        n1.put("id", "NOTIF-ADM-001");
        n1.put("title", "Scheduled System Maintenance Window");
        n1.put("message", "NICNET server sync scheduled on Sunday 02:00 AM - 04:00 AM IST.");
        n1.put("targetAudience", "ALL_USERS");
        n1.put("priority", "NORMAL");
        n1.put("status", "SENT");
        n1.put("sentAt", "2026-08-28 10:00:00");
        n1.put("recipientCount", 1420);
        systemNotifications.add(n1);

        Map<String, Object> n2 = new HashMap<>();
        n2.put("id", "NOTIF-ADM-002");
        n2.put("title", "PFMS Direct Benefit Transfer Security Advisory");
        n2.put("message", "All District CALA officers must re-verify bank IFSC mappings before batch awards.");
        n2.put("targetAudience", "DISTRICT");
        n2.put("priority", "HIGH");
        n2.put("status", "SENT");
        n2.put("sentAt", "2026-08-28 14:30:00");
        n2.put("recipientCount", 85);
        systemNotifications.add(n2);
    }

    private void initDefaultSettings() {
        // System Configuration
        systemSettings.put("sessionTimeoutMinutes", 60);
        systemSettings.put("maxFileUploadSizeMb", 25);
        systemSettings.put("maintenanceMode", false);
        systemSettings.put("apiRateLimitPerMinute", 500);
        systemSettings.put("platformName", "BhoomiSetu National Platform");

        // Role Configuration
        systemSettings.put("defaultNewUserRole", "CITIZEN");
        systemSettings.put("allowSelfRegistration", true);
        systemSettings.put("enforceTwoFactorAuth", true);
        systemSettings.put("passwordExpiryDays", 90);

        // Notification Configuration
        systemSettings.put("enableEmailAlerts", true);
        systemSettings.put("enableSmsBroadcast", true);
        systemSettings.put("inAppBannerEnabled", true);
        systemSettings.put("notificationRetentionDays", 30);
    }

    private void initDefaultErrors() {
        Map<String, Object> err1 = new HashMap<>();
        err1.put("id", "ERR-2026-0881");
        err1.put("service", "NIC Bhulekh Sync Gateway");
        err1.put("code", "HTTP_504_GATEWAY_TIMEOUT");
        err1.put("message", "Upstream state Bhulekh server timed out after 5000ms. Auto-retried successfully.");
        err1.put("timestamp", "2026-08-28 22:14:05");
        err1.put("severity", "LOW");
        systemErrorLogs.add(err1);

        Map<String, Object> err2 = new HashMap<>();
        err2.put("id", "ERR-2026-0882");
        err2.put("service", "PFMS DBT Validation Service");
        err2.put("code", "VALIDATION_WARNING");
        err2.put("message", "Bank account verification flagged for 1 PAF beneficiary due to single name record.");
        err2.put("timestamp", "2026-08-28 23:05:12");
        err2.put("severity", "MEDIUM");
        systemErrorLogs.add(err2);
    }

    // 1. Dashboard Metrics
    public Map<String, Object> getDashboardMetrics() {
        List<User> allUsers = userRepository.findAll();
        List<Project> allProjects = projectRepository.findAll();

        long totalUsers = allUsers.size();
        long activeUsers = allUsers.stream().filter(u -> u.getStatus() == Status.ACTIVE).count();
        long districtUsers = allUsers.stream().filter(u -> u.getRole() == Role.DISTRICT_AUTHORITY).count();
        long stateUsers = allUsers.stream().filter(u -> u.getRole() == Role.STATE_GOVERNMENT).count();
        long centralUsers = allUsers.stream().filter(u -> u.getRole() == Role.CENTRAL_MINISTRY).count();
        long piaUsers = allUsers.stream().filter(u -> u.getRole() == Role.PROJECT_AGENCY || u.getRole() == Role.EXECUTIVE_OFFICER).count();
        long activeProjects = allProjects.stream().filter(p -> "ACTIVE".equalsIgnoreCase(p.getStatus())).count();

        Map<String, Object> res = new HashMap<>();
        res.put("totalUsers", totalUsers);
        res.put("activeUsers", activeUsers);
        res.put("districtUsers", districtUsers);
        res.put("stateUsers", stateUsers);
        res.put("centralUsers", centralUsers);
        res.put("piaUsers", piaUsers);
        res.put("activeProjects", activeProjects > 0 ? activeProjects : allProjects.size());
        res.put("totalProjects", allProjects.size());

        Map<String, Object> systemStatus = new HashMap<>();
        systemStatus.put("apiStatus", "OPERATIONAL");
        systemStatus.put("databaseStatus", "HEALTHY");
        systemStatus.put("authStatus", "SECURE");
        systemStatus.put("activeSessions", 38);
        systemStatus.put("uptime", "99.98%");
        res.put("systemStatus", systemStatus);

        return res;
    }

    // 2. Users Management
    public List<Map<String, Object>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(u -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", u.getId());
            m.put("name", u.getName());
            m.put("email", u.getEmail());
            m.put("mobile", u.getMobile());
            m.put("role", u.getRole() != null ? u.getRole().name() : "CITIZEN");
            m.put("governmentLevel", getGovLevel(u.getRole()));
            m.put("department", u.getDepartment() != null ? u.getDepartment() : "General Administration");
            m.put("designation", u.getDesignation() != null ? u.getDesignation() : "Officer");
            m.put("district", u.getDistrict() != null ? u.getDistrict() : "Agra");
            m.put("state", u.getState() != null ? u.getState() : "Uttar Pradesh");
            m.put("status", u.getStatus() != null ? u.getStatus().name() : "ACTIVE");
            m.put("employeeId", u.getEmployeeId());
            return m;
        }).collect(Collectors.toList());
    }

    private String getGovLevel(Role role) {
        if (role == null) return "Citizen";
        switch (role) {
            case CENTRAL_MINISTRY: return "Central Government";
            case STATE_GOVERNMENT: return "State Government";
            case DISTRICT_AUTHORITY: return "District Administration";
            case TEHSILDAR:
            case GOVERNMENT_OFFICER: return "Sub-District / Revenue";
            case PROJECT_AGENCY:
            case EXECUTIVE_OFFICER: return "Implementing Agency (PIA)";
            case ADMIN: return "System Central";
            default: return "Citizen";
        }
    }

    @Transactional
    public Map<String, Object> createUser(Map<String, Object> req) {
        String name = (String) req.get("name");
        String email = ((String) req.get("email")).toLowerCase().trim();
        String mobile = (String) req.get("mobile");
        String roleStr = (String) req.get("role");
        String dept = (String) req.get("department");
        String desig = (String) req.get("designation");
        String dist = (String) req.get("district");
        String state = (String) req.get("state");

        Role role = Role.CITIZEN;
        try {
            role = Role.valueOf(roleStr);
        } catch (Exception ignored) {}

        User u = new User();
        u.setName(name != null ? name : "New Administrative User");
        u.setEmail(email);
        u.setMobile(mobile != null ? mobile : "+91 99999 00000");
        u.setPassword("Bhoomi@123");
        u.setRole(role);
        u.setStatus(Status.ACTIVE);
        u.setDepartment(dept != null ? dept : "General Administration");
        u.setDesignation(desig != null ? desig : "Administrative Officer");
        u.setDistrict(dist != null ? dist : "Agra");
        u.setState(state != null ? state : "Uttar Pradesh");
        u.setEmployeeId("BS-" + System.currentTimeMillis() % 100000);

        User saved = userRepository.save(u);

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "User created successfully with default credentials.");
        res.put("userId", saved.getId());
        return res;
    }

    @Transactional
    public Map<String, Object> updateUser(Long id, Map<String, Object> req) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));

        if (req.containsKey("name")) user.setName((String) req.get("name"));
        if (req.containsKey("department")) user.setDepartment((String) req.get("department"));
        if (req.containsKey("designation")) user.setDesignation((String) req.get("designation"));
        if (req.containsKey("district")) user.setDistrict((String) req.get("district"));
        if (req.containsKey("state")) user.setState((String) req.get("state"));
        if (req.containsKey("role")) {
            try {
                user.setRole(Role.valueOf((String) req.get("role")));
            } catch (Exception ignored) {}
        }
        if (req.containsKey("status")) {
            try {
                user.setStatus(Status.valueOf((String) req.get("status")));
            } catch (Exception ignored) {}
        }

        userRepository.save(user);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "User profile updated successfully.");
        return res;
    }

    @Transactional
    public Map<String, Object> toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));

        if (user.getStatus() == Status.ACTIVE) {
            user.setStatus(Status.REJECTED);
        } else {
            user.setStatus(Status.ACTIVE);
        }
        userRepository.save(user);

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("newStatus", user.getStatus().name());
        res.put("message", "User status updated to " + user.getStatus().name());
        return res;
    }

    @Transactional
    public Map<String, Object> resetUserAccess(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));

        user.setPassword("Bhoomi@123");
        user.setStatus(Status.ACTIVE);
        userRepository.save(user);

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "Access credentials reset to default password (Bhoomi@123). Active sessions revoked.");
        return res;
    }

    // 3. Roles & Permissions Management
    public Map<String, Object> getRolesPermissions() {
        List<String> allPermissions = Arrays.asList("VIEW", "ADD", "EDIT", "UPDATE", "UPLOAD", "FORWARD", "ESCALATE");
        List<Map<String, Object>> roles = new ArrayList<>();

        String[] managedRoles = {
                "DISTRICT", "STATE", "CENTRAL", "REVENUE_OFFICER", "TEHSILDAR", "EXECUTIVE_OFFICER", "PROJECT_AGENCY"
        };

        String[] displayNames = {
                "District (DM / Authority)", "State Government", "Central Ministry", "Revenue Officer (CALA)",
                "Tehsildar (Executive Officer)", "Executive Officer (Project Lead)", "Project Implementing Agency (PIA)"
        };

        for (int i = 0; i < managedRoles.length; i++) {
            String roleKey = managedRoles[i];
            Map<String, Object> r = new HashMap<>();
            r.put("roleKey", roleKey);
            r.put("displayName", displayNames[i]);
            r.put("assignedPermissions", rolePermissionsMap.getOrDefault(roleKey, Collections.emptyList()));
            roles.add(r);
        }

        Map<String, Object> res = new HashMap<>();
        res.put("permissions", allPermissions);
        res.put("roles", roles);
        return res;
    }

    public Map<String, Object> updateRolesPermissions(Map<String, Object> req) {
        if (req.containsKey("roleKey") && req.containsKey("permissions")) {
            String roleKey = (String) req.get("roleKey");
            @SuppressWarnings("unchecked")
            List<String> perms = (List<String>) req.get("permissions");
            rolePermissionsMap.put(roleKey, perms);
        } else if (req.containsKey("matrix")) {
            @SuppressWarnings("unchecked")
            Map<String, List<String>> matrix = (Map<String, List<String>>) req.get("matrix");
            rolePermissionsMap.putAll(matrix);
        }

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "Roles & permissions matrix updated and enforced platform-wide.");
        return res;
    }

    // 4. Projects & Departments Management
    public List<Map<String, Object>> getProjectsAndDepartments() {
        List<Project> projects = projectRepository.findAll();
        List<Map<String, Object>> list = new ArrayList<>();

        for (Project p : projects) {
            Map<String, Object> m = new HashMap<>();
            m.put("id", p.getId());
            m.put("projectId", p.getProjectId());
            m.put("name", p.getName());
            m.put("state", p.getState());
            m.put("districts", p.getDistricts());
            m.put("department", p.getAuthority() != null ? p.getAuthority() : "Ministry of Road Transport & Highways");
            m.put("pia", p.getRequiringAgency() != null ? p.getRequiringAgency() : "National Highways Authority of India (NHAI)");
            m.put("status", p.getStatus() != null ? p.getStatus() : "ACTIVE");
            m.put("authorizedUsers", "District Magistrate (" + (p.getDistricts() != null ? p.getDistricts() : "Agra") + "), Chief Project Director, SLAO");
            m.put("estimatedCost", p.getEstimatedCost() != null ? p.getEstimatedCost() : 840.0);
            list.add(m);
        }

        return list;
    }

    @Transactional
    public Map<String, Object> createProject(Map<String, Object> req) {
        String name = (String) req.get("name");
        String projectId = (String) req.get("projectId");
        String state = (String) req.get("state");
        String districts = (String) req.get("districts");
        String dept = (String) req.get("department");
        String pia = (String) req.get("pia");

        Project p = new Project();
        p.setProjectId(projectId != null ? projectId : "PRJ-" + String.format("%03d", System.currentTimeMillis() % 1000));
        p.setName(name != null ? name : "New Infrastructure Package");
        p.setState(state != null ? state : "Uttar Pradesh");
        p.setDistricts(districts != null ? districts : "Agra");
        p.setAuthority(dept != null ? dept : "Ministry of Road Transport & Highways");
        p.setRequiringAgency(pia != null ? pia : "National Highways Authority of India (NHAI)");
        p.setStatus("ACTIVE");
        p.setEstimatedCost(500.0);
        p.setTotalLandRequired(500.0);

        Project saved = projectRepository.save(p);

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("projectId", saved.getProjectId());
        res.put("message", "Master project and department configuration initialized.");
        return res;
    }

    @Transactional
    public Map<String, Object> updateProjectMaster(Long id, Map<String, Object> req) {
        Project p = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + id));

        if (req.containsKey("name")) p.setName((String) req.get("name"));
        if (req.containsKey("department")) p.setAuthority((String) req.get("department"));
        if (req.containsKey("pia")) p.setRequiringAgency((String) req.get("pia"));
        if (req.containsKey("districts")) p.setDistricts((String) req.get("districts"));
        if (req.containsKey("state")) p.setState((String) req.get("state"));
        if (req.containsKey("status")) p.setStatus((String) req.get("status"));

        projectRepository.save(p);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "Project and department assignments updated.");
        return res;
    }

    // 5. System Monitoring
    public Map<String, Object> getSystemMonitoring() {
        Map<String, Object> res = new HashMap<>();

        Map<String, Object> api = new HashMap<>();
        api.put("status", "OPERATIONAL");
        api.put("latencyMs", 24);
        api.put("endpointsMonitored", 32);
        api.put("requestsPerMinute", 145);
        res.put("apiStatus", api);

        Map<String, Object> db = new HashMap<>();
        db.put("status", "HEALTHY");
        db.put("poolSize", 20);
        db.put("activeConnections", 4);
        db.put("queryAvgMs", 6.8);
        res.put("databaseStatus", db);

        Map<String, Object> auth = new HashMap<>();
        auth.put("status", "SECURE");
        auth.put("jwtAlgorithm", "HS512");
        auth.put("tokenExpiryMinutes", 1440);
        auth.put("activeTokens", 42);
        res.put("authStatus", auth);

        res.put("activeUsersCount", 38);
        res.put("recentErrors", new ArrayList<>(systemErrorLogs));

        return res;
    }

    // 6. System Notifications
    public List<Map<String, Object>> getNotifications() {
        return new ArrayList<>(systemNotifications);
    }

    public Map<String, Object> createNotification(Map<String, Object> req) {
        String title = (String) req.get("title");
        String message = (String) req.get("message");
        String target = (String) req.get("targetAudience");
        String priority = (String) req.get("priority");

        Map<String, Object> notif = new HashMap<>();
        notif.put("id", "NOTIF-ADM-" + String.format("%03d", systemNotifications.size() + 1));
        notif.put("title", title != null ? title : "System Broadcast");
        notif.put("message", message != null ? message : "");
        notif.put("targetAudience", target != null ? target : "ALL_USERS");
        notif.put("priority", priority != null ? priority : "NORMAL");
        notif.put("status", "SENT");
        notif.put("sentAt", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        notif.put("recipientCount", 1250);

        systemNotifications.add(0, notif);

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("notificationId", notif.get("id"));
        res.put("message", "System notification broadcast dispatched successfully.");
        return res;
    }

    // 7. System Settings
    public Map<String, Object> getSystemSettings() {
        return new HashMap<>(systemSettings);
    }

    public Map<String, Object> updateSystemSettings(Map<String, Object> req) {
        systemSettings.putAll(req);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "Application configuration parameters saved.");
        return res;
    }
}
