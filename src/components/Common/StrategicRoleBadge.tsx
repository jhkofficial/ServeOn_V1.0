import React from 'react';
import { StrategicRole } from '../../types';
import { Shield, ShieldAlert, UserPlus, Network, Eye } from 'lucide-react';

interface Props {
  role: StrategicRole;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StrategicRoleBadge: React.FC<Props> = ({ role, size = 'md', showIcon = true }) => {
  const getRoleConfig = () => {
    switch (role) {
      case 'PROTECT':
        return {
          label: 'PROTECT',
          icon: Shield,
          classes: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
          dot: 'bg-blue-600',
        };
      case 'DEFEND':
        return {
          label: 'DEFEND',
          icon: ShieldAlert,
          classes: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100',
          dot: 'bg-amber-600',
        };
      case 'ACQUIRE':
        return {
          label: 'ACQUIRE',
          icon: UserPlus,
          classes: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
          dot: 'bg-emerald-600',
        };
      case 'EXPAND':
        return {
          label: 'EXPAND',
          icon: Network,
          classes: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
          dot: 'bg-purple-600',
        };
      case 'MONITOR':
      default:
        return {
          label: 'MONITOR',
          icon: Eye,
          classes: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
          dot: 'bg-slate-500',
        };
    }
  };

  const config = getRoleConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5 font-semibold',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-bold tracking-wide',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold tracking-wider',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border whitespace-nowrap transition-colors duration-150 ${sizeClasses[size]} ${config.classes}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
      <span>{config.label}</span>
    </span>
  );
};
