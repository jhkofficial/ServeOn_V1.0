import React, { useState } from 'react';
import { ScreenId } from '../../types';
import { BUSINESS_VALUE_SUMMARY } from '../../data/executionData';
import {
  DollarSign,
  TrendingUp,
  Award,
  CheckCircle2,
  PieChart,
  BarChart3,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  Calculator,
  Layers,
  Building,
  Target
} from 'lucide-react';

interface Props {
  onNavigate?: (screen: ScreenId, areaId?: string) => void;
}

export const ScreenBusinessValue: React.FC<Props> = ({ onNavigate }) => {
  const summary = BUSINESS_VALUE_SUMMARY;

  // Interactive ROI Sandbox state
  const [sandboxBenefit, setSandboxBenefit] = useState<number>(150000000);
  const [sandboxCost, setSandboxCost] = useState<number>(50000000);

  const sandboxNetBenefit = sandboxBenefit - sandboxCost;
  const sandboxRoi = sandboxCost > 0 ? (sandboxNetBenefit / sandboxCost) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider font-mono">
              SCREEN J • EXECUTIVE ROI &amp; IMPACT
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">RESULT Pillar</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Business Value
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
            Quantify the aggregate, measurable commercial value generated from SERVEON-supported recommendations and field executions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigate && (
            <>
              <button
                onClick={() => onNavigate('impact-outcome-map')}
                className="px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Impact &amp; Outcome Map</span>
              </button>
              <button
                onClick={() => onNavigate('learning-feedback')}
                className="px-3.5 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-[0.99]"
              >
                <span>Learning &amp; Feedback</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* TOP KPI CARDS: 6 Cards from prompt */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Generated
          </span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
            {summary.recommendationsGenerated}
          </div>
          <span className="text-[10px] text-slate-500">By AI/Model V2.1</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
            Approved
          </span>
          <div className="text-2xl font-extrabold text-blue-900 mt-1 font-mono">
            {summary.recommendationsApproved}
          </div>
          <span className="text-[10px] text-blue-700 font-semibold">{summary.recommendationAcceptanceRate}% Rate</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
            Executed
          </span>
          <div className="text-2xl font-extrabold text-indigo-900 mt-1 font-mono">
            {summary.actionsExecuted}
          </div>
          <span className="text-[10px] text-indigo-700 font-semibold">{summary.recommendationToActionRate}% Conversion</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
            Measured
          </span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
            {summary.measuredOutcomes}
          </div>
          <span className="text-[10px] text-slate-500">With control baseline</span>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200 shadow-2xs">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
            Positive Outcomes
          </span>
          <div className="text-2xl font-extrabold text-emerald-900 mt-1 font-mono">
            {summary.positiveOutcomes}
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold">{summary.positiveOutcomeRate}% Success Rate</span>
        </div>

        <div className="p-3.5 rounded-xl bg-blue-900 text-white shadow-2xs">
          <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider block font-mono">
            Incremental Value
          </span>
          <div className="text-2xl font-black text-white mt-1 font-mono">
            Rp2.4B
          </div>
          <span className="text-[10px] text-cyan-200 font-semibold">+205.7% ROI</span>
        </div>
      </div>

      {/* THREE CORE MANAGEMENT CONVERSION RATIOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Recommendation Acceptance Rate
            </span>
            <span className="text-base font-extrabold text-blue-900 font-mono">
              {summary.recommendationAcceptanceRate}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${summary.recommendationAcceptanceRate}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            {summary.recommendationsApproved} of {summary.recommendationsGenerated} generated recommendations approved by regional business leaders. Demonstrates high trust in algorithmic evidence.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Recommendation-To-Action Rate
            </span>
            <span className="text-base font-extrabold text-indigo-900 font-mono">
              {summary.recommendationToActionRate}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full"
              style={{ width: `${summary.recommendationToActionRate}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            {summary.actionsExecuted} of {summary.recommendationsApproved} approved decisions actively converted into financed field campaigns and operational action plans.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Positive Outcome Rate
            </span>
            <span className="text-base font-extrabold text-emerald-900 font-mono">
              {summary.positiveOutcomeRate}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full"
              style={{ width: `${summary.positiveOutcomeRate}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            {summary.positiveOutcomes} of {summary.measuredOutcomes} evaluated interventions delivered statistically verified positive uplift over counterfactual controls.
          </p>
        </div>
      </div>

      {/* STRATEGIC VALUE TYPES & OBJECTIVE BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Strategic Value Types (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-700" />
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Value Forms &amp; Capital Protection (Total: Rp2.4B)
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Kota Semarang Portfolio</span>
          </div>

          <div className="space-y-3 text-xs">
            {summary.valueTypes.map((vt, i) => (
              <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>{vt.type}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                      {vt.share}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {vt.desc}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-slate-900 font-mono">{vt.amount}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Value by Objective Table */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2 font-mono">
              Contribution by Strategic Objective
            </span>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2">Objective</th>
                  <th className="px-3 py-2 text-right">Value (IDR)</th>
                  <th className="px-3 py-2 text-right">Cost</th>
                  <th className="px-3 py-2 text-right">Net Benefit</th>
                  <th className="px-3 py-2 text-right">ROI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {summary.valueByObjective.map((vo, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-3 py-2 font-semibold text-slate-900">{vo.objective}</td>
                    <td className="px-3 py-2 text-right font-mono font-bold text-blue-900">
                      Rp{(vo.value / 1e6).toFixed(0)}M
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-slate-600">
                      Rp{(vo.cost / 1e6).toFixed(0)}M
                    </td>
                    <td className="px-3 py-2 text-right font-mono font-bold text-emerald-800">
                      Rp{(vo.net / 1e6).toFixed(0)}M
                    </td>
                    <td className="px-3 py-2 text-right font-mono font-bold text-blue-700">
                      +{vo.roi}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ROI Sandbox & Calculation Engine (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
              <Calculator className="w-4 h-4 text-blue-700" />
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                SERVEON ROI Methodology
              </h3>
            </div>

            {/* Formula Block from user specification */}
            <div className="mt-3 p-3.5 rounded-xl bg-slate-900 text-white text-xs font-mono space-y-2">
              <span className="text-[10px] text-cyan-300 uppercase font-bold block">
                Standard ROI Equation:
              </span>
              <div className="text-xs sm:text-sm font-bold text-white bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                ROI = ((Benefit - Cost) / Cost) * 100%
              </div>
              <div className="text-[11px] text-slate-300 leading-snug">
                Verified against counterfactual controls to isolate pure algorithmic incrementality.
              </div>
            </div>

            {/* Interactive Calculator Sandbox */}
            <div className="mt-4 space-y-3 text-xs">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Interactive ROI Sandbox
              </span>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Incremental Benefit (IDR):
                </label>
                <input
                  type="number"
                  step="10000000"
                  value={sandboxBenefit}
                  onChange={(e) => setSandboxBenefit(Number(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono font-bold text-slate-900 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Action Operational Cost (IDR):
                </label>
                <input
                  type="number"
                  step="5000000"
                  value={sandboxCost}
                  onChange={(e) => setSandboxCost(Number(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono font-bold text-slate-900 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                <div className="flex items-center justify-between text-emerald-900">
                  <span>Net Commercial Benefit:</span>
                  <span className="font-mono font-bold">
                    Rp{(sandboxNetBenefit / 1e6).toFixed(1)}M
                  </span>
                </div>
                <div className="flex items-center justify-between text-emerald-900">
                  <span>Calculated Net ROI:</span>
                  <span className="font-mono font-black text-sm text-emerald-800">
                    +{sandboxRoi.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional value metrics supported */}
          <div className="pt-3 border-t border-slate-200 text-[10px] text-slate-500 space-y-1">
            <div className="font-bold text-slate-700 uppercase">Recognized Executive Metrics:</div>
            <div className="flex flex-wrap gap-1.5">
              {['Payback Period', 'Cost Avoidance', 'Revenue Protected', 'Revenue Uplift', 'Productivity Gain', 'Risk Reduction'].map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TOP DISTRICT CONTRIBUTORS TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-700" />
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Top District Commercial Contributors
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">Ranked by verified value generated</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="px-3 py-2.5">District</th>
                <th className="px-3 py-2.5">Strategic Role</th>
                <th className="px-3 py-2.5 text-center">Executed Actions</th>
                <th className="px-3 py-2.5 text-right">Value Delivered</th>
                <th className="px-3 py-2.5 text-right">District ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {summary.topDistrictContributors.map((dist, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-3 py-2.5 font-bold text-slate-900">{dist.areaName}</td>
                  <td className="px-3 py-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {dist.topRole}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-center font-mono">{dist.actions}</td>
                  <td className="px-3 py-2.5 text-right font-mono font-bold text-blue-950">{dist.value}</td>
                  <td className="px-3 py-2.5 text-right font-mono font-bold text-emerald-800">+{dist.roi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
