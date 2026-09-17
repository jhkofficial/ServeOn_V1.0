import React from 'react';
import { ScreenId, StrategicRole } from '../../types';
import {
  LayoutDashboard,
  Map,
  Shield,
  ShieldAlert,
  UserPlus,
  Network,
  FileText,
  HelpCircle,
  Award,
  ChevronRight,
  Info,
  Users,
  KeyRound,
  ClipboardList,
  Sliders,
  PlayCircle,
  Activity,
  BarChart3,
  DollarSign,
  RefreshCw,
  Zap,
} from 'lucide-react';

interface SidebarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  roleCounts?: Record<StrategicRole, number>;
  selectedAreaName?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  roleCounts,
  selectedAreaName,
}) => {
  const navGroups = [
    {
      group: 'OVERVIEW',
      items: [
        {
          id: 'executive-overview' as ScreenId,
          label: 'Executive Overview',
          icon: LayoutDashboard,
          badge: 'Executive',
        },
      ],
    },
    {
      group: 'WHERE',
      items: [
        {
          id: 'strategic-map' as ScreenId,
          label: 'Strategic Action Map',
          icon: Map,
          badge: '16 Areas',
          highlight: true,
        },
      ],
    },
    {
      group: 'PROTECT',
      items: [
        {
          id: 'retention' as ScreenId,
          label: 'Retention',
          icon: Shield,
          badge: roleCounts ? `${roleCounts.PROTECT} Protect` : undefined,
          badgeColor: 'blue',
        },
        {
          id: 'market-defense' as ScreenId,
          label: 'Market Share Defense',
          icon: ShieldAlert,
          badge: roleCounts ? `${roleCounts.DEFEND} Defend` : undefined,
          badgeColor: 'amber',
        },
      ],
    },
    {
      group: 'GROW',
      items: [
        {
          id: 'acquisition' as ScreenId,
          label: 'New Customer Acquisition',
          icon: UserPlus,
          badge: roleCounts ? `${roleCounts.ACQUIRE} Acquire` : undefined,
          badgeColor: 'emerald',
        },
        {
          id: 'network-expansion' as ScreenId,
          label: 'Network Expansion',
          icon: Network,
          badge: 'Gate Active',
          badgeColor: 'purple',
        },
      ],
    },
    {
      group: 'UNDERSTAND',
      items: [
        {
          id: 'candidate-detail' as ScreenId,
          label: 'Candidate Detail',
          icon: FileText,
          sublabel: selectedAreaName,
        },
        {
          id: 'explainability' as ScreenId,
          label: 'Explainability',
          icon: HelpCircle,
          badge: 'Evidence',
        },
      ],
    },
    {
      group: 'DECIDE',
      items: [
        {
          id: 'recommendation' as ScreenId,
          label: 'Recommendation',
          icon: Award,
          badge: 'Action',
          badgeColor: 'blue',
        },
      ],
    },
    {
      group: 'RESULT',
      items: [
        {
          id: 'action-execution' as ScreenId,
          label: 'Action Execution',
          icon: PlayCircle,
          badge: 'Live',
          badgeColor: 'blue',
        },
        {
          id: 'impact-outcome-map' as ScreenId,
          label: 'Impact & Outcome Map',
          icon: Activity,
          badge: 'Evidence',
          badgeColor: 'emerald',
        },
        {
          id: 'performance-measurement' as ScreenId,
          label: 'Performance Measurement',
          icon: BarChart3,
          badge: '16 Tests',
          badgeColor: 'emerald',
        },
        {
          id: 'business-value' as ScreenId,
          label: 'Business Value',
          icon: DollarSign,
          badge: 'Rp2.4B',
          badgeColor: 'emerald',
        },
        {
          id: 'learning-feedback' as ScreenId,
          label: 'Learning & Feedback',
          icon: RefreshCw,
          badge: 'Loop',
          badgeColor: 'purple',
        },
      ],
    },
    {
      group: 'GOVERN',
      items: [
        {
          id: 'user-management' as ScreenId,
          label: 'User Management',
          icon: Users,
          badge: '48 Users',
        },
        {
          id: 'role-permission' as ScreenId,
          label: 'Role & Permission',
          icon: KeyRound,
          badge: '8 Roles',
        },
        {
          id: 'audit-log' as ScreenId,
          label: 'Audit Log',
          icon: ClipboardList,
          badge: 'Live',
          badgeColor: 'emerald',
        },
        {
          id: 'application-settings' as ScreenId,
          label: 'Application Settings',
          icon: Sliders,
        },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-extrabold text-base shadow-sm">
            S
          </div>
          <div>
            <div className="font-extrabold text-white text-base tracking-tight font-sans">
              SERVEON
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              Decision Intelligence
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 py-3 px-2.5 overflow-y-auto space-y-4 text-xs">
        {navGroups.map((group) => (
          <div key={group.group} className="space-y-1">
            <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
              {group.group}
            </div>

            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg font-medium transition-all group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <div className="text-left truncate">
                      <div className="truncate text-xs">{item.label}</div>
                      {item.sublabel && !isActive && (
                        <div className="text-[10px] text-slate-400 truncate">{item.sublabel}</div>
                      )}
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${
                        isActive
                          ? 'bg-blue-700 text-blue-100'
                          : item.badgeColor === 'blue'
                          ? 'bg-blue-950/80 text-blue-300 border border-blue-800/50'
                          : item.badgeColor === 'amber'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-800/50'
                          : item.badgeColor === 'emerald'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50'
                          : item.badgeColor === 'purple'
                          ? 'bg-purple-950/80 text-purple-300 border border-purple-800/50'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Decision Principle Footer Notice */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/50 text-[11px] space-y-1">
        <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-[10px] uppercase tracking-wider">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>Decision Principle</span>
        </div>
        <p className="text-slate-400 leading-snug text-[11px]">
          AI/Analytics Recommends — Human Decides.
        </p>
      </div>
    </aside>
  );
};
