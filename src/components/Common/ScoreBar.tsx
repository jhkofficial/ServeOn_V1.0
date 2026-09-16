import React from 'react';

interface ScoreBarProps {
  label: string;
  value: number; // 0-100
  threshold?: number;
  thresholdLabel?: string;
  color?: 'blue' | 'amber' | 'emerald' | 'purple' | 'slate';
  compact?: boolean;
}

export const ScoreBar: React.FC<ScoreBarProps> = ({
  label,
  value,
  threshold,
  thresholdLabel,
  color = 'blue',
  compact = false,
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-500';
      case 'amber':
        return 'bg-amber-500';
      case 'purple':
        return 'bg-purple-500';
      case 'slate':
        return 'bg-slate-500';
      case 'blue':
      default:
        return 'bg-blue-600';
    }
  };

  return (
    <div className={compact ? 'space-y-1' : 'space-y-1.5'}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-700">{label}</span>
        <div className="flex items-center gap-1.5 font-mono">
          {threshold !== undefined && (
            <span className="text-[10px] text-slate-600">
              [Min: {threshold}]
            </span>
          )}
          <span className="font-semibold text-slate-900">{value}/100</span>
        </div>
      </div>

      <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getColorClasses()}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />

        {threshold !== undefined && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-slate-900 z-10"
            style={{ left: `${threshold}%` }}
            title={thresholdLabel || `Threshold: ${threshold}`}
          />
        )}
      </div>
    </div>
  );
};
