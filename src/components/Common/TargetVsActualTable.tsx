import React from 'react';
import { TargetVsActualRow, TargetVsActualStatus } from '../../types';
import { CheckCircle2, TrendingUp, AlertTriangle, Minus, HelpCircle, Wallet } from 'lucide-react';

interface Props {
  rows: TargetVsActualRow[];
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

export const TargetVsActualTable: React.FC<Props> = ({
  rows,
  title = 'Target vs Actual Performance',
  subtitle = 'Comparing pre-action baseline against modeled target and observed outcome',
  compact = false,
}) => {
  const getBadge = (status: TargetVsActualStatus) => {
    switch (status) {
      case 'ABOVE TARGET':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            ABOVE TARGET
          </span>
        );
      case 'ON TARGET':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <TrendingUp className="w-3 h-3 text-blue-700" />
            ON TARGET
          </span>
        );
      case 'BELOW TARGET':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <AlertTriangle className="w-3 h-3 text-rose-700" />
            BELOW TARGET
          </span>
        );
      case 'WITHIN BUDGET':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">
            <Wallet className="w-3 h-3 text-indigo-700" />
            WITHIN BUDGET
          </span>
        );
      case 'NO CHANGE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <Minus className="w-3 h-3 text-slate-500" />
            NO CHANGE
          </span>
        );
      case 'NOT MEASURED':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <HelpCircle className="w-3 h-3 text-amber-600" />
            NOT MEASURED
          </span>
        );
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
      {(title || subtitle) && (
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/60">
          {title && <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">{title}</h4>}
          {subtitle && <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="px-3.5 py-2.5">Metric</th>
              <th className="px-3.5 py-2.5 text-right">Baseline</th>
              <th className="px-3.5 py-2.5 text-right">Target</th>
              <th className="px-3.5 py-2.5 text-right font-bold text-slate-700">Actual</th>
              <th className="px-3.5 py-2.5 text-right">Change</th>
              <th className="px-3.5 py-2.5 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-3.5 py-2.5 font-semibold text-slate-900">
                  {row.metric}
                </td>
                <td className="px-3.5 py-2.5 text-right font-mono text-slate-500">
                  {row.baseline}
                </td>
                <td className="px-3.5 py-2.5 text-right font-mono text-blue-700 font-semibold">
                  {row.target}
                </td>
                <td className="px-3.5 py-2.5 text-right font-mono font-bold text-slate-900">
                  {row.actual}
                </td>
                <td className="px-3.5 py-2.5 text-right font-mono font-bold text-emerald-700">
                  {row.change}
                </td>
                <td className="px-3.5 py-2.5 text-center">
                  {getBadge(row.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
