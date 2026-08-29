import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GovEmblem } from '../../components/common/GovEmblem';
import {
  INDIAN_STATES,
  DISTRICTS_BY_STATE,
  OFFICER_DEPARTMENTS,
  PROTOTYPE_DISCLAIMER,
} from '../../utils/constants';
import {
  ShieldCheck,
  Building2,
  BadgeCheck,
  User,
  Phone,
  Mail,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  Clock,
  ArrowRight,
  ArrowLeft,
  FileCheck,
  AlertTriangle,
  Search,
} from 'lucide-react';

export const OfficerRegistrationPage = () => {
  const navigate = useNavigate();
  const { registerOfficer } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    email: '',
    mobile: '',
    designation: '',
    department: 'Revenue Department (Bhulekh / Tehsildar)',
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

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full Name is required';
    if (!formData.employeeId.trim()) errs.employeeId = 'Government Employee ID is mandatory';
    if (!formData.designation.trim()) errs.designation = 'Official Designation is required';

    if (!formData.email.trim()) {
      errs.email = 'Official Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Enter a valid email address';
    }

    if (!formData.mobile.trim() || !/^[6-9]\d{9}$/.test(formData.mobile.trim())) {
      errs.mobile = 'Enter a valid 10-digit mobile number';
    }

    if (!formData.officeAddress.trim()) errs.officeAddress = 'Office Address is required';

    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errs.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (!formData.termsAgreed) {
      errs.terms = 'You must acknowledge the Official Secrets Act & Government Service rules';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const res = await registerOfficer(formData);
    setApplicationId(res?.applicationId || 'APP-OFF-2026-1010');
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
          <span className="hidden md:inline">Government Officer & CALA Enrollment Desk</span>
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

          <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
            Step 2 of 4: Government Officer Form
          </span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-gov space-y-6">
          {!isSubmitted ? (
            <>
              {/* Header Info */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-2xl bg-gov-blue-50 text-gov-blue-900 border border-gov-blue-200">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      Government Officer / CALA Registration
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      For Revenue Officers, Tehsildars, CALA Field Investigators, and SLAO Survey Personnel.
                    </p>
                  </div>
                </div>
              </div>

              {/* Notice Banner */}
              <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block text-amber-950">Statutory Verification Notice:</span>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Government officer accounts are strictly vetted by the District Collectorate / System Administrator before activation. Immediate login is restricted until verification is completed.
                  </p>
                </div>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-6 text-xs">
                {/* 1. Official Credentials */}
                <div className="space-y-4">
                  <h3 className="text-xs font-extrabold text-gov-blue-900 uppercase tracking-wider border-b border-slate-100 pb-1">
                    1. Officer Designation & Department
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Full Official Name *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Sh. Alok Srivastava"
                          className={`w-full bg-slate-50 border rounded-xl pl-8 pr-3 py-2.5 font-semibold text-slate-900 ${
                            errors.name ? 'border-rose-500' : 'border-slate-300'
                          }`}
                        />
                        <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                      </div>
                      {errors.name && <p className="text-[10px] text-rose-600 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Government Employee / Officer ID *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={formData.employeeId}
                          onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                          placeholder="e.g. UP-REV-2019-8812"
                          className={`w-full bg-slate-50 border rounded-xl pl-8 pr-3 py-2.5 font-mono font-bold text-slate-900 ${
                            errors.employeeId ? 'border-rose-500' : 'border-slate-300'
                          }`}
                        />
                        <BadgeCheck className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                      </div>
                      {errors.employeeId && <p className="text-[10px] text-rose-600 mt-1">{errors.employeeId}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Official Designation *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                        placeholder="e.g. Tehsildar & CALA Field Verification Officer"
                        className={`w-full bg-slate-50 border rounded-xl p-2.5 font-semibold text-slate-900 ${
                          errors.designation ? 'border-rose-500' : 'border-slate-300'
                        }`}
                      />
                      {errors.designation && <p className="text-[10px] text-rose-600 mt-1">{errors.designation}</p>}
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Department / Authority *
                      </label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-900"
                      >
                        {OFFICER_DEPARTMENTS.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. Official Contact & Jurisdiction */}
                <div className="space-y-4">
                  <h3 className="text-xs font-extrabold text-gov-blue-900 uppercase tracking-wider border-b border-slate-100 pb-1">
                    2. Official Contact & Jurisdiction
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Official Government Email (@gov.in / @nic.in recommended) *
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="officer@up.gov.in"
                          className={`w-full bg-slate-50 border rounded-xl pl-8 pr-3 py-2.5 font-semibold text-slate-900 ${
                            errors.email ? 'border-rose-500' : 'border-slate-300'
                          }`}
                        />
                        <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                      </div>
                      {errors.email && <p className="text-[10px] text-rose-600 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Official Mobile / CUG Number *
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={formData.mobile}
                          onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                          placeholder="10-digit mobile number"
                          className={`w-full bg-slate-50 border rounded-xl pl-8 pr-3 py-2.5 font-semibold text-slate-900 ${
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
                      <label className="block font-bold text-slate-700 mb-1">District / Division *</label>
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
                    <label className="block font-bold text-slate-700 mb-1">Official Office Address *</label>
                    <textarea
                      rows={2}
                      required
                      value={formData.officeAddress}
                      onChange={(e) => setFormData({ ...formData, officeAddress: e.target.value })}
                      placeholder="Tehsil Office Complex / CALA Division"
                      className={`w-full bg-slate-50 border rounded-xl p-2.5 font-semibold text-slate-900 ${
                        errors.officeAddress ? 'border-rose-500' : 'border-slate-300'
                      }`}
                    />
                    {errors.officeAddress && <p className="text-[10px] text-rose-600 mt-1">{errors.officeAddress}</p>}
                  </div>
                </div>

                {/* 3. Account Password */}
                <div className="space-y-4">
                  <h3 className="text-xs font-extrabold text-gov-blue-900 uppercase tracking-wider border-b border-slate-100 pb-1">
                    3. Security Credentials
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
                    I declare that I am an authorized officer of the specified government department. I agree to operate within the statutory frameworks of the{' '}
                    <strong className="text-gov-blue-900">RFCTLARR Act 2013</strong> and government IT security policies.
                  </label>
                </div>
                {errors.terms && <p className="text-[10px] text-rose-600">{errors.terms}</p>}

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-gov-blue-900 hover:bg-gov-blue-800 text-white font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-gov transition transform active:scale-98"
                >
                  <FileCheck className="w-4 h-4 text-gov-saffron-500" />
                  <span>Submit Registration for Department Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            /* Pending Verification Confirmation */
            <div className="text-center py-8 px-4 space-y-5 animate-fadeIn">
              <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-3xl flex items-center justify-center mx-auto shadow-md">
                <Clock className="w-9 h-9" />
              </div>

              <div className="space-y-1.5">
                <span className="bg-amber-100 text-amber-900 font-bold text-xs px-3 py-1 rounded-full border border-amber-300">
                  Status: PENDING VERIFICATION
                </span>
                <h3 className="text-2xl font-black text-slate-900">
                  Registration Request Submitted
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Your government officer account will be activated after department/admin verification of your Employee ID (<strong>{formData.employeeId}</strong>) and official email.
                </p>
              </div>

              {/* Summary Box */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 max-w-md mx-auto text-xs text-left space-y-2">
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Officer Name:</span>
                  <span className="font-bold text-slate-900">{formData.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Employee ID:</span>
                  <span className="font-mono font-bold text-gov-blue-900">{formData.employeeId}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1.5">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-semibold text-slate-800">{formData.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Application Tracking ID:</span>
                  <span className="font-mono font-extrabold text-amber-800">{applicationId}</span>
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
