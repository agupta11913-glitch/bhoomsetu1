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

@Service
public class StateService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private LandParcelRepository landParcelRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    // In-memory state escalations store with live mutation capabilities
    private final List<Map<String, Object>> stateEscalationsStore = Collections.synchronizedList(new ArrayList<>());
    private final Map<String, List<Map<String, Object>>> escalationRemarksStore = new ConcurrentHashMap<>();

    public StateService() {
        initDefaultEscalations();
    }

    private void initDefaultEscalations() {
        Map<String, Object> e1 = new LinkedHashMap<>();
        e1.put("id", "ESC-UP-001");
        e1.put("issue", "High Court Interim Stay on Feeder Node Corridor Section 19 Declaration");
        e1.put("project", "Ganga Expressway Feeder Node & Logistics Spur");
        e1.put("projectId", "PRJ-012");
        e1.put("district", "Prayagraj");
        e1.put("priority", "CRITICAL");
        e1.put("status", "UNDER_REVIEW");
        e1.put("date", "2026-08-15");
        e1.put("raisedBy", "District Magistrate Prayagraj");
        e1.put("currentAuthority", "State Infrastructure Committee & High Court Cell");
        e1.put("reason", "Interim stay granted by Hon'ble High Court over multi-crop fertile land acquisition challenge.");
        e1.put("actionRequired", "File special leave counter-affidavit with revised environmental buffer zone.");
        stateEscalationsStore.add(e1);

        Map<String, Object> e2 = new LinkedHashMap<>();
        e2.put("id", "ESC-UP-002");
        e2.put("issue", "Inter-Departmental Forest Stage-II Clearance Bottleneck for Power Utility Shifting");
        e2.put("project", "Agra Western Ring Road Phase-2");
        e2.put("projectId", "PRJ-002");
        e2.put("district", "Agra");
        e2.put("priority", "HIGH");
        e2.put("status", "NEW");
        e2.put("date", "2026-08-20");
        e2.put("raisedBy", "Competent Authority (CALA) Agra");
        e2.put("currentAuthority", "Principal Chief Conservator of Forests (PCCF), UP");
        e2.put("reason", "Stage-II clearance pending for 14.8 hectares of reserved forest land diversion.");
        e2.put("actionRequired", "Expedite state forest advisory council recommendation to MoEFCC.");
        stateEscalationsStore.add(e2);

        Map<String, Object> e3 = new LinkedHashMap<>();
        e3.put("id", "ESC-UP-003");
        e3.put("issue", "Gram Sabha Grazing Land Title Dispute & Compensation Trust Sanction");
        e3.put("project", "Lucknow Ring Road Phase-3");
        e3.put("projectId", "PRJ-011");
        e3.put("district", "Lucknow");
        e3.put("priority", "MEDIUM");
        e3.put("status", "FORWARDED");
        e3.put("date", "2026-08-24");
        e3.put("raisedBy", "Special Land Acquisition Officer, Lucknow");
        e3.put("currentAuthority", "Board of Revenue, Uttar Pradesh");
        e3.put("reason", "Title determination between village panchayat community asset and recorded tenure holders.");
        e3.put("actionRequired", "Issue special directive for Section 64 court deposit.");
        stateEscalationsStore.add(e3);
    }

    public Map<String, Object> getStateDashboard(String state) {
        String targetState = (state != null && !state.trim().isEmpty()) ? state : "Uttar Pradesh";
        List<Project> allProjects = projectRepository.findAll();

        List<Project> stateProjects = allProjects.stream()
                .filter(p -> p.getState() != null && p.getState().toLowerCase().contains(targetState.toLowerCase()))
                .toList();

        int totalProjects = Math.max(stateProjects.size(), 8);
        int totalDistricts = 75; // All 75 districts of UP
        int coveredDistricts = 28;

        double totalLandRequiredAcre = 4850.0;
        double totalLandAcquiredAcre = 3280.5;
        double totalCompensationCr = 840.0;
        double disbursedCompensationCr = 612.4;
        double totalRnRFamilies = 4120;
        double resettledFamilies = 3450;
        int activeDisputes = 42;
        int delayedProjects = 2;

        if (!stateProjects.isEmpty()) {
            double reqSum = stateProjects.stream().mapToDouble(p -> p.getTotalLandRequired() != null ? p.getTotalLandRequired() : 0.0).sum();
            double acqSum = stateProjects.stream().mapToDouble(p -> p.getLandAcquired() != null ? p.getLandAcquired() : 0.0).sum();
            double compAssessed = stateProjects.stream().mapToDouble(p -> p.getCompensationAssessed() != null ? p.getCompensationAssessed() : 0.0).sum() / 10000000.0;
            double compPaid = stateProjects.stream().mapToDouble(p -> p.getCompensationPaid() != null ? p.getCompensationPaid() : 0.0).sum() / 10000000.0;

            if (reqSum > 0) totalLandRequiredAcre = reqSum;
            if (acqSum > 0) totalLandAcquiredAcre = acqSum;
            if (compAssessed > 0) totalCompensationCr = compAssessed;
            if (compPaid > 0) disbursedCompensationCr = compPaid;
        }

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("state", targetState);
        res.put("officerName", "Sh. Sanjeev Khare, IAS");
        res.put("designation", "Principal Secretary, Revenue & Infrastructure Oversight");
        res.put("department", "Department of Revenue & Land Reforms, Govt. of Uttar Pradesh");
        res.put("totalDistricts", totalDistricts);
        res.put("coveredDistricts", coveredDistricts);
        res.put("totalProjects", totalProjects);
        res.put("activeProjects", totalProjects - 1);
        res.put("totalLandRequiredAcre", totalLandRequiredAcre);
        res.put("totalLandAcquiredAcre", totalLandAcquiredAcre);
        res.put("acquisitionProgress", Math.round((totalLandAcquiredAcre / totalLandRequiredAcre) * 1000.0) / 10.0);
        res.put("totalCompensationCr", totalCompensationCr);
        res.put("disbursedCompensationCr", disbursedCompensationCr);
        res.put("compensationProgress", Math.round((disbursedCompensationCr / totalCompensationCr) * 1000.0) / 10.0);
        res.put("rrProgress", 83.7);
        res.put("totalRnRFamilies", totalRnRFamilies);
        res.put("resettledFamilies", resettledFamilies);
        res.put("pendingDisputes", activeDisputes);
        res.put("delayedProjects", delayedProjects);
        return res;
    }

    public List<Map<String, Object>> getStateDistricts(String state) {
        String targetState = (state != null && !state.trim().isEmpty()) ? state : "Uttar Pradesh";
        List<Map<String, Object>> list = new ArrayList<>();

        list.add(createDistrictMap("Agra", targetState, 5, Arrays.asList("PRJ-001", "PRJ-002", "PRJ-003", "PRJ-005", "PRJ-006"), 420.5, 298.0, 70.9, 184.6, 136.95, 81.0, 1, 3, "ON_TRACK", "Dr. Sunita Murthy, IAS"));
        list.add(createDistrictMap("Meerut", targetState, 4, Arrays.asList("PRJ-001", "PRJ-004", "PRJ-007", "PRJ-008"), 380.0, 260.5, 68.6, 142.0, 105.0, 78.4, 0, 5, "ON_TRACK", "Sh. Deepak Meena, IAS"));
        list.add(createDistrictMap("Lucknow", targetState, 6, Arrays.asList("PRJ-011", "PRJ-014", "PRJ-015", "PRJ-016", "PRJ-017", "PRJ-018"), 510.0, 390.0, 76.5, 210.0, 175.5, 86.2, 0, 8, "ON_TRACK", "Smt. Surya Pal Gangwar, IAS"));
        list.add(createDistrictMap("Varanasi", targetState, 3, Arrays.asList("PRJ-021", "PRJ-022", "PRJ-023"), 290.0, 215.0, 74.1, 115.0, 92.0, 84.0, 0, 4, "ON_TRACK", "Sh. S. Rajalingam, IAS"));
        list.add(createDistrictMap("Prayagraj", targetState, 4, Arrays.asList("PRJ-012", "PRJ-024", "PRJ-025", "PRJ-026"), 340.0, 205.0, 60.3, 130.0, 84.0, 69.5, 1, 12, "WATCHLIST", "Sh. Sanjay Kumar Khatri, IAS"));
        list.add(createDistrictMap("Jhansi", targetState, 2, Arrays.asList("PRJ-013", "PRJ-027"), 210.0, 185.0, 88.1, 75.0, 68.0, 91.5, 0, 1, "ON_TRACK", "Sh. Ravindra Kumar, IAS"));
        list.add(createDistrictMap("Gorakhpur", targetState, 3, Arrays.asList("PRJ-028", "PRJ-029", "PRJ-030"), 260.0, 180.0, 69.2, 98.0, 74.0, 76.0, 0, 3, "ON_TRACK", "Sh. Krishna Karunesh, IAS"));
        list.add(createDistrictMap("Kanpur Nagar", targetState, 4, Arrays.asList("PRJ-005", "PRJ-031", "PRJ-032", "PRJ-033"), 320.0, 210.0, 65.6, 128.0, 90.0, 72.8, 1, 6, "DELAYED", "Sh. Vishak G. Iyer, IAS"));
        list.add(createDistrictMap("Gautam Buddha Nagar", targetState, 5, Arrays.asList("PRJ-003", "PRJ-006", "PRJ-034", "PRJ-035", "PRJ-036"), 490.0, 410.0, 83.7, 240.0, 208.0, 89.0, 0, 2, "ON_TRACK", "Sh. Manish Kumar Verma, IAS"));

        return list;
    }

    private Map<String, Object> createDistrictMap(String dist, String st, int prjCount, List<String> prjList, double req, double acq, double prog, double compTot, double compPaid, double rrProg, int delayed, int disputes, String status, String collector) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("district", dist);
        m.put("state", st);
        m.put("projectsCount", prjCount);
        m.put("projects", prjList);
        m.put("totalLandRequiredAcre", req);
        m.put("totalLandAcquiredAcre", acq);
        m.put("acquisitionProgress", prog);
        m.put("compensationTotalCr", compTot);
        m.put("compensationPaidCr", compPaid);
        m.put("compensationProgress", Math.round((compPaid / compTot) * 1000.0) / 10.0);
        m.put("rrProgress", rrProg);
        m.put("delayedCases", delayed);
        m.put("activeDisputes", disputes);
        m.put("status", status);
        m.put("collectorName", collector);
        return m;
    }

    public List<Map<String, Object>> getStateProjects(String state, String district) {
        String targetState = (state != null && !state.trim().isEmpty()) ? state : "Uttar Pradesh";
        List<Project> allProjects = projectRepository.findAll();
        List<Map<String, Object>> list = new ArrayList<>();

        for (Project p : allProjects) {
            boolean matchState = p.getState() == null || p.getState().toLowerCase().contains(targetState.toLowerCase());
            boolean matchDistrict = district == null || district.equalsIgnoreCase("ALL") || (p.getDistricts() != null && p.getDistricts().toLowerCase().contains(district.toLowerCase()));

            if (matchState && matchDistrict) {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("projectId", p.getProjectId() != null ? p.getProjectId() : "PRJ-" + p.getId());
                m.put("name", p.getName());
                m.put("agency", p.getRequiringAgency() != null ? p.getRequiringAgency() : "NHAI");
                m.put("department", p.getAuthority() != null ? p.getAuthority() : "Ministry of Road Transport & Highways");
                m.put("state", p.getState() != null ? p.getState() : targetState);
                m.put("district", p.getDistricts() != null ? p.getDistricts().split(",")[0].trim() : "Agra");
                m.put("districts", p.getDistricts() != null ? p.getDistricts() : "Agra, Meerut");
                m.put("totalLandAcre", p.getTotalLandRequired() != null ? p.getTotalLandRequired() : 450.0);
                m.put("acquiredLandAcre", p.getLandAcquired() != null ? p.getLandAcquired() : 310.0);
                m.put("progress", p.getPossessionPercentage() != null ? p.getPossessionPercentage() : 68.0);
                m.put("status", p.getStatus() != null ? p.getStatus() : "ACTIVE");
                m.put("timelineStatus", p.getTimelineStatus() != null ? p.getTimelineStatus() : "On-Track");
                m.put("currentStage", p.getCurrentStage() != null ? p.getCurrentStage() : "Section 19 Sanctioned");
                m.put("affectedParcels", p.getAffectedFamilies() != null ? (p.getAffectedFamilies() / 3) : 48);
                m.put("estimatedCostCr", (p.getEstimatedCost() != null ? p.getEstimatedCost() : 4500000000.0) / 10000000.0);
                m.put("affectedFamilies", p.getAffectedFamilies() != null ? p.getAffectedFamilies() : 320);
                list.add(m);
            }
        }

        Set<String> presentIds = new HashSet<>();
        for (Map<String, Object> item : list) {
            presentIds.add((String) item.get("projectId"));
        }

        List<Map<String, Object>> defaults = new ArrayList<>();
        defaults.add(createProjectSummary("PRJ-001", "Delhi–Meerut Expressway Expansion (NH-348)", "Agra", "NHAI", "MoRTH", targetState, "Agra, Meerut, Ghaziabad", 1450.0, 945.5, 65.2, "ACTIVE", "On-Track", 124));
        defaults.add(createProjectSummary("PRJ-002", "Agra Western Ring Road Phase-2", "Agra", "NHAI & UP PWD", "Public Works Department, UP", targetState, "Agra", 320.0, 245.0, 76.5, "ACTIVE", "On-Track", 48));
        defaults.add(createProjectSummary("PRJ-003", "Yamuna Expressway Interconnect Corridor", "Gautam Buddha Nagar", "YEIDA", "Infrastructure & Industrial Dev Dept", targetState, "Gautam Buddha Nagar, Agra", 480.0, 290.0, 60.4, "DELAYED", "Delayed", 64));
        defaults.add(createProjectSummary("PRJ-005", "National Highway-19 6-Lane Expansion", "Kanpur Nagar", "NHAI", "MoRTH", targetState, "Agra, Mathura, Kanpur Nagar", 880.0, 610.0, 69.3, "ACTIVE", "On-Track", 96));
        defaults.add(createProjectSummary("PRJ-006", "Agra & Delhi Metro Rail Phase 4 Expansion", "Agra", "UPMRC", "Housing & Urban Planning Dept", targetState, "Agra, Gautam Buddha Nagar", 220.0, 195.0, 88.6, "ACTIVE", "On-Track", 36));
        defaults.add(createProjectSummary("PRJ-011", "Lucknow Ring Road Phase-3 Infrastructure Belt", "Lucknow", "NHAI & UP PWD", "UP PWD", targetState, "Lucknow, Unnao", 510.0, 320.0, 62.7, "ACTIVE", "Watchlist", 82));
        defaults.add(createProjectSummary("PRJ-012", "Ganga Expressway Feeder Node & Logistics Spur", "Prayagraj", "UPEIDA", "Expressways Authority, UP", targetState, "Prayagraj, Rae Bareli", 640.0, 380.0, 59.4, "DELAYED", "Delayed", 110));
        defaults.add(createProjectSummary("PRJ-013", "Bundelkhand Mega Solar Renewable Park", "Jhansi", "UPNEDA", "Additional Sources of Energy Dept", targetState, "Jhansi, Lalitpur", 350.0, 310.0, 88.6, "ACTIVE", "On-Track", 42));

        for (Map<String, Object> def : defaults) {
            String defId = (String) def.get("projectId");
            if (!presentIds.contains(defId)) {
                boolean matchDist = district == null || district.equalsIgnoreCase("ALL") || 
                        (def.get("district") != null && ((String) def.get("district")).toLowerCase().contains(district.toLowerCase())) ||
                        (def.get("districts") != null && ((String) def.get("districts")).toLowerCase().contains(district.toLowerCase()));
                if (matchDist) {
                    list.add(def);
                    presentIds.add(defId);
                }
            }
        }

        return list;
    }

    private Map<String, Object> createProjectSummary(String id, String name, String dist, String agency, String dept, String st, String dists, double req, double acq, double prog, String stat, String timeStat, int parcels) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("projectId", id);
        m.put("name", name);
        m.put("district", dist);
        m.put("agency", agency);
        m.put("department", dept);
        m.put("state", st);
        m.put("districts", dists);
        m.put("totalLandAcre", req);
        m.put("acquiredLandAcre", acq);
        m.put("progress", prog);
        m.put("status", stat);
        m.put("timelineStatus", timeStat);
        m.put("affectedParcels", parcels);
        m.put("currentStage", "Section 19 Sanctioned");
        m.put("estimatedCostCr", 840.0);
        m.put("affectedFamilies", 450);
        return m;
    }

    public List<Map<String, Object>> getStateAcquisition(String state) {
        String targetState = (state != null && !state.trim().isEmpty()) ? state : "Uttar Pradesh";
        List<Map<String, Object>> list = new ArrayList<>();

        list.add(createAcqItem("PRJ-001", "Delhi–Meerut Expressway Expansion (NH-348)", "Agra", 124, 98, 12, 84, 67.7));
        list.add(createAcqItem("PRJ-002", "Agra Western Ring Road Phase-2", "Agra", 48, 42, 6, 36, 75.0));
        list.add(createAcqItem("PRJ-003", "Yamuna Expressway Interconnect Corridor", "Gautam Buddha Nagar", 64, 40, 24, 28, 43.8));
        list.add(createAcqItem("PRJ-005", "National Highway-19 6-Lane Expansion", "Kanpur Nagar", 96, 74, 22, 65, 67.7));
        list.add(createAcqItem("PRJ-006", "Agra & Delhi Metro Rail Phase 4 Expansion", "Agra", 36, 34, 2, 32, 88.9));
        list.add(createAcqItem("PRJ-011", "Lucknow Ring Road Phase-3", "Lucknow", 82, 60, 22, 51, 62.2));
        list.add(createAcqItem("PRJ-012", "Ganga Expressway Feeder Node", "Prayagraj", 110, 68, 42, 54, 49.1));
        list.add(createAcqItem("PRJ-013", "Bundelkhand Mega Solar Renewable Park", "Jhansi", 42, 40, 2, 38, 90.5));

        return list;
    }

    private Map<String, Object> createAcqItem(String id, String name, String dist, int total, int verified, int pending, int acquired, double prog) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("projectId", id);
        m.put("projectName", name);
        m.put("district", dist);
        m.put("totalParcels", total);
        m.put("verified", verified);
        m.put("pending", pending);
        m.put("acquired", acquired);
        m.put("progress", prog);
        return m;
    }

    public List<Map<String, Object>> getStateCompensationRnR(String state) {
        String targetState = (state != null && !state.trim().isEmpty()) ? state : "Uttar Pradesh";
        List<Map<String, Object>> list = new ArrayList<>();

        list.add(createCompRnRItem("PRJ-001", "Delhi–Meerut Expressway Expansion", "Agra", 124, 110, 84.5, 22.5, 450, 410, 380, 70));
        list.add(createCompRnRItem("PRJ-002", "Agra Western Ring Road Phase-2", "Agra", 48, 45, 38.2, 8.4, 180, 165, 150, 30));
        list.add(createCompRnRItem("PRJ-003", "Yamuna Expressway Interconnect", "Gautam Buddha Nagar", 64, 48, 42.0, 26.5, 240, 190, 160, 80));
        list.add(createCompRnRItem("PRJ-005", "National Highway-19 6-Lane Expansion", "Kanpur Nagar", 96, 82, 64.0, 18.0, 380, 330, 310, 70));
        list.add(createCompRnRItem("PRJ-006", "Agra & Delhi Metro Rail Phase 4", "Agra", 36, 35, 28.5, 3.2, 120, 120, 115, 5));
        list.add(createCompRnRItem("PRJ-011", "Lucknow Ring Road Phase-3", "Lucknow", 82, 70, 56.4, 18.2, 310, 270, 240, 70));
        list.add(createCompRnRItem("PRJ-012", "Ganga Expressway Feeder Node", "Prayagraj", 110, 80, 48.0, 32.0, 480, 390, 320, 160));
        list.add(createCompRnRItem("PRJ-013", "Bundelkhand Mega Solar Park", "Jhansi", 42, 40, 32.8, 4.2, 160, 155, 150, 10));

        return list;
    }

    private Map<String, Object> createCompRnRItem(String id, String name, String dist, int compEligible, int compApproved, double compPaidCr, double compPendingCr, int rrEligible, int rrApproved, int rrCompleted, int rrPending) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("projectId", id);
        m.put("projectName", name);
        m.put("district", dist);
        m.put("eligible", compEligible);
        m.put("approved", compApproved);
        m.put("completedPaid", compPaidCr);
        m.put("pending", compPendingCr);
        m.put("rrEligible", rrEligible);
        m.put("rrApproved", rrApproved);
        m.put("rrCompleted", rrCompleted);
        m.put("rrPending", rrPending);
        return m;
    }

    public List<Map<String, Object>> getStateDisputes(String state) {
        String targetState = (state != null && !state.trim().isEmpty()) ? state : "Uttar Pradesh";
        List<Map<String, Object>> list = new ArrayList<>();

        list.add(createDisputeSummary("DISP-UP-001", "Ganga Expressway Feeder Node", "PRJ-012", "Prayagraj", 18, 12, 6, "HIGH_COURT_STAY", "High Court Interim Stay on alignment demarcated through agricultural multi-crop belt.", "CRITICAL", "2026-09-12"));
        list.add(createDisputeSummary("DISP-UP-002", "Delhi–Meerut Expressway Expansion", "PRJ-001", "Agra", 8, 3, 5, "HEARING_ACTIVE", "Khasra 102 Peg Boundary demarcation valuation mismatch representation.", "MEDIUM", "2026-09-08"));
        list.add(createDisputeSummary("DISP-UP-003", "Lucknow Ring Road Phase-3", "PRJ-011", "Lucknow", 14, 8, 6, "UNDER_REVIEW", "Gram Sabha Common Grazing Land compensation allocation dispute among co-sharers.", "HIGH", "2026-09-18"));
        list.add(createDisputeSummary("DISP-UP-004", "National Highway-19 6-Lane Expansion", "PRJ-005", "Kanpur Nagar", 11, 6, 5, "HEARING_ACTIVE", "Commercial corridor circle rate multiplier calculation objection.", "HIGH", "2026-09-15"));
        list.add(createDisputeSummary("DISP-UP-005", "Yamuna Expressway Interconnect", "PRJ-003", "Gautam Buddha Nagar", 6, 2, 4, "SETTLEMENT_PENDING", "Tribal community parcel displacement R&R schedule determination.", "MEDIUM", "2026-09-22"));

        return list;
    }

    private Map<String, Object> createDisputeSummary(String id, String prjName, String prjId, String dist, int total, int pending, int resolved, String stat, String desc, String priority, String nextDate) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", id);
        m.put("project", prjName);
        m.put("projectId", prjId);
        m.put("district", dist);
        m.put("total", total);
        m.put("pending", pending);
        m.put("resolved", resolved);
        m.put("status", stat);
        m.put("description", desc);
        m.put("priority", priority);
        m.put("nextHearingDate", nextDate);
        return m;
    }

    public List<Map<String, Object>> getStateEscalations(String state, String status) {
        synchronized (stateEscalationsStore) {
            if (status == null || status.equalsIgnoreCase("ALL") || status.trim().isEmpty()) {
                return new ArrayList<>(stateEscalationsStore);
            }
            return stateEscalationsStore.stream()
                    .filter(e -> status.equalsIgnoreCase(String.valueOf(e.get("status"))))
                    .toList();
        }
    }

    public Map<String, Object> addEscalationRemark(String escId, Map<String, Object> payload, String officerEmail) {
        String remark = String.valueOf(payload.getOrDefault("remark", "State secretariat legal cell observation."));
        Map<String, Object> entry = new LinkedHashMap<>();
        entry.put("id", "REM-" + System.currentTimeMillis());
        entry.put("remark", remark);
        entry.put("author", officerEmail != null ? officerEmail : "Principal Secretary, Revenue");
        entry.put("timestamp", LocalDateTime.now().format(DATE_FORMATTER));

        escalationRemarksStore.computeIfAbsent(escId, k -> new ArrayList<>()).add(entry);

        synchronized (stateEscalationsStore) {
            for (Map<String, Object> e : stateEscalationsStore) {
                if (escId.equalsIgnoreCase(String.valueOf(e.get("id")))) {
                    e.put("lastRemark", remark);
                    e.put("lastUpdated", LocalDateTime.now().format(DATE_FORMATTER));
                    break;
                }
            }
        }

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Remark recorded on State Escalation Ledger.");
        res.put("entry", entry);
        return res;
    }

    public Map<String, Object> forwardEscalation(String escId, Map<String, Object> payload, String officerEmail) {
        String targetDept = String.valueOf(payload.getOrDefault("department", "State Revenue Board"));
        String remarks = String.valueOf(payload.getOrDefault("remarks", "Forwarded by State Government Secretariat."));

        synchronized (stateEscalationsStore) {
            for (Map<String, Object> e : stateEscalationsStore) {
                if (escId.equalsIgnoreCase(String.valueOf(e.get("id")))) {
                    e.put("currentAuthority", targetDept);
                    e.put("status", "FORWARDED");
                    e.put("forwardedTo", targetDept);
                    e.put("forwardRemarks", remarks);
                    e.put("lastUpdated", LocalDateTime.now().format(DATE_FORMATTER));
                    break;
                }
            }
        }

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "State escalation forwarded to " + targetDept);
        return res;
    }

    public Map<String, Object> escalateToChiefSecretary(String escId, Map<String, Object> payload, String officerEmail) {
        String remarks = String.valueOf(payload.getOrDefault("remarks", "Escalated for Apex Cabinet / Chief Secretary review."));

        synchronized (stateEscalationsStore) {
            for (Map<String, Object> e : stateEscalationsStore) {
                if (escId.equalsIgnoreCase(String.valueOf(e.get("id")))) {
                    e.put("currentAuthority", "Chief Secretary High-Level Infrastructure Committee (Apex)");
                    e.put("status", "ESCALATED_APEX");
                    e.put("priority", "CRITICAL");
                    e.put("stateEscalationNote", remarks);
                    e.put("lastUpdated", LocalDateTime.now().format(DATE_FORMATTER));
                    break;
                }
            }
        }

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Escalated to Chief Secretary High-Level Committee.");
        return res;
    }

    public Map<String, Object> updateEscalationStatus(String escId, Map<String, Object> payload, String officerEmail) {
        String status = String.valueOf(payload.getOrDefault("status", "UNDER_REVIEW"));
        String remarks = String.valueOf(payload.getOrDefault("remarks", "State status update."));

        synchronized (stateEscalationsStore) {
            for (Map<String, Object> e : stateEscalationsStore) {
                if (escId.equalsIgnoreCase(String.valueOf(e.get("id")))) {
                    e.put("status", status);
                    e.put("statusRemarks", remarks);
                    e.put("lastUpdated", LocalDateTime.now().format(DATE_FORMATTER));
                    break;
                }
            }
        }

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("status", status);
        res.put("message", "State escalation status updated to " + status);
        return res;
    }

    public Map<String, Object> getStateReports(String state) {
        String targetState = (state != null && !state.trim().isEmpty()) ? state : "Uttar Pradesh";
        Map<String, Object> reports = new LinkedHashMap<>();
        reports.put("state", targetState);
        reports.put("districtProgress", getStateDistricts(targetState));
        reports.put("projectProgress", getStateProjects(targetState, "ALL"));
        reports.put("acquisitionSummary", getStateAcquisition(targetState));
        reports.put("compensationRnRSummary", getStateCompensationRnR(targetState));
        reports.put("generatedAt", LocalDateTime.now().format(DATE_FORMATTER));
        return reports;
    }

    public Map<String, Object> getStateMapData(String state, String district) {
        String targetState = (state != null && !state.trim().isEmpty()) ? state : "Uttar Pradesh";
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("state", targetState);
        data.put("selectedDistrict", district != null ? district : "ALL");

        // State Center (Lucknow / Central UP)
        data.put("center", Arrays.asList(26.8467, 80.9462));
        data.put("zoom", 7);

        // Corridors across UP
        List<Map<String, Object>> corridors = new ArrayList<>();

        // 1. DME & Agra Expressway (Agra-Meerut-Ghaziabad)
        corridors.add(createCorridor("PRJ-001", "Delhi–Meerut Expressway Expansion (NH-348)", "Agra, Meerut, Ghaziabad", targetState, "#8b5cf6",
                Arrays.asList(
                        Arrays.asList(27.1650, 78.0650),
                        Arrays.asList(27.5000, 77.8000),
                        Arrays.asList(28.2000, 77.6000),
                        Arrays.asList(28.6500, 77.5000),
                        Arrays.asList(28.9800, 77.7000)
                ),
                Arrays.asList(
                        Arrays.asList(27.1600, 78.0550), Arrays.asList(27.1720, 78.0780),
                        Arrays.asList(28.9900, 77.7100), Arrays.asList(28.9700, 77.6900)
                ),
                Arrays.asList(27.1650, 78.0650), 12
        ));

        // 2. NH-19 6-Lane Golden Corridor (Agra-Mathura-Kanpur)
        corridors.add(createCorridor("PRJ-005", "National Highway-19 6-Lane Expansion", "Agra, Mathura, Kanpur Nagar", targetState, "#06b6d4",
                Arrays.asList(
                        Arrays.asList(27.4924, 77.6737),
                        Arrays.asList(27.1767, 78.0081),
                        Arrays.asList(26.8500, 79.2000),
                        Arrays.asList(26.4499, 80.3319)
                ),
                Arrays.asList(
                        Arrays.asList(27.5000, 77.6800), Arrays.asList(27.1800, 78.0100),
                        Arrays.asList(26.4600, 80.3400), Arrays.asList(26.4400, 80.3200)
                ),
                Arrays.asList(26.8500, 79.2000), 10
        ));

        // 3. Lucknow Ring Road Phase-3
        corridors.add(createCorridor("PRJ-011", "Lucknow Ring Road Phase-3 Infrastructure Belt", "Lucknow, Unnao", targetState, "#ec4899",
                Arrays.asList(
                        Arrays.asList(26.8000, 80.8500),
                        Arrays.asList(26.9000, 80.9200),
                        Arrays.asList(26.9500, 81.0200),
                        Arrays.asList(26.8200, 81.0500)
                ),
                Arrays.asList(
                        Arrays.asList(26.7900, 80.8400), Arrays.asList(26.9600, 81.0300),
                        Arrays.asList(26.8100, 81.0600), Arrays.asList(26.7800, 80.8600)
                ),
                Arrays.asList(26.8800, 80.9500), 12
        ));

        // 4. Ganga Expressway Feeder
        corridors.add(createCorridor("PRJ-012", "Ganga Expressway Feeder Node", "Prayagraj, Rae Bareli", targetState, "#f59e0b",
                Arrays.asList(
                        Arrays.asList(25.4358, 81.8463),
                        Arrays.asList(25.8500, 81.5000),
                        Arrays.asList(26.2200, 81.2500)
                ),
                Arrays.asList(
                        Arrays.asList(25.4300, 81.8400), Arrays.asList(26.2300, 81.2600),
                        Arrays.asList(26.2100, 81.2400), Arrays.asList(25.4400, 81.8500)
                ),
                Arrays.asList(25.8500, 81.5000), 10
        ));

        // 5. Bundelkhand Solar Park
        corridors.add(createCorridor("PRJ-013", "Bundelkhand Mega Solar Renewable Park", "Jhansi, Lalitpur", targetState, "#10b981",
                Arrays.asList(
                        Arrays.asList(25.4484, 78.5685),
                        Arrays.asList(25.1000, 78.6000),
                        Arrays.asList(24.6900, 78.4100)
                ),
                Arrays.asList(
                        Arrays.asList(25.4600, 78.5800), Arrays.asList(24.7000, 78.4200),
                        Arrays.asList(24.6800, 78.4000), Arrays.asList(25.4300, 78.5500)
                ),
                Arrays.asList(25.1000, 78.6000), 10
        ));

        data.put("projects", corridors);

        // Include synchronized parcels
        List<Map<String, Object>> parcels = new ArrayList<>();
        parcels.add(createParcelMap("PARCEL-101", "101", "KH-842", "CASE-2026-DME-0101", "PRJ-001", "Sh. Ram Kumar", "Nagla", "Fatehabad", "Agra", targetState, 2.5, 0.8, "ACQUIRED", 45000000.0, false,
                Arrays.asList(Arrays.asList(27.1645, 78.0635), Arrays.asList(27.1658, 78.0638), Arrays.asList(27.1655, 78.0652), Arrays.asList(27.1642, 78.0648))));
        parcels.add(createParcelMap("PARCEL-102", "102", "KH-843", "CASE-2026-DME-0102", "PRJ-001", "Sh. Shyam Lal & Brothers", "Nagla", "Fatehabad", "Agra", targetState, 3.1, 1.2, "DISPUTED", 54000000.0, false,
                Arrays.asList(Arrays.asList(27.1658, 78.0638), Arrays.asList(27.1672, 78.0642), Arrays.asList(27.1668, 78.0658), Arrays.asList(27.1655, 78.0652))));
        parcels.add(createParcelMap("PARCEL-103", "103", "KH-844", "CASE-2026-DME-0103", "PRJ-001", "Smt. Sunita Devi", "Nagla", "Fatehabad", "Agra", targetState, 1.8, 0.6, "IN_PROGRESS", 28000000.0, false,
                Arrays.asList(Arrays.asList(27.1642, 78.0648), Arrays.asList(27.1655, 78.0652), Arrays.asList(27.1650, 78.0665), Arrays.asList(27.1638, 78.0660))));
        parcels.add(createParcelMap("PARCEL-104", "104", "KH-845", "CASE-2026-DME-0104", "PRJ-001", "Sh. Mahendra Singh", "Nagla", "Fatehabad", "Agra", targetState, 4.2, 1.5, "ACQUIRED", 68000000.0, false,
                Arrays.asList(Arrays.asList(27.1655, 78.0652), Arrays.asList(27.1668, 78.0658), Arrays.asList(27.1662, 78.0672), Arrays.asList(27.1650, 78.0665))));

        // Surrounding context buffer cadastre (not affected)
        parcels.add(createParcelMap("PARCEL-CTX-01", "98-A", "KH-790", "N/A", "PRJ-001", "Gram Sabha / Surrounding Field", "Nagla", "Fatehabad", "Agra", targetState, 5.0, 0.0, "CONTEXTUAL", 0.0, true,
                Arrays.asList(Arrays.asList(27.1630, 78.0620), Arrays.asList(27.1645, 78.0635), Arrays.asList(27.1642, 78.0648), Arrays.asList(27.1625, 78.0630))));
        parcels.add(createParcelMap("PARCEL-CTX-02", "110-B", "KH-899", "N/A", "PRJ-001", "Sh. Vinod Tyagi (Buffer Land)", "Nagla", "Fatehabad", "Agra", targetState, 4.8, 0.0, "CONTEXTUAL", 0.0, true,
                Arrays.asList(Arrays.asList(27.1668, 78.0658), Arrays.asList(27.1685, 78.0665), Arrays.asList(27.1680, 78.0680), Arrays.asList(27.1662, 78.0672))));

        data.put("parcels", parcels);
        return data;
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
