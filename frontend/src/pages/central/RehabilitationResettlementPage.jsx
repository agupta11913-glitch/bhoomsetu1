import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLandData } from '../../context/LandDataContext';
import { StatCard } from '../../components/common/StatCard';
import { formatCurrency } from '../../utils/formatters';
import {
  Building2,
  Users,
  Home,
  Banknote,
  GraduationCap,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Search,
  Eye,
  PlusCircle,
  X,
} from 'lucide-react';

export const RehabilitationResettlementPage = () => {
  const navigate = useNavigate();
  const { rrPackages, cases } = useLandData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPaf, setSelectedPaf] = useState(null);

  const filteredPackages = rrPackages.filter((paf) =>
    paf.headOfFamily.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paf.khasraNumber.includes(searchTerm) ||
    paf.village.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              Social Impact & Rehabilitation
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">RFCTLARR Act 2013 (Schedule II Statutory Compliance)</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
            Rehabilitation & Resettlement (R&R) Entitlements Portal
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor Project Affected Families (PAFs), constructed housing unit allotments, subsistence grants, and annuity disbursements.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => navigate('/cases/CASE-2026-DME-0101')}
            className="bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow flex items-center gap-2 transition"
          >
            <Eye className="w-4 h-4 text-gov-saffron-500" />
            <span>Open Case R&R Plan</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 p-2 sm:px-3 sm:py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
            title="Close & Return to Dashboard"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Affected Families (PAFs)"
          value="48 Families"
          subtitle="Delhi-Meerut Package-1"
          icon={Users}
          variant="default"
        />
        <StatCard
          title="Constructed Housing Units"
          value="34 Allotted"
          subtitle="Sector-4 Nagla Hub"
          icon={Home}
          variant="success"
        />
        <StatCard
          title="Subsistence Grants Disbursed"
          value="₹17.28 Lakh"
          subtitle="₹3,000 / month / family"
          icon={Banknote}
          variant="default"
        />
        <StatCard
          title="Vocational Nominees"
          value="26 Enrolled"
          subtitle="NHAI Technical Academy"
          icon={GraduationCap}
          variant="default"
        />
      </div>

      {/* PAF Master Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-gov overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-gov-blue-900" />
              <span>Project Affected Families (PAF) Entitlement Directory</span>
            </h3>
            <p className="text-xs text-slate-500">Statutory benefits matrix tracking housing allotments, monthly allowances, and job training</p>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Family Head or Khasra..."
              className="w-full text-xs bg-white border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 focus:ring-2 focus:ring-gov-blue-800"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-left border-b border-slate-200">
                <th className="p-3.5">PAF ID / Khasra</th>
                <th className="p-3.5">Head of Family</th>
                <th className="p-3.5">Displaced Category</th>
                <th className="p-3.5">Housing Allotment</th>
                <th className="p-3.5">Subsistence Grant</th>
                <th className="p-3.5">Total R&R Package</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredPackages.map((paf) => (
                <tr key={paf.id} className="hover:bg-slate-50 transition">
                  <td className="p-3.5">
                    <span className="font-extrabold text-gov-blue-900 text-sm block font-mono">{paf.pafId}</span>
                    <span className="text-[10px] text-slate-500">Khasra {paf.khasraNumber} ({paf.village})</span>
                  </td>

                  <td className="p-3.5">
                    <span className="font-bold text-slate-900 block">{paf.headOfFamily}</span>
                    <span className="text-[10px] text-slate-400">{paf.familyMembers} Family Members</span>
                  </td>

                  <td className="p-3.5 font-semibold text-slate-700">{paf.displacedType}</td>

                  <td className="p-3.5">
                    {paf.housingAllotted ? (
                      <span className="text-emerald-700 font-bold text-[11px] block">
                        ✓ {paf.houseUnitNumber}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium text-[11px] block">
                        Commercial / Land Grant
                      </span>
                    )}
                  </td>

                  <td className="p-3.5 font-semibold text-slate-800">{paf.subsistencePaid}</td>

                  <td className="p-3.5 font-black text-gov-green-700 text-sm">
                    {formatCurrency(paf.totalRRValue)}
                  </td>

                  <td className="p-3.5">
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                      {paf.status}
                    </span>
                  </td>

                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setSelectedPaf(paf)}
                      className="bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition"
                    >
                      Inspect Card
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAF Inspection Modal */}
      {selectedPaf && (
        <div className="fixed inset-0 z-[1000] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-fadeIn space-y-4">
            <div className="bg-gov-blue-950 text-white p-5 flex items-start justify-between">
              <div>
                <span className="text-[9px] uppercase font-bold text-gov-saffron-500 tracking-wider">
                  RFCTLARR Schedule II Statutory Card
                </span>
                <h3 className="text-lg font-black">{selectedPaf.headOfFamily} ({selectedPaf.pafId})</h3>
                <p className="text-xs text-slate-300">Khasra {selectedPaf.khasraNumber} • {selectedPaf.projectName}</p>
              </div>

              <button onClick={() => setSelectedPaf(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <h4 className="font-extrabold text-slate-900 text-xs uppercase border-b border-slate-200 pb-1">
                  Itemized Entitlement Breakdown
                </h4>
                <p className="text-slate-700"><strong>Housing Allotment:</strong> {selectedPaf.entitlements.houseAllotment}</p>
                <p className="text-slate-700"><strong>Subsistence Grant:</strong> {selectedPaf.entitlements.subsistenceGrant}</p>
                <p className="text-slate-700"><strong>Resettlement Grant:</strong> {selectedPaf.entitlements.resettlementAllowance}</p>
                <p className="text-slate-700"><strong>Skill Training:</strong> {selectedPaf.entitlements.skillTrainingVoucher}</p>
                <p className="text-slate-700"><strong>Annuity Benefit:</strong> {selectedPaf.entitlements.annuityOption}</p>
              </div>

              <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-sm font-black text-emerald-950">
                <span>Total Statutory R&R Package:</span>
                <span className="text-gov-green-700 text-base">{formatCurrency(selectedPaf.totalRRValue)}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedPaf(null)}
                className="bg-gov-blue-900 text-white font-bold text-xs px-5 py-2 rounded-xl"
              >
                Close Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
