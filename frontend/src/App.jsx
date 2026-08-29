import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandDataProvider } from './context/LandDataContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { ROLES } from './utils/constants';

// Layout & Global Components
import { Navbar } from './components/navbar/Navbar';
import { Sidebar } from './components/navbar/Sidebar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/Toast';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AIAssistantModal } from './components/dashboard/AIAssistantModal';
import { AIDocumentOCRModal } from './components/dashboard/AIDocumentOCRModal';
import { ContextAwareAIAssistant } from './components/ai/ContextAwareAIAssistant';

// Auth & Registration Pages
import { RoleProtectedRoute } from './components/auth/RoleProtectedRoute';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterRoleSelectionPage } from './pages/auth/RegisterRoleSelectionPage';
import { CitizenRegistrationPage } from './pages/auth/CitizenRegistrationPage';
import { OfficerRegistrationPage } from './pages/auth/OfficerRegistrationPage';
import { AgencyRegistrationPage } from './pages/auth/AgencyRegistrationPage';
import { AuthorityRegistrationPage } from './pages/auth/AuthorityRegistrationPage';
import { RegistrationStatusPage } from './pages/auth/RegistrationStatusPage';

// National Portals & AI
import { AIInsightsPage } from './pages/central/AIInsightsPage';
import { RehabilitationResettlementPage } from './pages/central/RehabilitationResettlementPage';

// System Administrator Dedicated Suite
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminRolesPermissionsPage } from './pages/admin/AdminRolesPermissionsPage';
import { AdminProjectsDepartmentsPage } from './pages/admin/AdminProjectsDepartmentsPage';
import { AdminSystemMonitoringPage } from './pages/admin/AdminSystemMonitoringPage';
import { AdminNotificationsPage } from './pages/admin/AdminNotificationsPage';
import { AdminSystemSettingsPage } from './pages/admin/AdminSystemSettingsPage';

// Project Implementing Agency (PIA) Dedicated Suite
import { AgencyDashboardPage } from './pages/agency/AgencyDashboardPage';
import { AgencyProjectsPage } from './pages/agency/AgencyProjectsPage';
import { AgencyProgressPage } from './pages/agency/AgencyProgressPage';
import { AgencyMapPage } from './pages/agency/AgencyMapPage';
import { AgencyAcquisitionPage } from './pages/agency/AgencyAcquisitionPage';
import { AgencyCompensationRnRPage } from './pages/agency/AgencyCompensationRnRPage';
import { AgencyIssuesPage } from './pages/agency/AgencyIssuesPage';
import { AgencyDocumentsPage } from './pages/agency/AgencyDocumentsPage';
import { AgencyReportsPage } from './pages/agency/AgencyReportsPage';

// Revenue Officer Dedicated Suite
import { RevenueOfficerDashboard } from './pages/revenue-officer/RevenueOfficerDashboard';
import { RevenueOfficerCases } from './pages/revenue-officer/RevenueOfficerCases';
import { RevenueOfficerCaseDetails } from './pages/revenue-officer/RevenueOfficerCaseDetails';
import { RevenueOfficerVerification } from './pages/revenue-officer/RevenueOfficerVerification';
import { RevenueOfficerFieldVerification } from './pages/revenue-officer/RevenueOfficerFieldVerification';
import { RevenueOfficerMap } from './pages/revenue-officer/RevenueOfficerMap';
import { RevenueOfficerDocuments } from './pages/revenue-officer/RevenueOfficerDocuments';
import { RevenueOfficerObjections } from './pages/revenue-officer/RevenueOfficerObjections';
import { RevenueOfficerReports } from './pages/revenue-officer/RevenueOfficerReports';
import { RevenueOfficerNotifications } from './pages/revenue-officer/RevenueOfficerNotifications';
import { RevenueOfficerProfile } from './pages/revenue-officer/RevenueOfficerProfile';

// Common District Administration Suite
import { DistrictDashboard } from './pages/district/DistrictDashboard';
import { DistrictProjectsPage } from './pages/district/DistrictProjectsPage';
import { DistrictAcquisitionPage } from './pages/district/DistrictAcquisitionPage';
import { DistrictMapPage } from './pages/district/DistrictMapPage';
import { DistrictLandPage } from './pages/district/DistrictLandPage';
import { DistrictDisputesPage } from './pages/district/DistrictDisputesPage';
import { DistrictCompensationPage } from './pages/district/DistrictCompensationPage';
import { DistrictRnRPage } from './pages/district/DistrictRnRPage';
import { DistrictOfficersPage } from './pages/district/DistrictOfficersPage';
import { DistrictCoordinationPage } from './pages/district/DistrictCoordinationPage';
import { DistrictEscalationsPage } from './pages/district/DistrictEscalationsPage';
import { DistrictDelayedCasesPage } from './pages/district/DistrictDelayedCasesPage';
import { DistrictReportsPage } from './pages/district/DistrictReportsPage';
import { DistrictDocumentsPage } from './pages/district/DistrictDocumentsPage';
import { DistrictNotificationsPage } from './pages/district/DistrictNotificationsPage';
import { DistrictProfilePage } from './pages/district/DistrictProfilePage';

// State Government Dedicated Suite
import { StateOfficerDashboard } from './pages/state/StateOfficerDashboard';
import { StateProjectsPage } from './pages/state/StateProjectsPage';
import { StateDistrictsPage } from './pages/state/StateDistrictsPage';
import { StateMapPage } from './pages/state/StateMapPage';
import { StateAcquisitionPage } from './pages/state/StateAcquisitionPage';
import { StateCompensationRnRPage } from './pages/state/StateCompensationRnRPage';
import { StateDisputesPage } from './pages/state/StateDisputesPage';
import { StateEscalationsPage } from './pages/state/StateEscalationsPage';
import { StateReportsPage } from './pages/state/StateReportsPage';

// Central Ministry / PM Gati Shakti Suite
import { NationalMonitoringDashboard } from './pages/central/NationalMonitoringDashboard';
import { CentralProjectsPage } from './pages/central/CentralProjectsPage';
import { CentralStatesPage } from './pages/central/CentralStatesPage';
import { CentralMapPage } from './pages/central/CentralMapPage';
import { CentralAcquisitionPage } from './pages/central/CentralAcquisitionPage';
import { CentralCompensationRnRPage } from './pages/central/CentralCompensationRnRPage';
import { CentralDisputesPage } from './pages/central/CentralDisputesPage';
import { CentralEscalationsPage } from './pages/central/CentralEscalationsPage';
import { CentralReportsPage } from './pages/central/CentralReportsPage';

// Projects & GIS
import { ProjectsListPage } from './pages/agency/ProjectsListPage';
import { GISMapPage } from './pages/agency/GISMapPage';
import { AffectedSelectionPage } from './pages/agency/AffectedSelectionPage';
import { NoticeManagementPage } from './pages/agency/NoticeManagementPage';
import { ObjectionReviewPage } from './pages/district/ObjectionReviewPage';
import { FinalAcquisitionPage } from './pages/agency/FinalAcquisitionPage';

