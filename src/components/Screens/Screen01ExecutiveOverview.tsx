import React from 'react';
import { AreaIntelligence, ScreenId, BusinessObjective } from '../../types';
import { KpiCard } from '../Common/KpiCard';
import { StrategicRoleBadge } from '../Common/StrategicRoleBadge';
import { SemarangMap } from '../Map/SemarangMap';
import { EXECUTIVE_KPI_SUMMARY, getTopRankedArea, SEMARANG_AREAS } from '../../data/semarangData';
import { PORTFOLIO_IMPACT_SUMMARY } from '../../data/impactOutcomeData';
import { 
  Users, 
  MapPin, 
  AlertOctagon, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  TrendingUp,
  SlidersHorizontal,
  ChevronRight,
  Shield,
  ShieldAlert,
  UserPlus,
  Network,
  PlayCircle,
  Activity,
  DollarSign,
  RefreshCw,
  Award
} from 'lucide-react';

interface Props {
  areas: AreaIntelligence[];
  selectedAreaId: string;
  onSelectArea: (id: string) => void;
  onNavigate: (screen: ScreenId, areaId?: string) => void;
  onFilterObjective?: (obj: BusinessObjective) => void;
}

export const Screen01ExecutiveOverview: React.FC<Props> = ({
  areas = [],
  selectedAreaId,
  onSelectArea,
  onNavigate,
  onFilterObjective,
}) => {
  const safeAreas = areas && areas.length > 0 ? areas : SEMARANG_AREAS;
  const activeArea = safeAreas.find((a) => a.id === selectedAreaId) || SEMARANG_AREAS.find((a) => a.id === selectedAreaId) || SEMARANG_AREAS[0];

  const topRetention = getTopRankedArea('retention');
  const topDefense = getTopRankedArea('defense');
  const topAcquisition = getTopRankedArea('acquisition');
  const topExpansion = getTopRankedArea('expansion'); // Will be null due to strict eligibility gate

  return (
    <div className="space-y-6">
      {/* Top Banner / Headline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider font-mono">
              Screen 01 • Executive Overview
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">Kota Semarang Pilot Baseline</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            What requires management attention now?
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Synthesizing customer density, competitor promotions, churn propensity, and network readiness across 16 districts into executive-ready strategic roles.
          </p>
        </div>

        <button
          onClick={() => onNavigate('strategic-map')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <span>Explore Strategic Action Map</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Row (Block 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Customers"
          value={EXECUTIVE_KPI_SUMMARY.totalCustomers.toLocaleString()}
          subValue="Active Subscribers"
          trend={{ value: '+3.8%', direction: 'up', label: 'YoY Base' }}
          icon={Users}
        />
        <KpiCard
          label="Areas Analyzed"
          value={EXECUTIVE_KPI_SUMMARY.totalAreasAnalyzed}
          subValue="16 Kecamatan in Semarang"
          trend={{ value: '100%', direction: 'neutral', label: 'Coverage' }}
          icon={MapPin}
        />
        <KpiCard
          label="Strategic Priority Areas"
          value={EXECUTIVE_KPI_SUMMARY.strategicPriorityAreas}
          subValue="12 of 16 Active Focus"
          badge={{ text: 'Action Ready', variant: 'blue' }}
          icon={AlertOctagon}
        />
        <KpiCard
          label="Avg Evidence Confidence"
          value={`${EXECUTIVE_KPI_SUMMARY.avgConfidence}%`}
          subValue="V2.1 Algorithm Evidence"
          badge={{ text: 'Validated', variant: 'emerald' }}
          icon={ShieldCheck}
        />
      </div>

      {/* 4 Objective Priority Cards (Block 2) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Objective Priority Highlights
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Same Area → Different Objective → Different Decision
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Retention */}
          <div
            onClick={() => {
              if (topRetention) {
                onSelectArea(topRetention.id);
                onNavigate('retention', topRetention.id);
              }
            }}
            className="rounded-xl border border-blue-200/80 bg-blue-50/30 p-4 hover:bg-blue-50/70 hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between shadow-2xs"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-800">
                  <Shield className="w-3.5 h-3.5 text-blue-600" />
                  RETENTION
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  Priority #1
                </span>
              </div>

              <div className="mt-3">
                <div className="text-xs text-slate-500 font-medium">Top Priority Area</div>
                <div className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {topRetention?.name}
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-600">
                  <span>Score: <strong className="text-slate-900">{topRetention?.objectives.retention.score}</strong></span>
                  <span>•</span>
                  <span>Confidence: <strong className="text-blue-700">{topRetention?.confidenceScore}%</strong></span>
                </div>
              </div>

              <p className="mt-2 text-xs text-slate-600 line-clamp-2">
                High customer density facing competitor discount campaigns; retain VIP accounts before churn accelerates.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-blue-100 flex items-center justify-between text-xs font-semibold text-blue-700">
              <span>View Retention Plan</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. Market Defense */}
          <div
            onClick={() => {
              if (topDefense) {
                onSelectArea(topDefense.id);
                onNavigate('market-defense', topDefense.id);
              }
            }}
            className="rounded-xl border border-amber-200/80 bg-amber-50/30 p-4 hover:bg-amber-50/70 hover:border-amber-300 transition-all cursor-pointer group flex flex-col justify-between shadow-2xs"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  DEFENSE
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  Priority #1
                </span>
              </div>

              <div className="mt-3">
                <div className="text-xs text-slate-500 font-medium">Top Priority Area</div>
                <div className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                  {topDefense?.name}
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-600">
                  <span>Score: <strong className="text-slate-900">{topDefense?.objectives.defense.score}</strong></span>
                  <span>•</span>
                  <span>Confidence: <strong className="text-amber-700">{topDefense?.confidenceScore}%</strong></span>
                </div>
              </div>

              <p className="mt-2 text-xs text-slate-600 line-clamp-2">
                Heavy B2B commercial corridor under heavy competitor fiber price pressure; defensive counter-offer recommended.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between text-xs font-semibold text-amber-700">
              <span>View Defense Strategy</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3. Acquisition */}
          <div
            onClick={() => {
              if (topAcquisition) {
                onSelectArea(topAcquisition.id);
                onNavigate('acquisition', topAcquisition.id);
              }
            }}
            className="rounded-xl border border-emerald-200/80 bg-emerald-50/30 p-4 hover:bg-emerald-50/70 hover:border-emerald-300 transition-all cursor-pointer group flex flex-col justify-between shadow-2xs"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
                  ACQUISITION
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Priority #1
                </span>
              </div>

              <div className="mt-3">
                <div className="text-xs text-slate-500 font-medium">Top Priority Area</div>
                <div className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {topAcquisition?.name}
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-600">
                  <span>Score: <strong className="text-slate-900">{topAcquisition?.objectives.acquisition.score}</strong></span>
                  <span>•</span>
                  <span>Confidence: <strong className="text-emerald-700">{topAcquisition?.confidenceScore}%</strong></span>
                </div>
              </div>

              <p className="mt-2 text-xs text-slate-600 line-clamp-2">
                High housing growth with 65k unserved homes and existing ODP capacity. Demand testing recommended.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
              <span>View Acquisition Demand</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 4. Network Expansion (Explicit NO QUALIFIED CANDIDATE State) */}
          <div
            onClick={() => onNavigate('network-expansion')}
            className="rounded-xl border border-purple-200/80 bg-purple-50/30 p-4 hover:bg-purple-50/70 hover:border-purple-300 transition-all cursor-pointer group flex flex-col justify-between shadow-2xs"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-800">
                  <Network className="w-3.5 h-3.5 text-purple-600" />
                  EXPANSION
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700 border border-rose-200">
                  Gate Enforced
                </span>
              </div>

              <div className="mt-3">
                <div className="text-xs text-slate-500 font-medium">Expansion Candidate Status</div>
                <div className="text-base font-bold text-rose-700 flex items-center gap-1.5 mt-0.5">
                  <AlertOctagon className="w-4 h-4 shrink-0" />
                  <span>No Qualified Candidate</span>
                </div>
                <div className="mt-1 text-xs text-slate-600">
                  <span>Criteria: <strong className="text-slate-900">0 of 16 passed</strong></span>
                </div>
              </div>

              <p className="mt-2 text-xs text-slate-600 line-clamp-2">
                No district satisfies the 5-point eligibility gate. SERVEON recommends preserving capex and continuing monitoring.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-purple-100 flex items-center justify-between text-xs font-semibold text-purple-700">
              <span>Inspect Gate Criteria</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* CLOSED-LOOP SERVEON BUSINESS IMPACT SECTION (Requested in Prompt) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider font-mono">
                CLOSED-LOOP DECISION INTELLIGENCE
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-bold text-slate-900">SERVEON Business Impact</span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight mt-0.5">
              Quantified Operational Execution &amp; Commercial Returns
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('business-value')}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <DollarSign className="w-3.5 h-3.5 text-blue-700" />
              <span>Full Value Breakdown</span>
            </button>
            <button
              onClick={() => onNavigate('action-execution')}
              className="px-3.5 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold uppercase tracking-wider shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>Track Executions</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Impact Cards from Prompt */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div
            onClick={() => onNavigate('action-execution')}
            className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-all cursor-pointer group"
          >
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Active Actions
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1 font-mono group-hover:text-blue-700 transition-colors">
              14
            </div>
            <span className="text-[10px] text-blue-700 font-semibold flex items-center gap-1 mt-0.5">
              <span>Underway in Field</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>

          <div
            onClick={() => onNavigate('performance-measurement')}
            className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-all cursor-pointer group"
          >
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Measured Outcomes
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1 font-mono group-hover:text-blue-700 transition-colors">
              16
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
              <span>Counterfactual Verified</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>

          <div
            onClick={() => onNavigate('business-value')}
            className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200 hover:border-emerald-300 transition-all cursor-pointer group"
          >
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
              Positive Outcome Rate
            </span>
            <div className="text-2xl font-black text-emerald-900 mt-1 font-mono">
              75%
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
              <span>12 of 16 Positive Uplift</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>

          <div
            onClick={() => onNavigate('business-value')}
            className="p-3.5 rounded-xl bg-blue-900 text-white hover:bg-blue-800 transition-all cursor-pointer group shadow-2xs"
          >
            <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider block font-mono">
              Incremental Business Value
            </span>
            <div className="text-2xl font-black text-white mt-1 font-mono">
              Rp2.4B
            </div>
            <span className="text-[10px] text-cyan-200 font-semibold flex items-center gap-1 mt-0.5">
              <span>+205.7% Verified Net ROI</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>

        {/* FROM INTELLIGENCE TO IMPACT Visual Journey */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
              FROM INTELLIGENCE TO IMPACT: COMPLETE CLOSED LOOP
            </span>
            <span className="text-[10px] text-slate-400">Click any pillar to inspect</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs">
            {[
              { id: 'strategic-map', name: 'SEE', desc: 'Spatial Map', icon: MapPin },
              { id: 'candidate-detail', name: 'UNDERSTAND', desc: 'District Profile', icon: Sparkles },
              { id: 'recommendation', name: 'DECIDE', desc: 'Decision Support', icon: Award },
              { id: 'action-execution', name: 'EXECUTE', desc: 'Field Action Plans', icon: PlayCircle },
              { id: 'performance-measurement', name: 'MEASURE', desc: 'Uplift & Control', icon: Activity },
              { id: 'learning-feedback', name: 'LEARN', desc: 'Model Feedback', icon: RefreshCw },
            ].map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.name}
                  onClick={() => onNavigate(p.id as ScreenId)}
                  className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/80 hover:bg-blue-50 hover:border-blue-300 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[10px] text-blue-700">{p.name}</span>
                    <Icon className="w-3 h-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div className="text-[11px] font-bold text-slate-900 mt-1">{p.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Visual & Executive Insights Grid (Blocks 3 & 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Strategic Action Map Preview (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Strategic Action Map Preview</h3>
              <p className="text-xs text-slate-500">Spatial distribution of 16 kecamatan by decision role</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Semarang Map
              </span>
            </div>
          </div>

          <div className="my-3">
            <SemarangMap
              areas={safeAreas}
              selectedAreaId={selectedAreaId}
              onSelectArea={onSelectArea}
              heightClass="h-72 sm:h-80"
              compact={false}
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>Selected: <strong className="text-slate-900">{activeArea?.name}</strong></span>
            </div>
            <button
              onClick={() => onNavigate('strategic-map')}
              className="font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Open Full Interactive Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Top Management Insights (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-4 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Top Management Insights</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                Business Plain Language
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {EXECUTIVE_KPI_SUMMARY.executiveInsights.map((ins, index) => (
                <div
                  key={ins.id}
                  onClick={() => {
                    onSelectArea(ins.relatedAreaId);
                    if (ins.objective === 'RETENTION') onNavigate('retention', ins.relatedAreaId);
                    else if (ins.objective === 'MARKET_DEFENSE') onNavigate('market-defense', ins.relatedAreaId);
                    else if (ins.objective === 'ACQUISITION') onNavigate('acquisition', ins.relatedAreaId);
                    else onNavigate('network-expansion', ins.relatedAreaId);
                  }}
                  className="p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-slate-50/80 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        ins.objective === 'RETENTION'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : ins.objective === 'MARKET_DEFENSE'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : ins.objective === 'ACQUISITION'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}
                    >
                      {ins.badge}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1.5 group-hover:text-blue-700 transition-colors leading-snug">
                    {ins.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    {ins.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <button
              onClick={() => onNavigate('candidate-detail', selectedAreaId)}
              className="w-full py-2 px-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Inspect Active Focus ({activeArea?.name})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* FROM RECOMMENDATION TO BUSINESS IMPACT (Closed-Loop Evidence Section) */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                CLOSED-LOOP PORTFOLIO EVIDENCE
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-medium">90-Day Post-Intervention Evaluation</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-0.5">
              From Recommendation to Business Impact
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Empirical evidence proving whether SERVEON-recommended actions actually improved customer metrics and bottom-line value.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate('business-value')}
              className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors"
            >
              Portfolio ROI Breakdown
            </button>
            <button
              onClick={() => onNavigate('impact-outcome-map')}
              className="px-3 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Explore Impact &amp; Outcome Map</span>
            </button>
          </div>
        </div>

        {/* 7 Impact KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Active Actions</span>
            <div className="text-xl font-black text-slate-900 mt-1 font-mono">{PORTFOLIO_IMPACT_SUMMARY.activeActions}</div>
            <span className="text-[10px] text-blue-700 font-semibold">12 In Progress</span>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Areas Improved</span>
            <div className="text-xl font-black text-emerald-900 mt-1 font-mono">
              {PORTFOLIO_IMPACT_SUMMARY.areasImproved} / {PORTFOLIO_IMPACT_SUMMARY.areasMeasured}
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold">67% Uplift Rate</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Investment</span>
            <div className="text-xl font-black text-slate-900 mt-1 font-mono">Rp4.8B</div>
            <span className="text-[10px] text-slate-500">Planned: Rp5.2B</span>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Quantified Benefit</span>
            <div className="text-xl font-black text-emerald-900 mt-1 font-mono">Rp7.2B</div>
            <span className="text-[10px] text-emerald-700 font-semibold">Verified Revenue</span>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-300">
            <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block">Net Business Value</span>
            <div className="text-xl font-black text-emerald-950 mt-1 font-mono">Rp2.4B</div>
            <span className="text-[10px] text-emerald-800 font-bold">Benefit - Cost</span>
          </div>

          <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-200">
            <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">Portfolio ROI</span>
            <div className="text-xl font-black text-blue-900 mt-1 font-mono">+{PORTFOLIO_IMPACT_SUMMARY.portfolioRoi}%</div>
            <span className="text-[10px] text-blue-700 font-semibold">Net Yield</span>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Positive Outcome</span>
            <div className="text-xl font-black text-emerald-900 mt-1 font-mono">75%</div>
            <span className="text-[10px] text-emerald-700 font-semibold">9 of 12 Areas</span>
          </div>
        </div>

        {/* Compact Card: BEFORE vs AFTER Macro Performance */}
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Before vs After • Macro Benchmark Across Measured Interventions
            </span>
            <span className="text-[10px] font-mono text-slate-500">Pilot Cohort (12 Districts)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
            <div className="p-3 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Customer Retention</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-sm font-semibold text-slate-400 line-through">72%</span>
                <span className="text-lg font-black text-emerald-800 font-mono">80%</span>
                <span className="text-xs font-bold text-emerald-600 font-mono">(+8 ppt)</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Baseline 72% → Actual 80%</span>
            </div>

            <div className="p-3 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Network Coverage</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-sm font-semibold text-slate-400 line-through">72%</span>
                <span className="text-lg font-black text-purple-900 font-mono">91%</span>
                <span className="text-xs font-bold text-purple-700 font-mono">(+19 ppt)</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Baseline 72% → Actual 91%</span>
            </div>

            <div className="p-3 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">New Customers</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-sm font-semibold text-slate-400 line-through">10,000</span>
                <span className="text-lg font-black text-blue-900 font-mono">10,700</span>
                <span className="text-xs font-bold text-blue-700 font-mono">(+700)</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Baseline 10,000 → Actual 10,700</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
