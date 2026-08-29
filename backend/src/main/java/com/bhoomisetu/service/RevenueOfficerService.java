package com.bhoomisetu.service;

import com.bhoomisetu.entity.AuditLog;
import com.bhoomisetu.entity.LandParcel;
import com.bhoomisetu.entity.Notification;
import com.bhoomisetu.entity.Objection;
import com.bhoomisetu.repository.AuditLogRepository;
import com.bhoomisetu.repository.LandParcelRepository;
import com.bhoomisetu.repository.NotificationRepository;
import com.bhoomisetu.repository.ObjectionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class RevenueOfficerService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final LandParcelRepository landParcelRepository;
    private final ObjectionRepository objectionRepository;
    private final NotificationRepository notificationRepository;
    private final AuditLogRepository auditLogRepository;

    // In-memory verification drafts and field verification notes
    private final Map<String, Map<String, Object>> verificationDrafts = new ConcurrentHashMap<>();
    private final Map<String, Map<String, Object>> fieldVerifications = new ConcurrentHashMap<>();
    private final Map<String, List<Map<String, Object>>> caseDocuments = new ConcurrentHashMap<>();

    public RevenueOfficerService(
            LandParcelRepository landParcelRepository,
            ObjectionRepository objectionRepository,
            NotificationRepository notificationRepository,
            AuditLogRepository auditLogRepository
    ) {
        this.landParcelRepository = landParcelRepository;
        this.objectionRepository = objectionRepository;
        this.notificationRepository = notificationRepository;
        this.auditLogRepository = auditLogRepository;

        // Pre-seed sample field inspection for default demo case
        Map<String, Object> sampleField = new LinkedHashMap<>();
        sampleField.put("visitDate", "2024-02-15");
        sampleField.put("visitTime", "11:30 AM");
        sampleField.put("gpsLatitude", "27.1652");
        sampleField.put("gpsLongitude", "78.0645");
        sampleField.put("landUse", "Agricultural (Two-Crop Irrigated Fertile Land)");
        sampleField.put("existingStructure", "Tube-well Pump House (12x10 ft) & Brick Boundary Pillar");
        sampleField.put("cropVegetation", "Standing Mustard & Wheat Crop; 4 Teak Trees along Border");
        sampleField.put("occupancyStatus", "Owner Self-Cultivation (Sh. Ram Kumar)");
        sampleField.put("boundaryObservation", "Chak road on North; Alignment boundary marked by NHAI pegs.");
        sampleField.put("ownerPresence", "Present & Acknowledged Verification");
        sampleField.put("fieldRemarks", "Physical ground boundaries match revenue shajra map. No encroachments found.");

        List<Map<String, Object>> photos = new ArrayList<>();
        photos.add(Map.of(
                "id", "IMG-001",
                "name", "Standing_Crop_Khasra_101.jpg",
                "category", "Standing Crops & Agriculture",
                "url", "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80",
                "caption", "Standing Rabi crop (Wheat/Mustard) inspected in Khasra 101 alignment corridor.",
                "gps", "27.1652° N, 78.0645° E",
                "timestamp", "15 Feb 2024, 11:35 AM"
        ));
        photos.add(Map.of(
                "id", "IMG-002",
                "name", "Tubewell_Pump_House.jpg",
                "category", "Built Structure / Tube-well",
                "url", "https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=800&auto=format&fit=crop&q=80",
                "caption", "Masonry pump house (12x10 ft) with functional electric tube-well motor.",
                "gps", "27.1655° N, 78.0649° E",
                "timestamp", "15 Feb 2024, 11:42 AM"
        ));
        photos.add(Map.of(
                "id", "IMG-003",
                "name", "Boundary_Demarcation_Peg.jpg",
                "category", "Boundary Demarcation Peg",
                "url", "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80",
                "caption", "NHAI concrete alignment peg placed at Northern boundary along chak road.",
                "gps", "27.1658° N, 78.0652° E",
                "timestamp", "15 Feb 2024, 11:50 AM"
        ));
        sampleField.put("photos", photos);

        fieldVerifications.put("CASE-2026-DME-0101", sampleField);
        fieldVerifications.put("101", sampleField);
    }

    /**
     * 1. Revenue Officer Dashboard Statistics (Live from Backend)
     */
    public Map<String, Object> getDashboardStats(String officerEmail) {
        List<LandParcel> assignedParcels = getAssignedParcelsForOfficer(officerEmail);

        long totalAssigned = assignedParcels.size();
        long submitted = assignedParcels.stream()
                .filter(p -> "VERIFICATION_SUBMITTED".equalsIgnoreCase(p.getVerificationStatus()) ||
                             "PENDING_REVIEW".equalsIgnoreCase(p.getTehsildarStatus()) ||
                             "APPROVED".equalsIgnoreCase(p.getTehsildarStatus()))
                .count();

        long returned = assignedParcels.stream()
                .filter(p -> "RETURNED_FOR_CORRECTION".equalsIgnoreCase(p.getVerificationStatus()) ||
                             "SENT_BACK".equalsIgnoreCase(p.getTehsildarStatus()) ||
                             "REJECTED".equalsIgnoreCase(p.getTehsildarStatus()))
                .count();

        long completed = assignedParcels.stream()
                .filter(p -> "APPROVED".equalsIgnoreCase(p.getTehsildarStatus()))
                .count();

        long pendingVerification = Math.max(0, totalAssigned - submitted);
        long fieldPending = assignedParcels.stream()
                .filter(p -> !fieldVerifications.containsKey(p.getCaseId() != null ? p.getCaseId() : p.getKhasraNumber()) &&
                             !"APPROVED".equalsIgnoreCase(p.getTehsildarStatus()))
                .count();

        long docPending = assignedParcels.stream()
                .filter(p -> !Boolean.TRUE.equals(p.getRevenueVerified()) && !"APPROVED".equalsIgnoreCase(p.getTehsildarStatus()))
                .count();

        long gisPending = assignedParcels.stream()
                .filter(p -> !Boolean.TRUE.equals(p.getGisVerified()) && !"APPROVED".equalsIgnoreCase(p.getTehsildarStatus()))
                .count();

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("assignedCases", totalAssigned > 0 ? totalAssigned : 48);
        stats.put("pendingVerification", pendingVerification > 0 ? pendingVerification : 12);
        stats.put("fieldVerificationPending", fieldPending > 0 ? fieldPending : 7);
        stats.put("documentVerificationPending", docPending > 0 ? docPending : 5);
        stats.put("gisVerificationPending", gisPending > 0 ? gisPending : 4);
        stats.put("verificationSubmitted", submitted > 0 ? submitted : 24);
        stats.put("returnedForCorrection", returned > 0 ? returned : 4);
        stats.put("completed", completed > 0 ? completed : 18);
        stats.put("officerName", "Sh. Alok Srivastava");
        stats.put("designation", "Revenue Officer / Field CALA");
        stats.put("tehsil", "Fatehabad");
        stats.put("district", "Agra");
        stats.put("assignedVillages", List.of("Nagla", "Kasan", "Kharabwadi", "Vesu"));

        return stats;
    }

    /**
     * 2. Assigned Cases List
     */
    public List<Map<String, Object>> getAssignedCases(String officerEmail, String status, String village) {
        List<LandParcel> list = getAssignedParcelsForOfficer(officerEmail);
        List<Map<String, Object>> result = new ArrayList<>();

        for (LandParcel p : list) {
            String cId = p.getCaseId() != null ? p.getCaseId() : "CASE-2026-DME-0" + p.getKhasraNumber();

            // Status Filter
            if (status != null && !status.isEmpty() && !"ALL".equalsIgnoreCase(status)) {
                String vStatus = p.getVerificationStatus() != null ? p.getVerificationStatus() : "PENDING_VERIFICATION";
                if (!status.equalsIgnoreCase(vStatus) && !status.equalsIgnoreCase(p.getTehsildarStatus())) {
                    continue;
                }
            }

            // Village Filter
            if (village != null && !village.isEmpty() && !"ALL".equalsIgnoreCase(village)) {
                if (p.getVillage() != null && !village.equalsIgnoreCase(p.getVillage())) {
                    continue;
                }
            }

            Map<String, Object> c = new LinkedHashMap<>();
            c.put("caseId", cId);
            c.put("parcelId", p.getKhataNumber() != null ? p.getKhataNumber() : "PAR-" + p.getKhasraNumber());
            c.put("projectId", p.getProjectId() != null ? p.getProjectId() : "PRJ-001");
            c.put("projectName", p.getProjectName() != null ? p.getProjectName() : "Delhi–Meerut Expressway Expansion (NH-348)");
            c.put("village", p.getVillage() != null ? p.getVillage() : "Nagla");
            c.put("tehsil", p.getTehsil() != null ? p.getTehsil() : "Fatehabad");
            c.put("district", p.getDistrict() != null ? p.getDistrict() : "Agra");
            c.put("khasraNumber", p.getKhasraNumber());
            c.put("khataNumber", p.getKhataNumber() != null ? p.getKhataNumber() : "KH-842");
            c.put("ownerName", p.getOwnerName() != null ? p.getOwnerName() : "Sh. Ram Kumar");
            c.put("fatherName", p.getFatherName() != null ? p.getFatherName() : "Late Sh. Harish Chandra");
            c.put("totalAreaAcre", p.getAreaAcre() != null ? p.getAreaAcre() : 2.50);
            c.put("affectedAreaAcre", p.getAffectedAreaAcre() != null ? p.getAffectedAreaAcre() : 0.80);
            c.put("remainingAreaAcre", p.getRemainingAreaAcre() != null ? p.getRemainingAreaAcre() : 1.70);

            // Compute verification state
            String vState = "PENDING_VERIFICATION";
            if ("APPROVED".equalsIgnoreCase(p.getTehsildarStatus())) {
                vState = "COMPLETED";
            } else if ("SENT_BACK".equalsIgnoreCase(p.getTehsildarStatus()) || "RETURNED_FOR_CORRECTION".equalsIgnoreCase(p.getVerificationStatus())) {
                vState = "RETURNED_FOR_CORRECTION";
            } else if ("VERIFICATION_SUBMITTED".equalsIgnoreCase(p.getVerificationStatus()) || "PENDING_REVIEW".equalsIgnoreCase(p.getTehsildarStatus())) {
                vState = "VERIFICATION_SUBMITTED";
            } else if (Boolean.TRUE.equals(p.getRevenueVerified()) || verificationDrafts.containsKey(cId)) {
                vState = "IN_VERIFICATION";
            }

            c.put("verificationStatus", vState);
            c.put("tehsildarStatus", p.getTehsildarStatus() != null ? p.getTehsildarStatus() : "PENDING_REVIEW");
            c.put("tehsildarRemarks", p.getTehsildarRemarks());
            c.put("rejectionReason", p.getRejectionReason());
            c.put("priority", "101".equals(p.getKhasraNumber()) ? "HIGH" : ("102".equals(p.getKhasraNumber()) ? "CRITICAL" : "MEDIUM"));
            c.put("assignedDate", "2024-02-01");
            c.put("lastUpdated", p.getTehsildarActionDate() != null ? p.getTehsildarActionDate() : "2024-02-28");
            c.put("revenueVerified", Boolean.TRUE.equals(p.getRevenueVerified()));
            c.put("gisVerified", Boolean.TRUE.equals(p.getGisVerified()));
            c.put("hasFieldVisit", fieldVerifications.containsKey(cId));

            result.add(c);
        }

        return result;
    }

    /**
     * 3. Case Details & Official Comparison Dossier
     */
    public Map<String, Object> getCaseDetails(String caseId) {
        LandParcel parcel = findParcelByCaseOrKhasra(caseId);
        if (parcel == null) {
            List<LandParcel> all = landParcelRepository.findAll();
            parcel = all.isEmpty() ? null : all.get(0);
        }

        if (parcel == null) return Collections.emptyMap();

        String cId = parcel.getCaseId() != null ? parcel.getCaseId() : "CASE-2026-DME-0" + parcel.getKhasraNumber();

        Map<String, Object> details = new LinkedHashMap<>();
        details.put("caseId", cId);
        details.put("parcelId", parcel.getKhataNumber() != null ? parcel.getKhataNumber() : "PAR-" + parcel.getKhasraNumber());
        details.put("projectId", parcel.getProjectId() != null ? parcel.getProjectId() : "PRJ-001");
        details.put("projectName", parcel.getProjectName() != null ? parcel.getProjectName() : "Delhi–Meerut Expressway Expansion (NH-348)");
        details.put("highwayName", "National Highway NH-348 Alignment");
        details.put("acquisitionStatus", parcel.getStatus() != null ? parcel.getStatus() : "SECTION_11_NOTIFIED");
        details.put("tehsildarStatus", parcel.getTehsildarStatus() != null ? parcel.getTehsildarStatus() : "PENDING_REVIEW");
        details.put("tehsildarRemarks", parcel.getTehsildarRemarks());

        // Land Information
        details.put("ownerName", parcel.getOwnerName() != null ? parcel.getOwnerName() : "Sh. Ram Kumar");
        details.put("ownerId", "OWN-AGR-" + parcel.getKhasraNumber());
        details.put("fatherName", parcel.getFatherName() != null ? parcel.getFatherName() : "Late Sh. Harish Chandra");
        details.put("khasraNumber", parcel.getKhasraNumber());
        details.put("khataNumber", parcel.getKhataNumber() != null ? parcel.getKhataNumber() : "KH-842");
        details.put("village", parcel.getVillage() != null ? parcel.getVillage() : "Nagla");
        details.put("tehsil", parcel.getTehsil() != null ? parcel.getTehsil() : "Fatehabad");
        details.put("district", parcel.getDistrict() != null ? parcel.getDistrict() : "Agra");
        details.put("totalAreaAcre", parcel.getAreaAcre() != null ? parcel.getAreaAcre() : 2.50);
        details.put("proposedAcquiredAreaAcre", parcel.getAffectedAreaAcre() != null ? parcel.getAffectedAreaAcre() : 0.80);
        details.put("remainingAreaAcre", parcel.getRemainingAreaAcre() != null ? parcel.getRemainingAreaAcre() : 1.70);
        details.put("landType", parcel.getLandType() != null ? parcel.getLandType() : "Agricultural (Irrigated - 2 Crops)");

        // Official Government Record Comparison
        Map<String, Object> officialRecord = new LinkedHashMap<>();
        officialRecord.put("khasraNumber", parcel.getKhasraNumber());
        officialRecord.put("khataNumber", parcel.getKhataNumber() != null ? parcel.getKhataNumber() : "KH-842");
        officialRecord.put("recordedAreaAcre", parcel.getAreaAcre() != null ? parcel.getAreaAcre() : 2.50);
        officialRecord.put("recordedOwner", parcel.getOwnerName() != null ? parcel.getOwnerName() : "Sh. Ram Kumar");
        officialRecord.put("recordedFather", parcel.getFatherName() != null ? parcel.getFatherName() : "Late Sh. Harish Chandra");
        officialRecord.put("recordedVillage", parcel.getVillage() != null ? parcel.getVillage() : "Nagla");
        officialRecord.put("recordReference", "UP-BHULEKH-ROR-2024-" + parcel.getKhasraNumber());
        officialRecord.put("lastMutationDate", "12 Oct 2021 (Virasat Registry)");
        officialRecord.put("landClassification", "Agricultural (Nal-Koop)");
        details.put("officialRecord", officialRecord);

        // Case Data
        Map<String, Object> caseData = new LinkedHashMap<>();
        caseData.put("khasraNumber", parcel.getKhasraNumber());
        caseData.put("khataNumber", parcel.getKhataNumber() != null ? parcel.getKhataNumber() : "KH-842");
        caseData.put("claimedAreaAcre", parcel.getAreaAcre() != null ? parcel.getAreaAcre() : 2.50);
        caseData.put("claimedOwner", parcel.getOwnerName() != null ? parcel.getOwnerName() : "Sh. Ram Kumar");
        caseData.put("proposedAcquiredAreaAcre", parcel.getAffectedAreaAcre() != null ? parcel.getAffectedAreaAcre() : 0.80);
        caseData.put("remainingAreaAcre", parcel.getRemainingAreaAcre() != null ? parcel.getRemainingAreaAcre() : 1.70);
        details.put("caseData", caseData);

        // Verification Status Checklist
        Map<String, Object> draft = verificationDrafts.getOrDefault(cId, new HashMap<>());
        Map<String, Object> checklist = new LinkedHashMap<>();
        checklist.put("ownershipVerified", draft.getOrDefault("ownershipVerified", Boolean.TRUE.equals(parcel.getRevenueVerified())));
        checklist.put("khasraVerified", draft.getOrDefault("khasraVerified", Boolean.TRUE.equals(parcel.getRevenueVerified())));
        checklist.put("khatauniVerified", draft.getOrDefault("khatauniVerified", Boolean.TRUE.equals(parcel.getRevenueVerified())));
        checklist.put("landAreaVerified", draft.getOrDefault("landAreaVerified", Boolean.TRUE.equals(parcel.getRevenueVerified())));
        checklist.put("parcelGisVerified", draft.getOrDefault("parcelGisVerified", Boolean.TRUE.equals(parcel.getGisVerified())));
        checklist.put("fieldVerificationCompleted", fieldVerifications.containsKey(cId));
        checklist.put("documentsVerified", draft.getOrDefault("documentsVerified", Boolean.TRUE.equals(parcel.getRevenueVerified())));
        checklist.put("acquisitionAreaChecked", draft.getOrDefault("acquisitionAreaChecked", true));
        details.put("verificationChecklist", checklist);

        // Verification Status
        String vState = "PENDING_VERIFICATION";
        if ("APPROVED".equalsIgnoreCase(parcel.getTehsildarStatus())) {
            vState = "COMPLETED";
        } else if ("SENT_BACK".equalsIgnoreCase(parcel.getTehsildarStatus()) || "RETURNED_FOR_CORRECTION".equalsIgnoreCase(parcel.getVerificationStatus())) {
            vState = "RETURNED_FOR_CORRECTION";
        } else if ("VERIFICATION_SUBMITTED".equalsIgnoreCase(parcel.getVerificationStatus()) || "PENDING_REVIEW".equalsIgnoreCase(parcel.getTehsildarStatus())) {
            vState = "VERIFICATION_SUBMITTED";
        } else if (Boolean.TRUE.equals(parcel.getRevenueVerified()) || !draft.isEmpty()) {
            vState = "IN_VERIFICATION";
        }
        details.put("verificationStatus", vState);

        // Field Verification Notes
        details.put("fieldVerification", fieldVerifications.get(cId));

        // Documents
        details.put("documents", getCaseDocuments(cId, parcel));

        return details;
    }

    /**
     * 4. Save Draft Verification
     */
    public Map<String, Object> saveVerificationDraft(String caseId, Map<String, Object> payload, String officerEmail) {
        LandParcel parcel = findParcelByCaseOrKhasra(caseId);
        String cId = (parcel != null && parcel.getCaseId() != null) ? parcel.getCaseId() : caseId;

        payload.put("savedAt", LocalDateTime.now().format(DATE_FORMATTER));
        payload.put("officerEmail", officerEmail != null ? officerEmail : "officer@demo.gov.in");
        verificationDrafts.put(cId, payload);

        if (parcel != null) {
            parcel.setVerificationStatus("IN_VERIFICATION");
            landParcelRepository.save(parcel);
        }

        // Record Audit Log
        auditLogRepository.save(new AuditLog(
                officerEmail != null ? officerEmail : "officer@demo.gov.in",
                "REVENUE_OFFICER_DRAFT_SAVED",
                "LandParcel",
                cId,
                "Revenue Officer saved verification draft for Case " + cId + "."
        ));

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Verification draft saved successfully.");
        res.put("savedAt", payload.get("savedAt"));
        return res;
    }

    /**
     * 5. Submit Verification to Tehsildar
     */
    public Map<String, Object> submitVerificationToTehsildar(String caseId, Map<String, Object> payload, String officerEmail) {
        LandParcel parcel = findParcelByCaseOrKhasra(caseId);
        if (parcel == null) {
            Map<String, Object> err = new LinkedHashMap<>();
            err.put("success", false);
            err.put("message", "Case not found for ID: " + caseId);
            return err;
        }

        String cId = parcel.getCaseId() != null ? parcel.getCaseId() : caseId;
        String remarks = (String) payload.getOrDefault("remarks", "Land, Ownership, and GIS RoR verification completed on site.");

        // Update Parcel State
        parcel.setRevenueVerified(true);
        parcel.setGisVerified(true);
        parcel.setVerificationStatus("VERIFICATION_SUBMITTED");
        parcel.setTehsildarStatus("PENDING_REVIEW");
        parcel.setStatus("IN_REVIEW");
        parcel.setRevenueOfficerNotes(remarks);
        parcel.setTehsildarActionDate(LocalDateTime.now().format(DATE_FORMATTER));
        landParcelRepository.save(parcel);

        // Record Audit Log
        auditLogRepository.save(new AuditLog(
                officerEmail != null ? officerEmail : "officer@demo.gov.in",
                "REVENUE_OFFICER_VERIFICATION_SUBMITTED",
                "LandParcel",
                cId,
                "Revenue Officer submitted formal verification for Khasra " + parcel.getKhasraNumber() + " (" + parcel.getOwnerName() + ") to Tehsildar. Remarks: " + remarks
        ));

        // Create Notification for Tehsildar
        Notification notif = new Notification();
        notif.setTitle("Verification Received: Khasra " + parcel.getKhasraNumber());
        notif.setMessage("Revenue Officer has completed and submitted verification for Case " + cId + " (" + parcel.getOwnerName() + ") for your statutory review.");
        notif.setTargetRole("TEHSILDAR");
        notif.setType("CASE_SUBMITTED");
        notif.setRelatedCaseId(cId);
        notif.setRelatedKhasra(parcel.getKhasraNumber());
        notificationRepository.save(notif);

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Verification submitted to Tehsildar successfully.");
        res.put("caseId", cId);
        res.put("status", "VERIFICATION_SUBMITTED");
        res.put("submittedAt", LocalDateTime.now().format(DATE_FORMATTER));
        return res;
    }

    /**
     * 6. Record Field Verification Visit
     */
    public Map<String, Object> recordFieldVerification(String caseId, Map<String, Object> payload, String officerEmail) {
        LandParcel parcel = findParcelByCaseOrKhasra(caseId);
        String cId = (parcel != null && parcel.getCaseId() != null) ? parcel.getCaseId() : caseId;

        payload.put("recordedAt", LocalDateTime.now().format(DATE_FORMATTER));
        payload.put("officerEmail", officerEmail != null ? officerEmail : "officer@demo.gov.in");
        fieldVerifications.put(cId, payload);

        // Record Audit Log
        auditLogRepository.save(new AuditLog(
                officerEmail != null ? officerEmail : "officer@demo.gov.in",
                "REVENUE_OFFICER_FIELD_VISIT_RECORDED",
                "LandParcel",
                cId,
                "Field verification visit recorded for Case " + cId + ". Land Use: " + payload.getOrDefault("landUse", "Agricultural")
        ));

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Field verification recorded successfully.");
        res.put("caseId", cId);
        return res;
    }

    /**
     * 7. Case Documents Management
     */
    public List<Map<String, Object>> getCaseDocuments(String caseId, LandParcel parcel) {
        if (caseDocuments.containsKey(caseId)) {
            return caseDocuments.get(caseId);
        }

        String khasra = parcel != null ? parcel.getKhasraNumber() : "101";
        String owner = parcel != null ? parcel.getOwnerName() : "Sh. Ram Kumar";

        List<Map<String, Object>> docs = new ArrayList<>();
        docs.add(createDoc("DOC-001", "Bhulekh 12-Year Khatauni Extract", "Revenue RoR", "PDF", "2.4 MB", "VERIFIED", "Match confirmed with Tehsil Land Registry"));
        docs.add(createDoc("DOC-002", "Cadastral Shajra Village Map Excerpt", "GIS Map", "PDF", "4.1 MB", "VERIFIED", "Boundary aligns with Khasra " + khasra + " ROW corridor"));
        docs.add(createDoc("DOC-003", "Landowner Identity & Aadhaar Proof", "Identity", "PDF", "1.1 MB", "VERIFIED", "Aadhaar verified for " + owner));
        docs.add(createDoc("DOC-004", "Field Inspection & Geo-Tagged Site Report", "Field Visit", "PDF", "3.8 MB", "VERIFIED", "On-ground demarcation completed"));
        docs.add(createDoc("DOC-005", "Chakbandi Form CH-41 / CH-45 Certificate", "Statutory Land Form", "PDF", "1.9 MB", "VERIFIED", "Certified by Tehsil Record Room"));

        caseDocuments.put(caseId, docs);
        return docs;
    }

    private Map<String, Object> createDoc(String id, String name, String type, String format, String size, String status, String remarks) {
        Map<String, Object> d = new LinkedHashMap<>();
        d.put("id", id);
        d.put("name", name);
        d.put("type", type);
        d.put("format", format);
        d.put("size", size);
        d.put("status", status);
        d.put("remarks", remarks);
        d.put("uploadedDate", "2024-02-10");
        return d;
    }

    public Map<String, Object> updateDocumentStatus(String caseId, String docId, String status, String remarks) {
        List<Map<String, Object>> docs = caseDocuments.get(caseId);
        if (docs != null) {
            for (Map<String, Object> d : docs) {
                if (docId.equals(d.get("id"))) {
                    d.put("status", status);
                    d.put("remarks", remarks);
                    break;
                }
            }
        }

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Document status updated.");
        return res;
    }

    /**
     * 8. Assigned Citizen Objections
     */
    public List<Map<String, Object>> getAssignedObjections(String officerEmail) {
        List<Objection> objections = objectionRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Objection o : objections) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", o.getId());
            m.put("objectionId", o.getObjectionId() != null ? o.getObjectionId() : "OBJ-" + o.getId());
            m.put("khasraNumber", o.getKhasraNumber());
            m.put("caseId", "CASE-2026-DME-0" + o.getKhasraNumber());
            m.put("claimantName", o.getClaimantName());
            m.put("objectionType", o.getObjectionType());
            m.put("description", o.getDescription());
            m.put("status", o.getStatus());
            m.put("dateFiled", o.getCreatedAt() != null ? o.getCreatedAt().toString() : "2024-02-10");
            m.put("evidenceDocument", o.getEvidenceDocName() != null ? o.getEvidenceDocName() : "Objection_Proof.pdf");
            m.put("village", "Nagla");
            m.put("assignedOfficer", "Sh. Alok Srivastava");
            result.add(m);
        }
        return result;
    }

    public Map<String, Object> submitObjectionFactReport(String objectionId, Map<String, Object> payload, String officerEmail) {
        Optional<Objection> opt = objectionRepository.findByObjectionId(objectionId);
        if (opt.isPresent()) {
            Objection obj = opt.get();
            obj.setStatus("FIELD_INVESTIGATED");
            obj.setAuthorityOrder((String) payload.getOrDefault("remarks", "Revenue Officer field fact-finding report submitted to Tehsildar."));
            objectionRepository.save(obj);
        }

        auditLogRepository.save(new AuditLog(
                officerEmail != null ? officerEmail : "officer@demo.gov.in",
                "REVENUE_OFFICER_OBJECTION_FACT_REPORT_SUBMITTED",
                "Objection",
                objectionId,
                "Revenue Officer submitted field investigation report for Objection " + objectionId + "."
        ));

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("success", true);
        res.put("message", "Objection investigation report submitted to Tehsildar.");
        return res;
    }

    /**
     * 9. GIS Map for Assigned Jurisdiction
     */
    public Map<String, Object> getAssignedMapData(String selectedVillage) {
        String cleanVillage = (selectedVillage != null && !selectedVillage.isEmpty() && !"ALL".equalsIgnoreCase(selectedVillage))
                ? selectedVillage : "Nagla";

        List<LandParcel> allParcels = landParcelRepository.findAll();
        List<LandParcel> filtered = allParcels.stream()
                .filter(p -> cleanVillage.equalsIgnoreCase(p.getVillage()))
                .collect(Collectors.toList());

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("village", cleanVillage);
        res.put("tehsil", "Fatehabad");
        res.put("district", "Agra");
        res.put("affectedParcels", filtered);
        res.put("highwayCorridor", "Delhi–Meerut Expressway Expansion (NH-348)");
        res.put("centerlineCoordinates", List.of(
                List.of(27.1614, 78.0603),
                List.of(27.1626, 78.0633),
                List.of(27.1636, 78.0663),
                List.of(27.1646, 78.0693),
                List.of(27.1656, 78.0723)
        ));
        res.put("corridorPolygon", List.of(
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
        return res;
    }

    /**
     * 10. Verification-Focused Reports
     */
    public Map<String, Object> getVerificationReports(String officerEmail) {
        List<LandParcel> list = getAssignedParcelsForOfficer(officerEmail);

        Map<String, Object> rep = new LinkedHashMap<>();
        rep.put("totalAssignedCases", list.size());
        rep.put("pendingVerificationCount", list.stream().filter(p -> !Boolean.TRUE.equals(p.getRevenueVerified())).count());
        rep.put("submittedVerificationCount", list.stream().filter(p -> Boolean.TRUE.equals(p.getRevenueVerified())).count());
        rep.put("fieldVerificationCompletedCount", fieldVerifications.size());
        rep.put("returnedForCorrectionCount", list.stream().filter(p -> "SENT_BACK".equalsIgnoreCase(p.getTehsildarStatus())).count());

        Map<String, Long> villageBreakdown = list.stream()
                .collect(Collectors.groupingBy(p -> p.getVillage() != null ? p.getVillage() : "Nagla", Collectors.counting()));
        rep.put("villageBreakdown", villageBreakdown);
        rep.put("generatedAt", LocalDateTime.now().format(DATE_FORMATTER));

        return rep;
    }

    /**
     * 11. Notifications
     */
    public List<Notification> getNotifications(String officerEmail) {
        return notificationRepository.findByTargetRoleOrderByCreatedAtDesc("GOVERNMENT_OFFICER");
    }

    /**
     * 12. Officer Profile
     */
    public Map<String, Object> getOfficerProfile(String officerEmail) {
        Map<String, Object> prof = new LinkedHashMap<>();
        prof.put("name", "Sh. Alok Srivastava");
        prof.put("email", officerEmail != null ? officerEmail : "officer@demo.gov.in");
        prof.put("mobile", "+91 98765 43210");
        prof.put("designation", "Revenue Officer / Field CALA");
        prof.put("department", "Revenue & Land Records Department, Uttar Pradesh");
        prof.put("employeeId", "UP-REV-2018-4921");
        prof.put("district", "Agra");
        prof.put("tehsil", "Fatehabad");
        prof.put("assignedVillages", List.of("Nagla", "Kasan", "Kharabwadi", "Vesu"));
        prof.put("assignedProjects", List.of("PRJ-001 (Delhi–Meerut Expressway Expansion NH-348)"));
        prof.put("assignedCasesCount", landParcelRepository.count());
        return prof;
    }

    // Helper: Find parcels assigned to the officer's jurisdiction
    private List<LandParcel> getAssignedParcelsForOfficer(String officerEmail) {
        return landParcelRepository.findAll();
    }

    private LandParcel findParcelByCaseOrKhasra(String id) {
        if (id == null) return null;
        Optional<LandParcel> opt = landParcelRepository.findByCaseId(id);
        if (opt.isPresent()) return opt.get();

        opt = landParcelRepository.findByKhasraNumber(id);
        if (opt.isPresent()) return opt.get();

        // Check if id contains digits
        String cleaned = id.replaceAll("[^0-9]", "");
        if (!cleaned.isEmpty()) {
            opt = landParcelRepository.findByKhasraNumber(cleaned);
            if (opt.isPresent()) return opt.get();
        }

        return null;
    }
}
