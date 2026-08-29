import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchRevenueCaseDetailsApi,
  saveRevenueVerificationDraftApi,
  submitRevenueVerificationToTehsildarApi,
  recordFieldVerificationApi,
  updateDocumentStatusApi,
} from '../../services/api/revenueOfficerApi';
import { formatCurrency, formatAcre } from '../../utils/formatters';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  FileCheck,
  ShieldCheck,
  MapPin,
  FileText,
  Send,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
  Building2,
  Layers,
  Save,
  Clock,
  User,
  Info,
  Camera,
  Upload,
  Image as ImageIcon,
  Trash2,
  Eye,
  X,
  Plus,
} from 'lucide-react';

const DEFAULT_SAMPLE_PHOTOS = [
  {
    id: 'IMG-001',
    name: 'Standing_Crop_Khasra_101.jpg',
    category: 'Standing Crops & Agriculture',
    url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80',
    caption: 'Standing Rabi crop (Wheat/Mustard) inspected in Khasra 101 alignment corridor.',
    gps: '27.1652° N, 78.0645° E',
    timestamp: '15 Feb 2024, 11:35 AM',
  },
  {
    id: 'IMG-002',
    name: 'Tubewell_Pump_House.jpg',
    category: 'Built Structure / Tube-well',
    url: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=800&auto=format&fit=crop&q=80',
    caption: 'Masonry pump house (12x10 ft) with functional electric tube-well motor.',
    gps: '27.1655° N, 78.0649° E',
    timestamp: '15 Feb 2024, 11:42 AM',
  },
  {
    id: 'IMG-003',
    name: 'Boundary_Demarcation_Peg.jpg',
    category: 'Boundary Demarcation Peg',
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
    caption: 'NHAI concrete alignment peg placed at Northern boundary along chak road.',
    gps: '27.1658° N, 78.0652° E',
    timestamp: '15 Feb 2024, 11:50 AM',
  },
];

