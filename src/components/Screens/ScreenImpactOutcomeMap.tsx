import React, { useState, useMemo } from 'react';
import { AreaIntelligence, ScreenId, BusinessObjective, ImpactOutcomeCategory } from '../../types';
import { SEMARANG_AREAS } from '../../data/semarangData';
import {
  PORTFOLIO_IMPACT_SUMMARY,
  AREA_IMPACT_RECORDS,
  getAreaImpactDetail,
  OUTCOME_CATEGORY_STYLES,
} from '../../data/impactOutcomeData';
import { TargetVsActualTable } from '../Common/TargetVsActualTable';
import { StrategicRoleBadge } from '../Common/StrategicRoleBadge';
import {
  MapPin,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Shield,
  ShieldAlert,
  UserPlus,
  Network,
  ArrowRight,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Clock,
  ArrowUpRight,
  Sliders,
  Columns,
  Minus,
  Info,
  Award,
  Layers,
  Check,
  Maximize2,
  Calendar,
  Filter,
  BarChart3,
  Flame,
  Zap,
} from 'lucide-react';

export type MapViewSelection = 'OPPORTUNITY' | 'EXECUTION' | 'BEFORE' | 'AFTER' | 'IMPACT_CHANGE';
export type ComparisonPresentationMode = 'SIDE_BY_SIDE' | 'INTERACTIVE_SLIDER';

interface Props {
  areas?: AreaIntelligence[];
  selectedAreaId: string;
  onSelectArea: (areaId: string) => void;
  onNavigate: (screen: ScreenId, areaId?: string) => void;
}

