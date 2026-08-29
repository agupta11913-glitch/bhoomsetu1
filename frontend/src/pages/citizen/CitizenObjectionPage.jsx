import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLandData } from '../../context/LandDataContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatDate } from '../../utils/formatters';
import { Modal } from '../../components/common/Modal';
import {
  MessageSquareWarning,
  Send,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  FileText,
  HelpCircle,
  ArrowRight,
  Image as ImageIcon,
  Trash2,
  Eye,
  Sparkles,
  Camera,
  X,
  FileCheck,
} from 'lucide-react';

export const CitizenObjectionPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { khasras, objections, submitCitizenObjection, showToast } = useLandData();
  const { lang } = useLanguage();

  const fileInputRef = useRef(null);

  const [khasraNumber, setKhasraNumber] = useState('101');
  const [reason, setReason] = useState('Notice me land area incorrect mention hai.');
  const [description, setDescription] = useState(
    'The official Section 11 gazette notice mentions 2.5 Acre without excluding the tubewell pump house and boundary irrigation channel. Requesting re-measurement by Tehsildar.'
  );

  // Uploaded Attachment State
  const [attachedImage, setAttachedImage] = useState({
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop',
    name: 'Tubewell_Frontage_Field_Photo.jpg',
    size: '2.4 MB',
    type: 'image/jpeg',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewModalImage, setPreviewModalImage] = useState(null);

  const sampleEvidence = [
    {
      title: '📸 Tubewell & Farm Structure',
      name: 'Tubewell_Frontage_Field_Photo.jpg',
      url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop',
      size: '2.4 MB',
      type: 'image/jpeg',
    },
    {
      title: '🗺️ Cadastral Field Survey Map',
      name: 'Cadastral_Boundary_Survey_Map.jpg',
      url: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop',
      size: '1.9 MB',
      type: 'image/jpeg',
    },
    {
      title: '📜 Sub-Registrar Sale Deed',
      name: 'Registered_Sale_Deed_Scan.jpg',
      url: 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=800&auto=format&fit=crop',
      size: '3.1 MB',
      type: 'image/jpeg',
    },
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (15MB)
    if (file.size > 15 * 1024 * 1024) {
      showToast('File Too Large', 'Please upload an image smaller than 15MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setAttachedImage({
        url: event.target.result,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        type: file.type || 'image/jpeg',
      });
      showToast('Image Attached', `Successfully attached "${file.name}"`, 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample) => {
    setAttachedImage(sample);
    showToast('Sample Photo Loaded', `Selected "${sample.name}" for demonstration.`, 'info');
  };

  const handleRemoveAttachment = () => {
    setAttachedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast('Attachment Removed', 'Supporting photo removed.', 'info');
  };

  const myObjections = objections.filter(
    (o) => o.ownerEmail === currentUser?.email || o.khasraNumber === '101' || o.khasraNumber === khasraNumber
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      submitCitizenObjection({
        khasraNumber,
        reason,
        description,
        supportingDocument: attachedImage?.name || 'Photolog & Registered Deed',
        attachmentUrl: attachedImage?.url || null,
        attachmentName: attachedImage?.name || null,
        attachmentType: attachedImage?.type || 'image/jpeg',
        attachmentSize: attachedImage?.size || null,
      });

      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-orange-50 text-orange-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-orange-200">
              {lang === 'hi' ? 'धारा 15 दावा एवं आपत्ति मंच' : 'Section 15 Claim & Objection Forum'}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">RFCTLARR Act 2013</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
            {lang === 'hi'
              ? 'भूमि आपत्ति एवं पुनर्मूल्यांकन दावा प्रस्तुत करें'
              : 'Submit Land Objection & Evidence Claim'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            File objections regarding area discrepancy, commercial frontage, or family partition with photo & document evidence.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate('/citizen/notices')}
            className="bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition shrink-0"
          >
            View Published Notice
          </button>

          <button
            onClick={() => navigate('/')}
            className="bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 p-2 sm:px-3 sm:py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
            title="Close & Return to Dashboard (बंद करें)"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Objection Filing Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-5">
          <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <MessageSquareWarning className="w-5 h-5 text-gov-saffron-600" />
            <span>{lang === 'hi' ? 'ऑनलाइन आपत्ति आवेदन प्रपत्र' : 'Online Citizen Objection & Evidence Form'}</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Khasra Selector */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Target Land Parcel (खसरा संख्या) *
              </label>
              <select
                value={khasraNumber}
                onChange={(e) => setKhasraNumber(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 font-bold text-slate-900 bg-slate-50 focus:ring-2 focus:ring-gov-blue-800"
              >
                <option value="101">Khasra 101 - Ram Kumar (2.50 Acre, Nagla, Agra)</option>
                <option value="102">Khasra 102 - Ramesh Kumar (1.80 Acre, Nagla)</option>
                <option value="103">Khasra 103 - Sunita Devi (3.20 Acre, Nagla)</option>
                <option value="117">Khasra 117 - Vijay Pal Yadav (3.50 Acre, Nagla)</option>
              </select>
            </div>

            {/* Quick Reason / Category */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Primary Ground of Objection (आपत्ति का मुख्य कारण) *
              </label>
              <input
                type="text"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Notice me land area incorrect mention hai."
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-gov-blue-800"
              />
            </div>

            {/* Detailed Description */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Detailed Claim & Description (विस्तृत विवरण) *
              </label>
              <textarea
                rows="3"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide complete facts regarding physical trees, tubewells, built structures, or registered partition deed..."
                className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-gov-blue-800 text-xs font-medium"
              />
            </div>

            {/* Image / Evidence Attachment Upload Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-slate-700 uppercase tracking-wider">
                  Upload Evidence Photo / Document (प्रमाण चित्र / दस्तावेज़)
                </label>
                <span className="text-[10px] text-gov-blue-900 font-semibold bg-gov-blue-50 px-2 py-0.5 rounded border border-gov-blue-200">
                  Image Upload Feature
                </span>
              </div>

              {/* Upload Input Area */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*,.pdf"
                className="hidden"
                id="objection-file-upload"
              />

              {!attachedImage ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-gov-blue-800 rounded-2xl p-5 text-center bg-slate-50 hover:bg-gov-blue-50/40 cursor-pointer transition flex flex-col items-center justify-center gap-2 group"
                >
                  <div className="p-3 bg-white rounded-full shadow-sm border border-slate-200 group-hover:scale-110 transition">
                    <UploadCloud className="w-6 h-6 text-gov-blue-800" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 text-xs block">
                      Click to Browse or Drag & Drop Photo / PDF
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Upload Farm Photo, Tubewell Evidence, Map, or Deed (JPG, PNG, PDF up to 15MB)
                    </span>
                  </div>
                </div>
              ) : (
                /* Attached Image Preview Card */
                <div className="bg-slate-50 border-2 border-gov-blue-200 rounded-2xl p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 bg-gov-blue-900 text-white rounded-lg">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-extrabold text-xs text-slate-900 block truncate max-w-[220px] sm:max-w-xs">
                          {attachedImage.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {attachedImage.size} • Attached Evidence
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPreviewModalImage(attachedImage.url)}
                        className="p-1.5 rounded-lg bg-white hover:bg-gov-blue-50 text-gov-blue-900 border border-slate-200 text-xs font-bold flex items-center gap-1 transition shadow-xs"
                        title="Zoom / Preview Image"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Preview</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveAttachment}
                        className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 text-xs font-bold transition shadow-xs"
                        title="Remove attached photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail Image */}
                  {attachedImage.url && (
                    <div
                      onClick={() => setPreviewModalImage(attachedImage.url)}
                      className="relative h-28 sm:h-36 w-full rounded-xl overflow-hidden border border-slate-300 cursor-pointer group bg-slate-900"
                    >
                      <img
                        src={attachedImage.url}
                        alt="Evidence Preview"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2.5">
                        <span className="text-white text-[10px] font-bold flex items-center gap-1">
                          <Eye className="w-3 h-3 text-gov-saffron-400" />
                          Tap to view full resolution photo
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quick Sample Demo Evidence Chips */}
              <div className="pt-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5">
                  Or load quick demo evidence photos:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {sampleEvidence.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSample(sample)}
                      className="bg-white hover:bg-gov-blue-50 text-slate-700 hover:text-gov-blue-900 border border-slate-200 hover:border-gov-blue-300 text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-lg transition shadow-xs"
                    >
                      {sample.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gov-saffron-600 hover:bg-gov-saffron-500 text-white font-extrabold py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition transform active:scale-98 text-xs"
            >
              {isSubmitting ? (
                <span>Registering Objection & Uploading Evidence...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Objection with Attached Photo</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: History & Status Tracker (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-gov space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-extrabold text-slate-900">
                Submitted Objections & Evidence
              </h3>
              <span className="text-[10px] font-bold bg-gov-blue-50 text-gov-blue-900 px-2 py-0.5 rounded-full border border-gov-blue-200">
                {myObjections.length} Records
              </span>
            </div>

            {myObjections.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                No active objections filed yet.
              </div>
            ) : (
              myObjections.map((obj) => (
                <div key={obj.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-gov-blue-900 bg-gov-blue-50 px-2 py-0.5 rounded border border-gov-blue-200">
                      {obj.id}
                    </span>
                    <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 text-[10px]">
                      {obj.status}
                    </span>
                  </div>

                  <p className="font-bold text-slate-800">"{obj.reason}"</p>
                  <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2">
                    {obj.description}
                  </p>

                  {/* Attached Evidence Preview in List */}
                  {obj.attachmentUrl && (
                    <div
                      onClick={() => setPreviewModalImage(obj.attachmentUrl)}
                      className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-gov-blue-800 transition"
                    >
                      <img
                        src={obj.attachmentUrl}
                        alt="Evidence thumbnail"
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-[11px] text-gov-blue-900 block truncate">
                          {obj.attachmentName || obj.supportingDocument}
                        </span>
                        <span className="text-[9px] text-slate-400 block">
                          Click to inspect photo
                        </span>
                      </div>
                      <Eye className="w-4 h-4 text-gov-saffron-600 shrink-0 mr-1" />
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Filed: {formatDate(obj.submissionDate)}</span>
                    <span className="font-semibold text-gov-blue-800">Hearing: Scheduled</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Full-Screen Image Zoom / Inspection Modal */}
      <Modal
        isOpen={!!previewModalImage}
        onClose={() => setPreviewModalImage(null)}
        title="Evidence Photo Inspection Viewer"
        subtitle="Uploaded Citizen Objection Photolog"
        maxWidth="max-w-3xl"
      >
        <div className="space-y-3">
          <div className="rounded-xl overflow-hidden border border-slate-300 bg-slate-900 max-h-[65vh] flex items-center justify-center">
            {previewModalImage && (
              <img
                src={previewModalImage}
                alt="Enlarged Evidence"
                className="max-h-[60vh] w-auto max-w-full object-contain mx-auto"
              />
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Verified Digital Artifact • Sub-Registrar / Land Owner Record</span>
            <button
              onClick={() => setPreviewModalImage(null)}
              className="bg-gov-blue-900 text-white font-bold px-4 py-1.5 rounded-lg text-xs"
            >
              Close Viewer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
