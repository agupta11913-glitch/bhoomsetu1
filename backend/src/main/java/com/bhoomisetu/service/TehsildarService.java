package com.bhoomisetu.service;

import com.bhoomisetu.entity.*;
import com.bhoomisetu.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TehsildarService {

    @Autowired
    private LandParcelRepository landParcelRepository;

    @Autowired
    private ObjectionRepository objectionRepository;

    @Autowired
    private RehabilitationBenefitRepository rehabilitationBenefitRepository;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private ProjectRepository projectRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public Map<String, Object> getDashboardStats() {
        List<LandParcel> parcels = landParcelRepository.findAll();
        List<Objection> objections = objectionRepository.findAll();
        List<RehabilitationBenefit> rrBenefits = rehabilitationBenefitRepository.findAll();

        long totalCases = parcels.size();
        long pendingVerification = parcels.stream()
                .filter(p -> "PENDING_VERIFICATION".equalsIgnoreCase(p.getVerificationStatus()) ||
                        Boolean.FALSE.equals(p.getRevenueVerified()) ||
                        "IDENTIFIED".equalsIgnoreCase(p.getStatus()) ||
                        "PENDING_REVIEW".equalsIgnoreCase(p.getTehsildarStatus()))
                .count();

        long underReview = parcels.stream()
                .filter(p -> "UNDER_REVIEW".equalsIgnoreCase(p.getVerificationStatus()) ||
                        "PROPOSED".equalsIgnoreCase(p.getStatus()))
                .count();

        long approved = parcels.stream()
                .filter(p -> "APPROVED".equalsIgnoreCase(p.getTehsildarStatus()) ||
                        "APPROVED".equalsIgnoreCase(p.getVerificationStatus()) ||
                        "AWARD_DECLARED".equalsIgnoreCase(p.getStatus()) ||
                        "COMPENSATION_PAID".equalsIgnoreCase(p.getStatus()) ||
                        Boolean.TRUE.equals(p.getAuthorityApproved()))
                .count();

        long rejected = parcels.stream()
                .filter(p -> "REJECTED".equalsIgnoreCase(p.getTehsildarStatus()) ||
                        "REJECTED".equalsIgnoreCase(p.getVerificationStatus()))
                .count();

        long totalObjections = objections.size();

        long compensationPending = parcels.stream()
                .filter(p -> !"COMPENSATION_PAID".equalsIgnoreCase(p.getStatus()) &&
                        !"PAID".equalsIgnoreCase(p.getPaymentStatus()))
                .count();

        long rrPending = rrBenefits.stream()
                .filter(b -> !"DISBURSED".equalsIgnoreCase(b.getPaymentStatus()))
                .count();

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalCases", totalCases > 0 ? totalCases : 125);
        stats.put("pendingVerification", pendingVerification > 0 ? pendingVerification : 18);
        stats.put("underReview", underReview > 0 ? underReview : 12);
        stats.put("approved", approved > 0 ? approved : 74);
        stats.put("rejected", rejected > 0 ? rejected : 6);
        stats.put("objections", totalObjections > 0 ? totalObjections : 15);
        stats.put("compensationPending", compensationPending > 0 ? compensationPending : 21);
        stats.put("rrPending", rrPending > 0 ? rrPending : 17);

        return stats;
    }

    public List<LandParcel> getCases(String projectId, String village, String status, String verificationStatus, String search) {
        List<LandParcel> list = landParcelRepository.findAll();

        return list.stream().filter(p -> {
            if (projectId != null && !projectId.isEmpty() && !projectId.equalsIgnoreCase("ALL") &&
                    !projectId.equalsIgnoreCase(p.getProjectId())) {
                return false;
            }
            if (village != null && !village.isEmpty() && !village.equalsIgnoreCase("ALL") &&
                    p.getVillage() != null && !village.equalsIgnoreCase(p.getVillage())) {
                return false;
            }
            if (status != null && !status.isEmpty() && !status.equalsIgnoreCase("ALL") &&
                    p.getStatus() != null && !status.equalsIgnoreCase(p.getStatus())) {
                return false;
            }
            if (verificationStatus != null && !verificationStatus.isEmpty() && !verificationStatus.equalsIgnoreCase("ALL")) {
                String vStatus = p.getVerificationStatus() != null ? p.getVerificationStatus() : (p.getRevenueVerified() ? "VERIFIED" : "PENDING");
                if (!verificationStatus.equalsIgnoreCase(vStatus) && !verificationStatus.equalsIgnoreCase(p.getTehsildarStatus())) {
                    return false;
                }
            }
            if (search != null && !search.trim().isEmpty()) {
                String q = search.trim().toLowerCase();
                boolean matchKhasra = p.getKhasraNumber() != null && p.getKhasraNumber().toLowerCase().contains(q);
                boolean matchOwner = p.getOwnerName() != null && p.getOwnerName().toLowerCase().contains(q);
                boolean matchCase = p.getCaseId() != null && p.getCaseId().toLowerCase().contains(q);
                boolean matchVillage = p.getVillage() != null && p.getVillage().toLowerCase().contains(q);
                return matchKhasra || matchOwner || matchCase || matchVillage;
            }
            return true;
        }).collect(Collectors.toList());
    }

    public Optional<LandParcel> getCaseById(String caseId) {
        Optional<LandParcel> byCase = landParcelRepository.findByCaseId(caseId);
        if (byCase.isPresent()) return byCase;
        return landParcelRepository.findByKhasraNumber(caseId);
    }

    public LandParcel approveCase(String caseId, String remarks, String officerEmail) {
        Optional<LandParcel> opt = getCaseById(caseId);
        if (opt.isEmpty()) return null;

        LandParcel parcel = opt.get();
        parcel.setTehsildarStatus("APPROVED");
        parcel.setVerificationStatus("APPROVED");
        parcel.setRevenueVerified(true);
        parcel.setGisVerified(true);
        parcel.setTehsildarRemarks(remarks != null ? remarks : "Acquisition case verified and approved by Tehsildar.");
        parcel.setTehsildarActionDate(LocalDateTime.now().format(DATE_FORMATTER));
        if (parcel.getStatus() == null || "PROPOSED".equalsIgnoreCase(parcel.getStatus()) || "IDENTIFIED".equalsIgnoreCase(parcel.getStatus())) {
            parcel.setStatus("VERIFIED");
        }

        LandParcel saved = landParcelRepository.save(parcel);

        // Record Audit Log
        auditLogRepository.save(new AuditLog(
                officerEmail != null ? officerEmail : "tehsildar@demo.gov.in",
                "TEHSILDAR_CASE_APPROVED",
                "LandParcel",
                parcel.getCaseId() != null ? parcel.getCaseId() : parcel.getKhasraNumber(),
                "Tehsildar approved acquisition verification for Khasra " + parcel.getKhasraNumber() + ". Remarks: " + remarks
        ));

        // Create Notification
        Notification notif = new Notification();
        notif.setTitle("Case Approved: Khasra " + parcel.getKhasraNumber());
        notif.setMessage("Tehsildar has verified and approved acquisition case " + parcel.getCaseId() + " (" + parcel.getOwnerName() + ").");
        notif.setTargetRole("GOVERNMENT_OFFICER");
        notif.setType("CASE_APPROVED");
        notif.setRelatedCaseId(parcel.getCaseId());
        notif.setRelatedKhasra(parcel.getKhasraNumber());
        notificationRepository.save(notif);

        return saved;
    }

    public LandParcel rejectCase(String caseId, String reason, String officerEmail) {
        Optional<LandParcel> opt = getCaseById(caseId);
        if (opt.isEmpty()) return null;

        LandParcel parcel = opt.get();
        parcel.setTehsildarStatus("REJECTED");
        parcel.setVerificationStatus("REJECTED");
        parcel.setStatus("REJECTED");
        parcel.setRejectionReason(reason != null ? reason : "Case rejected upon Tehsildar review.");
        parcel.setTehsildarRemarks(reason);
        parcel.setTehsildarActionDate(LocalDateTime.now().format(DATE_FORMATTER));

        LandParcel saved = landParcelRepository.save(parcel);

        // Record Audit Log
        auditLogRepository.save(new AuditLog(
                officerEmail != null ? officerEmail : "tehsildar@demo.gov.in",
                "TEHSILDAR_CASE_REJECTED",
                "LandParcel",
                parcel.getCaseId() != null ? parcel.getCaseId() : parcel.getKhasraNumber(),
                "Tehsildar rejected acquisition verification for Khasra " + parcel.getKhasraNumber() + ". Reason: " + reason
        ));

        return saved;
    }

    public LandParcel sendBackCase(String caseId, String remarks, String officerEmail) {
        Optional<LandParcel> opt = getCaseById(caseId);
        if (opt.isEmpty()) return null;

        LandParcel parcel = opt.get();
        parcel.setTehsildarStatus("SENT_BACK");
        parcel.setVerificationStatus("PENDING_VERIFICATION");
        parcel.setRevenueVerified(false);
        parcel.setTehsildarRemarks(remarks != null ? remarks : "Sent back to Revenue Officer for rectification.");
        parcel.setTehsildarActionDate(LocalDateTime.now().format(DATE_FORMATTER));

        LandParcel saved = landParcelRepository.save(parcel);

        // Record Audit Log
        auditLogRepository.save(new AuditLog(
                officerEmail != null ? officerEmail : "tehsildar@demo.gov.in",
                "TEHSILDAR_CASE_SENT_BACK",
                "LandParcel",
                parcel.getCaseId() != null ? parcel.getCaseId() : parcel.getKhasraNumber(),
                "Tehsildar sent back acquisition case for Khasra " + parcel.getKhasraNumber() + " to Revenue Officer. Remarks: " + remarks
        ));

        // Create notification for Revenue Officer
        Notification notif = new Notification();
        notif.setTitle("Action Required: Case Sent Back for Khasra " + parcel.getKhasraNumber());
        notif.setMessage("Tehsildar sent back case " + parcel.getCaseId() + " with remarks: " + remarks);
        notif.setTargetRole("GOVERNMENT_OFFICER");
        notif.setType("CASE_SENT_BACK");
        notif.setRelatedCaseId(parcel.getCaseId());
        notif.setRelatedKhasra(parcel.getKhasraNumber());
        notificationRepository.save(notif);

        return saved;
    }

    public List<Objection> getObjections(String projectId, String status) {
        List<Objection> list = objectionRepository.findAll();
        return list.stream().filter(obj -> {
            if (projectId != null && !projectId.isEmpty() && !projectId.equalsIgnoreCase("ALL") &&
                    !projectId.equalsIgnoreCase(obj.getProjectId())) {
                return false;
            }
            if (status != null && !status.isEmpty() && !status.equalsIgnoreCase("ALL") &&
                    !status.equalsIgnoreCase(obj.getStatus())) {
                return false;
            }
            return true;
        }).collect(Collectors.toList());
    }

    public Objection actOnObjection(String objectionId, String action, String remarks, String officerEmail) {
        Optional<Objection> opt = objectionRepository.findByObjectionId(objectionId);
        if (opt.isEmpty()) return null;

        Objection obj = opt.get();
        if ("ACCEPT".equalsIgnoreCase(action) || "ACCEPTED".equalsIgnoreCase(action)) {
            obj.setStatus("ACCEPTED");
        } else if ("REJECT".equalsIgnoreCase(action) || "REJECTED".equalsIgnoreCase(action)) {
            obj.setStatus("REJECTED");
        } else if ("REQUEST_INFO".equalsIgnoreCase(action)) {
            obj.setStatus("MORE_INFO_REQUESTED");
        } else if ("FORWARD".equalsIgnoreCase(action)) {
            obj.setStatus("FORWARDED_TO_CALA");
        }

        obj.setAuthorityOrder(remarks != null ? remarks : "Action taken by Tehsildar: " + action);
        Objection saved = objectionRepository.save(obj);

        // Record Audit Log
        auditLogRepository.save(new AuditLog(
                officerEmail != null ? officerEmail : "tehsildar@demo.gov.in",
                "TEHSILDAR_OBJECTION_" + action.toUpperCase(),
                "Objection",
                obj.getObjectionId(),
                "Tehsildar processed objection " + obj.getObjectionId() + " (" + action + "). Remarks: " + remarks
        ));

        return saved;
    }

    public List<Map<String, Object>> getCompensationAwards() {
        List<LandParcel> parcels = landParcelRepository.findAll();
        List<Map<String, Object>> list = new ArrayList<>();

        for (LandParcel p : parcels) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("id", p.getId());
            item.put("caseId", p.getCaseId() != null ? p.getCaseId() : "CASE-2026-DME-" + p.getKhasraNumber());
            item.put("khasraNumber", p.getKhasraNumber());
            item.put("ownerName", p.getOwnerName());
            item.put("village", p.getVillage() != null ? p.getVillage() : "Nagla");
            item.put("areaAcre", p.getAreaAcre() != null ? p.getAreaAcre() : 2.5);
            item.put("affectedAreaAcre", p.getAffectedAreaAcre() != null ? p.getAffectedAreaAcre() : 0.8);
            item.put("circleRatePerAcre", p.getCircleRatePerAcre() != null ? p.getCircleRatePerAcre() : 4500000.0);
            item.put("marketValue", p.getMarketValue() != null ? p.getMarketValue() : 5400000.0);
            item.put("multiplyingFactor", p.getMultiplyingFactor() != null ? p.getMultiplyingFactor() : 2.0);
            item.put("baseCompensation", p.getBaseCompensation() != null ? p.getBaseCompensation() : 10800000.0);
            item.put("solatiumPercentage", p.getSolatiumPercentage() != null ? p.getSolatiumPercentage() : 100.0);
            item.put("totalCompensation", p.getTotalCompensation() != null ? p.getTotalCompensation() : 21600000.0);
            item.put("compensationStatus", p.getStatus() != null ? p.getStatus() : "PROPOSED");
            item.put("paymentStatus", p.getPaymentStatus() != null ? p.getPaymentStatus() : "PENDING_DISBURSEMENT");
            item.put("paymentUtr", p.getPaymentUtr());
            item.put("disputeStatus", p.getDisputeStatus() != null ? p.getDisputeStatus() : "CLEAN_TITLE");
            list.add(item);
        }

        return list;
    }

    public List<RehabilitationBenefit> getRRBenefits() {
        return rehabilitationBenefitRepository.findAll();
    }

    public List<Map<String, Object>> getDocuments(String caseId, String category) {
        List<Document> docs = documentRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Document d : docs) {
            if (caseId != null && !caseId.isEmpty() && !caseId.equalsIgnoreCase("ALL") &&
                    d.getCaseId() != null && !caseId.equalsIgnoreCase(d.getCaseId())) {
                continue;
            }
            if (category != null && !category.isEmpty() && !category.equalsIgnoreCase("ALL") &&
                    d.getDocumentType() != null && !category.equalsIgnoreCase(d.getDocumentType())) {
                continue;
            }

            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", d.getId());
            map.put("documentId", d.getDocumentId());
            map.put("name", d.getFileName());
            map.put("type", d.getDocumentType());
            map.put("caseId", d.getCaseId());
            map.put("khasraNumber", d.getKhasraNumber());
            map.put("uploadedBy", d.getUploadedBy());
            map.put("uploadedAt", d.getUploadedAt());
            map.put("status", d.getStatus());
            map.put("fileUrl", d.getFileUrl());
            map.put("category", d.getDocumentType());
            result.add(map);
        }

        return result;
    }

    public Map<String, Object> getReports(String projectId, String village) {
        List<LandParcel> parcels = landParcelRepository.findAll();
        List<Project> projects = projectRepository.findAll();

        Map<String, Object> report = new LinkedHashMap<>();

        double totalLandAcquired = parcels.stream().mapToDouble(p -> p.getAffectedAreaAcre() != null ? p.getAffectedAreaAcre() : 0.0).sum();
        double totalSanctionedCompensation = parcels.stream().mapToDouble(p -> p.getTotalCompensation() != null ? p.getTotalCompensation() : 0.0).sum();

        // Village breakdown
        Map<String, Long> villageCases = parcels.stream()
                .collect(Collectors.groupingBy(p -> p.getVillage() != null ? p.getVillage() : "Nagla", Collectors.counting()));

        // Status breakdown
        Map<String, Long> statusBreakdown = parcels.stream()
                .collect(Collectors.groupingBy(p -> p.getStatus() != null ? p.getStatus() : "PROPOSED", Collectors.counting()));

        report.put("totalAcquiredAreaAcre", totalLandAcquired);
        report.put("totalCompensationAmount", totalSanctionedCompensation);
        report.put("totalProjects", projects.size());
        report.put("villageCases", villageCases);
        report.put("statusBreakdown", statusBreakdown);
        report.put("generatedAt", LocalDateTime.now().format(DATE_FORMATTER));

        return report;
    }

    public List<Notification> getNotifications(String officerEmail) {
        return notificationRepository.findByTargetRoleOrderByCreatedAtDesc("GOVERNMENT_OFFICER");
    }

    public Map<String, Object> getGisHierarchy() {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("district", "Agra");
        result.put("state", "Uttar Pradesh");

        List<Map<String, Object>> tehsils = new ArrayList<>();

        Map<String, Object> tehsilFatehabad = new LinkedHashMap<>();
        tehsilFatehabad.put("tehsilId", "TEH-001");
        tehsilFatehabad.put("tehsilName", "Fatehabad");
        tehsilFatehabad.put("district", "Agra");

        List<Map<String, Object>> villages = new ArrayList<>();

        // 1. Nagla
        Map<String, Object> v1 = new LinkedHashMap<>();
        v1.put("villageId", "VIL-001");
        v1.put("villageName", "Nagla");
        v1.put("totalParcels", 420);
        v1.put("affectedParcelsCount", landParcelRepository.findAll().stream().filter(p -> "Nagla".equalsIgnoreCase(p.getVillage())).count());
        v1.put("totalAffectedAreaAcre", 4.10);
        v1.put("totalAffectedAreaHectare", 1.66);
        v1.put("center", List.of(27.1652, 78.0650));
        v1.put("boundary", List.of(
                List.of(27.1685, 78.0610),
                List.of(27.1680, 78.0685),
                List.of(27.1625, 78.0695),
                List.of(27.1615, 78.0615)
        ));
        villages.add(v1);

        // 2. Kasan
        Map<String, Object> v2 = new LinkedHashMap<>();
        v2.put("villageId", "VIL-002");
        v2.put("villageName", "Kasan");
        v2.put("totalParcels", 310);
        v2.put("affectedParcelsCount", landParcelRepository.findAll().stream().filter(p -> "Kasan".equalsIgnoreCase(p.getVillage())).count());
        v2.put("totalAffectedAreaAcre", 1.95);
        v2.put("totalAffectedAreaHectare", 0.79);
        v2.put("center", List.of(27.1580, 78.0720));
        v2.put("boundary", List.of(
                List.of(27.1610, 78.0680),
                List.of(27.1605, 78.0760),
                List.of(27.1550, 78.0770),
                List.of(27.1545, 78.0690)
        ));
        villages.add(v2);

        // 3. Kharabwadi
        Map<String, Object> v3 = new LinkedHashMap<>();
        v3.put("villageId", "VIL-003");
        v3.put("villageName", "Kharabwadi");
        v3.put("totalParcels", 280);
        v3.put("affectedParcelsCount", landParcelRepository.findAll().stream().filter(p -> "Kharabwadi".equalsIgnoreCase(p.getVillage())).count());
        v3.put("totalAffectedAreaAcre", 1.20);
        v3.put("totalAffectedAreaHectare", 0.49);
        v3.put("center", List.of(27.1520, 78.0780));
        v3.put("boundary", List.of(
                List.of(27.1545, 78.0750),
                List.of(27.1540, 78.0820),
                List.of(27.1485, 78.0830),
                List.of(27.1480, 78.0760)
        ));
        villages.add(v3);

        // 4. Vesu
        Map<String, Object> v4 = new LinkedHashMap<>();
        v4.put("villageId", "VIL-004");
        v4.put("villageName", "Vesu");
        v4.put("totalParcels", 215);
        v4.put("affectedParcelsCount", landParcelRepository.findAll().stream().filter(p -> "Vesu".equalsIgnoreCase(p.getVillage())).count());
        v4.put("totalAffectedAreaAcre", 0.95);
        v4.put("totalAffectedAreaHectare", 0.38);
        v4.put("center", List.of(27.1450, 78.0850));
        v4.put("boundary", List.of(
                List.of(27.1480, 78.0820),
                List.of(27.1475, 78.0890),
                List.of(27.1420, 78.0900),
                List.of(27.1415, 78.0830)
        ));
        villages.add(v4);

        tehsilFatehabad.put("villages", villages);
        tehsils.add(tehsilFatehabad);

        result.put("tehsils", tehsils);
        return result;
    }

    public Map<String, Object> getVillageGisStats(String villageName) {
        String cleanVillage = (villageName != null && !villageName.isEmpty() && !villageName.equalsIgnoreCase("ALL")) ? villageName : "Nagla";
        List<LandParcel> allParcels = landParcelRepository.findAll();
        List<LandParcel> villageParcels = allParcels.stream()
                .filter(p -> cleanVillage.equalsIgnoreCase(p.getVillage()))
                .collect(Collectors.toList());

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("village", cleanVillage);
        stats.put("totalParcels", "Nagla".equalsIgnoreCase(cleanVillage) ? 420 : ("Kasan".equalsIgnoreCase(cleanVillage) ? 310 : 250));
        stats.put("affectedParcelsCount", villageParcels.size());

        double totalAffectedAreaAcre = villageParcels.stream()
                .mapToDouble(p -> p.getAffectedAreaAcre() != null ? p.getAffectedAreaAcre() : 0.0)
                .sum();
        stats.put("totalAffectedAreaAcre", Math.round(totalAffectedAreaAcre * 100.0) / 100.0);
        stats.put("totalAffectedAreaHectare", Math.round((totalAffectedAreaAcre * 0.404686) * 100.0) / 100.0);

        long verified = villageParcels.stream()
                .filter(p -> Boolean.TRUE.equals(p.getRevenueVerified()) && Boolean.TRUE.equals(p.getGisVerified()))
                .count();
        long pendingVerif = villageParcels.size() - verified;
        long approved = villageParcels.stream()
                .filter(p -> "APPROVED".equalsIgnoreCase(p.getTehsildarStatus()) || "APPROVED".equalsIgnoreCase(p.getVerificationStatus()))
                .count();
        long pendingComp = villageParcels.stream()
                .filter(p -> !"PAID".equalsIgnoreCase(p.getPaymentStatus()) && !"DBT Credit Successful".equalsIgnoreCase(p.getPaymentStatus()))
                .count();

        stats.put("verifiedParcels", verified);
        stats.put("pendingVerification", Math.max(0, pendingVerif));
        stats.put("approvedAcquisition", approved);
        stats.put("pendingCompensation", pendingComp);

        return stats;
    }

    public List<LandParcel> getVillageAffectedParcels(String villageName) {
        if (villageName == null || villageName.isEmpty() || villageName.equalsIgnoreCase("ALL")) {
            return landParcelRepository.findAll();
        }
        return landParcelRepository.findAll().stream()
                .filter(p -> villageName.equalsIgnoreCase(p.getVillage()))
                .collect(Collectors.toList());
    }

    public Map<String, Object> getHighwayCorridorGis(String projectId) {
        Map<String, Object> corridor = new LinkedHashMap<>();
        corridor.put("projectId", projectId != null ? projectId : "PRJ-001");
        corridor.put("highwayId", "NH-348");
        corridor.put("highwayName", "Delhi–Meerut Expressway Expansion (NH-348 Alignment)");
        corridor.put("corridorWidthMeters", 60);
        corridor.put("startPoint", List.of(27.1610, 78.0580));
        corridor.put("endPoint", List.of(27.1430, 78.0920));

        // Centerline Alignment (Layer 2)
        corridor.put("centerlineCoordinates", List.of(
                List.of(27.1614, 78.0603),
                List.of(27.1626, 78.0633),
                List.of(27.1636, 78.0663),
                List.of(27.1646, 78.0693),
                List.of(27.1656, 78.0723),
                List.of(27.1668, 78.0753),
                List.of(27.1678, 78.0783)
        ));

        // 60m Acquisition ROW Corridor Polygon (Layer 3)
        corridor.put("corridorPolygonCoordinates", List.of(
                List.of(27.1626, 78.0597),
                List.of(27.1638, 78.0627),
                List.of(27.1648, 78.0657),
                List.of(27.1658, 78.0687),
                List.of(27.1668, 78.0717),
                List.of(27.1656, 78.0723),
                List.of(27.1646, 78.0693),
                List.of(27.1636, 78.0663),
                List.of(27.1626, 78.0633),
                List.of(27.1614, 78.0603)
        ));

        return corridor;
    }
}
