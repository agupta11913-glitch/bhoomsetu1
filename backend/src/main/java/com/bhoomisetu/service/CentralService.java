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
public class CentralService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private LandParcelRepository landParcelRepository;

    // In-memory persistent escalations ledger for central interventions
    private final Map<String, Map<String, Object>> escalationsStore = new ConcurrentHashMap<>();

    public CentralService() {
        initDefaultEscalations();
    }

    private void initDefaultEscalations() {
        addInitialEscalation("ESC-NAT-001", "Stage-II Forest Clearance & Wildlife Sanctuary Buffer Diversion", "Madhya Pradesh", "Panna", "PRJ-007", "Ken-Betwa River Interlinking Canal Project", "CRITICAL", "UNDER_REVIEW", "2026-08-18", "PCCF Madhya Pradesh", "MoEFCC Wildlife Board & PMO Infrastructure Cell", "Stage-II forest diversion for 4,200 hectares of buffer corridor required.", "Inter-ministerial meeting scheduled with MoEFCC Secretary.");
        addInitialEscalation("ESC-NAT-002", "Inter-State Right of Way Demarcation Dispute on Western DFC Border", "Haryana", "Rewari", "PRJ-002", "Dedicated Freight Corridor (Western DFC)", "HIGH", "NEW", "2026-08-21", "DFCCIL Chief Project Manager", "Ministry of Railways & Revenue Board Haryana", "Border peg survey alignment mismatch between Haryana and Rajasthan boundary.", "Joint survey directive issued under Chief Surveyors.");
        addInitialEscalation("ESC-NAT-003", "Coastal Regulation Zone (CRZ-I) Clearance Roadblock for DMIC Logistics Node", "Maharashtra", "Raigad", "PRJ-003", "Delhi-Mumbai Industrial Corridor (DMIC Hub)", "HIGH", "FORWARDED", "2026-08-23", "NICDC Special Projects Cell", "Maharashtra Coastal Zone Management Authority (MCZMA)", "Tidal wetland boundary notification requires apex environmental clearance.", "Forwarded to State Environment Department for urgent review.");
        addInitialEscalation("ESC-NAT-004", "High Court Interim Stay on Feeder Node Corridor Section 19 Declaration", "Uttar Pradesh", "Prayagraj", "PRJ-012", "Ganga Expressway Feeder Node & Logistics Spur", "CRITICAL", "UNDER_REVIEW", "2026-08-25", "UPEIDA Chief Executive", "State Infrastructure Committee & High Court Cell", "Multi-crop fertile land acquisition challenge by petitioner co-sharers.", "Counter-affidavit filed; special mention listing requested.");
        addInitialEscalation("ESC-NAT-005", "Railway Overbridge (ROB) Clearance Mismatch for EDFC-II Spur", "Bihar", "Rohtas", "PRJ-010", "Eastern Dedicated Freight Corridor Expansion", "MEDIUM", "NEW", "2026-08-26", "District Magistrate Rohtas", "Eastern Railway Headquarters", "Safety clearance pending for 132kV overhead high-tension line crossing.", "Coordinated inspection with Power Grid Corporation.");
    }

    private void addInitialEscalation(String id, String issue, String state, String district, String prjId, String prjName, String priority, String status, String date, String raisedBy, String authority, String reason, String actionRequired) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", id);
        m.put("issue", issue);
        m.put("state", state);
        m.put("district", district);
        m.put("projectId", prjId);
        m.put("project", prjName);
        m.put("priority", priority);
        m.put("status", status);
        m.put("date", date);
        m.put("raisedBy", raisedBy);
        m.put("currentAuthority", authority);
        m.put("reason", reason);
        m.put("actionRequired", actionRequired);
        m.put("remarksHistory", new ArrayList<Map<String, Object>>());
        escalationsStore.put(id, m);
    }

    public Map<String, Object> getCentralDashboard() {
        Map<String, Object> res = new LinkedHashMap<>();
        res.put("officerName", "Dr. Arvind Meena, IAS");
        res.put("designation", "Joint Secretary, PM Gati Shakti National Master Plan");
        res.put("ministry", "Cabinet Secretariat & Ministry of Road Transport and Highways (MoRTH)");
        res.put("totalStates", 28);
        res.put("activeStates", 18);
        res.put("totalProjects", 32);
        res.put("activeProjects", 30);
        res.put("overallAcquisitionProgress", 75.9);
        res.put("compensationRnRProgress", 81.4);
        res.put("pendingMajorDisputes", 14);
        res.put("delayedProjects", 4);
        res.put("pendingEscalations", (int) escalationsStore.values().stream().filter(e -> !"RESOLVED".equals(e.get("status"))).count());
        res.put("totalLandRequiredAcre", 48500.0);
        res.put("totalLandAcquiredAcre", 36800.0);
        res.put("totalBudgetCr", 148500.0);
        res.put("totalCompensationCr", 38400.0);
        res.put("disbursedCompensationCr", 31250.0);
        res.put("resettledFamilies", 21900);
        res.put("totalDisplacedFamilies", 24800);
        return res;
    }

    public List<Map<String, Object>> getCentralStates() {
        List<Map<String, Object>> list = new ArrayList<>();
        list.add(createStateHierarchy("Uttar Pradesh", "UP", 8, 7, 67.8, 78.4, 1, 3, "Sh. Sanjeev Khare, IAS",
                Arrays.asList(
                        createDistrictDrillDown("Agra", 4, 70.9, 136.95, 81.0, 1, Arrays.asList("PRJ-001", "PRJ-002", "PRJ-005", "PRJ-006")),
                        createDistrictDrillDown("Meerut", 3, 68.6, 105.0, 78.4, 0, Arrays.asList("PRJ-001", "PRJ-004")),
                        createDistrictDrillDown("Lucknow", 4, 76.5, 175.5, 86.2, 0, Arrays.asList("PRJ-011")),
                        createDistrictDrillDown("Prayagraj", 2, 60.3, 84.0, 69.5, 1, Arrays.asList("PRJ-012")),
                        createDistrictDrillDown("Jhansi", 2, 88.1, 68.0, 91.5, 0, Arrays.asList("PRJ-013"))
                )
        ));
        list.add(createStateHierarchy("Maharashtra", "MH", 6, 6, 73.1, 82.0, 0, 2, "Dr. Nitin Kareer, IAS",
                Arrays.asList(
                        createDistrictDrillDown("Pune", 3, 75.0, 240.0, 84.0, 0, Arrays.asList("PRJ-003")),
                        createDistrictDrillDown("Raigad", 2, 68.5, 180.0, 79.0, 0, Arrays.asList("PRJ-003")),
                        createDistrictDrillDown("Nashik", 2, 78.0, 140.0, 85.0, 0, Arrays.asList("PRJ-003"))
                )
        ));
        list.add(createStateHierarchy("Gujarat", "GJ", 5, 5, 93.6, 96.7, 0, 1, "Sh. Manoj Kumar Das, IAS",
                Arrays.asList(
                        createDistrictDrillDown("Surat", 2, 98.0, 310.0, 99.0, 0, Arrays.asList("PRJ-004", "PRJ-002")),
                        createDistrictDrillDown("Ahmedabad", 2, 95.0, 290.0, 97.0, 0, Arrays.asList("PRJ-004")),
                        createDistrictDrillDown("Vadodara", 2, 92.0, 180.0, 95.0, 0, Arrays.asList("PRJ-004"))
                )
        ));
        list.add(createStateHierarchy("Haryana", "HR", 4, 4, 80.0, 85.0, 0, 1, "Sh. Anurag Rastogi, IAS",
                Arrays.asList(
                        createDistrictDrillDown("Gurugram", 2, 84.0, 190.0, 88.0, 0, Arrays.asList("PRJ-002")),
                        createDistrictDrillDown("Rewari", 2, 76.0, 140.0, 82.0, 0, Arrays.asList("PRJ-002"))
                )
        ));
        list.add(createStateHierarchy("Madhya Pradesh", "MP", 5, 4, 69.0, 72.5, 1, 4, "Sh. Rajesh Rajora, IAS",
                Arrays.asList(
                        createDistrictDrillDown("Panna", 2, 52.0, 110.0, 60.0, 1, Arrays.asList("PRJ-007")),
                        createDistrictDrillDown("Chhatarpur", 2, 65.0, 130.0, 71.0, 0, Arrays.asList("PRJ-007")),
                        createDistrictDrillDown("Bhopal", 1, 85.0, 90.0, 88.0, 0, Arrays.asList("PRJ-007"))
                )
        ));
        list.add(createStateHierarchy("Rajasthan", "RJ", 4, 4, 83.7, 88.0, 0, 1, "Sh. Subodh Agarwal, IAS",
                Arrays.asList(
                        createDistrictDrillDown("Jodhpur", 2, 94.0, 210.0, 95.0, 0, Arrays.asList("PRJ-008")),
                        createDistrictDrillDown("Bikaner", 2, 91.0, 160.0, 92.0, 0, Arrays.asList("PRJ-008"))
                )
        ));
        list.add(createStateHierarchy("Karnataka", "KA", 3, 3, 76.5, 79.8, 0, 2, "Sh. Rajender Kumar Kataria, IAS",
                Arrays.asList(
                        createDistrictDrillDown("Kolar", 2, 78.0, 150.0, 81.0, 0, Arrays.asList("PRJ-009")),
                        createDistrictDrillDown("Bangalore Rural", 2, 75.0, 180.0, 78.0, 0, Arrays.asList("PRJ-009"))
                )
        ));
        list.add(createStateHierarchy("Bihar", "BR", 3, 2, 60.0, 62.0, 1, 5, "Sh. Brajesh Mehrotra, IAS",
                Arrays.asList(
                        createDistrictDrillDown("Rohtas", 2, 58.0, 90.0, 60.0, 1, Arrays.asList("PRJ-010")),
                        createDistrictDrillDown("Gaya", 2, 62.0, 110.0, 64.0, 0, Arrays.asList("PRJ-010"))
                )
        ));
        list.add(createStateHierarchy("Tamil Nadu", "TN", 4, 4, 83.8, 89.0, 0, 1, "Sh. Shiv Das Meena, IAS",
                Arrays.asList(
                        createDistrictDrillDown("Chennai", 2, 88.0, 220.0, 91.0, 0, Arrays.asList("PRJ-009")),
                        createDistrictDrillDown("Kanchipuram", 2, 81.0, 170.0, 86.0, 0, Arrays.asList("PRJ-009"))
                )
        ));
        list.add(createStateHierarchy("Andhra Pradesh", "AP", 3, 3, 75.8, 81.2, 0, 2, "Sh. K.S. Jawahar Reddy, IAS",
                Arrays.asList(
                        createDistrictDrillDown("Visakhapatnam", 2, 82.0, 190.0, 85.0, 0, Arrays.asList("PRJ-009")),
                        createDistrictDrillDown("Chittoor", 2, 71.0, 130.0, 77.0, 0, Arrays.asList("PRJ-009"))
                )
        ));
        return list;
    }

    private Map<String, Object> createStateHierarchy(String state, String code, int prjCount, int actCount, double acqProg, double compRnR, int delayed, int issues, String chiefSec, List<Map<String, Object>> districts) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("state", state);
        m.put("stateCode", code);
        m.put("totalProjects", prjCount);
        m.put("activeProjects", actCount);
        m.put("acquisitionProgress", acqProg);
        m.put("compensationRnR", compRnR);
        m.put("delayedProjects", delayed);
        m.put("pendingIssues", issues);
        m.put("principalSecretary", chiefSec);
        m.put("districts", districts);
        return m;
    }

    private Map<String, Object> createDistrictDrillDown(String dist, int prjs, double acq, double compPaid, double rr, int delayed, List<String> prjIds) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("district", dist);
        m.put("projectsCount", prjs);
        m.put("acquisitionProgress", acq);
        m.put("compensationPaidCr", compPaid);
        m.put("rrProgress", rr);
        m.put("delayedCases", delayed);
        m.put("projectIds", prjIds);
        return m;
    }

    public List<Map<String, Object>> getCentralProjects(String state, String district) {
        List<Project> allProjects = projectRepository.findAll();
        List<Map<String, Object>> list = new ArrayList<>();

        for (Project p : allProjects) {
            boolean matchState = state == null || state.equalsIgnoreCase("ALL") || (p.getState() != null && p.getState().toLowerCase().contains(state.toLowerCase()));
            boolean matchDistrict = district == null || district.equalsIgnoreCase("ALL") || (p.getDistricts() != null && p.getDistricts().toLowerCase().contains(district.toLowerCase()));

            if (matchState && matchDistrict) {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("projectId", p.getProjectId() != null ? p.getProjectId() : "PRJ-" + p.getId());
                m.put("name", p.getName());
                m.put("agency", p.getRequiringAgency() != null ? p.getRequiringAgency() : "NHAI");
                m.put("department", p.getAuthority() != null ? p.getAuthority() : "Ministry of Road Transport & Highways");
                m.put("ministry", p.getAuthority() != null ? p.getAuthority() : "MoRTH");
                m.put("state", p.getState() != null ? p.getState() : "Uttar Pradesh");
                m.put("district", p.getDistricts() != null ? p.getDistricts().split(",")[0].trim() : "Agra");
                m.put("districts", p.getDistricts() != null ? p.getDistricts() : "Agra, Meerut");
                m.put("totalLandAcre", p.getTotalLandRequired() != null ? p.getTotalLandRequired() : 1200.0);
                m.put("acquiredLandAcre", p.getLandAcquired() != null ? p.getLandAcquired() : 850.0);
                m.put("progress", p.getPossessionPercentage() != null ? p.getPossessionPercentage() : 70.8);
                m.put("status", p.getStatus() != null ? p.getStatus() : "ACTIVE");
                m.put("timelineStatus", p.getTimelineStatus() != null ? p.getTimelineStatus() : "On-Track");
                m.put("currentStage", p.getCurrentStage() != null ? p.getCurrentStage() : "Section 19 Sanctioned");
                m.put("affectedParcels", p.getAffectedFamilies() != null ? (p.getAffectedFamilies() / 3) : 124);
                m.put("estimatedCostCr", (p.getEstimatedCost() != null ? p.getEstimatedCost() : 8400000000.0) / 10000000.0);
                list.add(m);
            }
        }

        Set<String> presentIds = new HashSet<>();
        for (Map<String, Object> item : list) {
            presentIds.add((String) item.get("projectId"));
        }

        List<Map<String, Object>> defaults = new ArrayList<>();
        defaults.add(createMacroProject("PRJ-001", "Delhi–Meerut Expressway Expansion (NH-348)", "NHAI", "Ministry of Road Transport & Highways", "Uttar Pradesh", "Agra", "Agra, Meerut, Ghaziabad", 1450.0, 945.5, 65.2, "ACTIVE", "On-Track", 840.0, 124));
        defaults.add(createMacroProject("PRJ-002", "Dedicated Freight Corridor (Western DFC)", "DFCCIL", "Ministry of Railways", "Haryana", "Rewari", "Gurugram, Rewari, Surat", 2100.0, 1680.0, 80.0, "ACTIVE", "On-Track", 1450.0, 210));
        defaults.add(createMacroProject("PRJ-003", "Delhi-Mumbai Industrial Corridor (DMIC Hub)", "NICDC", "Ministry of Commerce & Industry", "Maharashtra", "Raigad", "Pune, Nashik, Raigad", 3400.0, 2150.0, 63.2, "ACTIVE", "On-Track", 2200.0, 180));
        defaults.add(createMacroProject("PRJ-004", "Mumbai–Ahmedabad High Speed Rail (MAHSR)", "NHSRCL", "Ministry of Railways", "Gujarat", "Surat", "Surat, Vadodara, Ahmedabad", 1396.0, 1380.0, 98.8, "ACTIVE", "On-Track", 10800.0, 320));
        defaults.add(createMacroProject("PRJ-005", "National Highway-19 6-Lane Expansion", "NHAI", "Ministry of Road Transport & Highways", "Uttar Pradesh", "Agra", "Agra, Mathura, Kanpur Nagar", 880.0, 610.0, 69.3, "ACTIVE", "On-Track", 560.0, 96));
        defaults.add(createMacroProject("PRJ-007", "Ken-Betwa River Interlinking Canal Project", "NWDA", "Ministry of Jal Shakti", "Madhya Pradesh", "Panna", "Panna, Chhatarpur, Banda", 9000.0, 4800.0, 53.3, "DELAYED", "Delayed", 4460.0, 450));
        defaults.add(createMacroProject("PRJ-008", "Bhadla Mega Solar Renewable Energy Park", "SECI", "Ministry of New & Renewable Energy", "Rajasthan", "Jodhpur", "Jodhpur, Bikaner, Phalodi", 5000.0, 4650.0, 93.0, "ACTIVE", "On-Track", 1200.0, 80));
        defaults.add(createMacroProject("PRJ-009", "Bangalore-Chennai Industrial Corridor (BCIC Node)", "NICDC", "Ministry of Commerce & Industry", "Karnataka", "Kolar", "Kolar, Bangalore Rural, Chennai", 2800.0, 1850.0, 66.1, "ACTIVE", "On-Track", 1850.0, 140));
        defaults.add(createMacroProject("PRJ-010", "Eastern Dedicated Freight Corridor Expansion (EDFC-II)", "DFCCIL", "Ministry of Railways", "Bihar", "Rohtas", "Rohtas, Gaya, Mughalsarai", 3100.0, 2450.0, 79.0, "ACTIVE", "On-Track", 2800.0, 260));
        defaults.add(createMacroProject("PRJ-011", "Lucknow Ring Road Phase-3 Infrastructure Belt", "NHAI & UP PWD", "Ministry of Road Transport & Highways", "Uttar Pradesh", "Lucknow", "Lucknow, Unnao", 510.0, 320.0, 62.7, "ACTIVE", "Watchlist", 620.0, 82));
        defaults.add(createMacroProject("PRJ-012", "Ganga Expressway Feeder Node & Logistics Spur", "UPEIDA", "Ministry of Road Transport & Highways", "Uttar Pradesh", "Prayagraj", "Prayagraj, Rae Bareli", 640.0, 380.0, 59.4, "DELAYED", "Delayed", 780.0, 110));
        defaults.add(createMacroProject("PRJ-013", "Bundelkhand Mega Solar Renewable Park", "UPNEDA", "Ministry of New & Renewable Energy", "Uttar Pradesh", "Jhansi", "Jhansi, Lalitpur", 350.0, 310.0, 88.6, "ACTIVE", "On-Track", 410.0, 42));

        for (Map<String, Object> def : defaults) {
            String defId = (String) def.get("projectId");
            if (!presentIds.contains(defId)) {
                boolean matchSt = state == null || state.equalsIgnoreCase("ALL") || 
                        (def.get("state") != null && ((String) def.get("state")).toLowerCase().contains(state.toLowerCase()));
                boolean matchDist = district == null || district.equalsIgnoreCase("ALL") || 
                        (def.get("district") != null && ((String) def.get("district")).toLowerCase().contains(district.toLowerCase())) ||
                        (def.get("districts") != null && ((String) def.get("districts")).toLowerCase().contains(district.toLowerCase()));
                if (matchSt && matchDist) {
                    list.add(def);
                    presentIds.add(defId);
                }
            }
        }

        return list;
    }

    private Map<String, Object> createMacroProject(String id, String name, String agency, String dept, String st, String dist, String dists, double req, double acq, double prog, String stat, String timeStat, double costCr, int parcels) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("projectId", id);
        m.put("name", name);
        m.put("agency", agency);
        m.put("department", dept);
        m.put("ministry", dept);
        m.put("state", st);
        m.put("district", dist);
        m.put("districts", dists);
        m.put("totalLandAcre", req);
        m.put("acquiredLandAcre", acq);
        m.put("progress", prog);
        m.put("status", stat);
        m.put("timelineStatus", timeStat);
        m.put("estimatedCostCr", costCr);
        m.put("affectedParcels", parcels);
        m.put("currentStage", "Section 19 Sanctioned");
        return m;
    }

    public Map<String, Object> getCentralMapData(String state, String district) {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("selectedState", state != null ? state : "ALL");
        data.put("selectedDistrict", district != null ? district : "ALL");

        // Pan-India Center
        data.put("center", Arrays.asList(22.9734, 78.6569));
        data.put("zoom", 5);

        List<Map<String, Object>> corridors = new ArrayList<>();

        // 1. Delhi-Meerut & Agra Expressway (UP)
        corridors.add(createCorridor("PRJ-001", "Delhi–Meerut Expressway Expansion (NH-348)", "Agra, Meerut, Ghaziabad", "Uttar Pradesh", "#8b5cf6",
                Arrays.asList(
                        Arrays.asList(27.1650, 78.0650), Arrays.asList(27.5000, 77.8000),
                        Arrays.asList(28.2000, 77.6000), Arrays.asList(28.6500, 77.5000), Arrays.asList(28.9800, 77.7000)
                ),
                Arrays.asList(Arrays.asList(27.1600, 78.0550), Arrays.asList(27.1720, 78.0780), Arrays.asList(28.9900, 77.7100), Arrays.asList(28.9700, 77.6900)),
                Arrays.asList(27.1650, 78.0650), 10
        ));

        // 2. Western DFC (Haryana - Rajasthan - Gujarat)
        corridors.add(createCorridor("PRJ-002", "Dedicated Freight Corridor (Western DFC)", "Gurugram, Rewari, Surat", "Haryana", "#2563eb",
                Arrays.asList(
                        Arrays.asList(28.4595, 77.0266), Arrays.asList(28.1800, 76.6200),
                        Arrays.asList(26.9124, 75.7873), Arrays.asList(23.0225, 72.5714), Arrays.asList(21.1702, 72.8311)
                ),
                Arrays.asList(Arrays.asList(28.4700, 77.0300), Arrays.asList(21.1800, 72.8400), Arrays.asList(21.1600, 72.8200), Arrays.asList(28.4400, 77.0100)),
                Arrays.asList(24.5000, 74.5000), 7
        ));

        // 3. DMIC Mega Industrial Node (Maharashtra)
        corridors.add(createCorridor("PRJ-003", "Delhi-Mumbai Industrial Corridor (DMIC Hub)", "Pune, Nashik, Raigad", "Maharashtra", "#ec4899",
                Arrays.asList(
                        Arrays.asList(19.9975, 73.7898), Arrays.asList(19.0760, 72.8777),
                        Arrays.asList(18.5204, 73.8567), Arrays.asList(18.2500, 73.4000)
                ),
                Arrays.asList(Arrays.asList(20.0100, 73.8000), Arrays.asList(18.2600, 73.4100), Arrays.asList(18.2400, 73.3900), Arrays.asList(19.9800, 73.7700)),
                Arrays.asList(18.9000, 73.5000), 8
        ));

        // 4. Bullet Train MAHSR (Gujarat - Maharashtra)
        corridors.add(createCorridor("PRJ-004", "Mumbai–Ahmedabad High Speed Rail Corridor (MAHSR)", "Surat, Vadodara, Ahmedabad", "Gujarat", "#10b981",
                Arrays.asList(
                        Arrays.asList(19.0760, 72.8777), Arrays.asList(21.1702, 72.8311),
                        Arrays.asList(22.3072, 73.1812), Arrays.asList(23.0225, 72.5714)
                ),
                Arrays.asList(Arrays.asList(19.0900, 72.8900), Arrays.asList(23.0400, 72.5900), Arrays.asList(23.0100, 72.5500), Arrays.asList(19.0600, 72.8600)),
                Arrays.asList(21.5000, 72.9000), 8
        ));

        // 5. NH-19 6-Lane Expansion (UP)
        corridors.add(createCorridor("PRJ-005", "National Highway-19 6-Lane Expansion", "Agra, Mathura, Kanpur", "Uttar Pradesh", "#06b6d4",
                Arrays.asList(
                        Arrays.asList(27.4924, 77.6737), Arrays.asList(27.1767, 78.0081),
                        Arrays.asList(26.8500, 79.2000), Arrays.asList(26.4499, 80.3319)
                ),
                Arrays.asList(Arrays.asList(27.5000, 77.6800), Arrays.asList(27.1800, 78.0100), Arrays.asList(26.4600, 80.3400), Arrays.asList(26.4400, 80.3200)),
                Arrays.asList(26.8500, 79.2000), 9
        ));

        // 6. Ken-Betwa River Interlinking (MP)
        corridors.add(createCorridor("PRJ-007", "Ken-Betwa River Interlinking Canal Project", "Panna, Chhatarpur, Banda", "Madhya Pradesh", "#f59e0b",
                Arrays.asList(
                        Arrays.asList(24.7200, 80.1800), Arrays.asList(25.0000, 80.0000),
                        Arrays.asList(25.3000, 80.2000), Arrays.asList(25.4800, 80.3400)
                ),
                Arrays.asList(Arrays.asList(24.7100, 80.1700), Arrays.asList(25.4900, 80.3500), Arrays.asList(25.4700, 80.3300), Arrays.asList(24.7300, 80.1900)),
                Arrays.asList(25.0000, 80.1000), 8
        ));

        // 7. Bhadla Solar Park (Rajasthan)
        corridors.add(createCorridor("PRJ-008", "Bhadla Mega Solar Renewable Energy Park", "Jodhpur, Bikaner, Phalodi", "Rajasthan", "#eab308",
                Arrays.asList(
                        Arrays.asList(27.5300, 71.9100), Arrays.asList(27.5500, 71.9500),
                        Arrays.asList(27.5200, 72.0000), Arrays.asList(27.4800, 71.9400)
                ),
                Arrays.asList(Arrays.asList(27.5400, 71.9000), Arrays.asList(27.5600, 71.9600), Arrays.asList(27.5100, 72.0100), Arrays.asList(27.4700, 71.9300)),
                Arrays.asList(27.5300, 71.9500), 10
        ));

        data.put("projects", corridors);

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

        // Surrounding context buffer cadastre (not affected)
        parcels.add(createParcelMap("PARCEL-CTX-01", "98-A", "KH-790", "N/A", "PRJ-001", "Gram Sabha / Surrounding Field", "Nagla", "Fatehabad", "Agra", "Uttar Pradesh", 5.0, 0.0, "CONTEXTUAL", 0.0, true,
                Arrays.asList(Arrays.asList(27.1630, 78.0620), Arrays.asList(27.1645, 78.0635), Arrays.asList(27.1642, 78.0648), Arrays.asList(27.1625, 78.0630))));
        parcels.add(createParcelMap("PARCEL-CTX-02", "110-B", "KH-899", "N/A", "PRJ-001", "Sh. Vinod Tyagi (Buffer Land)", "Nagla", "Fatehabad", "Agra", "Uttar Pradesh", 4.8, 0.0, "CONTEXTUAL", 0.0, true,
                Arrays.asList(Arrays.asList(27.1668, 78.0658), Arrays.asList(27.1685, 78.0665), Arrays.asList(27.1680, 78.0680), Arrays.asList(27.1662, 78.0672))));

        data.put("parcels", parcels);
        return data;
    }

    public List<Map<String, Object>> getCentralAcquisition() {
        List<Map<String, Object>> list = new ArrayList<>();
        list.add(createAcqEntry("Uttar Pradesh", "Agra", "PRJ-001", "Delhi–Meerut Expressway Expansion", 124, 98, 12, 84, 67.7));
        list.add(createAcqEntry("Haryana", "Rewari", "PRJ-002", "Dedicated Freight Corridor (Western DFC)", 210, 190, 20, 168, 80.0));
        list.add(createAcqEntry("Maharashtra", "Raigad", "PRJ-003", "Delhi-Mumbai Industrial Corridor (DMIC Hub)", 180, 140, 40, 114, 63.3));
        list.add(createAcqEntry("Gujarat", "Surat", "PRJ-004", "Mumbai–Ahmedabad High Speed Rail (MAHSR)", 320, 320, 0, 316, 98.8));
        list.add(createAcqEntry("Uttar Pradesh", "Kanpur Nagar", "PRJ-005", "National Highway-19 6-Lane Expansion", 96, 74, 22, 65, 67.7));
        list.add(createAcqEntry("Madhya Pradesh", "Panna", "PRJ-007", "Ken-Betwa River Interlinking Canal Project", 450, 260, 190, 240, 53.3));
        list.add(createAcqEntry("Rajasthan", "Jodhpur", "PRJ-008", "Bhadla Mega Solar Renewable Energy Park", 80, 78, 2, 75, 93.8));
        list.add(createAcqEntry("Karnataka", "Kolar", "PRJ-009", "Bangalore-Chennai Industrial Corridor (BCIC)", 140, 110, 30, 92, 65.7));
        list.add(createAcqEntry("Bihar", "Rohtas", "PRJ-010", "Eastern Dedicated Freight Corridor Expansion", 260, 210, 50, 205, 78.8));
        list.add(createAcqEntry("Uttar Pradesh", "Prayagraj", "PRJ-012", "Ganga Expressway Feeder Node", 110, 68, 42, 54, 49.1));
        return list;
    }

    private Map<String, Object> createAcqEntry(String st, String dist, String id, String name, int tot, int ver, int pend, int acq, double prog) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("state", st);
        m.put("district", dist);
        m.put("projectId", id);
        m.put("projectName", name);
        m.put("totalParcels", tot);
        m.put("verified", ver);
        m.put("pending", pend);
        m.put("acquired", acq);
        m.put("progress", prog);
        return m;
    }

    public List<Map<String, Object>> getCentralCompensationRnR() {
        List<Map<String, Object>> list = new ArrayList<>();
        list.add(createCompRnREntry("Uttar Pradesh", "Agra", "PRJ-001", "Delhi–Meerut Expressway Expansion", 124, 110, 84.5, 22.5, 450, 410, 380, 70));
        list.add(createCompRnREntry("Haryana", "Rewari", "PRJ-002", "Dedicated Freight Corridor (Western DFC)", 210, 195, 142.0, 18.0, 620, 590, 560, 60));
        list.add(createCompRnREntry("Maharashtra", "Raigad", "PRJ-003", "Delhi-Mumbai Industrial Corridor (DMIC Hub)", 180, 150, 210.0, 54.0, 540, 480, 420, 120));
        list.add(createCompRnREntry("Gujarat", "Surat", "PRJ-004", "Mumbai–Ahmedabad High Speed Rail (MAHSR)", 320, 320, 480.0, 12.0, 920, 920, 910, 10));
        list.add(createCompRnREntry("Uttar Pradesh", "Kanpur Nagar", "PRJ-005", "National Highway-19 6-Lane Expansion", 96, 82, 64.0, 18.0, 380, 330, 310, 70));
        list.add(createCompRnREntry("Madhya Pradesh", "Panna", "PRJ-007", "Ken-Betwa River Interlinking Canal Project", 450, 320, 180.0, 85.0, 1250, 980, 820, 430));
        list.add(createCompRnREntry("Rajasthan", "Jodhpur", "PRJ-008", "Bhadla Mega Solar Renewable Energy Park", 80, 78, 52.0, 4.0, 180, 175, 170, 10));
        list.add(createCompRnREntry("Karnataka", "Kolar", "PRJ-009", "Bangalore-Chennai Industrial Corridor (BCIC)", 140, 120, 98.0, 24.0, 390, 350, 320, 70));
        list.add(createCompRnREntry("Bihar", "Rohtas", "PRJ-010", "Eastern Dedicated Freight Corridor Expansion", 260, 210, 115.0, 42.0, 780, 650, 580, 200));
        list.add(createCompRnREntry("Uttar Pradesh", "Prayagraj", "PRJ-012", "Ganga Expressway Feeder Node", 110, 80, 48.0, 32.0, 480, 390, 320, 160));
        return list;
    }

    private Map<String, Object> createCompRnREntry(String st, String dist, String id, String name, int el, int ap, double paid, double pend, int rrel, int rrap, int rrcomp, int rrpend) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("state", st);
        m.put("district", dist);
        m.put("projectId", id);
        m.put("projectName", name);
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

    public List<Map<String, Object>> getCentralDisputes() {
        List<Map<String, Object>> disputes = new ArrayList<>();
        disputes.add(createDispute("DISP-NAT-001", "Madhya Pradesh", "Panna", "PRJ-007", "Ken-Betwa River Interlinking", "Stage-II Forest Advisory & Wildlife Board Clearance Delay", "CRITICAL", "HIGH_LEVEL_MEETING_SCHEDULED", "2026-09-10", "Cabinet Secretariat Review Bench"));
        disputes.add(createDispute("DISP-NAT-002", "Maharashtra", "Raigad", "PRJ-003", "DMIC Mega Industrial Node", "Coastal Regulation Zone (CRZ-I) Alignment Representation", "HIGH", "UNDER_REVIEW", "2026-09-14", "MCZMA State Board"));
        disputes.add(createDispute("DISP-NAT-003", "Bihar", "Rohtas", "PRJ-010", "EDFC-II Rail Corridor", "Section 20E Title Determination & Sub-Division Boundary Dispute", "MEDIUM", "QUASI_JUDICIAL_HEARING", "2026-09-16", "LARRA Tribunal Patna"));
        disputes.add(createDispute("DISP-NAT-004", "Uttar Pradesh", "Prayagraj", "PRJ-012", "Ganga Expressway Feeder Node", "High Court Interim Stay on Agricultural Multi-Crop ROW Alignment", "CRITICAL", "HEARING_SCHEDULED", "2026-09-12", "Allahabad High Court Division Bench"));
        disputes.add(createDispute("DISP-NAT-005", "Haryana", "Rewari", "PRJ-002", "Western Dedicated Freight Corridor", "Commercial Compensation Multiplier Factor Appeal (Section 64)", "HIGH", "HEARING_SCHEDULED", "2026-09-18", "Punjab & Haryana HC Bench"));
        return disputes;
    }

    private Map<String, Object> createDispute(String id, String state, String dist, String prjId, String prjName, String issue, String priority, String status, String nextDate, String bench) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", id);
        m.put("state", state);
        m.put("district", dist);
        m.put("projectId", prjId);
        m.put("project", prjName);
        m.put("projectName", prjName);
        m.put("issue", issue);
        m.put("priority", priority);
        m.put("status", status);
        m.put("nextHearingDate", nextDate);
        m.put("bench", bench);
        return m;
    }

    public List<Map<String, Object>> getCentralEscalations(String status) {
        List<Map<String, Object>> list = new ArrayList<>();
        for (Map<String, Object> esc : escalationsStore.values()) {
            if (status == null || status.equalsIgnoreCase("ALL") || status.equalsIgnoreCase((String) esc.get("status"))) {
                list.add(esc);
            }
        }
        list.sort((a, b) -> ((String) b.get("date")).compareTo((String) a.get("date")));
        return list;
    }

    public Map<String, Object> addEscalationRemark(String escId, Map<String, Object> payload, String userEmail) {
        Map<String, Object> esc = escalationsStore.get(escId);
        Map<String, Object> res = new LinkedHashMap<>();
        if (esc == null) {
            res.put("success", false);
            res.put("message", "Escalation not found: " + escId);
            return res;
        }

        String remark = (String) payload.getOrDefault("remark", "");
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> history = (List<Map<String, Object>>) esc.get("remarksHistory");
        if (history == null) {
            history = new ArrayList<>();
            esc.put("remarksHistory", history);
        }

        Map<String, Object> entry = new LinkedHashMap<>();
        entry.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        entry.put("author", userEmail != null ? userEmail : "central.officer@bhoomisetu.gov.in");
        entry.put("remark", remark);
        history.add(entry);

        res.put("success", true);
        res.put("message", "National observation remark recorded successfully.");
        res.put("escalation", esc);
        return res;
    }

    public Map<String, Object> forwardEscalation(String escId, Map<String, Object> payload, String userEmail) {
        Map<String, Object> esc = escalationsStore.get(escId);
        Map<String, Object> res = new LinkedHashMap<>();
        if (esc == null) {
            res.put("success", false);
            res.put("message", "Escalation not found: " + escId);
            return res;
        }

        String targetMinistry = (String) payload.getOrDefault("ministry", "PMO Infrastructure Committee");
        String directive = (String) payload.getOrDefault("directive", "Forwarded for apex inter-ministerial clearance.");

        esc.put("currentAuthority", targetMinistry);
        esc.put("status", "FORWARDED");

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> history = (List<Map<String, Object>>) esc.get("remarksHistory");
        if (history == null) {
            history = new ArrayList<>();
            esc.put("remarksHistory", history);
        }

        Map<String, Object> entry = new LinkedHashMap<>();
        entry.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        entry.put("author", userEmail != null ? userEmail : "central.officer@bhoomisetu.gov.in");
        entry.put("remark", "Forwarded to: " + targetMinistry + " | Directive: " + directive);
        history.add(entry);

        res.put("success", true);
        res.put("message", "Escalation forwarded to " + targetMinistry);
        res.put("escalation", esc);
        return res;
    }

    public Map<String, Object> updateEscalationStatus(String escId, Map<String, Object> payload, String userEmail) {
        Map<String, Object> esc = escalationsStore.get(escId);
        Map<String, Object> res = new LinkedHashMap<>();
        if (esc == null) {
            res.put("success", false);
            res.put("message", "Escalation not found: " + escId);
            return res;
        }

        String newStatus = (String) payload.getOrDefault("status", "RESOLVED");
        String remarks = (String) payload.getOrDefault("remarks", "Status updated at Central Secretariat.");

        esc.put("status", newStatus);

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> history = (List<Map<String, Object>>) esc.get("remarksHistory");
        if (history == null) {
            history = new ArrayList<>();
            esc.put("remarksHistory", history);
        }

        Map<String, Object> entry = new LinkedHashMap<>();
        entry.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        entry.put("author", userEmail != null ? userEmail : "central.officer@bhoomisetu.gov.in");
        entry.put("remark", "Status updated to " + newStatus + ": " + remarks);
        history.add(entry);

        res.put("success", true);
        res.put("message", "Escalation status updated to " + newStatus);
        res.put("escalation", esc);
        return res;
    }

    public Map<String, Object> getCentralReports() {
        Map<String, Object> res = new LinkedHashMap<>();
        res.put("generatedAt", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

        // 1. State-wise Progress
        res.put("stateProgress", getCentralStates());

        // 2. Project-wise Progress
        res.put("projectProgress", getCentralProjects("ALL", "ALL"));

        // 3. Acquisition Summary
        res.put("acquisitionSummary", getCentralAcquisition());

        // 4. Compensation / R&R Summary
        res.put("compensationRnRSummary", getCentralCompensationRnR());

        // 5. Delayed Projects
        List<Map<String, Object>> delayed = new ArrayList<>();
        for (Map<String, Object> p : getCentralProjects("ALL", "ALL")) {
            if ("DELAYED".equalsIgnoreCase((String) p.get("status")) || "Delayed".equalsIgnoreCase((String) p.get("timelineStatus"))) {
                delayed.add(p);
            }
        }
        res.put("delayedProjects", delayed);

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
