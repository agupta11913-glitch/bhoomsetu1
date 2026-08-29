import React, { useState } from 'react';
import { useLandData } from '../../context/LandDataContext';
import { useAuth } from '../../context/AuthContext';
import {
  FileSearch,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  X,
} from 'lucide-react';

export const AIDocumentOCRModal = ({ isOpen, onClose, defaultKhasraId = '101' }) => {
  const { khasras, verifyRevenueRecord, showToast } = useLandData();
  const { currentUser } = useAuth();

  const [selectedKhasraId, setSelectedKhasraId] = useState(defaultKhasraId);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanStep, setScanStep] = useState(0); // 0: upload, 1: scanned/extracted, 2: compared
  const [extractedData, setExtractedData] = useState(null);

  if (!isOpen) return null;

  const currentKhasra = khasras.find((k) => k.khasraNumber === selectedKhasraId) || khasras[0];

  const handleSimulatedUpload = (docName) => {
    setSelectedFile(docName);
    setIsProcessing(true);
    setScanStep(1);

    setTimeout(() => {
      // Extract based on chosen parcel
      if (selectedKhasraId === '102') {
        // Ramesh Kumar mismatch scenario
        setExtractedData({
          documentType: 'Registered Sale Deed No. 8812/2019',
          ownerName: 'Ramesh Kumar', // mismatch with Bhulekh Rameshwar Kumar
          khasraNumber: '102',
          areaAcre: 1.80,
          village: 'Nagla',
          tehsil: 'Fatehabad',
          executionDate: '2019-11-04',
          ocrConfidence: 93.4,
          comparison: {
            ownerMatch: false,
            areaMatch: true,
            khasraMatch: true,
            villageMatch: true,
            overallStatus: 'POSSIBLE_MISMATCH',
            warning: 'Owner Name spelling difference detected (Bhulekh: "Rameshwar Kumar" vs Deed: "Ramesh Kumar").',
          },
        });
      } else if (selectedKhasraId === '117') {
        // Vijay Pal area mismatch
        setExtractedData({
          documentType: 'Partition Deed & Revenue Entry #441',
          ownerName: 'Vijay Pal Yadav',
          khasraNumber: '117',
          areaAcre: 2.90, // mismatch with Bhulekh 3.50 Acre
          village: 'Nagla',
          tehsil: 'Fatehabad',
          executionDate: '2020-07-15',
          ocrConfidence: 96.1,
          comparison: {
            ownerMatch: true,
            areaMatch: false,
            khasraMatch: true,
            villageMatch: true,
            overallStatus: 'AREA_MISMATCH',
            warning: 'Area Discrepancy: Deed records 2.90 Acre while Bhulekh records 3.50 Acre (0.60 Acre variance).',
          },
        });
      } else {
        // Khasra 101 - Perfect Match
        setExtractedData({
          documentType: 'Registered Sale Deed No. 4102/2018',
          ownerName: 'Ram Kumar',
          khasraNumber: '101',
          areaAcre: 2.50,
          village: 'Nagla',
          tehsil: 'Fatehabad',
          executionDate: '2018-04-12',
          ocrConfidence: 98.8,
          comparison: {
            ownerMatch: true,
            areaMatch: true,
            khasraMatch: true,
            villageMatch: true,
            overallStatus: 'PERFECT_MATCH',
            warning: null,
          },
        });
      }

      setIsProcessing(false);
      setScanStep(2);
    }, 1200);
  };

  const handleVerify = () => {
    verifyRevenueRecord(currentKhasra.id, 'AI Document OCR extraction verified 100% match with Bhulekh RoR.');
    showToast('Record Verified', `Khasra ${currentKhasra.khasraNumber} verified and updated in registry.`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gov-blue-900 text-white p-4 flex items-center justify-between border-b border-gov-blue-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gov-saffron-600/30 border border-gov-saffron-500/50">
              <FileSearch className="w-5 h-5 text-gov-saffron-500" />
            </div>
            <div>
              <h3 className="font-extrabold text-base flex items-center gap-2">
                AI Land Document Analyzer & OCR Matcher
                <span className="bg-gov-saffron-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Automated Mismatch Detector
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Upload registered deed or acquisition notice to verify against Bhulekh RoR records
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-gov-blue-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 p-5 overflow-y-auto space-y-5 bg-slate-50">
          {/* Step 1: Document Selector / Dropzone */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Select Khasra Parcel to Inspect:
                </label>
                <select
                  value={selectedKhasraId}
                  onChange={(e) => {
                    setSelectedKhasraId(e.target.value);
                    setScanStep(0);
                    setExtractedData(null);
                  }}
                  className="mt-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-gov-blue-800"
                >
                  <option value="101">Khasra 101 - Ram Kumar (Clean Record Demo)</option>
                  <option value="102">Khasra 102 - Ramesh Kumar (Name Mismatch Demo)</option>
                  <option value="117">Khasra 117 - Vijay Pal Yadav (Area Variance Demo)</option>
                  <option value="104">Khasra 104 - Harish Chandra Sharma</option>
                  <option value="105">Khasra 105 - Baldev Singh</option>
                </select>
              </div>

              <span className="text-[11px] bg-blue-50 text-blue-800 px-2.5 py-1 rounded-lg font-semibold border border-blue-200">
                Target: Khasra {currentKhasra.khasraNumber} ({currentKhasra.ownerName})
              </span>
            </div>

            {/* Quick Sample Document Buttons */}
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-600 block mb-1.5">
                Choose Demo Document to Analyze:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  onClick={() => handleSimulatedUpload(`Registered_Deed_Khasra_${currentKhasra.khasraNumber}.pdf`)}
                  className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-gov-blue-50 hover:border-gov-blue-300 text-left transition group"
                >
                  <FileText className="w-5 h-5 text-gov-blue-700 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Registered Sale Deed #{currentKhasra.khasraNumber}
                    </span>
                    <span className="text-[10px] text-slate-500">PDF • 2.4 MB • Sub-Registrar Certified</span>
                  </div>
                </button>

                <button
                  onClick={() => handleSimulatedUpload(`Acquisition_Notice_${currentKhasra.khasraNumber}.pdf`)}
                  className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-gov-blue-50 hover:border-gov-blue-300 text-left transition group"
                >
                  <FileText className="w-5 h-5 text-gov-saffron-600 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Gazette Sec-11 Notice #{currentKhasra.khasraNumber}
                    </span>
                    <span className="text-[10px] text-slate-500">PDF • 1.1 MB • Official Gazette</span>
                  </div>
                </button>

                <button
                  onClick={() => handleSimulatedUpload(`Khatauni_Extract_${currentKhasra.khasraNumber}.pdf`)}
                  className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-gov-blue-50 hover:border-gov-blue-300 text-left transition group"
                >
                  <FileText className="w-5 h-5 text-emerald-700 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Bhulekh Khatauni RoR Extract
                    </span>
                    <span className="text-[10px] text-slate-500">PDF • 890 KB • Fasli 1431-1436</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Processing Animation */}
          {isProcessing && (
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center space-y-3">
              <div className="inline-flex p-3 rounded-full bg-gov-blue-50 border border-gov-blue-200 animate-pulse">
                <Sparkles className="w-8 h-8 text-gov-saffron-500 animate-spin" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                Running Neural OCR & Entity Extraction...
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Parsing Hindi/English typography, extracting Khatauni seal, measuring polygon acreage, and cross-matching with Bhulekh RoR database.
              </p>
            </div>
          )}

          {/* Step 2: Side-by-Side Comparison Matrix */}
          {scanStep === 2 && extractedData && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Overall AI Verdict Banner */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  extractedData.comparison.overallStatus === 'PERFECT_MATCH'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                {extractedData.comparison.overallStatus === 'PERFECT_MATCH' ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h4 className="font-extrabold text-sm flex items-center justify-between">
                    <span>
                      {extractedData.comparison.overallStatus === 'PERFECT_MATCH'
                        ? 'OWNERSHIP & BOUNDARY MATCH VERIFIED ✓'
                        : 'POSSIBLE RECORD MISMATCH DETECTED ⚠'}
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border">
                      OCR Confidence: {extractedData.ocrConfidence}%
                    </span>
                  </h4>
                  <p className="text-xs mt-1">
                    {extractedData.comparison.warning ||
                      'All extracted attributes from the uploaded document perfectly match the official Bhulekh Record of Rights (RoR).'}
                  </p>
                </div>
              </div>

              {/* Side by Side Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: Bhulekh Record */}
                <div className="bg-white p-4 rounded-xl border-2 border-gov-blue-800 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-extrabold uppercase text-gov-blue-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-gov-blue-800" />
                      Official Bhulekh Record (RoR)
                    </span>
                    <span className="text-[10px] bg-gov-blue-50 text-gov-blue-800 font-bold px-2 py-0.5 rounded">
                      Simulated Gov Database
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Recorded Owner:</span>
                      <span className="font-bold text-slate-900">
                        {currentKhasra.bhulekhRecord?.recordedOwner || currentKhasra.ownerName}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Khasra Number:</span>
                      <span className="font-bold text-slate-900">{currentKhasra.khasraNumber}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Recorded Area:</span>
                      <span className="font-bold text-slate-900">{currentKhasra.areaAcre} Acre</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Village & Tehsil:</span>
                      <span className="font-medium text-slate-800">{currentKhasra.village}, {currentKhasra.tehsil}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Fascicle No:</span>
                      <span className="font-mono text-slate-700">{currentKhasra.bhulekhRecord?.fascicleNumber}</span>
                    </div>
                  </div>
                </div>

                {/* Right: AI OCR Extracted Document */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-extrabold uppercase text-slate-800 flex items-center gap-1.5">
                      <FileSearch className="w-4 h-4 text-gov-saffron-600" />
                      Uploaded Document (AI OCR)
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded">
                      {selectedFile}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100 items-center">
                      <span className="text-slate-500">Extracted Owner:</span>
                      <span className={`font-bold ${!extractedData.comparison.ownerMatch ? 'text-rose-600 bg-rose-50 px-1.5 rounded' : 'text-slate-900'}`}>
                        {extractedData.ownerName}
                        {extractedData.comparison.ownerMatch ? ' ✓' : ' ❌ Mismatch'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100 items-center">
                      <span className="text-slate-500">Khasra Number:</span>
                      <span className="font-bold text-slate-900">
                        {extractedData.khasraNumber} ✓
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100 items-center">
                      <span className="text-slate-500">Extracted Area:</span>
                      <span className={`font-bold ${!extractedData.comparison.areaMatch ? 'text-rose-600 bg-rose-50 px-1.5 rounded' : 'text-slate-900'}`}>
                        {extractedData.areaAcre} Acre
                        {extractedData.comparison.areaMatch ? ' ✓' : ' ⚠ Variance'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100 items-center">
                      <span className="text-slate-500">Village & Tehsil:</span>
                      <span className="font-medium text-slate-800">{extractedData.village}, {extractedData.tehsil} ✓</span>
                    </div>
                    <div className="flex justify-between py-1 items-center">
                      <span className="text-slate-500">Execution Date:</span>
                      <span className="font-mono text-slate-700">{extractedData.executionDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              setScanStep(0);
              setExtractedData(null);
            }}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-200 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Scan
          </button>

          <div className="flex items-center gap-3">
            {scanStep === 2 && (
              <>
                {extractedData.comparison.overallStatus === 'PERFECT_MATCH' ? (
                  <button
                    onClick={handleVerify}
                    className="bg-gov-green-600 hover:bg-gov-green-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow transition"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Verify Record as Revenue Officer
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      showToast('Flagged for Survey', `Khasra ${currentKhasra.khasraNumber} marked for manual Tehsildar survey.`, 'warning');
                      onClose();
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow transition"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Send for Manual Field Verification
                  </button>
                )}
              </>
            )}
            <button
              onClick={onClose}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold px-4 py-2 rounded-xl text-xs transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
