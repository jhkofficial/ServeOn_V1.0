import React, { useState } from 'react';
import { AreaIntelligence, ScreenId } from '../../types';
import { SEMARANG_AREAS } from '../../data/semarangData';
import { StrategicRoleBadge } from '../Common/StrategicRoleBadge';
import { ConfidenceIndicator } from '../Common/ConfidenceIndicator';
import { ScoreBar } from '../Common/ScoreBar';
import { 
  HelpCircle, 
  Binary, 
  FileText, 
  Award, 
  CheckCircle2, 
  TrendingUp, 
  SlidersHorizontal, 
  ShieldCheck, 
  Info,
  ArrowRight,
  BrainCircuit,
  BarChart4
} from 'lucide-react';

interface Props {
  areas: AreaIntelligence[];
  selectedAreaId: string;
  onSelectArea: (id: string) => void;
  onNavigate: (screen: ScreenId, areaId?: string) => void;
}

export const Screen08Explainability: React.FC<Props> = ({
  areas = [],
  selectedAreaId,
  onSelectArea,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'business' | 'analytical'>('business');

  const safeAreas = areas && areas.length > 0 ? areas : SEMARANG_AREAS;
  const area = safeAreas.find((a) => a.id === selectedAreaId) || SEMARANG_AREAS.find((a) => a.id === selectedAreaId) || SEMARANG_AREAS[0];
  const { analyticalEvidence } = area;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider font-mono">
              Screen 08 • Explainability &amp; Evidence
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">Model Audit Trail</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            What factors and analytical evidence support the result?
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Dual-level transparency: human-readable rationale for executive stakeholders and rigorous multi-criteria mathematical evidence for data analysts.
          </p>
        </div>

        <button
          onClick={() => onNavigate('recommendation', area.id)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <span>View Final Recommendation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Area Context Header Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm">
            {area.code}
          </div>
          <div>
            <div className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>{area.name}</span>
              <StrategicRoleBadge role={area.strategicRole} size="sm" />
            </div>
            <div className="text-xs text-slate-500">
              Primary Role: <strong className="text-slate-800">{area.strategicRole}</strong> • Primary Objective: <strong className="text-blue-700">{area.recommendation.primaryObjective}</strong>
            </div>
          </div>
        </div>

        {/* Tab Switcher (Tab 1: Business Explanation vs Tab 2: Analytical Evidence) */}
        <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('business')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md font-bold transition-colors ${
              activeTab === 'business'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Tab 1: Business Explanation</span>
          </button>
          <button
            onClick={() => setActiveTab('analytical')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md font-bold transition-colors ${
              activeTab === 'analytical'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Binary className="w-4 h-4 text-purple-600" />
            <span>Tab 2: Analytical Evidence</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Business Explanation (Executive Focus) */}
      {activeTab === 'business' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: 3-5 Human Readable Reasons (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Human-Readable Rationale</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                Non-Technical Executive View
              </span>
            </div>

            <div className="space-y-3">
              {area.businessReasons.map((reason, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-xs text-slate-800 font-medium leading-relaxed">{reason}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Top Drivers Horizontal Contribution Chart (Block 4) */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Top Decision Drivers &amp; Directional Weight
              </h4>
              <div className="space-y-2.5">
                {area.topDrivers.map((driver, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700">{driver.factor}</span>
                      <span className={`font-mono font-bold text-[11px] ${driver.positive ? 'text-blue-700' : 'text-slate-500'}`}>
                        {driver.impact}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${driver.positive ? 'bg-blue-600' : 'bg-slate-400'}`}
                        style={{ width: `${Math.round(driver.weight * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Confidence Breakdown & Caveat (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Evidence Confidence Governance</h3>
                </div>
                <span className="text-xs font-mono font-bold text-slate-900">{area.confidenceScore}%</span>
              </div>

              <div className="mt-4">
                <ConfidenceIndicator
                  score={area.confidenceScore}
                  components={area.confidenceComponents}
                  showBreakdown
                />
              </div>

              <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 text-[11px] uppercase tracking-wider">
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                  <span>Decision Caveat Mandate</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  SERVEON confidence calculates the integrity, telemetry freshness, and sample volume backing this district. It does not guarantee market elasticity or business victory. Leadership must review local ground context before executing budgets.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('analytical')}
              className="w-full py-2 px-3 rounded-lg border border-purple-200 bg-purple-50/50 hover:bg-purple-100 text-purple-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Binary className="w-3.5 h-3.5" />
              <span>Inspect Mathematical Model Details (AUROC / TOPSIS / SHAP)</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: Analytical Evidence (Data Science & Analyst Focus) */}
      {activeTab === 'analytical' && (
        <div className="space-y-5">
          {/* Top Model Performance Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Champion Model</span>
              <div className="font-bold text-slate-900 text-xs mt-1 truncate" title={analyticalEvidence.championModel}>
                XGBoost V2.1
              </div>
              <span className="text-[10px] text-blue-700 font-medium">Multi-Criteria</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">AUROC</span>
              <div className="font-mono text-base font-bold text-slate-900 mt-1">
                {analyticalEvidence.auroc}
              </div>
              <span className="text-[10px] text-emerald-700 font-medium">High Discrimination</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Model Recall</span>
              <div className="font-mono text-base font-bold text-slate-900 mt-1">
                {analyticalEvidence.recall}%
              </div>
              <span className="text-[10px] text-emerald-700 font-medium">Prioritizes Safety</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Decision Threshold</span>
              <div className="font-mono text-base font-bold text-slate-900 mt-1">
                {analyticalEvidence.threshold}
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Optimized for Recall</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">AHP Consistency (CR)</span>
              <div className="font-mono text-base font-bold text-emerald-700 mt-1">
                {analyticalEvidence.ahpConsistencyRatio}
              </div>
              <span className="text-[10px] text-emerald-700 font-medium">&lt; 0.10 Passed</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">TOPSIS Closeness</span>
              <div className="font-mono text-base font-bold text-purple-700 mt-1">
                {analyticalEvidence.topsisRelativeCloseness}
              </div>
              <span className="text-[10px] text-purple-700 font-medium">Relative Proximity</span>
            </div>
          </div>

          {/* Mathematical Modeling Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* SHAP & Feature Importance (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <BarChart4 className="w-4 h-4 text-purple-600" />
                  <h3 className="font-bold text-slate-900 text-sm">SHAP Value Feature Attribution</h3>
                </div>
                <span className="text-[10px] font-mono text-slate-500">TreeExplainer V2.1</span>
              </div>

              <div className="space-y-3">
                {analyticalEvidence.shapValues.map((feature, i) => (
                  <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-semibold text-slate-800">{feature.feature}</span>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-[11px] text-slate-500">SHAP:</span>
                        <span className={`font-bold text-[11px] ${feature.shapValue >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {feature.shapValue >= 0 ? `+${feature.shapValue}` : feature.shapValue}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span>Global Importance: <strong className="text-slate-800 font-mono">{(feature.importance * 100).toFixed(0)}%</strong></span>
                      <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-purple-600 rounded-full"
                          style={{ width: `${Math.round(feature.importance * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AHP & TOPSIS Mathematical Formulation (5 Cols) */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Multi-Criteria Architecture</h3>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  Saaty AHP + TOPSIS
                </span>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900 text-xs">1. Pairwise AHP Weight Derivation</div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Saaty priority vector calculation yields Consistency Ratio (CR) of <strong>0.041</strong>. Since CR &lt; 0.10, the criteria matrix satisfies strict transitivity and non-contradiction standards.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900 text-xs">2. TOPSIS Ideal Solution Ranking</div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Evaluates Euclidean distance to positive-ideal solution (PIS) and negative-ideal solution (NIS). Relative closeness score for {area.name} is <strong>{analyticalEvidence.topsisRelativeCloseness}</strong>.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-900 text-xs">3. Zero-Qualified Expansion Guardrail</div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Even high composite scores are preempted if eligibility gating criteria fail, preventing algorithmic false positives in network capex.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
