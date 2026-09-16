import React, { useState, useMemo } from 'react';
import { ScreenId, GlobalFilterState, AreaIntelligence, StrategicRole, BusinessObjective, UserRole } from './types';
import { SEMARANG_AREAS, getAreaById, EXECUTIVE_KPI_SUMMARY } from './data/semarangData';
import { Header } from './components/Navigation/Header';
import { Sidebar } from './components/Navigation/Sidebar';

// 9 Core Intelligence Screens
import { Screen01ExecutiveOverview } from './components/Screens/Screen01ExecutiveOverview';
import { Screen02StrategicActionMap } from './components/Screens/Screen02StrategicActionMap';
import { Screen03Retention } from './components/Screens/Screen03Retention';
import { Screen04MarketShareDefense } from './components/Screens/Screen04MarketShareDefense';
import { Screen05NewCustomerAcquisition } from './components/Screens/Screen05NewCustomerAcquisition';
import { Screen06NetworkExpansion } from './components/Screens/Screen06NetworkExpansion';
import { Screen07CandidateDetail } from './components/Screens/Screen07CandidateDetail';
import { Screen08Explainability } from './components/Screens/Screen08Explainability';
import { Screen09Recommendation } from './components/Screens/Screen09Recommendation';

// Governance & Authentication Screens
import { ScreenLogin } from './components/Screens/ScreenLogin';
import { ScreenUserManagement } from './components/Screens/ScreenUserManagement';
import { ScreenRolePermission } from './components/Screens/ScreenRolePermission';
import { ScreenAuditLog } from './components/Screens/ScreenAuditLog';
import { ScreenApplicationSettings } from './components/Screens/ScreenApplicationSettings';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    role: UserRole;
    title: string;
  }>({
    name: 'Johanes Harindrias',
    email: 'johanes@company.com',
    role: 'Application Admin',
    title: 'Regional Strategy Lead',
  });

  const [currentScreen, setCurrentScreen] = useState<ScreenId>('login');
  const [selectedAreaId, setSelectedAreaId] = useState<string>('semarang-selatan');

  const [filters, setFilters] = useState<GlobalFilterState>({
    region: 'Jawa Tengah',
    city: 'Kota Semarang',
    selectedKecamatanId: 'semarang-selatan',
    period: 'FY2026-Q3 (Sep 2026)',
    objective: 'ALL',
    strategicRoleFilter: 'ALL',
  });

  const handleNavigate = (screen: ScreenId, areaId?: string) => {
    setCurrentScreen(screen);
    if (areaId) {
      setSelectedAreaId(areaId);
      setFilters((prev) => ({ ...prev, selectedKecamatanId: areaId }));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (user: { name: string; email: string; role: UserRole; title?: string }) => {
    setCurrentUser({
      name: user.name,
      email: user.email,
      role: user.role,
      title: user.title || 'Enterprise User',
    });
    setIsLoggedIn(true);
    setCurrentScreen('executive-overview');
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setCurrentScreen('login');
  };

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentUser((prev) => ({
      ...prev,
      role: newRole,
    }));
  };

  const handleFilterChange = (newFilters: Partial<GlobalFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    if (newFilters.selectedKecamatanId) {
      setSelectedAreaId(newFilters.selectedKecamatanId);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      region: 'Jawa Tengah',
      city: 'Kota Semarang',
      selectedKecamatanId: selectedAreaId,
      period: 'FY2026-Q3 (Sep 2026)',
      objective: 'ALL',
      strategicRoleFilter: 'ALL',
    });
  };

  // Filtered areas based on global filter state
  const filteredAreas = useMemo(() => {
    return SEMARANG_AREAS.filter((area) => {
      if (filters.strategicRoleFilter !== 'ALL' && area.strategicRole !== filters.strategicRoleFilter) {
        return false;
      }
      if (filters.objective !== 'ALL') {
        if (filters.objective === 'RETENTION' && area.strategicRole !== 'PROTECT') return false;
        if (filters.objective === 'MARKET_DEFENSE' && area.strategicRole !== 'DEFEND') return false;
        if (filters.objective === 'ACQUISITION' && area.strategicRole !== 'ACQUIRE') return false;
        if (filters.objective === 'EXPANSION' && area.strategicRole !== 'EXPAND') return false;
      }
      return true;
    });
  }, [filters]);

  const selectedArea = getAreaById(selectedAreaId) || SEMARANG_AREAS[0];

  // If user is logged out or viewing login screen
  if (!isLoggedIn || currentScreen === 'login') {
    return <ScreenLogin onLoginSuccess={handleLoginSuccess} onLogin={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Global Application Header */}
      <Header
        currentScreen={currentScreen}
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        areas={SEMARANG_AREAS}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onSignOut={handleSignOut}
        onRoleChange={handleRoleChange}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar
          currentScreen={currentScreen}
          onNavigate={(screen) => handleNavigate(screen)}
          selectedAreaName={selectedArea?.name}
          roleCounts={EXECUTIVE_KPI_SUMMARY.roleCounts}
        />

        {/* Scrollable Screen Content Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {/* Read-Only Notice for Viewer Role */}
          {currentUser.role === 'Viewer' && (
            <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold">VIEWER MODE:</span>
                <span>You have read-only access. Modification of strategic policies or user accounts is restricted.</span>
              </div>
              <span className="font-mono text-[10.5px] uppercase font-bold text-amber-700">Audit Active</span>
            </div>
          )}

          {/* Regional Manager Restricted Notice */}
          {currentUser.role === 'Regional Manager' && (
            <div className="mb-4 p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold">REGIONAL MANAGER CLEARANCE:</span>
                <span>Territory restricted to assigned jurisdiction: Jawa Tengah (Kota Semarang).</span>
              </div>
              <span className="font-mono text-[10.5px] uppercase font-bold text-blue-700">Region Enforced</span>
            </div>
          )}

          {/* OVERVIEW */}
          {currentScreen === 'executive-overview' && (
            <Screen01ExecutiveOverview
              areas={filteredAreas}
              selectedAreaId={selectedAreaId}
              onSelectArea={setSelectedAreaId}
              onNavigate={handleNavigate}
            />
          )}

          {/* WHERE */}
          {currentScreen === 'strategic-map' && (
            <Screen02StrategicActionMap
              areas={filteredAreas}
              selectedAreaId={selectedAreaId}
              onSelectArea={setSelectedAreaId}
              onNavigate={handleNavigate}
            />
          )}

          {/* PROTECT */}
          {currentScreen === 'retention' && (
            <Screen03Retention
              areas={filteredAreas}
              selectedAreaId={selectedAreaId}
              onSelectArea={setSelectedAreaId}
              onNavigate={handleNavigate}
            />
          )}

          {currentScreen === 'market-defense' && (
            <Screen04MarketShareDefense
              areas={filteredAreas}
              selectedAreaId={selectedAreaId}
              onSelectArea={setSelectedAreaId}
              onNavigate={handleNavigate}
            />
          )}

          {/* GROW */}
          {currentScreen === 'acquisition' && (
            <Screen05NewCustomerAcquisition
              areas={filteredAreas}
              selectedAreaId={selectedAreaId}
              onSelectArea={setSelectedAreaId}
              onNavigate={handleNavigate}
            />
          )}

          {currentScreen === 'network-expansion' && (
            <Screen06NetworkExpansion
              areas={filteredAreas}
              selectedAreaId={selectedAreaId}
              onSelectArea={setSelectedAreaId}
              onNavigate={handleNavigate}
            />
          )}

          {/* UNDERSTAND */}
          {currentScreen === 'candidate-detail' && (
            <Screen07CandidateDetail
              areas={filteredAreas}
              selectedAreaId={selectedAreaId}
              onSelectArea={setSelectedAreaId}
              onNavigate={handleNavigate}
            />
          )}

          {currentScreen === 'explainability' && (
            <Screen08Explainability
              areas={filteredAreas}
              selectedAreaId={selectedAreaId}
              onSelectArea={setSelectedAreaId}
              onNavigate={handleNavigate}
            />
          )}

          {/* DECIDE */}
          {currentScreen === 'recommendation' && (
            <Screen09Recommendation
              areas={filteredAreas}
              selectedAreaId={selectedAreaId}
              onSelectArea={setSelectedAreaId}
              onNavigate={handleNavigate}
            />
          )}

          {/* GOVERN */}
          {currentScreen === 'user-management' && (
            <ScreenUserManagement />
          )}

          {currentScreen === 'role-permission' && (
            <ScreenRolePermission />
          )}

          {currentScreen === 'audit-log' && (
            <ScreenAuditLog />
          )}

          {currentScreen === 'application-settings' && (
            <ScreenApplicationSettings />
          )}
        </main>
      </div>
    </div>
  );
}
