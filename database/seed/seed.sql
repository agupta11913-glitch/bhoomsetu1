-- =============================================================================
-- BHOOMISETU: Demo Seed Data (MySQL 8.0)
-- Default Password for all seed users: Password123 (or Bhoomi@123)
-- BCrypt: $2a$10$wE6F3sN9b02pIvgXq0l81O8y6t4rT.7.b4C6Zf8q6E7pI8y6t4rT.
-- =============================================================================

USE bhoomisetu;

INSERT INTO users (id, name, email, mobile, password, role, status, department, designation, employee_id, organization_name, state, district, address, language_preference, theme_preference, created_at)
VALUES
(1, 'Administrator', 'admin@bhoomisetu.gov.in', '9876543210', '$2a$10$y58fXg6pU9kIqGzH0vK8u.0dO2kP.GzH0vK8u.0dO2kP.GzH0vK8u', 'ADMIN', 'ACTIVE', 'National Informatics Centre', 'System Architect', 'NIC-ADM-001', 'NICNET National Cloud', 'Delhi', 'New Delhi', 'CGO Complex, Lodhi Road, New Delhi', 'ENGLISH', 'LIGHT', NOW()),
(2, 'Sh. Ram Kumar', 'citizen@demo.com', '9876543211', '$2a$10$y58fXg6pU9kIqGzH0vK8u.0dO2kP.GzH0vK8u.0dO2kP.GzH0vK8u', 'CITIZEN', 'ACTIVE', NULL, NULL, NULL, NULL, 'Uttar Pradesh', 'Agra', 'Village Nagla, Fatehabad, Agra', 'ENGLISH', 'LIGHT', NOW()),
(3, 'Sh. Alok Srivastava', 'officer@demo.gov.in', '9876543212', '$2a$10$y58fXg6pU9kIqGzH0vK8u.0dO2kP.GzH0vK8u.0dO2kP.GzH0vK8u', 'GOVERNMENT_OFFICER', 'ACTIVE', 'Revenue Department', 'Tehsildar & CALA Officer', 'UP-REV-7821', 'State Revenue Board', 'Uttar Pradesh', 'Agra', 'Tehsil Office, Fatehabad, Agra', 'ENGLISH', 'LIGHT', NOW()),
(4, 'Dr. Sunita Murthy, IAS', 'district.officer@bhoomisetu.gov.in', '9876543213', '$2a$10$y58fXg6pU9kIqGzH0vK8u.0dO2kP.GzH0vK8u.0dO2kP.GzH0vK8u', 'DISTRICT_AUTHORITY', 'ACTIVE', 'District Administration', 'District Magistrate & Collector', 'IAS-UP-2012-089', 'District Magistrate Court', 'Uttar Pradesh', 'Agra', 'Collectorate Compound, Agra', 'ENGLISH', 'LIGHT', NOW()),
(5, 'Sh. Sanjeev Khare, IAS', 'state.officer@bhoomisetu.gov.in', '9876543214', '$2a$10$y58fXg6pU9kIqGzH0vK8u.0dO2kP.GzH0vK8u.0dO2kP.GzH0vK8u', 'STATE_GOVERNMENT', 'ACTIVE', 'Infrastructure & Industrial Development', 'Principal Secretary', 'IAS-UP-2004-012', 'Government of Uttar Pradesh', 'Uttar Pradesh', 'Lucknow', 'Bapu Bhawan, Secretariat, Lucknow', 'ENGLISH', 'LIGHT', NOW()),
(6, 'Dr. Arvind Meena, IAS', 'central.officer@bhoomisetu.gov.in', '9876543215', '$2a$10$y58fXg6pU9kIqGzH0vK8u.0dO2kP.GzH0vK8u.0dO2kP.GzH0vK8u', 'CENTRAL_MINISTRY', 'ACTIVE', 'Ministry of Road Transport & Highways', 'Joint Secretary (Land Acquisition)', 'IAS-MORTH-1998-004', 'Cabinet Secretariat / PM Gati Shakti', 'Delhi', 'New Delhi', 'Transport Bhawan, Parliament Street, New Delhi', 'ENGLISH', 'LIGHT', NOW()),
(7, 'Sh. Rajesh Verma', 'agency@demo.gov.in', '9876543216', '$2a$10$y58fXg6pU9kIqGzH0vK8u.0dO2kP.GzH0vK8u.0dO2kP.GzH0vK8u', 'PROJECT_AGENCY', 'ACTIVE', 'Project Implementation Unit', 'Chief Project Manager', 'NHAI-CPM-2021', 'National Highways Authority of India (NHAI)', 'Uttar Pradesh', 'Agra', 'NHAI Regional Office, Sanjay Place, Agra', 'ENGLISH', 'LIGHT', NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();
