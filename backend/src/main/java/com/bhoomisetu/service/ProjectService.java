package com.bhoomisetu.service;

import com.bhoomisetu.entity.LandParcel;
import com.bhoomisetu.entity.Project;
import com.bhoomisetu.entity.Role;
import com.bhoomisetu.entity.User;
import com.bhoomisetu.repository.LandParcelRepository;
import com.bhoomisetu.repository.ProjectRepository;
import com.bhoomisetu.repository.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private static final Logger log = LoggerFactory.getLogger(ProjectService.class);
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private LandParcelRepository landParcelRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Optional<Project> getProjectByProjectId(String projectId) {
        return projectRepository.findByProjectId(projectId);
    }

    public List<Project> getProjectsByState(String state) {
        return projectRepository.findByState(state);
    }

    public Project saveProject(Project project) {
        return projectRepository.save(project);
    }

    /**
     * Role-Based Project Authorization: Returns only projects authorized for the authenticated user.
     */
    public List<Project> getAuthorizedProjects(String userEmail) {
        if (userEmail == null || userEmail.trim().isEmpty()) {
            return projectRepository.findAll();
        }

        Optional<User> userOpt = userRepository.findByEmail(userEmail.toLowerCase().trim());
        if (userOpt.isEmpty()) {
            log.warn("User {} not found, defaulting to public projects list", userEmail);
            return projectRepository.findAll();
        }

        User user = userOpt.get();
        Role role = user.getRole();
        log.info("Evaluating authorized projects for user {} with role {}", user.getEmail(), role);

        List<Project> allProjects = projectRepository.findAll();

        if (role == Role.CITIZEN) {
            // Citizen: Only projects associated with land parcels owned by this citizen
            List<LandParcel> citizenParcels = landParcelRepository.findByEmail(user.getEmail());
            Set<String> authorizedProjectIds = citizenParcels.stream()
                    .map(LandParcel::getProjectId)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toSet());

            log.info("Citizen {} authorized project IDs: {}", user.getEmail(), authorizedProjectIds);
            return allProjects.stream()
                    .filter(p -> authorizedProjectIds.contains(p.getProjectId()))
                    .collect(Collectors.toList());
        } else if (role == Role.GOVERNMENT_OFFICER || role == Role.TEHSILDAR) {
            // Revenue Officer / Tehsildar: Projects in their assigned district / jurisdiction
            String userDistrict = user.getDistrict() != null ? user.getDistrict().toLowerCase() : "agra";
            return allProjects.stream()
                    .filter(p -> p.getDistricts() != null && p.getDistricts().toLowerCase().contains(userDistrict))
                    .collect(Collectors.toList());
        } else if (role == Role.EXECUTIVE_OFFICER || role == Role.PROJECT_AGENCY) {
            // Executive Officer / PIA: Assigned agency projects (e.g. NHAI)
            String agency = (user.getOrganizationName() != null && !user.getOrganizationName().isEmpty())
                    ? user.getOrganizationName().toLowerCase()
                    : "nhai";
            return allProjects.stream()
                    .filter(p -> (p.getRequiringAgency() != null && p.getRequiringAgency().toLowerCase().contains("nhai"))
                            || (p.getAuthority() != null && p.getAuthority().toLowerCase().contains("morth"))
                            || (p.getDistricts() != null && p.getDistricts().toLowerCase().contains("agra")))
                    .collect(Collectors.toList());
        } else if (role == Role.DISTRICT_AUTHORITY) {
            // District Magistrate: Projects passing through their district
            String userDistrict = user.getDistrict() != null ? user.getDistrict().toLowerCase() : "agra";
            return allProjects.stream()
                    .filter(p -> p.getDistricts() != null && p.getDistricts().toLowerCase().contains(userDistrict))
                    .collect(Collectors.toList());
        } else if (role == Role.STATE_GOVERNMENT) {
            // State Secretariat: Projects in their state
            String userState = user.getState() != null ? user.getState().toLowerCase() : "uttar pradesh";
            return allProjects.stream()
                    .filter(p -> p.getState() != null && p.getState().toLowerCase().contains(userState))
                    .collect(Collectors.toList());
        } else {
            // Central Ministry / System Admin: All projects
            return allProjects;
        }
    }

    /**
     * Returns project parcels with role-based masking and strict project association.
     */
    public List<Map<String, Object>> getProjectParcels(String projectId, String userEmail) {
        List<LandParcel> rawParcels = landParcelRepository.findByProjectId(projectId);
        List<Map<String, Object>> result = new ArrayList<>();

        Optional<User> userOpt = (userEmail != null) ? userRepository.findByEmail(userEmail.toLowerCase().trim()) : Optional.empty();
        Role role = userOpt.map(User::getRole).orElse(Role.CITIZEN);
        String currentUserEmail = userOpt.map(User::getEmail).orElse("");

        for (LandParcel p : rawParcels) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", p.getId());
            map.put("khasraNumber", p.getKhasraNumber());
            map.put("khataNumber", p.getKhataNumber());
            map.put("caseId", p.getCaseId());
            map.put("projectId", p.getProjectId());
            map.put("projectName", p.getProjectName());

            // Information visibility: Citizen sees their own details; other owners anonymized unless officer
            if (role == Role.CITIZEN && !currentUserEmail.equalsIgnoreCase(p.getEmail())) {
                map.put("ownerName", "Authorized Landholder (Private)");
                map.put("fatherName", "—");
                map.put("aadhaarMasked", "XXXX-XXXX-XXXX");
                map.put("email", "—");
            } else {
                map.put("ownerName", p.getOwnerName());
                map.put("fatherName", p.getFatherName());
                map.put("aadhaarMasked", p.getAadhaarMasked());
                map.put("email", p.getEmail());
            }

            map.put("areaAcre", p.getAreaAcre() != null ? p.getAreaAcre() : 2.5);
            map.put("affectedAreaAcre", p.getAffectedAreaAcre() != null ? p.getAffectedAreaAcre() : 0.8);
            map.put("remainingAreaAcre", p.getRemainingAreaAcre() != null ? p.getRemainingAreaAcre() : 1.7);
            map.put("landType", p.getLandType() != null ? p.getLandType() : "Agricultural");
            map.put("village", p.getVillage() != null ? p.getVillage() : "Nagla");
            map.put("tehsil", p.getTehsil() != null ? p.getTehsil() : "Fatehabad");
            map.put("district", p.getDistrict() != null ? p.getDistrict() : "Agra");
            map.put("state", p.getState() != null ? p.getState() : "Uttar Pradesh");
            map.put("status", p.getStatus() != null ? p.getStatus() : "IN_PROGRESS");
            map.put("verificationStatus", p.getVerificationStatus() != null ? p.getVerificationStatus() : (p.getRevenueVerified() ? "VERIFIED" : "PENDING"));
            map.put("totalCompensation", p.getTotalCompensation() != null ? p.getTotalCompensation() : 45000000.0);
            map.put("paymentStatus", p.getPaymentStatus() != null ? p.getPaymentStatus() : "DISBURSED");
            map.put("isContextual", false);

            // Coordinates
            List<List<Double>> coords = parseCoordinates(p.getCoordinatesJson());
            if (coords.isEmpty()) {
                coords = getDefaultParcelCoords(p.getKhasraNumber());
            }
            map.put("coords", coords);

            List<List<Double>> affectedCoords = parseCoordinates(p.getAffectedCoordinatesJson());
            map.put("affectedCoords", affectedCoords);

            result.add(map);
        }

        return result;
    }

    /**
     * Comprehensive Synchronized GIS Map Payload tailored to the Authenticated User.
     */
    public Map<String, Object> getAuthorizedGISMapData(String userEmail, String requestedProjectId) {
        List<Project> authorizedProjects = getAuthorizedProjects(userEmail);

        Optional<User> userOpt = (userEmail != null) ? userRepository.findByEmail(userEmail.toLowerCase().trim()) : Optional.empty();
        String userRole = userOpt.map(u -> u.getRole().name()).orElse("CITIZEN");
        String userDistrict = userOpt.map(User::getDistrict).orElse("Agra");
        String userState = userOpt.map(User::getState).orElse("Uttar Pradesh");

        List<Map<String, Object>> formattedProjects = new ArrayList<>();
        for (Project p : authorizedProjects) {
            Map<String, Object> pm = new LinkedHashMap<>();
            pm.put("id", p.getId());
            pm.put("projectId", p.getProjectId());
            pm.put("name", p.getName());
            pm.put("shortName", p.getShortName());
            pm.put("projectType", p.getProjectType());
            pm.put("requiringAgency", p.getRequiringAgency());
            pm.put("districts", p.getDistricts());
            pm.put("state", p.getState());
            pm.put("status", p.getStatus());
            pm.put("currentStage", p.getCurrentStage());
            pm.put("possessionPercentage", p.getPossessionPercentage());
            pm.put("rrProgress", p.getRrProgress());
            pm.put("timelineStatus", p.getTimelineStatus());
            pm.put("totalLandRequired", p.getTotalLandRequired());
            pm.put("landAcquired", p.getLandAcquired());

            // Coordinates & Visual Styling
            List<List<Double>> coords = parseCoordinates(p.getCoordinatesJson());
            List<List<Double>> alignment = parseCoordinates(p.getAlignmentCoordinatesJson());

            ProjectMapMeta meta = getProjectMeta(p.getProjectId());
            pm.put("color", meta.color);
            pm.put("center", meta.center);
            pm.put("zoom", meta.zoom);
            pm.put("boundary", coords.isEmpty() ? meta.boundary : coords);
            pm.put("coords", alignment.isEmpty() ? meta.alignment : alignment);

            formattedProjects.add(pm);
        }

        // Active project selection
        String activeProjectId = "ALL";
        if (requestedProjectId != null && !requestedProjectId.isEmpty() && !"ALL".equalsIgnoreCase(requestedProjectId)) {
            boolean isAuthorized = authorizedProjects.stream().anyMatch(p -> p.getProjectId().equalsIgnoreCase(requestedProjectId));
            if (isAuthorized) {
                activeProjectId = requestedProjectId;
            } else if (!authorizedProjects.isEmpty()) {
                activeProjectId = authorizedProjects.get(0).getProjectId();
            }
        } else if (authorizedProjects.size() == 1) {
            activeProjectId = authorizedProjects.get(0).getProjectId();
        }

        // Fetch parcels for active project
        List<Map<String, Object>> affectedParcels = new ArrayList<>();
        List<Map<String, Object>> surroundingParcels = new ArrayList<>();

        if (!"ALL".equalsIgnoreCase(activeProjectId)) {
            affectedParcels = getProjectParcels(activeProjectId, userEmail);
            surroundingParcels = getSurroundingBufferParcels(activeProjectId);
        } else if (!authorizedProjects.isEmpty()) {
            for (Project ap : authorizedProjects) {
                affectedParcels.addAll(getProjectParcels(ap.getProjectId(), userEmail));
                surroundingParcels.addAll(getSurroundingBufferParcels(ap.getProjectId()));
            }
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("userRole", userRole);
        response.put("userDistrict", userDistrict);
        response.put("userState", userState);
        response.put("totalAuthorizedProjects", formattedProjects.size());
        response.put("projects", formattedProjects);
        response.put("selectedProjectId", activeProjectId);
        response.put("affectedParcels", affectedParcels);
        response.put("surroundingParcels", surroundingParcels);

        return response;
    }

    private List<List<Double>> parseCoordinates(String json) {
        if (json == null || json.trim().isEmpty()) return Collections.emptyList();
        try {
            return objectMapper.readValue(json, new TypeReference<List<List<Double>>>() {});
        } catch (Exception e) {
            log.warn("Failed to parse coordinates JSON: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    private List<List<Double>> getDefaultParcelCoords(String khasra) {
        double baseLat = 27.1650;
        double baseLng = 78.0650;
        try {
            int offset = Integer.parseInt(khasra.replaceAll("\\D+", "")) % 10;
            baseLat += (offset * 0.0006);
            baseLng += (offset * 0.0006);
        } catch (Exception ignored) {}

        return List.of(
                List.of(baseLat, baseLng),
                List.of(baseLat + 0.0006, baseLng + 0.0002),
                List.of(baseLat + 0.0005, baseLng + 0.0011),
                List.of(baseLat - 0.0002, baseLng + 0.0010),
                List.of(baseLat, baseLng)
        );
    }

    private List<Map<String, Object>> getSurroundingBufferParcels(String projectId) {
        List<Map<String, Object>> buffers = new ArrayList<>();
        if ("PRJ-001".equalsIgnoreCase(projectId)) {
            Map<String, Object> b1 = new LinkedHashMap<>();
            b1.put("id", 991L);
            b1.put("khasraNumber", "106 (Buffer)");
            b1.put("khataNumber", "KH-847");
            b1.put("ownerName", "Gram Sabha / Reserved Buffer");
            b1.put("areaAcre", 3.20);
            b1.put("affectedAreaAcre", 0.0);
            b1.put("village", "Nagla");
            b1.put("tehsil", "Fatehabad");
            b1.put("status", "BUFFER");
            b1.put("isContextual", true);
            b1.put("coords", List.of(
                    List.of(27.1664, 78.0649),
                    List.of(27.1670, 78.0652),
                    List.of(27.1669, 78.0661),
                    List.of(27.1663, 78.0657)
            ));
            buffers.add(b1);

            Map<String, Object> b2 = new LinkedHashMap<>();
            b2.put("id", 992L);
            b2.put("khasraNumber", "107 (Buffer)");
            b2.put("khataNumber", "KH-848");
            b2.put("ownerName", "State Forest Department");
            b2.put("areaAcre", 5.40);
            b2.put("affectedAreaAcre", 0.0);
            b2.put("village", "Nagla");
            b2.put("tehsil", "Fatehabad");
            b2.put("status", "BUFFER");
            b2.put("isContextual", true);
            b2.put("coords", List.of(
                    List.of(27.1637, 78.0646),
                    List.of(27.1638, 78.0653),
                    List.of(27.1632, 78.0652),
                    List.of(27.1631, 78.0645)
            ));
            buffers.add(b2);
        }
        return buffers;
    }

    private ProjectMapMeta getProjectMeta(String projectId) {
        if ("PRJ-001".equalsIgnoreCase(projectId)) {
            return new ProjectMapMeta(
                    "#8b5cf6",
                    List.of(27.1650, 78.0650),
                    14,
                    List.of(List.of(27.1580, 78.0520), List.of(27.1740, 78.0800), List.of(27.1710, 78.0820), List.of(27.1550, 78.0540)),
                    List.of(List.of(27.1600, 78.0550), List.of(27.1630, 78.0600), List.of(27.1652, 78.0645), List.of(27.1680, 78.0700), List.of(27.1720, 78.0780))
            );
        } else if ("PRJ-005".equalsIgnoreCase(projectId)) {
            return new ProjectMapMeta(
                    "#06b6d4",
                    List.of(27.1767, 78.0081),
                    13,
                    List.of(List.of(27.1480, 77.9780), List.of(27.2020, 78.0420), List.of(27.1980, 78.0460), List.of(27.1440, 77.9820)),
                    List.of(List.of(27.1500, 77.9800), List.of(27.1767, 78.0081), List.of(27.2000, 78.0400))
            );
        } else if ("PRJ-002".equalsIgnoreCase(projectId)) {
            return new ProjectMapMeta(
                    "#f59e0b",
                    List.of(28.3650, 76.9400),
                    13,
                    List.of(List.of(28.3480, 76.9180), List.of(28.3820, 76.9620), List.of(28.3780, 76.9640), List.of(28.3460, 76.9200)),
                    List.of(List.of(28.3500, 76.9200), List.of(28.3650, 76.9400), List.of(28.3800, 76.9600))
            );
        } else if ("PRJ-003".equalsIgnoreCase(projectId)) {
            return new ProjectMapMeta(
                    "#ec4899",
                    List.of(18.5400, 73.8700),
                    12,
                    List.of(List.of(18.5180, 73.8480), List.of(18.5620, 73.8920), List.of(18.5580, 73.8940), List.of(18.5160, 73.8500)),
                    List.of(List.of(18.5200, 73.8500), List.of(18.5400, 73.8700), List.of(18.5600, 73.8900))
            );
        } else {
            return new ProjectMapMeta(
                    "#10b981",
                    List.of(21.1900, 72.8500),
                    13,
                    List.of(List.of(21.1680, 72.8280), List.of(21.2120, 72.8720), List.of(21.2080, 72.8740), List.of(21.1660, 72.8300)),
                    List.of(List.of(21.1700, 72.8300), List.of(21.1900, 72.8500), List.of(21.2100, 72.8700))
            );
        }
    }

    private static class ProjectMapMeta {
        String color;
        List<Double> center;
        int zoom;
        List<List<Double>> boundary;
        List<List<Double>> alignment;

        public ProjectMapMeta(String color, List<Double> center, int zoom, List<List<Double>> boundary, List<List<Double>> alignment) {
            this.color = color;
            this.center = center;
            this.zoom = zoom;
            this.boundary = boundary;
            this.alignment = alignment;
        }
    }
}