export const ScreenImpactOutcomeMap: React.FC<Props> = ({
  areas = [],
  selectedAreaId,
  onSelectArea,
  onNavigate,
}) => {
  const safeAreas = areas && areas.length > 0 ? areas : SEMARANG_AREAS;

  // Filter States
  const [selectedObjective, setSelectedObjective] = useState<BusinessObjective>('ALL');
  const [selectedOutcomeFilter, setSelectedOutcomeFilter] = useState<string>('ALL');
  const [selectedRecFilter, setSelectedRecFilter] = useState<string>('ALL');
  const [viewSelection, setViewSelection] = useState<MapViewSelection>('IMPACT_CHANGE');
  const [presentationMode, setPresentationMode] = useState<ComparisonPresentationMode>('SIDE_BY_SIDE');
  const [comparisonSlider, setComparisonSlider] = useState<number>(100); // 0 = 100% Before, 100 = 100% After
  const [activeTab, setActiveTab] = useState<'PANEL_SUMMARY' | 'TARGET_ACTUAL' | 'INCREMENTAL' | 'TIMELINE' | 'TREND'>('PANEL_SUMMARY');

  // Active Area Impact Record
  const activeImpact = useMemo(() => {
    return getAreaImpactDetail(selectedAreaId);
  }, [selectedAreaId]);

  // List of all 12 measured area keys
  const measuredAreaKeys = Object.keys(AREA_IMPACT_RECORDS);

  // Filtered areas
  const filteredAreaKeys = useMemo(() => {
    return measuredAreaKeys.filter((key) => {
      const rec = AREA_IMPACT_RECORDS[key];
      if (!rec) return false;
      if (selectedObjective !== 'ALL' && rec.objective !== selectedObjective) return false;
      if (selectedOutcomeFilter !== 'ALL' && rec.outcomeStatus !== selectedOutcomeFilter) return false;
      if (selectedRecFilter !== 'ALL' && rec.recommendationId !== selectedRecFilter) return false;
      return true;
    });
  }, [measuredAreaKeys, selectedObjective, selectedOutcomeFilter, selectedRecFilter]);

  // Quick helper for district color
  const getAreaOutcomeStyle = (areaId: string) => {
    const record = AREA_IMPACT_RECORDS[areaId];
    if (!record) {
      return {
        fill: '#f1f5f9',
        border: '#cbd5e1',
        text: '#64748b',
        label: 'Unmeasured',
        status: 'NO MATERIAL CHANGE' as ImpactOutcomeCategory,
      };
    }
    const style = OUTCOME_CATEGORY_STYLES[record.outcomeStatus];
    return {
      fill: style.fillHex,
      border: style.border,
      text: style.text,
      label: style.label,
      status: record.outcomeStatus,
    };
  };

  const summary = PORTFOLIO_IMPACT_SUMMARY;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Dual Signature Maps Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider font-mono">
              SERVEON RESULT PILLAR • IMPACT &amp; OUTCOME INTELLIGENCE
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Closed-Loop Evidence Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Impact &amp; Outcome Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
            Visualize how SERVEON-supported actions changed business performance across geographic areas.
            Answers the executive question: <strong className="text-slate-800">"After executing a SERVEON recommendation, did the area actually become better?"</strong>
          </p>
        </div>

        {/* Dual Signature Maps Switcher */}
        <div className="flex items-center p-1.5 rounded-xl bg-slate-100 border border-slate-200 shrink-0 self-start md:self-auto">
          <button
            onClick={() => onNavigate('strategic-map')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-all flex items-center gap-1.5"
            title="Strategic Action Map: WHAT SHOULD WE DO?"
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>1. Strategic Map</span>
            <span className="text-[10px] text-slate-400 font-mono hidden lg:inline">(What to do)</span>
          </button>
          <div className="px-3 py-1.5 rounded-lg text-xs font-bold text-blue-900 bg-white shadow-xs border border-slate-200 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span>2. Impact &amp; Outcome Map</span>
            <span className="text-[10px] text-emerald-700 font-mono hidden lg:inline">(Did it work?)</span>
          </div>
        </div>
      </div>

      {/* TOP FILTER BAR (Enterprise Standard SERVEON Pattern) */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Region */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Region
            </label>
            <div className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 font-semibold text-slate-800 flex items-center justify-between">
              <span>Jawa Tengah</span>
              <span className="text-[10px] font-mono text-slate-500">Prov 33</span>
            </div>
          </div>

          {/* Kota */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Kabupaten / Kota
            </label>
            <div className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 font-semibold text-slate-800 flex items-center justify-between">
              <span>Kota Semarang</span>
              <span className="text-[10px] font-mono text-slate-500">16 Dist</span>
            </div>
          </div>

          {/* Business Objective */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Business Objective
            </label>
            <select
              value={selectedObjective}
              onChange={(e) => setSelectedObjective(e.target.value as BusinessObjective)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Objectives (4)</option>
              <option value="RETENTION">Retention (Protect)</option>
              <option value="MARKET_DEFENSE">Market Share Defense (Defend)</option>
              <option value="ACQUISITION">New Customer Acquisition (Acquire)</option>
              <option value="EXPANSION">Network Expansion (Expand)</option>
            </select>
          </div>

          {/* Recommendation */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Recommendation
            </label>
            <select
              value={selectedRecFilter}
              onChange={(e) => setSelectedRecFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 truncate"
            >
              <option value="ALL">All Recommendations (7)</option>
              <option value="REC-RET-202609-001">REC-RET-001 (Semarang Selatan)</option>
              <option value="REC-DEF-202609-002">REC-DEF-002 (Semarang Barat)</option>
              <option value="REC-ACQ-202609-003">REC-ACQ-003 (Pedurungan)</option>
              <option value="REC-EXP-202608-004">REC-EXP-004 (Ngaliyan)</option>
              <option value="REC-RET-202607-005">REC-RET-005 (Banyumanik)</option>
              <option value="REC-DEF-202606-007">REC-DEF-007 (Semarang Utara)</option>
              <option value="REC-ACQ-202607-008">REC-ACQ-008 (Tembalang)</option>
            </select>
          </div>

          {/* Execution Period */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Execution Period
            </label>
            <div className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 font-semibold text-slate-800 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Sep 2026 → Dec 2026
              </span>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                90-Day
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* PORTFOLIO IMPACT SUMMARY ROW (Management Headline Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Areas Measured */}
        <div
          onClick={() => setSelectedOutcomeFilter('ALL')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            selectedOutcomeFilter === 'ALL'
              ? 'bg-blue-50/50 border-blue-400 ring-2 ring-blue-500/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Areas Measured
          </span>
          <div className="text-2xl font-black text-slate-900 mt-0.5 font-mono">
            {summary.areasMeasured}
          </div>
          <span className="text-[10px] text-slate-500">12 of 16 Districts</span>
        </div>

        {/* Areas Improved */}
        <div
          onClick={() => setSelectedOutcomeFilter('POSITIVE OUTCOME')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            selectedOutcomeFilter === 'POSITIVE OUTCOME'
              ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
              Areas Improved
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-900 mt-0.5 font-mono">
            {summary.areasImproved}
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold">Positive Outcome</span>
        </div>

        {/* Partial Improvement */}
        <div
          onClick={() => setSelectedOutcomeFilter('PARTIAL IMPROVEMENT')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            selectedOutcomeFilter === 'PARTIAL IMPROVEMENT'
              ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-500/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-sky-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider block">
              Partial
            </span>
            <span className="w-2 h-2 rounded-full bg-sky-600" />
          </div>
          <div className="text-2xl font-black text-sky-900 mt-0.5 font-mono">
            {summary.partialImprovement}
          </div>
          <span className="text-[10px] text-sky-700 font-semibold">Moderate Uplift</span>
        </div>

        {/* Areas No Change */}
        <div
          onClick={() => setSelectedOutcomeFilter('NO MATERIAL CHANGE')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            selectedOutcomeFilter === 'NO MATERIAL CHANGE'
              ? 'bg-slate-100 border-slate-400 ring-2 ring-slate-500/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
              No Material Change
            </span>
            <span className="w-2 h-2 rounded-full bg-slate-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-0.5 font-mono">
            {summary.noMaterialChange}
          </div>
          <span className="text-[10px] text-slate-500">Break-Even / Stable</span>
        </div>

        {/* Areas Declined */}
        <div
          onClick={() => setSelectedOutcomeFilter('NEGATIVE OUTCOME')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            selectedOutcomeFilter === 'NEGATIVE OUTCOME'
              ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-500/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">
              Declined
            </span>
            <span className="w-2 h-2 rounded-full bg-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-900 mt-0.5 font-mono">
            {summary.areasDeclined}
          </div>
          <span className="text-[10px] text-rose-700 font-semibold">Genuk (Rob Flood)</span>
        </div>

        {/* Measurement Pending / Insufficient Evidence */}
        <div
          onClick={() => setSelectedOutcomeFilter('INSUFFICIENT EVIDENCE')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            selectedOutcomeFilter === 'INSUFFICIENT EVIDENCE'
              ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-500/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
              Insufficient Evidence
            </span>
            <span className="w-2 h-2 rounded-full bg-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-900 mt-0.5 font-mono">
            {summary.insufficientEvidence}
          </div>
          <span className="text-[10px] text-amber-700 font-semibold">35% Field Coverage</span>
        </div>
      </div>

      {/* MAP VIEW SELECTOR & PRESENTATION MODE TOOLBAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
        {/* Left: 5 View Controls */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-1">
            Map Layer:
          </span>
          {(['OPPORTUNITY', 'EXECUTION', 'BEFORE', 'AFTER', 'IMPACT_CHANGE'] as MapViewSelection[]).map((mode) => {
            const isActive = viewSelection === mode;
            const labels: Record<MapViewSelection, string> = {
              OPPORTUNITY: 'Opportunity',
              EXECUTION: 'Execution',
              BEFORE: 'Before Condition',
              AFTER: 'After Condition',
              IMPACT_CHANGE: 'Impact / Change',
            };
            return (
              <button
                key={mode}
                onClick={() => setViewSelection(mode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {labels[mode]}
              </button>
            );
          })}
        </div>

        {/* Right: Presentation Mode (Side by Side vs Slider) */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Comparison Mode:
          </span>
          <div className="inline-flex rounded-lg bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setPresentationMode('SIDE_BY_SIDE')}
              className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                presentationMode === 'SIDE_BY_SIDE'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Columns className="w-3.5 h-3.5 text-blue-600" />
              <span>Side by Side</span>
            </button>
            <button
              onClick={() => setPresentationMode('INTERACTIVE_SLIDER')}
              className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                presentationMode === 'INTERACTIVE_SLIDER'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-600" />
              <span>Interactive Slider</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAP CANVAS CONTAINER & SIDE-BY-SIDE / SLIDER VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* MAP SECTION (7 or 8 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-4">
          {/* Map Header & Legend */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Geographic Impact Distribution • Kota Semarang</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Click any district to inspect Before/Target/After metrics and counterfactual evaluation.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#059669]" />
                <span>Positive</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#0284c7]" />
                <span>Partial</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#64748b]" />
                <span>No Change</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#e11d48]" />
                <span>Declined</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#d97706]" />
                <span>Pending</span>
              </span>
            </div>
          </div>

          {/* MODE 1: SIDE BY SIDE */}
          {presentationMode === 'SIDE_BY_SIDE' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* LEFT MAP: BEFORE CONDITION */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      BEFORE CONDITION (Sep 2026)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                    Pre-Execution
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 leading-snug">
                  Baseline customer churn vulnerability, network coverage gaps, and competitive leakage before action.
                </p>

                {/* District Tiles (Before State) */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {measuredAreaKeys.slice(0, 8).map((areaId) => {
                    const record = AREA_IMPACT_RECORDS[areaId];
                    const isSelected = selectedAreaId === areaId;
                    return (
                      <div
                        key={`before-${areaId}`}
                        onClick={() => onSelectArea(areaId)}
                        className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-white ring-2 ring-blue-500/20 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{record.areaName}</span>
                          <span className="text-[9px] font-mono text-slate-500">{record.areaCode}</span>
                        </div>
                        <div className="mt-1.5 flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">Condition:</span>
                          <span className="font-bold text-rose-700 bg-rose-50 px-1 rounded text-[10px]">
                            {record.beforeCondition}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                          <span>Pre-Metric:</span>
                          <span className="font-bold text-slate-700">{record.treatmentBefore} {record.incrementalUnit}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT MAP: AFTER CONDITION */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/20 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      AFTER CONDITION (Dec 2026)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    Observed Impact
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 leading-snug">
                  Condition after SERVEON action execution: insulated VIPs, captured market share, and commissioned fiber.
                </p>

                {/* District Tiles (After State) */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {measuredAreaKeys.slice(0, 8).map((areaId) => {
                    const record = AREA_IMPACT_RECORDS[areaId];
                    const isSelected = selectedAreaId === areaId;
                    const style = OUTCOME_CATEGORY_STYLES[record.outcomeStatus];

                    return (
                      <div
                        key={`after-${areaId}`}
                        onClick={() => onSelectArea(areaId)}
                        className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'border-emerald-600 bg-white ring-2 ring-emerald-500/20 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-emerald-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{record.areaName}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${style.pillBg}`}>
                            {record.trend}
                          </span>
                        </div>
                        <div className="mt-1.5 flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">Post-Condition:</span>
                          <span className="font-bold text-emerald-800 bg-emerald-50 px-1 rounded text-[10px]">
                            {record.afterCondition}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center justify-between text-[10px] font-mono">
                          <span className="text-slate-500">Observed:</span>
                          <span className="font-bold text-emerald-700">{record.treatmentAfter} {record.incrementalUnit} ({record.treatmentChange > 0 ? `+${record.treatmentChange}` : record.treatmentChange})</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* MODE 2: INTERACTIVE COMPARISON SLIDER */}
          {presentationMode === 'INTERACTIVE_SLIDER' && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                    Interactive Before / After Temporal Slider
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Slide to transition from August 2026 Baseline condition to December 2026 Observed Outcome.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${comparisonSlider < 50 ? 'bg-slate-200 text-slate-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    {comparisonSlider < 50 ? 'Showing: BEFORE ACTION (0-49%)' : 'Showing: OBSERVED IMPACT (50-100%)'}
                  </span>
                </div>
              </div>

              {/* Slider bar */}
              <div className="space-y-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={comparisonSlider}
                  onChange={(e) => setComparisonSlider(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-700"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>0% (Aug 2026 Baseline)</span>
                  <span>50% (Mid Execution)</span>
                  <span>100% (Dec 2026 Measured Outcome)</span>
                </div>
              </div>

              {/* Reactive District Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                {measuredAreaKeys.map((areaId) => {
                  const record = AREA_IMPACT_RECORDS[areaId];
                  const isSelected = selectedAreaId === areaId;
                  const isBeforeMode = comparisonSlider < 50;
                  const style = OUTCOME_CATEGORY_STYLES[record.outcomeStatus];

                  return (
                    <div
                      key={`slider-${areaId}`}
                      onClick={() => onSelectArea(areaId)}
                      className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-white ring-2 ring-blue-500/20 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900 truncate">{record.areaName}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {isBeforeMode ? 'Pre: ' + record.beforeCondition : 'Post: ' + record.afterCondition}
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[10px] font-mono">
                        <span className="text-slate-400">Score:</span>
                        <span className={`font-bold ${isBeforeMode ? 'text-slate-700' : 'text-emerald-700'}`}>
                          {isBeforeMode ? `${record.treatmentBefore} ${record.incrementalUnit}` : `${record.treatmentAfter} ${record.incrementalUnit}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Area Selector Strip */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <span className="font-semibold text-slate-800">Selected Area:</span>
              <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {activeImpact.areaName} ({activeImpact.areaCode})
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600">{activeImpact.actionName}</span>
            </div>

            <button
              onClick={() => onNavigate('candidate-detail', activeImpact.areaId)}
              className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Inspect Candidate Profile</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* SELECTED AREA DETAILED IMPACT PANEL (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Area Profile Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-4">
            {/* Header: Area, ID, Role, Status */}
            <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                    {activeImpact.recommendationId}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {activeImpact.objective.replace('_', ' ')}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
                  {activeImpact.areaName}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Action: <strong className="text-slate-800">{activeImpact.actionName}</strong>
                </p>
              </div>

              <div className="text-right shrink-0">
                <StrategicRoleBadge role={activeImpact.strategicRole} size="sm" />
                <div className="mt-1.5">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    {activeImpact.executionStatus} ({activeImpact.executionProgress}%)
                  </span>
                </div>
              </div>
            </div>

            {/* AREA CONDITION & TREND INDICATOR */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Area Condition
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-bold text-slate-700 line-through text-slate-400">
                    {activeImpact.beforeCondition}
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="font-extrabold text-emerald-800">
                    {activeImpact.afterCondition}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Verified Trend
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-black tracking-wider uppercase mt-0.5 ${
                  OUTCOME_CATEGORY_STYLES[activeImpact.outcomeStatus].pillBg
                }`}>
                  <TrendingUp className="w-3 h-3" />
                  {activeImpact.trend}
                </span>
              </div>
            </div>

            {/* BEFORE / TARGET / AFTER 3-COLUMN DISPLAY */}
            <div>
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1">
                  <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                  Before / Target / After
                </span>
                <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  Target Achievement: {activeImpact.targetAchievementPct}%
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                {/* BEFORE */}
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Before
                  </span>
                  <div className="text-lg font-black text-slate-700 font-mono mt-0.5">
                    {activeImpact.treatmentBefore}%
                  </div>
                  <span className="text-[10px] text-slate-400">Baseline</span>
                </div>

                {/* TARGET */}
                <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-200">
                  <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
                    Target
                  </span>
                  <div className="text-lg font-black text-blue-900 font-mono mt-0.5">
                    78%
                  </div>
                  <span className="text-[10px] text-blue-600 font-semibold">+6 ppt Goal</span>
                </div>

                {/* AFTER */}
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                    After
                  </span>
                  <div className="text-lg font-black text-emerald-900 font-mono mt-0.5">
                    {activeImpact.treatmentAfter}%
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold">ABOVE TARGET</span>
                </div>
              </div>
            </div>

            {/* OBSERVED INCREMENTAL IMPACT COMPONENT */}
            <div className="p-3.5 rounded-xl bg-slate-900 text-white shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Observed Incremental Impact
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Method: {activeImpact.measurementMethod}
                </span>
              </div>

              {/* Visual Formula Concept */}
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-mono space-y-1.5">
                <div className="flex items-center justify-between text-slate-300 text-[11px]">
                  <span>Treatment Area Change ({activeImpact.treatmentBefore}% → {activeImpact.treatmentAfter}%):</span>
                  <strong className="text-emerald-400">+{activeImpact.treatmentChange} ppt</strong>
                </div>
                <div className="flex items-center justify-between text-slate-300 text-[11px]">
                  <span>Control Area Change ({activeImpact.controlBefore}% → {activeImpact.controlAfter}%):</span>
                  <strong className="text-slate-400">+{activeImpact.controlChange} ppt</strong>
                </div>
                <div className="pt-1.5 border-t border-slate-700 flex items-center justify-between text-white font-bold">
                  <span className="text-cyan-300">Incremental Effect (Treatment - Control):</span>
                  <span className="text-sm font-black text-cyan-300">+{activeImpact.incrementalEffect} ppt</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 italic leading-snug">
                Scientific attribution nuance: Measures observed difference over simultaneous control baseline, isolating pure algorithmic recommendation uplift.
              </p>
            </div>

            {/* INVESTMENT & BUSINESS VALUE */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  Investment &amp; Business Value
                </span>
                <span className="text-xs font-mono font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                  ROI: +{activeImpact.roi}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Actual Investment:</span>
                  <span className="font-mono font-bold text-slate-800">
                    Rp{(activeImpact.actualInvestment / 1000000).toFixed(0)}M
                  </span>
                  <span className="text-[9px] text-slate-400 block">Planned: Rp{(activeImpact.plannedInvestment / 1000000).toFixed(0)}M</span>
                </div>
                <div className="p-2 rounded bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Business Benefit:</span>
                  <span className="font-mono font-bold text-emerald-700">
                    Rp{(activeImpact.businessBenefit / 1000000).toFixed(0)}M
                  </span>
                  <span className="text-[9px] text-emerald-600 block">Incremental Revenue</span>
                </div>
              </div>

              <div className="p-2 rounded bg-emerald-50/50 border border-emerald-200 flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-950">Net Business Value:</span>
                <span className="font-mono font-black text-emerald-900 text-sm">
                  Rp{(activeImpact.netBusinessValue / 1000000).toFixed(0)}M
                </span>
              </div>
            </div>

            {/* TAB SELECTOR FOR DEEP DRILLDOWN */}
            <div className="flex rounded-lg bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('PANEL_SUMMARY')}
                className={`flex-1 py-1 rounded transition-colors text-center cursor-pointer ${
                  activeTab === 'PANEL_SUMMARY' ? 'bg-white text-blue-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Summary
              </button>
              <button
                onClick={() => setActiveTab('TARGET_ACTUAL')}
                className={`flex-1 py-1 rounded transition-colors text-center cursor-pointer ${
                  activeTab === 'TARGET_ACTUAL' ? 'bg-white text-blue-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Target vs Actual
              </button>
              <button
                onClick={() => setActiveTab('TIMELINE')}
                className={`flex-1 py-1 rounded transition-colors text-center cursor-pointer ${
                  activeTab === 'TIMELINE' ? 'bg-white text-blue-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Timeline
              </button>
              <button
                onClick={() => setActiveTab('TREND')}
                className={`flex-1 py-1 rounded transition-colors text-center cursor-pointer ${
                  activeTab === 'TREND' ? 'bg-white text-blue-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Trend
              </button>
            </div>

            {/* TAB CONTENT: SUMMARY (4 Dimensions) */}
            {activeTab === 'PANEL_SUMMARY' && (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                    <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">
                      4-Dimension Final Success Evaluation
                    </span>
                    <span className="font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                      {activeImpact.evaluation.finalOutcome}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 block text-[10px]">1. Execution Quality:</span>
                      <strong className="text-slate-900 font-mono">{activeImpact.evaluation.executionQualityPct}% Complete</strong>
                    </div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 block text-[10px]">2. Target Achievement:</span>
                      <strong className="text-blue-700 font-mono">{activeImpact.evaluation.targetAchievementPct}% Achieved</strong>
                    </div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 block text-[10px]">3. Incremental Effect:</span>
                      <strong className="text-emerald-700 font-mono">{activeImpact.evaluation.incrementalImpactSummary}</strong>
                    </div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 block text-[10px]">4. Business Value:</span>
                      <strong className="text-emerald-800 font-mono">+{activeImpact.evaluation.roiPct}% ROI</strong>
                    </div>
                  </div>
                </div>

                {/* Objective-specific detail card */}
                {activeImpact.objectiveSpecific.retention && (
                  <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-200 text-xs space-y-1.5">
                    <div className="font-bold text-blue-900 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-blue-700" />
                      <span>Retention Specific Outcomes</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div>
                        <span className="text-slate-500">Churn Reduction:</span>{' '}
                        <strong className="text-slate-800">{activeImpact.objectiveSpecific.retention.churnReduction}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Customer Return:</span>{' '}
                        <strong className="text-slate-800">{activeImpact.objectiveSpecific.retention.customerReturn}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">High-Value Retention:</span>{' '}
                        <strong className="text-slate-800">{activeImpact.objectiveSpecific.retention.highValueRetention}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Campaign ROI:</span>{' '}
                        <strong className="text-emerald-700">{activeImpact.objectiveSpecific.retention.roi}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {activeImpact.objectiveSpecific.defense && (
                  <div className="p-3 rounded-lg bg-amber-50/50 border border-amber-200 text-xs space-y-1.5">
                    <div className="font-bold text-amber-900 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
                      <span>Defense Specific Outcomes</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div>
                        <span className="text-slate-500">Customer Loss Rate:</span>{' '}
                        <strong className="text-slate-800">{activeImpact.objectiveSpecific.defense.afterLossRate} ({activeImpact.objectiveSpecific.defense.changeLossRate})</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Revenue Protected:</span>{' '}
                        <strong className="text-amber-900">{activeImpact.objectiveSpecific.defense.revenueProtected}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Competitive Leakage:</span>{' '}
                        <strong className="text-slate-800">{activeImpact.objectiveSpecific.defense.competitiveLeakage}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Tier-1 Retention:</span>{' '}
                        <strong className="text-slate-800">{activeImpact.objectiveSpecific.defense.highValueRetention}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {activeImpact.objectiveSpecific.acquisition && (
                  <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200 text-xs space-y-2">
                    <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <UserPlus className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Acquisition Funnel &amp; CAC</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1 text-center font-mono text-[10px] pt-1">
                      {activeImpact.objectiveSpecific.acquisition.funnel.map((fnl, idx) => (
                        <div key={idx} className="p-1.5 rounded bg-white border border-emerald-100">
                          <span className="text-[9px] text-slate-500 block truncate">{fnl.stage}</span>
                          <strong className="text-emerald-900 block mt-0.5">{fnl.count.toLocaleString()}</strong>
                          <span className="text-[9px] text-emerald-600">{fnl.pct}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-[11px] pt-1 border-t border-emerald-200/60">
                      <span>CAC: <strong className="text-slate-900">{activeImpact.objectiveSpecific.acquisition.cac}</strong></span>
                      <span>90-Day Retention: <strong className="text-emerald-700">{activeImpact.objectiveSpecific.acquisition.ninetyDayRetention}</strong></span>
                    </div>
                  </div>
                )}

                {activeImpact.objectiveSpecific.expansion && (
                  <div className="p-3 rounded-lg bg-purple-50/50 border border-purple-200 text-xs space-y-1.5">
                    <div className="font-bold text-purple-900 flex items-center gap-1.5">
                      <Network className="w-3.5 h-3.5 text-purple-700" />
                      <span>Network Coverage Expansion Metrics</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div>
                        <span className="text-slate-500">Network Coverage:</span>{' '}
                        <strong className="text-purple-900">{activeImpact.objectiveSpecific.expansion.networkCoverageAfter} ({activeImpact.objectiveSpecific.expansion.coverageImprovement})</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Customer Distance:</span>{' '}
                        <strong className="text-slate-800">{activeImpact.objectiveSpecific.expansion.customerDistanceAfter} ({activeImpact.objectiveSpecific.expansion.distanceImprovement})</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Port Utilization:</span>{' '}
                        <strong className="text-slate-800">{activeImpact.objectiveSpecific.expansion.utilization}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Payback Period:</span>{' '}
                        <strong className="text-emerald-700 font-mono">{activeImpact.objectiveSpecific.expansion.paybackPeriod}</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: TARGET VS ACTUAL TABLE */}
            {activeTab === 'TARGET_ACTUAL' && (
              <TargetVsActualTable
                rows={activeImpact.targetVsActualRows}
                title={`${activeImpact.areaName} Target vs Actual`}
                subtitle="Baseline captured prior to intervention vs modeled targets and verified actuals"
              />
            )}

            {/* TAB CONTENT: TIMELINE */}
            {activeTab === 'TIMELINE' && (
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    Area Decision &amp; Impact Timeline
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Chronological</span>
                </div>

                <div className="relative pl-4 space-y-3 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {activeImpact.timeline.map((evt, idx) => (
                    <div key={idx} className="relative text-xs">
                      <div className="absolute -left-4 top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-white" />
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-slate-900">{evt.title}</span>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">{evt.date}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">{evt.description}</p>
                      {evt.badge && (
                        <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                          {evt.badge}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: MONTHLY TREND */}
            {activeTab === 'TREND' && (
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    Historical Progression Trend
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Sep–Dec 2026</span>
                </div>

                <div className="space-y-2 pt-1">
                  {activeImpact.monthlyTrend.map((mth, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900 block">{mth.month}</span>
                        <span className="text-[10px] text-slate-500">{mth.label}</span>
                      </div>
                      <div className="text-right font-mono">
                        <div className="font-bold text-emerald-700">Treatment: {mth.value}%</div>
                        {mth.controlValue !== undefined && (
                          <div className="text-[10px] text-slate-400">Control: {mth.controlValue}%</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 italic text-center">
                  Confirms sustained performance gain across consecutive quarterly cycles.
                </p>
              </div>
            )}

            {/* ACTION HAND-OFF CTA */}
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => onNavigate('performance-measurement', activeImpact.areaId)}
                className="flex-1 py-2 px-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>View Full Counterfactual</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('business-value')}
                className="flex-1 py-2 px-3 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1 shadow-xs cursor-pointer"
              >
                <span>Portfolio ROI</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
