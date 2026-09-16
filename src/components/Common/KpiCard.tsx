import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  id?: string;
  label: string;
  value: string | number;
  subValue?: string;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  icon?: LucideIcon;
  badge?: {
    text: string;
    variant: 'blue' | 'amber' | 'emerald' | 'purple' | 'slate' | 'red';
  };
  tooltip?: string;
  onClick?: () => void;
  active?: boolean;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  id,
  label,
  value,
  subValue,
  trend,
  icon: Icon,
  badge,
  tooltip,
  onClick,
  active = false,
}) => {
  const getBadgeStyle = () => {
    switch (badge?.variant) {
      case 'amber':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'emerald':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'purple':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'red':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'blue':
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div
      id={id}
      onClick={onClick}
      className={`relative rounded-xl border bg-white p-4 transition-all duration-200 ${
        active
          ? 'border-blue-500 shadow-sm ring-2 ring-blue-100'
          : 'border-slate-200/80 shadow-xs hover:border-slate-300'
      } ${onClick ? 'cursor-pointer hover:shadow-sm' : ''}`}
      title={tooltip}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {label}
        </span>
        {badge && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getBadgeStyle()}`}>
            {badge.text}
          </span>
        )}
        {Icon && !badge && (
          <div className="p-1.5 rounded-lg bg-slate-50 text-slate-600">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-2.5 flex items-baseline justify-between">
        <div className="text-2xl font-bold text-slate-900 tracking-tight font-sans">
          {value}
        </div>
      </div>

      {(subValue || trend) && (
        <div className="mt-2 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={`inline-flex items-center gap-0.5 font-medium ${
                trend.direction === 'up'
                  ? 'text-emerald-700'
                  : trend.direction === 'down'
                  ? 'text-rose-700'
                  : 'text-slate-600'
              }`}
            >
              {trend.direction === 'up' ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : trend.direction === 'down' ? (
                <TrendingDown className="w-3.5 h-3.5" />
              ) : (
                <Minus className="w-3.5 h-3.5" />
              )}
              {trend.value}
            </span>
          )}
          {subValue && <span className="text-slate-600">{subValue}</span>}
          {trend?.label && <span className="text-slate-600">{trend.label}</span>}
        </div>
      )}
    </div>
  );
};
