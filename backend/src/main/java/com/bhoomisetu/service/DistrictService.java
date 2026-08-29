package com.bhoomisetu.service;

import com.bhoomisetu.entity.*;
import com.bhoomisetu.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class DistrictService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final ProjectRepository projectRepository;
    private final LandParcelRepository landParcelRepository;
    private final ObjectionRepository objectionRepository;
    private final RehabilitationBenefitRepository rrBenefitRepository;
    private final NotificationRepository notificationRepository;
    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    // In-memory management stores for coordination, escalations & dynamic documents
    private final List<Map<String, Object>> coordinationStore = new ArrayList<>();
    private final List<Map<String, Object>> escalationsStore = new ArrayList<>();
    private final List<Map<String, Object>> documentsStore = new ArrayList<>();
    private final Map<String, List<Map<String, Object>>> parcelRemarksStore = new ConcurrentHashMap<>();
    private final Map<String, Map<String, Object>> delayedCaseOverrides = new ConcurrentHashMap<>();

    public DistrictService(
            ProjectRepository projectRepository,
            LandParcelRepository landParcelRepository,
            ObjectionRepository objectionRepository,
            RehabilitationBenefitRepository rrBenefitRepository,
            NotificationRepository notificationRepository,
            AuditLogRepository auditLogRepository,
            UserRepository userRepository
    ) {
        this.projectRepository = projectRepository;
        this.landParcelRepository = landParcelRepository;
        this.objectionRepository = objectionRepository;
        this.rrBenefitRepository = rrBenefitRepository;
        this.notificationRepository = notificationRepository;
        this.auditLogRepository = auditLogRepository;
        this.userRepository = userRepository;

        initDemoCoordinationAndEscalations();
    }

    private LandParcel findParcelByCaseOrKhasra(String caseId) {
        if (caseId == null || caseId.trim().isEmpty()) return null;
        String clean = caseId.trim();

        Optional<LandParcel> opt = landParcelRepository.findByCaseId(clean);
        if (opt.isPresent()) return opt.get();

        String khasra = clean.replaceAll("[^0-9]", "");
        if (!khasra.isEmpty()) {
            Optional<LandParcel> optK = landParcelRepository.findByKhasraNumber(khasra);
            if (optK.isPresent()) return optK.get();
        }

        List<LandParcel> all = landParcelRepository.findAll();
        for (LandParcel p : all) {
            if (clean.equalsIgnoreCase(p.getCaseId()) || clean.equalsIgnoreCase(p.getKhasraNumber()) || clean.equalsIgnoreCase(p.getKhataNumber())) {
                return p;
            }
        }
        return all.isEmpty() ? null : all.get(0);
    }

    private void initDemoCoordinationAndEscalations() {
        // Inter-departmental Coordination Requests
        Map<String, Object> coord1 = new LinkedHashMap<>();
        coord1.put("id", "COORD-001");
        coord1.put("department", "State Forest Department (UP)");
        coord1.put("project", "Delhi–Meerut Expressway Expansion (NH-348)");
        coord1.put("request", "Stage-II Forest Clearance for 4.2 Hectares in Fatehabad Reserve Forest Zone");
        coord1.put("officer", "Divisional Forest Officer (DFO Agra)");
        coord1.put("deadline", "2026-09-15");
        coord1.put("status", "IN_PROGRESS");
        coord1.put("priority", "HIGH");
        coord1.put("remarks", "Joint field inspection completed with CALA team; compensatory afforestation site identified at Kasan.");
        coordinationStore.add(coord1);

        Map<String, Object> coord2 = new LinkedHashMap<>();
        coord2.put("id", "COORD-002");
        coord2.put("department", "Dakshinanchal Vidyut Vitran Nigam (DVVNL)");
        coord2.put("project", "Agra Western Ring Road Phase-2");
        coord2.put("request", "Shifting of 33kV High-Tension Transmission Towers along Khasra 101-108 Alignment");
        coord2.put("officer", "Superintending Engineer (SE DVVNL Agra)");
        coord2.put("deadline", "2026-09-30");
        coord2.put("status", "PENDING_APPROVAL");
        coord2.put("priority", "CRITICAL");
        coord2.put("remarks", "Utility shifting estimate submitted to NHAI for deposit of Rs 1.84 Cr.");
        coordinationStore.add(coord2);

        Map<String, Object> coord3 = new LinkedHashMap<>();
        coord3.put("id", "COORD-003");
        coord3.put("department", "Irrigation & Water Resources Department");
        coord3.put("project", "Yamuna Expressway Interconnect Spur");
        coord3.put("request", "NOC for Box Culvert Construction across Fatehabad Branch Canal");
        coord3.put("officer", "Executive Engineer (Canal Division)");
        coord3.put("deadline", "2026-09-10");
        coord3.put("status", "RESOLVED");
        coord3.put("priority", "MEDIUM");
        coord3.put("remarks", "NOC issued under reference UP-IRR-AGR-2024-419.");
        coordinationStore.add(coord3);

        // High-Level Escalations with full status and metadata alignment
        Map<String, Object> esc1 = new LinkedHashMap<>();
        esc1.put("id", "ESC-001");
        esc1.put("title", "High Court Stay on Compensation Disbursement (Khasra 102 - Nagla)");
        esc1.put("issue", "High Court Stay on Compensation Disbursement (Khasra 102 - Nagla)");
        esc1.put("project", "Delhi–Meerut Expressway Expansion (NH-348)");
        esc1.put("projectId", "PRJ-001");
        esc1.put("caseId", "CAS-2026-001");
        esc1.put("parcelId", "102");
        esc1.put("khasraNumber", "102");
        esc1.put("fromOfficer", "Tehsildar Fatehabad / CALA Legal Cell");
        esc1.put("raisedBy", "CALA Legal Cell");
        esc1.put("currentAuthority", "District Magistrate & Collectorate");
        esc1.put("priority", "CRITICAL");
        esc1.put("severity", "CRITICAL");
        esc1.put("status", "UNDER_REVIEW");
        esc1.put("createdDate", "2026-02-18");
        esc1.put("dateRaised", "2026-02-18");
        esc1.put("reason", "Co-sharer title dispute pending in High Court writ petition (WP-892/2026).");
        esc1.put("summary", "Co-sharer title dispute pending in High Court. Tehsildar requested Collectorate direction on Section 3H(4) court deposit.");
        esc1.put("actionRequired", "Authorize CALA to deposit disputed compensation (Rs 52.4 Lakhs) in Principal Civil Court.");
        esc1.put("remarks", "Legal Cell opinion recorded. Awaiting final DM bench sanction order.");
        escalationsStore.add(esc1);

        Map<String, Object> esc2 = new LinkedHashMap<>();
        esc2.put("id", "ESC-002");
        esc2.put("title", "Farmer Representation for Underpass Near Kasan Primary School");
        esc2.put("issue", "Farmer Representation for Underpass Near Kasan Primary School");
        esc2.put("project", "Agra Western Ring Road Phase-2");
        esc2.put("projectId", "PRJ-002");
        esc2.put("caseId", "CAS-2026-002");
        esc2.put("parcelId", "215");
        esc2.put("khasraNumber", "215");
        esc2.put("fromOfficer", "Panchayat Head & Revenue Inspector");
        esc2.put("raisedBy", "Panchayat Head (Kasan)");
        esc2.put("currentAuthority", "State Infrastructure Committee & NHAI HQ");
        esc2.put("priority", "HIGH");
        esc2.put("severity", "HIGH");
        esc2.put("status", "FORWARDED");
        esc2.put("createdDate", "2026-02-12");
        esc2.put("dateRaised", "2026-02-12");
        esc2.put("reason", "Village road severance objection under Section 15. NHAI agreed in principle to include Vehicular Underpass (VUP) at Km 42+150.");
        esc2.put("summary", "Village road severance objection under Section 15. NHAI agreed in principle to include Vehicular Underpass (VUP) at Km 42+150.");
        esc2.put("actionRequired", "Collectorate letter forwarded to NHAI Regional Office for change of scope approval.");
        esc2.put("remarks", "Forwarded to State PWD & NHAI Regional Officer Lucknow.");
        escalationsStore.add(esc2);

        Map<String, Object> esc3 = new LinkedHashMap<>();
        esc3.put("id", "ESC-003");
        esc3.put("title", "State Forest Stage-II Final Clearance Expedite Requisition");
        esc3.put("issue", "State Forest Stage-II Final Clearance Expedite Requisition");
        esc3.put("project", "Yamuna Expressway to Agra Airport Interconnect");
        esc3.put("projectId", "PRJ-003");
        esc3.put("caseId", "CAS-2026-003");
        esc3.put("parcelId", "308");
        esc3.put("khasraNumber", "308");
        esc3.put("fromOfficer", "Executive Engineer (YEIDA)");
        esc3.put("raisedBy", "Project Director YEIDA");
        esc3.put("currentAuthority", "Principal Secretary (Forest & Environment)");
        esc3.put("priority", "CRITICAL");
        esc3.put("severity", "CRITICAL");
        esc3.put("status", "PENDING");
        esc3.put("createdDate", "2026-02-24");
        esc3.put("dateRaised", "2026-02-24");
        esc3.put("reason", "Compensatory afforestation land transfer pending mutation in revenue record.");
        esc3.put("summary", "4.2 Hectares of reserve forest diversion clearance pending approval from State Environment Impact Assessment Authority.");
        esc3.put("actionRequired", "State High-Level Clearance Committee meeting agenda submission.");
        esc3.put("remarks", "Collectorate dispatched urgent demi-official letter to Principal Secretary.");
        escalationsStore.add(esc3);

        // Initial Statutory Documents
        documentsStore.add(new LinkedHashMap<>(Map.of("id", "DOC-001", "name", "Section 3A / 11 Preliminary Notification Gazette (Agra District)", "type", "Statutory Gazette", "format", "PDF", "size", "3.4 MB", "date", "2024-01-15", "status", "PUBLISHED", "uploader", "District CALA Cell")));
        documentsStore.add(new LinkedHashMap<>(Map.of("id", "DOC-002", "name", "Section 3D / 19 Declaration of Acquisition Notification", "type", "Statutory Gazette", "format", "PDF", "size", "4.8 MB", "date", "2024-02-01", "status", "SANCTIONED", "uploader", "District Magistrate")));
        documentsStore.add(new LinkedHashMap<>(Map.of("id", "DOC-003", "name", "Collectorate Competent Authority Land Award Final Order", "type", "Award Order", "format", "PDF", "size", "2.1 MB", "date", "2024-02-20", "status", "ORDER_PASSED", "uploader", "Competent Authority (CALA)")));
        documentsStore.add(new LinkedHashMap<>(Map.of("id", "DOC-004", "name", "Comprehensive R&R Master Scheme Approval Order (DM Agra)", "type", "R&R Order", "format", "PDF", "size", "1.9 MB", "date", "2024-02-22", "status", "APPROVED", "uploader", "District Collectorate")));
    }

    /**
     * 1. Common District Dashboard Overview (Filtered by District Jurisdiction)
     */
    public Map<String, Object> getDashboardData(String district, String officerEmail, String role) {
        String targetDistrict = (district != null && !district.isEmpty()) ? district : "Agra";

        List<Project> allProjects = projectRepository.findAll();
        List<LandParcel> allParcels = landParcelRepository.findAll();
        List<Objection> allObjections = objectionRepository.findAll();
        List<RehabilitationBenefit> allRR = rrBenefitRepository.findAll();

        long totalProjects = allProjects.isEmpty() ? 5 : allProjects.size();
        long activeProjects = allProjects.stream().filter(p -> "ACTIVE".equalsIgnoreCase(p.getStatus()) || "IN_PROGRESS".equalsIgnoreCase(p.getStatus())).count();
        if (activeProjects == 0) activeProjects = 4;

        long affectedParcels = allParcels.isEmpty() ? 48 : allParcels.size();
        double totalAffectedArea = allParcels.stream().mapToDouble(p -> p.getAffectedAreaAcre() != null ? p.getAffectedAreaAcre() : 0.8).sum();
        if (totalAffectedArea == 0) totalAffectedArea = 142.5;

        long acquiredParcels = allParcels.stream().filter(p -> "APPROVED".equalsIgnoreCase(p.getTehsildarStatus())).count();
        if (acquiredParcels == 0) acquiredParcels = 18;

        long pendingDisputes = allObjections.stream().filter(o -> !"RESOLVED".equalsIgnoreCase(o.getStatus())).count();
        if (pendingDisputes == 0) pendingDisputes = 6;

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("district", targetDistrict);
        stats.put("state", "Uttar Pradesh");
        stats.put("officerName", "Dr. Sunita Murthy, IAS");
        stats.put("designation", "District Magistrate & Competent Authority (CALA)");
        stats.put("totalProjects", totalProjects);
        stats.put("activeProjects", activeProjects);
        stats.put("affectedVillages", 4);
        stats.put("affectedParcels", affectedParcels);
        stats.put("affectedLandAcre", Math.round(totalAffectedArea * 100.0) / 100.0);
        stats.put("acquiredParcels", acquiredParcels);
        stats.put("acquisitionProgress", 68.4);
        stats.put("compensationProgress", 74.2);
        stats.put("totalCompensationCr", 184.60);
        stats.put("disbursedCompensationCr", 136.95);
        stats.put("rrProgress", 81.0);
        stats.put("pendingDisputes", pendingDisputes);
        stats.put("criticalCases", escalationsStore.size());
        stats.put("delayedProjects", 1);
        stats.put("activeOfficersCount", 12);
        stats.put("openCoordinationRequests", coordinationStore.stream().filter(c -> !"RESOLVED".equalsIgnoreCase((String) c.get("status"))).count());

        return stats;
    }

    /**
     * 2. District Projects List
     */
    public List<Map<String, Object>> getProjects(String district, String role) {
        String targetDistrict = (district != null && !district.isEmpty()) ? district : "Agra";

        List<Project> list = projectRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        if (list.isEmpty()) {
            result.add(createProjectMap("PRJ-001", "Delhi–Meerut Expressway Expansion (NH-348)", "National Highways Authority of India (NHAI)", targetDistrict, "142.50", "420", 72, "ACTIVE", "HIGH"));
            result.add(createProjectMap("PRJ-002", "Agra Western Ring Road Phase-2 (NH-19 Spur)", "State Highways & NHAI", targetDistrict, "98.20", "310", 64, "ACTIVE", "HIGH"));
            result.add(createProjectMap("PRJ-003", "Yamuna Expressway to Agra Airport Interconnect", "Yamuna Expressway Authority (YEIDA)", targetDistrict, "65.00", "280", 45, "IN_PROGRESS", "CRITICAL"));
            result.add(createProjectMap("PRJ-004", "Eastern Dedicated Freight Corridor Agra Logistics Spur", "DFCCIL & Ministry of Railways", targetDistrict, "180.00", "510", 88, "ACTIVE", "MEDIUM"));
            result.add(createProjectMap("PRJ-005", "Agra-Gwalior High-Speed Green Expressway Corridor", "NHAI Expressways", targetDistrict, "210.00", "640", 30, "PLANNING", "MEDIUM"));
        } else {
            for (Project p : list) {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("projectId", p.getProjectId() != null ? p.getProjectId() : "PRJ-" + p.getId());
                m.put("name", p.getName());
                m.put("agency", p.getRequiringAgency() != null ? p.getRequiringAgency() : (p.getAuthority() != null ? p.getAuthority() : "NHAI"));
                m.put("district", p.getDistricts() != null ? p.getDistricts() : targetDistrict);
                m.put("state", p.getState() != null ? p.getState() : "Uttar Pradesh");
                m.put("totalLandAcre", p.getTotalLandRequired() != null ? p.getTotalLandRequired() : 120.0);
                m.put("affectedParcels", p.getAffectedFamilies() != null ? p.getAffectedFamilies() * 4 : 350);
                m.put("progress", p.getPossessionPercentage() != null ? p.getPossessionPercentage() : 65.0);
                m.put("status", p.getStatus() != null ? p.getStatus() : "ACTIVE");
                m.put("priority", p.getTimelineStatus() != null ? p.getTimelineStatus() : "HIGH");
                result.add(m);
            }
        }
        return result;
    }

    private Map<String, Object> createProjectMap(String id, String name, String agency, String dist, String area, String parcels, int prog, String status, String priority) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("projectId", id);
        m.put("name", name);
        m.put("agency", agency);
        m.put("district", dist);
        m.put("totalLandAcre", area);
        m.put("affectedParcels", parcels);
        m.put("progress", prog);
        m.put("status", status);
        m.put("priority", priority);
        return m;
    }

    public Map<String, Object> getProjectById(String projectId, String district) {
        List<Map<String, Object>> projects = getProjects(district, "DISTRICT_MAGISTRATE");
        return projects.stream()
                .filter(p -> projectId.equalsIgnoreCase((String) p.get("projectId")))
                .findFirst()
                .orElse(projects.isEmpty() ? Collections.emptyMap() : projects.get(0));
    }

    /**
     * 3. District Acquisition Cases
     */
    public List<Map<String, Object>> getAcquisitionCases(String district, String projectId, String status) {
        List<LandParcel> parcels = landParcelRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (LandParcel p : parcels) {
            if (projectId != null && !projectId.isEmpty() && !"ALL".equalsIgnoreCase(projectId)) {
                if (p.getProjectId() != null && !projectId.equalsIgnoreCase(p.getProjectId())) {
                    continue;
                }
            }

            Map<String, Object> c = new LinkedHashMap<>();
            c.put("caseId", p.getCaseId() != null ? p.getCaseId() : "CASE-2026-DME-0" + p.getKhasraNumber());
            c.put("projectId", p.getProjectId() != null ? p.getProjectId() : "PRJ-001");
            c.put("projectName", p.getProjectName() != null ? p.getProjectName() : "Delhi–Meerut Expressway Expansion (NH-348)");
            c.put("village", p.getVillage() != null ? p.getVillage() : "Nagla");
            c.put("tehsil", p.getTehsil() != null ? p.getTehsil() : "Fatehabad");
            c.put("khasraNumber", p.getKhasraNumber());
            c.put("ownerName", p.getOwnerName() != null ? p.getOwnerName() : "Sh. Ram Kumar");
            c.put("totalAreaAcre", p.getAreaAcre() != null ? p.getAreaAcre() : 2.5);
            c.put("affectedAreaAcre", p.getAffectedAreaAcre() != null ? p.getAffectedAreaAcre() : 0.8);
            c.put("compensationAwardedCr", 0.524);
            c.put("paymentStatus", p.getPaymentStatus() != null ? p.getPaymentStatus() : "DISBURSED");
            c.put("tehsildarStatus", p.getTehsildarStatus() != null ? p.getTehsildarStatus() : "APPROVED");
            c.put("verificationStatus", p.getVerificationStatus() != null ? p.getVerificationStatus() : "COMPLETED");
            result.add(c);
        }
        return result;
    }

    /**
     * 4. Multi-Project District GIS Map Data
     */
    public Map<String, Object> getMapData(String district, String projectId) {
        String targetDistrict = (district != null && !district.isEmpty()) ? district : "Agra";

        List<LandParcel> parcels = landParcelRepository.findAll();
        List<Project> projects = projectRepository.findAll();

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("district", targetDistrict);
        res.put("state", "Uttar Pradesh");
        res.put("center", List.of(27.1650, 78.0650));
        res.put("zoom", 14);
        res.put("projects", projects);
        res.put("affectedParcels", parcels);
        res.put("activeCorridorsCount", 3);

        return res;
    }

    /**
     * 5. Disputes & Citizen Objections
     */
    public List<Map<String, Object>> getDisputes(String district, String projectId) {
        List<Objection> objections = objectionRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Objection o : objections) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", o.getId());
            m.put("disputeId", o.getObjectionId() != null ? o.getObjectionId() : "DISP-" + o.getId());
            m.put("caseId", "CASE-2026-DME-0" + o.getKhasraNumber());
            m.put("khasraNumber", o.getKhasraNumber());
            m.put("claimantName", o.getClaimantName());
            m.put("disputeType", o.getObjectionType() != null ? o.getObjectionType() : "Valuation / Title Dispute");
            m.put("description", o.getDescription());
            m.put("status", o.getStatus());
            m.put("village", "Nagla");
            m.put("tehsil", "Fatehabad");
            m.put("dateFiled", o.getCreatedAt() != null ? o.getCreatedAt().toString() : "2026-02-10");
            m.put("authorityOrder", o.getAuthorityOrder());
            result.add(m);
        }
        return result;
    }

    public Map<String, Object> escalateDispute(String disputeId, Map<String, Object> payload, String officerEmail) {
        auditLogRepository.save(new AuditLog(
                officerEmail,
                "DISTRICT_DISPUTE_ESCALATED",
                "Objection",
                disputeId,
                "District Authority escalated Dispute " + disputeId + ". Remarks: " + payload.getOrDefault("remarks", "")
        ));

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Dispute escalated to Divisional Commissioner / State Revenue Board.");
        return res;
    }

    public Map<String, Object> resolveDispute(String disputeId, Map<String, Object> payload, String officerEmail) {
        Optional<Objection> opt = objectionRepository.findByObjectionId(disputeId);
        if (opt.isPresent()) {
            Objection obj = opt.get();
            obj.setStatus("RESOLVED");
            obj.setAuthorityOrder((String) payload.getOrDefault("order", "Order passed by District Magistrate / Collector."));
            objectionRepository.save(obj);
        }

        auditLogRepository.save(new AuditLog(
                officerEmail,
                "DISTRICT_DISPUTE_RESOLVED",
                "Objection",
                disputeId,
                "District Magistrate passed statutory order on Dispute " + disputeId + "."
        ));

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Statutory Collectorate order passed and dispute marked resolved.");
        return res;
    }

    /**
     * 6. Compensation Overview
     */
    public Map<String, Object> getCompensationOverview(String district) {
        Map<String, Object> comp = new LinkedHashMap<>();
        comp.put("totalEstimatedCr", 184.60);
        comp.put("awardedAmountCr", 162.80);
        comp.put("disbursedAmountCr", 136.95);
        comp.put("pendingDisbursementCr", 25.85);
        comp.put("totalBeneficiaries", 420);
        comp.put("paidBeneficiaries", 312);
        comp.put("pendingBeneficiaries", 108);
        comp.put("dbtSuccessRate", "98.4%");
        comp.put("lastDisbursementDate", "2026-02-25");
        return comp;
    }

    /**
     * 7. R&R Monitoring Overview
     */
    public Map<String, Object> getRnROverview(String district) {
        Map<String, Object> rr = new LinkedHashMap<>();
        rr.put("totalEligibleFamilies", 84);
        rr.put("resettlementPlotsAllotted", 62);
        rr.put("pendingPlotAllotments", 22);
        rr.put("totalGrantDisbursedCr", 4.20);
        rr.put("skillTrainingBeneficiaries", 115);
        rr.put("annuityDisbursedCount", 78);
        rr.put("complianceStatus", "COMPLIANT_WITH_SECOND_SCHEDULE_RFCTLARR");
        return rr;
    }

    /**
     * 8. Officer Monitoring (Tehsildars & Revenue Inspectors)
     */
    public List<Map<String, Object>> getOfficers(String district) {
        List<Map<String, Object>> officers = new ArrayList<>();

        Map<String, Object> o1 = new LinkedHashMap<>();
        o1.put("id", "OFF-001");
        o1.put("name", "Sh. Alok Srivastava");
        o1.put("designation", "Tehsildar & Executive Officer");
        o1.put("department", "Revenue Department (Fatehabad)");
        o1.put("assignedCases", 48);
        o1.put("completedCases", 18);
        o1.put("pendingCases", 12);
        o1.put("avgTurnaroundDays", 4.2);
        o1.put("status", "ACTIVE");
        officers.add(o1);

        Map<String, Object> o2 = new LinkedHashMap<>();
        o2.put("id", "OFF-002");
        o2.put("name", "Sh. Alok Srivastava (Field CALA)");
        o2.put("designation", "Revenue Inspector & Field Verification Officer");
        o2.put("department", "Revenue Department (Fatehabad)");
        o2.put("assignedCases", 48);
        o2.put("completedCases", 24);
        o2.put("pendingCases", 12);
        o2.put("avgTurnaroundDays", 2.8);
        o2.put("status", "ACTIVE");
        officers.add(o2);

        Map<String, Object> o3 = new LinkedHashMap<>();
        o3.put("id", "OFF-003");
        o3.put("name", "Sh. Rajesh Verma");
        o3.put("designation", "Executive Director & Project Lead (NHAI)");
        o3.put("department", "NHAI PIU Agra");
        o3.put("assignedCases", 120);
        o3.put("completedCases", 85);
        o3.put("pendingCases", 35);
        o3.put("avgTurnaroundDays", 6.1);
        o3.put("status", "ACTIVE");
        officers.add(o3);

        return officers;
    }

    /**
     * 9. Inter-Departmental Coordination Requests
     */
    public List<Map<String, Object>> getCoordinationRequests(String district) {
        return coordinationStore;
    }

    public Map<String, Object> createCoordinationRequest(Map<String, Object> payload, String officerEmail) {
        String id = "COORD-00" + (coordinationStore.size() + 1);
        payload.put("id", id);
        payload.put("status", "IN_PROGRESS");
        payload.put("createdAt", LocalDateTime.now().format(DATE_FORMATTER));
        coordinationStore.add(payload);

        auditLogRepository.save(new AuditLog(
                officerEmail,
                "DISTRICT_COORDINATION_REQUEST_CREATED",
                "Coordination",
                id,
                "District Authority created Inter-Departmental Coordination Request: " + payload.get("request")
        ));

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Inter-departmental coordination notice dispatched successfully.");
        res.put("id", id);
        return res;
    }

    /**
     * 10. High-Level Escalations (Comprehensive with Status Filtering & Full Entity Links)
     */
    public List<Map<String, Object>> getEscalations(String district, String statusFilter) {
        if (statusFilter == null || statusFilter.isEmpty() || "ALL".equalsIgnoreCase(statusFilter)) {
            return escalationsStore;
        }
        return escalationsStore.stream()
                .filter(e -> statusFilter.equalsIgnoreCase((String) e.get("status")))
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getEscalations(String district) {
        return getEscalations(district, null);
    }

    public Map<String, Object> createEscalation(Map<String, Object> payload, String officerEmail) {
        String id = "ESC-00" + (escalationsStore.size() + 1);
        Map<String, Object> esc = new LinkedHashMap<>();
        esc.put("id", id);
        esc.put("title", payload.getOrDefault("title", payload.getOrDefault("issue", "District Escalation Requisition")));
        esc.put("issue", payload.getOrDefault("issue", payload.getOrDefault("title", "District Escalation Requisition")));
        esc.put("project", payload.getOrDefault("project", "Delhi–Meerut Expressway Expansion (NH-348)"));
        esc.put("projectId", payload.getOrDefault("projectId", "PRJ-001"));
        esc.put("caseId", payload.getOrDefault("caseId", "CAS-2026-001"));
        esc.put("parcelId", payload.getOrDefault("parcelId", "101"));
        esc.put("khasraNumber", payload.getOrDefault("khasraNumber", "101"));
        esc.put("fromOfficer", payload.getOrDefault("fromOfficer", officerEmail != null ? officerEmail : "District Authority"));
        esc.put("raisedBy", payload.getOrDefault("raisedBy", officerEmail != null ? officerEmail : "District CALA Cell"));
        esc.put("currentAuthority", payload.getOrDefault("currentAuthority", "District Magistrate & Collectorate"));
        esc.put("priority", payload.getOrDefault("priority", "HIGH"));
        esc.put("severity", payload.getOrDefault("severity", payload.getOrDefault("priority", "HIGH")));
        esc.put("status", payload.getOrDefault("status", "NEW"));
        esc.put("createdDate", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        esc.put("dateRaised", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        esc.put("reason", payload.getOrDefault("reason", "Statutory SLA threshold exceeded; Collectorate intervention requested."));
        esc.put("summary", payload.getOrDefault("summary", payload.getOrDefault("reason", "Statutory threshold exceeded.")));
        esc.put("actionRequired", payload.getOrDefault("actionRequired", "High-level administrative determination and policy clearance."));
        esc.put("remarks", payload.getOrDefault("remarks", "Escalation registered in Collectorate tracking register."));
        escalationsStore.add(0, esc);

        auditLogRepository.save(new AuditLog(
                officerEmail,
                "DISTRICT_ESCALATION_CREATED",
                "Escalation",
                id,
                "District Authority created Escalation " + id + ": " + esc.get("title")
        ));

        Notification notif = new Notification();
        notif.setNotificationId("NOTIF-ESC-" + System.currentTimeMillis());
        notif.setType("DISTRICT_ESCALATION_REGISTERED");
        notif.setTitle("District Escalation Created: " + id);
        notif.setMessage("High priority escalation registered for " + esc.get("project") + ": " + esc.get("title"));
        notif.setTargetRole("DISTRICT_AUTHORITY");
        notif.setRelatedCaseId(String.valueOf(esc.get("caseId")));
        notificationRepository.save(notif);

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Escalation registered successfully under ID " + id + ".");
        res.put("id", id);
        res.put("escalation", esc);
        return res;
    }

    public Map<String, Object> actionEscalation(String escalationId, Map<String, Object> payload, String officerEmail) {
        for (Map<String, Object> esc : escalationsStore) {
            if (escalationId.equals(esc.get("id"))) {
                esc.put("status", "RESOLVED");
                esc.put("resolutionRemarks", payload.getOrDefault("remarks", "Collectorate order executed."));
                break;
            }
        }

        auditLogRepository.save(new AuditLog(
                officerEmail,
                "DISTRICT_ESCALATION_RESOLVED",
                "Escalation",
                escalationId,
                "District Magistrate resolved Escalation " + escalationId + "."
        ));

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Collectorate action executed on escalation.");
        return res;
    }

    public Map<String, Object> updateEscalationStatus(String escalationId, Map<String, Object> payload, String officerEmail) {
        String status = (String) payload.getOrDefault("status", "ACTION_TAKEN");
        String remarks = (String) payload.getOrDefault("remarks", "Collectorate order executed.");

        for (Map<String, Object> esc : escalationsStore) {
            if (escalationId.equals(esc.get("id"))) {
                esc.put("status", status);
                esc.put("resolutionRemarks", remarks);
                esc.put("updatedAt", LocalDateTime.now().format(DATE_FORMATTER));
                break;
            }
        }

        auditLogRepository.save(new AuditLog(
                officerEmail,
                "DISTRICT_ESCALATION_STATUS_CHANGED",
                "Escalation",
                escalationId,
                "Escalation " + escalationId + " updated to " + status + ". Remarks: " + remarks
        ));

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Escalation status updated successfully.");
        return res;
    }

    public Map<String, Object> forwardEscalation(String escalationId, Map<String, Object> payload, String officerEmail) {
        String targetDept = (String) payload.getOrDefault("department", "State Revenue Board / NHAI Regional Office");
        String remarks = (String) payload.getOrDefault("remarks", "Forwarded for inter-agency resolution.");

        for (Map<String, Object> esc : escalationsStore) {
            if (escalationId.equals(esc.get("id"))) {
                esc.put("status", "FORWARDED");
                esc.put("currentAuthority", targetDept);
                esc.put("forwardedTo", targetDept);
                esc.put("remarks", (esc.get("remarks") != null ? esc.get("remarks") + " | " : "") + "[Forwarded to " + targetDept + "]: " + remarks);
                esc.put("updatedAt", LocalDateTime.now().format(DATE_FORMATTER));
                break;
            }
        }

        auditLogRepository.save(new AuditLog(
                officerEmail,
                "DISTRICT_ESCALATION_FORWARDED",
                "Escalation",
                escalationId,
                "Escalation " + escalationId + " forwarded to " + targetDept + ". Remarks: " + remarks
        ));

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Escalation forwarded to " + targetDept + " successfully.");
        return res;
    }

    public Map<String, Object> escalateToState(String escalationId, Map<String, Object> payload, String officerEmail) {
        String remarks = (String) payload.getOrDefault("remarks", "Escalated to State High-Level Infrastructure Committee.");

        for (Map<String, Object> esc : escalationsStore) {
            if (escalationId.equals(esc.get("id"))) {
                esc.put("status", "FORWARDED_TO_STATE");
                esc.put("currentAuthority", "State High-Level Infrastructure Committee & Revenue Board");
                esc.put("remarks", (esc.get("remarks") != null ? esc.get("remarks") + " | " : "") + "[Escalated to State]: " + remarks);
                esc.put("updatedAt", LocalDateTime.now().format(DATE_FORMATTER));
                break;
            }
        }

        Notification notif = new Notification();
        notif.setNotificationId("NOTIF-STATE-ESC-" + System.currentTimeMillis());
        notif.setType("STATE_ESCALATION");
        notif.setTitle("District Escalation Forwarded: " + escalationId);
        notif.setMessage("District Collectorate escalated critical matter to State Revenue Board: " + remarks);
        notif.setTargetRole("STATE_GOVERNMENT");
        notif.setRelatedCaseId(escalationId);
        notificationRepository.save(notif);

        auditLogRepository.save(new AuditLog(
                officerEmail,
                "DISTRICT_ESCALATION_FORWARDED_STATE",
                "Escalation",
                escalationId,
                "District Collectorate escalated " + escalationId + " to State Government: " + remarks
        ));

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Escalation forwarded to State Government successfully.");
        return res;
    }

    public Map<String, Object> addEscalationRemark(String escalationId, Map<String, Object> payload, String officerEmail) {
        String remark = (String) payload.getOrDefault("remark", "");
        for (Map<String, Object> esc : escalationsStore) {
            if (escalationId.equals(esc.get("id"))) {
                esc.put("remarks", (esc.get("remarks") != null ? esc.get("remarks") + " | " : "") + "[Note " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) + "]: " + remark);
                esc.put("updatedAt", LocalDateTime.now().format(DATE_FORMATTER));
                break;
            }
        }

        auditLogRepository.save(new AuditLog(
                officerEmail,
                "DISTRICT_ESCALATION_REMARK_ADDED",
                "Escalation",
                escalationId,
                "Remark added to Escalation " + escalationId + ": " + remark
        ));

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Remark recorded on escalation ledger.");
        return res;
    }

    /**
     * 11. Dynamic Delayed Workflows Calculation (Calculated against statutory SLA thresholds)
     */
    public List<Map<String, Object>> getDelayedCases(String district, String categoryFilter) {
        List<Map<String, Object>> list = new ArrayList<>();
        List<LandParcel> allParcels = landParcelRepository.findAll();
        List<Project> allProjects = projectRepository.findAll();
        List<Objection> allObjections = objectionRepository.findAll();
        List<RehabilitationBenefit> allRR = rrBenefitRepository.findAll();

        // 1. Delayed Projects (SLA: Target Possession Date & Stage Deadlines)
        for (Project p : allProjects) {
            boolean isDelayed = "DELAYED".equalsIgnoreCase(p.getStatus()) || "DELAYED".equalsIgnoreCase(p.getTimelineStatus())
                    || "CRITICAL".equalsIgnoreCase(p.getTimelineStatus())
                    || (p.getPossessionPercentage() != null && p.getPossessionPercentage() < 50.0);
            
            if (isDelayed || list.isEmpty()) {
                String pId = p.getProjectId() != null ? p.getProjectId() : "PRJ-003";
                Map<String, Object> item = new LinkedHashMap<>();
                item.put("id", "DLY-PRJ-" + pId);
                item.put("delayedId", "DLY-PRJ-" + pId);
                item.put("category", "DELAYED_PROJECT");
                item.put("categoryLabel", "Delayed Project");
                item.put("project", p.getName() != null ? p.getName() : "Yamuna Expressway to Agra Airport Interconnect");
                item.put("projectId", pId);
                item.put("stage", "Corridor Land Possession & Gazette Publication");
                item.put("caseId", pId);
                item.put("khasraNumber", "Corridor-Wide (280 Parcels)");
                item.put("parcelId", pId);
                item.put("ownerName", "Multiple Beneficiaries (YEIDA Corridor)");
                item.put("village", "Kasan & Nagla Sector");
                item.put("tehsil", "Fatehabad");
                item.put("responsibleOfficer", "Project Director (YEIDA) & CALA Agra");
                item.put("department", "YEIDA / NHAI Corridor Cell");
                item.put("dueDate", "2026-01-30");
                item.put("daysDelayed", 28);
                item.put("statutoryLimitDays", 120);
                item.put("currentStatus", "BEHIND_SCHEDULE");
                item.put("delayReason", "Forest Stage-II clearance pending along Chainage 14+200 to 18+500.");
                item.put("priority", "CRITICAL");
                item.put("mitigationStatus", "DIRECTIVE_DISPATCHED");
                applyDelayedOverrides(item);
                list.add(item);
                if (list.size() >= 1) break; // Keep sample clean
            }
        }

        // 2. Delayed Acquisition (Section 11 -> 19 -> 23 Stages)
        Map<String, Object> dAcq = new LinkedHashMap<>();
        dAcq.put("id", "DLY-ACQ-CAS-2026-001");
        dAcq.put("delayedId", "DLY-ACQ-CAS-2026-001");
        dAcq.put("category", "DELAYED_ACQUISITION");
        dAcq.put("categoryLabel", "Delayed Acquisition");
        dAcq.put("project", "Delhi–Meerut Expressway Expansion (NH-348)");
        dAcq.put("projectId", "PRJ-001");
        dAcq.put("stage", "Section 19 Declaration Sanction");
        dAcq.put("caseId", "CAS-2026-001");
        dAcq.put("khasraNumber", "101");
        dAcq.put("parcelId", "101");
        dAcq.put("ownerName", "Sh. Ram Kumar");
        dAcq.put("village", "Nagla");
        dAcq.put("tehsil", "Fatehabad");
        dAcq.put("responsibleOfficer", "Tehsildar Fatehabad & CALA Legal Cell");
        dAcq.put("department", "Collectorate CALA Cell");
        dAcq.put("dueDate", "2026-02-10");
        dAcq.put("daysDelayed", 18);
        dAcq.put("statutoryLimitDays", 60);
        dAcq.put("currentStatus", "STAGE_SECTION_19_PENDING");
        dAcq.put("delayReason", "Joint measurement survey re-verification signature pending from co-sharers.");
        dAcq.put("priority", "HIGH");
        dAcq.put("mitigationStatus", "NOTICE_ISSUED");
        applyDelayedOverrides(dAcq);
        list.add(dAcq);

        // 3. Pending Verification (Ground Truthing / Panchnama SLA: 15 Days)
        Map<String, Object> dVer = new LinkedHashMap<>();
        dVer.put("id", "DLY-VER-CAS-2026-104");
        dVer.put("delayedId", "DLY-VER-CAS-2026-104");
        dVer.put("category", "PENDING_VERIFICATION");
        dVer.put("categoryLabel", "Pending Verification");
        dVer.put("project", "Delhi–Meerut Expressway Expansion (NH-348)");
        dVer.put("projectId", "PRJ-001");
        dVer.put("stage", "Field Verification & Demarcation Panchnama");
        dVer.put("caseId", "CAS-2026-104");
        dVer.put("khasraNumber", "104");
        dVer.put("parcelId", "104");
        dVer.put("ownerName", "Sh. Devendra Singh");
        dVer.put("village", "Nagla");
        dVer.put("tehsil", "Fatehabad");
        dVer.put("responsibleOfficer", "Revenue Inspector (Field CALA) & Lekhpal");
        dVer.put("department", "Tehsil Revenue Staff");
        dVer.put("dueDate", "2026-02-05");
        dVer.put("daysDelayed", 23);
        dVer.put("statutoryLimitDays", 15);
        dVer.put("currentStatus", "VERIFICATION_PENDING");
        dVer.put("delayReason", "Field boundary pillar demarcation delayed due to seasonal standing crop harvest.");
        dVer.put("priority", "HIGH");
        dVer.put("mitigationStatus", "UNASSIGNED");
        applyDelayedOverrides(dVer);
        list.add(dVer);

        // 4. Pending Compensation (PFMS DBT Disbursal SLA: 30 Days after Award)
        Map<String, Object> dComp = new LinkedHashMap<>();
        dComp.put("id", "DLY-CMP-CAS-2026-215");
        dComp.put("delayedId", "DLY-CMP-CAS-2026-215");
        dComp.put("category", "PENDING_COMPENSATION");
        dComp.put("categoryLabel", "Pending Compensation");
        dComp.put("project", "Agra Western Ring Road Phase-2");
        dComp.put("projectId", "PRJ-002");
        dComp.put("stage", "PFMS Direct Benefit Transfer (DBT) Disbursal");
        dComp.put("caseId", "CAS-2026-215");
        dComp.put("khasraNumber", "215");
        dComp.put("parcelId", "215");
        dComp.put("ownerName", "Smt. Shanti Devi");
        dComp.put("village", "Kasan");
        dComp.put("tehsil", "Fatehabad");
        dComp.put("responsibleOfficer", "CALA Compensation Disbursal Officer & SBI Nodal Branch");
        dComp.put("department", "Collectorate Treasury / Banking Nodal");
        dComp.put("dueDate", "2026-01-20");
        dComp.put("daysDelayed", 39);
        dComp.put("statutoryLimitDays", 30);
        dComp.put("currentStatus", "PAYMENT_HELD");
        dComp.put("delayReason", "Bank IFSC mismatch in PFMS portal; corrected bank mandate submitted to treasury.");
        dComp.put("priority", "CRITICAL");
        dComp.put("mitigationStatus", "DIRECTIVE_DISPATCHED");
        applyDelayedOverrides(dComp);
        list.add(dComp);

        // 5. Pending R&R (Second Schedule Entitlements SLA: 60 Days)
        Map<String, Object> dRnR = new LinkedHashMap<>();
        dRnR.put("id", "DLY-RNR-PAF-042");
        dRnR.put("delayedId", "DLY-RNR-PAF-042");
        dRnR.put("category", "PENDING_RNR");
        dRnR.put("categoryLabel", "Pending R&R");
        dRnR.put("project", "Delhi–Meerut Expressway Expansion (NH-348)");
        dRnR.put("projectId", "PRJ-001");
        dRnR.put("stage", "Second Schedule Resettlement Plot Allotment");
        dRnR.put("caseId", "PAF-2026-042");
        dRnR.put("khasraNumber", "102/B");
        dRnR.put("parcelId", "102");
        dRnR.put("ownerName", "Sh. Jagdish Prasad (Displaced Family)");
        dRnR.put("village", "Nagla");
        dRnR.put("tehsil", "Fatehabad");
        dRnR.put("responsibleOfficer", "R&R Administrator & Sub-Divisional Magistrate (SDM)");
        dRnR.put("department", "R&R Authority");
        dRnR.put("dueDate", "2026-01-15");
        dRnR.put("daysDelayed", 44);
        dRnR.put("statutoryLimitDays", 60);
        dRnR.put("currentStatus", "PLOT_ALLOCATION_PENDING");
        dRnR.put("delayReason", "Model resettlement colony layout infrastructure approval pending from Local Development Authority.");
        dRnR.put("priority", "HIGH");
        dRnR.put("mitigationStatus", "NOTICE_ISSUED");
        applyDelayedOverrides(dRnR);
        list.add(dRnR);

        // 6. Overdue Objections (Section 15 Quasi-Judicial Inquiry SLA: 60 Days)
        Map<String, Object> dObj = new LinkedHashMap<>();
        dObj.put("id", "DLY-OBJ-DISP-018");
        dObj.put("delayedId", "DLY-OBJ-DISP-018");
        dObj.put("category", "OVERDUE_OBJECTION");
        dObj.put("categoryLabel", "Overdue Objection");
        dObj.put("project", "Delhi–Meerut Expressway Expansion (NH-348)");
        dObj.put("projectId", "PRJ-001");
        dObj.put("stage", "Section 15 Citizen Hearing & Statutory Order");
        dObj.put("caseId", "DISP-1787935143532");
        dObj.put("khasraNumber", "112/4");
        dObj.put("parcelId", "112");
        dObj.put("ownerName", "Sh. Rameshwar Dayal & Brothers");
        dObj.put("village", "Fatehabad Rural");
        dObj.put("tehsil", "Fatehabad");
        dObj.put("responsibleOfficer", "District Magistrate & Quasi-Judicial Collectorate Bench");
        dObj.put("department", "Office of the District Magistrate");
        dObj.put("dueDate", "2026-01-10");
        dObj.put("daysDelayed", 49);
        dObj.put("statutoryLimitDays", 60);
        dObj.put("currentStatus", "HEARING_OVERDUE");
        dObj.put("delayReason", "Valuation circle rate dispute pending re-verification from Sub-Registrar records.");
        dObj.put("priority", "CRITICAL");
        dObj.put("mitigationStatus", "UNASSIGNED");
        applyDelayedOverrides(dObj);
        list.add(dObj);

        if (categoryFilter != null && !categoryFilter.isEmpty() && !"ALL".equalsIgnoreCase(categoryFilter)) {
            return list.stream()
                    .filter(item -> categoryFilter.equalsIgnoreCase((String) item.get("category")))
                    .collect(Collectors.toList());
        }

        return list;
    }

    public List<Map<String, Object>> getDelayedCases(String district) {
        return getDelayedCases(district, null);
    }

    private void applyDelayedOverrides(Map<String, Object> item) {
        String id = (String) item.get("id");
        String caseId = (String) item.get("caseId");
        Map<String, Object> ov = delayedCaseOverrides.get(id);
        if (ov == null && caseId != null) ov = delayedCaseOverrides.get(caseId);

        if (ov != null) {
            if (ov.containsKey("status")) item.put("currentStatus", ov.get("status"));
            if (ov.containsKey("delayReason")) item.put("delayReason", ov.get("delayReason"));
            if (ov.containsKey("mitigationStatus")) item.put("mitigationStatus", ov.get("mitigationStatus"));
            if (ov.containsKey("remarks")) item.put("remarks", ov.get("remarks"));
            if (ov.containsKey("responsibleOfficer")) item.put("responsibleOfficer", ov.get("responsibleOfficer"));
        }
    }

    public Map<String, Object> addDelayedRemark(String caseId, Map<String, Object> payload, String officerEmail) {
        String remark = (String) payload.getOrDefault("remark", "");
        Map<String, Object> ov = delayedCaseOverrides.computeIfAbsent(caseId, k -> new LinkedHashMap<>());
        String existing = (String) ov.getOrDefault("remarks", "");
        ov.put("remarks", (existing.isEmpty() ? "" : existing + " | ") + "[Note " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) + "]: " + remark);
        ov.put("updatedAt", LocalDateTime.now().format(DATE_FORMATTER));

        auditLogRepository.save(new AuditLog(
                officerEmail,
                "DISTRICT_DELAYED_REMARK_ADDED",
                "DelayedWorkflow",
                caseId,
                "Remark added to Delayed Workflow " + caseId + ": " + remark
        ));

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Mitigation remark attached to case ledger.");
        return res;
    }

    public Map<String, Object> updateDelayedStatus(String caseId, Map<String, Object> payload, String officerEmail) {
        String status = (String) payload.getOrDefault("status", "IN_PROGRESS");
        String remarks = (String) payload.getOrDefault("remarks", "Status updated by Collectorate.");

        Map<String, Object> ov = delayedCaseOverrides.computeIfAbsent(caseId, k -> new LinkedHashMap<>());
        ov.put("status", status);
        ov.put("mitigationStatus", status);
        ov.put("remarks", remarks);
        ov.put("updatedAt", LocalDateTime.now().format(DATE_FORMATTER));

        auditLogRepository.save(new AuditLog(
                officerEmail,
                "DISTRICT_DELAYED_STATUS_UPDATED",
                "DelayedWorkflow",
                caseId,
                "Delayed Workflow " + caseId + " status updated to " + status + ". Remarks: " + remarks
        ));

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Workflow status updated successfully.");
        return res;
    }

    public Map<String, Object> updateDelayedReason(String caseId, Map<String, Object> payload, String officerEmail) {
        String delayReason = (String) payload.getOrDefault("delayReason", "");
        Map<String, Object> ov = delayedCaseOverrides.computeIfAbsent(caseId, k -> new LinkedHashMap<>());
        ov.put("delayReason", delayReason);
        ov.put("updatedAt", LocalDateTime.now().format(DATE_FORMATTER));

        auditLogRepository.save(new AuditLog(
                officerEmail,
                "DISTRICT_DELAYED_REASON_UPDATED",
                "DelayedWorkflow",
                caseId,
                "Delay root cause updated for " + caseId + ": " + delayReason
        ));

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Delay root cause recorded in statutory register.");
        return res;
    }

    public Map<String, Object> forwardDelayedCase(String caseId, Map<String, Object> payload, String officerEmail) {
        String officer = (String) payload.getOrDefault("officer", "Tehsildar / Sub-Divisional Magistrate");
        String remarks = (String) payload.getOrDefault("remarks", "SLA compliance expedited notice forwarded.");

        Map<String, Object> ov = delayedCaseOverrides.computeIfAbsent(caseId, k -> new LinkedHashMap<>());
        ov.put("responsibleOfficer", officer);
        ov.put("mitigationStatus", "FORWARDED_NOTICE");
        ov.put("remarks", (ov.get("remarks") != null ? ov.get("remarks") + " | " : "") + "[Forwarded to " + officer + "]: " + remarks);
        ov.put("updatedAt", LocalDateTime.now().format(DATE_FORMATTER));

        Notification notif = new Notification();
        notif.setNotificationId("NOTIF-FWD-" + System.currentTimeMillis());
        notif.setType("DELAY_FORWARDED");
        notif.setTitle("Statutory Delay Notice Forwarded: " + caseId);
        notif.setMessage("Collectorate forwarded SLA compliance notice to " + officer + ": " + remarks);
        notif.setTargetRole("REVENUE_OFFICER");
        notif.setRelatedCaseId(caseId);
        notificationRepository.save(notif);

        auditLogRepository.save(new AuditLog(
                officerEmail,
                "DISTRICT_DELAYED_FORWARDED",
                "DelayedWorkflow",
                caseId,
                "Delayed case " + caseId + " forwarded to " + officer + ". Remarks: " + remarks
        ));

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Statutory notice forwarded to " + officer + " successfully.");
        return res;
    }

    public Map<String, Object> escalateDelayedCase(String caseId, Map<String, Object> payload, String officerEmail) {
        // Direct bridge from Delayed Workflow to Escalation!
        String title = (String) payload.getOrDefault("title", "SLA Delay Escalation: " + caseId);
        String project = (String) payload.getOrDefault("project", "Delhi–Meerut Expressway Expansion (NH-348)");
        String projectId = (String) payload.getOrDefault("projectId", "PRJ-001");
        String targetAuthority = (String) payload.getOrDefault("currentAuthority", "State Infrastructure Committee & Revenue Board");
        String priority = (String) payload.getOrDefault("priority", "CRITICAL");
        String reason = (String) payload.getOrDefault("reason", "Statutory deadline breached; district Collectorate intervention required.");
        String remarks = (String) payload.getOrDefault("remarks", "Escalated from SLA Monitoring module.");
        String khasra = (String) payload.getOrDefault("khasraNumber", "101");

        Map<String, Object> escPayload = new LinkedHashMap<>();
        escPayload.put("title", title);
        escPayload.put("issue", title);
        escPayload.put("project", project);
        escPayload.put("projectId", projectId);
        escPayload.put("caseId", caseId);
        escPayload.put("khasraNumber", khasra);
        escPayload.put("fromOfficer", officerEmail != null ? officerEmail : "District Magistrate (CALA)");
        escPayload.put("currentAuthority", targetAuthority);
        escPayload.put("priority", priority);
        escPayload.put("status", "NEW");
        escPayload.put("reason", reason);
        escPayload.put("actionRequired", "Statutory policy intervention and administrative waiver/sanction.");
        escPayload.put("remarks", remarks);

        Map<String, Object> escRes = createEscalation(escPayload, officerEmail);

        // Update delayed override status
        Map<String, Object> ov = delayedCaseOverrides.computeIfAbsent(caseId, k -> new LinkedHashMap<>());
        ov.put("mitigationStatus", "ESCALATED");
        ov.put("status", "ESCALATED");
        ov.put("remarks", (ov.get("remarks") != null ? ov.get("remarks") + " | " : "") + "[Escalated under " + escRes.get("id") + "]: " + remarks);
        ov.put("updatedAt", LocalDateTime.now().format(DATE_FORMATTER));

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Delayed case successfully escalated to " + targetAuthority + " under Escalation ID " + escRes.get("id") + ".");
        res.put("escalationId", escRes.get("id"));
        return res;
    }

    /**
     * 2.1 Update Project Progress & Milestone
     */
    public Map<String, Object> updateProjectProgress(String projectId, Map<String, Object> payload, String officerEmail) {
        Optional<Project> opt = projectRepository.findByProjectId(projectId);
        Project project = opt.orElse(null);
        if (project != null) {
            if (payload.containsKey("progress")) {
                Object pVal = payload.get("progress");
                double prog = (pVal instanceof Number) ? ((Number) pVal).doubleValue() : Double.parseDouble(pVal.toString());
                project.setPossessionPercentage(prog);
            }
            if (payload.containsKey("currentStage")) {
                project.setCurrentStage((String) payload.get("currentStage"));
            }
            if (payload.containsKey("status")) {
                project.setStatus((String) payload.get("status"));
            }
            if (payload.containsKey("timelineStatus")) {
                project.setTimelineStatus((String) payload.get("timelineStatus"));
            }
            projectRepository.save(project);
        }

        String remarks = (String) payload.getOrDefault("remarks", "District Progress milestone updated by Collectorate.");
        boolean forwardToState = Boolean.TRUE.equals(payload.get("forwardToState")) || "YES".equalsIgnoreCase(String.valueOf(payload.get("forwardToState")));

        auditLogRepository.save(new AuditLog(
                officerEmail,
                forwardToState ? "DISTRICT_PROJECT_ESCALATED_STATE" : "DISTRICT_PROJECT_PROGRESS_UPDATED",
                "Project",
                projectId,
                "District Authority updated Project " + projectId + ". Stage: " + payload.getOrDefault("currentStage", "N/A") + ". Remarks: " + remarks
        ));

        if (forwardToState) {
            Notification notif = new Notification();
            notif.setNotificationId("NOTIF-ESC-" + System.currentTimeMillis());
            notif.setType("PROJECT_ESCALATION");
            notif.setTitle("District Milestone Escalation: " + (project != null ? project.getName() : projectId));
            notif.setMessage("Project milestone update forwarded to State Revenue & Infrastructure Cell: " + remarks);
            notif.setTargetRole("STATE_GOVERNMENT");
            notif.setRelatedCaseId(projectId);
            notificationRepository.save(notif);
        }

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", forwardToState ? "Project milestone updated and forwarded to State Government successfully." : "Project progress milestone updated successfully.");
        res.put("projectId", projectId);
        res.put("updatedAt", LocalDateTime.now().format(DATE_FORMATTER));
        return res;
    }

    public Map<String, Object> uploadProjectDocument(String projectId, Map<String, Object> payload, String officerEmail) {
        String docId = "DOC-PRJ-" + System.currentTimeMillis();
        Map<String, Object> doc = new LinkedHashMap<>();
        doc.put("id", docId);
        doc.put("name", payload.getOrDefault("name", "Project Milestone Clearance Certificate"));
        doc.put("type", payload.getOrDefault("type", "Clearance Certificate"));
        doc.put("format", payload.getOrDefault("format", "PDF"));
        doc.put("size", payload.getOrDefault("size", "2.4 MB"));
        doc.put("date", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        doc.put("status", "VERIFIED");
        doc.put("uploader", officerEmail);
        doc.put("projectId", projectId);
        documentsStore.add(0, doc);

        auditLogRepository.save(new AuditLog(
                officerEmail,
                "DISTRICT_PROJECT_DOC_UPLOADED",
                "ProjectDocument",
                projectId,
                "Document " + doc.get("name") + " uploaded for Project " + projectId
        ));

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Document attached to project dossier successfully.");
        res.put("docId", docId);
        return res;
    }

    /**
     * 3.1 Update Acquisition Status & Forward
     */
    public Map<String, Object> updateAcquisitionStatus(String caseId, Map<String, Object> payload, String officerEmail) {
        LandParcel parcel = findParcelByCaseOrKhasra(caseId);
        if (parcel != null) {
            String newStatus = (String) payload.getOrDefault("status", parcel.getStatus());
            parcel.setStatus(newStatus);
            parcel.setAuthorityApproved(true);
            parcel.setAuthorityApprovalDate(LocalDateTime.now().format(DATE_FORMATTER));
            if (payload.containsKey("remarks")) {
                parcel.setRevenueOfficerNotes((String) payload.get("remarks"));
            }
            if ("POSSESSION_TAKEN".equalsIgnoreCase(newStatus) || "ACQUIRED".equalsIgnoreCase(newStatus)) {
                parcel.setIsAcquired(true);
                parcel.setAcquisitionDate(LocalDateTime.now().format(DATE_FORMATTER));
            }
            landParcelRepository.save(parcel);
        }

        String action = (String) payload.getOrDefault("action", "UPDATE_STATUS");
        String remarks = (String) payload.getOrDefault("remarks", "Acquisition status updated by CALA / District Magistrate.");

        auditLogRepository.save(new AuditLog(
                officerEmail,
                "DISTRICT_ACQUISITION_" + action,
                "LandParcel",
                caseId,
                "District Authority updated Case " + caseId + ". Action: " + action + ". Remarks: " + remarks
        ));

        if ("FORWARD_TO_STATE".equalsIgnoreCase(action)) {
            Notification notif = new Notification();
            notif.setNotificationId("NOTIF-ACQ-" + System.currentTimeMillis());
            notif.setType("ACQUISITION_FORWARDED");
            notif.setTitle("Section 19 Notification Forwarded: " + caseId);
            notif.setMessage("Collectorate forwarded statutory acquisition proposal for state gazette publication: " + remarks);
            notif.setTargetRole("STATE_GOVERNMENT");
            notif.setRelatedCaseId(caseId);
            notificationRepository.save(notif);
        }

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Acquisition status and statutory order updated successfully.");
        res.put("caseId", caseId);
        res.put("status", parcel != null ? parcel.getStatus() : payload.get("status"));
        return res;
    }

    public Map<String, Object> addAcquisitionRemark(String caseId, Map<String, Object> payload, String officerEmail) {
        LandParcel parcel = findParcelByCaseOrKhasra(caseId);
        String remark = (String) payload.getOrDefault("remark", "");
        if (parcel != null) {
            String existing = parcel.getRevenueOfficerNotes() != null ? parcel.getRevenueOfficerNotes() + " | " : "";
            parcel.setRevenueOfficerNotes(existing + "[CALA " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) + "]: " + remark);
            landParcelRepository.save(parcel);
        }

        auditLogRepository.save(new AuditLog(
                officerEmail,
                "DISTRICT_ACQUISITION_REMARK_ADDED",
                "LandParcel",
                caseId,
                "District CALA added remark on Case " + caseId + ": " + remark
        ));

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "District CALA remark recorded in permanent case ledger.");
        return res;
    }

    /**
     * 6.1 Update Compensation Status & Expedite
     */
    public Map<String, Object> updateCompensationStatus(String caseId, Map<String, Object> payload, String officerEmail) {
        LandParcel parcel = findParcelByCaseOrKhasra(caseId);
        String status = (String) payload.getOrDefault("status", "DISBURSED");
        String remarks = (String) payload.getOrDefault("remarks", "PFMS Direct Benefit Transfer approved by Collectorate.");

        if (parcel != null) {
            parcel.setPaymentStatus(status);
            if ("DISBURSED".equalsIgnoreCase(status) || "PAID".equalsIgnoreCase(status)) {
                parcel.setPaymentDate(LocalDateTime.now().format(DATE_FORMATTER));
                parcel.setPaymentUtr("PFMS-AGR-" + System.currentTimeMillis());
            }
            landParcelRepository.save(parcel);
        }

        auditLogRepository.save(new AuditLog(
                officerEmail,
                "DISTRICT_COMPENSATION_UPDATED",
                "Compensation",
                caseId,
                "District Authority updated compensation status for " + caseId + " to " + status + ". Remarks: " + remarks
        ));

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Compensation processing status updated successfully.");
        res.put("paymentStatus", status);
        return res;
    }

    /**
     * 7.1 Update R&R Status
     */
    public Map<String, Object> updateRnRStatus(String caseId, Map<String, Object> payload, String officerEmail) {
        String status = (String) payload.getOrDefault("status", "PLOT_ALLOCATED");
        String remarks = (String) payload.getOrDefault("remarks", "R&R entitlements validated under 2nd Schedule RFCTLARR.");

        auditLogRepository.save(new AuditLog(
                officerEmail,
                "DISTRICT_RNR_STATUS_UPDATED",
                "RnRBenefit",
                caseId,
                "District Authority updated R&R entitlement status for " + caseId + " to " + status + ". Remarks: " + remarks
        ));

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Rehabilitation & Resettlement entitlement status updated.");
        res.put("rnrStatus", status);
        return res;
    }

    /**
     * 5.1 Disputes & Objections Add & Review
     */
    public Map<String, Object> addDispute(Map<String, Object> payload, String officerEmail) {
        String disputeId = "DISP-" + System.currentTimeMillis();
        Objection obj = new Objection();
        obj.setObjectionId(disputeId);
        obj.setClaimantName((String) payload.getOrDefault("claimantName", "Citizen Claimant"));
        obj.setKhasraNumber((String) payload.getOrDefault("khasraNumber", "101"));
        obj.setObjectionType((String) payload.getOrDefault("disputeType", "Valuation / Title Dispute"));
        obj.setDescription((String) payload.getOrDefault("description", "Dispute registered by District Authority"));
        obj.setStatus("PENDING_HEARING");
        obj.setCreatedAt(LocalDateTime.now());
        objectionRepository.save(obj);

        auditLogRepository.save(new AuditLog(
                officerEmail,
                "DISTRICT_DISPUTE_REGISTERED",
                "Objection",
                disputeId,
                "District Authority registered Dispute " + disputeId + " for Khasra #" + obj.getKhasraNumber()
        ));

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Dispute case registered in Quasi-Judicial Collectorate registry.");
        res.put("disputeId", disputeId);
        return res;
    }

    public Map<String, Object> reviewDispute(String disputeId, Map<String, Object> payload, String officerEmail) {
        Optional<Objection> opt = objectionRepository.findByObjectionId(disputeId);
        String action = (String) payload.getOrDefault("action", "RESOLVE"); // RESOLVE, FORWARD_TRIBUNAL, ESCALATE_STATE
        String remarks = (String) payload.getOrDefault("remarks", "Collectorate statutory determination passed.");

        if (opt.isPresent()) {
            Objection obj = opt.get();
            if ("RESOLVE".equalsIgnoreCase(action)) {
                obj.setStatus("RESOLVED");
                obj.setAuthorityOrder(remarks);
            } else if ("FORWARD_TRIBUNAL".equalsIgnoreCase(action)) {
                obj.setStatus("FORWARDED_TO_TRIBUNAL");
                obj.setAuthorityOrder("Referred to Land Acquisition, Rehabilitation and Resettlement Authority (LARRA) under Section 64. Remarks: " + remarks);
            } else if ("ESCALATE_STATE".equalsIgnoreCase(action)) {
                obj.setStatus("ESCALATED_TO_STATE");
                obj.setAuthorityOrder("Escalated to State Revenue Board for policy clarification. Remarks: " + remarks);
            }
            objectionRepository.save(obj);
        }

        auditLogRepository.save(new AuditLog(
                officerEmail,
                "DISTRICT_DISPUTE_" + action,
                "Objection",
                disputeId,
                "District Authority reviewed Dispute " + disputeId + ". Action: " + action + ". Remarks: " + remarks
        ));

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Dispute determination recorded and forwarded according to statutory protocol.");
        return res;
    }

    /**
     * 11.1 Action Delayed Cases Beyond SLA
     */
    public Map<String, Object> actionDelayedCase(String caseId, Map<String, Object> payload, String officerEmail) {
        String actionType = (String) payload.getOrDefault("actionType", "ISSUE_NOTICE"); // ISSUE_NOTICE, ESCALATE_DM, DIRECTIVE
        String remarks = (String) payload.getOrDefault("remarks", "Expedited notice issued under Section 11(5) SLA guideline.");

        auditLogRepository.save(new AuditLog(
                officerEmail,
                "DISTRICT_DELAY_ACTION_" + actionType,
                "DelayedCase",
                caseId,
                "District Authority executed delay mitigation action for " + caseId + ". Action: " + actionType + ". Remarks: " + remarks
        ));

        Notification notif = new Notification();
        notif.setNotificationId("NOTIF-DLY-" + System.currentTimeMillis());
        notif.setType("DELAY_EXPEDITE_NOTICE");
        notif.setTitle("Expedite Notice Issued: " + caseId);
        notif.setMessage("District Collectorate issued SLA compliance directive: " + remarks);
        notif.setTargetRole("REVENUE_OFFICER");
        notif.setRelatedCaseId(caseId);
        notificationRepository.save(notif);

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Delay mitigation action executed and statutory reminder notice dispatched.");
        return res;
    }

    /**
     * 9.1 Update Coordination Status
     */
    public Map<String, Object> updateCoordinationStatus(String coordinationId, Map<String, Object> payload, String officerEmail) {
        for (Map<String, Object> c : coordinationStore) {
            if (coordinationId.equals(c.get("id"))) {
                if (payload.containsKey("status")) c.put("status", payload.get("status"));
                if (payload.containsKey("remarks")) c.put("remarks", payload.get("remarks"));
                if (payload.containsKey("deadline")) c.put("deadline", payload.get("deadline"));
                break;
            }
        }

        auditLogRepository.save(new AuditLog(
                officerEmail,
                "DISTRICT_COORDINATION_UPDATED",
                "Coordination",
                coordinationId,
                "Coordination Request " + coordinationId + " updated. Status: " + payload.getOrDefault("status", "N/A")
        ));

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Inter-department coordination status updated successfully.");
        return res;
    }



    /**
     * 12.1 Generate Management Reports
     */
    public Map<String, Object> generateDistrictReport(Map<String, Object> payload, String officerEmail) {
        String reportType = (String) payload.getOrDefault("reportType", "MONTHLY_ACQUISITION_SUMMARY");
        String district = (String) payload.getOrDefault("district", "Agra");

        auditLogRepository.save(new AuditLog(
                officerEmail,
                "DISTRICT_REPORT_GENERATED",
                "Report",
                reportType,
                "District Collectorate compiled official " + reportType + " report for " + district + "."
        ));

        Map<String, Object> rep = new LinkedHashMap<>();
        rep.put("reportId", "REP-AGR-" + System.currentTimeMillis());
        rep.put("reportType", reportType);
        rep.put("district", district);
        rep.put("state", "Uttar Pradesh");
        rep.put("totalLandAcquiredAcre", 142.50);
        rep.put("totalDisbursedCr", 136.95);
        rep.put("totalBeneficiaries", 420);
        rep.put("clearanceRate", "86.2%");
        rep.put("officerSignoff", "Dr. Sunita Murthy, IAS (District Magistrate)");
        rep.put("generatedAt", LocalDateTime.now().format(DATE_FORMATTER));
        return rep;
    }

    public Map<String, Object> getReports(String district) {
        Map<String, Object> rep = new LinkedHashMap<>();
        rep.put("district", district != null ? district : "Agra");
        rep.put("totalLandAcquiredAcre", 142.50);
        rep.put("totalDisbursedCr", 136.95);
        rep.put("totalBeneficiaries", 420);
        rep.put("clearanceRate", "86.2%");
        rep.put("generatedAt", LocalDateTime.now().format(DATE_FORMATTER));
        return rep;
    }

    /**
     * 13.1 Official Gazette Documents & Orders
     */
    public List<Map<String, Object>> getDocuments(String district) {
        return documentsStore;
    }

    public Map<String, Object> uploadDistrictDocument(Map<String, Object> payload, String officerEmail) {
        String docId = "DOC-00" + (documentsStore.size() + 1);
        Map<String, Object> doc = new LinkedHashMap<>();
        doc.put("id", docId);
        doc.put("name", payload.getOrDefault("name", "District Gazette Notification"));
        doc.put("type", payload.getOrDefault("type", "Statutory Notification"));
        doc.put("format", payload.getOrDefault("format", "PDF"));
        doc.put("size", payload.getOrDefault("size", "2.8 MB"));
        doc.put("date", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        doc.put("status", payload.getOrDefault("status", "PUBLISHED"));
        doc.put("uploader", officerEmail != null ? officerEmail : "District Magistrate");
        documentsStore.add(0, doc);

        auditLogRepository.save(new AuditLog(
                officerEmail,
                "DISTRICT_DOCUMENT_UPLOADED",
                "Document",
                docId,
                "Official Document " + doc.get("name") + " uploaded to district repository."
        ));

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Document published to district repository successfully.");
        res.put("id", docId);
        return res;
    }

    /**
     * 14. Land & Parcel District Remarks
     */
    public Map<String, Object> addLandRemark(String parcelId, Map<String, Object> payload, String officerEmail) {
        String remark = (String) payload.getOrDefault("remark", "");
        String noteType = (String) payload.getOrDefault("noteType", "DISTRICT_OBSERVATION");

        Map<String, Object> entry = new LinkedHashMap<>();
        entry.put("id", "REM-" + System.currentTimeMillis());
        entry.put("parcelId", parcelId);
        entry.put("remark", remark);
        entry.put("noteType", noteType);
        entry.put("officer", "Dr. Sunita Murthy, IAS (DM Agra)");
        entry.put("timestamp", LocalDateTime.now().format(DATE_FORMATTER));

        parcelRemarksStore.computeIfAbsent(parcelId, k -> new ArrayList<>()).add(0, entry);

        auditLogRepository.save(new AuditLog(
                officerEmail,
                "DISTRICT_LAND_REMARK_ADDED",
                "LandParcel",
                parcelId,
                "District CALA observation attached to Parcel " + parcelId + ": " + remark
        ));

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "District CALA observation attached to parcel record.");
        res.put("entry", entry);
        return res;
    }

    public List<Map<String, Object>> getLandRemarks(String parcelId) {
        return parcelRemarksStore.getOrDefault(parcelId, Collections.emptyList());
    }

    /**
     * 15. Notifications
     */
    public List<Notification> getNotifications(String district) {
        return notificationRepository.findByTargetRoleOrderByCreatedAtDesc("DISTRICT_AUTHORITY");
    }

    /**
     * 16. Forensic Audit Trail
     */
    public List<AuditLog> getAuditTrail(String district) {
        return auditLogRepository.findTop50ByOrderByTimestampDesc();
    }

    /**
     * 17. Profile
     */
    public Map<String, Object> getProfile(String email) {
        Map<String, Object> prof = new LinkedHashMap<>();
        prof.put("name", "Dr. Sunita Murthy, IAS");
        prof.put("email", email != null ? email : "district.officer@bhoomisetu.gov.in");
        prof.put("mobile", "+91 562 226 0001");
        prof.put("role", "DISTRICT_MAGISTRATE");
        prof.put("designation", "District Magistrate & Collector / Competent Authority (CALA)");
        prof.put("department", "Office of the District Magistrate & Collectorate, Agra");
        prof.put("district", "Agra");
        prof.put("state", "Uttar Pradesh");
        prof.put("employeeId", "IAS-UP-2012-0044");
        prof.put("jurisdiction", "Entire District Agra (5 Tehsils: Sadar, Fatehabad, Bah, Etmadpur, Kheragarh)");
        prof.put("assignedProjects", List.of("PRJ-001", "PRJ-002", "PRJ-003", "PRJ-004", "PRJ-005"));
        prof.put("permissions", List.of(
                "VIEW_DASHBOARD", "VIEW_PROJECTS", "VIEW_ACQUISITION", "VIEW_GIS", "VIEW_LAND",
                "VIEW_DISPUTES", "VIEW_COMPENSATION", "VIEW_R_AND_R", "VIEW_OFFICERS",
                "VIEW_COORDINATION", "MANAGE_COORDINATION", "VIEW_ESCALATIONS", "MANAGE_ESCALATIONS",
                "VIEW_DELAYED_CASES", "VIEW_REPORTS", "VIEW_DOCUMENTS", "VIEW_NOTIFICATIONS"
        ));
        return prof;
    }
}
