import React from 'react';
import { AreaIntelligence, ScreenId, BusinessObjective } from '../../types';
import { KpiCard } from '../Common/KpiCard';
import { StrategicRoleBadge } from '../Common/StrategicRoleBadge';
import { SemarangMap } from '../Map/SemarangMap';
import { EXECUTIVE_KPI_SUMMARY, getTopRankedArea, SEMARANG_AREAS } from '../../data/semarangData';
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
  Network
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
    </div>
  );
};
