import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  fetchDistrictCompensationApi,
  fetchDistrictAcquisitionApi,
  updateDistrictCompensationStatusApi,
} from '../../services/api/districtApi';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  Banknote,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  Edit3,
  Zap,
  X,
  Save,
  MessageSquare,
} from 'lucide-react';

const DistrictCompensationContent = () => {
  const { currentUser, hasPermission, DISTRICT_PERMISSIONS } = useAuth();
  const [data, setData] = useState(null);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState(null);

  // Compensation update modal
  const [compModalCase, setCompModalCase] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('DISBURSED');
  const [compRemarks, setCompRemarks] = useState('');
  const [savingComp, setSavingComp] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [compRes, casesRes] = await Promise.all([
        fetchDistrictCompensationApi(currentUser?.district || 'Agra'),
        fetchDistrictAcquisitionApi({ district: currentUser?.district || 'Agra' }),
      ]);
      if (compRes) setData(compRes);
      if (Array.isArray(casesRes)) setCases(casesRes);
    } catch (err) {
      console.error('Error fetching compensation data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const comp = data || {
    totalEstimatedCr: 184.60,
    awardedAmountCr: 162.80,
    disbursedAmountCr: 136.95,
    pendingDisbursementCr: 25.85,
    totalBeneficiaries: 420,
    paidBeneficiaries: 312,
    pendingBeneficiaries: 108,
    dbtSuccessRate: '98.4%',
  };

  const handleUpdatePayment = async (e) => {
    e.preventDefault();
    if (!compModalCase) return;
    setSavingComp(true);
    try {
      const payload = {
        status: paymentStatus,
        remarks: compRemarks || 'PFMS DBT payment status updated by Collectorate.',
      };
      const res = await updateDistrictCompensationStatusApi(compModalCase.caseId, payload);
      if (res.success) {
        setActionNotice(`Compensation status for Case ${compModalCase.caseId} updated to ${paymentStatus}.`);
        setCompModalCase(null);
        setCompRemarks('');
        loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingComp(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-50 text-emerald-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
              PFMS DBT Gateway
            </span>
            <span className="text-xs font-bold text-slate-500">{currentUser?.district || 'Agra'} District</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Banknote className="w-6 h-6 text-emerald-600" />
            <span>District Compensation & Award Disbursement</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            RFCTLARR Act 2013 statutory compensation monitoring: 100% Solatium, 12% Additional Market Value, PFMS DBT transfers, and payment status updates.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-500 block">Total Disbursed</span>
          <strong className="text-xl font-black text-emerald-700">₹{comp.disbursedAmountCr} Cr</strong>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Sanctioned Budget</span>
          <div className="text-2xl font-black text-slate-900">₹{comp.totalEstimatedCr} Cr</div>
          <p className="text-[11px] text-slate-500">Collectorate Award Pool</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Awarded & Sanctioned</span>
          <div className="text-2xl font-black text-purple-700">₹{comp.awardedAmountCr} Cr</div>
          <p className="text-[11px] text-purple-600">Section 3G Awards Determined</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Disbursed (DBT Direct)</span>
          <div className="text-2xl font-black text-emerald-600">₹{comp.disbursedAmountCr} Cr</div>
          <p className="text-[11px] text-emerald-600">Credited to Landowner A/Cs</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Pending Verification</span>
          <div className="text-2xl font-black text-amber-600">₹{comp.pendingDisbursementCr} Cr</div>
          <p className="text-[11px] text-amber-600">Under bank IFSC / title check</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-4">
        <h3 className="text-base font-black text-slate-900">Beneficiary DBT Credit Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
            <span className="text-emerald-700 font-bold block text-[11px]">Paid Beneficiaries</span>
            <strong className="text-2xl font-black text-emerald-900">{comp.paidBeneficiaries}</strong>
            <p className="text-[11px] text-emerald-600 mt-1">Direct Bank Transfers Completed</p>
          </div>
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
            <span className="text-amber-700 font-bold block text-[11px]">Pending Documentation</span>
            <strong className="text-2xl font-black text-amber-900">{comp.pendingBeneficiaries}</strong>
            <p className="text-[11px] text-amber-600 mt-1">Awaiting Mandate Forms / Bank Linking</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200">
            <span className="text-purple-700 font-bold block text-[11px]">PFMS Success Rate</span>
            <strong className="text-2xl font-black text-purple-900">{comp.dbtSuccessRate}</strong>
            <p className="text-[11px] text-purple-600 mt-1">Zero-Leakage Real-Time Transmission</p>
          </div>
        </div>
      </div>

      {/* Beneficiary Compensation Disbursal Action Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-gov overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900">Beneficiary Award Disbursal Ledger</h3>
            <p className="text-xs text-slate-500">Update PFMS transfer stage, add disbursement remarks, or expedite hold cases.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Case ID</th>
                <th className="p-4">Beneficiary / Landowner</th>
                <th className="p-4">Khasra Number</th>
                <th className="p-4">Award Amount</th>
                <th className="p-4">Disbursement Status</th>
                <th className="p-4 text-right">District Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {cases.slice(0, 10).map((c) => (
                <tr key={c.caseId} className="hover:bg-slate-50/80 transition">
                  <td className="p-4 font-mono font-bold text-purple-700">{c.caseId}</td>
                  <td className="p-4 font-bold text-slate-800">{c.ownerName}</td>
                  <td className="p-4 text-slate-600">Khasra #{c.khasraNumber} ({c.village})</td>
                  <td className="p-4 font-bold text-emerald-700">₹{c.compensationAwardedCr || 0.52} Cr</td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                        c.paymentStatus === 'DISBURSED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {c.paymentStatus || 'DISBURSED'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {hasPermission(DISTRICT_PERMISSIONS.UPDATE_COMPENSATION) && (
                      <button
                        onClick={() => {
                          setCompModalCase(c);
                          setPaymentStatus(c.paymentStatus || 'DISBURSED');
                          setCompRemarks('');
                        }}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold px-3 py-1 rounded-lg text-[11px] inline-flex items-center gap-1 transition"
                      >
                        <Zap className="w-3 h-3" />
                        <span>Update / Expedite DBT</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compensation Update Modal */}
      {compModalCase && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  PFMS Direct Transfer Desk
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  Update Compensation Status
                </h3>
                <p className="text-xs text-slate-500">Case {compModalCase.caseId} ({compModalCase.ownerName})</p>
              </div>
              <button
                onClick={() => setCompModalCase(null)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdatePayment} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Disbursement Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900"
                >
                  <option value="DISBURSED">DISBURSED (Credited to Landowner A/C)</option>
                  <option value="SANCTIONED">SANCTIONED (PFMS Mandate Approved)</option>
                  <option value="EXPEDITED">EXPEDITED (Special Clearance)</option>
                  <option value="HELD_FOR_INQUIRY">HELD FOR INQUIRY (Title Dispute / KYC Check)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Disbursement Note / PFMS Reference</label>
                <textarea
                  rows={3}
                  value={compRemarks}
                  onChange={(e) => setCompRemarks(e.target.value)}
                  placeholder="Enter PFMS reference, bank mandate note, or Collectorate sanction order..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCompModalCase(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingComp}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-black px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingComp ? 'Saving...' : 'Confirm DBT Status'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const DistrictCompensationPage = () => (
  <ErrorBoundary>
    <DistrictCompensationContent />
  </ErrorBoundary>
);

export default DistrictCompensationPage;
