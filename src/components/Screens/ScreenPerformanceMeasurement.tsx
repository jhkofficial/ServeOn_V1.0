import React, { useState } from 'react';
import { 
  PerformanceMeasurementItem, 
  BusinessObjective, 
  OutcomeStatusType, 
  MeasurementConfidenceLevel,
  ScreenId
} from '../../types';
import { INITIAL_PERFORMANCE_MEASUREMENTS } from '../../data/executionData';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  HelpCircle,
  Layers,
  ArrowRight,
  Sparkles,
  DollarSign,
  Users,
  Shield,
  Flame,
  UserPlus,
  Network,
  Activity,
  Check
} from 'lucide-react';

interface Props {
  onNavigate?: (screen: ScreenId, areaId?: string) => void;
}

export const ScreenPerformanceMeasurement: React.FC<Props> = ({ onNavigate }) => {
  const [measurements] = useState<PerformanceMeasurementItem[]>(INITIAL_PERFORMANCE_MEASUREMENTS);
  const [selectedId, setSelectedId] = useState<string>('MEAS-202609-001');

  const selectedRecord = measurements.find((m) => m.id === selectedId) || measurements[0];

  const getOutcomeBadge = (status: OutcomeStatusType) => {
    switch (status) {
      case 'POSITIVE OUTCOME':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'NEUTRAL':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'NEGATIVE OUTCOME':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      case 'INSUFFICIENT EVIDENCE':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getObjectiveIcon = (obj: BusinessObjective) => {
    switch (obj) {
      case 'RETENTION':
        return <Shield className="w-4 h-4 text-blue-600" />;
      case 'MARKET_DEFENSE':
        return <Flame className="w-4 h-4 text-amber-600" />;
      case 'ACQUISITION':
        return <UserPlus className="w-4 h-4 text-emerald-600" />;
      case 'EXPANSION':
        return <Network className="w-4 h-4 text-purple-600" />;
      default:
        return <Activity className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider font-mono">
              SCREEN I • OUTCOME EVALUATION
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">RESULT Pillar</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Performance Measurement
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
            Scientifically verify whether SERVEON-driven recommendations generated genuine incremental business outcomes using counterfactual controls.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigate && (
            <button
              onClick={() => onNavigate('business-value')}
              className="px-3.5 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-[0.99]"
            >
              <span>View Business Value</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Selector Strip: Measured Actions */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
          Measured Interventions:
        </span>
        {measurements.map((m) => {
          const isSelected = m.id === selectedId;
          return (
            <button
              key={m.id}
              onClick={() => setSelectedId(m.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border cursor-pointer ${
                isSelected
                  ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {getObjectiveIcon(m.objective)}
              <span>{m.areaName} ({m.objective.replace('_', ' ')})</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                isSelected ? 'bg-blue-800 text-blue-100' : 'bg-slate-100 text-slate-600'
              }`}>
                {m.outcomeStatus === 'POSITIVE OUTCOME' ? 'Positive' : m.outcomeStatus === 'INSUFFICIENT EVIDENCE' ? 'Inconclusive' : 'Neutral'}
              </span>
            </button>
          );
        })}
      </div>

      {/* TOP SUMMARY CARDS FOR CURRENT RECORD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Baseline Card */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Baseline Starting Point
          </span>
          <div className="mt-2 text-xl font-extrabold text-slate-900 font-sans">
            {selectedRecord.baselineValue}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Pre-intervention or matched comparison
          </div>
        </div>

        {/* Actual Observed Card */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Actual Observed Outcome
          </span>
          <div className="mt-2 text-xl font-extrabold text-blue-900 font-sans">
            {selectedRecord.actualValue}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Measured after operational period
          </div>
        </div>

        {/* Incremental Uplift Card */}
        <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 shadow-2xs">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
            Incremental Uplift
          </span>
          <div className="mt-2 text-xl font-extrabold text-emerald-900 font-sans">
            {selectedRecord.incrementalUplift}
          </div>
          <div className="text-[10px] text-emerald-700 mt-1">
            Uplift over counterfactual benchmark
          </div>
        </div>

        {/* Verified Outcome Status */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Outcome Verification
            </span>
            <div className="mt-2">
              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${getOutcomeBadge(selectedRecord.outcomeStatus)}`}>
                {selectedRecord.outcomeStatus}
              </span>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 mt-2 flex items-center gap-1.5">
            <span>Confidence:</span>
            <span className="font-bold text-slate-700">{selectedRecord.confidence}</span>
            <span>•</span>
            <span className="text-blue-700">{selectedRecord.method}</span>
          </div>
        </div>
      </div>

      {/* THREE MAJOR COMPARISON COLUMNS: BASELINE | CONTROL / COMPARISON | ACTUAL */}
      <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-700 font-mono">
                {selectedRecord.recommendationId}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-bold text-slate-900">{selectedRecord.areaName}</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500">{selectedRecord.method}</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
              Comparative Impact Experiment
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Methodology:</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold font-mono">
              {selectedRecord.method}
            </span>
          </div>
        </div>

        {/* 3 Columns Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Column 1: BASELINE */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider font-mono">
                Column 1 • BASELINE
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Historical Run-Rate</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 text-[11px] block">Baseline Metric</span>
                <span className="text-base font-bold text-slate-900">{selectedRecord.baselineValue}</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Prior performance level before SERVEON recommendation intervention. Represents status quo natural trajectory.
              </p>
            </div>
          </div>

          {/* Column 2: CONTROL / COMPARISON */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider font-mono">
                Column 2 • CONTROL / COMPARISON
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Counterfactual</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500 text-[11px] block">Control Rate / Benchmark</span>
                <span className="text-base font-bold text-slate-900">{selectedRecord.controlValue}</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span>Expected Conversions:</span>
                <span className="font-mono font-bold">{selectedRecord.controlConversion.toLocaleString()}</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Parallel control cohort receiving standard BAU (business-as-usual) without SERVEON treatment.
              </p>
            </div>
          </div>

          {/* Column 3: ACTUAL (TREATMENT) */}
          <div className="p-5 rounded-xl bg-blue-50/70 border-2 border-blue-600 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-blue-200">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider font-mono">
                Column 3 • ACTUAL (TREATMENT)
              </span>
              <span className="text-[10px] text-blue-700 font-bold bg-blue-100 px-2 py-0.5 rounded">
                SERVEON Guided
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-blue-700 text-[11px] block">Actual Realized Metric</span>
                <span className="text-base font-extrabold text-blue-950">{selectedRecord.actualValue}</span>
              </div>
              <div className="flex items-center justify-between text-blue-900 font-semibold">
                <span>Treatment Conversions:</span>
                <span className="font-mono font-bold text-blue-950">{selectedRecord.treatmentConversion.toLocaleString()}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-blue-200 space-y-1">
                <div className="flex items-center justify-between text-emerald-800 font-bold">
                  <span>Net Incremental Gain:</span>
                  <span className="font-mono text-sm">+{selectedRecord.incrementalCustomers.toLocaleString()} accounts</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 text-[11px]">
                  <span>Incremental Revenue:</span>
                  <span className="font-mono font-bold text-slate-900">
                    Rp{(selectedRecord.incrementalRevenue / 1e6).toFixed(0)}M
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FINANCIAL ROI ACCORDION */}
        <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider font-mono">
              FINANCIAL ROI VERIFICATION
            </span>
            <div className="text-sm font-semibold text-slate-200 mt-0.5">
              Net Incremental Benefit: <span className="font-bold text-white font-mono">Rp{(selectedRecord.netBenefit / 1e6).toFixed(0)}M</span>
              {' '}• Action Cost: <span className="text-slate-400 font-mono">Rp{(selectedRecord.cost / 1e6).toFixed(0)}M</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Measured ROI</span>
              <span className="text-2xl font-black text-cyan-400 font-mono">
                {selectedRecord.roi > 0 ? `+${selectedRecord.roi.toFixed(1)}%` : '0%'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* OBJECTIVE-SPECIFIC SUCCESS METRICS DETAIL */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
          <Sparkles className="w-4 h-4 text-blue-700" />
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
            Objective-Specific Telemetry: {selectedRecord.objective.replace('_', ' ')}
          </h3>
        </div>

        {/* RETENTION SPECIFIC */}
        {selectedRecord.objective === 'RETENTION' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-500 font-medium block">Incremental Retention</span>
              <div className="text-lg font-bold text-slate-900 mt-1">
                {selectedRecord.incrementalUplift}
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold">Over control baseline</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-500 font-medium block">Churn Reduction</span>
              <div className="text-lg font-bold text-slate-900 mt-1">
                {selectedRecord.objectiveDetails.churnReduction || '-34% Churn Probability'}
              </div>
              <span className="text-[10px] text-slate-500">Statistically validated (p &lt; 0.01)</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-500 font-medium block">High-Value Customer Retention</span>
              <div className="text-lg font-bold text-slate-900 mt-1">
                {selectedRecord.objectiveDetails.highValueRetention || '96.2% Protected'}
              </div>
              <span className="text-[10px] text-slate-500">Tier-1 commercial base</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-500 font-medium block">Incremental Revenue</span>
              <div className="text-lg font-bold text-blue-900 font-mono mt-1">
                Rp{(selectedRecord.incrementalRevenue / 1e6).toFixed(0)}M
              </div>
              <span className="text-[10px] text-blue-700 font-semibold">Net 30-day yield</span>
            </div>
          </div>
        )}

        {/* MARKET SHARE DEFENSE SPECIFIC */}
        {selectedRecord.objective === 'MARKET_DEFENSE' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-500 font-medium block">Customer Retention in Defense Area</span>
              <div className="text-lg font-bold text-slate-900 mt-1">
                {selectedRecord.actualValue}
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold">+5.0 ppt defense effect</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-500 font-medium block">Revenue Protected</span>
              <div className="text-lg font-bold text-blue-900 font-mono mt-1">
                {selectedRecord.objectiveDetails.revenueProtected || 'Rp420M'}
              </div>
              <span className="text-[10px] text-slate-500">Annualized ARPU lock</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-500 font-medium block">Competitive Leakage Reduction</span>
              <div className="text-lg font-bold text-slate-900 mt-1">
                {selectedRecord.objectiveDetails.competitiveLeakageReduction || '-42% Defection'}
              </div>
              <span className="text-[10px] text-slate-500">Corridor counter-promotion</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-500 font-medium block">High Value Tier-A Retention</span>
              <div className="text-lg font-bold text-slate-900 mt-1">
                {selectedRecord.objectiveDetails.highValueCustomerRetention || '94.8%'}
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold">No VIP account lost</span>
            </div>
          </div>
        )}

        {/* NEW CUSTOMER ACQUISITION SPECIFIC (WITH FUNNEL) */}
        {selectedRecord.objective === 'ACQUISITION' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 font-medium block">Customer Acquisition Cost (CAC)</span>
                <div className="text-lg font-bold text-emerald-800 font-mono mt-1">
                  {selectedRecord.objectiveDetails.cac || 'Rp34,500'}
                </div>
                <span className="text-[10px] text-slate-500">Target was &lt; Rp35,000</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 font-medium block">90-Day Retention of New Adds</span>
                <div className="text-lg font-bold text-slate-900 mt-1">
                  {selectedRecord.objectiveDetails.ninetyDayRetention || '76.4%'}
                </div>
                <span className="text-[10px] text-slate-500">Healthy sticky onboarding</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 font-medium block">Incremental Revenue</span>
                <div className="text-lg font-bold text-blue-900 font-mono mt-1">
                  Rp{(selectedRecord.incrementalRevenue / 1e6).toFixed(0)}M
                </div>
                <span className="text-[10px] text-slate-500">+970 incremental accounts</span>
              </div>
            </div>

            {/* Acquisition Funnel Visualization */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block font-mono">
                Acquisition Conversion Funnel Breakdown
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center">
                {selectedRecord.objectiveDetails.funnel?.map((stg: any, i: number) => (
                  <div key={i} className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                    <span className="text-[10px] text-slate-500 font-bold block">{stg.stage}</span>
                    <div className="text-base font-extrabold text-slate-900 font-mono mt-0.5">
                      {stg.count.toLocaleString()}
                    </div>
                    <span className="text-[10px] font-bold text-blue-700">{stg.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* NETWORK EXPANSION SPECIFIC (STAGE 1 FEASIBILITY & STAGE 2 POST INVESTMENT) */}
        {selectedRecord.objective === 'EXPANSION' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* Stage 1: Feasibility Tracking */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-900 font-mono text-[11px]">
                  STAGE 1: FEASIBILITY TRACKING
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Pre-Investment Approved
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Candidate Validated:</span>
                  <span className="font-bold text-emerald-700">Passed (5 Gates)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Site Availability:</span>
                  <span className="font-bold text-slate-800">Approved (5 ODP Locations)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Customer Catchment:</span>
                  <span className="font-bold text-slate-800">24,000 Population</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Capex Estimate:</span>
                  <span className="font-bold font-mono text-slate-900">Rp850M</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Forecast Annual Revenue:</span>
                  <span className="font-bold font-mono text-slate-900">Rp6.0B</span>
                </div>
              </div>
            </div>

            {/* Stage 2: Post-Investment Tracking */}
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-blue-200">
                <span className="font-bold text-blue-900 font-mono text-[11px]">
                  STAGE 2: POST-INVESTMENT PERFORMANCE
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                  Actual Run-Rate
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Actual Annual Revenue:</span>
                  <span className="font-bold font-mono text-blue-900">Rp5.7B (95% Achievement)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Actual Catchment Captured:</span>
                  <span className="font-bold text-slate-800">26,200 Population</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Network Utilization:</span>
                  <span className="font-bold text-slate-800">74.2% Port Occupancy</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Cannibalization Rate:</span>
                  <span className="font-bold text-emerald-700">4.2% (Safe &lt; 10%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Payback Period:</span>
                  <span className="font-bold text-emerald-800 font-mono">14 Months (vs 15 Mo Target)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
