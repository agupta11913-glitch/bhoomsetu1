-- =============================================================================
-- BHOOMISETU: National Land Acquisition & Management System
-- Database Schema Definition (MySQL 8.0)
-- Database Name: bhoomisetu
-- =============================================================================

CREATE DATABASE IF NOT EXISTS bhoomisetu
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE bhoomisetu;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    mobile VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    department VARCHAR(100),
    designation VARCHAR(100),
    employee_id VARCHAR(50),
    organization_name VARCHAR(150),
    state VARCHAR(100),
    district VARCHAR(100),
    address TEXT,
    rejection_reason TEXT,
    language_preference VARCHAR(20) DEFAULT 'ENGLISH',
    theme_preference VARCHAR(20) DEFAULT 'LIGHT',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role),
    INDEX idx_user_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    short_name VARCHAR(100),
    project_type VARCHAR(100),
    requiring_agency VARCHAR(150),
    authority VARCHAR(150),
    state VARCHAR(100),
    districts VARCHAR(255),
    estimated_cost DOUBLE,
    total_land_required DOUBLE,
    land_proposed DOUBLE,
    land_notified DOUBLE,
    land_acquired DOUBLE,
    land_remaining DOUBLE,
    affected_families INT,
    displaced_families INT,
    compensation_assessed DOUBLE,
    compensation_paid DOUBLE,
    possession_percentage DOUBLE,
    rr_progress DOUBLE,
    current_stage VARCHAR(100),
    status VARCHAR(50),
    start_date VARCHAR(50),
    expected_completion_date VARCHAR(50),
    timeline_status VARCHAR(50),
    description TEXT,
    coordinates_json TEXT,
    alignment_coordinates_json TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_project_id (project_id),
    INDEX idx_project_state (state)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. LAND PARCELS TABLE
CREATE TABLE IF NOT EXISTS land_parcels (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    khasra_number VARCHAR(50) NOT NULL,
    khata_number VARCHAR(50),
    case_id VARCHAR(100),
    project_id VARCHAR(50),
    project_name VARCHAR(200),
    owner_name VARCHAR(150) NOT NULL,
    father_name VARCHAR(150),
    aadhaar_masked VARCHAR(50),
    pan_masked VARCHAR(50),
    phone VARCHAR(50),
    email VARCHAR(150),
    bank_account VARCHAR(100),
    area_acre DOUBLE,
    area_hectare DOUBLE,
    affected_area_acre DOUBLE,
    affected_area_hectare DOUBLE,
    remaining_area_acre DOUBLE,
    remaining_area_hectare DOUBLE,
    land_type VARCHAR(100),
    soil_classification VARCHAR(100),
    village VARCHAR(100),
    tehsil VARCHAR(100),
    district VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    status VARCHAR(50),
    gis_status VARCHAR(50),
    assigned_officer VARCHAR(150),
    dispute_status VARCHAR(100),
    circle_rate_per_acre DOUBLE,
    market_value DOUBLE,
    multiplying_factor DOUBLE,
    base_compensation DOUBLE,
    solatium_percentage DOUBLE,
    total_compensation DOUBLE,
    payment_status VARCHAR(50),
    payment_utr VARCHAR(100),
    payment_date VARCHAR(50),
    revenue_verified BOOLEAN DEFAULT FALSE,
    revenue_officer_notes TEXT,
    gis_verified BOOLEAN DEFAULT FALSE,
    gis_officer_notes TEXT,
    selected_for_acquisition BOOLEAN DEFAULT TRUE,
    notice_issued BOOLEAN DEFAULT FALSE,
    notice_id VARCHAR(100),
    notice_date VARCHAR(50),
    objection_deadline VARCHAR(50),
    has_objection BOOLEAN DEFAULT FALSE,
    objection_id VARCHAR(100),
    authority_approved BOOLEAN DEFAULT FALSE,
    authority_approval_date VARCHAR(50),
    is_acquired BOOLEAN DEFAULT FALSE,
    acquisition_date VARCHAR(50),
    coordinates_json TEXT,
    affected_coordinates_json TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_lp_khasra (khasra_number),
    INDEX idx_lp_project (project_id),
    INDEX idx_lp_state_dist (state, district),
    INDEX idx_lp_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    notification_id VARCHAR(50),
    title VARCHAR(200) NOT NULL,
    message TEXT,
    type VARCHAR(50),
    target_role VARCHAR(50),
    target_user_email VARCHAR(150),
    related_case_id VARCHAR(100),
    related_khasra VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    document_id VARCHAR(50),
    case_id VARCHAR(100),
    khasra_number VARCHAR(50),
    document_type VARCHAR(100) NOT NULL,
    file_name VARCHAR(200) NOT NULL,
    file_url VARCHAR(255),
    uploaded_by VARCHAR(150),
    uploaded_at VARCHAR(50),
    version VARCHAR(20) DEFAULT '1.0',
    status VARCHAR(50) DEFAULT 'VERIFIED',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. OBJECTIONS TABLE
CREATE TABLE IF NOT EXISTS objections (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    objection_id VARCHAR(50) UNIQUE NOT NULL,
    khasra_number VARCHAR(50) NOT NULL,
    case_id VARCHAR(100),
    project_id VARCHAR(50),
    claimant_name VARCHAR(150) NOT NULL,
    claimant_phone VARCHAR(50),
    claimant_email VARCHAR(150),
    objection_type VARCHAR(100),
    description TEXT,
    evidence_doc_name VARCHAR(200),
    status VARCHAR(50) DEFAULT 'PENDING_HEARING',
    hearing_date VARCHAR(50),
    authority_order TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(150),
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100),
    entity_id VARCHAR(100),
    ip_address VARCHAR(50),
    description TEXT,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. REHABILITATION & RESETTLEMENT (R&R) BENEFITS TABLE (RFCTLARR 2013 SECOND SCHEDULE)
CREATE TABLE IF NOT EXISTS rehabilitation_benefits (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    case_id VARCHAR(100) NOT NULL,
    khasra_number VARCHAR(50),
    paf_name VARCHAR(150) NOT NULL,
    benefit_name VARCHAR(200) NOT NULL,
    benefit_type VARCHAR(100) NOT NULL,
    eligibility VARCHAR(50) NOT NULL,
    amount_display VARCHAR(150),
    amount_numeric DOUBLE,
    duration VARCHAR(50),
    status VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50),
    payment_date VARCHAR(50),
    utr_number VARCHAR(100),
    payment_mode VARCHAR(100),
    legal_basis VARCHAR(200),
    remarks TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_rr_case (case_id),
    INDEX idx_rr_khasra (khasra_number),
    INDEX idx_rr_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. R&R CLARIFICATION REQUESTS TABLE
CREATE TABLE IF NOT EXISTS rr_clarifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    case_id VARCHAR(100) NOT NULL,
    claimant_name VARCHAR(150) NOT NULL,
    claimant_email VARCHAR(150),
    claimant_phone VARCHAR(50),
    subject VARCHAR(200) NOT NULL,
    category VARCHAR(100),
    message TEXT NOT NULL,
    supporting_doc_name VARCHAR(200),
    status VARCHAR(50) NOT NULL DEFAULT 'SUBMITTED',
    response_text TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_rrc_case (case_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
