import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PROJECTS } from '../data/mockProjects';
import { INITIAL_KHASRAS } from '../data/mockKhasras';
import { INITIAL_CASES } from '../data/mockCases';
import { INITIAL_RR_PACKAGES } from '../data/mockRR';
import { INITIAL_NOTICES } from '../data/mockNotices';
import { INITIAL_OBJECTIONS } from '../data/mockObjections';
import { INITIAL_AUDIT_LOGS } from '../data/mockAuditLogs';
import { INITIAL_USERS } from '../data/mockUsers';
import { useAuth } from './AuthContext';
import { CASE_WORKFLOW_STAGES } from '../utils/constants';

const LandDataContext = createContext();

const STORAGE_KEYS = {
  PROJECTS: 'bhoomisetu_projects_v4',
  KHASRAS: 'bhoomisetu_khasras_v4',
  CASES: 'bhoomisetu_cases_v4',
  RR_PACKAGES: 'bhoomisetu_rr_v4',
  NOTICES: 'bhoomisetu_notices_v4',
  OBJECTIONS: 'bhoomisetu_objections_v4',
  AUDIT_LOGS: 'bhoomisetu_audit_v4',
  USERS: 'bhoomisetu_users_v4',
  NOTIFICATIONS: 'bhoomisetu_notifications_v4',
  SYNC_STATS: 'bhoomisetu_sync_stats_v4',
};

const INITIAL_NOTIFICATIONS = [
  {
    id: 'NOTIF-01',
    title: 'Delhi–Meerut Expressway Proposal Ready',
    message: 'Package-1 alignment coordinates compiled for Delhi–Meerut Expressway Expansion (PRJ-001).',
    timestamp: '10 mins ago',
    type: 'info',
    read: false,
    targetRole: 'PROJECT_AGENCY'
  },
  {
    id: 'NOTIF-02',
    title: 'Joint Field Verification Pending',
    message: 'Khasra 101, 102 & 117 require joint Tehsildar & ETS survey demarcation in Nagla.',
    timestamp: '25 mins ago',
    type: 'warning',
    read: false,
    targetRole: 'FIELD_OFFICER'
  },
  {
    id: 'NOTIF-03',
    title: 'Section 19 Award Sanctions in Queue',
    message: '6 Compensation awards awaiting Collector digital sign-off under RFCTLARR 2013.',
    timestamp: '1 hour ago',
    type: 'info',
    read: false,
    targetRole: 'DISTRICT_OFFICER'
  },
  {
    id: 'NOTIF-04',
    title: 'High Delay Risk Flagged by AI',
    message: 'Chennai–Bengaluru Corridor (PRJ-005) flagged with 84% critical delay probability.',
    timestamp: '2 hours ago',
    type: 'alert',
    read: false,
    targetRole: 'CENTRAL_OFFICER'
  }
];

const INITIAL_SYNC_METRICS = {
  lastSyncTime: 'Today, 10:30 AM',
  totalRecordsSynced: 12458,
  successfulRecords: 12401,
  failedRecords: 57,
  apis: [
    { name: 'Land Records API (Bhulekh)', status: 'Connected', latency: '42ms', uptime: '99.98%' },
    { name: 'Registration API (NGDRS)', status: 'Connected', latency: '68ms', uptime: '99.94%' },
    { name: 'GIS/Cadastral API (Bhuvan/SOI)', status: 'Connected', latency: '85ms', uptime: '99.85%' },
    { name: 'Compensation/Payment API (PFMS)', status: 'Connected', latency: '110ms', uptime: '99.99%' },
    { name: 'Notification API (DigiLocker/SMS)', status: 'Connected', latency: '35ms', uptime: '99.95%' },
  ]
};

