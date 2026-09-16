import React, { useState } from 'react';
import { LearningItem, LearningStatusType, ScreenId } from '../../types';
import { INITIAL_LEARNING_ITEMS } from '../../data/executionData';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sliders,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  HelpCircle,
  FileCheck,
  BrainCircuit,
  Activity,
  ChevronRight
} from 'lucide-react';

interface Props {
  onNavigate?: (screen: ScreenId, areaId?: string) => void;
}

export const ScreenLearningFeedback: React.FC<Props> = ({ onNavigate }) => {
  const [learningItems] = useState<LearningItem[]>(INITIAL_LEARNING_ITEMS);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');

  const filteredItems = learningItems.filter((item) => {
    if (selectedStatusFilter !== 'ALL' && item.status !== selectedStatusFilter) return false;
    return true;
  });

  const validatedCount = learningItems.filter((i) => i.status === 'VALIDATED').length;
  const executionIssueCount = learningItems.filter((i) => i.status === 'BUSINESS EXECUTION ISSUE').length;
  const modelReviewCount = learningItems.filter((i) => i.status === 'MODEL REVIEW' || i.status === 'NEEDS REVIEW').length;

  const getStatusBadge = (status: LearningStatusType) => {
    switch (status) {
      case 'VALIDATED':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'BUSINESS EXECUTION ISSUE':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'MODEL REVIEW':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'NEEDS REVIEW':
        return 'bg-blue-100 text-blue-900 border-blue-300';
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
              SCREEN K • CONTINUOUS LEARNING LOOP
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">LEARN Pillar</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Learning &amp; Feedback
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
            Turn real-world execution outcomes back into refined model coefficients, decision thresholds, and verified playbooks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigate && (
            <button
              onClick={() => onNavigate('executive-overview')}
              className="px-3.5 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-[0.99]"
            >
              <span>Back to Executive View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* CLOSED-LOOP VISUAL JOURNEY BANNER (From Prompt: RECOMMENDATION -> DECISION -> ACTION -> RESULT -> LEARNING) */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider font-mono">
              SERVEON CLOSED-LOOP DECISION ARCHITECTURE
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-800 text-blue-100">
              V2.1 Feedback Engine
            </span>
          </div>

          {/* Flow Stages */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
            {[
              { num: '01', title: 'RECOMMENDATION', sub: 'Algorithm & Evidence' },
              { num: '02', title: 'DECISION', sub: 'Executive Endorsement' },
              { num: '03', title: 'ACTION', sub: 'Field Execution' },
              { num: '04', title: 'RESULT', sub: 'Measured Counterfactual' },
              { num: '05', title: 'LEARNING', sub: 'Feedback to Model' },
            ].map((step, idx) => (
              <div
                key={step.num}
                className={`p-3 rounded-xl border ${
                  idx === 4
                    ? 'border-cyan-400 bg-cyan-950/80 shadow-xs'
                    : 'border-slate-700/80 bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    Step {step.num}
                  </span>
                  {idx === 4 && <RefreshCw className="w-3.5 h-3.5 text-cyan-300 animate-spin" />}
                </div>
                <div className="font-black text-xs text-white mt-1 tracking-tight">
                  {step.title}
                </div>
                <div className="text-[10px] text-slate-300 mt-0.5 font-medium">
                  {step.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Recommendations Measured
          </span>
          <div className="mt-2 text-2xl font-extrabold text-slate-900 font-mono">
            16
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Across 16 Semarang districts
          </div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 shadow-2xs">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
            Validated Patterns
          </span>
          <div className="mt-2 text-2xl font-extrabold text-emerald-900 font-mono">
            {validatedCount}
          </div>
          <div className="text-[10px] text-emerald-700 mt-1">
            Confirmed decision rules
          </div>
        </div>

        <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 shadow-2xs">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
            Business Execution Issues
          </span>
          <div className="mt-2 text-2xl font-extrabold text-amber-900 font-mono">
            {executionIssueCount}
          </div>
          <div className="text-[10px] text-amber-700 mt-1">
            Coverage or delivery bottlenecks
          </div>
        </div>

        <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200 shadow-2xs">
          <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider block">
            Model Review Required
          </span>
          <div className="mt-2 text-2xl font-extrabold text-purple-900 font-mono">
            {modelReviewCount}
          </div>
          <div className="text-[10px] text-purple-700 mt-1">
            New geographic feature updates
          </div>
        </div>
      </div>

      {/* CORE METHODOLOGICAL PRINCIPLE: RECOMMENDATION QUALITY vs EXECUTION QUALITY vs BUSINESS OUTCOME */}
      <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-200 shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-blue-700" />
          <h3 className="font-extrabold text-slate-900 text-sm">
            Core Decision-Intelligence Methodology: The Tripartite Evaluation Principle
          </h3>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed max-w-4xl">
          SERVEON strictly separates <strong className="text-blue-900">Recommendation Quality</strong> (was the data model sound?), <strong className="text-blue-900">Execution Quality</strong> (did field operations deliver the required coverage?), and <strong className="text-blue-900">Business Outcome</strong>. <em>A sound recommendation must not be penalized if field operational coverage was insufficient (&lt; 75%).</em>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
          <div className="p-3 rounded-xl bg-white border border-blue-200">
            <span className="font-bold text-slate-900 block">1. Recommendation Quality</span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Accuracy of customer density, churn vulnerability, and competitive scoring.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white border border-blue-200">
            <span className="font-bold text-slate-900 block">2. Execution Quality</span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Field completion rate, contacted percentage, rep coverage, and offer timing.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white border border-blue-200">
            <span className="font-bold text-slate-900 block">3. Business Outcome</span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Net incremental uplift and verified commercial ROI over counterfactual controls.
            </p>
          </div>
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">
          Filter Status:
        </span>
        {['ALL', 'VALIDATED', 'BUSINESS EXECUTION ISSUE', 'MODEL REVIEW'].map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors cursor-pointer ${
              selectedStatusFilter === st
                ? 'bg-blue-900 text-white border-blue-900'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* DETAILED LEARNING CARDS (Includes Semarang Selatan, Semarang Barat, Semarang Tengah, Genuk, Ngaliyan) */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4 transition-all hover:border-blue-300"
          >
            {/* Top row: District, Objective, Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-slate-900 text-base">
                  {item.areaName}
                </span>
                <span className="text-xs font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {item.objective.replace('_', ' ')}
                </span>
                <span className="text-xs text-slate-500">
                  {item.recommendationName}
                </span>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(item.status)}`}>
                {item.status}
              </span>
            </div>

            {/* Tripartite Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Predicted Potential</span>
                <div className="font-bold text-slate-900 mt-0.5">{item.predictedOpportunity}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Execution Completion</span>
                <div className={`font-bold mt-0.5 font-mono ${item.executionCompletion < 75 ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {item.executionCompletion}%
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Realized Uplift</span>
                <div className="font-bold text-slate-900 mt-0.5 font-mono">{item.upliftSummary}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Incremental Revenue</span>
                <div className="font-bold text-blue-900 mt-0.5 font-mono">{item.incrementalRevenue}</div>
              </div>
            </div>

            {/* System Insight & Feedback Rule Applied */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>System Analytical Insight:</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {item.systemInsight}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-blue-900">
                  <Sliders className="w-3.5 h-3.5 text-blue-700" />
                  <span>Model / Rule Feedback Update:</span>
                </div>
                <p className="text-blue-950 text-[11px] leading-relaxed font-medium">
                  {item.feedbackRuleUpdate}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