// Revenue & GIS Verification
import { BhulekhSearchPage } from './pages/officer/BhulekhSearchPage';
import { LandVerificationPage } from './pages/officer/LandVerificationPage';
import { MismatchHubPage } from './pages/officer/MismatchHubPage';
import { BoundaryVerificationPage } from './pages/officer/BoundaryVerificationPage';
import { ApprovalsQueuePage } from './pages/district/ApprovalsQueuePage';

// Citizen Pages
import { CitizenDashboard } from './pages/citizen/CitizenDashboard';
import { CitizenLandPage } from './pages/citizen/CitizenLandPage';
import { CitizenNoticesPage } from './pages/citizen/CitizenNoticesPage';
import { CitizenObjectionPage } from './pages/citizen/CitizenObjectionPage';
import { CitizenPaymentPage } from './pages/citizen/CitizenPaymentPage';
import { CitizenRRBenefitsPage } from './pages/citizen/CitizenRRBenefitsPage';

// Tehsildar Pages
import { TehsildarDashboard } from './pages/tehsildar/TehsildarDashboard';
import { TehsildarCasesPage } from './pages/tehsildar/TehsildarCasesPage';
import { TehsildarMapPage } from './pages/tehsildar/TehsildarMapPage';
import { TehsildarVerificationPage } from './pages/tehsildar/TehsildarVerificationPage';
import { TehsildarObjectionsPage } from './pages/tehsildar/TehsildarObjectionsPage';
import { TehsildarCompensationPage } from './pages/tehsildar/TehsildarCompensationPage';
import { TehsildarRnRPage } from './pages/tehsildar/TehsildarRnRPage';
import { TehsildarDocumentsPage } from './pages/tehsildar/TehsildarDocumentsPage';
import { TehsildarReportsPage } from './pages/tehsildar/TehsildarReportsPage';
import { TehsildarNotificationsPage } from './pages/tehsildar/TehsildarNotificationsPage';

// Common Tools & AI
import { ReportsAnalyticsPage } from './pages/common/ReportsAnalyticsPage';
import { AIAssistantPage } from './pages/common/AIAssistantPage';
import { DocumentAnalyzerPage } from './pages/common/DocumentAnalyzerPage';
import { SettingsPage } from './pages/common/SettingsPage';
import { NotFoundPage } from './pages/common/NotFoundPage';

// Role-based root dashboard dispatcher
const DynamicRoleDashboard = ({ onOpenAI, onOpenOCR }) => {
  const { currentRole, currentUser } = useAuth();
  const rawRole = (currentRole || currentUser?.role || 'CITIZEN').toString().toUpperCase().replace(/^ROLE_/, '');

  switch (rawRole) {
    case 'CITIZEN':
    case 'LAND_OWNER':
    case ROLES.CITIZEN:
      return <CitizenDashboard />;
    case 'TEHSILDAR':
    case ROLES.TEHSILDAR:
      return <TehsildarDashboard />;
    case 'EXECUTIVE_OFFICER':
    case 'PROJECT_AGENCY':
    case 'PROJECT_IMPLEMENTING_AGENCY':
    case 'ACQUISITION_OFFICER':
    case 'AGENCY':
    case ROLES.EXECUTIVE_OFFICER:
    case ROLES.PROJECT_AGENCY:
      return <AgencyDashboardPage />;
    case 'GOVERNMENT_OFFICER':
    case 'REVENUE_OFFICER':
    case 'FIELD_OFFICER':
    case 'CALA':
    case ROLES.GOVERNMENT_OFFICER:
    case ROLES.REVENUE_OFFICER:
      return <RevenueOfficerDashboard />;
    case 'DISTRICT_AUTHORITY':
    case 'DISTRICT_MAGISTRATE':
    case 'DISTRICT_OFFICER':
    case 'DISTRICT':
    case ROLES.DISTRICT_AUTHORITY:
    case ROLES.DISTRICT_MAGISTRATE:
      return <DistrictDashboard />;
    case 'STATE_GOVERNMENT':
    case 'STATE_OFFICER':
    case 'STATE':
    case ROLES.STATE_GOVERNMENT:
      return <StateOfficerDashboard />;
    case 'CENTRAL_MINISTRY':
    case 'CENTRAL_OFFICER':
    case 'CENTRAL':
    case ROLES.CENTRAL_MINISTRY:
      return <NationalMonitoringDashboard />;
    case 'ADMIN':
    case 'SYSTEM_ADMIN':
    case 'SYSTEM_ADMINISTRATOR':
    case ROLES.ADMIN:
      return <AdminDashboardPage />;
    default:
      return <CitizenDashboard />;
  }
};

