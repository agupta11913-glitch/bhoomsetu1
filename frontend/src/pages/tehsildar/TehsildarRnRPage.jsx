import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTehsildarRRBenefitsApi } from '../../services/api/tehsildarApi';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  Building2,
  Home,
  GraduationCap,
  Truck,
  Hammer,
  CheckCircle2,
  Clock,
  Search,
  RefreshCw,
  Eye,
  ShieldCheck,
  Award,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

const TehsildarRnRPageContent = () => {
  const navigate = useNavigate();
  const [rrList, setRrList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchTehsildarRRBenefitsApi();
      if (Array.isArray(data)) {
        setRrList(data);
      }
    } catch (e) {
      console.error('Failed to load R&R data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getBenefitIcon = (type) => {
    switch (type) {
      case 'HOUSING_UNIT':
        return <Home className="w-4 h-4 text-gov-blue-800" />;
      case 'ONE_TIME_RESETTLEMENT':
        return <Truck className="w-4 h-4 text-emerald-600" />;
      case 'SUBSISTENCE_GRANT':
        return <Award className="w-4 h-4 text-purple-600" />;
      case 'SKILL_TRAINING':
        return <GraduationCap className="w-4 h-4 text-amber-600" />;
      default:
        return <Hammer className="w-4 h-4 text-slate-600" />;
    }
  };

  const filteredList = rrList.filter((b) => {
    const matchCat = categoryFilter === 'ALL' || b.benefitType === categoryFilter;
    const matchSearch =
      !searchTerm.trim() ||
      b.beneficiaryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.familyId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.caseId?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      {/* 1. Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-gov-blue-50 text-gov-blue-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-gov-blue-200 uppercase tracking-wider">
              Tehsildar Quasi-Judicial Desk
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">
              RFCTLARR Act 2013 Second Schedule
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Rehabilitation & Resettlement (R&R) Entitlements Review
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit PAF eligibility, housing grants, subsistence allowances, and resettlement entitlements for project-affected families.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-slate-200"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Live</span>
          </button>
        </div>
      </div>

      {/* 2. Filter Strip */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-gov grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
            Search Family ID / Beneficiary / Case
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. PAF-001, Ram Kumar, CASE-2026..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-gov-blue-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
            Entitlement Category Filter
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-gov-blue-800"
          >
            <option value="ALL">All Entitlement Categories</option>
            <option value="HOUSING_UNIT">Constructed Housing Unit / Plot</option>
            <option value="ONE_TIME_RESETTLEMENT">One-time Resettlement Allowance (₹50,000)</option>
            <option value="SUBSISTENCE_GRANT">Subsistence Grant (₹3,000/mo x 12)</option>
            <option value="SKILL_TRAINING">Skill Development & Employment</option>
          </select>
        </div>
      </div>

      {/* 3. Table */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-xs font-extrabold text-slate-900">
            Project-Affected Families R&R Registry ({filteredList.length} Records)
          </span>
          <span className="text-[11px] text-slate-500">
            Tehsil: Fatehabad • District: Agra
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-y border-slate-200">
                <th className="py-2.5 px-3">Family ID</th>
                <th className="py-2.5 px-3">Head of Family</th>
                <th className="py-2.5 px-3">Case ID</th>
                <th className="py-2.5 px-3">Entitlement Type</th>
                <th className="py-2.5 px-3">Statutory Amount / Asset</th>
                <th className="py-2.5 px-3">Verification Status</th>
                <th className="py-2.5 px-3">Payment / Handover</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.map((b) => (
                <tr key={b.id || b.familyId} className="hover:bg-slate-50 transition">
                  <td className="py-2.5 px-3 font-mono font-bold text-gov-blue-900">
                    {b.familyId || `PAF-2026-0${b.id}`}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">
                    {b.beneficiaryName || 'Sh. Ram Kumar'}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">
                    {b.caseId || 'CASE-2026-DME-0101'}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      {getBenefitIcon(b.benefitType)}
                      <span>{b.benefitName || b.benefitType}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">
                    {b.monetaryAmount ? formatCurrency(b.monetaryAmount) : 'Pucca House (50 sq.m)'}
                  </td>
                  <td className="py-2.5 px-3">
                    <StatusBadge status={b.verificationStatus || 'VERIFIED'} size="sm" />
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {b.paymentStatus || 'SCHEDULED'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => navigate(`/tehsildar/cases?caseId=${b.caseId || 'CASE-2026-DME-0101'}`)}
                      className="bg-gov-blue-50 hover:bg-gov-blue-900 text-gov-blue-900 hover:text-white px-2.5 py-1 rounded-lg text-[11px] font-bold transition border border-gov-blue-200 inline-flex items-center gap-1"
                    >
                      <span>Review Case</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const TehsildarRnRPage = () => (
  <ErrorBoundary fallbackTitle="Unable to load Tehsildar R&R Entitlements Review.">
    <TehsildarRnRPageContent />
  </ErrorBoundary>
);
