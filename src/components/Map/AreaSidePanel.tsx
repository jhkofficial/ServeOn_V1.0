import React from 'react';
import { AreaIntelligence, ScreenId } from '../../types';
import { StrategicRoleBadge } from '../Common/StrategicRoleBadge';
import { ConfidenceIndicator } from '../Common/ConfidenceIndicator';
import { ScoreBar } from '../Common/ScoreBar';
import { ArrowRight, Sparkles, AlertTriangle, ShieldCheck, ChevronRight, X } from 'lucide-react';

interface AreaSidePanelProps {
  area: AreaIntelligence;
  onNavigate: (screen: ScreenId, areaId?: string) => void;
  onClose?: () => void;
}

export const AreaSidePanel: React.FC<AreaSidePanelProps> = ({ area, onNavigate, onClose }) => {
  return (
    <div className="w-full h-full flex flex-col bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/50">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase font-mono">
              {area.code} • {area.city}
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5 tracking-tight">{area.name}</h3>
          </div>
          <div className="flex items-center gap-2">
            <StrategicRoleBadge role={area.strategicRole} size="md" />
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-md transition-colors"
                title="Close panel"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="mt-3">
          <ConfidenceIndicator score={area.confidenceScore} components={area.confidenceComponents} />
        </div>
      </div>

      {/* Body Content */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
        {/* Four Objective Matrix */}
        <div>
          <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
            Four Objective Status
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {/* Retention */}
            <div
              onClick={() => onNavigate('retention', area.id)}
              className="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between text-slate-500 text-[10px] font-semibold uppercase">
                <span>Retention</span>
                <span className="text-blue-600 font-bold">#{area.objectives.retention.rank}</span>
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-base font-bold text-slate-900">{area.objectives.retention.score}</span>
                <span className="text-[10px] text-blue-700 font-medium">{area.objectives.retention.priority}</span>
              </div>
            </div>

            {/* Market Defense */}
            <div
              onClick={() => onNavigate('market-defense', area.id)}
              className="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50/30 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between text-slate-500 text-[10px] font-semibold uppercase">
                <span>Defense</span>
                <span className="text-amber-600 font-bold">#{area.objectives.defense.rank}</span>
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-base font-bold text-slate-900">{area.objectives.defense.score}</span>
                <span className="text-[10px] text-amber-700 font-medium">{area.objectives.defense.priority}</span>
              </div>
            </div>

            {/* Acquisition */}
            <div
              onClick={() => onNavigate('acquisition', area.id)}
              className="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/30 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between text-slate-500 text-[10px] font-semibold uppercase">
                <span>Acquisition</span>
                <span className="text-emerald-600 font-bold">#{area.objectives.acquisition.rank}</span>
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-base font-bold text-slate-900">{area.objectives.acquisition.score}</span>
                <span className="text-[10px] text-emerald-700 font-medium">{area.objectives.acquisition.priority}</span>
              </div>
            </div>

            {/* Network Expansion */}
            <div
              onClick={() => onNavigate('network-expansion', area.id)}
              className="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-50/30 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between text-slate-500 text-[10px] font-semibold uppercase">
                <span>Expansion</span>
                <span className="text-rose-600 font-bold">GATE</span>
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-base font-bold text-slate-500">
                  {area.expansionGate.allPassed ? 'Passed' : 'Not Eligible'}
                </span>
                <span className="text-[10px] text-rose-600 font-semibold">
                  {area.expansionGate.allPassed ? 'Eligible' : 'Fails Gate'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Intelligence Score Bars */}
        <div className="space-y-2.5 pt-2 border-t border-slate-100">
          <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px]">
            Intelligence Profiles
          </h4>
          <ScoreBar label="Customer Density" value={area.customerDensity} color="blue" compact />
          <ScoreBar label="Retention Opportunity" value={area.retentionOpportunityScore} color="blue" compact />
          <ScoreBar label="Competition Pressure" value={area.competitionPressureScore} color="amber" compact />
          <ScoreBar label="Market Potential" value={area.marketPotentialScore} color="emerald" compact />
          <ScoreBar label="Relative Coverage Gap" value={area.relativeCoverageGapScore} color="purple" compact />
        </div>

        {/* Plain Language Area Synopsis */}
        <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-100 space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-blue-900 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Executive Business Story</span>
          </div>
          <p className="text-slate-700 text-xs leading-relaxed line-clamp-3">
            {area.areaStory}
          </p>
        </div>

        {/* Recommended Action Preview */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Primary Recommended Action
          </span>
          <p className="font-semibold text-slate-900 text-xs mt-1">
            {area.recommendation.recommendedAction}
          </p>
          <span className="inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
            Priority: {area.recommendation.priority}
          </span>
        </div>
      </div>

      {/* Bottom CTAs */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/80 space-y-2">
        <button
          onClick={() => onNavigate('candidate-detail', area.id)}
          className="w-full py-2.5 px-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
        >
          <span>View Candidate Detail</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => onNavigate('explainability', area.id)}
            className="py-1.5 px-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium text-[11px] text-center"
          >
            Explain Result
          </button>
          <button
            onClick={() => onNavigate('recommendation', area.id)}
            className="py-1.5 px-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium text-[11px] text-center"
          >
            Recommendation
          </button>
        </div>
      </div>
    </div>
  );
};
