import React, { useState } from 'react';
import { AreaIntelligence, ScreenId } from '../../types';
import { SEMARANG_AREAS } from '../../data/semarangData';
import { KpiCard } from '../Common/KpiCard';
import { StrategicRoleBadge } from '../Common/StrategicRoleBadge';
import { SemarangMap } from '../Map/SemarangMap';
import { ScoreBar } from '../Common/ScoreBar';
import { 
  Shield, 
  AlertTriangle, 
  Users, 
  DollarSign, 
  Target, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2,
  ChevronRight,
  Info
} from 'lucide-react';

interface Props {
  areas: AreaIntelligence[];
  selectedAreaId: string;
  onSelectArea: (id: string) => void;
  onNavigate: (screen: ScreenId, areaId?: string) => void;
}

export const Screen03Retention: React.FC<Props> = ({
  areas = [],
  selectedAreaId,
  onSelectArea,
  onNavigate,
}) => {
  const safeAreas = areas && areas.length > 0 ? areas : SEMARANG_AREAS;

  // Sort areas by Retention Rank
  const retentionRankings = [...safeAreas].sort(
    (a, b) => (a.objectives.retention.rank || 99) - (b.objectives.retention.rank || 99)
  );

  const selectedArea = safeAreas.find((a) => a.id === selectedAreaId) || retentionRankings[0] || SEMARANG_AREAS[0];

  const totalHighRiskCustomers = safeAreas.reduce((sum, a) => sum + a.churnRiskCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider font-mono">
              Screen 03 • Objective: Customer Retention
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">PROTECT Pillar</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Who and where should we protect?
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Prioritizing business recall and revenue protection: identifying dense, high-margin customer bases facing aggressive competitor poaching before churn accelerates.
          </p>
        </div>

        <button
          onClick={() => onNavigate('recommendation', selectedArea.id)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <span>View Retention Recommendation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Row (Block 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="High Risk Customers"
          value={totalHighRiskCustomers.toLocaleString()}
          subValue="Across 16 districts"
          trend={{ value: '11.2%', direction: 'down', label: 'Average Churn Rate' }}
          icon={Users}
          badge={{ text: 'Action Needed', variant: 'red' }}
        />
        <KpiCard
          label="High Value at Risk"
          value="IDR 14.8B"
          subValue="Annualized Revenue Exposure"
          trend={{ value: 'VIP ARPU Focus', direction: 'neutral' }}
          icon={DollarSign}
        />
        <KpiCard
          label="Eligible Retention Areas"
          value="16 Areas"
          subValue="Ranked by Retention Score"
          icon={Target}
          badge={{ text: 'Full Audit', variant: 'blue' }}
        />
        <KpiCard
          label="Model Business Recall"
          value="89.2%"
          subValue="Champion Model V2.1"
          trend={{ value: '+4.1% over V2.0', direction: 'up' }}
          tooltip="SERVEON prioritizes customer recall over vanity precision to avoid false negative churn blindspots."
          badge={{ text: 'High Recall', variant: 'emerald' }}
        />
      </div>

      {/* Main Visual: Map + Why Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Retention Map (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Retention Risk &amp; Opportunity Map</h3>
              <p className="text-xs text-slate-500">Darker shades highlight districts with highest retention urgency</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              Choropleth Layer: Density &amp; Risk
            </span>
          </div>

          <div className="my-3">
            <SemarangMap
              areas={areas}
              selectedAreaId={selectedAreaId}
              onSelectArea={onSelectArea}
              activeLayer="DENSITY"
              heightClass="h-80"
              compact
            />
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Currently focused: <strong className="text-slate-900">{selectedArea.name}</strong> (Rank #{selectedArea.objectives.retention.rank})</span>
            <button
              onClick={() => onNavigate('candidate-detail', selectedArea.id)}
              className="text-blue-700 font-semibold hover:underline"
            >
              Candidate Details →
            </button>
          </div>
        </div>

        {/* Why Panel & Action Blueprint (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Why Panel: {selectedArea.name}</h3>
              </div>
              <StrategicRoleBadge role={selectedArea.strategicRole} size="sm" />
            </div>

            <div className="mt-3 space-y-3">
              <ScoreBar
                label="Retention Opportunity Score"
                value={selectedArea.retentionOpportunityScore}
                color="blue"
              />
              <ScoreBar
                label="Customer Density"
                value={selectedArea.customerDensity}
                color="blue"
              />
              <ScoreBar
                label="Competition Pressure"
                value={selectedArea.competitionPressureScore}
                color="amber"
              />
              <ScoreBar
                label="Business Contribution"
                value={selectedArea.businessContributionScore}
                color="blue"
              />
            </div>

            {/* Retention Business Reasons */}
            <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Key Analytical Drivers
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {selectedArea.businessReasons.slice(0, 3).map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Standardized Blueprint Action */}
          <div className="mt-4 pt-3 border-t border-slate-200 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
            <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider block">
              Recommended Blueprint Action
            </span>
            <div className="mt-1 font-bold text-slate-900 text-xs">
              Targeted Retention Campaign + Customer Re-engagement + Service Experience Review
            </div>
            <p className="mt-1 text-[11px] text-slate-600">
              Focus field maintenance and VIP customer retention outreach on the top 15% revenue generating accounts.
            </p>
          </div>
        </div>
      </div>

      {/* Candidate Ranking Table (Block 3) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Retention Priority Ranking</h3>
            <p className="text-xs text-slate-500">Ranked by SERVEON Multi-Criteria Retention Score (V2.1)</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            16 Ranked Candidates
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Area / District</th>
                <th className="py-3 px-4 text-center">Strategic Role</th>
                <th className="py-3 px-4 text-right">Retention Score</th>
                <th className="py-3 px-4 text-right">Customer Density</th>
                <th className="py-3 px-4 text-right">Competition Index</th>
                <th className="py-3 px-4 text-right">Evidence Confidence</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80">
              {retentionRankings.map((area) => {
                const isSelected = area.id === selectedAreaId;
                return (
                  <tr
                    key={area.id}
                    onClick={() => onSelectArea(area.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-50/70 font-semibold text-blue-900'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs ${
                          area.objectives.retention.rank === 1
                            ? 'bg-blue-700 text-white'
                            : area.objectives.retention.rank === 2
                            ? 'bg-blue-100 text-blue-800'
                            : area.objectives.retention.rank === 3
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        #{area.objectives.retention.rank}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {area.name}
                      <span className="text-[10px] text-slate-500 font-mono ml-1.5">({area.code})</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <StrategicRoleBadge role={area.strategicRole} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {area.objectives.retention.score}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-700">
                      {area.customerDensity}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-700">
                      {area.competitionPressureScore}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-blue-700 font-bold">
                      {area.confidenceScore}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectArea(area.id);
                          onNavigate('candidate-detail', area.id);
                        }}
                        className="px-2.5 py-1 rounded border border-slate-300 hover:border-blue-500 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold text-[11px] transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
