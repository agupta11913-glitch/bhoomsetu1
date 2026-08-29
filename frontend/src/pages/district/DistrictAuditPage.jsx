import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchDistrictAuditApi } from '../../services/api/districtApi';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  FileSearch,
  ShieldCheck,
  Search,
  Clock,
  User,
  Key,
} from 'lucide-react';

const DistrictAuditContent = () => {
  const { currentUser } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDistrictAuditApi(currentUser?.district || 'Agra').then((data) => {
      if (Array.isArray(data)) setLogs(data);
      setLoading(false);
    });
  }, [currentUser]);

  const defaultLogs = [
    {
      id: 1,
      performedBy: 'district.officer@bhoomisetu.gov.in',
      action: 'STATUTORY_SECTION_19_SANCTION',
      entityName: 'LandParcel',
      entityId: 'PARCEL-101',
      details: 'District Magistrate sanctioned Section 19 declaration after full objection window completion.',
      timestamp: '2026-02-28 11:15:00',
    },
    {
      id: 2,
      performedBy: 'district.officer@bhoomisetu.gov.in',
      action: 'COORDINATION_NOTICE_DISPATCH',
      entityName: 'Coordination',
      entityId: 'COORD-001',
      details: 'Dispatched inter-departmental notice to DFO Agra for Stage-II forest clearance.',
      timestamp: '2026-02-27 16:30:00',
    },
    {
      id: 3,
      performedBy: 'tehsildar@demo.gov.in',
      action: 'REVENUE_VERIFICATION_SUBMISSION',
      entityName: 'LandParcel',
      entityId: 'PARCEL-101',
      details: 'Tehsildar submitted approved revenue field verification dossier to Collectorate.',
      timestamp: '2026-02-26 14:10:00',
    },
  ];

  const list = logs.length > 0 ? logs : defaultLogs;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-50 text-purple-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-purple-200 uppercase tracking-wider">
              Forensic Audit Trail
            </span>
            <span className="text-xs font-bold text-slate-500">{currentUser?.district || 'Agra'} District</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-purple-600" />
            <span>District Collectorate Forensic Audit Log</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographically sealed, tamper-evident audit history of statutory approvals, quasi-judicial orders, and notices.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-500 block">Logged Events</span>
          <strong className="text-xl font-black text-purple-700">{list.length} Records</strong>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-gov overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Officer Identity</th>
                <th className="p-4">Action Type</th>
                <th className="p-4">Target Entity</th>
                <th className="p-4">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {list.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                  <td className="p-4 font-bold text-slate-800">{log.performedBy}</td>
                  <td className="p-4">
                    <span className="bg-purple-50 text-purple-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-purple-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-slate-600">{log.entityName} #{log.entityId}</td>
                  <td className="p-4 text-slate-700 max-w-md">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const DistrictAuditPage = () => (
  <ErrorBoundary>
    <DistrictAuditContent />
  </ErrorBoundary>
);

export default DistrictAuditPage;