// Main App Layout Shell with Permanent Sticky Header & Scrollable Body
const AppLayout = () => {
  const auth = useAuth() || {};
  const { isAuthenticated, currentUser } = auth;
  const [showAIModal, setShowAIModal] = useState(false);
  const [showOCRModal, setShowOCRModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isAuthenticated && !currentUser?.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-100 text-slate-800 font-sans selection:bg-gov-blue-100 selection:text-gov-blue-900 overflow-hidden">
      {/* 1. Permanent Sticky Top Navbar */}
      <ErrorBoundary fallbackTitle="Top Header Navigation Loading">
        <Navbar
          onOpenAI={() => setShowAIModal(true)}
          mobileMenuOpen={mobileMenuOpen}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
      </ErrorBoundary>

      {/* 2. Main Workspace (Sidebar + Scrollable Viewport) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <ErrorBoundary fallbackTitle="Sidebar Menu Loading">
          <Sidebar
            mobileOpen={mobileMenuOpen}
            onCloseMobile={() => setMobileMenuOpen(false)}
          />
        </ErrorBoundary>

        {/* Scrollable Main Content & Footer */}
        <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden">
          <main className="flex-1 p-3 sm:p-6 lg:p-8 space-y-6 pb-28 md:pb-16">
            <ErrorBoundary fallbackTitle="Portal Workspace Loading Error">
              <Routes>
              {/* Dynamic Role-Based Landing Dashboard */}
              <Route
                path="/"
                element={
                  <DynamicRoleDashboard
                    onOpenAI={() => setShowAIModal(true)}
                    onOpenOCR={() => setShowOCRModal(true)}
                  />
                }
              />

              {/* Dedicated Revenue Officer Portal Routes */}
              <Route path="/revenue-officer/dashboard" element={<RoleProtectedRoute allowedRoles={[ROLES.GOVERNMENT_OFFICER, ROLES.REVENUE_OFFICER, 'REVENUE_OFFICER', 'GOVERNMENT_OFFICER']}><RevenueOfficerDashboard /></RoleProtectedRoute>} />
              <Route path="/revenue/dashboard" element={<RoleProtectedRoute allowedRoles={[ROLES.GOVERNMENT_OFFICER, ROLES.REVENUE_OFFICER, 'REVENUE_OFFICER', 'GOVERNMENT_OFFICER']}><RevenueOfficerDashboard /></RoleProtectedRoute>} />
              <Route path="/revenue-officer/cases" element={<RoleProtectedRoute allowedRoles={[ROLES.GOVERNMENT_OFFICER, ROLES.REVENUE_OFFICER, 'REVENUE_OFFICER', 'GOVERNMENT_OFFICER']}><RevenueOfficerCases /></RoleProtectedRoute>} />
              <Route path="/revenue-officer/cases/:caseId" element={<RoleProtectedRoute allowedRoles={[ROLES.GOVERNMENT_OFFICER, ROLES.REVENUE_OFFICER, 'REVENUE_OFFICER', 'GOVERNMENT_OFFICER']}><RevenueOfficerCaseDetails /></RoleProtectedRoute>} />
              <Route path="/revenue-officer/verification" element={<RoleProtectedRoute allowedRoles={[ROLES.GOVERNMENT_OFFICER, ROLES.REVENUE_OFFICER, 'REVENUE_OFFICER', 'GOVERNMENT_OFFICER']}><RevenueOfficerVerification /></RoleProtectedRoute>} />
              <Route path="/revenue-officer/verification/:caseId" element={<RoleProtectedRoute allowedRoles={[ROLES.GOVERNMENT_OFFICER, ROLES.REVENUE_OFFICER, 'REVENUE_OFFICER', 'GOVERNMENT_OFFICER']}><RevenueOfficerCaseDetails /></RoleProtectedRoute>} />
              <Route path="/revenue-officer/field-verification" element={<RoleProtectedRoute allowedRoles={[ROLES.GOVERNMENT_OFFICER, ROLES.REVENUE_OFFICER, 'REVENUE_OFFICER', 'GOVERNMENT_OFFICER']}><RevenueOfficerFieldVerification /></RoleProtectedRoute>} />
              <Route path="/revenue-officer/map" element={<RoleProtectedRoute allowedRoles={[ROLES.GOVERNMENT_OFFICER, ROLES.REVENUE_OFFICER, 'REVENUE_OFFICER', 'GOVERNMENT_OFFICER']}><RevenueOfficerMap /></RoleProtectedRoute>} />
              <Route path="/revenue-officer/documents" element={<RoleProtectedRoute allowedRoles={[ROLES.GOVERNMENT_OFFICER, ROLES.REVENUE_OFFICER, 'REVENUE_OFFICER', 'GOVERNMENT_OFFICER']}><RevenueOfficerDocuments /></RoleProtectedRoute>} />
              <Route path="/revenue-officer/objections" element={<RoleProtectedRoute allowedRoles={[ROLES.GOVERNMENT_OFFICER, ROLES.REVENUE_OFFICER, 'REVENUE_OFFICER', 'GOVERNMENT_OFFICER']}><RevenueOfficerObjections /></RoleProtectedRoute>} />
              <Route path="/revenue-officer/reports" element={<RoleProtectedRoute allowedRoles={[ROLES.GOVERNMENT_OFFICER, ROLES.REVENUE_OFFICER, 'REVENUE_OFFICER', 'GOVERNMENT_OFFICER']}><RevenueOfficerReports /></RoleProtectedRoute>} />
              <Route path="/revenue-officer/notifications" element={<RoleProtectedRoute allowedRoles={[ROLES.GOVERNMENT_OFFICER, ROLES.REVENUE_OFFICER, 'REVENUE_OFFICER', 'GOVERNMENT_OFFICER']}><RevenueOfficerNotifications /></RoleProtectedRoute>} />
              <Route path="/revenue-officer/profile" element={<RoleProtectedRoute allowedRoles={[ROLES.GOVERNMENT_OFFICER, ROLES.REVENUE_OFFICER, 'REVENUE_OFFICER', 'GOVERNMENT_OFFICER']}><RevenueOfficerProfile /></RoleProtectedRoute>} />

              {/* Dedicated Tehsildar Revenue Section Routes */}
              <Route path="/tehsildar/dashboard" element={<RoleProtectedRoute allowedRoles={[ROLES.TEHSILDAR]}><TehsildarDashboard /></RoleProtectedRoute>} />
              <Route path="/tehsildar/cases" element={<RoleProtectedRoute allowedRoles={[ROLES.TEHSILDAR]}><TehsildarCasesPage /></RoleProtectedRoute>} />
              <Route path="/tehsildar/cases/:caseId" element={<RoleProtectedRoute allowedRoles={[ROLES.TEHSILDAR]}><TehsildarCasesPage /></RoleProtectedRoute>} />
              <Route path="/tehsildar/map" element={<RoleProtectedRoute allowedRoles={[ROLES.TEHSILDAR]}><TehsildarMapPage /></RoleProtectedRoute>} />
              <Route path="/tehsildar/verification" element={<RoleProtectedRoute allowedRoles={[ROLES.TEHSILDAR]}><TehsildarVerificationPage /></RoleProtectedRoute>} />
              <Route path="/tehsildar/objections" element={<RoleProtectedRoute allowedRoles={[ROLES.TEHSILDAR]}><TehsildarObjectionsPage /></RoleProtectedRoute>} />
              <Route path="/tehsildar/compensation" element={<RoleProtectedRoute allowedRoles={[ROLES.TEHSILDAR]}><TehsildarCompensationPage /></RoleProtectedRoute>} />
              <Route path="/tehsildar/r-and-r" element={<RoleProtectedRoute allowedRoles={[ROLES.TEHSILDAR]}><TehsildarRnRPage /></RoleProtectedRoute>} />
              <Route path="/tehsildar/documents" element={<RoleProtectedRoute allowedRoles={[ROLES.TEHSILDAR]}><TehsildarDocumentsPage /></RoleProtectedRoute>} />
              <Route path="/tehsildar/reports" element={<RoleProtectedRoute allowedRoles={[ROLES.TEHSILDAR]}><TehsildarReportsPage /></RoleProtectedRoute>} />
              <Route path="/tehsildar/notifications" element={<RoleProtectedRoute allowedRoles={[ROLES.TEHSILDAR]}><TehsildarNotificationsPage /></RoleProtectedRoute>} />
              <Route path="/tehsildar/profile" element={<RoleProtectedRoute allowedRoles={[ROLES.TEHSILDAR]}><SettingsPage /></RoleProtectedRoute>} />

              {/* Project Implementing Agency (PIA) Dedicated Suite */}
              <Route path="/project-agency/dashboard" element={<RoleProtectedRoute allowedRoles={[ROLES.EXECUTIVE_OFFICER, ROLES.PROJECT_AGENCY, 'EXECUTIVE_OFFICER', 'PROJECT_AGENCY', 'ACQUISITION_OFFICER', ROLES.ADMIN]}><AgencyDashboardPage /></RoleProtectedRoute>} />
              <Route path="/project-agency/projects" element={<RoleProtectedRoute allowedRoles={[ROLES.EXECUTIVE_OFFICER, ROLES.PROJECT_AGENCY, 'EXECUTIVE_OFFICER', 'PROJECT_AGENCY', 'ACQUISITION_OFFICER', ROLES.ADMIN]}><AgencyProjectsPage /></RoleProtectedRoute>} />
              <Route path="/project-agency/projects/:projectId" element={<RoleProtectedRoute allowedRoles={[ROLES.EXECUTIVE_OFFICER, ROLES.PROJECT_AGENCY, 'EXECUTIVE_OFFICER', 'PROJECT_AGENCY', 'ACQUISITION_OFFICER', ROLES.ADMIN]}><AgencyProjectsPage /></RoleProtectedRoute>} />
              <Route path="/project-agency/progress" element={<RoleProtectedRoute allowedRoles={[ROLES.EXECUTIVE_OFFICER, ROLES.PROJECT_AGENCY, 'EXECUTIVE_OFFICER', 'PROJECT_AGENCY', 'ACQUISITION_OFFICER', ROLES.ADMIN]}><AgencyProgressPage /></RoleProtectedRoute>} />
              <Route path="/project-agency/map" element={<RoleProtectedRoute allowedRoles={[ROLES.EXECUTIVE_OFFICER, ROLES.PROJECT_AGENCY, 'EXECUTIVE_OFFICER', 'PROJECT_AGENCY', 'ACQUISITION_OFFICER', ROLES.ADMIN]}><AgencyMapPage /></RoleProtectedRoute>} />
              <Route path="/project-agency/acquisition" element={<RoleProtectedRoute allowedRoles={[ROLES.EXECUTIVE_OFFICER, ROLES.PROJECT_AGENCY, 'EXECUTIVE_OFFICER', 'PROJECT_AGENCY', 'ACQUISITION_OFFICER', ROLES.ADMIN]}><AgencyAcquisitionPage /></RoleProtectedRoute>} />
              <Route path="/project-agency/compensation-rnr" element={<RoleProtectedRoute allowedRoles={[ROLES.EXECUTIVE_OFFICER, ROLES.PROJECT_AGENCY, 'EXECUTIVE_OFFICER', 'PROJECT_AGENCY', 'ACQUISITION_OFFICER', ROLES.ADMIN]}><AgencyCompensationRnRPage /></RoleProtectedRoute>} />
              <Route path="/project-agency/compensation" element={<RoleProtectedRoute allowedRoles={[ROLES.EXECUTIVE_OFFICER, ROLES.PROJECT_AGENCY, 'EXECUTIVE_OFFICER', 'PROJECT_AGENCY', 'ACQUISITION_OFFICER', ROLES.ADMIN]}><AgencyCompensationRnRPage /></RoleProtectedRoute>} />
              <Route path="/project-agency/issues" element={<RoleProtectedRoute allowedRoles={[ROLES.EXECUTIVE_OFFICER, ROLES.PROJECT_AGENCY, 'EXECUTIVE_OFFICER', 'PROJECT_AGENCY', 'ACQUISITION_OFFICER', ROLES.ADMIN]}><AgencyIssuesPage /></RoleProtectedRoute>} />
              <Route path="/project-agency/disputes" element={<RoleProtectedRoute allowedRoles={[ROLES.EXECUTIVE_OFFICER, ROLES.PROJECT_AGENCY, 'EXECUTIVE_OFFICER', 'PROJECT_AGENCY', 'ACQUISITION_OFFICER', ROLES.ADMIN]}><AgencyIssuesPage /></RoleProtectedRoute>} />
              <Route path="/project-agency/documents" element={<RoleProtectedRoute allowedRoles={[ROLES.EXECUTIVE_OFFICER, ROLES.PROJECT_AGENCY, 'EXECUTIVE_OFFICER', 'PROJECT_AGENCY', 'ACQUISITION_OFFICER', ROLES.ADMIN]}><AgencyDocumentsPage /></RoleProtectedRoute>} />
              <Route path="/project-agency/reports" element={<RoleProtectedRoute allowedRoles={[ROLES.EXECUTIVE_OFFICER, ROLES.PROJECT_AGENCY, 'EXECUTIVE_OFFICER', 'PROJECT_AGENCY', 'ACQUISITION_OFFICER', ROLES.ADMIN]}><AgencyReportsPage /></RoleProtectedRoute>} />

              {/* Legacy and Shorthand /agency/** & /executive/** Aliases */}
              <Route path="/agency/dashboard" element={<RoleProtectedRoute allowedRoles={[ROLES.EXECUTIVE_OFFICER, ROLES.PROJECT_AGENCY, 'EXECUTIVE_OFFICER', 'PROJECT_AGENCY', 'ACQUISITION_OFFICER', ROLES.ADMIN]}><AgencyDashboardPage /></RoleProtectedRoute>} />
              <Route path="/executive/dashboard" element={<RoleProtectedRoute allowedRoles={[ROLES.EXECUTIVE_OFFICER, ROLES.PROJECT_AGENCY, 'EXECUTIVE_OFFICER', 'PROJECT_AGENCY', 'ACQUISITION_OFFICER', ROLES.ADMIN]}><AgencyDashboardPage /></RoleProtectedRoute>} />
              <Route path="/executive-dashboard" element={<RoleProtectedRoute allowedRoles={[ROLES.EXECUTIVE_OFFICER, ROLES.PROJECT_AGENCY, 'EXECUTIVE_OFFICER', 'PROJECT_AGENCY', 'ACQUISITION_OFFICER', ROLES.ADMIN]}><AgencyDashboardPage /></RoleProtectedRoute>} />
              <Route path="/agency/projects" element={<RoleProtectedRoute allowedRoles={[ROLES.EXECUTIVE_OFFICER, ROLES.PROJECT_AGENCY, 'EXECUTIVE_OFFICER', 'PROJECT_AGENCY', 'ACQUISITION_OFFICER', ROLES.ADMIN]}><AgencyProjectsPage /></RoleProtectedRoute>} />
              <Route path="/executive/projects" element={<RoleProtectedRoute allowedRoles={[ROLES.EXECUTIVE_OFFICER, ROLES.PROJECT_AGENCY, 'EXECUTIVE_OFFICER', 'PROJECT_AGENCY', 'ACQUISITION_OFFICER', ROLES.ADMIN]}><AgencyProjectsPage /></RoleProtectedRoute>} />
              <Route path="/agency/progress" element={<RoleProtectedRoute allowedRoles={[ROLES.EXECUTIVE_OFFICER, ROLES.PROJECT_AGENCY, 'EXECUTIVE_OFFICER', 'PROJECT_AGENCY', 'ACQUISITION_OFFICER', ROLES.ADMIN]}><AgencyProgressPage /></RoleProtectedRoute>} />
              <Route path="/agency/map" element={<RoleProtectedRoute allowedRoles={[ROLES.EXECUTIVE_OFFICER, ROLES.PROJECT_AGENCY, 'EXECUTIVE_OFFICER', 'PROJECT_AGENCY', 'ACQUISITION_OFFICER', ROLES.ADMIN]}><AgencyMapPage /></RoleProtectedRoute>} />
              <Route path="/executive/map" element={<RoleProtectedRoute allowedRoles={[ROLES.EXECUTIVE_OFFICER, ROLES.PROJECT_AGENCY, 'EXECUTIVE_OFFICER', 'PROJECT_AGENCY', 'ACQUISITION_OFFICER', ROLES.ADMIN]}><AgencyMapPage /></RoleProtectedRoute>} />
              <Route path="/agency/acquisition" element={<RoleProtectedRoute allowedRoles={[ROLES.EXECUTIVE_OFFICER, ROLES.PROJECT_AGENCY, 'EXECUTIVE_OFFICER', 'PROJECT_AGENCY', 'ACQUISITION_OFFICER', ROLES.ADMIN]}><AgencyAcquisitionPage /></RoleProtectedRoute>} />
              <Route path="/executive/acquisition" element={<RoleProtectedRoute allowedRoles={[ROLES.EXECUTIVE_OFFICER, ROLES.PROJECT_AGENCY, 'EXECUTIVE_OFFICER', 'PROJECT_AGENCY', 'ACQUISITION_OFFICER', ROLES.ADMIN]}><AgencyAcquisitionPage /></RoleProtectedRoute>} />
              <Route path="/agency/compensation-rnr" element={<RoleProtectedRoute allowedRoles={[ROLES.EXECUTIVE_OFFICER, ROLES.PROJECT_AGENCY, 'EXECUTIVE_OFFICER', 'PROJECT_AGENCY', 'ACQUISITION_OFFICER', ROLES.ADMIN]}><AgencyCompensationRnRPage /></RoleProtectedRoute>} />
              <Route path="/agency/compensation" element={<RoleProtectedRoute allowedRoles={[ROLES.EXECUTIVE_OFFICER, ROLES.PROJECT_AGENCY, 'EXECUTIVE_OFFICER', 'PROJECT_AGENCY', 'ACQUISITION_OFFICER', ROLES.ADMIN]}><AgencyCompensationRnRPage /></RoleProtectedRoute>} />
              <Route path="/executive/compensation" element={<RoleProtectedRoute allowedRoles={[ROLES.EXECUTIVE_OFFICER, ROLES.PROJECT_AGENCY, 'EXECUTIVE_OFFICER', 'PROJECT_AGENCY', 'ACQUISITION_OFFICER', ROLES.ADMIN]}><AgencyCompensationRnRPage /></RoleProtectedRoute>} />
              <Route path="/executive/r-and-r" element={<RoleProtectedRoute allowedRoles={[ROLES.EXECUTIVE_OFFICER, ROLES.PROJECT_AGENCY, 'EXECUTIVE_OFFICER', 'PROJECT_AGENCY', 'ACQUISITION_OFFICER', ROLES.ADMIN]}><AgencyCompensationRnRPage /></RoleProtectedRoute>} />
              <Route path="/agency/issues" element={<RoleProtectedRoute allowedRoles={[ROLES.EXECUTIVE_OFFICER, ROLES.PROJECT_AGENCY, 'EXECUTIVE_OFFICER', 'PROJECT_AGENCY', 'ACQUISITION_OFFICER', ROLES.ADMIN]}><AgencyIssuesPage /></RoleProtectedRoute>} />
              <Route path="/agency/disputes" element={<RoleProtectedRoute allowedRoles={[ROLES.EXECUTIVE_OFFICER, ROLES.PROJECT_AGENCY, 'EXECUTIVE_OFFICER', 'PROJECT_AGENCY', 'ACQUISITION_OFFICER', ROLES.ADMIN]}><AgencyIssuesPage /></RoleProtectedRoute>} />
              <Route path="/executive/escalations" element={<RoleProtectedRoute allowedRoles={[ROLES.EXECUTIVE_OFFICER, ROLES.PROJECT_AGENCY, 'EXECUTIVE_OFFICER', 'PROJECT_AGENCY', 'ACQUISITION_OFFICER', ROLES.ADMIN]}><AgencyIssuesPage /></RoleProtectedRoute>} />
              <Route path="/agency/documents" element={<RoleProtectedRoute allowedRoles={[ROLES.EXECUTIVE_OFFICER, ROLES.PROJECT_AGENCY, 'EXECUTIVE_OFFICER', 'PROJECT_AGENCY', 'ACQUISITION_OFFICER', ROLES.ADMIN]}><AgencyDocumentsPage /></RoleProtectedRoute>} />
              <Route path="/executive/documents" element={<RoleProtectedRoute allowedRoles={[ROLES.EXECUTIVE_OFFICER, ROLES.PROJECT_AGENCY, 'EXECUTIVE_OFFICER', 'PROJECT_AGENCY', 'ACQUISITION_OFFICER', ROLES.ADMIN]}><AgencyDocumentsPage /></RoleProtectedRoute>} />
              <Route path="/agency/reports" element={<RoleProtectedRoute allowedRoles={[ROLES.EXECUTIVE_OFFICER, ROLES.PROJECT_AGENCY, 'EXECUTIVE_OFFICER', 'PROJECT_AGENCY', 'ACQUISITION_OFFICER', ROLES.ADMIN]}><AgencyReportsPage /></RoleProtectedRoute>} />
              <Route path="/executive/reports" element={<RoleProtectedRoute allowedRoles={[ROLES.EXECUTIVE_OFFICER, ROLES.PROJECT_AGENCY, 'EXECUTIVE_OFFICER', 'PROJECT_AGENCY', 'ACQUISITION_OFFICER', ROLES.ADMIN]}><AgencyReportsPage /></RoleProtectedRoute>} />

              {/* Common District Administration Suite (Single Dashboard & Pages with RBAC) */}
              <Route path="/district/dashboard" element={<RoleProtectedRoute allowedRoles={[ROLES.DISTRICT_AUTHORITY, ROLES.DISTRICT_MAGISTRATE, 'DISTRICT_AUTHORITY', 'DISTRICT_MAGISTRATE', 'DISTRICT_OFFICER', ROLES.ADMIN]}><DistrictDashboard /></RoleProtectedRoute>} />
              <Route path="/district/projects" element={<RoleProtectedRoute allowedRoles={[ROLES.DISTRICT_AUTHORITY, ROLES.DISTRICT_MAGISTRATE, 'DISTRICT_AUTHORITY', 'DISTRICT_MAGISTRATE', 'DISTRICT_OFFICER', ROLES.ADMIN]}><DistrictProjectsPage /></RoleProtectedRoute>} />
              <Route path="/district/acquisition" element={<RoleProtectedRoute allowedRoles={[ROLES.DISTRICT_AUTHORITY, ROLES.DISTRICT_MAGISTRATE, 'DISTRICT_AUTHORITY', 'DISTRICT_MAGISTRATE', 'DISTRICT_OFFICER', ROLES.ADMIN]}><DistrictAcquisitionPage /></RoleProtectedRoute>} />
              <Route path="/district/map" element={<RoleProtectedRoute allowedRoles={[ROLES.DISTRICT_AUTHORITY, ROLES.DISTRICT_MAGISTRATE, 'DISTRICT_AUTHORITY', 'DISTRICT_MAGISTRATE', 'DISTRICT_OFFICER', ROLES.ADMIN]}><DistrictMapPage /></RoleProtectedRoute>} />
              <Route path="/district/land" element={<RoleProtectedRoute allowedRoles={[ROLES.DISTRICT_AUTHORITY, ROLES.DISTRICT_MAGISTRATE, 'DISTRICT_AUTHORITY', 'DISTRICT_MAGISTRATE', 'DISTRICT_OFFICER', ROLES.ADMIN]}><DistrictLandPage /></RoleProtectedRoute>} />
              <Route path="/district/disputes" element={<RoleProtectedRoute allowedRoles={[ROLES.DISTRICT_AUTHORITY, ROLES.DISTRICT_MAGISTRATE, 'DISTRICT_AUTHORITY', 'DISTRICT_MAGISTRATE', 'DISTRICT_OFFICER', ROLES.ADMIN]}><DistrictDisputesPage /></RoleProtectedRoute>} />
              <Route path="/district/compensation" element={<RoleProtectedRoute allowedRoles={[ROLES.DISTRICT_AUTHORITY, ROLES.DISTRICT_MAGISTRATE, 'DISTRICT_AUTHORITY', 'DISTRICT_MAGISTRATE', 'DISTRICT_OFFICER', ROLES.ADMIN]}><DistrictCompensationPage /></RoleProtectedRoute>} />
              <Route path="/district/r-and-r" element={<RoleProtectedRoute allowedRoles={[ROLES.DISTRICT_AUTHORITY, ROLES.DISTRICT_MAGISTRATE, 'DISTRICT_AUTHORITY', 'DISTRICT_MAGISTRATE', 'DISTRICT_OFFICER', ROLES.ADMIN]}><DistrictRnRPage /></RoleProtectedRoute>} />
              <Route path="/district/officers" element={<RoleProtectedRoute allowedRoles={[ROLES.DISTRICT_AUTHORITY, ROLES.DISTRICT_MAGISTRATE, 'DISTRICT_AUTHORITY', 'DISTRICT_MAGISTRATE', 'DISTRICT_OFFICER', ROLES.ADMIN]}><DistrictOfficersPage /></RoleProtectedRoute>} />
              <Route path="/district/coordination" element={<RoleProtectedRoute allowedRoles={[ROLES.DISTRICT_AUTHORITY, ROLES.DISTRICT_MAGISTRATE, 'DISTRICT_AUTHORITY', 'DISTRICT_MAGISTRATE', 'DISTRICT_OFFICER', ROLES.ADMIN]}><DistrictCoordinationPage /></RoleProtectedRoute>} />
              <Route path="/district/escalations" element={<RoleProtectedRoute allowedRoles={[ROLES.DISTRICT_AUTHORITY, ROLES.DISTRICT_MAGISTRATE, 'DISTRICT_AUTHORITY', 'DISTRICT_MAGISTRATE', 'DISTRICT_OFFICER', ROLES.ADMIN]}><DistrictEscalationsPage /></RoleProtectedRoute>} />
              <Route path="/district/delayed-cases" element={<RoleProtectedRoute allowedRoles={[ROLES.DISTRICT_AUTHORITY, ROLES.DISTRICT_MAGISTRATE, 'DISTRICT_AUTHORITY', 'DISTRICT_MAGISTRATE', 'DISTRICT_OFFICER', ROLES.ADMIN]}><DistrictDelayedCasesPage /></RoleProtectedRoute>} />
              <Route path="/district/reports" element={<RoleProtectedRoute allowedRoles={[ROLES.DISTRICT_AUTHORITY, ROLES.DISTRICT_MAGISTRATE, 'DISTRICT_AUTHORITY', 'DISTRICT_MAGISTRATE', 'DISTRICT_OFFICER', ROLES.ADMIN]}><DistrictReportsPage /></RoleProtectedRoute>} />
              <Route path="/district/documents" element={<RoleProtectedRoute allowedRoles={[ROLES.DISTRICT_AUTHORITY, ROLES.DISTRICT_MAGISTRATE, 'DISTRICT_AUTHORITY', 'DISTRICT_MAGISTRATE', 'DISTRICT_OFFICER', ROLES.ADMIN]}><DistrictDocumentsPage /></RoleProtectedRoute>} />
              <Route path="/district/notifications" element={<RoleProtectedRoute allowedRoles={[ROLES.DISTRICT_AUTHORITY, ROLES.DISTRICT_MAGISTRATE, 'DISTRICT_AUTHORITY', 'DISTRICT_MAGISTRATE', 'DISTRICT_OFFICER', ROLES.ADMIN]}><DistrictNotificationsPage /></RoleProtectedRoute>} />
              <Route path="/district/profile" element={<RoleProtectedRoute allowedRoles={[ROLES.DISTRICT_AUTHORITY, ROLES.DISTRICT_MAGISTRATE, 'DISTRICT_AUTHORITY', 'DISTRICT_MAGISTRATE', 'DISTRICT_OFFICER', ROLES.ADMIN]}><DistrictProfilePage /></RoleProtectedRoute>} />
              <Route path="/revenue-dashboard" element={<RoleProtectedRoute allowedRoles={[ROLES.GOVERNMENT_OFFICER, 'FIELD_OFFICER', 'REVENUE_OFFICER']}><RevenueOfficerDashboard /></RoleProtectedRoute>} />
              <Route path="/officer/dashboard" element={<RoleProtectedRoute allowedRoles={[ROLES.GOVERNMENT_OFFICER, 'FIELD_OFFICER', 'REVENUE_OFFICER']}><RevenueOfficerDashboard /></RoleProtectedRoute>} />

              {/* State Government Dedicated Oversight Suite */}
              <Route path="/state/dashboard" element={<RoleProtectedRoute allowedRoles={[ROLES.STATE_GOVERNMENT, 'STATE_GOVERNMENT', 'STATE_OFFICER', ROLES.ADMIN]}><StateOfficerDashboard /></RoleProtectedRoute>} />
              <Route path="/state/projects" element={<RoleProtectedRoute allowedRoles={[ROLES.STATE_GOVERNMENT, 'STATE_GOVERNMENT', 'STATE_OFFICER', ROLES.ADMIN]}><StateProjectsPage /></RoleProtectedRoute>} />
              <Route path="/state/districts" element={<RoleProtectedRoute allowedRoles={[ROLES.STATE_GOVERNMENT, 'STATE_GOVERNMENT', 'STATE_OFFICER', ROLES.ADMIN]}><StateDistrictsPage /></RoleProtectedRoute>} />
              <Route path="/state/map" element={<RoleProtectedRoute allowedRoles={[ROLES.STATE_GOVERNMENT, 'STATE_GOVERNMENT', 'STATE_OFFICER', ROLES.ADMIN]}><StateMapPage /></RoleProtectedRoute>} />
              <Route path="/state/acquisition" element={<RoleProtectedRoute allowedRoles={[ROLES.STATE_GOVERNMENT, 'STATE_GOVERNMENT', 'STATE_OFFICER', ROLES.ADMIN]}><StateAcquisitionPage /></RoleProtectedRoute>} />
              <Route path="/state/compensation-rnr" element={<RoleProtectedRoute allowedRoles={[ROLES.STATE_GOVERNMENT, 'STATE_GOVERNMENT', 'STATE_OFFICER', ROLES.ADMIN]}><StateCompensationRnRPage /></RoleProtectedRoute>} />
              <Route path="/state/compensation" element={<RoleProtectedRoute allowedRoles={[ROLES.STATE_GOVERNMENT, 'STATE_GOVERNMENT', 'STATE_OFFICER', ROLES.ADMIN]}><StateCompensationRnRPage /></RoleProtectedRoute>} />
              <Route path="/state/r-and-r" element={<RoleProtectedRoute allowedRoles={[ROLES.STATE_GOVERNMENT, 'STATE_GOVERNMENT', 'STATE_OFFICER', ROLES.ADMIN]}><StateCompensationRnRPage /></RoleProtectedRoute>} />
              <Route path="/state/disputes" element={<RoleProtectedRoute allowedRoles={[ROLES.STATE_GOVERNMENT, 'STATE_GOVERNMENT', 'STATE_OFFICER', ROLES.ADMIN]}><StateDisputesPage /></RoleProtectedRoute>} />
              <Route path="/state/escalations" element={<RoleProtectedRoute allowedRoles={[ROLES.STATE_GOVERNMENT, 'STATE_GOVERNMENT', 'STATE_OFFICER', ROLES.ADMIN]}><StateEscalationsPage /></RoleProtectedRoute>} />
              <Route path="/state/reports" element={<RoleProtectedRoute allowedRoles={[ROLES.STATE_GOVERNMENT, 'STATE_GOVERNMENT', 'STATE_OFFICER', ROLES.ADMIN]}><StateReportsPage /></RoleProtectedRoute>} />

              {/* Central Ministry / PM Gati Shakti National Suite */}
              <Route path="/central/dashboard" element={<RoleProtectedRoute allowedRoles={[ROLES.CENTRAL_MINISTRY, 'CENTRAL_MINISTRY', 'CENTRAL_OFFICER', ROLES.ADMIN]}><NationalMonitoringDashboard /></RoleProtectedRoute>} />
              <Route path="/central/projects" element={<RoleProtectedRoute allowedRoles={[ROLES.CENTRAL_MINISTRY, 'CENTRAL_MINISTRY', 'CENTRAL_OFFICER', ROLES.ADMIN]}><CentralProjectsPage /></RoleProtectedRoute>} />
              <Route path="/central/states" element={<RoleProtectedRoute allowedRoles={[ROLES.CENTRAL_MINISTRY, 'CENTRAL_MINISTRY', 'CENTRAL_OFFICER', ROLES.ADMIN]}><CentralStatesPage /></RoleProtectedRoute>} />
              <Route path="/central/map" element={<RoleProtectedRoute allowedRoles={[ROLES.CENTRAL_MINISTRY, 'CENTRAL_MINISTRY', 'CENTRAL_OFFICER', ROLES.ADMIN]}><CentralMapPage /></RoleProtectedRoute>} />
              <Route path="/central/acquisition" element={<RoleProtectedRoute allowedRoles={[ROLES.CENTRAL_MINISTRY, 'CENTRAL_MINISTRY', 'CENTRAL_OFFICER', ROLES.ADMIN]}><CentralAcquisitionPage /></RoleProtectedRoute>} />
              <Route path="/central/compensation-rnr" element={<RoleProtectedRoute allowedRoles={[ROLES.CENTRAL_MINISTRY, 'CENTRAL_MINISTRY', 'CENTRAL_OFFICER', ROLES.ADMIN]}><CentralCompensationRnRPage /></RoleProtectedRoute>} />
              <Route path="/central/compensation" element={<RoleProtectedRoute allowedRoles={[ROLES.CENTRAL_MINISTRY, 'CENTRAL_MINISTRY', 'CENTRAL_OFFICER', ROLES.ADMIN]}><CentralCompensationRnRPage /></RoleProtectedRoute>} />
              <Route path="/central/r-and-r" element={<RoleProtectedRoute allowedRoles={[ROLES.CENTRAL_MINISTRY, 'CENTRAL_MINISTRY', 'CENTRAL_OFFICER', ROLES.ADMIN]}><CentralCompensationRnRPage /></RoleProtectedRoute>} />
              <Route path="/central/disputes" element={<RoleProtectedRoute allowedRoles={[ROLES.CENTRAL_MINISTRY, 'CENTRAL_MINISTRY', 'CENTRAL_OFFICER', ROLES.ADMIN]}><CentralDisputesPage /></RoleProtectedRoute>} />
              <Route path="/central/escalations" element={<RoleProtectedRoute allowedRoles={[ROLES.CENTRAL_MINISTRY, 'CENTRAL_MINISTRY', 'CENTRAL_OFFICER', ROLES.ADMIN]}><CentralEscalationsPage /></RoleProtectedRoute>} />
              <Route path="/central/reports" element={<RoleProtectedRoute allowedRoles={[ROLES.CENTRAL_MINISTRY, 'CENTRAL_MINISTRY', 'CENTRAL_OFFICER', ROLES.ADMIN]}><CentralReportsPage /></RoleProtectedRoute>} />

              {/* Citizen Landowner Portal Routes */}
              <Route path="/citizen/dashboard" element={<RoleProtectedRoute allowedRoles={[ROLES.CITIZEN, 'CITIZEN', ROLES.ADMIN]}><CitizenDashboard /></RoleProtectedRoute>} />
              <Route path="/citizen/my-land" element={<RoleProtectedRoute allowedRoles={[ROLES.CITIZEN, 'CITIZEN', ROLES.ADMIN]}><CitizenLandPage /></RoleProtectedRoute>} />
              <Route path="/citizen/acquisition-status" element={<RoleProtectedRoute allowedRoles={[ROLES.CITIZEN, 'CITIZEN', ROLES.ADMIN]}><CitizenLandPage /></RoleProtectedRoute>} />
              <Route path="/citizen/notices" element={<RoleProtectedRoute allowedRoles={[ROLES.CITIZEN, 'CITIZEN', ROLES.ADMIN]}><CitizenNoticesPage /></RoleProtectedRoute>} />
              <Route path="/citizen/submit-objection" element={<RoleProtectedRoute allowedRoles={[ROLES.CITIZEN, 'CITIZEN', ROLES.ADMIN]}><CitizenObjectionPage /></RoleProtectedRoute>} />
              <Route path="/citizen/payments" element={<RoleProtectedRoute allowedRoles={[ROLES.CITIZEN, 'CITIZEN', ROLES.ADMIN]}><CitizenPaymentPage /></RoleProtectedRoute>} />
              <Route path="/citizen/compensation" element={<RoleProtectedRoute allowedRoles={[ROLES.CITIZEN, 'CITIZEN', ROLES.ADMIN]}><CitizenPaymentPage /></RoleProtectedRoute>} />
              <Route path="/citizen/rr-benefits" element={<RoleProtectedRoute allowedRoles={[ROLES.CITIZEN, 'CITIZEN', ROLES.ADMIN]}><CitizenRRBenefitsPage /></RoleProtectedRoute>} />
              <Route path="/citizen/rehabilitation" element={<RoleProtectedRoute allowedRoles={[ROLES.CITIZEN, 'CITIZEN', ROLES.ADMIN]}><CitizenRRBenefitsPage /></RoleProtectedRoute>} />

              {/* System Administrator Governance Suite */}
              <Route path="/admin/dashboard" element={<RoleProtectedRoute allowedRoles={[ROLES.ADMIN, 'ADMIN']}><AdminDashboardPage /></RoleProtectedRoute>} />
              <Route path="/admin/users" element={<RoleProtectedRoute allowedRoles={[ROLES.ADMIN, 'ADMIN']}><AdminUsersPage /></RoleProtectedRoute>} />
              <Route path="/admin/roles" element={<RoleProtectedRoute allowedRoles={[ROLES.ADMIN, 'ADMIN']}><AdminRolesPermissionsPage /></RoleProtectedRoute>} />
              <Route path="/admin/roles-permissions" element={<RoleProtectedRoute allowedRoles={[ROLES.ADMIN, 'ADMIN']}><AdminRolesPermissionsPage /></RoleProtectedRoute>} />
              <Route path="/admin/projects-departments" element={<RoleProtectedRoute allowedRoles={[ROLES.ADMIN, 'ADMIN']}><AdminProjectsDepartmentsPage /></RoleProtectedRoute>} />
              <Route path="/admin/projects" element={<RoleProtectedRoute allowedRoles={[ROLES.ADMIN, 'ADMIN']}><AdminProjectsDepartmentsPage /></RoleProtectedRoute>} />
              <Route path="/admin/monitoring" element={<RoleProtectedRoute allowedRoles={[ROLES.ADMIN, 'ADMIN']}><AdminSystemMonitoringPage /></RoleProtectedRoute>} />
              <Route path="/admin/system-monitoring" element={<RoleProtectedRoute allowedRoles={[ROLES.ADMIN, 'ADMIN']}><AdminSystemMonitoringPage /></RoleProtectedRoute>} />
              <Route path="/admin/notifications" element={<RoleProtectedRoute allowedRoles={[ROLES.ADMIN, 'ADMIN']}><AdminNotificationsPage /></RoleProtectedRoute>} />
              <Route path="/admin/settings" element={<RoleProtectedRoute allowedRoles={[ROLES.ADMIN, 'ADMIN']}><AdminSystemSettingsPage /></RoleProtectedRoute>} />
              <Route path="/admin/system-settings" element={<RoleProtectedRoute allowedRoles={[ROLES.ADMIN, 'ADMIN']}><AdminSystemSettingsPage /></RoleProtectedRoute>} />
              <Route path="/admin/registrations" element={<RoleProtectedRoute allowedRoles={[ROLES.ADMIN, 'ADMIN']}><AdminUsersPage /></RoleProtectedRoute>} />
              <Route path="/admin/logs" element={<RoleProtectedRoute allowedRoles={[ROLES.ADMIN, 'ADMIN']}><AdminSystemMonitoringPage /></RoleProtectedRoute>} />
              <Route path="/admin/apis" element={<RoleProtectedRoute allowedRoles={[ROLES.ADMIN, 'ADMIN']}><AdminSystemMonitoringPage /></RoleProtectedRoute>} />

              {/* GIS Map & Spatial Analytics */}
              <Route path="/gis-map" element={<GISMapPage onOpenAI={() => setShowAIModal(true)} onOpenOCR={() => setShowOCRModal(true)} />} />
              <Route path="/map" element={<GISMapPage onOpenAI={() => setShowAIModal(true)} onOpenOCR={() => setShowOCRModal(true)} />} />
              <Route path="/gis" element={<GISMapPage onOpenAI={() => setShowAIModal(true)} onOpenOCR={() => setShowOCRModal(true)} />} />

              {/* Common Utilities & AI Tools */}
              <Route path="/reports" element={<ReportsAnalyticsPage />} />
              <Route path="/ai-assistant" element={<AIAssistantPage />} />
              <Route path="/document-analyzer" element={<DocumentAnalyzerPage />} />
              <Route path="/settings" element={<SettingsPage />} />

              {/* Catch-all 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </ErrorBoundary>
        </main>

          {/* Sticky/Fixed Footer */}
          <Footer />
        </div>
      </div>

      {/* Global Context-Aware AI Assistant (Floating Widget + Modal Integration) */}
      <ContextAwareAIAssistant
        externalOpen={showAIModal}
        onExternalClose={() => setShowAIModal(false)}
      />

      {/* Global AI OCR Analyzer Modal */}
      <AIDocumentOCRModal
        isOpen={showOCRModal}
        onClose={() => setShowOCRModal(false)}
      />

      {/* Global System Notifications & Toasts */}
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <LandDataProvider>
              <Routes>
                {/* Public Authentication Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterRoleSelectionPage />} />
                <Route path="/register/citizen" element={<CitizenRegistrationPage />} />
                <Route path="/register/officer" element={<OfficerRegistrationPage />} />
                <Route path="/register/agency" element={<AgencyRegistrationPage />} />
                <Route path="/register/authority" element={<AuthorityRegistrationPage />} />
                <Route path="/registration-status" element={<RegistrationStatusPage />} />

                {/* All Authenticated App Protected Routes */}
                <Route path="/*" element={<AppLayout />} />
              </Routes>
            </LandDataProvider>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
