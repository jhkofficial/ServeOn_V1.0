import React, { useState, useMemo } from 'react';
import { AuditLogEntry, UserRole } from '../../types';
import { INITIAL_AUDIT_LOGS, SERVEON_REGIONS } from '../../data/governanceData';
import {
  Activity,
  LogIn,
  Award,
  ShieldAlert,
  Search,
  Filter,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  User,
  Eye,
  FileCheck,
  AlertCircle,
  Shield,
  Layers,
} from 'lucide-react';

export const ScreenAuditLog: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [searchUser, setSearchUser] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<string>('ALL');
  const [selectedModule, setSelectedModule] = useState<string>('ALL');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('ALL');

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (searchUser.trim()) {
        const q = searchUser.toLowerCase();
        const matchesUser = log.user.toLowerCase().includes(q);
        const matchesRole = log.role.toLowerCase().includes(q);
        const matchesDetail = log.details ? log.details.toLowerCase().includes(q) : false;
        if (!matchesUser && !matchesRole && !matchesDetail) return false;
      }

      if (selectedActivity !== 'ALL' && log.activity !== selectedActivity) return false;
      if (selectedModule !== 'ALL' && log.module !== selectedModule) return false;
      if (selectedRegion !== 'ALL') {
        const matches = log.region === selectedRegion || log.region === 'All Regions';
        if (!matches) return false;
      }

      return true;
    });
  }, [logs, searchUser, selectedActivity, selectedModule, selectedRegion]);

  const getResultBadge = (result: AuditLogEntry['result']) => {
    switch (result) {
      case 'Success':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Approved':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Reviewed':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Failed':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Pending':
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const handleExportCSV = () => {
    const headers = 'DateTime,User,Role,Activity,Module,Region,Result,Details,IPAddress\n';
    const rows = filteredLogs
      .map(
        (l) =>
          `"${l.timestamp}","${l.user}","${l.role}","${l.activity}","${l.module}","${
            l.region
          }","${l.result}","${l.details || ''}","${l.ipAddress || ''}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SERVEON_Audit_Trail_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">
              SCREEN • GOVERNANCE
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              Immutable Telemetry
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Audit Log
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track important user, data access, and strategic decision activities across SERVEON.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Download Audit Trail</span>
          </button>
        </div>
      </div>

      {/* KPI CARDS (Activities Today 142, Login Events 38, Recommendation Decisions 19, Administrative Changes 7) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Activities Today */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Activities Today
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 tracking-tight font-sans">
              142
            </span>
            <span className="text-[11px] text-blue-600 font-medium">+18% vs yesterday</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Real-time streaming telemetry enabled
          </div>
        </div>

        {/* Login Events */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Login Events
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <LogIn className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-700 tracking-tight font-sans">
              38
            </span>
            <span className="text-[11px] text-emerald-600 font-medium">97.4% MFA Passed</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            1 failed attempt blocked by firewall
          </div>
        </div>

        {/* Recommendation Decisions */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Recommendation Decisions
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-700 tracking-tight font-sans">
              19
            </span>
            <span className="text-[11px] text-amber-600 font-medium">Reviewed &amp; Signed</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Retention &amp; Defense priority allocations
          </div>
        </div>

        {/* Administrative Changes */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Administrative Changes
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-700">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-purple-700 tracking-tight font-sans">
              7
            </span>
            <span className="text-[11px] text-purple-600 font-medium">RBAC &amp; Policy</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Authorized by Application Admins
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Search User */}
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by user, role, or action details..."
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Dropdowns: Date, Activity, Module, Region */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] font-semibold text-slate-500">Date:</span>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 text-xs focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Dates (Sep 2026)</option>
              <option value="TODAY">Today (15 Sep)</option>
              <option value="YESTERDAY">Yesterday (14 Sep)</option>
              <option value="WEEK">Last 7 Days</option>
            </select>
          </div>

          {/* Activity Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
            <span className="text-[11px] font-semibold text-slate-500">Activity:</span>
            <select
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 text-xs focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Activities</option>
              <option value="Logged in">Logged in</option>
              <option value="Viewed Candidate Detail">Viewed Candidate Detail</option>
              <option value="Reviewed Recommendation">Reviewed Recommendation</option>
              <option value="Approved Recommendation">Approved Recommendation</option>
              <option value="Updated User Role">Updated User Role</option>
              <option value="Exported Explainability Dataset">Exported Dataset</option>
              <option value="Evaluated Expansion Gate">Evaluated Expansion Gate</option>
            </select>
          </div>

          {/* Module Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
            <span className="text-[11px] font-semibold text-slate-500">Module:</span>
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 text-xs focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Modules</option>
              <option value="Authentication">Authentication</option>
              <option value="Strategic Location">Strategic Location</option>
              <option value="Retention">Retention</option>
              <option value="Market Defense">Market Defense</option>
              <option value="Network Expansion">Network Expansion</option>
              <option value="Explainability">Explainability</option>
              <option value="User Management">User Management</option>
              <option value="Application Settings">Application Settings</option>
            </select>
          </div>

          {/* Region Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
            <span className="text-[11px] font-semibold text-slate-500">Region:</span>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 text-xs focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Regions</option>
              <option value="Jawa Tengah">Jawa Tengah</option>
              <option value="DKI Jakarta">DKI Jakarta</option>
            </select>
          </div>

          {(searchUser || selectedActivity !== 'ALL' || selectedModule !== 'ALL' || selectedRegion !== 'ALL') && (
            <button
              onClick={() => {
                setSearchUser('');
                setSelectedActivity('ALL');
                setSelectedModule('ALL');
                setSelectedRegion('ALL');
                setDateFilter('ALL');
              }}
              className="px-2 py-1 text-[11px] text-blue-700 hover:text-blue-900 font-semibold underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* AUDIT LOG TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Date &amp; Time</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Activity</th>
                <th className="px-4 py-3">Module</th>
                <th className="px-4 py-3">Region</th>
                <th className="px-4 py-3">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    No audit records matching the specified filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Date & Time */}
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                      {entry.timestamp}
                    </td>

                    {/* User */}
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{entry.user}</div>
                      {entry.userEmail && (
                        <div className="text-[10.5px] text-slate-400 font-mono">
                          {entry.userEmail}
                        </div>
                      )}
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-[10.5px] font-medium text-slate-700">
                        {entry.role}
                      </span>
                    </td>

                    {/* Activity */}
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{entry.activity}</div>
                      {entry.details && (
                        <div className="text-[11px] text-slate-500 leading-snug">
                          {entry.details}
                        </div>
                      )}
                    </td>

                    {/* Module */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[10.5px] font-medium">
                        {entry.module}
                      </span>
                    </td>

                    {/* Region */}
                    <td className="px-4 py-3 whitespace-nowrap text-slate-600 text-[11px]">
                      {entry.region}
                    </td>

                    {/* Result */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-block text-[10.5px] font-bold px-2 py-0.5 rounded-full border ${getResultBadge(
                          entry.result
                        )}`}
                      >
                        {entry.result}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-3.5 bg-slate-50/70 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Displaying <span className="font-semibold text-slate-900">{filteredLogs.length}</span> audit records
          </span>
          <span className="font-mono text-[11px]">
            Compliance: ISO 27001 / SOC 2 Type II Verified Log Storage
          </span>
        </div>
      </div>
    </div>
  );
};
