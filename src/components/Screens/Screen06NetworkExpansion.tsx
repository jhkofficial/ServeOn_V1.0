import React, { useState } from 'react';
import { AreaIntelligence, ScreenId } from '../../types';
import { EXPANSION_GATE_THRESHOLDS, SEMARANG_AREAS } from '../../data/semarangData';
import { KpiCard } from '../Common/KpiCard';
import { StrategicRoleBadge } from '../Common/StrategicRoleBadge';
import { 
  Network, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  AlertOctagon, 
  Sliders, 
  Info, 
  ArrowRight,
  TrendingDown,
  Layers,
  HelpCircle
} from 'lucide-react';

interface Props {
  areas: AreaIntelligence[];
  selectedAreaId: string;
  onSelectArea: (id: string) => void;
  onNavigate: (screen: ScreenId, areaId?: string) => void;
}

export const Screen06NetworkExpansion: React.FC<Props> = ({
  areas = [],
  selectedAreaId,
  onSelectArea,
  onNavigate,
}) => {
  const [showSimulator, setShowSimulator] = useState(false);
  const [simulatedRelativeGap, setSimulatedRelativeGap] = useState(EXPANSION_GATE_THRESHOLDS.relativeCoverageGapMin);
  const [simulatedAbsoluteGap, setSimulatedAbsoluteGap] = useState(EXPANSION_GATE_THRESHOLDS.absoluteCoverageGapMin);
  const [simulatedDensity, setSimulatedDensity] = useState(EXPANSION_GATE_THRESHOLDS.customerDensityMin);

  const safeAreas = areas && areas.length > 0 ? areas : SEMARANG_AREAS;

  // Filter eligible areas based on strict gates or simulator
  const eligibleAreas = safeAreas.filter((area) => {
    if (!showSimulator) {
      return area.expansionGate.allPassed;
    }
    return (
      area.marketPotentialScore >= EXPANSION_GATE_THRESHOLDS.marketPotentialMin &&
      area.accessibilityScore >= EXPANSION_GATE_THRESHOLDS.accessibilityMin &&
      area.customerDensity >= simulatedDensity &&
      area.relativeCoverageGapScore >= simulatedRelativeGap &&
      area.absoluteCoverageGapScore >= simulatedAbsoluteGap
    );
  });

  const selectedArea = safeAreas.find((a) => a.id === selectedAreaId) || SEMARANG_AREAS.find((a) => a.id === selectedAreaId) || SEMARANG_AREAS[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider font-mono">
              Screen 06 • Objective: Network Expansion
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">Physical Capex Governance</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Where is physical network investment justified?
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Strict 5-point eligibility gating prevents premature capital expenditure in saturated urban zones or uneconomic low-density terrains.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSimulator(!showSimulator)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
              showSimulator
                ? 'bg-purple-900 text-white border-purple-900'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showSimulator ? 'Close Gate Simulator' : 'Test Gate Sensitivity'}</span>
          </button>
        </div>
      </div>

      {/* KPI Row (Block 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Eligible Expansion Areas"
          value={eligibleAreas.length}
          subValue="Passed all 5 criteria"
          trend={{ value: '0 / 16 passed', direction: 'down' }}
          badge={{ text: 'Gate Enforced', variant: 'purple' }}
          icon={AlertOctagon}
        />
        <KpiCard
          label="Absolute Coverage Gap"
          value="18% Peak"
          subValue="Gunungpati (Gate: >= 15%)"
          tooltip="Absolute unserved territory threshold"
          icon={Layers}
        />
        <KpiCard
          label="Relative Coverage Gap"
          value="58% Peak"
          subValue="Mijen (Gate: >= 45%)"
          tooltip="Port capacity exhaust and coverage lag vs demand"
          icon={Network}
        />
        <KpiCard
          label="Qualified Candidates"
          value={eligibleAreas.length === 0 ? 'None' : `${eligibleAreas.length} Qualified`}
          subValue="Investment Status"
          badge={{ text: eligibleAreas.length === 0 ? 'Preserve Capex' : 'Ready', variant: eligibleAreas.length === 0 ? 'red' : 'emerald' }}
          icon={CheckCircle2}
        />
      </div>

      {/* The 5-Point Eligibility Gate Rule Display */}
      <div className="rounded-xl border border-purple-200 bg-purple-50/40 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-purple-600 text-white">
              <Network className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">SERVEON V2.1 Physical Expansion Gate Thresholds</h3>
              <p className="text-xs text-slate-500">All 5 criteria must strictly pass before an area enters TOPSIS ranking</p>
            </div>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200 shrink-0">
            Mandatory Gate Logic
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
          <div className="p-2.5 rounded-lg bg-white border border-purple-200/80 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Criterion 1</span>
            <div className="font-bold text-slate-900 text-xs mt-0.5">Market Potential</div>
            <div className="font-mono text-sm font-bold text-purple-700 mt-1">≥ 45 / 100</div>
          </div>
          <div className="p-2.5 rounded-lg bg-white border border-purple-200/80 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Criterion 2</span>
            <div className="font-bold text-slate-900 text-xs mt-0.5">Accessibility</div>
            <div className="font-mono text-sm font-bold text-purple-700 mt-1">≥ 50 / 100</div>
          </div>
          <div className="p-2.5 rounded-lg bg-white border border-purple-200/80 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Criterion 3</span>
            <div className="font-bold text-slate-900 text-xs mt-0.5">Customer Density</div>
            <div className="font-mono text-sm font-bold text-purple-700 mt-1">≥ 30 / 100</div>
          </div>
          <div className="p-2.5 rounded-lg bg-white border border-purple-200/80 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Criterion 4</span>
            <div className="font-bold text-slate-900 text-xs mt-0.5">Relative Gap</div>
            <div className="font-mono text-sm font-bold text-purple-700 mt-1">≥ 45 / 100</div>
          </div>
          <div className="p-2.5 rounded-lg bg-white border border-purple-200/80 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Criterion 5</span>
            <div className="font-bold text-slate-900 text-xs mt-0.5">Absolute Gap</div>
            <div className="font-mono text-sm font-bold text-purple-700 mt-1">≥ 15 / 100</div>
          </div>
        </div>

        {/* Optional Simulator Controls */}
        {showSimulator && (
          <div className="mt-3 pt-3 border-t border-purple-200 p-3 bg-white rounded-lg space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Interactive Sensitivity Testing</span>
              <span className="text-slate-500 text-[11px]">Adjust thresholds to simulate scenario relaxation</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="flex justify-between text-[11px] font-medium text-slate-700 mb-1">
                  <span>Relative Gap Min:</span>
                  <span className="font-mono font-bold text-purple-700">{simulatedRelativeGap}</span>
                </label>
                <input
                  type="range"
                  min="20"
                  max="60"
                  value={simulatedRelativeGap}
                  onChange={(e) => setSimulatedRelativeGap(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>
              <div>
                <label className="flex justify-between text-[11px] font-medium text-slate-700 mb-1">
                  <span>Absolute Gap Min:</span>
                  <span className="font-mono font-bold text-purple-700">{simulatedAbsoluteGap}</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="20"
                  value={simulatedAbsoluteGap}
                  onChange={(e) => setSimulatedAbsoluteGap(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>
              <div>
                <label className="flex justify-between text-[11px] font-medium text-slate-700 mb-1">
                  <span>Customer Density Min:</span>
                  <span className="font-mono font-bold text-purple-700">{simulatedDensity}</span>
                </label>
                <input
                  type="range"
                  min="15"
                  max="40"
                  value={simulatedDensity}
                  onChange={(e) => setSimulatedDensity(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>
            </div>
            <div className="text-right">
              <button
                onClick={() => {
                  setSimulatedRelativeGap(EXPANSION_GATE_THRESHOLDS.relativeCoverageGapMin);
                  setSimulatedAbsoluteGap(EXPANSION_GATE_THRESHOLDS.absoluteCoverageGapMin);
                  setSimulatedDensity(EXPANSION_GATE_THRESHOLDS.customerDensityMin);
                }}
                className="text-[11px] font-semibold text-purple-700 hover:underline"
              >
                Reset to V2.1 Baseline
              </button>
            </div>
          </div>
        )}
      </div>

      {/* STATE B: NO QUALIFIED CANDIDATE (Core Blueprint Requirement) */}
      {eligibleAreas.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-rose-200 bg-rose-50/40 p-8 text-center space-y-4 shadow-2xs">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-rose-100 text-rose-600 mb-1 shadow-xs">
            <AlertOctagon className="w-8 h-8" />
          </div>

          <div className="max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
              NO QUALIFIED CANDIDATE
            </h2>
            <p className="text-sm font-medium text-slate-700 leading-relaxed">
              No area currently satisfies the minimum market potential (≥45), accessibility (≥50), customer density (≥30), relative coverage gap (≥45) and absolute coverage gap (≥15) requirements.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-rose-200 max-w-xl mx-auto text-left shadow-xs space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>SERVEON Strategic Recommendation:</span>
            </div>
            <p className="text-xs text-slate-800 font-semibold leading-relaxed">
              Maintain current network and continue monitoring market and coverage. Do not commit physical capital expenditure at this time.
            </p>
            <p className="text-[11px] text-slate-500 leading-normal">
              Direct growth capital toward <strong>New Customer Acquisition</strong> (filling spare port capacity in Pedurungan and Gayamsari) rather than building redundant physical fiber.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold">
            <button
              onClick={() => onNavigate('acquisition')}
              className="px-4 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors"
            >
              Redirect to Acquisition Demand Testing →
            </button>
            <button
              onClick={() => onNavigate('candidate-detail', 'gunungpati')}
              className="px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
            >
              Inspect Closest Candidate (Gunungpati)
            </button>
          </div>
        </div>
      ) : (
        /* STATE A: If candidates qualify (or simulated) */
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Qualified Candidates Under Active Scenario ({eligibleAreas.length})
            </h3>
          </div>
          <p className="text-xs text-slate-600">
            Passing candidates must proceed to Feasibility Study + Field Survey + Cannibalization Review prior to physical build.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {eligibleAreas.map((area) => (
              <div key={area.id} className="p-3 bg-white rounded-lg border border-emerald-200 shadow-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-sm">{area.name}</span>
                  <StrategicRoleBadge role={area.strategicRole} size="sm" />
                </div>
                <div className="mt-2 text-xs space-y-1 text-slate-600">
                  <div>Market Potential: <strong className="text-slate-900">{area.marketPotentialScore}</strong></div>
                  <div>Density: <strong className="text-slate-900">{area.customerDensity}</strong></div>
                  <div>Relative Gap: <strong className="text-slate-900">{area.relativeCoverageGapScore}</strong></div>
                </div>
                <button
                  onClick={() => onNavigate('candidate-detail', area.id)}
                  className="mt-3 w-full py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
                >
                  Inspect Feasibility
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Diagnostic Gate Evaluation Table for All 16 Districts */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Transparent Gate Diagnostic: 16 Districts</h3>
            <p className="text-xs text-slate-500">Shows exactly why each area passes or fails the 5 individual criteria</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
            Gate Audit
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4 text-center">Market Potential (≥45)</th>
                <th className="py-3 px-4 text-center">Accessibility (≥50)</th>
                <th className="py-3 px-4 text-center">Customer Density (≥30)</th>
                <th className="py-3 px-4 text-center">Relative Gap (≥45)</th>
                <th className="py-3 px-4 text-center">Absolute Gap (≥15)</th>
                <th className="py-3 px-4 text-center">Final Gate Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80">
              {areas.map((area) => {
                const gate = area.expansionGate;
                const isSelected = area.id === selectedAreaId;
                return (
                  <tr
                    key={area.id}
                    onClick={() => onSelectArea(area.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-purple-50/60 font-semibold text-purple-900'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {area.name}
                      <span className="text-[10px] text-slate-500 font-mono ml-1">({area.code})</span>
                    </td>

                    {/* Market Potential */}
                    <td className="py-3 px-4 text-center font-mono">
                      <span className={`inline-flex items-center gap-1 ${gate.marketPotentialPass ? 'text-emerald-700' : 'text-rose-600 font-bold'}`}>
                        {gate.marketPotentialPass ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {gate.marketPotentialValue}
                      </span>
                    </td>

                    {/* Accessibility */}
                    <td className="py-3 px-4 text-center font-mono">
                      <span className={`inline-flex items-center gap-1 ${gate.accessibilityPass ? 'text-emerald-700' : 'text-rose-600 font-bold'}`}>
                        {gate.accessibilityPass ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {gate.accessibilityValue}
                      </span>
                    </td>

                    {/* Customer Density */}
                    <td className="py-3 px-4 text-center font-mono">
                      <span className={`inline-flex items-center gap-1 ${gate.customerDensityPass ? 'text-emerald-700' : 'text-rose-600 font-bold'}`}>
                        {gate.customerDensityPass ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {gate.customerDensityValue}
                      </span>
                    </td>

                    {/* Relative Coverage Gap */}
                    <td className="py-3 px-4 text-center font-mono">
                      <span className={`inline-flex items-center gap-1 ${gate.relativeCoverageGapPass ? 'text-emerald-700' : 'text-rose-600 font-bold'}`}>
                        {gate.relativeCoverageGapPass ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {gate.relativeCoverageGapValue}
                      </span>
                    </td>

                    {/* Absolute Coverage Gap */}
                    <td className="py-3 px-4 text-center font-mono">
                      <span className={`inline-flex items-center gap-1 ${gate.absoluteCoverageGapPass ? 'text-emerald-700' : 'text-rose-600 font-bold'}`}>
                        {gate.absoluteCoverageGapPass ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {gate.absoluteCoverageGapValue}
                      </span>
                    </td>

                    {/* Final Status */}
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700 border border-rose-200">
                        FAILS GATE ({gate.failedGates.length})
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectArea(area.id);
                          onNavigate('candidate-detail', area.id);
                        }}
                        className="px-2 py-0.5 rounded border border-slate-300 hover:border-purple-500 bg-white hover:bg-purple-50 text-slate-700 font-medium text-[11px]"
                      >
                        Detail
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
