import React from 'react';
import { AreaIntelligence, ScreenId } from '../../types';
import { SEMARANG_AREAS } from '../../data/semarangData';
import { KpiCard } from '../Common/KpiCard';
import { StrategicRoleBadge } from '../Common/StrategicRoleBadge';
import { SemarangMap } from '../Map/SemarangMap';
import { ScoreBar } from '../Common/ScoreBar';
import { 
  ShieldAlert, 
  Flame, 
  Users, 
  TrendingDown, 
  Crosshair, 
  ArrowRight, 
  AlertTriangle,
  Building2,
  CheckCircle2,
  Radio
} from 'lucide-react';

interface Props {
  areas: AreaIntelligence[];
  selectedAreaId: string;
  onSelectArea: (id: string) => void;
  onNavigate: (screen: ScreenId, areaId?: string) => void;
}

export const Screen04MarketShareDefense: React.FC<Props> = ({
  areas = [],
  selectedAreaId,
  onSelectArea,
  onNavigate,
}) => {
  const safeAreas = areas && areas.length > 0 ? areas : SEMARANG_AREAS;

  // Sort areas by Defense Rank
  const defenseRankings = [...safeAreas].sort(
    (a, b) => (a.objectives.defense.rank || 99) - (b.objectives.defense.rank || 99)
  );

  const selectedArea = safeAreas.find((a) => a.id === selectedAreaId) || defenseRankings[0] || SEMARANG_AREAS[0];

  const highCompAreasCount = safeAreas.filter((a) => a.competitionLevel === 'HIGH').length;
  const totalCustomerBaseExposed = safeAreas
    .filter((a) => a.competitionLevel === 'HIGH')
    .reduce((sum, a) => sum + a.customerCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider font-mono">
              Screen 04 • Objective: Market Share Defense
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">DEFEND Pillar</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Where must we defend our existing customer base?
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Shielding high-revenue commercial and residential corridors where competitor fiber encroachment and predatory pricing directly threaten existing market share.
          </p>
        </div>

        <button
          onClick={() => onNavigate('recommendation', selectedArea.id)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <span>View Defense Recommendation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Row (Block 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="High Competition Areas"
          value={`${highCompAreasCount} Districts`}
          subValue="Index > 75 / 100"
          trend={{ value: 'Intense Rivalry', direction: 'down' }}
          icon={Flame}
          badge={{ text: 'Urgent Defense', variant: 'amber' }}
        />
        <KpiCard
          label="Customer Base Exposed"
          value={totalCustomerBaseExposed.toLocaleString()}
          subValue="In High-Contest Zones"
          icon={Users}
        />
        <KpiCard
          label="High Value Areas Exposed"
          value="7 Key Districts"
          subValue="Including Tengah, Barat, Candisari"
          icon={Building2}
          badge={{ text: 'Commercial Core', variant: 'purple' }}
        />
        <KpiCard
          label="Defense Candidates"
          value="16 Areas"
          subValue="Prioritized by Threat Level"
          icon={Crosshair}
          badge={{ text: 'Active Audit', variant: 'blue' }}
        />
      </div>

      {/* Main Map + Why Panel (Block 2 & 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Competition Pressure Map (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Competition Pressure Layer</h3>
              <p className="text-xs text-slate-500">Dark red/orange indicates aggressive competitor fiber rollout</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
              Choropleth Layer: Competition Index
            </span>
          </div>

          <div className="my-3">
            <SemarangMap
              areas={areas}
              selectedAreaId={selectedAreaId}
              onSelectArea={onSelectArea}
              activeLayer="COMPETITION"
              heightClass="h-80"
              compact
            />
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Currently focused: <strong className="text-slate-900">{selectedArea.name}</strong> (Defense Rank #{selectedArea.objectives.defense.rank})</span>
            <button
              onClick={() => onNavigate('candidate-detail', selectedArea.id)}
              className="text-amber-700 font-semibold hover:underline"
            >
              Inspect Candidate →
            </button>
          </div>
        </div>

        {/* Why Panel (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-sm">Why Panel: {selectedArea.name}</h3>
              </div>
              <StrategicRoleBadge role={selectedArea.strategicRole} size="sm" />
            </div>

            <div className="mt-3 space-y-3">
              <ScoreBar
                label="Competition Pressure Score"
                value={selectedArea.competitionPressureScore}
                color="amber"
              />
              <ScoreBar
                label="Business Contribution Score"
                value={selectedArea.businessContributionScore}
                color="blue"
              />
              <ScoreBar
                label="Customer Density"
                value={selectedArea.customerDensity}
                color="blue"
              />
              <ScoreBar
                label="Retention Score"
                value={selectedArea.retentionOpportunityScore}
                color="blue"
              />
            </div>

            {/* Defense Key Reasons */}
            <div className="mt-4 p-3 rounded-lg bg-amber-50/50 border border-amber-200/80 space-y-2">
              <span className="text-[11px] font-bold text-amber-950 uppercase tracking-wider">
                Threat Rationale
              </span>
              <ul className="space-y-1.5 text-xs text-amber-900">
                <li className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                  <span>Market Share currently at {selectedArea.marketShare}% vs Competitor {selectedArea.competitorShare}%.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                  <span>Competitor price-undercut intensity measured at index {selectedArea.competitionIndex}/100.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                  <span>Customer base yields above-average ARPU IDR {selectedArea.arpu}k requiring rapid shielding.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Standardized Recommended Blueprint Action */}
          <div className="mt-4 pt-3 border-t border-slate-200 bg-amber-50/80 p-3 rounded-lg border border-amber-200">
            <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
              Recommended Blueprint Action
            </span>
            <div className="mt-1 font-bold text-slate-900 text-xs">
              Market Share Defense Program + Competitor Response + Network Capacity Review
            </div>
            <p className="mt-1 text-[11px] text-slate-700">
              Form immediate commercial account defense SWAT team and match competitor price-per-Mbps with multi-year contract renewals.
            </p>
          </div>
        </div>
      </div>

      {/* Ranking Table (Block 3) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Market Share Defense Priority Ranking</h3>
            <p className="text-xs text-slate-500">Ranked by SERVEON Defense Score (Competitor Pressure × Business Value Exposure)</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            Defense Priority List
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Area / District</th>
                <th className="py-3 px-4 text-center">Strategic Role</th>
                <th className="py-3 px-4 text-right">Defense Score</th>
                <th className="py-3 px-4 text-right">Competition Index</th>
                <th className="py-3 px-4 text-right">Business Contribution</th>
                <th className="py-3 px-4 text-right">Evidence Confidence</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80">
              {defenseRankings.map((area) => {
                const isSelected = area.id === selectedAreaId;
                return (
                  <tr
                    key={area.id}
                    onClick={() => onSelectArea(area.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-amber-50/70 font-semibold text-amber-900'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs ${
                          area.objectives.defense.rank === 1
                            ? 'bg-amber-600 text-white'
                            : area.objectives.defense.rank === 2
                            ? 'bg-amber-100 text-amber-800'
                            : area.objectives.defense.rank === 3
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        #{area.objectives.defense.rank}
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
                      {area.objectives.defense.score}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-700">
                      {area.competitionPressureScore}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-700">
                      {area.businessContributionScore}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-amber-700 font-bold">
                      {area.confidenceScore}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectArea(area.id);
                          onNavigate('candidate-detail', area.id);
                        }}
                        className="px-2.5 py-1 rounded border border-slate-300 hover:border-amber-500 bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-800 font-semibold text-[11px] transition-colors"
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
