import React, { useState } from 'react';
import { AreaIntelligence, ScreenId } from '../../types';
import { SEMARANG_AREAS } from '../../data/semarangData';
import { KpiCard } from '../Common/KpiCard';
import { StrategicRoleBadge } from '../Common/StrategicRoleBadge';
import { SemarangMap } from '../Map/SemarangMap';
import { ScoreBar } from '../Common/ScoreBar';
import { SpatialHexCell } from '../../data/semarangHexagons';
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
  Info,
  Hexagon,
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
  const [focusedHex, setFocusedHex] = useState<SpatialHexCell | null>(null);

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
            Identifikasi wilayah &amp; mikro-klaster pelanggan rentan churn di Kota Semarang. 
            Prioritaskan alokasi retensi pada area berdensitas tinggi dengan kontribusi ARPU terbesar.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => onNavigate('defend')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs shadow-2xs transition-colors"
          >
            Next: Defend Objective
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Top 4 KPI Cards (Block 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Retention Priority Leader"
          value={retentionRankings[0]?.name || 'Semarang Selatan'}
          subtitle={`Rank #1 • Score ${retentionRankings[0]?.objectives.retention.score}/100`}
          trend={{ value: 'Highest Risk-Value', isPositive: false }}
          accent="blue"
        />
        <KpiCard
          label="Total At-Risk Customers"
          value={`${totalHighRiskCustomers.toLocaleString()} accounts`}
          subtitle="Top 3 districts account for 48% of total risk"
          trend={{ value: '+4.2% MoM', isPositive: false }}
          accent="amber"
        />
        <KpiCard
          label="Avg. Retention Score"
          value="68.4 / 100"
          subtitle="Evaluated across 16 Semarang districts"
          accent="slate"
        />
        <KpiCard
          label="Protected Revenue Value"
          value="Rp 18.4 M / mo"
          subtitle="Potential monthly recurring revenue safeguarded"
          trend={{ value: 'Target: 85% saved', isPositive: true }}
          accent="emerald"
        />
      </div>

      {/* Map + Action Blueprint (Block 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Retention Map (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">Retention Risk &amp; Opportunity Map</h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                  <Hexagon className="w-3 h-3 text-amber-500" />
                  Pola Spasial Hexagonal
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Grid heksagonal multi-objektif mikro-sel (~860m): area indigo gelap menandakan urgensi penyelamatan retensi tertinggi
              </p>
            </div>
            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                Basemap + Hex Grid
              </span>
            </div>
          </div>

          <div className="my-3">
            <SemarangMap
              areas={safeAreas}
              selectedAreaId={selectedAreaId}
              onSelectArea={onSelectArea}
              activeLayer="RETENTION"
              heightClass="h-[430px]"
              initialBaseMode="tile"
              initialTileStyle="positron"
              initialSpatialPattern="hexagonal"
              initialHexMetric="RETENTION"
              showPatternToggle={true}
              onSelectHex={(hex) => setFocusedHex(hex)}
            />
          </div>

          {/* Micro-cell / District Focus Bar */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
            {focusedHex ? (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 font-bold text-blue-900">
                  <Hexagon className="w-3.5 h-3.5 text-blue-600" />
                  Cell {focusedHex.id} ({focusedHex.zoneName}):
                </span>
                <span className="text-slate-600">
                  Retensi <strong className="text-slate-900 font-mono">{focusedHex.retentionScore}/100</strong> • 
                  Risiko Churn <strong className="text-rose-700 font-mono">{focusedHex.churnRiskCount} akun ({focusedHex.churnRiskRate}%)</strong>
                </span>
              </div>
            ) : (
              <span>
                Fokus Wilayah: <strong className="text-slate-900">{selectedArea.name}</strong> (Rank #{selectedArea.objectives.retention.rank})
              </span>
            )}

            <button
              onClick={() => onNavigate('candidate-detail', selectedArea.id)}
              className="text-blue-700 font-semibold hover:underline flex items-center gap-1"
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

          {/* Hexagonal Micro-Zone Recommendation or Standardized Blueprint Action */}
          {focusedHex ? (
            <div className="mt-4 pt-3 border-t border-slate-200 bg-amber-50/50 p-3 rounded-lg border border-amber-200">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-900 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Rekomendasi Taktis Mikro-Cell ({focusedHex.zoneName})
              </div>
              <div className="mt-1 font-bold text-slate-900 text-xs">
                {focusedHex.primaryRecommendation}
              </div>
              <p className="mt-1 text-[11px] text-slate-600">
                Sasaran Utama: <span className="font-semibold text-slate-800">{focusedHex.dominantObjective}</span> • 
                Composite Score: <span className="font-semibold text-slate-800 font-mono">{focusedHex.compositeScore}/100</span>.
                Fokus intervensi langsung pada klaster radius 860 meter.
              </p>
            </div>
          ) : (
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
          )}
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
