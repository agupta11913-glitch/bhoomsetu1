import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLandData } from '../../context/LandDataContext';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../../components/common/Modal';
import { formatDate } from '../../utils/formatters';
import {
  MessageSquareWarning,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Sparkles,
  Eye,
  FileText,
  Calendar,
  AlertTriangle,
  Image as ImageIcon,
  Camera,
  X,
} from 'lucide-react';

export const ObjectionReviewPage = () => {
  const navigate = useNavigate();
  const { objections, reviewObjection, showToast } = useLandData();
  const { currentUser } = useAuth();

  const [selectedObjection, setSelectedObjection] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [decisionNotes, setDecisionNotes] = useState('');
  const [inspectedImage, setInspectedImage] = useState(null);

  const handleOpenReview = (obj) => {
    setSelectedObjection(obj);
    setDecisionNotes(obj.officerResponse || 'Field verification survey confirmed boundary measurement.');
    setShowReviewModal(true);
  };

  const handleDecision = (decisionType) => {
    if (!selectedObjection) return;
    reviewObjection(selectedObjection.id, decisionType, decisionNotes);
    setShowReviewModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-orange-50 text-orange-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-orange-200">
              Section 15 Citizen Hearing Forum
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">Special Land Acquisition Officer (SLAO) Court</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
            Citizen Objections, Evidence Photos & Claim Hearings
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Review claims and uploaded photo evidence regarding land boundary demarcation, tubewells, and valuation classification.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="bg-slate-100 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200">
            Total: {objections.length} Claims
          </span>

          <button
            onClick={() => navigate('/')}
            className="bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
            title="Close & Return to Dashboard (बंद करें)"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>
      </div>

      {/* Objections List */}
      <div className="grid grid-cols-1 gap-4">
        {objections.map((obj) => {
          const isPending = obj.status === 'Under Review' || obj.actionTaken === 'PENDING_OFFICER_REVIEW';

          return (
            <div
              key={obj.id}
              className={`bg-white rounded-2xl p-5 border shadow-gov transition space-y-4 ${
                isPending ? 'border-orange-200 ring-1 ring-orange-100' : 'border-slate-200'
              }`}
            >
              {/* Top Meta Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-extrabold bg-gov-blue-50 text-gov-blue-900 px-2.5 py-1 rounded-lg border border-gov-blue-200">
                    {obj.id}
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    Khasra {obj.khasraNumber} • {obj.ownerName}
                  </span>
                  <span className="text-[11px] text-slate-400">({obj.projectName})</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      isPending
                        ? 'bg-amber-50 text-amber-800 border border-amber-200 animate-pulse'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {obj.status}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Filed: {formatDate(obj.submissionDate)}
                  </span>
                </div>
              </div>

              {/* Claim Description & Attached Evidence */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center gap-2 text-slate-700 font-bold">
                  <MessageSquareWarning className="w-4 h-4 text-orange-600 shrink-0" />
                  <span>Objection Summary: "{obj.reason}"</span>
                </div>
                <p className="text-slate-600 leading-relaxed pl-6">
                  {obj.description}
                </p>

                {/* Uploaded Image Evidence Inspection Box */}
                {obj.attachmentUrl && (
                  <div className="pl-6 pt-1">
                    <div className="bg-white rounded-xl border border-slate-200 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={obj.attachmentUrl}
                          alt="Citizen Uploaded Evidence"
                          className="w-14 h-14 rounded-lg object-cover border border-slate-300 shrink-0"
                        />
                        <div>
                          <span className="text-[10px] font-bold uppercase text-gov-blue-900 bg-gov-blue-50 px-2 py-0.5 rounded border border-gov-blue-200">
                            Citizen Attached Photo Evidence
                          </span>
                          <p className="font-extrabold text-xs text-slate-900 mt-1">
                            {obj.attachmentName || obj.supportingDocument}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {obj.attachmentSize || 'Digital Artifact'} • Click to view full image
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setInspectedImage(obj.attachmentUrl)}
                        className="bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm transition shrink-0"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Photo Evidence</span>
                      </button>
                    </div>
                  </div>
                )}

                <div className="pl-6 pt-1 flex items-center gap-4 text-[11px] text-slate-500">
                  <span><strong>Supporting Document:</strong> {obj.supportingDocument}</span>
                  <span>•</span>
                  <span><strong>Hearing Schedule:</strong> {obj.hearingScheduled}</span>
                </div>
              </div>

              {/* Resolution History if resolved */}
              {obj.reviewedBy && (
                <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">
                      Hearing Completed by {obj.reviewedBy} on {formatDate(obj.reviewDate)}
                    </p>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      Decision Order: {obj.officerResponse}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Bar */}
              <div className="flex items-center justify-end gap-2.5 pt-1">
                <button
                  onClick={() => handleOpenReview(obj)}
                  className="bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5 transition"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{isPending ? 'Conduct Hearing & Record Decision' : 'Update Hearing Order'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Decision Hearing Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title={`Official Hearing Order: ${selectedObjection?.id}`}
        subtitle={`Khasra ${selectedObjection?.khasraNumber} (${selectedObjection?.ownerName})`}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4 text-xs">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-700 block">Citizen Claim & Evidence:</span>
            <p className="text-slate-800 font-semibold">"{selectedObjection?.reason}"</p>
            <p className="text-[11px] text-slate-600">{selectedObjection?.description}</p>

            {selectedObjection?.attachmentUrl && (
              <div
                onClick={() => setInspectedImage(selectedObjection.attachmentUrl)}
                className="mt-2 p-2 bg-white rounded-lg border border-slate-200 flex items-center gap-2 cursor-pointer hover:border-gov-blue-800 transition"
              >
                <img
                  src={selectedObjection.attachmentUrl}
                  alt="Evidence"
                  className="w-10 h-10 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-gov-blue-900 block truncate">
                    {selectedObjection.attachmentName || 'Attached Evidence Photo'}
                  </span>
                  <span className="text-[10px] text-slate-400">Click to view full photo</span>
                </div>
                <Eye className="w-4 h-4 text-gov-saffron-600" />
              </div>
            )}
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              SLAO Statutory Findings & Order Notes *
            </label>
            <textarea
              rows="3"
              value={decisionNotes}
              onChange={(e) => setDecisionNotes(e.target.value)}
              className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-gov-blue-800 font-medium"
              placeholder="Record the reasoning of the SLAO hearing order..."
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2.5">
            <button
              onClick={() => handleDecision('REJECTED')}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Overrule Objection</span>
            </button>

            <button
              onClick={() => handleDecision('ACCEPTED')}
              className="bg-gov-green-600 hover:bg-gov-green-700 text-white font-extrabold px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Accept & Settle Claim (Proceed to Award)</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* Full-Screen Evidence Photo Inspection Modal */}
      <Modal
        isOpen={!!inspectedImage}
        onClose={() => setInspectedImage(null)}
        title="Official Evidence Photo Inspection"
        subtitle="Citizen Section 15 Claim Submission"
        maxWidth="max-w-3xl"
      >
        <div className="space-y-3">
          <div className="rounded-xl overflow-hidden border border-slate-300 bg-slate-900 max-h-[65vh] flex items-center justify-center">
            {inspectedImage && (
              <img
                src={inspectedImage}
                alt="Enlarged Evidence"
                className="max-h-[60vh] w-auto max-w-full object-contain mx-auto"
              />
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Verified Digital Photographic Evidence • SLAO Court Repository</span>
            <button
              onClick={() => setInspectedImage(null)}
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
