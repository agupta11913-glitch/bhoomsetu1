import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GovEmblem } from '../../components/common/GovEmblem';
import { INDIAN_STATES, DISTRICTS_BY_STATE, PROTOTYPE_DISCLAIMER } from '../../utils/constants';
import {
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  FileText,
  Sparkles,
  AlertCircle,
  X,
} from 'lucide-react';

export const CitizenRegistrationPage = () => {
  const navigate = useNavigate();
  const { registerCitizen, login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    dob: '',
    state: 'Uttar Pradesh',
    district: 'Agra',
    address: '',
    pincode: '',
    aadhaarRef: '',
    khasraNumber: '101',
    village: 'Nagla',
    password: '',
    confirmPassword: '',
    termsAgreed: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdApplicationId, setCreatedApplicationId] = useState('');

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score <= 2) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
    if (score <= 3) return { score: 3, label: 'Good', color: 'bg-blue-500' };
    return { score: 4, label: 'Strong', color: 'bg-emerald-600' };
  };

  const strength = getPasswordStrength(formData.password);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full Name is required';
    if (!formData.mobile.trim()) {
      errs.mobile = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile.trim())) {
      errs.mobile = 'Enter a valid 10-digit Indian mobile number';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Enter a valid email address';
    }

    if (!formData.dob) errs.dob = 'Date of Birth is required';
    if (!formData.address.trim()) errs.address = 'Residential Address is required';
    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode.trim())) {
      errs.pincode = 'Enter a valid 6-digit PIN code';
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
      errs.terms = 'You must agree to the Terms & Conditions and Privacy Policy';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setShowOtpModal(true);
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otpValue];
    newOtp[index] = value;
    setOtpValue(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpVerify = async () => {
    const fullOtp = otpValue.join('');
    if (fullOtp === '123456' || fullOtp.length === 6) {
      const res = await registerCitizen(formData);
      setCreatedApplicationId(res?.applicationId || 'APP-CIT-2026-1010');
      setShowOtpModal(false);
      setIsSuccess(true);
    } else {
      setOtpError('Invalid OTP. Please enter prototype OTP: 123456');
    }
  };

  const districts = DISTRICTS_BY_STATE[formData.state] || ['Agra', 'Meerut', 'Lucknow'];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
      {/* Top Gov Bar */}
      <div className="bg-gov-blue-950 text-slate-300 px-3 sm:px-6 py-2 text-[10px] sm:text-xs flex items-center justify-between border-b border-gov-blue-900">
        <div className="flex items-center gap-1.5 sm:gap-2 font-semibold truncate">
          <span className="text-gov-saffron-500 truncate">भारत सरकार | Government of India</span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="hidden md:inline">Citizen & Land Owner Registration (National Portal)</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="bg-gov-saffron-600/30 text-gov-saffron-500 font-bold px-2 py-0.5 rounded text-[9px] sm:text-[10px] border border-gov-saffron-500/40">
            SIH 2026 PROTOTYPE
          </span>
        </div>
      </div>

      {/* Main Form Content */}
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

          <span className="text-xs font-bold text-gov-blue-900 bg-gov-blue-50 border border-gov-blue-200 px-3 py-1 rounded-full">
            Step 2 of 4: Citizen Registration
          </span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-gov space-y-6">
          {!isSuccess ? (
            <>
              {/* Form Title */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      Citizen / Land Owner Registration
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Register to track land acquisitions, view Section 11 notices, file objections, and monitor compensation DBT.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-6 text-xs">
                {/* 1. Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-xs font-extrabold text-gov-blue-900 uppercase tracking-wider border-b border-slate-100 pb-1">
                    1. Personal & Contact Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Full Name (as per Land Record / Aadhaar) *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Sh. Ram Kumar"
                          className={`w-full bg-slate-50 border rounded-xl pl-8 pr-3 py-2.5 font-semibold text-slate-900 focus:ring-2 focus:ring-gov-blue-800 ${
                            errors.name ? 'border-rose-500' : 'border-slate-300'
                          }`}
                        />
                        <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                      </div>
                      {errors.name && <p className="text-[10px] text-rose-600 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Mobile Number (for OTP & SMS Notifications) *
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={formData.mobile}
                          onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                          placeholder="10-digit mobile number"
                          className={`w-full bg-slate-50 border rounded-xl pl-8 pr-3 py-2.5 font-semibold text-slate-900 focus:ring-2 focus:ring-gov-blue-800 ${
                            errors.mobile ? 'border-rose-500' : 'border-slate-300'
                          }`}
                        />
                        <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                      </div>
                      {errors.mobile && <p className="text-[10px] text-rose-600 mt-1">{errors.mobile}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="name@example.com"
                          className={`w-full bg-slate-50 border rounded-xl pl-8 pr-3 py-2.5 font-semibold text-slate-900 focus:ring-2 focus:ring-gov-blue-800 ${
                            errors.email ? 'border-rose-500' : 'border-slate-300'
                          }`}
                        />
                        <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                      </div>
                      {errors.email && <p className="text-[10px] text-rose-600 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Date of Birth *
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          required
                          value={formData.dob}
                          onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                          className={`w-full bg-slate-50 border rounded-xl pl-8 pr-3 py-2.5 font-semibold text-slate-900 focus:ring-2 focus:ring-gov-blue-800 ${
                            errors.dob ? 'border-rose-500' : 'border-slate-300'
                          }`}
                        />
                        <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                      </div>
                      {errors.dob && <p className="text-[10px] text-rose-600 mt-1">{errors.dob}</p>}
                    </div>
                  </div>
                </div>

                {/* 2. Residential Location */}
                <div className="space-y-4">
                  <h3 className="text-xs font-extrabold text-gov-blue-900 uppercase tracking-wider border-b border-slate-100 pb-1">
                    2. Address & Jurisdiction
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                      <label className="block font-bold text-slate-700 mb-1">District *</label>
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

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">PIN Code *</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                        placeholder="6-digit PIN code"
                        className={`w-full bg-slate-50 border rounded-xl p-2.5 font-semibold text-slate-900 ${
                          errors.pincode ? 'border-rose-500' : 'border-slate-300'
                        }`}
                      />
                      {errors.pincode && <p className="text-[10px] text-rose-600 mt-1">{errors.pincode}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Residential Address *</label>
                    <textarea
                      rows={2}
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="House No., Street / Ward, Village / Town"
                      className={`w-full bg-slate-50 border rounded-xl p-2.5 font-semibold text-slate-900 ${
                        errors.address ? 'border-rose-500' : 'border-slate-300'
                      }`}
                    />
                    {errors.address && <p className="text-[10px] text-rose-600 mt-1">{errors.address}</p>}
                  </div>
                </div>

                {/* 3. Optional Land Reference */}
                <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                      3. Land / Property Reference (Optional)
                    </h3>
                    <span className="text-[10px] text-slate-400 font-semibold">Pre-links Bhulekh data</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Aadhaar Ref (Prototype Only)</label>
                      <input
                        type="text"
                        maxLength={14}
                        value={formData.aadhaarRef}
                        onChange={(e) => setFormData({ ...formData, aadhaarRef: e.target.value })}
                        placeholder="XXXX-XXXX-4821"
                        className="w-full bg-white border border-slate-300 rounded-xl p-2 font-mono text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Khasra / Survey Number</label>
                      <input
                        type="text"
                        value={formData.khasraNumber}
                        onChange={(e) => setFormData({ ...formData, khasraNumber: e.target.value })}
                        placeholder="e.g. 101"
                        className="w-full bg-white border border-slate-300 rounded-xl p-2 font-bold text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Village Name</label>
                      <input
                        type="text"
                        value={formData.village}
                        onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                        placeholder="e.g. Nagla"
                        className="w-full bg-white border border-slate-300 rounded-xl p-2 font-semibold text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Language & Theme Preferences (Optional) */}
                <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    4. Portal Preferences (Optional)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Preferred Language (भाषा)</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, languagePreference: 'ENGLISH' })}
                          className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition ${
                            formData.languagePreference === 'ENGLISH'
                              ? 'bg-gov-blue-900 text-white border-gov-blue-900 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          English
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, languagePreference: 'HINDI' })}
                          className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition ${
                            formData.languagePreference === 'HINDI'
                              ? 'bg-gov-blue-900 text-white border-gov-blue-900 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          हिंदी (Hindi)
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Visual Appearance (थीम)</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, themePreference: 'LIGHT' })}
                          className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition ${
                            formData.themePreference === 'LIGHT'
                              ? 'bg-gov-blue-900 text-white border-gov-blue-900 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          Light (लाइट)
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, themePreference: 'DARK' })}
                          className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition ${
                            formData.themePreference === 'DARK'
                              ? 'bg-gov-blue-900 text-white border-gov-blue-900 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          Dark (डार्क)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Security & Password */}
                <div className="space-y-4">
                  <h3 className="text-xs font-extrabold text-gov-blue-900 uppercase tracking-wider border-b border-slate-100 pb-1">
                    5. Account Credentials & Security
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
                          placeholder="Min. 8 chars (Bhoomi@123)"
                          className={`w-full bg-slate-50 border rounded-xl pl-8 pr-9 py-2.5 font-semibold text-slate-900 ${
                            errors.password ? 'border-rose-500' : 'border-slate-300'
                          }`}
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

                      {/* Password strength bar */}
                      {formData.password && (
                        <div className="mt-1.5 space-y-1">
                          <div className="flex gap-1 h-1.5">
                            {[1, 2, 3, 4].map((i) => (
                              <div
                                key={i}
                                className={`flex-1 rounded-full ${i <= strength.score ? strength.color : 'bg-slate-200'}`}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-slate-500">Strength: <strong>{strength.label}</strong></span>
                        </div>
                      )}
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
                          className={`w-full bg-slate-50 border rounded-xl pl-8 pr-9 py-2.5 font-semibold text-slate-900 ${
                            errors.confirmPassword ? 'border-rose-500' : 'border-slate-300'
                          }`}
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
                    I declare that the details furnished above are true to the best of my knowledge. I agree to the{' '}
                    <strong className="text-gov-blue-900">BhoomiSetu Terms of Service</strong> and{' '}
                    <strong className="text-gov-blue-900">RFCTLARR Act 2013 Citizen Declarations</strong>.
                  </label>
                </div>
                {errors.terms && <p className="text-[10px] text-rose-600">{errors.terms}</p>}

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-gov transition transform active:scale-98"
                >
                  <KeyRound className="w-4 h-4 text-gov-saffron-500" />
                  <span>Proceed to OTP Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            /* Registration Success Confirmation Card */
            <div className="text-center py-8 px-4 space-y-5 animate-fadeIn">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1.5">
                <span className="bg-emerald-50 text-emerald-800 font-bold text-xs px-3 py-1 rounded-full border border-emerald-200">
                  Account Status: ACTIVE
                </span>
                <h3 className="text-2xl font-black text-slate-900">
                  Citizen Account Created Successfully!
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Your identity has been verified via NICNET OTP. You can now log in to inspect your Khasra records and track acquisition notices.
                </p>
              </div>

              {/* Application Details Summary Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 max-w-md mx-auto text-xs text-left space-y-2">
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Citizen Name:</span>
                  <span className="font-bold text-slate-900">{formData.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Registered Email:</span>
                  <span className="font-mono text-slate-900">{formData.email}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Mobile Number:</span>
                  <span className="font-bold text-slate-900">+91 {formData.mobile}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Application Reference ID:</span>
                  <span className="font-mono font-extrabold text-gov-blue-900">{createdApplicationId}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    login(formData.email, formData.password, 'CITIZEN');
                    navigate('/');
                  }}
                  className="w-full sm:w-auto bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow transition"
                >
                  <span>Go to Citizen Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
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

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-[1000] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-fadeIn space-y-4">
            <div className="bg-gov-blue-950 text-white p-5 flex items-start justify-between">
              <div>
                <span className="text-[9px] uppercase font-bold text-gov-saffron-500 tracking-wider">
                  Two-Factor Authentication
                </span>
                <h3 className="text-lg font-black">Verify Mobile Number</h3>
                <p className="text-xs text-slate-300">OTP sent to +91 {formData.mobile}</p>
              </div>
              <button
                onClick={() => setShowOtpModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start gap-2 text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">SIH Prototype OTP: <span className="font-mono text-sm bg-amber-200/80 px-2 py-0.5 rounded">123456</span></p>
                  <p className="text-[10px] text-amber-800 mt-0.5">Enter 123456 below to simulate instant Aadhaar / Mobile authentication.</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-center font-extrabold text-slate-700">Enter 6-Digit OTP</label>
                <div className="flex justify-center gap-2">
                  {otpValue.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      className="w-11 h-12 text-center text-lg font-black border border-slate-300 rounded-xl bg-slate-50 focus:ring-2 focus:ring-gov-blue-900 focus:bg-white"
                    />
                  ))}
                </div>
                {otpError && <p className="text-center text-[10px] text-rose-600 font-bold">{otpError}</p>}
              </div>

              <div className="pt-2 flex justify-between items-center text-[11px] text-slate-500">
                <span>Didn't receive code?</span>
                <button
                  type="button"
                  onClick={() => {
                    setOtpValue(['1', '2', '3', '4', '5', '6']);
                    setOtpError('');
                  }}
                  className="text-gov-blue-900 font-extrabold hover:underline"
                >
                  Auto-Fill Demo OTP
                </button>
              </div>

              <button
                type="button"
                onClick={handleOtpVerify}
                className="w-full bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-extrabold py-3 rounded-xl shadow transition"
              >
                Verify & Activate Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer disclaimer */}
      <div className="bg-slate-900 text-slate-400 text-center py-2.5 px-3 text-[9px] sm:text-[10px] border-t border-slate-800">
        {PROTOTYPE_DISCLAIMER}
      </div>
    </div>
  );
};
