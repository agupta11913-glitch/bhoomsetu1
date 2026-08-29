import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GovEmblem } from '../../components/common/GovEmblem';
import {
  INDIAN_STATES,
  DISTRICTS_BY_STATE,
  AUTHORITY_TYPES,
  PROTOTYPE_DISCLAIMER,
} from '../../utils/constants';
import {
  Landmark,
  ShieldCheck,
  User,
  Phone,
  Mail,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  Building2,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Search,
  BadgeCheck,
} from 'lucide-react';

export const AuthorityRegistrationPage = () => {
  const navigate = useNavigate();
  const { registerAuthority } = useAuth();

  const [formData, setFormData] = useState({
    authorityType: 'DISTRICT', // DISTRICT | STATE | CENTRAL
    officerName: '',
    designation: '',
    employeeId: '',
    email: '',
    mobile: '',
    departmentName: 'Office of the District Magistrate & Collectorate',
    ministryName: '',
    divisionName: '',
    state: 'Uttar Pradesh',
    district: 'Agra',
    officeAddress: '',
    password: '',
    confirmPassword: '',
    termsAgreed: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState('');

  const handleAuthorityTypeChange = (type) => {
    let defaultDept = 'Office of the District Magistrate & Collectorate';
    let defaultMinistry = '';
    if (type === 'STATE') {
      defaultDept = 'Department of Revenue & Land Reforms';
    } else if (type === 'CENTRAL') {
      defaultDept = 'PM Gati Shakti National Master Plan';
      defaultMinistry = 'Ministry of Road Transport & Highways (MoRTH)';
    }

    setFormData({
      ...formData,
      authorityType: type,
      departmentName: defaultDept,
      ministryName: defaultMinistry,
    });
  };

  const validate = () => {
    const errs = {};
    if (!formData.officerName.trim()) errs.officerName = 'Authorized Officer Name is required';
    if (!formData.designation.trim()) errs.designation = 'Official Designation is required';
    if (!formData.employeeId.trim()) errs.employeeId = 'Officer / Civil List ID is required';

    if (!formData.email.trim()) {
      errs.email = 'Official Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Enter a valid official email';
    }

    if (!formData.mobile.trim() || !/^[6-9]\d{9}$/.test(formData.mobile.trim())) {
      errs.mobile = 'Enter a valid 10-digit mobile number';
    }

    if (formData.authorityType === 'CENTRAL' && !formData.ministryName.trim()) {
      errs.ministryName = 'Central Ministry name is required';
    }

    if (!formData.officeAddress.trim()) errs.officeAddress = 'Official Secretariat / Office Address is required';

    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errs.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (!formData.termsAgreed) {
      errs.terms = 'Please accept statutory authority declarations';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const res = await registerAuthority(formData);
    setApplicationId(res?.applicationId || 'APP-AUTH-2026-1010');
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
          <span className="hidden md:inline">Government Authority & Ministry Registration Portal</span>
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

          <span className="text-xs font-bold text-purple-900 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full">
            Step 2 of 4: Government Authority
          </span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-gov space-y-6">
          {!isSubmitted ? (
            <>
              {/* Header Info */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-900 border border-purple-200">
                    <Landmark className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      Government Authority Registration
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      For District Collectors / DMs, State Revenue Secretariats, and Central Line Ministries.
                    </p>
                  </div>
                </div>
              </div>

              {/* 1. Authority Tier Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gov-blue-900">
                  Select Authority Tier *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {AUTHORITY_TYPES.map((t) => {
                    const isSelected = formData.authorityType === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleAuthorityTypeChange(t.id)}
                        className={`p-3.5 rounded-2xl border text-left text-xs transition ${
                          isSelected
                            ? 'bg-gov-blue-900 text-white border-gov-blue-900 shadow-md ring-2 ring-gov-saffron-500/50'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="font-extrabold block">{t.label.split('(')[0]}</span>
                        <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                          {t.label.includes('(') ? `(${t.label.split('(')[1]}` : ''}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-6 text-xs">
                {/* Dynamic Fields Based on Authority Type */}
                <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    {formData.authorityType === 'DISTRICT' && 'District Collectorate / CALA Details'}
                    {formData.authorityType === 'STATE' && 'State Government Department Details'}
                    {formData.authorityType === 'CENTRAL' && 'Central Ministry & Division Details'}
                  </h3>

                  {formData.authorityType === 'CENTRAL' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Central Ministry Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.ministryName}
                          onChange={(e) => setFormData({ ...formData, ministryName: e.target.value })}
                          placeholder="e.g. Ministry of Road Transport & Highways"
                          className="w-full bg-white border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
                        />
                        {errors.ministryName && <p className="text-[10px] text-rose-600 mt-1">{errors.ministryName}</p>}
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Department / Division Name</label>
                        <input
                          type="text"
                          value={formData.divisionName}
                          onChange={(e) => setFormData({ ...formData, divisionName: e.target.value })}
                          placeholder="e.g. PM Gati Shakti National Logistics Division"
                          className="w-full bg-white border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
                        />
                      </div>
                    </div>
                  )}

                  {formData.authorityType === 'STATE' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">State *</label>
                        <select
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
                        >
                          {INDIAN_STATES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">State Department Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.departmentName}
                          onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })}
                          placeholder="e.g. Department of Revenue & Land Reforms"
                          className="w-full bg-white border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
                        />
                      </div>
                    </div>
                  )}

                  {formData.authorityType === 'DISTRICT' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">State *</label>
                        <select
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value, district: DISTRICTS_BY_STATE[e.target.value]?.[0] || 'Agra' })}
                          className="w-full bg-white border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
                        >
                          {INDIAN_STATES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">District / Jurisdiction *</label>
                        <select
                          value={formData.district}
                          onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
                        >
                          {districts.map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Common Authorized Officer Details */}
                <div className="space-y-4">
                  <h3 className="text-xs font-extrabold text-gov-blue-900 uppercase tracking-wider border-b border-slate-100 pb-1">
                    Authorized Officer / IAS Cadre Credentials
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Officer Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.officerName}
                        onChange={(e) => setFormData({ ...formData, officerName: e.target.value })}
                        placeholder="e.g. Dr. Sunita Murthy, IAS"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
                      />
                      {errors.officerName && <p className="text-[10px] text-rose-600 mt-1">{errors.officerName}</p>}
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Designation *</label>
                      <input
                        type="text"
                        required
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                        placeholder="e.g. District Magistrate & CALA"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
                      />
                      {errors.designation && <p className="text-[10px] text-rose-600 mt-1">{errors.designation}</p>}
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Civil List / Officer ID *</label>
                      <input
                        type="text"
                        required
                        value={formData.employeeId}
                        onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                        placeholder="e.g. IAS-UP-2012-0044"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono text-slate-900 font-bold"
                      />
                      {errors.employeeId && <p className="text-[10px] text-rose-600 mt-1">{errors.employeeId}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Official Government Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="officer@nic.in"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
                      />
                      {errors.email && <p className="text-[10px] text-rose-600 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Official Mobile / CUG Number *</label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                        placeholder="10-digit mobile number"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
                      />
                      {errors.mobile && <p className="text-[10px] text-rose-600 mt-1">{errors.mobile}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Office / Secretariat Address *</label>
                    <textarea
                      rows={2}
                      required
                      value={formData.officeAddress}
                      onChange={(e) => setFormData({ ...formData, officeAddress: e.target.value })}
                      placeholder="Collectorate Complex / Central Ministry Secretariat"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
                    />
                    {errors.officeAddress && <p className="text-[10px] text-rose-600 mt-1">{errors.officeAddress}</p>}
                  </div>
                </div>

                {/* Password Credentials */}
                <div className="space-y-4">
                  <h3 className="text-xs font-extrabold text-gov-blue-900 uppercase tracking-wider border-b border-slate-100 pb-1">
                    Security Credentials
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
                    I certify that I am the designated statutory authority with quasi-judicial powers under the{' '}
                    <strong className="text-gov-blue-900">RFCTLARR Act 2013</strong> / PM Gati Shakti guidelines.
                  </label>
                </div>
                {errors.terms && <p className="text-[10px] text-rose-600">{errors.terms}</p>}

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-gov transition transform active:scale-98"
                >
                  <span>Submit Authority Registration Request</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            /* Confirmation Screen */
            <div className="text-center py-8 px-4 space-y-5 animate-fadeIn">
              <div className="w-16 h-16 bg-purple-100 text-purple-700 rounded-3xl flex items-center justify-center mx-auto shadow-md">
                <Clock className="w-9 h-9" />
              </div>

              <div className="space-y-1.5">
                <span className="bg-purple-100 text-purple-900 font-bold text-xs px-3 py-1 rounded-full border border-purple-300">
                  Status: PENDING VERIFICATION
                </span>
                <h3 className="text-2xl font-black text-slate-900">
                  Authority Registration Request Submitted
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Authority registration request submitted for administrative verification and digital signing key provisioning.
                </p>
              </div>

              {/* Summary Box */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 max-w-md mx-auto text-xs text-left space-y-2">
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Authorized Officer:</span>
                  <span className="font-bold text-slate-900">{formData.officerName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Tier / Jurisdiction:</span>
                  <span className="font-bold text-slate-900">{formData.authorityType} Authority</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Application Tracking ID:</span>
                  <span className="font-mono font-extrabold text-purple-900">{applicationId}</span>
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
