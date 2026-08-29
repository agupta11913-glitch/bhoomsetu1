-- =============================================================================
-- BHOOMISETU: Operational SQL Query Reference
-- =============================================================================

USE bhoomisetu;

-- 1. List all active users by role
SELECT id, name, email, role, status, department, state, district, created_at
FROM users
WHERE status = 'ACTIVE'
ORDER BY role, name;

-- 2. List all pending registration approvals for IAM Administrator
SELECT id, name, email, role, organization_name, department, employee_id, state, district, created_at
FROM users
WHERE status = 'PENDING'
ORDER BY created_at DESC;

-- 3. Query user details by email
SELECT id, name, email, role, status, language_preference, theme_preference
FROM users
WHERE email = 'citizen@demo.com';

-- 4. Count users grouped by role and status
SELECT role, status, COUNT(*) as count
FROM users
GROUP BY role, status;

-- 5. Approve a pending user
-- UPDATE users SET status = 'ACTIVE', updated_at = NOW() WHERE id = :userId;

-- 6. Reject a pending user with reason
-- UPDATE users SET status = 'REJECTED', rejection_reason = :reason, updated_at = NOW() WHERE id = :userId;
