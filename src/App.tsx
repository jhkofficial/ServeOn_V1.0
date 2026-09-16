import React, { useState, useMemo } from 'react';
import { ScreenId, GlobalFilterState, AreaIntelligence, StrategicRole, BusinessObjective } from './types';
import { SEMARANG_AREAS, getAreaById, EXECUTIVE_KPI_SUMMARY } from './data/semarangData';
import { Header } from './components/Navigation/Header';
import { Sidebar } from './components/Navigation/Sidebar';

// 9 Core Screens
import { Screen01ExecutiveOverview } from './components/Screens/Screen01ExecutiveOverview';
import { Screen02StrategicActionMap } from './components/Screens/Screen02StrategicActionMap';
import { Screen03Retention } from './components/Screens/Screen03Retention';
import { Screen04MarketShareDefense } from './components/Screens/Screen04MarketShareDefense';
import { Screen05NewCustomerAcquisition } from './components/Screens/Screen05NewCustomerAcquisition';
import { Screen06NetworkExpansion } from './components/Screens/Screen06NetworkExpansion';
import { Screen07CandidateDetail } from './components/Screens/Screen07CandidateDetail';
import { Screen08Explainability } from './components/Screens/Screen08Explainability';
import { Screen09Recommendation } from './components/Screens/Screen09Recommendation';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('executive-overview');
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
          {currentScreen === 'executive-overview' && (
            <Screen01ExecutiveOverview
              areas={filteredAreas}
              selectedAreaId={selectedAreaId}
              onSelectArea={setSelectedAreaId}
              onNavigate={handleNavigate}
            />
          )}

          {currentScreen === 'strategic-map' && (
            <Screen02StrategicActionMap
              areas={filteredAreas}
              selectedAreaId={selectedAreaId}
              onSelectArea={setSelectedAreaId}
              onNavigate={handleNavigate}
            />
          )}

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

          {currentScreen === 'recommendation' && (
            <Screen09Recommendation
              areas={filteredAreas}
              selectedAreaId={selectedAreaId}
              onSelectArea={setSelectedAreaId}
              onNavigate={handleNavigate}
            />
          )}
        </main>
      </div>
    </div>
  );
}
