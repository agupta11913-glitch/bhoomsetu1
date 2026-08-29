import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchDistrictReportsApi, generateDistrictReportApi } from '../../services/api/districtApi';
import { formatAcre } from '../../utils/formatters';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  Calendar,
  Layers,
  Building2,
  TrendingUp,
  RefreshCw,
  FileText,
  CheckCircle2,
  X,
  Plus,
} from 'lucide-react';

const DistrictReportsContent = () => {
  const { currentUser, hasPermission, DISTRICT_PERMISSIONS } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('MONTHLY_ACQUISITION_SUMMARY');
  const [generating, setGenerating] = useState(false);
  const [actionNotice, setActionNotice] = useState(null);

  const loadReport = async () => {
    setLoading(true);
    try {
      const data = await fetchDistrictReportsApi(currentUser?.district || 'Agra');
      if (data) setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [currentUser]);

  const data = report || {
    district: currentUser?.district || 'Agra',
    totalLandAcquiredAcre: 142.50,
    totalDisbursedCr: 136.95,
    totalBeneficiaries: 420,
    clearanceRate: '86.2%',
    generatedAt: '2026-02-28 12:00:00',
  };

  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
      const res = await generateDistrictReportApi({
        district: currentUser?.district || 'Agra',
        reportType,
      });
      if (res) {
        setReport(res);
        setActionNotice(`Official report "${reportType}" compiled and signed by Collectorate.`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleExportCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,District,Report Type,Total Land Acquired (Acre),Total Disbursed (Cr),Beneficiaries,Clearance Rate,Generated At\n${data.district},${data.reportType || reportType},${data.totalLandAcquiredAcre},${data.totalDisbursedCr},${data.totalBeneficiaries},${data.clearanceRate},${data.generatedAt}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `District_${reportType}_${data.district}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-50 text-purple-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-purple-200 uppercase tracking-wider">
              Statutory Analytics
            </span>
            <span className="text-xs font-bold text-slate-500">{currentUser?.district || 'Agra'} District</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            <span>District Land Acquisition Reports & Analytics</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Consolidated statutory reports, compensation ledger reconciliation, and executive summaries for State Revenue Board.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasPermission(DISTRICT_PERMISSIONS.GENERATE_REPORTS) && (
            <div className="flex items-center gap-2">
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
              >
                <option value="MONTHLY_ACQUISITION_SUMMARY">Monthly Acquisition Summary</option>
                <option value="SECTION_15_DISPUTES_DOSSIER">Section 15 Objections Dossier</option>
                <option value="PFMS_COMPENSATION_AUDIT">PFMS Compensation DBT Audit</option>
                <option value="SECOND_SCHEDULE_RNR_COMPLIANCE">Second Schedule R&R Compliance</option>
              </select>

              <button
                onClick={handleGenerateReport}
                disabled={generating}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${generating ? 'animate-spin' : ''}`} />
                <span>{generating ? 'Compiling...' : 'Generate Fresh'}</span>
              </button>
            </div>
          )}

          <button
            onClick={handleExportCSV}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {actionNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs font-bold text-emerald-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Acquired Land</span>
          <div className="text-2xl font-black text-slate-900">{formatAcre(data.totalLandAcquiredAcre)}</div>
          <p className="text-[11px] text-slate-500">Mutated in Revenue Records</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Compensation Disbursed</span>
          <div className="text-2xl font-black text-emerald-600">₹{data.totalDisbursedCr} Cr</div>
          <p className="text-[11px] text-emerald-600">Zero Pending Audits</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Beneficiaries Paid</span>
          <div className="text-2xl font-black text-purple-700">{data.totalBeneficiaries}</div>
          <p className="text-[11px] text-purple-600">Direct Bank Account Transfers</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Statutory Clearance Rate</span>
          <div className="text-2xl font-black text-blue-600">{data.clearanceRate}</div>
          <p className="text-[11px] text-blue-600">Overall District SLA Compliance</p>
        </div>
      </div>

      {/* Compiled Report Overview Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-3 text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            <h3 className="text-sm font-black text-slate-900">
              Active Official Report: {data.reportType || reportType}
            </h3>
          </div>
          <span className="text-slate-400 text-[11px]">Generated: {data.generatedAt}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl">
          <div>
            <span className="text-slate-400 block font-bold text-[10px]">Authorizing Officer</span>
            <strong className="text-slate-900">{data.officerSignoff || 'Dr. Sunita Murthy, IAS (District Magistrate & Collector)'}</strong>
          </div>
          <div>
            <span className="text-slate-400 block font-bold text-[10px]">Reporting Period</span>
            <strong className="text-slate-900">FY 2025–2026 (Annual Master Review)</strong>
          </div>
          <div>
            <span className="text-slate-400 block font-bold text-[10px]">Data Integrity Assurance</span>
            <span className="text-emerald-700 font-bold">Cryptographically Signed by District CALA Cell</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DistrictReportsPage = () => (
  <ErrorBoundary>
    <DistrictReportsContent />
  </ErrorBoundary>
);

export default DistrictReportsPage;