export const LandDataProvider = ({ children }) => {
  const { currentUser } = useAuth();

  // Initialize State
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [khasras, setKhasras] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.KHASRAS);
    return saved ? JSON.parse(saved) : INITIAL_KHASRAS;
  });

  const [cases, setCases] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CASES);
    return saved ? JSON.parse(saved) : INITIAL_CASES;
  });

  const [rrPackages, setRrPackages] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RR_PACKAGES);
    return saved ? JSON.parse(saved) : INITIAL_RR_PACKAGES;
  });

  const [notices, setNotices] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTICES);
    return saved ? JSON.parse(saved) : INITIAL_NOTICES;
  });

  const [objections, setObjections] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.OBJECTIONS);
    return saved ? JSON.parse(saved) : INITIAL_OBJECTIONS;
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [syncMetrics, setSyncMetrics] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SYNC_STATS);
    return saved ? JSON.parse(saved) : INITIAL_SYNC_METRICS;
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [backendLoaded, setBackendLoaded] = useState(false);

  // UI interaction states
  const [activeKhasraId, setActiveKhasraId] = useState('101');
  const [activeCaseId, setActiveCaseId] = useState('CASE-2026-DME-0101');
  const [mapCenterKhasra, setMapCenterKhasra] = useState('101');
  const [toasts, setToasts] = useState([]);

  // Fetch Authoritative GIS Land Parcels and Projects from Spring Boot Backend
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const [landsRes, projectsRes] = await Promise.allSettled([
          fetch('http://localhost:8080/api/lands'),
          fetch('http://localhost:8080/api/projects')
        ]);

        if (landsRes.status === 'fulfilled' && landsRes.value.ok) {
          const backendLands = await landsRes.value.json();
          if (Array.isArray(backendLands) && backendLands.length > 0) {
            const formatted = backendLands.map(p => {
              let coords = p.coordinates;
              if (!coords && p.coordinatesJson) {
                try { coords = JSON.parse(p.coordinatesJson); } catch (e) { coords = null; }
              }
              let affCoords = p.affectedCoordinates;
              if (!affCoords && p.affectedCoordinatesJson) {
                try { affCoords = JSON.parse(p.affectedCoordinatesJson); } catch (e) { affCoords = null; }
              }
              return {
                ...p,
                coordinates: coords || p.coordinates,
                affectedCoordinates: affCoords || p.affectedCoordinates,
                areaAcre: p.areaAcre || 2.50,
                affectedAreaAcre: p.affectedAreaAcre != null ? p.affectedAreaAcre : 0.80,
                remainingAreaAcre: p.remainingAreaAcre != null ? p.remainingAreaAcre : 1.70,
              };
            });
            setKhasras(prev => {
              return prev.map(local => {
                const b = formatted.find(item => item.khasraNumber === local.khasraNumber);
                return b ? { ...local, ...b } : local;
              });
            });
            setBackendLoaded(true);
            console.log('✅ BhoomiSetu: Loaded Authoritative Land Parcels & Geometries from Backend API');
          }
        }

        if (projectsRes.status === 'fulfilled' && projectsRes.value.ok) {
          const backendProjects = await projectsRes.value.json();
          if (Array.isArray(backendProjects) && backendProjects.length > 0) {
            const formattedPrjs = backendProjects.map(pr => {
              let coords = pr.coordinates;
              if (!coords && pr.coordinatesJson) {
                try { coords = JSON.parse(pr.coordinatesJson); } catch (e) { coords = null; }
              }
              let alignCoords = pr.alignmentCoordinates;
              if (!alignCoords && pr.alignmentCoordinatesJson) {
                try { alignCoords = JSON.parse(pr.alignmentCoordinatesJson); } catch (e) { alignCoords = null; }
              }
              return {
                ...pr,
                coordinates: coords || pr.coordinates,
                alignmentCoordinates: alignCoords || pr.alignmentCoordinates,
              };
            });
            setProjects(prev => {
              return prev.map(local => {
                const b = formattedPrjs.find(item => item.projectId === local.id || item.projectId === local.projectId);
                return b ? { ...local, ...b } : local;
              });
            });
            console.log('✅ BhoomiSetu: Loaded Authoritative Project Geometries from Backend API');
          }
        }
      } catch (err) {
        console.warn('Backend GIS API offline, using cached/seed dataset:', err);
      }
    };

    fetchBackendData();
  }, [currentUser]);

  // Auto-sync with LocalStorage
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.KHASRAS, JSON.stringify(khasras)); }, [khasras]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(cases)); }, [cases]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.RR_PACKAGES, JSON.stringify(rrPackages)); }, [rrPackages]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(notices)); }, [notices]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.OBJECTIONS, JSON.stringify(objections)); }, [objections]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs)); }, [auditLogs]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SYNC_STATS, JSON.stringify(syncMetrics)); }, [syncMetrics]);

  // Toast Dispatcher Helper
  const showToast = (title, message, type = 'success') => {
    const id = Date.now().toString();
    const newToast = { id, title, message, type };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Helper: Append Tamper-evident Audit Log
  const logAction = (action, project, khasra, details) => {
    const newLog = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: currentUser?.name || 'Authorized Officer',
      role: currentUser?.role || 'SYSTEM',
      action,
      project: project || 'Delhi–Meerut Expressway (PRJ-001)',
      khasra: khasra || 'N/A',
      ipAddress: '10.14.88.24 (Gov LAN)',
      status: 'SUCCESS',
      details,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Helper: Dispatch in-app notification
  const notify = (title, message, type = 'info', targetRole = 'ALL') => {
    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      title,
      message,
      timestamp: 'Just now',
      type,
      read: false,
      targetRole,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Recalculate Project Aggregates whenever Khasras or Cases change
  const refreshProjectStats = (updatedKhasras) => {
    setProjects(prevProjects => {
      return prevProjects.map(proj => {
        const projKhasras = updatedKhasras.filter(k => k.projectId === proj.id);
        const acquired = projKhasras.filter(k => k.isAcquired || k.status === 'ACQUIRED' || k.gisStatus === 'ACQUIRED').reduce((acc, curr) => acc + curr.areaAcre, 0);
        const verified = projKhasras.filter(k => k.revenueVerified && k.gisVerified).reduce((acc, curr) => acc + curr.areaAcre, 0);
        const baseRequired = proj.requiredLand;
        const pending = Math.max(0, baseRequired - acquired);
        
        const disbursed = projKhasras
          .filter(k => k.status === 'COMPENSATION_PAID' || k.status === 'ACQUIRED')
          .reduce((acc, curr) => acc + curr.totalCompensation, 0);

        return {
          ...proj,
          acquiredLand: Number(acquired.toFixed(1)),
          pendingLand: Number(pending.toFixed(1)),
          verifiedLand: Number(Math.max(proj.verifiedLand, verified).toFixed(1)),
          disbursedCompensation: Math.max(proj.disbursedCompensation, disbursed),
        };
      });
    });
  };

  // ADVANCE CASE STAGE (End-to-End Workflow Engine for SIH Judges)
  const advanceCaseStage = (caseId, targetStage, notes = '') => {
    const stageOrder = CASE_WORKFLOW_STAGES.map(s => s.id);
    
    setCases(prevCases => {
      return prevCases.map(c => {
        if (c.id === caseId) {
          const currentIndex = stageOrder.indexOf(c.currentStage);
          const nextIndex = targetStage ? stageOrder.indexOf(targetStage) : Math.min(stageOrder.length - 1, currentIndex + 1);
          const newStage = stageOrder[nextIndex];
          const stageConfig = CASE_WORKFLOW_STAGES[nextIndex];

          // Additional state mutations based on stage
          let updatedPaymentStatus = c.paymentStatus;
          let updatedPaymentUtr = c.paymentUtr;
          let updatedPaymentDate = c.paymentDate;
          let updatedStatus = `Stage ${nextIndex + 1}: ${stageConfig.label}`;

          if (newStage === 'COMPENSATION_PAYMENT') {
            updatedPaymentStatus = 'DBT Credit Successful';
            updatedPaymentUtr = `PFMS/RBI/2026/${Math.floor(100000000 + Math.random() * 900000000)}`;
            updatedPaymentDate = new Date().toISOString().split('T')[0];
          } else if (newStage === 'COMPLETED') {
            updatedStatus = 'Acquired & Vested in Project Agency';
          }

          const newApproval = {
            stage: stageConfig.label,
            authority: currentUser?.name || 'Competent Authority',
            date: new Date().toISOString().split('T')[0],
            status: 'Approved / Executed',
            remarks: notes || `Stage advanced to ${stageConfig.label} by ${currentUser?.badge || 'Authorized Officer'}.`,
          };

          const updatedTimeline = c.timeline.map((t, idx) => {
            if (idx <= nextIndex) {
              return { ...t, completed: true, date: t.completed ? t.date : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) };
            }
            return t;
          });

          return {
            ...c,
            currentStage: newStage,
            status: updatedStatus,
            paymentStatus: updatedPaymentStatus,
            paymentUtr: updatedPaymentUtr,
            paymentDate: updatedPaymentDate,
            approvalHistory: [newApproval, ...c.approvalHistory],
            timeline: updatedTimeline,
          };
        }
        return c;
      });
    });

    // Also update matching Khasra in GIS map
    const targetCase = cases.find(c => c.id === caseId);
    if (targetCase) {
      let nextGisStatus = 'UNDER_VERIFICATION';
      if (['COMPENSATION_PAYMENT', 'COMPENSATION_ASSESSMENT'].includes(targetStage)) nextGisStatus = 'COMPENSATION_PENDING';
      else if (['POSSESSION', 'RR_MONITORING', 'COMPLETED'].includes(targetStage)) nextGisStatus = 'ACQUIRED';
      else if (targetStage === 'OBJECTION_CLAIM') nextGisStatus = 'DISPUTED';

      const updatedKhasras = khasras.map(k => {
        if (k.khasraNumber === targetCase.surveyNumber || k.caseId === caseId) {
          return {
            ...k,
            gisStatus: nextGisStatus,
            status: targetStage === 'COMPLETED' ? 'ACQUIRED' : targetStage === 'COMPENSATION_PAYMENT' ? 'COMPENSATION_PAID' : k.status,
            isAcquired: targetStage === 'COMPLETED' || targetStage === 'POSSESSION',
          };
        }
        return k;
      });
      setKhasras(updatedKhasras);
      refreshProjectStats(updatedKhasras);
    }

    logAction('Case Lifecycle Stage Advanced', targetCase?.projectName || 'Corridor Case', `Case ${caseId}`, `Advanced to stage: ${targetStage || 'Next'}. Notes: ${notes}`);
    notify('Case Stage Updated', `Case ${caseId} (${targetCase?.ownerName || 'Land Owner'}) advanced to ${targetStage}.`, 'success', 'ALL');
    showToast('Stage Advanced', `Case ${caseId} moved to ${targetStage.replace(/_/g, ' ')}.`, 'success');
  };

  // Simulated API Mesh Sync
  const syncGovernmentAPIs = async () => {
    setIsSyncing(true);
    showToast('API Gateway Syncing', 'Connecting to Bhulekh, NGDRS, Bhuvan GIS, PFMS and DigiLocker simulated services...', 'info');

    setTimeout(() => {
      const now = new Date();
      const timeString = `Today, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
      const updatedMetrics = {
        lastSyncTime: timeString,
        totalRecordsSynced: syncMetrics.totalRecordsSynced + 128,
        successfulRecords: syncMetrics.successfulRecords + 126,
        failedRecords: syncMetrics.failedRecords + 2,
        apis: syncMetrics.apis.map(api => ({
          ...api,
          latency: `${Math.floor(30 + Math.random() * 60)}ms`,
          status: 'Connected',
        }))
      };
      setSyncMetrics(updatedMetrics);
      setIsSyncing(false);
      logAction('API Gateway Resynchronized', 'National API Mesh', '5 Microservices', 'Synchronized 128 fresh mutation and cadastral survey records.');
      showToast('Sync Successful', 'Simulated Government APIs synchronized with 0 critical network dropouts.', 'success');
    }, 1800);
  };

  // 1. Revenue Officer Action: Verify Land Record
  const verifyRevenueRecord = (khasraId, notes = 'Bhulekh RoR matched with certified Khatauni extract.') => {
    let updatedKhasraName = '';
    const updated = khasras.map(k => {
      if (k.id === khasraId || k.khasraNumber === khasraId) {
        updatedKhasraName = `Khasra ${k.khasraNumber}`;
        const newStatus = k.gisVerified ? 'SELECTED' : 'REVENUE_VERIFIED';
        return {
          ...k,
          revenueVerified: true,
          revenueOfficerNotes: notes,
          status: newStatus,
          gisStatus: 'UNDER_VERIFICATION',
          previousStatus: k.status,
        };
      }
      return k;
    });

    setKhasras(updated);
    refreshProjectStats(updated);
    logAction('Revenue Record Verified', 'Delhi–Meerut Expressway (PRJ-001)', updatedKhasraName, notes);
    notify('Revenue Record Verified', `${updatedKhasraName} ownership verified against Bhulekh records.`, 'success', 'PROJECT_AGENCY');
    showToast('Record Verified', `${updatedKhasraName} successfully verified by Revenue Officer.`, 'success');
  };

  // 2. GIS Officer Action: Verify / Approve Boundary
  const verifyGISBoundary = (khasraId, notes = 'Cadastral coordinates verified with zero corridor overlap.') => {
    let updatedKhasraName = '';
    const updated = khasras.map(k => {
      if (k.id === khasraId || k.khasraNumber === khasraId) {
        updatedKhasraName = `Khasra ${k.khasraNumber}`;
        const newStatus = k.revenueVerified ? 'SELECTED' : 'GIS_VERIFIED';
        return {
          ...k,
          gisVerified: true,
          gisOfficerNotes: notes,
          status: newStatus,
          gisStatus: 'UNDER_VERIFICATION',
          previousStatus: k.status,
        };
      }
      return k;
    });

    setKhasras(updated);
    refreshProjectStats(updated);
    logAction('GIS Boundary Approved', 'Delhi–Meerut Expressway (PRJ-001)', updatedKhasraName, notes);
    notify('GIS Boundary Approved', `${updatedKhasraName} coordinates validated by GIS division.`, 'success', 'PROJECT_AGENCY');
    showToast('Boundary Approved', `${updatedKhasraName} GIS boundary georeferenced and approved.`, 'success');
  };

  // 3. Toggle Parcel Selection
  const toggleParcelSelection = (khasraId) => {
    let selectedNow = false;
    let khasraNum = '';
    const updated = khasras.map(k => {
      if (k.id === khasraId || k.khasraNumber === khasraId) {
        selectedNow = !k.selectedForAcquisition;
        khasraNum = k.khasraNumber;
        return {
          ...k,
          selectedForAcquisition: selectedNow,
          status: selectedNow ? 'SELECTED' : 'IDENTIFIED',
          gisStatus: selectedNow ? 'UNDER_VERIFICATION' : 'PROPOSED',
        };
      }
      return k;
    });

    setKhasras(updated);
    refreshProjectStats(updated);
    logAction(selectedNow ? 'Parcel Added to Acquisition' : 'Parcel Removed from Selection', 'Delhi–Meerut Expressway (PRJ-001)', `Khasra ${khasraNum}`, `Acquisition package status modified.`);
    showToast(selectedNow ? 'Added to Acquisition' : 'Removed from Selection', `Khasra ${khasraNum} ${selectedNow ? 'included in' : 'removed from'} active acquisition corridor.`, 'info');
  };

  // 4. Issue Section 11 Statutory Notice
  const issueSection11Notice = (khasraId, customParams = {}) => {
    const targetKhasra = khasras.find(k => k.id === khasraId || k.khasraNumber === khasraId);
    if (!targetKhasra) return;

    const noticeId = `NOT-2026-${Math.floor(100 + Math.random() * 900)}`;
    const issueDate = new Date().toISOString().split('T')[0];
    const deadline = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const newNotice = {
      id: noticeId,
      noticeNumber: `SLAO/DME/2026/SEC11-${khasraId}`,
      type: 'Preliminary Notification (Section 11, RFCTLARR Act 2013)',
      projectId: targetKhasra.projectId,
      projectName: targetKhasra.projectName,
      khasraNumber: targetKhasra.khasraNumber,
      ownerName: targetKhasra.ownerName,
      areaAcre: targetKhasra.areaAcre,
      village: targetKhasra.village,
      tehsil: targetKhasra.tehsil,
      district: targetKhasra.district,
      issueDate,
      objectionDeadline: deadline,
      hearingDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      issuingAuthority: 'Competent Authority for Land Acquisition (CALA), NHAI Meerut/Agra',
      status: 'Notice Issued (Objection Period Active)',
      gazetteRef: 'UP Gazette Extraordinary Pt. IV, Issue No. 118',
      ...customParams,
    };

    setNotices(prev => [newNotice, ...prev]);

    const updatedKhasras = khasras.map(k => {
      if (k.id === khasraId || k.khasraNumber === khasraId) {
        return {
          ...k,
          noticeIssued: true,
          noticeId,
          noticeDate: issueDate,
          objectionDeadline: deadline,
          status: 'NOTICE_ISSUED',
          gisStatus: 'UNDER_VERIFICATION',
          selectedForAcquisition: true,
        };
      }
      return k;
    });

    setKhasras(updatedKhasras);
    refreshProjectStats(updatedKhasras);
    logAction('Section 11 Notice Issued', targetKhasra.projectName, `Khasra ${targetKhasra.khasraNumber}`, `Statutory notification published for ${targetKhasra.ownerName}.`);
    notify('Statutory Notice Issued', `Official acquisition notice published for Khasra ${targetKhasra.khasraNumber} (${targetKhasra.ownerName}). SMS & WhatsApp dispatch simulated.`, 'warning', 'CITIZEN');
    showToast('Notice Published', `Section 11 Gazette Notice issued for Khasra ${targetKhasra.khasraNumber}.`, 'success');
  };

  // 5. Submit Citizen Objection
  const submitCitizenObjection = ({
    khasraNumber,
    reason,
    description,
    supportingDocument = 'Land Registry Extract & Revenue Map',
    attachmentUrl = null,
    attachmentName = null,
    attachmentType = 'image/jpeg',
    attachmentSize = null,
  }) => {
    const objId = `OBJ-2026-${Math.floor(100 + Math.random() * 900)}`;
    const targetKhasra = khasras.find(k => k.khasraNumber === khasraNumber) || khasras[0];

    const newObjection = {
      id: objId,
      khasraNumber: targetKhasra.khasraNumber,
      projectId: targetKhasra.projectId,
      projectName: targetKhasra.projectName,
      ownerName: targetKhasra.ownerName,
      ownerEmail: targetKhasra.email || 'owner@example.com',
      ownerPhone: targetKhasra.phone || '+91 98765 43210',
      submissionDate: new Date().toISOString().split('T')[0],
      category: 'Measurement & Boundary Verification Claim',
      reason,
      description,
      status: 'Under Review',
      supportingDocument,
      attachmentUrl,
      attachmentName,
      attachmentType,
      attachmentSize,
      hearingScheduled: 'Pending CALA Scheduling',
      officerResponse: '',
      reviewedBy: null,
      reviewDate: null,
      actionTaken: 'PENDING_OFFICER_REVIEW'
    };

    setObjections(prev => [newObjection, ...prev]);

    const updatedKhasras = khasras.map(k => {
      if (k.khasraNumber === targetKhasra.khasraNumber) {
        return {
          ...k,
          hasObjection: true,
          objectionId: objId,
          status: 'OBJECTION_PERIOD',
          gisStatus: 'DISPUTED',
        };
      }
      return k;
    });

    setKhasras(updatedKhasras);
    refreshProjectStats(updatedKhasras);
    logAction('Citizen Objection Logged', targetKhasra.projectName, `Khasra ${targetKhasra.khasraNumber}`, `Claim filed by ${targetKhasra.ownerName}: "${reason}"`);
    notify('New Citizen Objection Submitted', `Land Owner ${targetKhasra.ownerName} submitted objection ${objId} for Khasra ${targetKhasra.khasraNumber}.`, 'alert', 'FIELD_OFFICER');
    showToast('Objection Submitted', `Objection ${objId} successfully registered and assigned for hearing.`, 'success');
  };

  // 6. Review Objection
  const reviewObjection = (objectionId, decision = 'ACCEPTED', responseNotes = 'Field re-verification confirmed area parameters.') => {
    let affectedKhasraNum = '';
    const updatedObjections = objections.map(obj => {
      if (obj.id === objectionId) {
        affectedKhasraNum = obj.khasraNumber;
        return {
          ...obj,
          status: decision === 'ACCEPTED' ? 'Resolved / Accepted' : 'Rejected / Overruled',
          actionTaken: decision,
          officerResponse: responseNotes,
          reviewedBy: currentUser?.name || 'Sh. Alok Srivastava (Tehsildar)',
          reviewDate: new Date().toISOString().split('T')[0],
        };
      }
      return obj;
    });

    setObjections(updatedObjections);

    const updatedKhasras = khasras.map(k => {
      if (k.khasraNumber === affectedKhasraNum) {
        return {
          ...k,
          status: 'APPROVED',
          gisStatus: 'COMPENSATION_PENDING',
        };
      }
      return k;
    });

    setKhasras(updatedKhasras);
    refreshProjectStats(updatedKhasras);
    logAction('Objection Hearing Completed', 'Delhi–Meerut Expressway (PRJ-001)', `Khasra ${affectedKhasraNum}`, `Decision: ${decision}. Notes: ${responseNotes}`);
    notify('Objection Review Completed', `Objection ${objectionId} was ${decision.toLowerCase()} by CALA. Citizen notified.`, 'info', 'CITIZEN');
    showToast('Objection Resolved', `Objection ${objectionId} marked as ${decision.toLowerCase()}.`, 'success');
  };

  // 7. Approving Authority Action: Sign Section 19
  const approveAcquisitionAuthority = (khasraId, notes = 'Section 19 declaration & compensation award sanctioned under RFCTLARR 2013.') => {
    let khasraNum = '';
    const approvalDate = new Date().toISOString().split('T')[0];
    const updated = khasras.map(k => {
      if (k.id === khasraId || k.khasraNumber === khasraId) {
        khasraNum = k.khasraNumber;
        return {
          ...k,
          authorityApproved: true,
          authorityApprovalDate: approvalDate,
          status: 'COMPENSATION_CALCULATED',
          gisStatus: 'COMPENSATION_PENDING',
        };
      }
      return k;
    });

    setKhasras(updated);
    refreshProjectStats(updated);
    logAction('Authority Sanction Issued', 'Delhi–Meerut Expressway (PRJ-001)', `Khasra ${khasraNum}`, notes);
    notify('Acquisition Sanctioned', `District Officer sanctioned Section 19 declaration for Khasra ${khasraNum}.`, 'success', 'ALL');
    showToast('Award Approved', `Acquisition & Compensation sanctioned by District Officer.`, 'success');
  };

  // 8. Process DBT Compensation
  const processDisbursement = (khasraId) => {
    let khasraNum = '';
    let amount = 0;
    const utr = `PFMS/RBI/2026/${Math.floor(100000000 + Math.random() * 900000000)}`;
    const paymentDate = new Date().toISOString().split('T')[0];

    const updated = khasras.map(k => {
      if (k.id === khasraId || k.khasraNumber === khasraId) {
        khasraNum = k.khasraNumber;
        amount = k.totalCompensation;
        return {
          ...k,
          paymentStatus: 'DBT Credit Successful',
          paymentUtr: utr,
          paymentDate,
          status: 'COMPENSATION_PAID',
          gisStatus: 'ACQUIRED',
        };
      }
      return k;
    });

    setKhasras(updated);
    refreshProjectStats(updated);
    logAction('DBT Compensation Disbursed', 'Delhi–Meerut Expressway (PRJ-001)', `Khasra ${khasraNum}`, `Direct transfer of ₹${(amount/100000).toFixed(2)} Lakh credited via UTR #${utr}.`);
    notify('Compensation Credited (Simulated)', `Direct Benefit Transfer of ₹${(amount/100000).toFixed(2)} Lakh credited to ${khasraNum} owner bank account (Ref: ${utr}).`, 'success', 'CITIZEN');
    showToast('Payment Successful', `Simulated PFMS DBT transfer completed. UTR: ${utr}`, 'success');
  };

  // 9. Mark as Acquired
  const markAsAcquired = (khasraId) => {
    let khasraNum = '';
    const acquisitionDate = new Date().toISOString().split('T')[0];

    const updated = khasras.map(k => {
      if (k.id === khasraId || k.khasraNumber === khasraId) {
        khasraNum = k.khasraNumber;
        return {
          ...k,
          isAcquired: true,
          acquisitionDate,
          status: 'ACQUIRED',
          gisStatus: 'ACQUIRED',
        };
      }
      return k;
    });

    setKhasras(updated);
    refreshProjectStats(updated);
    logAction('Final Possession Taken', 'Delhi–Meerut Expressway (PRJ-001)', `Khasra ${khasraNum}`, `Land parcel legally mutated and transferred into the possession of Executing Agency.`);
    notify('Land Successfully Acquired', `Khasra ${khasraNum} is now ACQUIRED and recorded in the National Infrastructure Asset Registry.`, 'success', 'ALL');
    showToast('Land Acquired!', `Khasra ${khasraNum} has been officially marked as ACQUIRED.`, 'success');
  };

  // Project & User Creation
  const createNewProject = (projectData) => {
    const newId = `PRJ-00${projects.length + 1}`;
    const newProj = {
      id: newId,
      acquiredLand: 0,
      verifiedLand: 0,
      pendingLand: Number(projectData.requiredLand || 100),
      affectedOwners: 12,
      activeObjections: 0,
      estimatedCompensation: Number(projectData.requiredLand || 100) * 2000000,
      disbursedCompensation: 0,
      status: 'Active',
      stage: 'Corridor Survey & Parcel Identification',
      startDate: new Date().toISOString().split('T')[0],
      targetDate: '2027-12-31',
      aiRiskLevel: 'MEDIUM',
      aiRiskScore: 35,
      riskFactors: ['Preliminary cadastral alignment pending revenue ground truthing.'],
      ...projectData,
    };

    setProjects(prev => [newProj, ...prev]);
    logAction('New Project Created', newProj.name, 'Corridor Registry', `Created project with ${newProj.requiredLand} Acre target.`);
    showToast('Project Created', `Project ${newProj.name} (${newId}) initialized successfully.`, 'success');
    return newProj;
  };

  const createNewUser = (userData) => {
    const newId = `USR-00${users.length + 1}`;
    const newUser = {
      id: newId,
      status: 'Active',
      lastLogin: 'Never',
      twoFactorEnabled: true,
      ...userData,
    };
    setUsers(prev => [newUser, ...prev]);
    logAction('User Created', 'System Governance', 'User Management', `Created user ${newUser.name} with role ${newUser.role}`);
    showToast('User Created', `User account for ${newUser.name} created.`, 'success');
  };

  const toggleUserStatus = (userId) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'Active' ? 'Deactivated' : 'Active';
        logAction('User Status Changed', 'System Governance', 'User Management', `User ${u.name} status changed to ${nextStatus}`);
        showToast('Status Updated', `User ${u.name} is now ${nextStatus}.`, 'info');
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  // Demo Mode: 1-Click Reset to Initial State
  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.KHASRAS);
    localStorage.removeItem(STORAGE_KEYS.CASES);
    localStorage.removeItem(STORAGE_KEYS.RR_PACKAGES);
    localStorage.removeItem(STORAGE_KEYS.NOTICES);
    localStorage.removeItem(STORAGE_KEYS.OBJECTIONS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.SYNC_STATS);

    setProjects(INITIAL_PROJECTS);
    setKhasras(INITIAL_KHASRAS);
    setCases(INITIAL_CASES);
    setRrPackages(INITIAL_RR_PACKAGES);
    setNotices(INITIAL_NOTICES);
    setObjections(INITIAL_OBJECTIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setUsers(INITIAL_USERS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSyncMetrics(INITIAL_SYNC_METRICS);
    setActiveKhasraId('101');
    setActiveCaseId('CASE-2026-DME-0101');
    setMapCenterKhasra('101');

    showToast('Demo State Reset', 'All cases, projects, GIS geometries, and logs restored to SIH demonstration baseline.', 'info');
  };

  return (
    <LandDataContext.Provider
      value={{
        projects,
        khasras,
        cases,
        rrPackages,
        notices,
        objections,
        auditLogs,
        users,
        notifications,
        syncMetrics,
        isSyncing,
        backendLoaded,
        activeKhasraId,
        setActiveKhasraId,
        activeCaseId,
        setActiveCaseId,
        mapCenterKhasra,
        setMapCenterKhasra,
        toasts,
        showToast,
        removeToast,
        logAction,
        notify,
        advanceCaseStage,
        syncGovernmentAPIs,
        verifyRevenueRecord,
        verifyGISBoundary,
        toggleParcelSelection,
        issueSection11Notice,
        submitCitizenObjection,
        reviewObjection,
        approveAcquisitionAuthority,
        processDisbursement,
        markAsAcquired,
        createNewProject,
        createNewUser,
        toggleUserStatus,
        resetDemoData,
      }}
    >
      {children}
    </LandDataContext.Provider>
  );
};

export const useLandData = () => useContext(LandDataContext);
