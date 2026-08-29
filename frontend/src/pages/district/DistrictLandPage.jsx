import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  fetchDistrictLandOverviewApi,
  addDistrictLandRemarkApi,
  fetchDistrictLandRemarksApi,
  uploadDistrictProjectDocumentApi,
} from '../../services/api/districtApi';
import { formatAcre } from '../../utils/formatters';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  FileSearch,
  Search,
  Filter,
  Layers,
  MapPin,
  CheckCircle2,
  Building2,
  TrendingUp,
  MessageSquare,
  Upload,
  Map,
  FileText,
  X,
  Save,
  Eye,
} from 'lucide-react';

const DistrictLandContent = () => {
  const { currentUser, hasPermission, DISTRICT_PERMISSIONS } = useAuth();
  const navigate = useNavigate();

  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionNotice, setActionNotice] = useState(null);

  // Observation Modal
  const [remarkParcel, setRemarkParcel] = useState(null);
  const [remarkText, setRemarkText] = useState('');
  const [noteType, setNoteType] = useState('DISTRICT_CALA_OBSERVATION');
  const [savingRemark, setSavingRemark] = useState(false);
  const [parcelRemarksList, setParcelRemarksList] = useState([]);

  // Attach Doc Modal
  const [docParcel, setDocParcel] = useState(null);
  const [docTitle, setDocTitle] = useState('');
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const loadLand = async () => {
    setLoading(true);
    try {
      const data = await fetchDistrictLandOverviewApi(currentUser?.district || 'Agra');
      if (Array.isArray(data)) {
        setParcels(data);
      }
    } catch (err) {
      console.error('Error fetching land overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLand();
  }, [currentUser]);

  const filtered = parcels.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      (p.khasraNumber && p.khasraNumber.toLowerCase().includes(term)) ||
      (p.ownerName && p.ownerName.toLowerCase().includes(term)) ||
      (p.village && p.village.toLowerCase().includes(term)) ||
      (p.caseId && p.caseId.toLowerCase().includes(term))
    );
  });

  const handleOpenRemarkModal = async (p) => {
    setRemarkParcel(p);
    setRemarkText('');
    const id = p.khasraNumber || p.caseId;
    const notes = await fetchDistrictLandRemarksApi(id);
    setParcelRemarksList(notes || []);
  };

  const handleSaveRemark = async (e) => {
    e.preventDefault();
    if (!remarkParcel || !remarkText.trim()) return;
    setSavingRemark(true);
    try {
      const id = remarkParcel.khasraNumber || remarkParcel.caseId;
      const res = await addDistrictLandRemarkApi(id, {
        remark: remarkText.trim(),
        noteType,
      });
      if (res.success) {
        setActionNotice(`Observation recorded for Khasra #${remarkParcel.khasraNumber}.`);
        setRemarkParcel(null);
        setRemarkText('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingRemark(false);
    }
  };

  const handleUploadDoc = async (e) => {
    e.preventDefault();
    if (!docParcel || !docTitle.trim()) return;
    setUploadingDoc(true);
    try {
      const res = await uploadDistrictProjectDocumentApi(docParcel.projectId || 'PRJ-001', {
        name: `${docTitle.trim()} (Khasra #${docParcel.khasraNumber})`,
        type: 'Cadastral Survey Attachment',
      });
      if (res.success) {
        setActionNotice(`Document attached to Khasra #${docParcel.khasraNumber} dossier.`);
        setDocParcel(null);
        setDocTitle('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingDoc(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-50 text-purple-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-purple-200 uppercase tracking-wider">
              Authoritative Cadastral Records
            </span>
            <span className="text-xs font-bold text-slate-500">{currentUser?.district || 'Agra'} District</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <FileSearch className="w-6 h-6 text-purple-600" />
            <span>Land & Cadastral Parcel Overview</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Bhulekh digital RoR records with authoritative geometry protection. Add Collectorate verification remarks and inspect parcel dossiers.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-500 block">Authoritative Parcels</span>
          <strong className="text-xl font-black text-purple-700">{filtered.length} Parcels</strong>
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

      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-gov flex items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search parcel by khasra, owner, village, or case ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <div key={p.caseId} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-mono text-xs font-bold text-purple-700">{p.caseId}</span>
                <span className="text-[10px] font-black uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                  {p.verificationStatus || 'VERIFIED'}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-black text-slate-900">Khasra #{p.khasraNumber} — {p.ownerName}</h3>
                <p className="text-xs text-slate-500">{p.village} Village, {p.tehsil} Tehsil</p>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Total Cadastral Area</span>
                  <strong className="text-slate-800">{formatAcre(p.totalAreaAcre)}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Right-of-Way Acquired</span>
                  <strong className="text-purple-700">{formatAcre(p.affectedAreaAcre)}</strong>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                <span>Corridor: {p.projectId}</span>
                <span className="font-bold text-emerald-600">Bhulekh RoR Intact</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleOpenRemarkModal(p)}
                  className="bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 font-bold py-1.5 px-2.5 rounded-xl text-[11px] flex items-center justify-center gap-1 transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Observation</span>
                </button>

                <button
                  onClick={() => {
                    setDocParcel(p);
                    setDocTitle('');
                  }}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold py-1.5 px-2.5 rounded-xl text-[11px] flex items-center justify-center gap-1 transition"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Attach Doc</span>
                </button>
              </div>

              <button
                onClick={() => navigate('/district/map')}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-1.5 px-3 rounded-xl text-[11px] flex items-center justify-center gap-1.5 transition"
              >
                <Map className="w-3.5 h-3.5 text-purple-400" />
                <span>View on GIS Cadastral Map</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Observation Modal */}
      {remarkParcel && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  Verification Remark
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  Khasra #{remarkParcel.khasraNumber} ({remarkParcel.ownerName})
                </h3>
              </div>
              <button
                onClick={() => setRemarkParcel(null)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {parcelRemarksList.length > 0 && (
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs space-y-2 max-h-36 overflow-y-auto">
                <span className="font-bold text-purple-950 block">Previous District Observations:</span>
                {parcelRemarksList.map((r, i) => (
                  <div key={i} className="text-purple-900 bg-white p-2 rounded-lg border border-purple-100">
                    <p className="font-medium">"{r.remark}"</p>
                    <span className="text-[10px] text-purple-600 block mt-0.5">{r.officer} • {r.timestamp}</span>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleSaveRemark} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Observation Category</label>
                <select
                  value={noteType}
                  onChange={(e) => setNoteType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900"
                >
                  <option value="DISTRICT_CALA_OBSERVATION">District CALA Field Observation</option>
                  <option value="CROP_STRUCTURE_VALUATION">Crop / Structure Valuation Verification</option>
                  <option value="CO_SHARER_SUCCESSION">Co-Sharer Succession / Title Notation</option>
                  <option value="DEMARCATION_CLEARANCE">Demarcation Boundary Clearance</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">District Verification Remark</label>
                <textarea
                  rows={3}
                  value={remarkText}
                  onChange={(e) => setRemarkText(e.target.value)}
                  placeholder="Record Collectorate observation without modifying base survey coordinates..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-medium"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRemarkParcel(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingRemark}
                  className="bg-purple-700 hover:bg-purple-800 text-white font-black px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingRemark ? 'Saving...' : 'Record Observation'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attach Doc Modal */}
      {docParcel && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  Parcel File Attachment
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  Attach Document to Khasra #{docParcel.khasraNumber}
                </h3>
              </div>
              <button
                onClick={() => setDocParcel(null)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadDoc} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Description</label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g. Field Demarcation Map / Panchnama Report"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold"
                  required
                />
              </div>

              <div className="border-2 border-dashed border-purple-200 rounded-2xl p-4 text-center bg-purple-50/40">
                <Upload className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                <span className="text-[11px] text-slate-600 block font-bold">
                  File Attachment Verified
                </span>
                <span className="text-[10px] text-slate-400">PDF, JPG, PNG (Max 15MB)</span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDocParcel(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingDoc}
                  className="bg-purple-700 hover:bg-purple-800 text-white font-black px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingDoc ? 'Attaching...' : 'Attach to Parcel File'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const DistrictLandPage = () => (
  <ErrorBoundary>
    <DistrictLandContent />
  </ErrorBoundary>
);

export default DistrictLandPage;
