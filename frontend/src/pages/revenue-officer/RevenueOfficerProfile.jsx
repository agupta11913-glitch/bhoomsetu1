import React, { useState, useEffect } from 'react';
import { fetchRevenueProfileApi } from '../../services/api/revenueOfficerApi';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import {
  User,
  ShieldCheck,
  Building2,
  MapPin,
  RefreshCw,
  Phone,
  Mail,
  BadgeCheck,
} from 'lucide-react';

const RevenueOfficerProfileContent = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchRevenueProfileApi();
      if (data) setProfile(data);
    } catch (err) {
      console.error('Profile load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto select-none">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-50 text-amber-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-200 uppercase tracking-wider">
              Officer Identity & Jurisdiction
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">
              Government of Uttar Pradesh
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Revenue Officer Official Profile
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Designated Competent Authority for Land Acquisition (CALA) Field Verification Officer.
          </p>
        </div>
      </div>

      {/* 2. Profile Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-gov space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 border-b border-slate-100 pb-6">
          <div className="w-20 h-20 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center text-3xl font-black shadow-lg">
            AS
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h2 className="text-xl font-black text-slate-900">{profile?.name || 'Sh. Alok Srivastava'}</h2>
              <BadgeCheck className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-xs font-bold text-amber-900">{profile?.designation || 'Revenue Officer / Field CALA'}</p>
            <p className="text-xs text-slate-500">{profile?.department || 'Revenue & Land Records Department, Uttar Pradesh'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-500 block">Official Email Address:</span>
            <strong className="text-slate-900 flex items-center gap-1.5 text-sm">
              <Mail className="w-4 h-4 text-slate-400" />
              {profile?.email || 'officer@demo.gov.in'}
            </strong>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-500 block">Official Contact Mobile:</span>
            <strong className="text-slate-900 flex items-center gap-1.5 text-sm">
              <Phone className="w-4 h-4 text-slate-400" />
              {profile?.mobile || '+91 98765 43210'}
            </strong>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-500 block">Authorized Tehsil & District:</span>
            <strong className="text-slate-900 text-sm">
              {profile?.tehsil || 'Fatehabad'} Tehsil, {profile?.district || 'Agra'} District
            </strong>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-500 block">Official Employee ID:</span>
            <strong className="text-slate-900 font-mono text-sm">
              {profile?.employeeId || 'UP-REV-2018-4921'}
            </strong>
          </div>

          <div className="sm:col-span-2 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-slate-500 block font-bold">Assigned Villages in Jurisdiction:</span>
            <div className="flex flex-wrap gap-2">
              {(profile?.assignedVillages || ['Nagla', 'Kasan', 'Kharabwadi', 'Vesu']).map((v) => (
                <span key={v} className="bg-white border border-slate-300 text-slate-900 font-bold px-3 py-1 rounded-lg text-xs">
                  📍 {v} Village (Fatehabad)
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RevenueOfficerProfile = () => (
  <ErrorBoundary fallbackTitle="Unable to load Profile">
    <RevenueOfficerProfileContent />
  </ErrorBoundary>
);
