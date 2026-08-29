import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '../../utils/permissions';

/**
 * PermissionGuard: Conditionally renders children if the authenticated user's role has permission.
 * Usage:
 *   <PermissionGuard permission="CASE_APPROVE" fallback={<DisabledButton />}>
 *     <ApproveButton />
 *   </PermissionGuard>
 */
export const PermissionGuard = ({
  permission,
  anyPermissions,
  allPermissions,
  fallback = null,
  children,
}) => {
  const { currentRole, currentUser } = useAuth();
  const role = currentRole || currentUser?.role;

  if (permission && !hasPermission(role, permission)) {
    return fallback;
  }

  if (anyPermissions && !hasAnyPermission(role, anyPermissions)) {
    return fallback;
  }

  if (allPermissions && !hasAllPermissions(role, allPermissions)) {
    return fallback;
  }

  return <>{children}</>;
};
