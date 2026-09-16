import React, { useState, useMemo } from 'react';
import { 
  ActionPlanItem, 
  BusinessObjective, 
  RecommendationLifecycleStatus, 
  ExecutionHealthStatus,
  ScreenId
} from '../../types';
import { INITIAL_ACTION_PLANS } from '../../data/executionData';
import { CreateActionPlanDrawer } from '../Modals/CreateActionPlanDrawer';
import {
  PlayCircle,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Plus,
  DollarSign,
  Users,
  Target,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  ChevronRight,
  ShieldCheck,
  Calendar,
  FileCheck
} from 'lucide-react';

interface Props {
  onNavigate?: (screen: ScreenId, areaId?: string) => void;
}

export const ScreenActionExecution: React.FC<Props> = ({ onNavigate }) => {
  const [actionPlans, setActionPlans] = useState<ActionPlanItem[]>(INITIAL_ACTION_PLANS);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('ACT-202609-001');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedObjective, setSelectedObjective] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedHealth, setSelectedHealth] = useState<string>('ALL');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Selected plan detail
  const selectedPlan = actionPlans.find((p) => p.id === selectedPlanId) || actionPlans[0];

  // Filtered plans
  const filteredPlans = useMemo(() => {
    return actionPlans.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesArea = p.areaName.toLowerCase().includes(q);
        const matchesOwner = p.owner.toLowerCase().includes(q);
        const matchesRecId = p.recommendationId.toLowerCase().includes(q);
        if (!matchesName && !matchesArea && !matchesOwner && !matchesRecId) return false;
      }

      if (selectedObjective !== 'ALL' && p.objective !== selectedObjective) return false;
      if (selectedStatus !== 'ALL' && p.status !== selectedStatus) return false;
      if (selectedHealth !== 'ALL' && p.health !== selectedHealth) return false;

      return true;
    });
  }, [actionPlans, searchQuery, selectedObjective, selectedStatus, selectedHealth]);

  // Metrics
  const activeActionsCount = actionPlans.filter((p) => p.status === 'IN EXECUTION').length;
  const completedActionsCount = actionPlans.filter((p) => p.status === 'COMPLETED').length;
  const onTrackCount = actionPlans.filter((p) => p.health === 'ON TRACK').length;
  const onTrackPct = Math.round((onTrackCount / (activeActionsCount || 1)) * 100);

  const totalBudget = actionPlans.reduce((sum, p) => sum + p.budget, 0);
  const totalBudgetUsed = actionPlans.reduce((sum, p) => sum + p.budgetUsed, 0);
  const budgetUtilizationPct = Math.round((totalBudgetUsed / (totalBudget || 1)) * 100);

  const handleAddNewPlan = (newPlan: ActionPlanItem) => {
    setActionPlans((prev) => [newPlan, ...prev]);
    setSelectedPlanId(newPlan.id);
  };

  const getObjectiveBadge = (obj: BusinessObjective) => {
    switch (obj) {
      case 'RETENTION':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'MARKET_DEFENSE':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'ACQUISITION':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'EXPANSION':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getHealthBadge = (health: ExecutionHealthStatus) => {
    switch (health) {
      case 'ON TRACK':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'AT RISK':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'DELAYED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'COMPLETED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider font-mono">
              SCREEN H • CLOSED-LOOP EXECUTION
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">RESULT Pillar</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Action Execution
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
            Track how approved SERVEON recommendations are being executed across territories, operational milestones, and budget allocations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigate && (
            <button
              onClick={() => onNavigate('performance-measurement')}
              className="px-3.5 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Activity className="w-3.5 h-3.5 text-blue-700" />
              <span>Go to Measurement</span>
            </button>
          )}

          <button
            onClick={() => setIsDrawerOpen(true)}
            className="px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-[0.99]"
          >
            <Plus className="w-4 h-4" />
            <span>Create Action Plan</span>
          </button>
        </div>
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Active Actions
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700">
              <PlayCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{activeActionsCount}</span>
            <span className="text-xs text-blue-700 font-semibold">Underway in Field</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Authorized by management
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Completed Actions
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{completedActionsCount}</span>
            <span className="text-xs text-emerald-700 font-semibold">Ready for Measurement</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Milestones 100% delivered
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Execution On Track
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-700">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{onTrackPct}%</span>
            <span className="text-xs text-indigo-700 font-semibold font-mono">({onTrackCount}/{activeActionsCount})</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Timeline &amp; target compliant
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Budget Utilization
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{budgetUtilizationPct}%</span>
            <span className="text-xs text-cyan-800 font-semibold font-mono">
              Rp{(totalBudgetUsed / 1e6).toFixed(0)}M / Rp{(totalBudget / 1e6).toFixed(0)}M
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Managed under financial governance
          </div>
        </div>
      </div>

      {/* FILTERS TOOLBAR */}
      <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search ID, action, district, owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
            />
          </div>

          {/* Objective Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Objective:</span>
            <select
              value={selectedObjective}
              onChange={(e) => setSelectedObjective(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
            >
              <option value="ALL">All Objectives</option>
              <option value="RETENTION">Retention</option>
              <option value="MARKET_DEFENSE">Market Share Defense</option>
              <option value="ACQUISITION">New Customer Acquisition</option>
              <option value="EXPANSION">Network Expansion</option>
            </select>
          </div>

          {/* Health Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Health:</span>
            <select
              value={selectedHealth}
              onChange={(e) => setSelectedHealth(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
            >
              <option value="ALL">All Health</option>
              <option value="ON TRACK">On Track</option>
              <option value="AT RISK">At Risk</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        <div className="text-slate-500 font-medium text-[11px]">
          Showing <span className="font-bold text-slate-900">{filteredPlans.length}</span> of {actionPlans.length} Active Plans
        </div>
      </div>

      {/* SPLIT VIEW: MAIN TABLE + DETAILED EXECUTION INSPECTOR */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Main Execution Table (7 or 8 Cols) */}
        <div className="xl:col-span-8 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-3.5 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-700" />
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Approved Recommendations in Execution
              </h3>
            </div>
            <span className="text-[11px] text-slate-500">
              Click row to inspect live execution telemetry
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-3 py-3">Rec ID</th>
                  <th className="px-3 py-3">Area</th>
                  <th className="px-3 py-3">Action &amp; Owner</th>
                  <th className="px-3 py-3">Progress</th>
                  <th className="px-3 py-3">Budget</th>
                  <th className="px-3 py-3">Health</th>
                  <th className="px-3 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredPlans.map((plan) => {
                  const isSelected = plan.id === selectedPlanId;
                  return (
                    <tr
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`transition-colors cursor-pointer ${
                        isSelected ? 'bg-blue-50/70 font-semibold' : 'hover:bg-slate-50/70'
                      }`}
                    >
                      {/* Rec ID & Objective */}
                      <td className="px-3 py-3 font-mono">
                        <div className="font-bold text-slate-900 text-[11px]">
                          {plan.recommendationId}
                        </div>
                        <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded border mt-0.5 ${getObjectiveBadge(plan.objective)}`}>
                          {plan.objective.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Area */}
                      <td className="px-3 py-3 text-slate-900 font-semibold text-xs whitespace-nowrap">
                        {plan.areaName}
                      </td>

                      {/* Action & Owner */}
                      <td className="px-3 py-3 max-w-xs">
                        <div className="font-semibold text-slate-900 text-xs line-clamp-1">
                          {plan.name}
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">
                          {plan.owner}
                        </div>
                      </td>

                      {/* Progress */}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden shrink-0">
                            <div
                              className={`h-full rounded-full ${
                                plan.progress === 100
                                  ? 'bg-emerald-500'
                                  : plan.health === 'AT RISK'
                                  ? 'bg-amber-500'
                                  : 'bg-blue-600'
                              }`}
                              style={{ width: `${plan.progress}%` }}
                            />
                          </div>
                          <span className="font-mono text-[11px] font-bold text-slate-700">
                            {plan.progress}%
                          </span>
                        </div>
                      </td>

                      {/* Budget */}
                      <td className="px-3 py-3 whitespace-nowrap font-mono text-xs">
                        <div className="font-bold text-slate-900">
                          Rp{(plan.budget / 1e6).toFixed(0)}M
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Used: Rp{(plan.budgetUsed / 1e6).toFixed(0)}M
                        </div>
                      </td>

                      {/* Health */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${getHealthBadge(plan.health)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            plan.health === 'ON TRACK'
                              ? 'bg-emerald-500'
                              : plan.health === 'AT RISK'
                              ? 'bg-amber-500'
                              : 'bg-blue-500'
                          }`} />
                          {plan.health}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-3 py-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPlanId(plan.id);
                          }}
                          className="px-2.5 py-1 rounded text-[11px] font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Execution Panel (Example from Prompt) */}
        <div className="xl:col-span-4 bg-white rounded-xl border border-slate-200 shadow-md p-5 space-y-4 sticky top-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                TELEMETRY INSPECTOR
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                {selectedPlan.recommendationId}
              </h3>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getHealthBadge(selectedPlan.health)}`}>
              {selectedPlan.health}
            </span>
          </div>

          {/* Area & Action Title */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">{selectedPlan.areaName}</span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getObjectiveBadge(selectedPlan.objective)}`}>
                {selectedPlan.objective.replace('_', ' ')}
              </span>
            </div>
            <div className="text-xs text-slate-700 font-medium">
              {selectedPlan.name}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              Owner: {selectedPlan.owner}
            </div>
          </div>

          {/* Core Telemetry Grid (Matches user prompt example exactly!) */}
          <div className="space-y-2.5 pt-1 text-xs">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">STATUS</span>
              <span className="font-bold text-blue-900 font-mono">{selectedPlan.status}</span>
            </div>

            <div className="space-y-1 pb-1.5 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">PROGRESS</span>
                <span className="font-bold text-slate-900 font-mono">{selectedPlan.progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-blue-700 rounded-full"
                  style={{ width: `${selectedPlan.progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">TARGET CUSTOMERS</span>
              <span className="font-bold text-slate-900 font-mono">
                {selectedPlan.targetCustomers.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">CONTACTED</span>
              <span className="font-bold text-slate-900 font-mono">
                {selectedPlan.contacted.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">RESPONDED</span>
              <span className="font-bold text-slate-900 font-mono">
                {selectedPlan.responded.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">RETURNED / CONVERTED</span>
              <span className="font-bold text-emerald-800 font-mono">
                {selectedPlan.returned.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">CURRENT RETURN RATE</span>
              <span className="font-bold text-blue-800 font-mono">
                {selectedPlan.currentReturnRate}%
              </span>
            </div>

            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">TARGET RETURN RATE</span>
              <span className="font-bold text-slate-900 font-mono">
                {selectedPlan.targetReturnRate}%
              </span>
            </div>

            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">BUDGET</span>
              <span className="font-bold text-slate-900 font-mono">
                Rp{(selectedPlan.budget / 1e6).toFixed(0)}M
              </span>
            </div>

            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">BUDGET USED</span>
              <span className="font-bold text-slate-900 font-mono">
                Rp{(selectedPlan.budgetUsed / 1e6).toFixed(0)}M
              </span>
            </div>

            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">EXECUTION HEALTH</span>
              <span className="font-bold text-emerald-700 font-mono">
                {selectedPlan.health}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-500 font-medium">METHOD</span>
              <span className="font-bold text-slate-800 text-[11px]">
                {selectedPlan.measurementMethod}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            {onNavigate && (
              <button
                onClick={() => onNavigate('performance-measurement')}
                className="w-full py-2 px-3 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View Measurement Outcome</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Slide-over Create Action Plan Drawer */}
      <CreateActionPlanDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSaveActionPlan={handleAddNewPlan}
      />
    </div>
  );
};
