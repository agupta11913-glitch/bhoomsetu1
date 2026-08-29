USE bhoomisetu;

INSERT INTO notifications (id, notification_id, title, message, type, target_role, target_user_email, related_case_id, related_khasra, is_read, created_at)
VALUES
(1, 'NOTIF-001', 'Section 11 Gazette Notice Issued', 'Preliminary acquisition notice issued for Khasra 101, Village Nagla, Fatehabad, Agra.', 'NOTICE', 'CITIZEN', 'citizen@demo.com', 'CASE-2026-DME-0101', '101', FALSE, NOW()),
(2, 'NOTIF-002', 'Ground RoR Verification Pending', 'CALA desk assigned joint ground-truthing for Khasra 102 (Spelling Mismatch).', 'ACTION_REQUIRED', 'GOVERNMENT_OFFICER', 'officer@demo.gov.in', 'CASE-2026-DME-0102', '102', FALSE, NOW()),
(3, 'NOTIF-003', 'Section 19 Sanction Ready', 'Award determination packages for Delhi-Meerut Expressway awaiting DM e-Sign.', 'APPROVAL_REQUEST', 'DISTRICT_AUTHORITY', 'district.officer@bhoomisetu.gov.in', 'CASE-2026-DME-0103', '103', FALSE, NOW()),
(4, 'NOTIF-004', 'DBT PFMS Compensation Credited', '₹3.78 Cr compensation successfully released to Sh. Mahendra Singh via PFMS-DBT.', 'PAYMENT', 'CITIZEN', 'mahendra.singh@example.com', 'CASE-2026-DME-0104', '104', TRUE, NOW()),
(5, 'NOTIF-005', 'Officer Registration Awaiting Approval', 'Naib Tehsildar Sh. Amit Kumar Verma registered and awaiting IAM Admin approval.', 'SECURITY', 'ADMIN', 'admin@bhoomisetu.gov.in', NULL, NULL, FALSE, NOW())
ON DUPLICATE KEY UPDATE created_at = NOW();