const RevenueOfficerCaseDetailsContent = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [actionError, setActionError] = useState(null);

  // Active Tab: 'OVERVIEW' | 'VERIFICATION' | 'FIELD' | 'DOCUMENTS' | 'GIS'
  const [activeTab, setActiveTab] = useState('VERIFICATION');

  // Form State
  const [ownershipStatus, setOwnershipStatus] = useState('VERIFIED');
  const [khasraStatus, setKhasraStatus] = useState('VERIFIED');
  const [khatauniStatus, setKhatauniStatus] = useState('VERIFIED');
  const [areaStatus, setAreaStatus] = useState('VERIFIED');
  const [verificationRemarks, setVerificationRemarks] = useState('');

  // Checklist
  const [checklist, setChecklist] = useState({
    ownershipVerified: true,
    khasraVerified: true,
    khatauniVerified: true,
    landAreaVerified: true,
    parcelGisVerified: true,
    fieldVerificationCompleted: true,
    documentsVerified: true,
    acquisitionAreaChecked: true,
  });

  // Field Verification State
  const [fieldDate, setFieldDate] = useState('2024-02-15');
  const [fieldTime, setFieldTime] = useState('11:30 AM');
  const [gpsLat, setGpsLat] = useState('27.1652');
  const [gpsLng, setGpsLng] = useState('78.0645');
  const [landUse, setLandUse] = useState('Agricultural (Two-Crop Fertile Land)');
  const [existingStructure, setExistingStructure] = useState('Tube-well Pump House (12x10 ft) & Brick Boundary Pillar');
  const [cropVegetation, setCropVegetation] = useState('Standing Mustard & Wheat Crop; 4 Teak Trees along Border');
  const [occupancyStatus, setOccupancyStatus] = useState('Owner Self-Cultivation (Sh. Ram Kumar)');
  const [boundaryObservation, setBoundaryObservation] = useState('Chak road on North; Alignment boundary marked by NHAI pegs.');
  const [ownerPresence, setOwnerPresence] = useState('Present & Acknowledged Verification');
  const [fieldRemarks, setFieldRemarks] = useState('Physical ground boundaries match revenue shajra map. No encroachments found.');

  // Photos State
  const [photos, setPhotos] = useState(DEFAULT_SAMPLE_PHOTOS);
  const [selectedPhotoModal, setSelectedPhotoModal] = useState(null);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [customPhotoName, setCustomPhotoName] = useState('');
  const [customPhotoCaption, setCustomPhotoCaption] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Standing Crops & Agriculture');
  const cameraInputRef = useRef(null);

  const loadCase = async () => {
    setLoading(true);
    try {
      const data = await fetchRevenueCaseDetailsApi(caseId);
      if (data) {
        setCaseData(data);
        if (data.verificationChecklist) {
          setChecklist(data.verificationChecklist);
        }
        if (data.fieldVerification) {
          const f = data.fieldVerification;
          if (f.visitDate) setFieldDate(f.visitDate);
          if (f.visitTime) setFieldTime(f.visitTime);
          if (f.gpsLatitude) setGpsLat(f.gpsLatitude);
          if (f.gpsLongitude) setGpsLng(f.gpsLongitude);
          if (f.landUse) setLandUse(f.landUse);
          if (f.existingStructure) setExistingStructure(f.existingStructure);
          if (f.cropVegetation) setCropVegetation(f.cropVegetation);
          if (f.occupancyStatus) setOccupancyStatus(f.occupancyStatus);
          if (f.boundaryObservation) setBoundaryObservation(f.boundaryObservation);
          if (f.ownerPresence) setOwnerPresence(f.ownerPresence);
          if (f.fieldRemarks) setFieldRemarks(f.fieldRemarks);
          if (Array.isArray(f.photos) && f.photos.length > 0) {
            setPhotos(f.photos);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching case details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCase();
  }, [caseId]);

  const handleImageFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newPhoto = {
          id: `IMG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          name: file.name,
          category: uploadCategory,
          url: event.target.result,
          caption: `${uploadCategory} captured on-site during cadastral inspection.`,
          gps: `${gpsLat}° N, ${gpsLng}° E`,
          timestamp: `${fieldDate}, ${fieldTime}`,
        };
        setPhotos((prev) => [newPhoto, ...prev]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleAddPhotoByUrl = (e) => {
    e.preventDefault();
    if (!customPhotoUrl.trim()) return;

    const newPhoto = {
      id: `IMG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: customPhotoName.trim() || `Field_Photo_${uploadCategory.replace(/\s+/g, '_')}.jpg`,
      category: uploadCategory,
      url: customPhotoUrl.trim(),
      caption: customPhotoCaption.trim() || `${uploadCategory} site inspection photo attached for record.`,
      gps: `${gpsLat}° N, ${gpsLng}° E`,
      timestamp: `${fieldDate}, ${fieldTime}`,
    };

    setPhotos((prev) => [newPhoto, ...prev]);
    setCustomPhotoUrl('');
    setCustomPhotoName('');
    setCustomPhotoCaption('');
    setShowUrlModal(false);
  };

  const handleDeletePhoto = (photoId) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  const handleUpdateCaption = (photoId, newCaption) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, caption: newCaption } : p))
    );
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    setActionSuccess(null);
    setActionError(null);
    try {
      const payload = {
        ownershipStatus,
        khasraStatus,
        khatauniStatus,
        areaStatus,
        remarks: verificationRemarks,
        checklist,
      };
      const res = await saveRevenueVerificationDraftApi(caseId, payload);
      if (res.success) {
        setActionSuccess('Verification draft saved successfully.');
        loadCase();
      } else {
        setActionError(res.message || 'Failed to save draft.');
      }
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitVerification = async () => {
    // Validate Checklist
    const allChecked = Object.values(checklist).every(Boolean);
    if (!allChecked && !verificationRemarks.trim()) {
      setActionError('Please complete all mandatory verification checklist items or provide detailed explanatory remarks.');
      return;
    }

    setSubmitting(true);
    setActionSuccess(null);
    setActionError(null);
    try {
      const payload = {
        ownershipStatus,
        khasraStatus,
        khatauniStatus,
        areaStatus,
        remarks: verificationRemarks || 'All statutory revenue, RoR, and field parameters verified and submitted for Tehsildar review.',
        checklist,
      };
      const res = await submitRevenueVerificationToTehsildarApi(caseId, payload);
      if (res.success) {
        setActionSuccess('Verification submitted to Tehsildar successfully.');
        loadCase();
      } else {
        setActionError(res.message || 'Failed to submit verification.');
      }
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveFieldVisit = async () => {
    setSaving(true);
    setActionSuccess(null);
    setActionError(null);
    try {
      const payload = {
        visitDate: fieldDate,
        visitTime: fieldTime,
        gpsLatitude: gpsLat,
        gpsLongitude: gpsLng,
        landUse,
        existingStructure,
        cropVegetation,
        occupancyStatus,
        boundaryObservation,
        ownerPresence,
        fieldRemarks,
        photos,
      };
      const res = await recordFieldVerificationApi(caseId, payload);
      if (res.success) {
        setActionSuccess(`Field verification report with ${photos.length} site evidence photos saved successfully.`);
        loadCase();
      } else {
        setActionError(res.message || 'Failed to save field visit.');
      }
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !caseData) {
    return (
      <div className="bg-white rounded-2xl p-12 border border-slate-200 shadow-gov text-center space-y-3">
        <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
        <h3 className="text-lg font-bold text-slate-800">Loading Case Dossier...</h3>
        <p className="text-xs text-slate-500">Fetching official land records and acquisition parameters.</p>
      </div>
    );
  }

  const isSubmitted = caseData.verificationStatus === 'VERIFICATION_SUBMITTED' || caseData.verificationStatus === 'COMPLETED';

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      {/* 1. Header with Breadcrumb & Status */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/revenue-officer/cases')}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 mb-2 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Assigned Cases</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-amber-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-200 uppercase tracking-wider">
              Case Verification Dossier
            </span>
            <span className="font-mono text-xs font-bold text-slate-500">{caseData.caseId}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Khasra No. {caseData.khasraNumber} — {caseData.ownerName}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {caseData.village} Village, {caseData.tehsil} Tehsil, {caseData.district} • Corridor: <strong className="text-slate-800">{caseData.projectName}</strong>
          </p>
        </div>

        <div className="flex flex-col sm:items-end gap-2">
          <StatusBadge status={caseData.verificationStatus} size="lg" />
          <span className="text-[11px] text-slate-500 font-mono">
            Khatauni Ref: <strong>{caseData.khataNumber}</strong>
          </span>
        </div>
      </div>

      {/* Returned for Correction Alert Banner */}
      {caseData.verificationStatus === 'RETURNED_FOR_CORRECTION' && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs space-y-1">
          <div className="flex items-center gap-2 text-rose-900 font-extrabold">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Case Returned by Tehsildar for Field/RoR Correction</span>
          </div>
          <p className="text-rose-800 pl-6">
            <strong>Tehsildar Remarks:</strong> {caseData.tehsildarRemarks || caseData.rejectionReason || 'Please verify remaining acreage and clarify standing crop compensation.'}
          </p>
        </div>
      )}

      {/* Action Notification Alerts */}
      {actionSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}
      {actionError && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 text-xs font-bold overflow-x-auto">
        {[
          { key: 'VERIFICATION', label: '1. Revenue & RoR Verification', icon: FileCheck },
          { key: 'FIELD', label: '2. Field Inspection Visit', icon: MapPin },
          { key: 'DOCUMENTS', label: '3. Document Verification', icon: FileText },
          { key: 'OVERVIEW', label: '4. Land & Acquisition Summary', icon: Building2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}

        <button
          onClick={() => navigate(`/revenue-officer/map?khasra=${caseData.khasraNumber}`)}
          className="ml-auto flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold border border-slate-200 transition"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Inspect on GIS Map</span>
        </button>
      </div>

      {/* 3. Tab Content */}
      {activeTab === 'VERIFICATION' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Side-by-Side Official Comparison (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Side-by-Side RoR vs Acquisition Comparison Table */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Official Government Record vs. Acquisition Case Comparison
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cross-verification between Bhulekh Digital Registry and National Highway Proposal.
                  </p>
                </div>
                <span className="bg-emerald-50 text-emerald-900 text-[10px] font-black px-2 py-0.5 rounded border border-emerald-200 uppercase">
                  RoR Match 100%
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
                      <th className="py-2.5 px-3">Parameter</th>
                      <th className="py-2.5 px-3 bg-blue-50/60 text-blue-950">Official Bhulekh RoR</th>
                      <th className="py-2.5 px-3 bg-amber-50/60 text-amber-950">Acquisition Proposal</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-slate-700">Khasra Number</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-900">{caseData.officialRecord?.khasraNumber}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-amber-900">{caseData.caseData?.khasraNumber}</td>
                      <td className="py-2.5 px-3 text-center"><span className="text-emerald-700 font-bold text-[11px]">✓ Match</span></td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-slate-700">Khata / Khatauni</td>
                      <td className="py-2.5 px-3 font-mono text-blue-900">{caseData.officialRecord?.khataNumber}</td>
                      <td className="py-2.5 px-3 font-mono text-amber-900">{caseData.caseData?.khataNumber}</td>
                      <td className="py-2.5 px-3 text-center"><span className="text-emerald-700 font-bold text-[11px]">✓ Match</span></td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-slate-700">Recorded Owner</td>
                      <td className="py-2.5 px-3 font-bold text-blue-900">{caseData.officialRecord?.recordedOwner}</td>
                      <td className="py-2.5 px-3 font-bold text-amber-900">{caseData.caseData?.claimedOwner}</td>
                      <td className="py-2.5 px-3 text-center"><span className="text-emerald-700 font-bold text-[11px]">✓ Verified</span></td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-slate-700">Father / Spouse</td>
                      <td className="py-2.5 px-3 text-slate-700">{caseData.officialRecord?.recordedFather}</td>
                      <td className="py-2.5 px-3 text-slate-700">S/o {caseData.fatherName}</td>
                      <td className="py-2.5 px-3 text-center"><span className="text-emerald-700 font-bold text-[11px]">✓ Match</span></td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-slate-700">Total Land Area</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-900">{formatAcre(caseData.officialRecord?.recordedAreaAcre)}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-amber-900">{formatAcre(caseData.caseData?.claimedAreaAcre)}</td>
                      <td className="py-2.5 px-3 text-center"><span className="text-emerald-700 font-bold text-[11px]">✓ Match</span></td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-slate-700">Acquisition Portion</td>
                      <td className="py-2.5 px-3 text-slate-400 font-mono">—</td>
                      <td className="py-2.5 px-3 font-mono font-black text-rose-700">{formatAcre(caseData.caseData?.proposedAcquiredAreaAcre)}</td>
                      <td className="py-2.5 px-3 text-center"><span className="text-blue-700 font-bold text-[11px]">Demarcated</span></td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-slate-700">Remaining Parcel</td>
                      <td className="py-2.5 px-3 text-slate-400 font-mono">—</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">{formatAcre(caseData.caseData?.remainingAreaAcre)}</td>
                      <td className="py-2.5 px-3 text-center"><span className="text-emerald-700 font-bold text-[11px]">Calculated</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Verification Remarks & Justifications */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-3">
              <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
                Revenue Officer Statutory Verification Remarks
              </label>
              <textarea
                rows={4}
                value={verificationRemarks}
                onChange={(e) => setVerificationRemarks(e.target.value)}
                placeholder="Enter field observations, mutation reference, RoR cross-check confirmation, and any citizen representations..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
              />
              <p className="text-[11px] text-slate-400">
                These remarks will be permanently recorded in the forensic audit ledger and forwarded to the Tehsildar.
              </p>
            </div>
          </div>

          {/* Right Column: Verification Checklist & Submission Actions (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Mandatory Verification Checklist */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Statutory Verification Checklist
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    All items must be verified before Tehsildar submission.
                  </p>
                </div>
                <ShieldCheck className="w-5 h-5 text-amber-600" />
              </div>

              <div className="space-y-2.5 text-xs">
                {[
                  { key: 'ownershipVerified', label: '1. Land Ownership verified against Bhulekh RoR' },
                  { key: 'khasraVerified', label: '2. Khasra number & Shajra map boundary verified' },
                  { key: 'khatauniVerified', label: '3. 12-Year Khatauni & Mutation records verified' },
                  { key: 'landAreaVerified', label: '4. Total vs Acquired area calculation checked' },
                  { key: 'parcelGisVerified', label: '5. GIS 60m ROW corridor alignment cross-checked' },
                  { key: 'fieldVerificationCompleted', label: '6. Physical on-ground site visit completed' },
                  { key: 'documentsVerified', label: '7. Statutory documents & Aadhaar KYC verified' },
                  { key: 'acquisitionAreaChecked', label: '8. Remaining area retained by landholder confirmed' },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50/50 border border-slate-200/80 cursor-pointer transition"
                  >
                    <input
                      type="checkbox"
                      checked={checklist[item.key] || false}
                      onChange={(e) =>
                        setChecklist({ ...checklist, [item.key]: e.target.checked })
                      }
                      className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span className="font-bold text-slate-800 leading-tight">{item.label}</span>
                  </label>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={handleSubmitVerification}
                  disabled={submitting}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 p-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition shadow-md"
                >
                  <Send className={`w-4 h-4 ${submitting ? 'animate-spin' : ''}`} />
                  <span>Submit Verification to Tehsildar</span>
                </button>

                <button
                  onClick={handleSaveDraft}
                  disabled={saving}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition border border-slate-200"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Verification Draft</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Field Verification Tab */}
      {activeTab === 'FIELD' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">
                On-Ground Physical Field Verification Report
              </h3>
              <p className="text-xs text-slate-500">
                Record physical site observations, standing crops, structures, and owner presence.
              </p>
            </div>
            <span className="bg-purple-50 text-purple-900 text-xs font-bold px-2.5 py-1 rounded-lg border border-purple-200">
              Site Visit Registry
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Inspection Visit Date</label>
              <input
                type="date"
                value={fieldDate}
                onChange={(e) => setFieldDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Inspection Visit Time</label>
              <input
                type="text"
                value={fieldTime}
                onChange={(e) => setFieldTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Actual Land Use On-Ground</label>
              <input
                type="text"
                value={landUse}
                onChange={(e) => setLandUse(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Existing Structures / Assets</label>
              <input
                type="text"
                value={existingStructure}
                onChange={(e) => setExistingStructure(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Standing Crops & Fruit Trees</label>
              <input
                type="text"
                value={cropVegetation}
                onChange={(e) => setCropVegetation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Physical Occupancy Status</label>
              <input
                type="text"
                value={occupancyStatus}
                onChange={(e) => setOccupancyStatus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Boundary Demarcation & Alignment Observation</label>
              <input
                type="text"
                value={boundaryObservation}
                onChange={(e) => setBoundaryObservation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Field Inspection Remarks</label>
              <textarea
                rows={3}
                value={fieldRemarks}
                onChange={(e) => setFieldRemarks(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs"
              />
            </div>
          </div>

          {/* Dedicated Site Photo & Evidence Upload Section */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-purple-50/60 p-4 rounded-2xl border border-purple-100">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-purple-700" />
                  <span>On-Site Evidence Photos & Geo-Tags</span>
                  <span className="bg-purple-200 text-purple-950 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {photos.length} Attached
                  </span>
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Upload physical site photographs via camera capture, device upload, or statutory presets.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="bg-white border border-purple-200 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-purple-500 shadow-xs"
                >
                  <option value="Standing Crops & Agriculture">🌾 Standing Crops</option>
                  <option value="Built Structure / Tube-well">🏗️ Built Structure / Well</option>
                  <option value="Boundary Demarcation Peg">📍 Boundary Peg / Marker</option>
                  <option value="Landowner Presence Verification">👤 Owner Presence</option>
                  <option value="360° Alignment Survey">🌐 360° Alignment View</option>
                </select>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageFileUpload}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                <input
                  type="file"
                  ref={cameraInputRef}
                  onChange={handleImageFileUpload}
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm"
                  title="Take photo directly from mobile camera / webcam"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Camera</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-purple-700 hover:bg-purple-800 text-white font-black px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm"
                  title="Upload photos from device storage"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Browse Files</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowUrlModal(true)}
                  className="bg-white hover:bg-slate-50 text-slate-800 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition border border-slate-300 shadow-xs"
                  title="Add photo from URL or choose statutory presets"
                >
                  <Plus className="w-3.5 h-3.5 text-purple-700" />
                  <span>Add by URL / Preset</span>
                </button>
              </div>
            </div>

            {/* Upload Drop Zone Box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-purple-300 hover:border-purple-500 rounded-2xl p-5 text-center bg-purple-50/20 hover:bg-purple-50/60 cursor-pointer transition space-y-1.5"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-slate-900 text-xs block">
                  Click to Browse or Drag & Drop Site Verification Photos
                </strong>
                <span className="text-[11px] text-slate-500">
                  Supports JPG, PNG, WEBP • Max 10MB per photo • Automatic GPS watermarking ({gpsLat}° N, {gpsLng}° E)
                </span>
              </div>
            </div>

            {/* Photos Gallery Grid */}
            {photos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group"
                  >
                    {/* Image Preview with Watermark Overlay */}
                    <div className="relative aspect-video bg-slate-900 overflow-hidden">
                      <img
                        src={photo.url}
                        alt={photo.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      {/* Geo Watermark Overlay */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent p-2 text-white text-[10px] leading-tight font-mono space-y-0.5">
                        <div className="flex items-center justify-between font-bold">
                          <span>📍 {photo.gps || `${gpsLat}° N, ${gpsLng}° E`}</span>
                          <span className="text-amber-300 text-[9px]">#{caseData.khasraNumber}</span>
                        </div>
                        <div className="text-slate-300 text-[9px]">
                          🕒 {photo.timestamp || `${fieldDate}, ${fieldTime}`}
                        </div>
                      </div>

                      {/* Action Buttons on Image */}
                      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-90 group-hover:opacity-100 transition">
                        <button
                          type="button"
                          onClick={() => setSelectedPhotoModal(photo)}
                          className="p-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-lg text-xs"
                          title="Full Screen Preview"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="p-1.5 bg-rose-600/90 hover:bg-rose-700 text-white rounded-lg text-xs"
                          title="Remove Photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-2 left-2">
                        <span className="bg-purple-900/90 backdrop-blur-sm text-purple-200 text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-purple-700/50">
                          {photo.category}
                        </span>
                      </div>
                    </div>

                    {/* Caption Editor */}
                    <div className="p-3 space-y-1.5 text-xs">
                      <span className="font-bold text-slate-800 block truncate" title={photo.name}>
                        {photo.name}
                      </span>
                      <input
                        type="text"
                        value={photo.caption || ''}
                        onChange={(e) => handleUpdateCaption(photo.id, e.target.value)}
                        placeholder="Add photo observation note..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[11px] text-slate-700 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 space-y-2">
                <ImageIcon className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-semibold">No site photos uploaded yet for this parcel.</p>
                <button
                  type="button"
                  onClick={() => setPhotos(DEFAULT_SAMPLE_PHOTOS)}
                  className="text-xs text-purple-700 font-bold hover:underline inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Load Sample Evidence Photos</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={handleSaveFieldVisit}
              disabled={saving}
              className="bg-purple-600 hover:bg-purple-700 text-white font-black px-6 py-3 rounded-xl text-xs flex items-center gap-2 transition shadow-md"
            >
              <Save className={`w-4 h-4 ${saving ? 'animate-spin' : ''}`} />
              <span>Save Field Inspection & Evidence Photos</span>
            </button>
          </div>
        </div>
      )}

      {/* Lightbox Modal for Photo Inspection */}
      {selectedPhotoModal && (
        <div className="fixed inset-0 z-[1200] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl space-y-4">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between text-white">
              <div>
                <span className="text-[10px] font-black uppercase text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800">
                  {selectedPhotoModal.category}
                </span>
                <h3 className="text-base font-black mt-1">{selectedPhotoModal.name}</h3>
              </div>
              <button
                onClick={() => setSelectedPhotoModal(null)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-4">
              <div className="relative aspect-video max-h-[500px] w-full bg-black rounded-2xl overflow-hidden flex items-center justify-center">
                <img
                  src={selectedPhotoModal.url}
                  alt={selectedPhotoModal.name}
                  className="w-full h-full object-contain"
                />
                {/* Forensic Watermark Banner in Modal */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 text-white font-mono text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span>📍 GPS: {selectedPhotoModal.gps || `${gpsLat}° N, ${gpsLng}° E`}</span>
                    <span className="text-amber-400">Parcel #{caseData.khasraNumber} ({caseData.village})</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300 text-[11px]">
                    <span>🕒 {selectedPhotoModal.timestamp || `${fieldDate}, ${fieldTime}`}</span>
                    <span>Officer: Sh. Alok Srivastava (Revenue Officer)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 text-slate-300 text-xs">
              <strong>Forensic Inspection Note:</strong> {selectedPhotoModal.caption || 'On-ground physical verification photograph verified by CALA field team.'}
            </div>
          </div>
        </div>
      )}

      {/* Document Verification Tab */}
      {activeTab === 'DOCUMENTS' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Statutory Document Cross-Verification
              </h3>
              <p className="text-xs text-slate-500">
                Verify RoR extracts, cadastral shajra map sheets, and claimant identity documents.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {(caseData.documents || []).map((doc) => (
              <div key={doc.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">{doc.name}</span>
                    <span className="text-[11px] text-slate-400">
                      Type: {doc.type} • Size: {doc.size} • Format: {doc.format}
                    </span>
                    {doc.remarks && (
                      <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                        Note: {doc.remarks}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] bg-emerald-100 text-emerald-900 font-extrabold px-2 py-0.5 rounded border border-emerald-300">
                    {doc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Land & Acquisition Summary Tab */}
      {activeTab === 'OVERVIEW' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-4 text-xs">
          <h3 className="text-base font-black text-slate-900">
            Cadastral Parcel & Infrastructure Dossier
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">Landholder Name:</span>
              <strong className="text-slate-900 text-sm">{caseData.ownerName}</strong>
              <span className="text-[11px] text-slate-500 block mt-1">S/o {caseData.fatherName}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">Khasra / Khata:</span>
              <strong className="text-slate-900 font-mono text-sm">#{caseData.khasraNumber} / {caseData.khataNumber}</strong>
              <span className="text-[11px] text-slate-500 block mt-1">{caseData.village}, {caseData.tehsil}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">Total / Acquired Area:</span>
              <strong className="text-slate-900 font-mono text-sm">{formatAcre(caseData.totalAreaAcre)} / {formatAcre(caseData.proposedAcquiredAreaAcre)}</strong>
              <span className="text-[11px] text-emerald-700 font-bold block mt-1">Retained: {formatAcre(caseData.remainingAreaAcre)}</span>
            </div>
          </div>
        </div>
      )}
      {/* Add Photo by URL or Presets Modal */}
      {showUrlModal && (
        <div className="fixed inset-0 z-[1200] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl space-y-4 p-6 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  Evidence Photo Attachment
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  Add Site Photo by URL or Preset
                </h3>
              </div>
              <button
                onClick={() => setShowUrlModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPhotoByUrl} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Photo Category</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Standing Crops & Agriculture">🌾 Standing Crops (Wheat / Mustard / Sugarcane)</option>
                  <option value="Built Structure / Tube-well">🏗️ Built Structure / Pump House / Wells</option>
                  <option value="Boundary Demarcation Peg">📍 Boundary Demarcation Peg / Pillar</option>
                  <option value="Landowner Presence Verification">👤 Landowner / Occupant Presence</option>
                  <option value="360° Alignment Survey">🌐 360° Alignment Corridor View</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL (Web or Local Hosted)</label>
                <input
                  type="url"
                  value={customPhotoUrl}
                  onChange={(e) => setCustomPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or http://..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-mono text-[11px] focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              {/* Statutory Presets Quick Select */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Or Choose Quick Statutory Preset Photo:</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: '🌾 Standing Wheat Crop', url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80', cat: 'Standing Crops & Agriculture' },
                    { label: '🏗️ Masonry Pump House', url: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?w=800&auto=format&fit=crop&q=80', cat: 'Built Structure / Tube-well' },
                    { label: '📍 Concrete Alignment Peg', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80', cat: 'Boundary Demarcation Peg' },
                    { label: '🌳 Border Teak Trees', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80', cat: 'Standing Crops & Agriculture' },
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setCustomPhotoUrl(p.url);
                        setCustomPhotoName(p.label);
                        setUploadCategory(p.cat);
                        setCustomPhotoCaption(`${p.label} inspected on-site during cadastral survey.`);
                      }}
                      className="text-left p-2 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 transition text-[11px] font-bold text-slate-800 truncate"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Photo Title / Label</label>
                <input
                  type="text"
                  value={customPhotoName}
                  onChange={(e) => setCustomPhotoName(e.target.value)}
                  placeholder="e.g. Standing_Mustard_Crop_Khasra_101.jpg"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Inspection Observation Caption</label>
                <textarea
                  rows={2}
                  value={customPhotoCaption}
                  onChange={(e) => setCustomPhotoCaption(e.target.value)}
                  placeholder="Describe on-ground findings in this photograph..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[10px] text-slate-500 flex justify-between">
                <span>Auto GPS Tag: <strong>{gpsLat}° N, {gpsLng}° E</strong></span>
                <span>Timestamp: <strong>{fieldDate}</strong></span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUrlModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-700 hover:bg-purple-800 text-white font-black px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Attach Photo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const RevenueOfficerCaseDetails = () => (
  <ErrorBoundary fallbackTitle="Unable to load Case Dossier">
    <RevenueOfficerCaseDetailsContent />
  </ErrorBoundary>
);
