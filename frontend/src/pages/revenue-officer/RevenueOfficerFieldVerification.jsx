import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRevenueCasesApi, recordFieldVerificationApi, fetchRevenueCaseDetailsApi } from '../../services/api/revenueOfficerApi';
import { formatAcre } from '../../utils/formatters';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  MapPin,
  Save,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Calendar,
  Clock,
  Camera,
  Layers,
  ArrowRight,
  Upload,
  Image as ImageIcon,
  Trash2,
  Eye,
  X,
  Plus,
  Compass,
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

const RevenueOfficerFieldVerificationContent = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCaseId, setSelectedCaseId] = useState('CASE-2026-DME-0101');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  // Field Form
  const [visitDate, setVisitDate] = useState('2024-02-15');
  const [visitTime, setVisitTime] = useState('11:30 AM');
  const [gpsLat, setGpsLat] = useState('27.1652');
  const [gpsLng, setGpsLng] = useState('78.0645');
  const [landUse, setLandUse] = useState('Agricultural (Two-Crop Irrigated Fertile Land)');
  const [existingStructure, setExistingStructure] = useState('Tube-well Pump House (12x10 ft) & Brick Boundary Pillar');
  const [cropVegetation, setCropVegetation] = useState('Standing Mustard & Wheat Crop; 4 Teak Trees along Border');
  const [occupancyStatus, setOccupancyStatus] = useState('Owner Self-Cultivation (Sh. Ram Kumar)');
  const [boundaryObservation, setBoundaryObservation] = useState('Chak road on North; Alignment boundary marked by NHAI pegs.');
  const [ownerPresence, setOwnerPresence] = useState('Present & Acknowledged Verification');
  const [fieldRemarks, setFieldRemarks] = useState('Physical ground boundaries match revenue shajra map. No encroachments found.');

  // Evidence Photos State
  const [photos, setPhotos] = useState(DEFAULT_SAMPLE_PHOTOS);
  const [selectedPhotoModal, setSelectedPhotoModal] = useState(null);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [customPhotoName, setCustomPhotoName] = useState('');
  const [customPhotoCaption, setCustomPhotoCaption] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Standing Crops & Agriculture');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchRevenueCasesApi();
      if (Array.isArray(data)) {
        setCases(data);
        if (data.length > 0 && !data.find((c) => c.caseId === selectedCaseId)) {
          setSelectedCaseId(data[0].caseId);
        }
      }
      // Load details for selected case
      const details = await fetchRevenueCaseDetailsApi(selectedCaseId);
      if (details?.fieldVerification) {
        const f = details.fieldVerification;
        if (f.visitDate) setVisitDate(f.visitDate);
        if (f.visitTime) setVisitTime(f.visitTime);
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
    } catch (err) {
      console.error('Error fetching cases:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCaseId]);

  const activeCase = cases.find((c) => c.caseId === selectedCaseId) || cases[0];

  // Handle File Upload from device / mobile camera
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
          timestamp: `${visitDate}, ${visitTime}`,
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
      timestamp: `${visitDate}, ${visitTime}`,
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

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    try {
      const payload = {
        visitDate,
        visitTime,
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
      const res = await recordFieldVerificationApi(selectedCaseId, payload);
      if (res.success) {
        setSuccessMsg(`Field inspection report with ${photos.length} site evidence photos for Khasra ${activeCase?.khasraNumber || selectedCaseId} recorded successfully.`);
      }
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto select-none">
      {/* 1. Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-50 text-purple-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-purple-200 uppercase tracking-wider">
              On-Ground Inspection Desk
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">
              Field CALA Ground Truth Survey & Evidence Upload
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Field Verification & Site Photo Evidence
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Record physical site inspection visits, upload geo-tagged evidence photos, verify standing crops, tube-wells, and boundary pillars.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-slate-200"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 2. Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Case Selector & Parcel Dossier (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-3">
            <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
              Select Assigned Parcel for Field Visit
            </label>
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-purple-500"
            >
              {cases.map((c) => (
                <option key={c.caseId} value={c.caseId}>
                  Khasra #{c.khasraNumber} — {c.ownerName} ({c.village})
                </option>
              ))}
            </select>

            {activeCase && (
              <div className="mt-4 p-4 bg-purple-50/60 rounded-xl border border-purple-200 text-xs space-y-2">
                <div className="flex justify-between border-b border-purple-200/60 pb-1.5">
                  <span className="text-purple-900/70 font-semibold">Khasra Number:</span>
                  <strong className="text-purple-950 font-mono">#{activeCase.khasraNumber}</strong>
                </div>
                <div className="flex justify-between border-b border-purple-200/60 pb-1.5">
                  <span className="text-purple-900/70 font-semibold">Registered Owner:</span>
                  <strong className="text-purple-950">{activeCase.ownerName}</strong>
                </div>
                <div className="flex justify-between border-b border-purple-200/60 pb-1.5">
                  <span className="text-purple-900/70 font-semibold">Village / Tehsil:</span>
                  <strong className="text-purple-950">{activeCase.village}, {activeCase.tehsil}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-900/70 font-semibold">Affected Portion:</span>
                  <strong className="text-purple-950 font-mono">{formatAcre(activeCase.affectedAreaAcre)}</strong>
                </div>
              </div>
            )}

            <button
              onClick={() => navigate(`/revenue-officer/map?khasra=${activeCase?.khasraNumber}`)}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition border border-slate-200"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Inspect Boundary on GIS Map</span>
            </button>
          </div>

          {/* Quick Geo-Location Tag Status */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-3">
            <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wider">
              <Compass className="w-4 h-4 text-purple-600" />
              <span>Geo-Tagging Coordinates</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Latitude:</span>
                <strong className="text-slate-900">{gpsLat}° N</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Longitude:</span>
                <strong className="text-slate-900">{gpsLng}° E</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Inspection Date:</span>
                <strong className="text-slate-900">{visitDate}</strong>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              All uploaded site photos are automatically stamped with these tamper-evident statutory GPS metadata watermarks.
            </p>
          </div>
        </div>

        {/* Right Column: Field Visit Entry Form + Photo Upload Section (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* 2A. Field Observation Parameters Form */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-5">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  1. Record Physical Inspection Findings
                </h3>
                <p className="text-xs text-slate-500">
                  Accurate ground observations are used for valuation, compensation, and statutory clearance.
                </p>
              </div>
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Inspection Date</label>
                  <input
                    type="date"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Inspection Time</label>
                  <input
                    type="text"
                    value={visitTime}
                    onChange={(e) => setVisitTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">GPS Latitude Coordinates</label>
                  <input
                    type="text"
                    value={gpsLat}
                    onChange={(e) => setGpsLat(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">GPS Longitude Coordinates</label>
                  <input
                    type="text"
                    value={gpsLng}
                    onChange={(e) => setGpsLng(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono font-bold"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Actual Land Classification on Ground</label>
                  <input
                    type="text"
                    value={landUse}
                    onChange={(e) => setLandUse(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Existing Built Structures / Tube-wells / Wells</label>
                  <input
                    type="text"
                    value={existingStructure}
                    onChange={(e) => setExistingStructure(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Standing Crops, Fruit Orchards & Timber Trees</label>
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
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Owner / Occupant Presence</label>
                  <input
                    type="text"
                    value={ownerPresence}
                    onChange={(e) => setOwnerPresence(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Field Observation & Demarcation Remarks</label>
                  <textarea
                    rows={3}
                    value={fieldRemarks}
                    onChange={(e) => setFieldRemarks(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs"
                  />
                </div>
              </div>

              {/* 2B. Dedicated Site Photo & Evidence Upload Section */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-purple-50/60 p-4 rounded-2xl border border-purple-100">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <Camera className="w-5 h-5 text-purple-700" />
                      <span>2. Attach On-Site Evidence Photos & Geo-Tags</span>
                      <span className="bg-purple-200 text-purple-950 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {photos.length} Attached
                      </span>
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Add physical site photographs via camera capture, device upload, or statutory presets with GPS stamping.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Category Selector */}
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

                    {/* Hidden Inputs for File and Live Camera */}
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

                    {/* Button 1: Live Camera Capture */}
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm"
                      title="Take photo directly from mobile camera / webcam"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Camera</span>
                    </button>

                    {/* Button 2: Upload from Device */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-purple-700 hover:bg-purple-800 text-white font-black px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm"
                      title="Upload photos from device storage"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Browse Files</span>
                    </button>

                    {/* Button 3: Add Photo by URL / Presets */}
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
                              <span className="text-amber-300 text-[9px]">#{activeCase?.khasraNumber || '101'}</span>
                            </div>
                            <div className="text-slate-300 text-[9px]">
                              🕒 {photo.timestamp || `${visitDate}, ${visitTime}`}
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

              {/* Submit & Save Button Bar */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-black px-6 py-3 rounded-xl text-xs flex items-center gap-2 transition shadow-md"
                >
                  <Save className={`w-4 h-4 ${saving ? 'animate-spin' : ''}`} />
                  <span>Save Field Inspection & Evidence Photos</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* 3. High-Resolution Full-Screen Photo Lightbox Modal */}
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
                    <span className="text-amber-400">Parcel #{activeCase?.khasraNumber} ({activeCase?.village})</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300 text-[11px]">
                    <span>🕒 {selectedPhotoModal.timestamp || `${visitDate}, ${visitTime}`}</span>
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
      {/* 4. Add Photo by URL or Presets Modal */}
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
                <span>Timestamp: <strong>{visitDate}</strong></span>
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

export const RevenueOfficerFieldVerification = () => (
  <ErrorBoundary fallbackTitle="Unable to load Field Verification">
    <RevenueOfficerFieldVerificationContent />
  </ErrorBoundary>
);
