import React, { useState, useRef, useEffect } from 'react';
import { GlobalFilterState, BusinessObjective, AreaIntelligence, ScreenId, UserRole } from '../../types';
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
  Sparkles,
  Shield,
  KeyRound,
  LogOut,
  Settings,
  FileText,
  MapPin,
  CheckCircle2,
  X
} from 'lucide-react';

interface HeaderProps {
  filters: GlobalFilterState;
  onFilterChange: (filters: Partial<GlobalFilterState>) => void;
  areas?: AreaIntelligence[];
  currentScreen: ScreenId;
  onNavigate?: (screen: ScreenId, areaId?: string) => void;
  onResetFilters?: () => void;
  currentUser?: { name: string; email: string; role: UserRole; title: string };
  onSignOut?: () => void;
  onRoleChange?: (role: UserRole) => void;
}

export const Header: React.FC<HeaderProps> = ({
  filters,
  onFilterChange,
  areas = [],
  currentScreen,
  onNavigate,
  onResetFilters,
  currentUser = {
    name: 'Johanes Harindrias',
    email: 'johanes@company.com',
    role: 'Application Admin',
    title: 'Regional Strategy Lead',
  },
  onSignOut,
  onRoleChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const safeAreas = Array.isArray(areas) ? areas : [];
  const filteredAreas = safeAreas.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.strategicRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const ALL_ROLES: UserRole[] = [
    'Executive / Management',
    'Regional Manager',
    'Network Planning',
    'CRM / Marketing',
    'Data Analyst',
    'Application Admin',
    'Viewer',
  ];

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

          {/* User Profile Area with Dropdown Menu */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 pl-2 border-l border-slate-200 hover:opacity-85 transition-opacity cursor-pointer text-left"
            >
              <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold font-mono shadow-2xs">
                {getInitials(currentUser.name)}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-slate-900 leading-tight flex items-center gap-1">
                  <span>{currentUser.name}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
                <div className="text-[10px] text-slate-500 leading-tight">{currentUser.title}</div>
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 text-xs divide-y divide-slate-100 animate-in fade-in duration-150">
                {/* Header Profile Identity */}
                <div className="p-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs font-bold font-mono">
                      {getInitials(currentUser.name)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-500">{currentUser.title}</div>
                      <div className="text-[10px] font-mono text-slate-400">{currentUser.email}</div>
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-medium">Assigned Role:</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {currentUser.role}
                    </span>
                  </div>
                </div>

                {/* Role Switcher for UX Testing */}
                <div className="p-2">
                  <div className="px-1 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>TEST ROLE UX</span>
                    <span className="text-[9px] text-blue-600 font-normal">Switch active view</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 mt-1">
                    {ALL_ROLES.map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          onRoleChange?.(r);
                          setShowProfileMenu(false);
                        }}
                        className={`px-2 py-1 rounded text-[10.5px] font-medium text-left truncate transition-colors ${
                          currentUser.role === r
                            ? 'bg-blue-900 text-white font-bold'
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        {r.split('/')[0].trim()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Navigation Options from Prompt: My Profile, My Access, Preferences, Sign Out */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowProfileModal(true);
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium text-left transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowAccessModal(true);
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium text-left transition-colors"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                    <span>My Access</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowPreferencesModal(true);
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium text-left transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-500" />
                    <span>Preferences</span>
                  </button>
                </div>

                {/* Sign Out */}
                <div className="pt-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onSignOut?.();
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg hover:bg-rose-50 text-rose-700 font-semibold flex items-center gap-2 text-left transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
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

          {/* Role Clearance Pill */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200/80 text-[10.5px]">
            <Shield className="w-3 h-3 text-blue-700" />
            <span className="font-bold text-blue-900">
              {currentUser.role === 'Regional Manager'
                ? 'Territory: Jawa Tengah Assigned'
                : currentUser.role === 'Executive / Management'
                ? 'Executive Sign-Off Active'
                : currentUser.role === 'Viewer'
                ? 'Read-Only Mode'
                : `${currentUser.role} Active`}
            </span>
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

      {/* MODAL: My Profile */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">My Profile</h3>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-base font-mono">
                  {getInitials(currentUser.name)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{currentUser.name}</h4>
                  <p className="text-slate-500 font-medium">{currentUser.title}</p>
                  <p className="text-slate-400 font-mono text-[11px]">{currentUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Employee ID</span>
                  <div className="font-mono font-bold text-slate-900 mt-0.5">EMP-00184</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Business Unit</span>
                  <div className="font-bold text-slate-900 mt-0.5">Regional Strategy</div>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200 text-blue-900 text-[11px]">
                <span className="font-bold">Identity Provider:</span> Authenticated via Corporate Azure Active Directory SSO (SAML 2.0). 2FA Active.
              </div>
            </div>
            <div className="p-3.5 bg-slate-50 border-t border-slate-200 text-right">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-1.5 rounded-lg bg-blue-900 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: My Access */}
      {showAccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">My Access &amp; Clearances</h3>
              </div>
              <button
                onClick={() => setShowAccessModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Assigned Security Role</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{currentUser.role}</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active Clearance
                </span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Territory &amp; Spatial Jurisdiction
                </span>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1 text-slate-700">
                  <div className="flex items-center justify-between">
                    <span>Authorized Region:</span>
                    <strong className="text-slate-900">
                      {currentUser.role === 'Regional Manager' ? 'Jawa Tengah (Assigned Only)' : 'All Regions (National)'}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Focus City / Pilot:</span>
                    <strong className="text-slate-900">Kota Semarang (16 Kecamatan, 172 H3 Hexagons)</strong>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 text-emerald-950 text-[11px] flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  All permissions are dynamically enforced by SERVEON's Role-Based Access Control engine and verified on each session.
                </span>
              </div>
            </div>
            <div className="p-3.5 bg-slate-50 border-t border-slate-200 text-right">
              <button
                onClick={() => setShowAccessModal(false)}
                className="px-4 py-1.5 rounded-lg bg-blue-900 text-white font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Preferences */}
      {showPreferencesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">User Preferences</h3>
              </div>
              <button
                onClick={() => setShowPreferencesModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3.5 text-xs">
              <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-900">High-Density Table Display</div>
                  <div className="text-[10px] text-slate-500">Show compact rows in candidate listings</div>
                </div>
                <input type="checkbox" defaultChecked className="rounded text-blue-600" />
              </label>
              <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-900">Hexagonal Map by Default</div>
                  <div className="text-[10px] text-slate-500">Initialize map using H3 hexagonal pattern</div>
                </div>
                <input type="checkbox" defaultChecked className="rounded text-blue-600" />
              </label>
              <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <div className="font-bold text-slate-900">Proactive Churn Notifications</div>
                  <div className="text-[10px] text-slate-500">Receive alerts when retention cluster surpasses 2,000 accounts</div>
                </div>
                <input type="checkbox" defaultChecked className="rounded text-blue-600" />
              </label>
            </div>
            <div className="p-3.5 bg-slate-50 border-t border-slate-200 text-right">
              <button
                onClick={() => setShowPreferencesModal(false)}
                className="px-4 py-1.5 rounded-lg bg-blue-900 text-white font-bold text-xs"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
