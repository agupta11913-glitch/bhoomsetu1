import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchDistrictRnRApi, updateDistrictRnRStatusApi } from '../../services/api/districtApi';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  Building2,
  Users,
  CheckCircle2,
  TrendingUp,
  Award,
  Sparkles,
  ShieldCheck,
  Home,
  Edit3,
  X,
  Save,
  MessageSquare,
} from 'lucide-react';

const DistrictRnRContent = () => {
  const { currentUser, hasPermission, DISTRICT_PERMISSIONS } = useAuth();
  const [data, setData] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);

  // R&R update modal
  const [rnrModalFamily, setRnrModalFamily] = useState(null);
  const [rnrStatus, setRnrStatus] = useState('PLOT_ALLOCATED');
  const [rnrRemarks, setRnrRemarks] = useState('');
  const [savingRnr, setSavingRnr] = useState(false);

  useEffect(() => {
    fetchDistrictRnRApi(currentUser?.district || 'Agra').then(setData);
  }, [currentUser]);

  const rr = data || {
    totalEligibleFamilies: 84,
    resettlementPlotsAllotted: 62,
    pendingPlotAllotments: 22,
    totalGrantDisbursedCr: 4.20,
    skillTrainingBeneficiaries: 115,
    annuityDisbursedCount: 78,
    complianceStatus: 'COMPLIANT_WITH_SECOND_SCHEDULE_RFCTLARR',
  };

  const sampleFamilies = [
    { id: 'RNR-001', familyHead: 'Sh. Ram Kumar', village: 'Nagla', khasra: '101', entitlement: 'Resettlement Plot + ₹5.0L Subsistence', status: 'PLOT_ALLOCATED', plotNo: 'Plot #A-14 (Kasan Enclave)' },
    { id: 'RNR-002', familyHead: 'Smt. Shanti Devi', village: 'Kasan', khasra: '215', entitlement: '₹5.0L Subsistence Grant + PMKVY Training', status: 'GRANT_DISBURSED', plotNo: 'N/A (Opted for Grant)' },
    { id: 'RNR-003', familyHead: 'Sh. Shyam Lal', village: 'Nagla', khasra: '102', entitlement: 'Resettlement Plot + Shifting Allowance', status: 'UNDER_VERIFICATION', plotNo: 'Pending Collectorate Sanction' },
    { id: 'RNR-004', familyHead: 'Sh. Prem Chand', village: 'Kasan', khasra: '218', entitlement: 'Resettlement Plot + Skill Allotment', status: 'PLOT_ALLOCATED', plotNo: 'Plot #B-09 (Kasan Enclave)' },
  ];

  const handleUpdateRnr = async (e) => {
    e.preventDefault();
    if (!rnrModalFamily) return;
    setSavingRnr(true);
    try {
      const payload = {
        status: rnrStatus,
        remarks: rnrRemarks || 'R&R entitlement sanctioned by Collectorate.',
      };
      const res = await updateDistrictRnRStatusApi(rnrModalFamily.id, payload);
      if (res.success) {
        setActionNotice(`R&R status for ${rnrModalFamily.familyHead} updated to ${rnrStatus}.`);
        setRnrModalFamily(null);
        setRnrRemarks('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingRnr(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-50 text-purple-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-purple-200 uppercase tracking-wider">
              Statutory R&R Scheme
            </span>
            <span className="text-xs font-bold text-slate-500">{currentUser?.district || 'Agra'} District</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-purple-600" />
            <span>Rehabilitation & Resettlement (R&R) Master Tracker</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Second Schedule RFCTLARR compliance: Resettlement housing plots, subsistence allowance, and skill grants.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-500 block">Total Eligible Families</span>
          <strong className="text-xl font-black text-purple-700">{rr.totalEligibleFamilies} Families</strong>
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
          <span className="text-xs font-bold text-slate-400 uppercase">Plots Allotted</span>
          <div className="text-2xl font-black text-emerald-600">{rr.resettlementPlotsAllotted} / {rr.totalEligibleFamilies}</div>
          <p className="text-[11px] text-emerald-600">Model Resettlement Enclave, Kasan</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">R&R Grant Disbursed</span>
          <div className="text-2xl font-black text-purple-700">₹{rr.totalGrantDisbursedCr} Cr</div>
          <p className="text-[11px] text-purple-600">Subsistence & Shifting Grants</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Skill Development</span>
          <div className="text-2xl font-black text-blue-600">{rr.skillTrainingBeneficiaries} Youths</div>
          <p className="text-[11px] text-blue-600">PMKVY / ITI Training Enrolled</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Annuity Beneficiaries</span>
          <div className="text-2xl font-black text-slate-900">{rr.annuityDisbursedCount}</div>
          <p className="text-[11px] text-slate-500">Monthly Pension Scheme Disbursed</p>
        </div>
      </div>

      {/* R&R Entitlements Action Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-gov overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900">Project Affected Families (PAF) Entitlements Ledger</h3>
            <p className="text-xs text-slate-500">Sanction housing plot allotment, disburse subsistence grants, and update R&R fulfillment.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">PAF ID</th>
                <th className="p-4">Head of Family</th>
                <th className="p-4">Village & Khasra</th>
                <th className="p-4">Statutory Entitlements</th>
                <th className="p-4">Plot Allotment / Grant</th>
                <th className="p-4">Fulfillment Status</th>
                <th className="p-4 text-right">District Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {sampleFamilies.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-4 font-mono font-bold text-purple-700">{f.id}</td>
                  <td className="p-4 font-bold text-slate-800">{f.familyHead}</td>
                  <td className="p-4 text-slate-600">{f.village} (Khasra #{f.khasra})</td>
                  <td className="p-4 font-bold text-purple-900">{f.entitlement}</td>
                  <td className="p-4 text-slate-700">{f.plotNo}</td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                        f.status === 'PLOT_ALLOCATED' || f.status === 'GRANT_DISBURSED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {f.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {hasPermission(DISTRICT_PERMISSIONS.UPDATE_R_AND_R) && (
                      <button
                        onClick={() => {
                          setRnrModalFamily(f);
                          setRnrStatus(f.status);
                          setRnrRemarks('');
                        }}
                        className="bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 font-bold px-3 py-1 rounded-lg text-[11px] inline-flex items-center gap-1 transition"
                      >
                        <Home className="w-3 h-3" />
                        <span>Update R&R Status</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* R&R Update Modal */}
      {rnrModalFamily && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  R&R Sanction Desk
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  Update R&R Entitlement Status
                </h3>
                <p className="text-xs text-slate-500">{rnrModalFamily.familyHead} ({rnrModalFamily.id})</p>
              </div>
              <button
                onClick={() => setRnrModalFamily(null)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateRnr} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">R&R Fulfillment Stage</label>
                <select
                  value={rnrStatus}
                  onChange={(e) => setRnrStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900"
                >
                  <option value="PLOT_ALLOCATED">PLOT_ALLOCATED (Resettlement Colony Plot Sanctioned)</option>
                  <option value="GRANT_DISBURSED">GRANT_DISBURSED (Subsistence / Shifting Grant Credited)</option>
                  <option value="SKILL_ENROLLED">SKILL_ENROLLED (Youth Enrolled in ITI/PMKVY)</option>
                  <option value="UNDER_VERIFICATION">UNDER_VERIFICATION (Panchayat In-Depth Check)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">R&R Sanction Order & Notes</label>
                <textarea
                  rows={3}
                  value={rnrRemarks}
                  onChange={(e) => setRnrRemarks(e.target.value)}
                  placeholder="Enter Collectorate R&R sanction order reference or plot demarcation notes..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRnrModalFamily(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingRnr}
                  className="bg-purple-700 hover:bg-purple-800 text-white font-black px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingRnr ? 'Saving...' : 'Sanction Entitlement'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const DistrictRnRPage = () => (
  <ErrorBoundary>
    <DistrictRnRContent />
  </ErrorBoundary>
);

export default DistrictRnRPage;
