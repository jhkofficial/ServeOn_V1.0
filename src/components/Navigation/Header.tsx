import React, { useState } from 'react';
import { GlobalFilterState, BusinessObjective, AreaIntelligence, ScreenId } from '../../types';
import { 
  Compass, 
  Clock, 
  Search, 
  Bell, 
  User, 
  Check, 
  Filter, 
  SlidersHorizontal,
  ChevronDown,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  filters: GlobalFilterState;
  onFilterChange: (filters: Partial<GlobalFilterState>) => void;
  areas?: AreaIntelligence[];
  currentScreen: ScreenId;
  onNavigate?: (screen: ScreenId, areaId?: string) => void;
  onResetFilters?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  filters,
  onFilterChange,
  areas = [],
  currentScreen,
  onNavigate,
  onResetFilters,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const safeAreas = Array.isArray(areas) ? areas : [];
  const filteredAreas = safeAreas.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.strategicRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
      {/* Top Main Bar */}
      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate?.('executive-overview')}>
            <div className="w-8 h-8 rounded-lg bg-blue-900 flex items-center justify-center text-white shadow-xs">
              <Compass className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-slate-950 tracking-tight font-sans">
                  SERVEON
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  V2.1 FINAL
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
                Customer-Centric Location &amp; Network Decision Intelligence
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar & Quick Jump */}
        <div className="relative flex-1 max-w-md hidden md:block">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search area (e.g. Semarang Selatan, Pedurungan, role)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder:text-slate-400"
            />
          </div>

          {showSearchDropdown && searchQuery.trim() !== '' && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto py-1 text-xs">
              {filteredAreas.length === 0 ? (
                <div className="px-3 py-2 text-slate-500">No areas found</div>
              ) : (
                filteredAreas.map((area) => (
                  <div
                    key={area.id}
                    onClick={() => {
                      onFilterChange({ selectedKecamatanId: area.id });
                      onNavigate?.('candidate-detail', area.id);
                      setShowSearchDropdown(false);
                      setSearchQuery('');
                    }}
                    className="px-3 py-2 hover:bg-slate-50 flex items-center justify-between cursor-pointer border-b border-slate-100 last:border-b-0"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{area.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {area.code} • {area.customerCount.toLocaleString()} customers
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        area.strategicRole === 'PROTECT'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : area.strategicRole === 'DEFEND'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : area.strategicRole === 'ACQUIRE'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {area.strategicRole}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Status, Notifications, Profile */}
        <div className="flex items-center gap-3">
          {/* Data Freshness */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] text-slate-600 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Updated Today, 15 Sep 2026</span>
          </div>

          {/* Notifications Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="System Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-50 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-bold text-slate-900">Intelligence Notifications</span>
                  <span className="text-[10px] font-medium text-blue-600">3 new</span>
                </div>
                <div className="mt-2 space-y-2.5">
                  <div className="p-2 rounded bg-amber-50/70 border border-amber-200/60">
                    <p className="font-semibold text-amber-950 text-[11px]">Competitor Spike in Semarang Tengah</p>
                    <p className="text-amber-800 text-[10px] mt-0.5">Competitor promo detected on 3 central avenues. Defend action recommended.</p>
                  </div>
                  <div className="p-2 rounded bg-blue-50/70 border border-blue-200/60">
                    <p className="font-semibold text-blue-950 text-[11px]">VIP Churn Alerts: Semarang Selatan</p>
                    <p className="text-blue-800 text-[10px] mt-0.5">4,210 accounts entering 90-day renewal cycle.</p>
                  </div>
                  <div className="p-2 rounded bg-purple-50/70 border border-purple-200/60">
                    <p className="font-semibold text-purple-950 text-[11px]">Expansion Gate Notice</p>
                    <p className="text-purple-800 text-[10px] mt-0.5">Zero qualified candidates in Kota Semarang. Capex preservation active.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold font-mono">
              OH
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-slate-900 leading-tight">office.harindrias</div>
              <div className="text-[10px] text-slate-500 leading-tight">Regional Strategy Lead</div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Filter Toolbar */}
      <div className="px-4 sm:px-6 py-2 bg-slate-50/80 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="flex items-center gap-1 font-semibold text-slate-600 text-[11px]">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            CONTEXT:
          </span>

          {/* Region */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md px-2.5 py-1 text-slate-700">
            <span className="text-slate-400 text-[10px]">Provinsi:</span>
            <span className="font-semibold text-slate-900">{filters.region}</span>
          </div>

          {/* City */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md px-2.5 py-1 text-slate-700">
            <span className="text-slate-400 text-[10px]">Kab/Kota:</span>
            <span className="font-semibold text-slate-900">{filters.city}</span>
          </div>

            {/* Kecamatan Select */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md px-2 py-0.5 text-slate-700">
              <span className="text-slate-400 text-[10px]">Kecamatan:</span>
              <select
                value={filters.selectedKecamatanId || (safeAreas[0] ? safeAreas[0].id : '')}
                onChange={(e) => {
                  onFilterChange({ selectedKecamatanId: e.target.value });
                  onNavigate?.(currentScreen, e.target.value);
                }}
                className="bg-transparent font-semibold text-slate-900 focus:outline-hidden text-xs py-0.5 pr-1 cursor-pointer"
              >
                {safeAreas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.strategicRole})
                  </option>
                ))}
              </select>
            </div>

          {/* Period */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md px-2.5 py-1 text-slate-700">
            <span className="text-slate-400 text-[10px]">Period:</span>
            <span className="font-semibold text-slate-900">{filters.period}</span>
          </div>
        </div>

        {/* Business Objective Filter Pills */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-semibold text-slate-500 mr-1 hidden sm:inline">
            Objective:
          </span>
          {(['ALL', 'RETENTION', 'MARKET_DEFENSE', 'ACQUISITION', 'EXPANSION'] as BusinessObjective[]).map((obj) => {
            const isSelected = filters.objective === obj;
            const labelMap: Record<BusinessObjective, string> = {
              ALL: 'All Objectives',
              RETENTION: 'Retention',
              MARKET_DEFENSE: 'Market Defense',
              ACQUISITION: 'Acquisition',
              EXPANSION: 'Expansion',
            };

            return (
              <button
                key={obj}
                onClick={() => onFilterChange({ objective: obj })}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                  isSelected
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {labelMap[obj]}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
