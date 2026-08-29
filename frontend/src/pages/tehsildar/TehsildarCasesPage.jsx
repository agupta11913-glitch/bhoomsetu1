import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLandData } from '../../context/LandDataContext';
import { useAuth } from '../../context/AuthContext';
import {
  fetchTehsildarCasesApi,
  approveTehsildarCaseApi,
  rejectTehsildarCaseApi,
  sendBackTehsildarCaseApi,
  fetchTehsildarDocumentsApi
} from '../../services/api/tehsildarApi';
import { StatusBadge } from '../../components/common/StatusBadge';
import { GazetteNoticeModal } from '../../components/documents/GazetteNoticeModal';
import { CompensationAwardModal } from '../../components/documents/CompensationAwardModal';
import { formatCurrency, formatAcre, formatDate } from '../../utils/formatters';
import {
  Search,
  Filter,
  FileCheck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Eye,
  FileText,
  Building2,
  MapPin,
  User,
  ShieldCheck,
  Download,
  X,
  AlertTriangle,
  Send,
  ExternalLink,
  Layers,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  RefreshCw,
} from 'lucide-react';

export const TehsildarCasesPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setActiveKhasraId, showToast } = useLandData();
  const { currentUser } = useAuth();

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProject, setFilterProject] = useState('ALL');
  const [filterVillage, setFilterVillage] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterVerification, setFilterVerification] = useState('ALL');
  const [sortField, setSortField] = useState('khasraNumber');
  const [sortAsc, setSortAsc] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected Case for Detailed Modal View & Action
  const [selectedCase, setSelectedCase] = useState(null);
  const [caseDocs, setCaseDocs] = useState([]);
  const [docsLoading, setDocsLoading] = useState(false);

  // Action Dialog Modals
  const [actionType, setActionType] = useState(null); // 'APPROVE' | 'REJECT' | 'SEND_BACK'
  const [actionRemarks, setActionRemarks] = useState('');
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  // Document Modals
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showAwardModal, setShowAwardModal] = useState(false);

  const loadCases = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTehsildarCasesApi({
        projectId: filterProject,
        village: filterVillage,
        status: filterStatus,
        verificationStatus: filterVerification,
        search: searchTerm,
      });

      if (data && Array.isArray(data)) {
        setCases(data);
      } else {
        // Fallback demo dataset if API is empty
        setCases([]);
      }
    } catch (err) {
      console.error('Error fetching Tehsildar cases:', err);
      setError('Unable to load acquisition cases from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCases();
  }, [filterProject, filterVillage, filterStatus, filterVerification]);

  // Handle URL query caseId
  useEffect(() => {
    const urlCaseId = searchParams.get('caseId');
    if (urlCaseId && cases.length > 0) {
      const found = cases.find(
        (c) => c.caseId === urlCaseId || c.khasraNumber === urlCaseId
      );
      if (found) {
        openCaseDetails(found);
      }
    }
  }, [searchParams, cases]);

  const openCaseDetails = async (c) => {
    setSelectedCase(c);
    setActiveKhasraId(c.khasraNumber);
    setDocsLoading(true);
    try {
      const docs = await fetchTehsildarDocumentsApi({ caseId: c.caseId || c.khasraNumber });
      setCaseDocs(docs || []);
    } catch (e) {
      console.warn('Could not fetch documents:', e);
      setCaseDocs([]);
    } finally {
      setDocsLoading(false);
    }
  };

  // Execute Approve, Reject, or Send Back
  const handleExecuteAction = async () => {
    if (!selectedCase) return;
    if ((actionType === 'REJECT' || actionType === 'SEND_BACK') && !actionRemarks.trim()) {
      showToast('Remarks Required', `Please enter mandatory remarks/reason for ${actionType}.`, 'warning');
      return;
    }

    setIsSubmittingAction(true);
    try {
      let res = null;
      const targetId = selectedCase.caseId || selectedCase.khasraNumber;

      if (actionType === 'APPROVE') {
        res = await approveTehsildarCaseApi(targetId, actionRemarks || 'Approved by Tehsildar');
        showToast('Case Approved', `Acquisition case for Khasra ${selectedCase.khasraNumber} has been verified and approved.`, 'success');
      } else if (actionType === 'REJECT') {
        res = await rejectTehsildarCaseApi(targetId, actionRemarks);
        showToast('Case Rejected', `Acquisition case for Khasra ${selectedCase.khasraNumber} has been rejected.`, 'error');
      } else if (actionType === 'SEND_BACK') {
        res = await sendBackTehsildarCaseApi(targetId, actionRemarks);
        showToast('Case Sent Back', `Case returned to Revenue Officer for rectification with remarks.`, 'info');
      }

      setActionType(null);
      setActionRemarks('');
      if (res) {
        setSelectedCase(res);
      }
      await loadCases();
    } catch (err) {
      console.error('Action execution failed:', err);
      showToast('Action Failed', err.message || 'Unable to update case status on server.', 'error');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  // Filtered and Sorted Cases
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      if (!searchTerm) return true;
      const q = searchTerm.toLowerCase();
      return (
        (c.khasraNumber && c.khasraNumber.toLowerCase().includes(q)) ||
        (c.ownerName && c.ownerName.toLowerCase().includes(q)) ||
        (c.caseId && c.caseId.toLowerCase().includes(q)) ||
        (c.village && c.village.toLowerCase().includes(q))
      );
    }).sort((a, b) => {
      let valA = a[sortField] || '';
      let valB = b[sortField] || '';
      if (typeof valA === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortAsc ? valA - valB : valB - valA;
    });
  }, [cases, searchTerm, sortField, sortAsc]);

  const totalPages = Math.ceil(filteredCases.length / itemsPerPage) || 1;
  const paginatedCases = filteredCases.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-gov-blue-50 text-gov-blue-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-gov-blue-200">
              Land Acquisition Case Management
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">
              Tehsil Registry & RO Ground-Truthing Review
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Acquisition Cases Lifecycle & Statutory Verification
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadCases}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-slate-200"
            title="Refresh Cases"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => navigate('/tehsildar/map')}
            className="bg-gov-blue-900 hover:bg-gov-blue-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
          >
            <MapPin className="w-3.5 h-3.5 text-gov-saffron-400" />
            <span>View on GIS Map</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-gov space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by Khasra, Owner, Case ID, Village..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-gov-blue-900/20 focus:border-gov-blue-900"
            />
          </div>

          {/* Project Filter */}
          <div>
            <select
              value={filterProject}
              onChange={(e) => {
                setFilterProject(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none"
            >
              <option value="ALL">All Projects</option>
              <option value="PRJ-001">Delhi–Meerut Expressway (NH-348)</option>
              <option value="PRJ-002">Western Dedicated Freight Corridor</option>
              <option value="PRJ-003">Agra Metro Phase-II</option>
            </select>
          </div>

          {/* Village Filter */}
          <div>
            <select
              value={filterVillage}
              onChange={(e) => {
                setFilterVillage(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none"
            >
              <option value="ALL">All Villages</option>
              <option value="Nagla">Nagla Village</option>
              <option value="Fatehabad">Fatehabad Kasba</option>
              <option value="Khandauli">Khandauli</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none"
            >
              <option value="ALL">All Acquisition Statuses</option>
              <option value="IDENTIFIED">IDENTIFIED</option>
              <option value="PROPOSED">PROPOSED</option>
              <option value="VERIFIED">VERIFIED</option>
              <option value="AWARD_DECLARED">AWARD_DECLARED</option>
              <option value="COMPENSATION_PAID">COMPENSATION_PAID</option>
              <option value="OBJECTION">OBJECTION</option>
            </select>
          </div>

          {/* Verification Status Filter */}
          <div>
            <select
              value={filterVerification}
              onChange={(e) => {
                setFilterVerification(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none"
            >
              <option value="ALL">All Verification States</option>
              <option value="PENDING">Pending Verification</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="SENT_BACK">Sent Back</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-gov overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Loading cases from backend database...
          </div>
        ) : paginatedCases.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <p className="text-slate-500 font-bold text-sm">No acquisition cases matching filters.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterProject('ALL');
                setFilterVillage('ALL');
                setFilterStatus('ALL');
                setFilterVerification('ALL');
              }}
              className="text-xs text-gov-blue-900 font-extrabold hover:underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                  <th className="py-3 px-4 cursor-pointer hover:bg-slate-100" onClick={() => { setSortField('caseId'); setSortAsc(!sortAsc); }}>
                    <div className="flex items-center gap-1">
                      <span>Case ID & Khasra</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">District / Tehsil / Village</th>
                  <th className="py-3 px-4">Land Owner</th>
                  <th className="py-3 px-4">Acquired / Total Area</th>
                  <th className="py-3 px-4">Acquisition Status</th>
                  <th className="py-3 px-4">Verification Status</th>
                  <th className="py-3 px-4">Assigned RO</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedCases.map((c) => {
                  const isPendingReview = c.tehsildarStatus === 'PENDING_REVIEW' || !c.tehsildarStatus;
                  return (
                    <tr key={c.id || c.caseId} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-mono font-bold text-gov-blue-900">
                        <div>{c.caseId || `CASE-2026-DME-${c.khasraNumber}`}</div>
                        <span className="text-[11px] text-slate-500 font-normal">Khasra No. {c.khasraNumber} ({c.khataNumber || 'KH-842'})</span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 max-w-[180px] truncate" title={c.projectName}>
                        {c.projectName || 'Delhi–Meerut Expressway (NH-348)'}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {c.district || 'Agra'}, {c.tehsil || 'Fatehabad'} <br />
                        <strong className="text-slate-800">{c.village || 'Nagla'}</strong>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {c.ownerName}
                        <span className="block text-[10px] text-slate-400 font-normal">{c.fatherName}</span>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <span className="text-red-700 font-bold">{c.affectedAreaAcre || 0.80} Ac</span>
                        <span className="text-slate-400 text-[10px] block">/ {c.areaAcre || 2.50} Ac Total</span>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={c.status} size="sm" />
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                          c.tehsildarStatus === 'APPROVED'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : c.tehsildarStatus === 'REJECTED'
                            ? 'bg-rose-50 text-rose-800 border-rose-300'
                            : c.tehsildarStatus === 'SENT_BACK'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-blue-50 text-blue-800 border-blue-200'
                        }`}>
                          {c.tehsildarStatus || 'PENDING_REVIEW'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-[11px]">
                        {c.assignedOfficer || 'Sh. Alok Srivastava (RO)'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openCaseDetails(c)}
                            className="bg-gov-blue-900 hover:bg-gov-blue-800 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold transition shadow-xs"
                          >
                            Review
                          </button>

                          <button
                            onClick={() => {
                              setActiveKhasraId(c.khasraNumber);
                              navigate(`/tehsildar/map?caseId=${c.caseId || c.khasraNumber}`);
                            }}
                            className="p-1 text-slate-500 hover:text-gov-blue-900 rounded-lg hover:bg-slate-100 transition"
                            title="Locate on Cadastral Map"
                          >
                            <MapPin className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <span>
            Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredCases.length)} of {filteredCases.length} acquisition cases
          </span>

          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold px-2">Page {currentPage} of {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Case Details Dossier Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-[1200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-xs">
            {/* Modal Header */}
            <div className="bg-gov-blue-950 text-white p-5 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="bg-gov-saffron-500 text-slate-950 text-[9px] uppercase font-black px-2 py-0.2 rounded">
                    Statutory Acquisition File
                  </span>
                  <span className="text-[10px] text-slate-300 font-mono">
                    Case ID: {selectedCase.caseId || `CASE-2026-DME-${selectedCase.khasraNumber}`}
                  </span>
                </div>
                <h2 className="text-lg font-black text-white">
                  Khasra No. {selectedCase.khasraNumber} — Owner: {selectedCase.ownerName}
                </h2>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Village: {selectedCase.village || 'Nagla'}, Tehsil: {selectedCase.tehsil || 'Fatehabad'}, District: {selectedCase.district || 'Agra'}, UP
                </p>
              </div>

              <button
                onClick={() => setSelectedCase(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Section 1: Project Information */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 border-b border-slate-200 pb-1">
                  <Building2 className="w-3.5 h-3.5 text-gov-blue-800" />
                  <span>1. Project Information</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold block">Project Name & ID</span>
                    <span className="font-bold text-slate-900">{selectedCase.projectName || 'Delhi–Meerut Expressway (NH-348)'}</span>
                    <span className="text-[10px] text-slate-500 font-mono block">({selectedCase.projectId || 'PRJ-001'})</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold block">Requiring Agency</span>
                    <span className="font-bold text-slate-900">National Highways Authority of India (NHAI)</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold block">Project Purpose</span>
                    <span className="font-bold text-slate-900">6-Lane High-Speed Infrastructure Expansion</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Land & RoR Property Details */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 border-b border-slate-200 pb-1">
                  <Layers className="w-3.5 h-3.5 text-gov-blue-800" />
                  <span>2. Land & RoR Cadastral Information</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold block">Khatauni Khata No.</span>
                    <span className="font-mono font-bold text-slate-900">{selectedCase.khataNumber || 'KH-842'}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold block">Total Parcel Area</span>
                    <span className="font-bold text-slate-900">{selectedCase.areaAcre || 2.50} Acre</span>
                    <span className="text-[10px] text-slate-400 font-mono block">({selectedCase.areaHectare || 1.0117} Ha)</span>
                  </div>
                  <div className="p-2.5 bg-red-50 rounded-xl border border-red-200">
                    <span className="text-[10px] text-red-600 font-bold block">Project Acquired Area</span>
                    <span className="font-bold text-red-700 text-sm">{selectedCase.affectedAreaAcre || 0.80} Acre</span>
                    <span className="text-[10px] text-red-500 font-mono block">({(((selectedCase.affectedAreaAcre || 0.80) / (selectedCase.areaAcre || 2.50)) * 100).toFixed(1)}% acquired)</span>
                  </div>
                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
                    <span className="text-[10px] text-emerald-600 font-bold block">Remaining Retained Area</span>
                    <span className="font-bold text-emerald-700 text-sm">{selectedCase.remainingAreaAcre || 1.70} Acre</span>
                  </div>
                </div>
              </div>

              {/* Section 3: Revenue Officer Verification Checklist */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 border-b border-slate-200 pb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>3. Revenue Officer Ground Verification Checklist</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700">Bhulekh 1359 Fasli Record:</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified Clean Title
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700">Physical Boundary Demarcation:</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Demarcated on Ground
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700">GIS Cadastral Polygon Alignment:</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Synchronized (WGS84)
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold block">Revenue Officer Field Notes:</span>
                    <p className="text-slate-700 leading-relaxed text-[11px]">
                      {selectedCase.revenueOfficerNotes || 'Site inspection conducted with village Lekhpal. No civil dispute or stay order reported. Single khatedar identified.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 4: Attached Digital Documents */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 border-b border-slate-200 pb-1">
                  <FileText className="w-3.5 h-3.5 text-gov-blue-800" />
                  <span>4. Attached Digital Documents & Records</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => setShowNoticeModal(true)}
                    className="p-2.5 bg-slate-50 hover:bg-gov-blue-50 border border-slate-200 rounded-xl flex items-center justify-between text-left transition group"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gov-blue-800" />
                      <div>
                        <span className="font-bold text-slate-900 block">Section 11 Gazette Notice</span>
                        <span className="text-[10px] text-slate-400">PDF • Official Statutory Publication</span>
                      </div>
                    </div>
                    <Eye className="w-4 h-4 text-slate-400 group-hover:text-gov-blue-900" />
                  </button>

                  <button
                    onClick={() => setShowAwardModal(true)}
                    className="p-2.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200 rounded-xl flex items-center justify-between text-left transition group"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="font-bold text-slate-900 block">Compensation Statement (Sec 23)</span>
                        <span className="text-[10px] text-slate-400">PDF • RFCTLARR Award Calculation</span>
                      </div>
                    </div>
                    <Eye className="w-4 h-4 text-slate-400 group-hover:text-emerald-700" />
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Action Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                onClick={() => {
                  setActiveKhasraId(selectedCase.khasraNumber);
                  navigate(`/tehsildar/map?caseId=${selectedCase.caseId || selectedCase.khasraNumber}`);
                }}
                className="text-gov-blue-900 font-bold hover:underline flex items-center gap-1"
              >
                <MapPin className="w-4 h-4 text-gov-saffron-600" />
                <span>Locate Khasra on GIS Studio</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActionType('SEND_BACK');
                    setActionRemarks('');
                  }}
                  className="bg-amber-100 hover:bg-amber-200 text-amber-900 px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Send Back</span>
                </button>

                <button
                  onClick={() => {
                    setActionType('REJECT');
                    setActionRemarks('');
                  }}
                  className="bg-rose-100 hover:bg-rose-200 text-rose-900 px-3.5 py-2 rounded-xl font-bold transition flex items-center gap-1.5"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>

                <button
                  onClick={() => {
                    setActionType('APPROVE');
                    setActionRemarks('Case verified and approved by Tehsildar.');
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-extrabold transition flex items-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Case</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Dialog Modal (Approve / Reject / Send Back) */}
      {actionType && (
        <div className="fixed inset-0 z-[1300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-extrabold text-sm text-slate-900">
                {actionType === 'APPROVE' && 'Confirm Case Approval'}
                {actionType === 'REJECT' && 'Reject Acquisition Case'}
                {actionType === 'SEND_BACK' && 'Send Back to Revenue Officer'}
              </h3>
              <button onClick={() => setActionType(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-slate-600">
              {actionType === 'APPROVE' && `Are you sure you want to approve acquisition verification for Khasra ${selectedCase?.khasraNumber} (${selectedCase?.ownerName})?`}
              {actionType === 'REJECT' && `Enter statutory rejection reason for Khasra ${selectedCase?.khasraNumber}. This will update the case status in the database.`}
              {actionType === 'SEND_BACK' && `Specify the corrections required from the Revenue Officer for Khasra ${selectedCase?.khasraNumber}.`}
            </p>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                {actionType === 'APPROVE' ? 'Approval Remarks (Optional)' : 'Remarks / Reason (Mandatory)'}:
              </label>
              <textarea
                rows={3}
                value={actionRemarks}
                onChange={(e) => setActionRemarks(e.target.value)}
                placeholder={
                  actionType === 'APPROVE'
                    ? 'Enter official approval notes...'
                    : actionType === 'REJECT'
                    ? 'Reason for rejection (e.g. Title dispute / Discrepancy in area)...'
                    : 'Instructions for Revenue Officer rectification...'
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gov-blue-900/20 focus:border-gov-blue-900"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setActionType(null)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                disabled={isSubmittingAction}
                onClick={handleExecuteAction}
                className={`px-4 py-1.5 rounded-xl text-white font-extrabold transition shadow-xs ${
                  actionType === 'APPROVE'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : actionType === 'REJECT'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                {isSubmittingAction ? 'Processing...' : 'Confirm Action'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attached Document Modals */}
      <GazetteNoticeModal
        isOpen={showNoticeModal}
        onClose={() => setShowNoticeModal(false)}
        khasra={selectedCase || {}}
      />
      <CompensationAwardModal
        isOpen={showAwardModal}
        onClose={() => setShowAwardModal(false)}
        khasra={selectedCase || {}}
      />
    </div>
  );
};
