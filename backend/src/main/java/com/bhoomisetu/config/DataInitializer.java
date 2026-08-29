package com.bhoomisetu.config;

import com.bhoomisetu.entity.*;
import com.bhoomisetu.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final LandParcelRepository landParcelRepository;
    private final RehabilitationBenefitRepository rrBenefitRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           ProjectRepository projectRepository,
                           LandParcelRepository landParcelRepository,
                           RehabilitationBenefitRepository rrBenefitRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.landParcelRepository = landParcelRepository;
        this.rrBenefitRepository = rrBenefitRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedProjects();
        seedLandParcels();
        seedRehabilitationBenefits();
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            log.info("Initializing BhoomiSetu database with default seed accounts...");

            String defaultPass = passwordEncoder.encode("Bhoomi@123");

            createUser("Administrator", "admin@bhoomisetu.gov.in", "+91 11 2430 5000", defaultPass,
                    Role.ADMIN, Status.ACTIVE, "National Informatics Centre (NIC)", "System Administrator",
                    "NIC-IAM-001", "BhoomiSetu NICNET Unit", "Delhi (NCT)", "New Delhi", "NIC HQ, CGO Complex, New Delhi");

            createUser("Sh. Ram Kumar", "citizen@demo.com", "+91 98765 43210", defaultPass,
                    Role.CITIZEN, Status.ACTIVE, "Citizen & Land Owner Services", "Registered Land Owner",
                    null, null, "Uttar Pradesh", "Agra", "House No. 101, Nagla Village, Fatehabad, Agra - 283111");

            createUser("Sh. Ram Kumar", "owner@example.com", "+91 98765 43210", defaultPass,
                    Role.CITIZEN, Status.ACTIVE, "Citizen & Land Owner Services", "Registered Land Owner",
                    null, null, "Uttar Pradesh", "Agra", "House No. 101, Nagla Village, Fatehabad, Agra - 283111");

            createUser("Sh. Alok Srivastava", "tehsildar@demo.gov.in", "+91 562 228 1145", defaultPass,
                    Role.TEHSILDAR, Status.ACTIVE, "Revenue & Land Records Department", "Tehsildar & Executive Officer",
                    "UP-TEH-2018-042", null, "Uttar Pradesh", "Agra", "Tehsil Office Complex, Fatehabad Road, Agra");

            createUser("Sh. Alok Srivastava", "tehsildar@bhoomisetu.gov.in", "+91 562 228 1145", defaultPass,
                    Role.TEHSILDAR, Status.ACTIVE, "Revenue & Land Records Department", "Tehsildar & Executive Officer",
                    "UP-TEH-2018-043", null, "Uttar Pradesh", "Agra", "Tehsil Office Complex, Fatehabad Road, Agra");

            createUser("Sh. Alok Srivastava", "officer@demo.gov.in", "+91 562 228 1145", defaultPass,
                    Role.GOVERNMENT_OFFICER, Status.ACTIVE, "Revenue & Land Records Department", "Revenue Inspector & Field Verification Officer",
                    "UP-REV-2019-108", null, "Uttar Pradesh", "Agra", "Tehsil Office Complex, Fatehabad Road, Agra");

            createUser("Sh. Alok Srivastava", "field.officer@bhoomisetu.gov.in", "+91 562 228 1145", defaultPass,
                    Role.GOVERNMENT_OFFICER, Status.ACTIVE, "Revenue & Land Records Department", "Revenue Inspector & Field Verification Officer",
                    "UP-REV-2019-109", null, "Uttar Pradesh", "Agra", "Tehsil Office Complex, Fatehabad Road, Agra");

            createUser("Dr. Sunita Murthy, IAS", "district.officer@bhoomisetu.gov.in", "+91 562 226 0001", defaultPass,
                    Role.DISTRICT_AUTHORITY, Status.ACTIVE, "Office of the District Magistrate & Collectorate", "District Magistrate & CALA",
                    "IAS-UP-2012-0044", null, "Uttar Pradesh", "Agra", "Collectorate Complex, Civil Lines, Agra");

            createUser("Sh. Sanjeev Khare, IAS", "state.officer@bhoomisetu.gov.in", "+91 522 223 9012", defaultPass,
                    Role.STATE_GOVERNMENT, Status.ACTIVE, "Department of Revenue & Land Reforms", "Principal Secretary, Revenue & Infra",
                    "IAS-UP-2005-0012", null, "Uttar Pradesh", "Lucknow", "Bapu Bhawan Secretariat, Lucknow, UP");

            createUser("Dr. Arvind Meena, IAS", "central.officer@bhoomisetu.gov.in", "+91 11 2309 4512", defaultPass,
                    Role.CENTRAL_MINISTRY, Status.ACTIVE, "Cabinet Secretariat & DPIIT", "Joint Secretary, PM Gati Shakti & MoRTH",
                    "IAS-AGMUT-2008-0099", null, "Delhi (NCT)", "New Delhi", "Transport Bhawan, Parliament Street, New Delhi");

            createUser("Sh. Rajesh Verma", "executive@demo.gov.in", "+91 562 226 7890", defaultPass,
                    Role.EXECUTIVE_OFFICER, Status.ACTIVE, "National Highways Authority of India (NHAI)", "Executive Director & Project CALA",
                    "NHAI-EXEC-2018-091", "NHAI Expressways PIU", "Uttar Pradesh", "Agra", "PIU Agra, NH-19 Bye-pass, Agra");

            createUser("Sh. Rajesh Verma", "executive@bhoomisetu.gov.in", "+91 562 226 7890", defaultPass,
                    Role.EXECUTIVE_OFFICER, Status.ACTIVE, "National Highways Authority of India (NHAI)", "Executive Director & Project CALA",
                    "NHAI-EXEC-2018-092", "NHAI Expressways PIU", "Uttar Pradesh", "Agra", "PIU Agra, NH-19 Bye-pass, Agra");

            createUser("Sh. Rajesh Verma", "agency@demo.gov.in", "+91 562 226 7890", defaultPass,
                    Role.PROJECT_AGENCY, Status.ACTIVE, "National Highways Authority of India (NHAI)", "Chief Project Director",
                    "NHAI-PD-2018-091", "NHAI Expressways PIU", "Uttar Pradesh", "Agra", "PIU Agra, NH-19 Bye-pass, Agra");

            createUser("Sh. Rajesh Verma", "agency@bhoomisetu.gov.in", "+91 562 226 7890", defaultPass,
                    Role.PROJECT_AGENCY, Status.ACTIVE, "National Highways Authority of India (NHAI)", "Chief Project Director",
                    "NHAI-PD-2018-092", "NHAI Expressways PIU", "Uttar Pradesh", "Agra", "PIU Agra, NH-19 Bye-pass, Agra");

            createUser("Sh. Amit Kumar Verma", "amit.verma@up.gov.in", "+91 98765 44332", defaultPass,
                    Role.GOVERNMENT_OFFICER, Status.PENDING, "Revenue Department (Bhulekh / Tehsildar)", "Naib Tehsildar & Field Verification Officer",
                    "UP-REV-2019-8812", null, "Uttar Pradesh", "Meerut", "Tehsil Complex, Mawana Road, Meerut, UP");

            log.info("BhoomiSetu users initialized.");
        }
    }

    private void createUser(String name, String email, String mobile, String password,
                            Role role, Status status, String department, String designation,
                            String employeeId, String organizationName, String state, String district, String address) {
        User user = new User();
        user.setName(name);
        user.setEmail(email.toLowerCase());
        user.setMobile(mobile);
        user.setPassword(password);
        user.setRole(role);
        user.setStatus(status);
        user.setDepartment(department);
        user.setDesignation(designation);
        user.setEmployeeId(employeeId);
        user.setOrganizationName(organizationName);
        user.setState(state);
        user.setDistrict(district);
        user.setAddress(address);
        userRepository.save(user);
    }

    private void seedProjects() {
        if (projectRepository.count() == 0) {
            log.info("Initializing 10 Indian Mega-Projects in MySQL...");

            createProject("PRJ-001", "Delhi–Meerut Expressway Expansion (NH-348)", "Delhi–Meerut Expressway",
                    "Expressway", "NHAI", "MoRTH", "Uttar Pradesh", "Meerut, Ghaziabad, Agra",
                    8400000000.0, 1450.0, 1450.0, 1200.0, 945.5, 504.5, 320, 65,
                    2400000000.0, 1680000000.0, 65.2, 72.0, "Section 19 Declaration & Award Disbursement", "Active (Fast-Track)",
                    "[[27.1626, 78.0597], [27.1638, 78.0627], [27.1648, 78.0657], [27.1658, 78.0687], [27.1668, 78.0717], [27.1656, 78.0723], [27.1646, 78.0693], [27.1636, 78.0663], [27.1626, 78.0633], [27.1614, 78.0603]]",
                    "[[27.1620, 78.0600], [27.1632, 78.0630], [27.1642, 78.0660], [27.1652, 78.0690], [27.1662, 78.0720]]");

            createProject("PRJ-002", "Dedicated Freight Corridor (Western DFC)", "Western DFC Rail Corridor",
                    "Freight Railway", "DFCCIL", "Ministry of Railways", "Haryana", "Gurugram, Faridabad, Rewari",
                    14500000000.0, 2100.0, 2100.0, 1950.0, 1680.0, 420.0, 450, 80,
                    3800000000.0, 3100000000.0, 80.0, 84.5, "Track Laying & Section 38 Handover", "Active",
                    "[[28.3480, 76.9180], [28.3820, 76.9620], [28.3780, 76.9640], [28.3460, 76.9200]]",
                    "[[28.3500, 76.9200], [28.3650, 76.9400], [28.3800, 76.9600]]");

            createProject("PRJ-003", "Delhi-Mumbai Industrial Corridor (DMIC Hub)", "DMIC Mega Node",
                    "Industrial City", "NICDC", "Ministry of Commerce", "Maharashtra", "Pune, Nashik, Raigad",
                    2200000000.0, 3400.0, 3400.0, 2800.0, 2150.0, 1250.0, 620, 140,
                    6200000000.0, 4100000000.0, 63.2, 68.0, "Section 15 Hearings & Valuation Review", "Active",
                    "[[18.5180, 73.8480], [18.5620, 73.8920], [18.5580, 73.8940], [18.5160, 73.8500]]",
                    "[[18.5200, 73.8500], [18.5400, 73.8700], [18.5600, 73.8900]]");

            createProject("PRJ-004", "Mumbai–Ahmedabad High Speed Rail Corridor (MAHSR)", "Bullet Train Project",
                    "High Speed Rail", "NHSRCL", "Ministry of Railways", "Gujarat", "Surat, Vadodara, Ahmedabad",
                    108000000000.0, 1396.0, 1396.0, 1396.0, 1380.0, 16.0, 980, 120,
                    18500000000.0, 18200000000.0, 98.8, 97.5, "Civil Viaduct & Pier Construction", "Near Completion",
                    "[[21.1680, 72.8280], [21.2120, 72.8720], [21.2080, 72.8740], [21.1660, 72.8300]]",
                    "[[21.1700, 72.8300], [21.1900, 72.8500], [21.2100, 72.8700]]");

            createProject("PRJ-005", "National Highway-19 6-Lane Expansion", "NH-19 Golden Corridor",
                    "National Highway", "NHAI", "MoRTH", "Uttar Pradesh", "Agra, Mathura, Kanpur Nagar",
                    5600000000.0, 880.0, 880.0, 750.0, 610.0, 270.0, 240, 42,
                    1650000000.0, 1220000000.0, 69.3, 76.0, "Flyover Construction", "Active",
                    "[[27.1480, 77.9780], [27.2020, 78.0420], [27.1980, 78.0460], [27.1440, 77.9820]]",
                    "[[27.1500, 77.9800], [27.1767, 78.0081], [27.2000, 78.0400]]");

            log.info("BhoomiSetu projects initialized.");
        }
    }

    private void createProject(String projectId, String name, String shortName, String type,
                              String requiringAgency, String authority, String state, String districts,
                              Double estimatedCost, Double totalLand, Double proposed, Double notified,
                              Double acquired, Double remaining, Integer affectedFamilies, Integer displacedFamilies,
                              Double compAssessed, Double compPaid, Double possessionPct, Double rrProgress,
                              String currentStage, String status, String coordsJson, String alignmentJson) {
        Project p = new Project();
        p.setProjectId(projectId);
        p.setName(name);
        p.setShortName(shortName);
        p.setProjectType(type);
        p.setRequiringAgency(requiringAgency);
        p.setAuthority(authority);
        p.setState(state);
        p.setDistricts(districts);
        p.setEstimatedCost(estimatedCost);
        p.setTotalLandRequired(totalLand);
        p.setLandProposed(proposed);
        p.setLandNotified(notified);
        p.setLandAcquired(acquired);
        p.setLandRemaining(remaining);
        p.setAffectedFamilies(affectedFamilies);
        p.setDisplacedFamilies(displacedFamilies);
        p.setCompensationAssessed(compAssessed);
        p.setCompensationPaid(compPaid);
        p.setPossessionPercentage(possessionPct);
        p.setRrProgress(rrProgress);
        p.setCurrentStage(currentStage);
        p.setStatus(status);
        p.setCoordinatesJson(coordsJson);
        p.setAlignmentCoordinatesJson(alignmentJson);
        p.setStartDate("2024-01-01");
        p.setExpectedCompletionDate("2027-12-31");
        p.setTimelineStatus("On-Track");
        projectRepository.save(p);
    }

    private void seedLandParcels() {
        if (landParcelRepository.count() == 0) {
            log.info("Initializing Land Parcels in MySQL with GIS geometries...");

            createParcel("101", "KH-842", "CASE-2026-DME-0101", "PRJ-001", "Delhi–Meerut Expressway Expansion (NH-348)",
                    "Sh. Ram Kumar", "Late Sh. Harish Chandra", "XXXX-XXXX-4812", "citizen@demo.com",
                    2.50, 1.0117, 0.80, 0.3237, 1.70, 0.6880,
                    "Agricultural (Irrigated)", "Nagla", "Fatehabad", "Agra", "Uttar Pradesh",
                    "PROPOSED", 4500000.0, 11250000.0, 45000000.0, true, true, false,
                    "[[27.1652, 78.0645], [27.1658, 78.0647], [27.1657, 78.0656], [27.1650, 78.0655], [27.1648, 78.0648]]",
                    "[[27.1651, 78.0646], [27.1654, 78.0647], [27.1653, 78.0655], [27.1650, 78.0655], [27.1648, 78.0648]]");

            createParcel("105", "KH-846", "CASE-2026-DME-0105", "PRJ-001", "Delhi–Meerut Expressway Expansion (NH-348)",
                    "Sh. Ram Kumar", "Late Sh. Harish Chandra", "XXXX-XXXX-4812", "citizen@demo.com",
                    1.20, 0.4856, 0.30, 0.1214, 0.90, 0.3642,
                    "Agricultural (Irrigated)", "Nagla", "Fatehabad", "Agra", "Uttar Pradesh",
                    "PROPOSED", 4500000.0, 5400000.0, 21600000.0, true, true, false,
                    "[[27.1658, 78.0647], [27.1664, 78.0649], [27.1663, 78.0657], [27.1657, 78.0656]]",
                    "[[27.1658, 78.0647], [27.1660, 78.0648], [27.1659, 78.0656], [27.1657, 78.0656]]");

            createParcel("102", "KH-843", "CASE-2026-DME-0102", "PRJ-001", "Delhi–Meerut Expressway Expansion (NH-348)",
                    "Sh. Ramesh Chandra", "Sh. Mohan Lal", "XXXX-XXXX-9102", "ramesh.chandra@example.com",
                    0.85, 0.344, 0.35, 0.1416, 0.50, 0.2024,
                    "Agricultural (Semi-Irrigated)", "Nagla", "Fatehabad", "Agra", "Uttar Pradesh",
                    "OBJECTION", 4500000.0, 3825000.0, 15300000.0, false, false, true,
                    "[[27.1657, 78.0656], [27.1656, 78.0664], [27.1649, 78.0663], [27.1650, 78.0655]]",
                    "[[27.1653, 78.0655], [27.1652, 78.0663], [27.1649, 78.0663], [27.1650, 78.0655]]");

            createParcel("103", "KH-844", "CASE-2026-DME-0103", "PRJ-001", "Delhi–Meerut Expressway Expansion (NH-348)",
                    "Smt. Sunita Devi", "W/o Sh. Brijesh Sharma", "XXXX-XXXX-3341", "sunita.devi@example.com",
                    0.45, 0.182, 0.45, 0.182, 0.00, 0.00,
                    "Commercial / Highway Frontage", "Nagla", "Fatehabad", "Agra", "Uttar Pradesh",
                    "AWARD_DECLARED", 12000000.0, 5400000.0, 16200000.0, true, true, false,
                    "[[27.1650, 78.0655], [27.1649, 78.0663], [27.1643, 78.0662], [27.1644, 78.0654]]",
                    "[[27.1650, 78.0655], [27.1649, 78.0663], [27.1643, 78.0662], [27.1644, 78.0654]]");

            createParcel("104", "KH-845", "CASE-2026-DME-0104", "PRJ-001", "Delhi–Meerut Expressway Expansion (NH-348)",
                    "Sh. Mahendra Singh", "Late Sh. Kartar Singh", "XXXX-XXXX-6721", "mahendra.singh@example.com",
                    2.10, 0.850, 0.90, 0.3642, 1.20, 0.4856,
                    "Agricultural (Tubewell Irrigated)", "Nagla", "Fatehabad", "Agra", "Uttar Pradesh",
                    "COMPENSATION_PAID", 4500000.0, 9450000.0, 37800000.0, true, true, false,
                    "[[27.1648, 78.0648], [27.1650, 78.0655], [27.1644, 78.0654], [27.1638, 78.0653], [27.1637, 78.0646]]",
                    "[[27.1648, 78.0648], [27.1650, 78.0655], [27.1644, 78.0654], [27.1642, 78.0647]]");

            createParcel("201", "KH-MAN-112", "CASE-2026-DFC-0201", "PRJ-002", "Dedicated Freight Corridor (Western DFC)",
                    "Sh. Dharamveer Yadav", "Late Sh. Nihal Singh", "XXXX-XXXX-9921", "dharamveer.yadav@example.com",
                    1.80, 0.728, 0.60, 0.2428, 1.20, 0.4856,
                    "Agricultural", "Kasan", "Manesar", "Gurugram", "Haryana",
                    "ACQUIRED", 8500000.0, 15300000.0, 45900000.0, true, true, false, null, null);

            log.info("BhoomiSetu land parcels initialized with GIS.");
        }
    }

    private void createParcel(String khasra, String khata, String caseId, String projectId, String projectName,
                             String owner, String father, String aadhaar, String email,
                             Double areaAcre, Double areaHectare, Double affectedAreaAcre, Double affectedAreaHectare,
                             Double remainingAreaAcre, Double remainingAreaHectare,
                             String landType, String village, String tehsil, String district, String state,
                             String status, Double circleRate, Double marketVal, Double totalComp,
                             Boolean revVer, Boolean gisVer, Boolean hasObj,
                             String coordsJson, String affectedCoordsJson) {
        LandParcel p = new LandParcel();
        p.setKhasraNumber(khasra);
        p.setKhataNumber(khata);
        p.setCaseId(caseId);
        p.setProjectId(projectId);
        p.setProjectName(projectName);
        p.setOwnerName(owner);
        p.setFatherName(father);
        p.setAadhaarMasked(aadhaar);
        p.setEmail(email);
        p.setAreaAcre(areaAcre);
        p.setAreaHectare(areaHectare != null ? areaHectare : areaAcre * 0.404686);
        p.setAffectedAreaAcre(affectedAreaAcre);
        p.setAffectedAreaHectare(affectedAreaHectare);
        p.setRemainingAreaAcre(remainingAreaAcre);
        p.setRemainingAreaHectare(remainingAreaHectare);
        p.setLandType(landType);
        p.setVillage(village);
        p.setTehsil(tehsil);
        p.setDistrict(district);
        p.setState(state);
        p.setStatus(status);
        p.setGisStatus(gisVer ? "VERIFIED" : "FLAGGED");
        p.setCircleRatePerAcre(circleRate);
        p.setMarketValue(marketVal);
        p.setTotalCompensation(totalComp);
        p.setRevenueVerified(revVer);
        p.setGisVerified(gisVer);
        p.setHasObjection(hasObj);
        p.setSelectedForAcquisition(true);
        p.setNoticeIssued(true);
        p.setNoticeId("NOT-2026-SEC11-" + khasra);
        p.setCoordinatesJson(coordsJson);
        p.setAffectedCoordinatesJson(affectedCoordsJson);
        landParcelRepository.save(p);
    }

    private void seedRehabilitationBenefits() {
        if (rrBenefitRepository.count() == 0) {
            log.info("Initializing 9 Second Schedule R&R Entitlements in MySQL...");

            String caseId = "CASE-2026-DME-0101";
            String paf = "Sh. Ram Kumar Family";
            String khasra = "101";

            createRRBenefit(caseId, khasra, paf, "Housing Assistance (Rural)", "HOUSING", "ELIGIBLE",
                    "Constructed House (PMAY-G Norms) / ₹2,50,000", 250000.0, "One-time", "UNDER_VERIFICATION",
                    "PENDING", null, null, "PMAY Grant / Direct Credit", "RFCTLARR Act 2013, Second Schedule, Item 1",
                    "Gramin Awas verification survey conducted by BDO Fatehabad.");

            createRRBenefit(caseId, khasra, paf, "Resettlement Grant", "RESETTLEMENT_GRANT", "ELIGIBLE",
                    "₹50,000", 50000.0, "One-time", "APPROVED",
                    "DISBURSED", "15 Feb 2026", "PFMS-RR-2026-839201", "DBT (SBI A/C ********8832)", "RFCTLARR Act 2013, Second Schedule, Item 7",
                    "Sanctioned by CALA Agra. Credited directly via PFMS gateway.");

            createRRBenefit(caseId, khasra, paf, "Subsistence Allowance", "SUBSISTENCE_ALLOWANCE", "ELIGIBLE",
                    "₹3,000 / month (₹36,000 Total)", 36000.0, "12 Months", "APPROVED",
                    "DISBURSED", "20 Feb 2026", "PFMS-RR-2026-839202", "DBT (SBI A/C ********8832)", "RFCTLARR Act 2013, Second Schedule, Item 5",
                    "12 monthly instalments of ₹3,000 cleared for displaced family sustenance.");

            createRRBenefit(caseId, khasra, paf, "Land-for-Land Allocation", "LAND_FOR_LAND", "NOT_APPLICABLE",
                    "Not Applicable", 0.0, "N/A", "NOT_APPLICABLE",
                    "NOT_APPLICABLE", null, null, "N/A", "RFCTLARR Act 2013, Second Schedule, Item 2",
                    "No eligible alternative agricultural land entitlement recorded for this prototype case.");

            createRRBenefit(caseId, khasra, paf, "One-time Resettlement & Cattle-Shed Assistance", "ONE_TIME_ASSISTANCE", "ELIGIBLE",
                    "₹25,000", 25000.0, "One-time", "APPROVED",
                    "DISBURSED", "18 Feb 2026", "PFMS-RR-2026-839203", "DBT (SBI A/C ********8832)", "RFCTLARR Act 2013, Second Schedule, Item 8",
                    "Financial grant for dismantling and shifting agricultural implement/cattle shed.");

            createRRBenefit(caseId, khasra, paf, "Livelihood / Skill Development Support", "LIVELIHOOD_SUPPORT", "ELIGIBLE",
                    "Vocational Training (PMKVY / NSDC)", 0.0, "6 Months", "ASSIGNED",
                    "IN_PROCESS", "01 Mar 2026", "SD-UP-2026-0918", "Institutional Sponsorship", "RFCTLARR Act 2013, Second Schedule, Item 4",
                    "Nominated: Rajesh Kumar (Son) for Solar Tech & Agri-Machinery Certification.");

            createRRBenefit(caseId, khasra, paf, "Relocation & Transport Assistance", "RELOCATION_ASSISTANCE", "ELIGIBLE",
                    "₹50,000", 50000.0, "One-time", "APPROVED",
                    "PENDING", null, "PFMS-QUEUE-839204", "DBT / State Bank of India", "RFCTLARR Act 2013, Second Schedule, Item 6",
                    "Transport allowance for shifting household effects to rehabilitation resettlement colony.");

            createRRBenefit(caseId, khasra, paf, "Cattle Shed / Working Shed Grant", "CATTLE_SHED", "ELIGIBLE",
                    "₹25,000", 25000.0, "One-time", "APPROVED",
                    "PENDING", null, "PFMS-QUEUE-839205", "DBT / State Bank of India", "RFCTLARR Act 2013, Second Schedule, Item 9",
                    "Assistance for constructing rural dairy shed in Nagla rehabilitation zone.");

            createRRBenefit(caseId, khasra, paf, "One-Time Grant for Petty Traders / Artisans", "OTHER_ASSISTANCE", "NOT_APPLICABLE",
                    "Not Applicable", 0.0, "N/A", "NOT_APPLICABLE",
                    "NOT_APPLICABLE", null, null, "N/A", "RFCTLARR Act 2013, Second Schedule, Item 10",
                    "Applicable only to affected non-agricultural shop owners or village rural artisans.");

            log.info("BhoomiSetu R&R benefits initialized.");
        }
    }

    private void createRRBenefit(String caseId, String khasra, String paf, String name, String type,
                                 String eligibility, String amountDisplay, Double amountNumeric, String duration,
                                 String status, String payStatus, String payDate, String utr, String mode,
                                 String legalBasis, String remarks) {
        RehabilitationBenefit b = new RehabilitationBenefit();
        b.setCaseId(caseId);
        b.setKhasraNumber(khasra);
        b.setPafName(paf);
        b.setBenefitName(name);
        b.setBenefitType(type);
        b.setEligibility(eligibility);
        b.setAmountDisplay(amountDisplay);
        b.setAmountNumeric(amountNumeric);
        b.setDuration(duration);
        b.setStatus(status);
        b.setPaymentStatus(payStatus);
        b.setPaymentDate(payDate);
        b.setUtrNumber(utr);
        b.setPaymentMode(mode);
        b.setLegalBasis(legalBasis);
        b.setRemarks(remarks);
        rrBenefitRepository.save(b);
    }
}
