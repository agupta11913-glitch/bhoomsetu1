package com.bhoomisetu.service;

import com.bhoomisetu.entity.LandParcel;
import com.bhoomisetu.entity.Project;
import com.bhoomisetu.repository.LandParcelRepository;
import com.bhoomisetu.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class AgencyService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private LandParcelRepository landParcelRepository;

    // In-memory persistent stores for agency milestones, issues, and documents
    private final Map<String, Map<String, Object>> milestonesStore = new ConcurrentHashMap<>();
    private final Map<String, Map<String, Object>> issuesStore = new ConcurrentHashMap<>();
    private final List<Map<String, Object>> documentsStore = new ArrayList<>();
    private final Map<String, List<Map<String, Object>>> projectRemarksStore = new ConcurrentHashMap<>();

    public AgencyService() {
        initDefaultMilestones();
        initDefaultIssues();
        initDefaultDocuments();
    }

    private void initDefaultMilestones() {
        addMilestone("MS-001", "PRJ-001", "Section 3A Requisition & Alignment Finalization", "2024-03-15", "2024-03-10", 100.0, "COMPLETED", "Joint survey verified with Revenue Inspector & CALA");
        addMilestone("MS-002", "PRJ-001", "Joint Measurement Verification (JMV) 100% Boundary Demarcation", "2024-08-30", "2024-09-15", 100.0, "COMPLETED", "All 124 pegs established across Nagla and Fatehabad");
        addMilestone("MS-003", "PRJ-001", "Section 19 Declaration & CALA Competent Sanction", "2025-02-28", "2025-02-20", 100.0, "COMPLETED", "Published in District Gazette & National Dailies");
        addMilestone("MS-004", "PRJ-001", "Utility Shifting (400kV Power Transmission Lines)", "2025-11-30", "2026-02-15", 65.0, "DELAYED", "UPPTCL tower foundation relocation ongoing between Ch. 14+200 to 14+500");
        addMilestone("MS-005", "PRJ-001", "Civil Contractor Physical Site Possession Handover", "2026-06-30", "—", 45.0, "IN_PROGRESS", "84 parcels handed over to L&T Infrastructure; 40 in progress");
        addMilestone("MS-006", "PRJ-001", "Main Carriageway Paving & Commercial Traffic Commissioning", "2027-03-31", "—", 15.0, "PLANNED", "Earthwork and drainage culverts in progress");

        addMilestone("MS-011", "PRJ-002", "Section 19 Final Award Sanction", "2025-05-30", "2025-05-20", 100.0, "COMPLETED", "SLAO award declared for 48 parcels");
        addMilestone("MS-012", "PRJ-002", "Forest Stage-II Clearance for Power Utility Corridor", "2025-12-15", "—", 55.0, "DELAYED", "14.8 Ha canal diversion recommendation pending with PCCF");
        addMilestone("MS-013", "PRJ-002", "Flyover Pier Foundation & Structure Handover", "2026-08-30", "—", 76.5, "IN_PROGRESS", "36 parcels mutated and under civil piling work");

        addMilestone("MS-021", "PRJ-005", "Section 23 Award Declaration & PFMS Account Credit", "2025-04-15", "2025-04-01", 100.0, "COMPLETED", "DBT compensation disbursement 82% disbursed");
        addMilestone("MS-022", "PRJ-005", "Service Road & Toll Plaza Land Demarcation", "2026-07-30", "—", 69.3, "IN_PROGRESS", "65 parcels possessed; commercial structures cleared");

        addMilestone("MS-031", "PRJ-011", "Section 19 Sanction & Boundary Wall Erection", "2025-09-30", "2025-09-25", 100.0, "COMPLETED", "Demarcation complete across Unnao-Lucknow link");
        addMilestone("MS-032", "PRJ-011", "Gram Sabha Grazing Land Compensation Escrow Settlement", "2026-04-30", "—", 62.7, "IN_PROGRESS", "Board of Revenue reference hearing scheduled");
    }

    private void addMilestone(String id, String prjId, String name, String planned, String actual, double prog, String stat, String rem) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", id);
        m.put("projectId", prjId);
        m.put("milestone", name);
        m.put("plannedDate", planned);
        m.put("actualDate", actual);
        m.put("progress", prog);
        m.put("status", stat);
        m.put("remarks", rem);
        milestonesStore.put(id, m);
    }

    private void initDefaultIssues() {
        addInitialIssue("ISSUE-PIA-001", "High-Tension Power Transmission Line Utility Shift Delay", "PRJ-001", "CASE-2026-DME-0102 / Khasra 102", "HIGH", "UPPTCL 400kV line tower foundation falls inside 60m ROW corridor between Ch. 14+200 to 14+500.", "IN_PROGRESS", "2026-08-14", "UP Power Transmission Corp (UPPTCL)");
        addInitialIssue("ISSUE-PIA-002", "Khasra 103 Commercial Orchard Valuation Re-assessment Pending", "PRJ-001", "CASE-2026-DME-0103 / Khasra 103", "MEDIUM", "Claimant submitted objection regarding fruit-bearing mango grove valuation calculation.", "UNDER_REVIEW", "2026-08-20", "SLAO Agra / Horticulture Dept");
        addInitialIssue("ISSUE-PIA-003", "Inter-Departmental Forest Stage-II Clearance Bottleneck", "PRJ-002", "CASE-2026-AWR-0201 / Reserved Forest 14.8 Ha", "CRITICAL", "Stage-II clearance pending for 14.8 hectares of reserved forest land diversion.", "OPEN", "2026-08-22", "Principal Chief Conservator of Forests (PCCF), UP");
        addInitialIssue("ISSUE-PIA-004", "Gram Sabha Grazing Land Title Dispute & Compensation Trust Sanction", "PRJ-011", "CASE-2026-LRR-0301 / Khasra 88", "MEDIUM", "Title determination between village panchayat community asset and recorded tenure holders.", "FORWARDED", "2026-08-24", "Board of Revenue, Uttar Pradesh");
    }

    private void addInitialIssue(String id, String issue, String prjId, String parcelCase, String priority, String desc, String stat, String dt, String assignedTo) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", id);
        m.put("issue", issue);
        m.put("projectId", prjId);
        m.put("parcelCase", parcelCase);
        m.put("priority", priority);
        m.put("description", desc);
        m.put("status", stat);
        m.put("date", dt);
        m.put("assignedTo", assignedTo);
        m.put("remarksHistory", new ArrayList<Map<String, Object>>());
        issuesStore.put(id, m);
    }

    private void initDefaultDocuments() {
        documentsStore.add(createDoc("DOC-PIA-001", "PRJ-001", "Detailed Project Report (DPR) & Alignment Feasibility Vol-I", "DPR", "PDF (18.4 MB)", "2024-02-10", "NHAI Planning Cell", "https://example.com/dpr-nh348.pdf"));
        documentsStore.add(createDoc("DOC-PIA-002", "PRJ-001", "Section 3A Gazette Notification & Boundary Cadastre Map", "Gazette", "PDF (4.2 MB)", "2024-03-12", "MoRTH Land Division", "https://example.com/sec3a-nh348.pdf"));
        documentsStore.add(createDoc("DOC-PIA-003", "PRJ-001", "Section 19 Final Declaration & Sanctioned Acquisition Schedule", "Statutory Sanction", "PDF (8.6 MB)", "2025-02-25", "CALA District Magistrate Agra", "https://example.com/sec19-nh348.pdf"));
        documentsStore.add(createDoc("DOC-PIA-004", "PRJ-001", "UPPTCL High-Tension Transmission Line Shifting Estimate & Drawing", "Utility NOC", "PDF (12.1 MB)", "2025-11-20", "UPPTCL Transmission Division", "https://example.com/upptcl-drawing.pdf"));
        documentsStore.add(createDoc("DOC-PIA-005", "PRJ-002", "Agra Western Ring Road Phase-2 Environment & Forest Clearance Application", "Forest Clearance", "PDF (15.8 MB)", "2025-06-14", "NHAI & UP PWD Cell", "https://example.com/forest-awrr.pdf"));
        documentsStore.add(createDoc("DOC-PIA-006", "PRJ-005", "NH-19 6-Lane Expansion Section 23 Compensation Award Schedule", "Award Schedule", "PDF (6.7 MB)", "2025-04-18", "CALA Kanpur Nagar", "https://example.com/nh19-award.pdf"));
    }

    private Map<String, Object> createDoc(String id, String prjId, String title, String type, String size, String dt, String author, String url) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", id);
        m.put("projectId", prjId);
        m.put("title", title);
        m.put("type", type);
        m.put("size", size);
        m.put("date", dt);
        m.put("uploadedBy", author);
        m.put("downloadUrl", url);
        return m;
    }

    // Helper to get list of project IDs assigned to the PIA
    private Set<String> getAssignedProjectIds(String userEmail, String agencyName) {
        Set<String> set = new LinkedHashSet<>();
        // Standard NHAI PIA (e.g. agency@bhoomisetu.gov.in / executive@demo.gov.in) is assigned the 4 NHAI corridors
        set.add("PRJ-001");
        set.add("PRJ-002");
        set.add("PRJ-005");
        set.add("PRJ-011");
        return set;
    }

    public Map<String, Object> getAgencyDashboard(String userEmail, String agencyName) {
        List<Map<String, Object>> assignedProjects = getAssignedProjects(userEmail, agencyName);

        int totalAssigned = assignedProjects.size();
        int active = (int) assignedProjects.stream().filter(p -> "ACTIVE".equalsIgnoreCase((String) p.get("status"))).count();
        double overallProg = Math.round(assignedProjects.stream().mapToDouble(p -> (double) p.get("progress")).average().orElse(68.4) * 10.0) / 10.0;
        double acqProg = 71.2;
        double compRnRProg = 77.8;
        int pendingIssues = (int) issuesStore.values().stream().filter(i -> assignedProjects.stream().anyMatch(p -> p.get("projectId").equals(i.get("projectId"))) && !"RESOLVED".equals(i.get("status"))).count();
        int delayedActivities = (int) milestonesStore.values().stream().filter(m -> assignedProjects.stream().anyMatch(p -> p.get("projectId").equals(m.get("projectId"))) && "DELAYED".equals(m.get("status"))).count();

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("officerName", "Sh. Rajesh Verma");
        res.put("designation", "Chief Project Director & Head of Implementation");
        res.put("agency", "National Highways Authority of India (NHAI)");
        res.put("totalAssignedProjects", totalAssigned);
        res.put("activeProjects", active);
        res.put("overallProgress", overallProg);
        res.put("landAcquisitionProgress", acqProg);
        res.put("compensationRnRProgress", compRnRProg);
        res.put("pendingIssues", pendingIssues);
        res.put("delayedActivities", delayedActivities);
        res.put("assignedProjects", assignedProjects);
        return res;
    }

    public List<Map<String, Object>> getAssignedProjects(String userEmail, String agencyName) {
        Set<String> assignedIds = getAssignedProjectIds(userEmail, agencyName);
        List<Map<String, Object>> list = new ArrayList<>();

        list.add(createProjectEntry("PRJ-001", "Delhi–Meerut Expressway Expansion (NH-348)", "Agra", "Ministry of Road Transport & Highways", 65.2, "ACTIVE", "2024-01-15", "2027-03-31", 124, 1450.0, 945.5, "Section 19 Sanctioned", 840.0));
        list.add(createProjectEntry("PRJ-002", "Agra Western Ring Road Phase-2", "Agra", "Public Works Department, UP", 76.5, "ACTIVE", "2024-06-01", "2026-12-31", 48, 320.0, 245.0, "Physical Possession Handover", 320.0));
        list.add(createProjectEntry("PRJ-005", "National Highway-19 6-Lane Expansion", "Kanpur Nagar", "Ministry of Road Transport & Highways", 69.3, "ACTIVE", "2024-03-10", "2026-10-31", 96, 880.0, 610.0, "Section 23 Award Declared", 560.0));
        list.add(createProjectEntry("PRJ-011", "Lucknow Ring Road Phase-3 Infrastructure Belt", "Lucknow", "Ministry of Road Transport & Highways", 62.7, "ACTIVE", "2024-09-01", "2027-06-30", 82, 510.0, 320.0, "Section 19 Sanctioned", 620.0));

        return list.stream().filter(p -> assignedIds.contains((String) p.get("projectId"))).collect(Collectors.toList());
    }

    private Map<String, Object> createProjectEntry(String id, String name, String dist, String dept, double prog, String stat, String start, String end, int parcels, double totAcre, double acqAcre, String stage, double costCr) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("projectId", id);
        m.put("name", name);
        m.put("district", dist);
        m.put("department", dept);
        m.put("progress", prog);
        m.put("status", stat);
        m.put("startDate", start);
        m.put("expectedCompletion", end);
        m.put("affectedParcels", parcels);
        m.put("totalLandAcre", totAcre);
        m.put("acquiredLandAcre", acqAcre);
        m.put("currentStage", stage);
        m.put("estimatedCostCr", costCr);
        return m;
    }

    public List<Map<String, Object>> getProjectMilestones(String projectId, String userEmail, String agencyName) {
        Set<String> assignedIds = getAssignedProjectIds(userEmail, agencyName);
        List<Map<String, Object>> list = new ArrayList<>();
        for (Map<String, Object> m : milestonesStore.values()) {
            String pId = (String) m.get("projectId");
            if (assignedIds.contains(pId)) {
                if (projectId == null || projectId.equalsIgnoreCase("ALL") || projectId.equalsIgnoreCase(pId)) {
                    list.add(m);
                }
            }
        }
        list.sort((a, b) -> ((String) a.get("id")).compareTo((String) b.get("id")));
        return list;
    }

    public Map<String, Object> updateMilestoneProgress(String milestoneId, Map<String, Object> payload, String userEmail) {
        Map<String, Object> m = milestonesStore.get(milestoneId);
        Map<String, Object> res = new LinkedHashMap<>();
        if (m == null) {
            res.put("success", false);
            res.put("message", "Milestone not found: " + milestoneId);
            return res;
        }

        if (payload.containsKey("progress")) {
            m.put("progress", payload.get("progress"));
        }
        if (payload.containsKey("status")) {
            m.put("status", payload.get("status"));
        }
        if (payload.containsKey("actualDate")) {
            m.put("actualDate", payload.get("actualDate"));
        }
        if (payload.containsKey("remarks")) {
            m.put("remarks", payload.get("remarks"));
        }

        res.put("success", true);
        res.put("message", "Milestone updated successfully.");
        res.put("milestone", m);
        return res;
    }

    public Map<String, Object> updateProjectProgress(String projectId, Map<String, Object> payload, String userEmail) {
        Map<String, Object> res = new LinkedHashMap<>();
        double newProgress = Double.parseDouble(payload.getOrDefault("progress", "65.0").toString());
        String remarks = (String) payload.getOrDefault("remarks", "Progress updated by PIA.");

        List<Map<String, Object>> remarksList = projectRemarksStore.computeIfAbsent(projectId, k -> new ArrayList<>());
        Map<String, Object> entry = new LinkedHashMap<>();
        entry.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        entry.put("author", userEmail != null ? userEmail : "agency@bhoomisetu.gov.in");
        entry.put("progress", newProgress);
        entry.put("remarks", remarks);
        remarksList.add(entry);

        res.put("success", true);
        res.put("message", "Project progress updated to " + newProgress + "%");
        res.put("projectId", projectId);
        res.put("progress", newProgress);
        return res;
    }

    public Map<String, Object> addProjectRemark(String projectId, Map<String, Object> payload, String userEmail) {
        Map<String, Object> res = new LinkedHashMap<>();
        String remark = (String) payload.getOrDefault("remark", "Implementation note recorded.");

        List<Map<String, Object>> remarksList = projectRemarksStore.computeIfAbsent(projectId, k -> new ArrayList<>());
        Map<String, Object> entry = new LinkedHashMap<>();
        entry.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        entry.put("author", userEmail != null ? userEmail : "agency@bhoomisetu.gov.in");
        entry.put("remark", remark);
        remarksList.add(entry);

        res.put("success", true);
        res.put("message", "Remark recorded on project " + projectId);
        return res;
    }

    public Map<String, Object> getAgencyMapData(String projectId, String userEmail, String agencyName) {
        Set<String> assignedIds = getAssignedProjectIds(userEmail, agencyName);
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("center", Arrays.asList(27.1767, 78.0081));
        data.put("zoom", 11);
        data.put("isReadOnly", true); // PIA cannot edit authoritative cadastral boundaries

        List<Map<String, Object>> corridors = new ArrayList<>();
        corridors.add(createCorridor("PRJ-001", "Delhi–Meerut Expressway Expansion (NH-348)", "Agra, Meerut, Ghaziabad", "Uttar Pradesh", "#8b5cf6",
                Arrays.asList(
                        Arrays.asList(27.1650, 78.0650), Arrays.asList(27.5000, 77.8000),
                        Arrays.asList(28.2000, 77.6000), Arrays.asList(28.6500, 77.5000), Arrays.asList(28.9800, 77.7000)
                ),
                Arrays.asList(Arrays.asList(27.1600, 78.0550), Arrays.asList(27.1720, 78.0780), Arrays.asList(28.9900, 77.7100), Arrays.asList(28.9700, 77.6900)),
                Arrays.asList(27.1650, 78.0650), 12
        ));
        corridors.add(createCorridor("PRJ-002", "Agra Western Ring Road Phase-2", "Agra", "Uttar Pradesh", "#2563eb",
                Arrays.asList(Arrays.asList(27.1500, 77.9500), Arrays.asList(27.1800, 77.9800), Arrays.asList(27.2200, 78.0100)),
                Arrays.asList(Arrays.asList(27.1480, 77.9480), Arrays.asList(27.2220, 78.0120), Arrays.asList(27.2180, 78.0150), Arrays.asList(27.1450, 77.9520)),
                Arrays.asList(27.1800, 77.9800), 12
        ));
        corridors.add(createCorridor("PRJ-005", "National Highway-19 6-Lane Expansion", "Agra, Mathura, Kanpur", "Uttar Pradesh", "#06b6d4",
                Arrays.asList(Arrays.asList(27.4924, 77.6737), Arrays.asList(27.1767, 78.0081), Arrays.asList(26.8500, 79.2000), Arrays.asList(26.4499, 80.3319)),
                Arrays.asList(Arrays.asList(27.5000, 77.6800), Arrays.asList(27.1800, 78.0100), Arrays.asList(26.4600, 80.3400), Arrays.asList(26.4400, 80.3200)),
                Arrays.asList(26.8500, 79.2000), 10
        ));
        corridors.add(createCorridor("PRJ-011", "Lucknow Ring Road Phase-3", "Lucknow, Unnao", "Uttar Pradesh", "#10b981",
                Arrays.asList(Arrays.asList(26.8467, 80.9462), Arrays.asList(26.8800, 80.9900), Arrays.asList(26.9200, 81.0200)),
                Arrays.asList(Arrays.asList(26.8400, 80.9400), Arrays.asList(26.9250, 81.0250), Arrays.asList(26.9150, 81.0300), Arrays.asList(26.8350, 80.9450)),
                Arrays.asList(26.8800, 80.9800), 11
        ));

        data.put("projects", corridors.stream().filter(c -> assignedIds.contains((String) c.get("projectId"))).collect(Collectors.toList()));

        // Include synchronized parcels
        List<Map<String, Object>> parcels = new ArrayList<>();
        parcels.add(createParcelMap("PARCEL-101", "101", "KH-842", "CASE-2026-DME-0101", "PRJ-001", "Sh. Ram Kumar", "Nagla", "Fatehabad", "Agra", "Uttar Pradesh", 2.5, 0.8, "ACQUIRED", 45000000.0, false,
                Arrays.asList(Arrays.asList(27.1645, 78.0635), Arrays.asList(27.1658, 78.0638), Arrays.asList(27.1655, 78.0652), Arrays.asList(27.1642, 78.0648))));
        parcels.add(createParcelMap("PARCEL-102", "102", "KH-843", "CASE-2026-DME-0102", "PRJ-001", "Sh. Shyam Lal & Brothers", "Nagla", "Fatehabad", "Agra", "Uttar Pradesh", 3.1, 1.2, "DISPUTED", 54000000.0, false,
                Arrays.asList(Arrays.asList(27.1658, 78.0638), Arrays.asList(27.1672, 78.0642), Arrays.asList(27.1668, 78.0658), Arrays.asList(27.1655, 78.0652))));
        parcels.add(createParcelMap("PARCEL-103", "103", "KH-844", "CASE-2026-DME-0103", "PRJ-001", "Smt. Sunita Devi", "Nagla", "Fatehabad", "Agra", "Uttar Pradesh", 1.8, 0.6, "IN_PROGRESS", 28000000.0, false,
                Arrays.asList(Arrays.asList(27.1642, 78.0648), Arrays.asList(27.1655, 78.0652), Arrays.asList(27.1650, 78.0665), Arrays.asList(27.1638, 78.0660))));
        parcels.add(createParcelMap("PARCEL-104", "104", "KH-845", "CASE-2026-DME-0104", "PRJ-001", "Sh. Mahendra Singh", "Nagla", "Fatehabad", "Agra", "Uttar Pradesh", 4.2, 1.5, "ACQUIRED", 68000000.0, false,
                Arrays.asList(Arrays.asList(27.1655, 78.0652), Arrays.asList(27.1668, 78.0658), Arrays.asList(27.1662, 78.0672), Arrays.asList(27.1650, 78.0665))));

        // Context buffer parcels
        parcels.add(createParcelMap("PARCEL-CTX-01", "98-A", "KH-790", "N/A", "PRJ-001", "Gram Sabha / Surrounding Field", "Nagla", "Fatehabad", "Agra", "Uttar Pradesh", 5.0, 0.0, "CONTEXTUAL", 0.0, true,
                Arrays.asList(Arrays.asList(27.1630, 78.0620), Arrays.asList(27.1645, 78.0635), Arrays.asList(27.1642, 78.0648), Arrays.asList(27.1625, 78.0630))));
        parcels.add(createParcelMap("PARCEL-CTX-02", "110-B", "KH-899", "N/A", "PRJ-001", "Sh. Vinod Tyagi (Buffer Land)", "Nagla", "Fatehabad", "Agra", "Uttar Pradesh", 4.8, 0.0, "CONTEXTUAL", 0.0, true,
                Arrays.asList(Arrays.asList(27.1668, 78.0658), Arrays.asList(27.1685, 78.0665), Arrays.asList(27.1680, 78.0680), Arrays.asList(27.1662, 78.0672))));

        data.put("parcels", parcels);
        return data;
    }

    public List<Map<String, Object>> getAgencyAcquisition(String userEmail, String agencyName) {
        Set<String> assignedIds = getAssignedProjectIds(userEmail, agencyName);
        List<Map<String, Object>> list = new ArrayList<>();
        list.add(createAcqItem("PRJ-001", "Delhi–Meerut Expressway Expansion", "Agra", 124, 98, 12, 84, 14, 67.7));
        list.add(createAcqItem("PRJ-002", "Agra Western Ring Road Phase-2", "Agra", 48, 42, 6, 36, 4, 75.0));
        list.add(createAcqItem("PRJ-005", "National Highway-19 6-Lane Expansion", "Kanpur Nagar", 96, 74, 22, 65, 9, 67.7));
        list.add(createAcqItem("PRJ-011", "Lucknow Ring Road Phase-3", "Lucknow", 82, 60, 22, 51, 9, 62.2));

        return list.stream().filter(a -> assignedIds.contains((String) a.get("projectId"))).collect(Collectors.toList());
    }

    private Map<String, Object> createAcqItem(String id, String name, String dist, int tot, int ver, int pend, int acq, int disp, double prog) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("projectId", id);
        m.put("projectName", name);
        m.put("district", dist);
        m.put("totalParcels", tot);
        m.put("verified", ver);
        m.put("pending", pend);
        m.put("acquired", acq);
        m.put("disputed", disp);
        m.put("progress", prog);
        return m;
    }

    public List<Map<String, Object>> getAgencyCompensationRnR(String userEmail, String agencyName) {
        Set<String> assignedIds = getAssignedProjectIds(userEmail, agencyName);
        List<Map<String, Object>> list = new ArrayList<>();
        list.add(createCompRnRItem("PRJ-001", "Delhi–Meerut Expressway Expansion", "Agra", 124, 110, 84.5, 22.5, 450, 410, 380, 70));
        list.add(createCompRnRItem("PRJ-002", "Agra Western Ring Road Phase-2", "Agra", 48, 45, 38.2, 8.4, 180, 165, 150, 30));
        list.add(createCompRnRItem("PRJ-005", "National Highway-19 6-Lane Expansion", "Kanpur Nagar", 96, 82, 64.0, 18.0, 380, 330, 310, 70));
        list.add(createCompRnRItem("PRJ-011", "Lucknow Ring Road Phase-3", "Lucknow", 82, 70, 56.4, 18.2, 310, 270, 240, 70));

        return list.stream().filter(c -> assignedIds.contains((String) c.get("projectId"))).collect(Collectors.toList());
    }

    private Map<String, Object> createCompRnRItem(String id, String name, String dist, int el, int ap, double paid, double pend, int rrel, int rrap, int rrcomp, int rrpend) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("projectId", id);
        m.put("projectName", name);
        m.put("district", dist);
        m.put("eligible", el);
        m.put("approved", ap);
        m.put("completedPaid", paid);
        m.put("pending", pend);
        m.put("rrEligible", rrel);
        m.put("rrApproved", rrap);
        m.put("rrCompleted", rrcomp);
        m.put("rrPending", rrpend);
        return m;
    }

    public List<Map<String, Object>> getAgencyIssues(String status, String userEmail, String agencyName) {
        Set<String> assignedIds = getAssignedProjectIds(userEmail, agencyName);
        List<Map<String, Object>> list = new ArrayList<>();
        for (Map<String, Object> i : issuesStore.values()) {
            String pId = (String) i.get("projectId");
            if (assignedIds.contains(pId)) {
                if (status == null || status.equalsIgnoreCase("ALL") || status.equalsIgnoreCase((String) i.get("status"))) {
                    list.add(i);
                }
            }
        }
        list.sort((a, b) -> ((String) b.get("date")).compareTo((String) a.get("date")));
        return list;
    }

    public Map<String, Object> reportAgencyIssue(Map<String, Object> payload, String userEmail) {
        String id = "ISSUE-PIA-" + System.currentTimeMillis() % 10000;
        String issue = (String) payload.getOrDefault("issue", "Project Roadblock");
        String prjId = (String) payload.getOrDefault("projectId", "PRJ-001");
        String parcelCase = (String) payload.getOrDefault("parcelCase", "Corridor Alignment Ch. 12+000");
        String priority = (String) payload.getOrDefault("priority", "HIGH");
        String desc = (String) payload.getOrDefault("description", "Implementation issue reported by PIA.");
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));

        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", id);
        m.put("issue", issue);
        m.put("projectId", prjId);
        m.put("parcelCase", parcelCase);
        m.put("priority", priority);
        m.put("description", desc);
        m.put("status", "OPEN");
        m.put("date", date);
        m.put("assignedTo", "District Authority & CALA");
        m.put("remarksHistory", new ArrayList<Map<String, Object>>());

        issuesStore.put(id, m);

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Issue reported successfully: " + id);
        res.put("issue", m);
        return res;
    }

    public Map<String, Object> addAgencyIssueRemark(String issueId, Map<String, Object> payload, String userEmail) {
        Map<String, Object> issue = issuesStore.get(issueId);
        Map<String, Object> res = new LinkedHashMap<>();
        if (issue == null) {
            res.put("success", false);
            res.put("message", "Issue not found: " + issueId);
            return res;
        }

        String remark = (String) payload.getOrDefault("remark", "PIA site observation recorded.");
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> history = (List<Map<String, Object>>) issue.get("remarksHistory");
        if (history == null) {
            history = new ArrayList<>();
            issue.put("remarksHistory", history);
        }

        Map<String, Object> entry = new LinkedHashMap<>();
        entry.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        entry.put("author", userEmail != null ? userEmail : "agency@bhoomisetu.gov.in");
        entry.put("remark", remark);
        history.add(entry);

        res.put("success", true);
        res.put("message", "Remark added to issue.");
        res.put("issue", issue);
        return res;
    }

    public Map<String, Object> forwardAgencyIssue(String issueId, Map<String, Object> payload, String userEmail) {
        Map<String, Object> issue = issuesStore.get(issueId);
        Map<String, Object> res = new LinkedHashMap<>();
        if (issue == null) {
            res.put("success", false);
            res.put("message", "Issue not found: " + issueId);
            return res;
        }

        String targetAuthority = (String) payload.getOrDefault("authority", "Office of the District Magistrate (CALA)");
        String directive = (String) payload.getOrDefault("directive", "Forwarded for statutory resolution.");

        issue.put("assignedTo", targetAuthority);
        issue.put("status", "FORWARDED");

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> history = (List<Map<String, Object>>) issue.get("remarksHistory");
        if (history == null) {
            history = new ArrayList<>();
            issue.put("remarksHistory", history);
        }

        Map<String, Object> entry = new LinkedHashMap<>();
        entry.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        entry.put("author", userEmail != null ? userEmail : "agency@bhoomisetu.gov.in");
        entry.put("remark", "Forwarded to: " + targetAuthority + " | Directive: " + directive);
        history.add(entry);

        res.put("success", true);
        res.put("message", "Issue forwarded to " + targetAuthority);
        res.put("issue", issue);
        return res;
    }

    public List<Map<String, Object>> getAgencyDocuments(String projectId, String userEmail, String agencyName) {
        Set<String> assignedIds = getAssignedProjectIds(userEmail, agencyName);
        List<Map<String, Object>> list = new ArrayList<>();
        for (Map<String, Object> doc : documentsStore) {
            String pId = (String) doc.get("projectId");
            if (assignedIds.contains(pId)) {
                if (projectId == null || projectId.equalsIgnoreCase("ALL") || projectId.equalsIgnoreCase(pId)) {
                    list.add(doc);
                }
            }
        }
        return list;
    }

    public Map<String, Object> uploadAgencyDocument(Map<String, Object> payload, String userEmail) {
        String id = "DOC-PIA-" + System.currentTimeMillis() % 10000;
        String title = (String) payload.getOrDefault("title", "Project Implementation Document");
        String prjId = (String) payload.getOrDefault("projectId", "PRJ-001");
        String type = (String) payload.getOrDefault("type", "Technical Report");
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));

        Map<String, Object> doc = createDoc(id, prjId, title, type, "PDF (4.5 MB)", date, userEmail != null ? userEmail : "agency@bhoomisetu.gov.in", "https://example.com/" + id + ".pdf");
        documentsStore.add(doc);

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Document uploaded successfully: " + title);
        res.put("document", doc);
        return res;
    }

    public Map<String, Object> getAgencyReports(String userEmail, String agencyName) {
        Map<String, Object> res = new LinkedHashMap<>();
        res.put("generatedAt", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        res.put("projectProgress", getAssignedProjects(userEmail, agencyName));
        res.put("acquisitionProgress", getAgencyAcquisition(userEmail, agencyName));
        res.put("compensationRnR", getAgencyCompensationRnR(userEmail, agencyName));
        res.put("pendingIssues", getAgencyIssues("ALL", userEmail, agencyName));
        return res;
    }

    private Map<String, Object> createCorridor(String id, String name, String dists, String st, String color, List<List<Double>> coords, List<List<Double>> bound, List<Double> center, int zoom) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("projectId", id);
        m.put("name", name);
        m.put("districts", dists);
        m.put("state", st);
        m.put("color", color);
        m.put("coords", coords);
        m.put("boundary", bound);
        m.put("center", center);
        m.put("zoom", zoom);
        return m;
    }

    private Map<String, Object> createParcelMap(String id, String khasra, String khata, String caseId, String prjId, String owner, String vill, String teh, String dist, String st, double area, double affArea, String stat, double comp, boolean isCtx, List<List<Double>> coords) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", id);
        m.put("khasraNumber", khasra);
        m.put("khataNumber", khata);
        m.put("caseId", caseId);
        m.put("projectId", prjId);
        m.put("ownerName", owner);
        m.put("village", vill);
        m.put("tehsil", teh);
        m.put("district", dist);
        m.put("state", st);
        m.put("areaAcre", area);
        m.put("affectedAreaAcre", affArea);
        m.put("status", stat);
        m.put("totalCompensation", comp);
        m.put("isContextual", isCtx);
        m.put("coords", coords);
        return m;
    }
}
