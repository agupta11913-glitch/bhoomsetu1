import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchTehsildarCompensationApi, fetchTehsildarRRBenefitsApi } from '../../services/api/tehsildarApi';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CompensationAwardModal } from '../../components/documents/CompensationAwardModal';
import { formatCurrency, formatAcre } from '../../utils/formatters';
import {
  Banknote,
  Building2,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Eye,
  FileText,
  Award,
  RefreshCw,
  Home,
  GraduationCap,
  Truck,
  Hammer,
} from 'lucide-react';

export const TehsildarCompensationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Active tab: 'COMPENSATION' | 'RR'
  const isRRInitial = location.pathname.includes('r-and-r') || location.pathname.includes('rr');
  const [activeTab, setActiveTab] = useState(isRRInitial ? 'RR' : 'COMPENSATION');

  const [compensationList, setCompensationList] = useState([]);
  const [rrList, setRrList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedAward, setSelectedAward] = useState(null);
  const [showAwardModal, setShowAwardModal] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [compRes, rrRes] = await Promise.all([
        fetchTehsildarCompensationApi(),
        fetchTehsildarRRBenefitsApi(),
      ]);

      if (compRes && Array.isArray(compRes)) {
        setCompensationList(compRes);
      }
      if (rrRes && Array.isArray(rrRes)) {
        setRrList(rrRes);
      }
    } catch (e) {
      console.error('Failed to load compensation data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredComp = compensationList.filter((item) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      (item.khasraNumber && item.khasraNumber.toLowerCase().includes(q)) ||
      (item.ownerName && item.ownerName.toLowerCase().includes(q)) ||
      (item.caseId && item.caseId.toLowerCase().includes(q))
    );
  });

  const filteredRR = rrList.filter((item) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      (item.benefitType && item.benefitType.toLowerCase().includes(q)) ||
      (item.status && item.status.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-50 text-emerald-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-emerald-200">
              RFCTLARR Act 2013 Financial Gateway
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">
              Statutory Awards & PAF Second Schedule Entitlements
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Compensation Calculation & Rehabilitation (R&R) Desk
          </h1>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('COMPENSATION')}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              activeTab === 'COMPENSATION'
                ? 'bg-gov-blue-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Compensation Awards
          </button>
          <button
            onClick={() => setActiveTab('RR')}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              activeTab === 'RR'
                ? 'bg-gov-blue-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            R&R Entitlements
          </button>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-gov flex items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={activeTab === 'COMPENSATION' ? 'Search by Khasra, Owner, Case ID...' : 'Search R&R benefits...'}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-gov-blue-900/20"
          />
        </div>

        <button
          onClick={loadData}
          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center gap-1.5 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Main Content Area */}
      {activeTab === 'COMPENSATION' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-gov overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs">Loading compensation data...</div>
          ) : filteredComp.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">No compensation records found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                    <th className="py-3 px-4">Case ID & Khasra</th>
                    <th className="py-3 px-4">Land Owner</th>
                    <th className="py-3 px-4">Acquired Area</th>
                    <th className="py-3 px-4">Circle Rate / Ac</th>
                    <th className="py-3 px-4">Calculated Award</th>
                    <th className="py-3 px-4">Disbursement Status</th>
                    <th className="py-3 px-4">Dispute Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredComp.map((item) => (
                    <tr key={item.id || item.khasraNumber} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-gov-blue-900">
                        {item.caseId}
                        <span className="text-[10px] text-slate-500 font-normal block">Khasra {item.khasraNumber} ({item.village})</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">
                        {item.ownerName}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        {item.affectedAreaAcre} Acre
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {formatCurrency(item.circleRatePerAcre)}
                      </td>
                      <td className="py-3 px-4 font-mono font-black text-emerald-700 text-sm">
                        {formatCurrency(item.totalCompensation)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          item.paymentStatus === 'PAID'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}>
                          {item.paymentStatus || 'PENDING_DISBURSEMENT'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-semibold text-slate-600">
                          {item.disputeStatus || 'CLEAN_TITLE'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedAward(item);
                            setShowAwardModal(true);
                          }}
                          className="bg-emerald-50 hover:bg-emerald-600 text-emerald-900 hover:text-white px-2.5 py-1 rounded-lg text-[11px] font-bold transition border border-emerald-200"
                        >
                          View Award Sheet
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* R&R Entitlements Tab */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-gov overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs">Loading R&R records...</div>
          ) : filteredRR.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">No R&R records found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                    <th className="py-3 px-4">Benefit ID & Type</th>
                    <th className="py-3 px-4">PAF Family / Owner</th>
                    <th className="py-3 px-4">Eligibility Status</th>
                    <th className="py-3 px-4">Sanctioned Amount</th>
                    <th className="py-3 px-4">Disbursement Mode</th>
                    <th className="py-3 px-4">Approval Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRR.map((b) => (
                    <tr key={b.id || b.benefitType} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4">
                        <strong className="text-slate-900 block">{b.benefitType?.replace(/_/g, ' ')}</strong>
                        <span className="text-[10px] text-slate-400">{b.legalBasis || 'Second Schedule, RFCTLARR Act 2013'}</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">
                        {b.beneficiaryName || 'Sh. Ram Kumar Family'}
                        <span className="text-[10px] text-slate-400 font-normal block">Nagla Village (PAF-001)</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                          b.eligibility === 'ELIGIBLE'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-slate-100 text-slate-600 border-slate-300'
                        }`}>
                          {b.eligibility || 'ELIGIBLE'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {b.amountDisplay || `₹${formatCurrency(b.amount || 250000)}`}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {b.disbursementMode || 'Direct Benefit Transfer (DBT)'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-blue-50 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">
                          {b.status || 'APPROVED'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Compensation Modal */}
      <CompensationAwardModal
        isOpen={showAwardModal}
        onClose={() => setShowAwardModal(false)}
        khasra={selectedAward || {}}
      />
    </div>
  );
};
