import React, { useState } from 'react';
import { AreaIntelligence, ScreenId } from '../../types';
import { SEMARANG_AREAS } from '../../data/semarangData';
import { HISTORICAL_OUTCOMES } from '../../data/executionData';
import { StrategicRoleBadge } from '../Common/StrategicRoleBadge';
import { ConfidenceIndicator } from '../Common/ConfidenceIndicator';
import { ScoreBar } from '../Common/ScoreBar';
import { 
  Building, 
  Users, 
  DollarSign, 
  MapPin, 
  ArrowRight, 
  HelpCircle, 
  Award, 
  ShieldCheck, 
  Sparkles,
  ChevronRight,
  BarChart3,
  Flame,
  UserPlus,
  Network,
  Shield,
  History,
  Activity,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface Props {
  areas: AreaIntelligence[];
  selectedAreaId: string;
  onSelectArea: (id: string) => void;
  onNavigate: (screen: ScreenId, areaId?: string) => void;
}

export const Screen07CandidateDetail: React.FC<Props> = ({
  areas = [],
  selectedAreaId,
  onSelectArea,
  onNavigate,
}) => {
  const safeAreas = areas && areas.length > 0 ? areas : SEMARANG_AREAS;
  const area = safeAreas.find((a) => a.id === selectedAreaId) || SEMARANG_AREAS.find((a) => a.id === selectedAreaId) || SEMARANG_AREAS[0];

  return (
    <div className="space-y-6">
      {/* Header Banner (Block 1) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider font-mono">
                Screen 07 • Candidate Detail Profile
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-mono text-slate-500">{area.code}</span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {area.name}
              </h1>
              <StrategicRoleBadge role={area.strategicRole} size="lg" />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {area.city}, {area.region} • Strategic Archetype Drilldown
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('explainability', area.id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>Explain This Result</span>
            </button>
            <button
              onClick={() => onNavigate('recommendation', area.id)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Award className="w-4 h-4" />
              <span>View Recommendation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Area Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Active Customers</span>
            <div className="text-base font-bold text-slate-900 mt-0.5">{area.customerCount.toLocaleString()}</div>
            <div className="text-[10px] text-emerald-700 font-medium">+{area.customerGrowthRate}% YoY Growth</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Average ARPU</span>
            <div className="text-base font-bold text-slate-900 mt-0.5">IDR {area.arpu}k</div>
            <div className="text-[10px] text-slate-500 font-medium">Monthly Recurring Yield</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Addressable Market</span>
            <div className="text-base font-bold text-slate-900 mt-0.5">{area.totalAddressableMarket.toLocaleString()}</div>
            <div className="text-[10px] text-slate-500 font-medium">Penetration: {area.penetrationRate}%</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">At-Risk Churn</span>
            <div className="text-base font-bold text-rose-700 mt-0.5">{area.churnRiskCount.toLocaleString()}</div>
            <div className="text-[10px] text-rose-600 font-medium">{area.churnRiskPercent}% of Base</div>
          </div>
        </div>
      </div>

      {/* Four Objective Profile (Block 2) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Objective Performance Profile (Same Area → Different Objective → Different Decision)
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            SERVEON Multi-Criteria Model V2.1
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Retention Objective Card */}
          <div
            onClick={() => onNavigate('retention', area.id)}
            className="p-4 rounded-xl border border-blue-200 bg-white hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-800 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                Retention
              </span>
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Rank #{area.objectives.retention.rank}
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900">{area.objectives.retention.score}</span>
              <span className="text-xs font-bold text-blue-700">{area.objectives.retention.priority}</span>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Retention opportunity based on customer density, tenure risk, and competitive vulnerability.
            </p>
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-blue-700">
              <span>View Retention Screen</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Defense Objective Card */}
          <div
            onClick={() => onNavigate('market-defense', area.id)}
            className="p-4 rounded-xl border border-amber-200 bg-white hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                Market Defense
              </span>
              <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Rank #{area.objectives.defense.rank}
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900">{area.objectives.defense.score}</span>
              <span className="text-xs font-bold text-amber-700">{area.objectives.defense.priority}</span>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Threat weighting driven by competitor price-cutting and high-value revenue concentration.
            </p>
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-amber-700">
              <span>View Defense Screen</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Acquisition Objective Card */}
          <div
            onClick={() => onNavigate('acquisition', area.id)}
            className="p-4 rounded-xl border border-emerald-200 bg-white hover:border-emerald-400 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
                Acquisition
              </span>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Rank #{area.objectives.acquisition.rank}
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900">{area.objectives.acquisition.score}</span>
              <span className="text-xs font-bold text-emerald-700">{area.objectives.acquisition.priority}</span>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Addressable market expansion and spare port utilization potential before greenfield builds.
            </p>
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-emerald-700">
              <span>View Acquisition Screen</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Expansion Objective Card */}
          <div
            onClick={() => onNavigate('network-expansion', area.id)}
            className="p-4 rounded-xl border border-purple-200 bg-white hover:border-purple-400 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-800 flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5 text-purple-600" />
                Network Expansion
              </span>
              <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                {area.expansionGate.allPassed ? 'Eligible' : 'Not Eligible'}
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-500">
                {area.expansionGate.allPassed ? `${area.objectives.expansion.score}` : 'Blocked'}
              </span>
              <span className="text-xs font-bold text-rose-600">
                {area.expansionGate.failedGates.length} Gate Fails
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {area.expansionGate.allPassed
                ? 'Passed all 5 physical gates.'
                : `Fails: ${area.expansionGate.failedGates[0] || 'Coverage gap'}`}
            </p>
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-purple-700">
              <span>Inspect Gate Details</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Score Profile & Area Story Grid (Blocks 3 & 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Intelligence Score Profile (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Intelligence Score Profile</h3>
              <p className="text-xs text-slate-500">Normalized multi-attribute performance indicators (0–100)</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              Decision Input Factors
            </span>
          </div>

          <div className="space-y-3">
            <ScoreBar label="Customer Density" value={area.customerDensity} color="blue" />
            <ScoreBar label="Retention Opportunity" value={area.retentionOpportunityScore} color="blue" />
            <ScoreBar label="Competition Pressure" value={area.competitionPressureScore} color="amber" />
            <ScoreBar label="Road & Pole Accessibility" value={area.accessibilityScore} color="emerald" />
            <ScoreBar label="Market Potential" value={area.marketPotentialScore} color="emerald" />
            <ScoreBar label="Relative Coverage Gap" value={area.relativeCoverageGapScore} color="purple" />
            <ScoreBar label="Customer Value / Business Contribution" value={area.businessContributionScore} color="blue" />
          </div>
        </div>

        {/* Narrative: Plain Language Area Story (6 Cols) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">District Strategic Narrative</h3>
              </div>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Business Plain Language
              </span>
            </div>

            {/* Story Paragraph */}
            <div className="mt-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-800 text-xs leading-relaxed space-y-2">
              <p className="font-medium">{area.areaStory}</p>
            </div>

            {/* Top Analytical Drivers */}
            <div className="mt-4 space-y-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Primary Decision Drivers
              </span>
              <div className="space-y-1.5">
                {area.topDrivers.map((driver, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-xs">
                    <span className="font-medium text-slate-700">{driver.factor}</span>
                    <span
                      className={`font-semibold text-[11px] font-mono ${
                        driver.positive ? 'text-blue-700' : 'text-slate-500'
                      }`}
                    >
                      {driver.impact}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <ConfidenceIndicator score={area.confidenceScore} components={area.confidenceComponents} />
          </div>
        </div>
      </div>

      {/* HISTORICAL OUTCOMES (PREVIOUS RESULTS) IN THIS AREA (Requested in Prompt) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-blue-700" />
              <h3 className="font-bold text-slate-900 text-sm">
                Historical Execution Outcomes ({area.name})
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Track record of previous algorithmic recommendations, field actions, and counterfactual measurement in this district.
            </p>
          </div>

          <button
            onClick={() => onNavigate('performance-measurement', area.id)}
            className="px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shadow-2xs"
          >
            <Activity className="w-3.5 h-3.5 text-blue-700" />
            <span>Open Performance Measurement</span>
          </button>
        </div>

        {(() => {
          const areaOutcomes = HISTORICAL_OUTCOMES.filter((h) => h.areaId === area.id);
          const outcomesToShow = areaOutcomes.length > 0 ? areaOutcomes : [
            {
              id: `hist-${area.id}`,
              areaId: area.id,
              areaName: area.name,
              actionName: `${area.name} Strategic Operational Program`,
              recommendationId: `REC-${area.code}-202604-01`,
              dateExecuted: '2026-04-10',
              status: 'COMPLETED',
              outcomeStatus: 'POSITIVE OUTCOME' as const,
              metricUpliftSummary: '+5.8% metric improvement vs control',
              incrementalRevenue: 'Rp135,000,000',
              modelValidationStatus: 'VALIDATED' as const,
              evaluatedPeriod: 'Q2 2026',
            }
          ];

          return (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2.5">Date</th>
                    <th className="px-3 py-2.5">Recommendation ID</th>
                    <th className="px-3 py-2.5">Action Plan Name</th>
                    <th className="px-3 py-2.5 text-center">Status</th>
                    <th className="px-3 py-2.5">Outcome</th>
                    <th className="px-3 py-2.5 text-right">Incremental Value</th>
                    <th className="px-3 py-2.5 text-center">Model Validation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {outcomesToShow.map((hist) => (
                    <tr key={hist.id} className="hover:bg-slate-50/80">
                      <td className="px-3 py-3 font-mono text-slate-600 text-[11px] whitespace-nowrap">
                        {hist.dateExecuted}
                      </td>
                      <td className="px-3 py-3 font-mono font-bold text-blue-800 text-[11px] whitespace-nowrap">
                        {hist.recommendationId}
                      </td>
                      <td className="px-3 py-3 font-semibold text-slate-900">
                        {hist.actionName}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {hist.status}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-col">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold w-fit ${
                            hist.outcomeStatus === 'POSITIVE OUTCOME'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : hist.outcomeStatus === 'INCONCLUSIVE'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}>
                            {hist.outcomeStatus}
                          </span>
                          <span className="text-[10px] text-slate-500 mt-0.5 font-mono">
                            {hist.metricUpliftSummary}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right font-mono font-bold text-slate-900">
                        {hist.incrementalRevenue}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          hist.modelValidationStatus === 'VALIDATED'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {hist.modelValidationStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
