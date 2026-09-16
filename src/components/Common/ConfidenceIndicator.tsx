import React from 'react';
import { Info, CheckCircle2 } from 'lucide-react';

interface ConfidenceIndicatorProps {
  score: number; // e.g. 90.4
  components?: {
    dataQuality: number;
    freshness: number;
    modelEvidence: number;
    sampleSize: number;
  };
  showBreakdown?: boolean;
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  score,
  components,
  showBreakdown = false,
}) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3 text-xs space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-semibold text-slate-700">
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          <span>Evidence Confidence</span>
        </div>
        <span className="font-mono text-sm font-bold text-slate-900">{score}%</span>
      </div>

      <div className="flex items-start gap-1.5 text-[11px] text-slate-500 leading-relaxed">
        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
        <span>
          Confidence reflects analytical evidence strength and sample completeness; it is{' '}
          <strong className="text-slate-700">not</strong> a guaranteed probability of business outcome.
        </span>
      </div>

      {showBreakdown && components && (
        <div className="pt-2 border-t border-slate-200/80 grid grid-cols-2 gap-2 text-[11px]">
          <div>
            <span className="text-slate-500">Data Quality:</span>{' '}
            <span className="font-mono font-medium text-slate-800">{components.dataQuality}%</span>
          </div>
          <div>
            <span className="text-slate-500">Freshness:</span>{' '}
            <span className="font-mono font-medium text-slate-800">{components.freshness}%</span>
          </div>
          <div>
            <span className="text-slate-500">Model Evidence:</span>{' '}
            <span className="font-mono font-medium text-slate-800">{components.modelEvidence}%</span>
          </div>
          <div>
            <span className="text-slate-500">Sample Size:</span>{' '}
            <span className="font-mono font-medium text-slate-800">{components.sampleSize}%</span>
          </div>
        </div>
      )}
    </div>
  );
};
