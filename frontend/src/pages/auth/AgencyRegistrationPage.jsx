import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GovEmblem } from '../../components/common/GovEmblem';
import {
  INDIAN_STATES,
  DISTRICTS_BY_STATE,
  AGENCY_ORG_TYPES,
  PROTOTYPE_DISCLAIMER,
} from '../../utils/constants';
import {
  Building2,
  FileText,
  User,
  Phone,
  Mail,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  UploadCloud,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Search,
  Check,
  X,
} from 'lucide-react';

export const AgencyRegistrationPage = () => {
  const navigate = useNavigate();
  const { registerAgency } = useAuth();

  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: AGENCY_ORG_TYPES[0],
    organizationId: '',
    orgEmail: '',
    orgPhone: '',
    state: 'Uttar Pradesh',
    district: 'Agra',
    officeAddress: '',
    repName: '',
    repDesignation: '',
    repEmail: '',
    repPhone: '',
    authLetterName: '',
    certName: '',
    password: '',
    confirmPassword: '',
    termsAgreed: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState('');

  const validate = () => {
    const errs = {};
    if (!formData.organizationName.trim()) errs.organizationName = 'Organization Name is required';
    if (!formData.organizationId.trim()) errs.organizationId = 'Organization / Requisition ID is required';
    if (!formData.orgEmail.trim()) errs.orgEmail = 'Organization Email is required';
    if (!formData.orgPhone.trim()) errs.orgPhone = 'Organization Phone is required';
    if (!formData.officeAddress.trim()) errs.officeAddress = 'Registered Office Address is required';

    if (!formData.repName.trim()) errs.repName = 'Authorized Representative Name is required';
    if (!formData.repDesignation.trim()) errs.repDesignation = 'Representative Designation is required';
    if (!formData.repEmail.trim()) errs.repEmail = 'Representative Email is required';
    if (!formData.repPhone.trim() || !/^[6-9]\d{9}$/.test(formData.repPhone.trim())) {
      errs.repPhone = 'Enter a valid 10-digit mobile number';
    }

    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errs.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (!formData.termsAgreed) {
      errs.terms = 'Please accept statutory project proponent terms and conditions';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const res = await registerAgency(formData);
    setApplicationId(res?.applicationId || 'APP-AGN-2026-1010');
    setIsSubmitted(true);
  };

  const districts = DISTRICTS_BY_STATE[formData.state] || ['Agra', 'Meerut', 'Lucknow'];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
      {/* Top Gov Bar */}
      <div className="bg-gov-blue-950 text-slate-300 px-3 sm:px-6 py-2 text-[10px] sm:text-xs flex items-center justify-between border-b border-gov-blue-900">
        <div className="flex items-center gap-1.5 sm:gap-2 font-semibold truncate">
          <span className="text-gov-saffron-500 truncate">भारत सरकार | Government of India</span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="hidden md:inline">Project Implementing Agency Registration Portal</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="bg-gov-saffron-600/30 text-gov-saffron-500 font-bold px-2 py-0.5 rounded text-[9px] sm:text-[10px] border border-gov-saffron-500/40">
            SIH 2026 PROTOTYPE
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-6">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/register')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-gov-blue-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Role Selection</span>
          </button>

          <span className="text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
            Step 2 of 4: Project Implementing Agency
          </span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-gov space-y-6">
          {!isSubmitted ? (
            <>
              {/* Header Info */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-2xl bg-cyan-50 text-cyan-800 border border-cyan-200">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      Project Implementing Agency Registration
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      For NHAI, Railways, DFCCIL, State PWDs, and industrial infrastructure proponents.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-6 text-xs">
                {/* 1. Organization Details */}
                <div className="space-y-4">
                  <h3 className="text-xs font-extrabold text-gov-blue-900 uppercase tracking-wider border-b border-slate-100 pb-1">
                    1. Organization & Entity Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Full Organization Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.organizationName}
                        onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                        placeholder="e.g. National Highways Authority of India (NHAI)"
                        className={`w-full bg-slate-50 border rounded-xl p-2.5 font-semibold text-slate-900 ${
                          errors.organizationName ? 'border-rose-500' : 'border-slate-300'
                        }`}
                      />
                      {errors.organizationName && <p className="text-[10px] text-rose-600 mt-1">{errors.organizationName}</p>}
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Organization Type *
                      </label>
                      <select
                        value={formData.organizationType}
                        onChange={(e) => setFormData({ ...formData, organizationType: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
                      >
                        {AGENCY_ORG_TYPES.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Registration / Entity ID *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.organizationId}
                        onChange={(e) => setFormData({ ...formData, organizationId: e.target.value })}
                        placeholder="e.g. ORG-NHAI-DME-001"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono text-slate-900 font-bold"
                      />
                      {errors.organizationId && <p className="text-[10px] text-rose-600 mt-1">{errors.organizationId}</p>}
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Official Org Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.orgEmail}
                        onChange={(e) => setFormData({ ...formData, orgEmail: e.target.value })}
                        placeholder="agency@nhai.org"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
                      />
                      {errors.orgEmail && <p className="text-[10px] text-rose-600 mt-1">{errors.orgEmail}</p>}
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Official Contact Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.orgPhone}
                        onChange={(e) => setFormData({ ...formData, orgPhone: e.target.value })}
                        placeholder="+91 11 2507 4100"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
                      />
                      {errors.orgPhone && <p className="text-[10px] text-rose-600 mt-1">{errors.orgPhone}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">State *</label>
                      <select
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value, district: DISTRICTS_BY_STATE[e.target.value]?.[0] || 'Agra' })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
                      >
                        {INDIAN_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">HQ / Project District *</label>
                      <select
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
                      >
                        {districts.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Registered Office Address *</label>
                    <textarea
                      rows={2}
                      required
                      value={formData.officeAddress}
                      onChange={(e) => setFormData({ ...formData, officeAddress: e.target.value })}
                      placeholder="Project Implementation Unit (PIU) Office Complex"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
                    />
                    {errors.officeAddress && <p className="text-[10px] text-rose-600 mt-1">{errors.officeAddress}</p>}
                  </div>
                </div>

                {/* 2. Authorized Representative */}
                <div className="space-y-4">
                  <h3 className="text-xs font-extrabold text-gov-blue-900 uppercase tracking-wider border-b border-slate-100 pb-1">
                    2. Authorized Nodal Representative
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Representative Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.repName}
                        onChange={(e) => setFormData({ ...formData, repName: e.target.value })}
                        placeholder="e.g. Sh. Rajesh Verma"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
                      />
                      {errors.repName && <p className="text-[10px] text-rose-600 mt-1">{errors.repName}</p>}
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Designation *</label>
                      <input
                        type="text"
                        required
                        value={formData.repDesignation}
                        onChange={(e) => setFormData({ ...formData, repDesignation: e.target.value })}
                        placeholder="e.g. Chief General Manager (Land Acquisition)"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
                      />
                      {errors.repDesignation && <p className="text-[10px] text-rose-600 mt-1">{errors.repDesignation}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Representative Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.repEmail}
                        onChange={(e) => setFormData({ ...formData, repEmail: e.target.value })}
                        placeholder="rajesh.verma@nhai.org"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
                      />
                      {errors.repEmail && <p className="text-[10px] text-rose-600 mt-1">{errors.repEmail}</p>}
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Representative Mobile *</label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={formData.repPhone}
                        onChange={(e) => setFormData({ ...formData, repPhone: e.target.value.replace(/\D/g, '') })}
                        placeholder="10-digit mobile number"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
                      />
                      {errors.repPhone && <p className="text-[10px] text-rose-600 mt-1">{errors.repPhone}</p>}
                    </div>
                  </div>
                </div>

                {/* 3. Document Attachments */}
                <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    3. Mock Statutory Documents (Prototype Attachments)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3 bg-white rounded-xl border border-dashed border-slate-300 text-center space-y-1.5">
                      <UploadCloud className="w-5 h-5 text-gov-blue-900 mx-auto" />
                      <span className="font-bold text-slate-800 block">Board Authorization Letter</span>
                      <p className="text-[10px] text-slate-400">Sample PDF (Mock)</p>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, authLetterName: 'NHAI_Board_Resolution_Auth_2026.pdf' })}
                        className="text-[11px] font-bold text-gov-blue-900 hover:underline"
                      >
                        {formData.authLetterName ? `✓ ${formData.authLetterName}` : '+ Attach Mock Authorization'}
                      </button>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-dashed border-slate-300 text-center space-y-1.5">
                      <UploadCloud className="w-5 h-5 text-gov-blue-900 mx-auto" />
                      <span className="font-bold text-slate-800 block">Organization Certificate</span>
                      <p className="text-[10px] text-slate-400">Sample PDF (Mock)</p>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, certName: 'NHAI_Statutory_Act_Gazette_Extract.pdf' })}
                        className="text-[11px] font-bold text-gov-blue-900 hover:underline"
                      >
                        {formData.certName ? `✓ ${formData.certName}` : '+ Attach Mock Certificate'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. Password */}
                <div className="space-y-4">
                  <h3 className="text-xs font-extrabold text-gov-blue-900 uppercase tracking-wider border-b border-slate-100 pb-1">
                    4. Security Credentials
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Password *</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder="Min. 8 characters"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-9 py-2.5 font-semibold text-slate-900"
                        />
                        <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-3 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-[10px] text-rose-600 mt-1">{errors.password}</p>}
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Confirm Password *</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          placeholder="Re-enter password"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-9 py-2.5 font-semibold text-slate-900"
                        />
                        <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-2.5 top-3 text-slate-400 hover:text-slate-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-[10px] text-rose-600 mt-1">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                </div>

                {/* Terms checkbox */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={formData.termsAgreed}
                    onChange={(e) => setFormData({ ...formData, termsAgreed: e.target.checked })}
                    className="mt-0.5 rounded text-gov-blue-900 focus:ring-gov-blue-800"
                  />
                  <label htmlFor="terms" className="text-slate-600 leading-snug">
                    I certify that I am the authorized representative of this agency. I agree to comply with RFCTLARR Act 2013 and national land requisition guidelines.
                  </label>
                </div>
                {errors.terms && <p className="text-[10px] text-rose-600">{errors.terms}</p>}

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-gov transition transform active:scale-98"
                >
                  <span>Submit Agency Registration Application</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            /* Confirmation State */
            <div className="text-center py-8 px-4 space-y-5 animate-fadeIn">
              <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-3xl flex items-center justify-center mx-auto shadow-md">
                <Clock className="w-9 h-9" />
              </div>

              <div className="space-y-1.5">
                <span className="bg-blue-100 text-blue-900 font-bold text-xs px-3 py-1 rounded-full border border-blue-300">
                  Status: PENDING VERIFICATION
                </span>
                <h3 className="text-2xl font-black text-slate-900">
                  Agency Registration Submitted Successfully
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Your implementing agency registration (<strong>{formData.organizationName}</strong>) has been queued for administrative verification.
                </p>
              </div>

              {/* Summary Box */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 max-w-md mx-auto text-xs text-left space-y-2">
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Organization:</span>
                  <span className="font-bold text-slate-900">{formData.organizationName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Authorized Officer:</span>
                  <span className="font-bold text-slate-900">{formData.repName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Application Tracking ID:</span>
                  <span className="font-mono font-extrabold text-blue-900">{applicationId}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => navigate('/registration-status')}
                  className="w-full sm:w-auto bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow transition"
                >
                  <Search className="w-4 h-4 text-gov-saffron-500" />
                  <span>Track Application Status</span>
                </button>

                <button
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-5 py-2.5 rounded-xl text-xs transition"
                >
                  Return to Sign In
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer disclaimer */}
      <div className="bg-slate-900 text-slate-400 text-center py-2.5 px-3 text-[9px] sm:text-[10px] border-t border-slate-800">
        {PROTOTYPE_DISCLAIMER}
      </div>
    </div>
  );
};
