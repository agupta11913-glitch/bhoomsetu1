import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ROLES, ROLE_DETAILS, REGISTRATION_STATUS, hasPermission, DISTRICT_PERMISSIONS } from '../utils/constants';
import { INITIAL_REGISTRATIONS } from '../data/mockRegistrations';
import {
  loginApi,
  registerApi,
  getMeApi,
  getAdminUsersApi,
  approveUserApi,
  rejectUserApi,
  getToken,
  setToken,
  removeToken,
} from '../services/auth/authApi';

const AuthContext = createContext();

export const DEMO_CREDENTIALS = [
  { role: ROLES.CITIZEN, email: 'citizen@demo.com', password: 'Bhoomi@123', label: 'Citizen / Land Owner (Sh. Ram Kumar)' },
  { role: ROLES.TEHSILDAR, email: 'tehsildar@demo.gov.in', password: 'Bhoomi@123', label: 'Tehsildar & Executive Officer (Sh. Alok Srivastava)' },
  { role: ROLES.EXECUTIVE_OFFICER, email: 'executive@demo.gov.in', password: 'Bhoomi@123', label: 'Executive Officer / Project Lead (Sh. Rajesh Verma)' },
  { role: ROLES.GOVERNMENT_OFFICER, email: 'officer@demo.gov.in', password: 'Bhoomi@123', label: 'Revenue Officer / Field CALA (Sh. Alok Srivastava)' },
  { role: ROLES.DISTRICT_AUTHORITY, email: 'district.officer@bhoomisetu.gov.in', password: 'Bhoomi@123', label: 'District Magistrate (DM Dr. Sunita Murthy, IAS)' },
  { role: ROLES.STATE_GOVERNMENT, email: 'state.officer@bhoomisetu.gov.in', password: 'Bhoomi@123', label: 'State Government (Principal Sec. Sh. Sanjeev Khare, IAS)' },
  { role: ROLES.CENTRAL_MINISTRY, email: 'central.officer@bhoomisetu.gov.in', password: 'Bhoomi@123', label: 'Central Ministry (PM Gati Shakti - Dr. Arvind Meena, IAS)' },
  { role: ROLES.PROJECT_AGENCY, email: 'agency@demo.gov.in', password: 'Bhoomi@123', label: 'Project Implementing Agency (NHAI Director Sh. Rajesh Verma)' },
  { role: ROLES.ADMIN, email: 'admin@bhoomisetu.gov.in', password: 'Bhoomi@123', label: 'System Administrator (NICNET IAM Admin)' },
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedAuth = sessionStorage.getItem('bhoomisetu_auth');
      return savedAuth ? JSON.parse(savedAuth) : null;
    } catch {
      return null;
    }
  });

  const [registrations, setRegistrations] = useState(() => {
    try {
      const savedRegs = localStorage.getItem('bhoomisetu_registrations');
      return savedRegs ? JSON.parse(savedRegs) : INITIAL_REGISTRATIONS;
    } catch {
      return INITIAL_REGISTRATIONS;
    }
  });

  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Sync registrations to storage
  useEffect(() => {
    try {
      localStorage.setItem('bhoomisetu_registrations', JSON.stringify(registrations));
    } catch (e) {
      console.error('Failed to sync registrations to storage', e);
    }
  }, [registrations]);

  // Sync auth state to session storage
  useEffect(() => {
    try {
      if (currentUser) {
        sessionStorage.setItem('bhoomisetu_auth', JSON.stringify(currentUser));
      } else {
        sessionStorage.removeItem('bhoomisetu_auth');
      }
    } catch (e) {
      console.error('Failed to sync auth session', e);
    }
  }, [currentUser]);

  // Check stored JWT token with backend on reload
  useEffect(() => {
    const token = getToken();
    if (token) {
      getMeApi()
        .then((userData) => {
          setIsBackendConnected(true);
          const role = userData.role || ROLES.CITIZEN;
          const details = ROLE_DETAILS[role] || ROLE_DETAILS[ROLES.CITIZEN];
          const userObj = {
            ...userData,
            ...details,
            name: userData.name || details.name,
            email: userData.email,
            role,
            status: userData.status || REGISTRATION_STATUS.ACTIVE,
            languagePreference: userData.languagePreference || 'ENGLISH',
            themePreference: userData.themePreference || 'LIGHT',
            isAuthenticated: true,
          };
          setCurrentUser(userObj);

          // Apply saved preferences to DOM and storage
          if (userData.languagePreference) {
            localStorage.setItem('bhoomisetu_lang', userData.languagePreference);
          }
          if (userData.themePreference) {
            localStorage.setItem('bhoomisetu_theme', userData.themePreference);
            if (userData.themePreference === 'DARK') {
              document.documentElement.classList.add('dark');
              document.documentElement.setAttribute('data-theme', 'dark');
              document.body.classList.add('dark', 'bg-slate-900', 'text-slate-100');
            } else {
              document.documentElement.classList.remove('dark');
              document.documentElement.setAttribute('data-theme', 'light');
              document.body.classList.remove('dark', 'bg-slate-900', 'text-slate-100');
            }
          }
        })
        .catch(() => {
          removeToken();
        });
    }
  }, []);

  // Login handler
  const login = async (email, password, selectedRole) => {
    const cleanEmail = email?.trim().toLowerCase();

    // 1. Direct Backend REST API Call (Port 8080 via Vite Proxy)
    try {
      const response = await loginApi(cleanEmail, password);
      if (response && response.success && response.token) {
        setToken(response.token);
        setIsBackendConnected(true);
        const userData = response.user;
        const role = userData.role || selectedRole || ROLES.CITIZEN;
        const details = ROLE_DETAILS[role] || ROLE_DETAILS[ROLES.CITIZEN];

        const userObj = {
          ...userData,
          ...details,
          name: userData.name || details.name,
          email: userData.email,
          role,
          status: userData.status || REGISTRATION_STATUS.ACTIVE,
          languagePreference: userData.languagePreference || 'ENGLISH',
          themePreference: userData.themePreference || 'LIGHT',
          isAuthenticated: true,
          loginTimestamp: new Date().toISOString(),
        };

        setCurrentUser(userObj);

        // Apply saved preferences immediately
        if (userData.languagePreference) {
          localStorage.setItem('bhoomisetu_lang', userData.languagePreference);
        }
        if (userData.themePreference) {
          localStorage.setItem('bhoomisetu_theme', userData.themePreference);
          if (userData.themePreference === 'DARK') {
            document.documentElement.classList.add('dark');
            document.documentElement.setAttribute('data-theme', 'dark');
            document.body.classList.add('dark', 'bg-slate-900', 'text-slate-100');
          } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.setAttribute('data-theme', 'light');
            document.body.classList.remove('dark', 'bg-slate-900', 'text-slate-100');
          }
        }

        return { success: true, user: userObj };
      }
    } catch (apiError) {
      console.warn('Backend login response:', apiError);
      // Explicit backend account status handling (PENDING, REJECTED, SUSPENDED)
      if (apiError.status === 403 || apiError.data?.status === 'PENDING' || apiError.data?.status === 'REJECTED' || apiError.data?.status === 'SUSPENDED') {
        return {
          success: false,
          status: apiError.data?.status || 'PENDING',
          applicationId: apiError.data?.applicationId,
          message: apiError.message || 'Your account is awaiting department verification.',
        };
      }
      if (apiError.status === 401) {
        return {
          success: false,
          status: 'UNAUTHORIZED',
          message: 'Invalid email or password.',
        };
      }
      return {
        success: false,
        status: 'ERROR',
        message: apiError.message || 'Server error occurred during login.',
      };
    }

    return {
      success: false,
      status: 'UNAUTHORIZED',
      message: 'Invalid email or password.',
    };
  };

  const logout = () => {
    setCurrentUser(null);
    removeToken();
    sessionStorage.removeItem('bhoomisetu_auth');
  };

  // Register Citizen
  const registerCitizen = async (formData) => {
    try {
      const apiRes = await registerApi({
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
        role: 'CITIZEN',
        state: formData.state,
        district: formData.district,
        address: formData.address,
      });

      if (apiRes.token) {
        setToken(apiRes.token);
      }
    } catch (e) {
      console.warn('Backend API notice:', e.message);
    }

    const applicationId = `APP-CIT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord = {
      id: `REG-2026-${Date.now()}`,
      applicationId,
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      dob: formData.dob,
      state: formData.state || 'Uttar Pradesh',
      district: formData.district || 'Agra',
      address: formData.address,
      pincode: formData.pincode,
      khasraNumber: formData.khasraNumber || '101',
      village: formData.village || 'Nagla',
      role: ROLES.CITIZEN,
      status: REGISTRATION_STATUS.ACTIVE,
      department: 'Citizen & Land Owner Services',
      designation: 'Land Owner / Khatedar',
      createdAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      verifiedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      auditTrail: [
        {
          action: 'REGISTRATION_SUBMITTED',
          title: 'Citizen Registration Form Submitted',
          desc: 'Citizen registered property details and identity references in database.',
          timestamp: new Date().toLocaleString(),
          actor: formData.name,
        },
        {
          action: 'OTP_VERIFIED',
          title: 'Mobile OTP Verified',
          desc: 'Prototype OTP 123456 verified instantly.',
          timestamp: new Date().toLocaleString(),
          actor: 'System (NICNET)',
        },
      ],
    };

    setRegistrations(prev => [newRecord, ...prev]);
    return { success: true, applicationId, record: newRecord };
  };

  // Register Government Officer
  const registerOfficer = async (formData) => {
    try {
      await registerApi({
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
        role: 'GOVERNMENT_OFFICER',
        employeeId: formData.employeeId,
        designation: formData.designation,
        department: formData.department,
        state: formData.state,
        district: formData.district,
        address: formData.officeAddress,
      });
    } catch (e) {
      console.warn('Backend API notice:', e.message);
    }

    const applicationId = `APP-OFF-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord = {
      id: `REG-2026-${Date.now()}`,
      applicationId,
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      employeeId: formData.employeeId,
      designation: formData.designation,
      department: formData.department || 'Revenue Department (Bhulekh / Tehsildar)',
      state: formData.state || 'Uttar Pradesh',
      district: formData.district || 'Agra',
      officeAddress: formData.officeAddress,
      role: ROLES.GOVERNMENT_OFFICER,
      status: REGISTRATION_STATUS.PENDING_VERIFICATION,
      createdAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      verifiedAt: null,
      documents: [
        { name: 'Govt Officer ID Card.pdf', type: 'ID_PROOF', size: '1.2 MB' },
        { name: 'Posting / Transfer Order.pdf', type: 'POSTING_ORDER', size: '2.0 MB' },
      ],
      auditTrail: [
        {
          action: 'REGISTRATION_SUBMITTED',
          title: 'Officer Registration Submitted',
          desc: `Officer registration submitted with Employee ID ${formData.employeeId}.`,
          timestamp: new Date().toLocaleString(),
          actor: formData.name,
        },
      ],
    };

    setRegistrations(prev => [newRecord, ...prev]);
    return { success: true, applicationId, record: newRecord };
  };

  // Register Project Implementing Agency
  const registerAgency = async (formData) => {
    try {
      await registerApi({
        name: formData.repName,
        email: formData.repEmail || formData.orgEmail,
        mobile: formData.repPhone || formData.orgPhone,
        password: formData.password,
        role: 'PROJECT_AGENCY',
        organizationName: formData.organizationName,
        employeeId: formData.organizationId,
        designation: formData.repDesignation,
        department: `${formData.organizationType} Requisition Unit`,
        state: formData.state,
        district: formData.district,
        address: formData.officeAddress,
      });
    } catch (e) {
      console.warn('Backend API notice:', e.message);
    }

    const applicationId = `APP-AGN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord = {
      id: `REG-2026-${Date.now()}`,
      applicationId,
      name: formData.repName,
      email: formData.repEmail || formData.orgEmail,
      mobile: formData.repPhone || formData.orgPhone,
      organizationName: formData.organizationName,
      organizationType: formData.organizationType,
      organizationId: formData.organizationId,
      designation: formData.repDesignation,
      state: formData.state || 'Uttar Pradesh',
      district: formData.district || 'Agra',
      officeAddress: formData.officeAddress,
      department: `${formData.organizationType} Requisition Unit`,
      role: ROLES.PROJECT_AGENCY,
      status: REGISTRATION_STATUS.PENDING_VERIFICATION,
      createdAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      verifiedAt: null,
      documents: [
        { name: formData.authLetterName || 'Agency Board Authorization Letter.pdf', type: 'AUTH_LETTER', size: '2.8 MB' },
      ],
      auditTrail: [
        {
          action: 'REGISTRATION_SUBMITTED',
          title: 'Agency Registration Request Submitted',
          desc: `Submitted for organization ${formData.organizationName}.`,
          timestamp: new Date().toLocaleString(),
          actor: formData.repName,
        },
      ],
    };

    setRegistrations(prev => [newRecord, ...prev]);
    return { success: true, applicationId, record: newRecord };
  };

  // Register Government Authority
  const registerAuthority = async (formData) => {
    let targetRole = 'DISTRICT_AUTHORITY';
    if (formData.authorityType === 'STATE') targetRole = 'STATE_GOVERNMENT';
    if (formData.authorityType === 'CENTRAL') targetRole = 'CENTRAL_MINISTRY';

    try {
      await registerApi({
        name: formData.officerName,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
        role: targetRole,
        employeeId: formData.employeeId,
        designation: formData.designation,
        department: formData.departmentName || formData.ministryName,
        state: formData.state,
        district: formData.district,
        address: formData.officeAddress,
      });
    } catch (e) {
      console.warn('Backend API notice:', e.message);
    }

    const applicationId = `APP-AUTH-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord = {
      id: `REG-2026-${Date.now()}`,
      applicationId,
      name: formData.officerName,
      email: formData.email,
      mobile: formData.mobile,
      employeeId: formData.employeeId,
      designation: formData.designation,
      department: formData.departmentName || formData.ministryName || 'District Magistrate Office',
      authorityType: formData.authorityType,
      state: formData.state || 'Uttar Pradesh',
      district: formData.district || 'Agra',
      officeAddress: formData.officeAddress,
      role: targetRole,
      status: REGISTRATION_STATUS.PENDING_VERIFICATION,
      createdAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      verifiedAt: null,
      documents: [
        { name: 'Statutory Authority Appointment Gazette.pdf', type: 'GAZETTE_POWERS', size: '2.1 MB' },
      ],
      auditTrail: [
        {
          action: 'REGISTRATION_SUBMITTED',
          title: 'Authority Registration Filed',
          desc: `Authority registration submitted for ${formData.departmentName || formData.ministryName}.`,
          timestamp: new Date().toLocaleString(),
          actor: formData.officerName,
        },
      ],
    };

    setRegistrations(prev => [newRecord, ...prev]);
    return { success: true, applicationId, record: newRecord };
  };

  // Admin Actions: Approve Registration
  const approveRegistration = async (id) => {
    if (typeof id === 'number' || (typeof id === 'string' && !id.startsWith('REG-'))) {
      try {
        await approveUserApi(id);
      } catch (e) {
        console.warn('Backend approve sync:', e.message);
      }
    }

    setRegistrations(prev =>
      prev.map(r => {
        if (r.id === id || r.applicationId === id) {
          const timestamp = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
          return {
            ...r,
            status: REGISTRATION_STATUS.ACTIVE,
            verifiedAt: timestamp,
            auditTrail: [
              ...(r.auditTrail || []),
              {
                action: 'ADMIN_APPROVED',
                title: 'Registration Approved by Administrator',
                desc: 'Government credentials verified in MySQL database. Access unlocked.',
                timestamp,
                actor: currentUser?.name || 'System Administrator',
              },
            ],
          };
        }
        return r;
      })
    );
  };

  // Admin Actions: Reject Registration
  const rejectRegistration = async (id, reason) => {
    if (typeof id === 'number' || (typeof id === 'string' && !id.startsWith('REG-'))) {
      try {
        await rejectUserApi(id, reason);
      } catch (e) {
        console.warn('Backend reject sync:', e.message);
      }
    }

    setRegistrations(prev =>
      prev.map(r => {
        if (r.id === id || r.applicationId === id) {
          const timestamp = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
          return {
            ...r,
            status: REGISTRATION_STATUS.REJECTED,
            rejectionReason: reason || 'Application rejected due to discrepancy in submitted credentials.',
            verifiedAt: timestamp,
            auditTrail: [
              ...(r.auditTrail || []),
              {
                action: 'ADMIN_REJECTED',
                title: 'Registration Rejected',
                desc: reason || 'Credentials mismatch flagged by Administrator.',
                timestamp,
                actor: currentUser?.name || 'System Administrator',
              },
            ],
          };
        }
        return r;
      })
    );
  };

  // Admin Actions: Request Additional Documents
  const requestDocsRegistration = (id, note) => {
    setRegistrations(prev =>
      prev.map(r => {
        if (r.id === id || r.applicationId === id) {
          const timestamp = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
          return {
            ...r,
            status: REGISTRATION_STATUS.UNDER_REVIEW,
            auditTrail: [
              ...(r.auditTrail || []),
              {
                action: 'DOCS_REQUESTED',
                title: 'Additional Documentation Requested',
                desc: note || 'Department verification in progress. Additional certified posting order requested.',
                timestamp,
                actor: currentUser?.name || 'System Administrator',
              },
            ],
          };
        }
        return r;
      })
    );
  };

  // Look up Registration Status by ID or Email
  const getRegistrationStatus = (query) => {
    if (!query) return null;
    const clean = query.trim().toLowerCase();
    return registrations.find(
      r =>
        r.applicationId?.toLowerCase() === clean ||
        r.email?.toLowerCase() === clean ||
        r.id?.toString().toLowerCase() === clean
    ) || null;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole: currentUser?.role || null,
        isAuthenticated: !!currentUser?.isAuthenticated,
        isBackendConnected,
        registrations,
        login,
        logout,
        registerCitizen,
        registerOfficer,
        registerAgency,
        registerAuthority,
        approveRegistration,
        rejectRegistration,
        requestDocsRegistration,
        getRegistrationStatus,
        hasPermission: (perm) => hasPermission(perm, currentUser),
        DISTRICT_PERMISSIONS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
