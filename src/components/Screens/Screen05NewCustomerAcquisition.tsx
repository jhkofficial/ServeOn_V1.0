import React from 'react';
import { AreaIntelligence, ScreenId } from '../../types';
import { SEMARANG_AREAS } from '../../data/semarangData';
import { KpiCard } from '../Common/KpiCard';
import { StrategicRoleBadge } from '../Common/StrategicRoleBadge';
import { SemarangMap } from '../Map/SemarangMap';
import { ScoreBar } from '../Common/ScoreBar';
import { 
  UserPlus, 
  Compass, 
  TrendingUp, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  Store, 
  CheckCircle2, 
  ChevronRight,
  Lightbulb
} from 'lucide-react';

interface Props {
  areas: AreaIntelligence[];
  selectedAreaId: string;
  onSelectArea: (id: string) => void;
  onNavigate: (screen: ScreenId, areaId?: string) => void;
}

export const Screen05NewCustomerAcquisition: React.FC<Props> = ({
  areas = [],
  selectedAreaId,
  onSelectArea,
  onNavigate,
}) => {
  const safeAreas = areas && areas.length > 0 ? areas : SEMARANG_AREAS;

  // Sort areas by Acquisition Rank
  const acqRankings = [...safeAreas].sort(
    (a, b) => (a.objectives.acquisition.rank || 99) - (b.objectives.acquisition.rank || 99)
  );

  const selectedArea = safeAreas.find((a) => a.id === selectedAreaId) || acqRankings[0] || SEMARANG_AREAS[0];

  const totalTAM = safeAreas.reduce((sum, a) => sum + a.totalAddressableMarket, 0);
  const lowPenetrationCount = safeAreas.filter((a) => a.penetrationRate < 45).length;
  const highGrowthCount = safeAreas.filter((a) => a.customerGrowthRate > 4.5).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider font-mono">
              Screen 05 • Objective: New Customer Acquisition
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">GROW Pillar</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Where should we test new customer demand?
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Prioritizing market demand testing and digital lead generation before committing physical capital: finding high-growth unserved residential infill with existing network drops.
          </p>
        </div>

        <button
          onClick={() => onNavigate('recommendation', selectedArea.id)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <span>View Acquisition Recommendation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Row (Block 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Addressable Market"
          value={totalTAM.toLocaleString()}
          subValue="Households across Semarang"
          trend={{ value: '+5.4% YoY', direction: 'up', label: 'Household Formation' }}
          icon={Store}
          badge={{ text: 'Addressable', variant: 'emerald' }}
        />
        <KpiCard
          label="Low Penetration Areas"
          value={`${lowPenetrationCount} Districts`}
          subValue="Penetration < 45%"
          trend={{ value: 'Huge Headroom', direction: 'up' }}
          icon={Compass}
        />
        <KpiCard
          label="High Growth Areas"
          value={`${highGrowthCount} Districts`}
          subValue="Customer Growth > 4.5% YoY"
          icon={TrendingUp}
          badge={{ text: 'Expansion Corridors', variant: 'emerald' }}
        />
        <KpiCard
          label="Qualified Test Candidates"
          value="5 Priority Areas"
          subValue="Top: Pedurungan, Gayamsari, Banyumanik"
          icon={MapPin}
          badge={{ text: 'Ready to Test', variant: 'blue' }}
        />
      </div>

      {/* Main Map + Why Panel (Block 2 & 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Acquisition Potential Map (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Acquisition Opportunity Layer</h3>
              <p className="text-xs text-slate-500">Green shading indicates high addressable market &amp; housing density</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              Choropleth Layer: Market Potential
            </span>
          </div>

          <div className="my-3">
            <SemarangMap
              areas={safeAreas}
              selectedAreaId={selectedAreaId}
              onSelectArea={onSelectArea}
              activeLayer="ACQUISITION"
              heightClass="h-[430px]"
              initialBaseMode="tile"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Currently focused: <strong className="text-slate-900">{selectedArea.name}</strong> (Acquisition Rank #{selectedArea.objectives.acquisition.rank})</span>
            <button
              onClick={() => onNavigate('candidate-detail', selectedArea.id)}
              className="text-emerald-700 font-semibold hover:underline"
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
                <UserPlus className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">Why Panel: {selectedArea.name}</h3>
              </div>
              <StrategicRoleBadge role={selectedArea.strategicRole} size="sm" />
            </div>

            <div className="mt-3 space-y-3">
              <ScoreBar
                label="Market Potential Score"
                value={selectedArea.marketPotentialScore}
                color="emerald"
              />
              <ScoreBar
                label="Acquisition Potential Score"
                value={selectedArea.objectives.acquisition.score}
                color="emerald"
              />
              <ScoreBar
                label="Road & Pole Accessibility"
                value={selectedArea.accessibilityScore}
                color="emerald"
              />
              <ScoreBar
                label="Customer Growth Rate"
                value={Math.round(selectedArea.customerGrowthRate * 10)}
                threshold={40}
                thresholdLabel="Min Target 4%"
                color="emerald"
              />
            </div>

            {/* Acquisition Business Reasons */}
            <div className="mt-4 p-3 rounded-lg bg-emerald-50/50 border border-emerald-200/80 space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-950 uppercase tracking-wider">
                <Lightbulb className="w-3.5 h-3.5 text-emerald-600" />
                <span>Demand Validation Rationale</span>
              </div>
              <ul className="space-y-1.5 text-xs text-emerald-900">
                <li className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span>Total Addressable Market of {selectedArea.totalAddressableMarket.toLocaleString()} homes with {selectedArea.penetrationRate}% penetration.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span>Existing distribution points have over 35% spare port capacity; test demand before civil works.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span>Customer acquisition cost (CAC) estimated at 45% lower than building greenfield network.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Standardized Recommended Action */}
          <div className="mt-4 pt-3 border-t border-slate-200 bg-emerald-50/80 p-3 rounded-lg border border-emerald-200">
            <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block">
              Recommended Blueprint Action
            </span>
            <div className="mt-1 font-bold text-slate-900 text-xs">
              Geo-targeted Acquisition Test + Lead Generation + Market Validation
            </div>
            <p className="mt-1 text-[11px] text-slate-700">
              Run localized digital ad flyers and community booth activations. Do not automatically build physical network lines without pre-orders.
            </p>
          </div>
        </div>
      </div>

      {/* Ranking Table (Block 3) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">New Customer Acquisition Ranking</h3>
            <p className="text-xs text-slate-500">Ranked by SERVEON Acquisition Score (Market Potential × Accessibility × Port Margin)</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            Acquisition Opportunities
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Area / District</th>
                <th className="py-3 px-4 text-center">Strategic Role</th>
                <th className="py-3 px-4 text-right">Acquisition Score</th>
                <th className="py-3 px-4 text-right">Market Potential</th>
                <th className="py-3 px-4 text-right">Accessibility</th>
                <th className="py-3 px-4 text-right">Growth Rate</th>
                <th className="py-3 px-4 text-right">Confidence</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80">
              {acqRankings.map((area) => {
                const isSelected = area.id === selectedAreaId;
                return (
                  <tr
                    key={area.id}
                    onClick={() => onSelectArea(area.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-emerald-50/70 font-semibold text-emerald-900'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs ${
                          area.objectives.acquisition.rank === 1
                            ? 'bg-emerald-600 text-white'
                            : area.objectives.acquisition.rank === 2
                            ? 'bg-emerald-100 text-emerald-800'
                            : area.objectives.acquisition.rank === 3
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        #{area.objectives.acquisition.rank}
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
                      {area.objectives.acquisition.score}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-700">
                      {area.marketPotentialScore}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-700">
                      {area.accessibilityScore}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-700">
                      +{area.customerGrowthRate}%
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-700 font-bold">
                      {area.confidenceScore}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectArea(area.id);
                          onNavigate('candidate-detail', area.id);
                        }}
                        className="px-2.5 py-1 rounded border border-slate-300 hover:border-emerald-500 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 font-semibold text-[11px] transition-colors"
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
