import React, { useState, useEffect } from 'react';
import { 
  ActionPlanItem, 
  BusinessObjective, 
  MeasurementMethodType 
} from '../../types';
import { 
  X, 
  CheckCircle2, 
  Calendar, 
  DollarSign, 
  Users, 
  Target, 
  BarChart3, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Sliders,
  Layers
} from 'lucide-react';

interface CreateActionPlanDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveActionPlan: (plan: ActionPlanItem) => void;
  initialRecommendation?: {
    recommendationId: string;
    objective: BusinessObjective;
    areaId: string;
    areaName: string;
    recommendedAction: string;
  } | null;
}

export const CreateActionPlanDrawer: React.FC<CreateActionPlanDrawerProps> = ({
  isOpen,
  onClose,
  onSaveActionPlan,
  initialRecommendation,
}) => {
  const [recommendationId, setRecommendationId] = useState('REC-RET-202609-001');
  const [objective, setObjective] = useState<BusinessObjective>('RETENTION');
  const [areaName, setAreaName] = useState('Semarang Selatan');
  const [areaId, setAreaId] = useState('semarang-selatan');
  const [actionName, setActionName] = useState('Targeted Retention Campaign & VIP Loyalty Guard');
  const [owner, setOwner] = useState('CRM Regional Jawa Tengah');
  const [businessUnit, setBusinessUnit] = useState('Consumer CRM & Loyalty');
  const [region, setRegion] = useState('Jawa Tengah');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-10-31');
  const [budget, setBudget] = useState('50000000');
  const [targetCustomers, setTargetCustomers] = useState('5000');

  // Baseline
  const [baselinePeriod, setBaselinePeriod] = useState('Jul–Aug 2026 (60-day baseline)');
  const [baselineKpi, setBaselineKpi] = useState('Customer Retention Rate');
  const [baselineValue, setBaselineValue] = useState('72%');

  // Target
  const [primaryKpi, setPrimaryKpi] = useState('Incremental Retention Uplift');
  const [targetValue, setTargetValue] = useState('78% (+6 ppt uplift)');
  const [secondaryKpi, setSecondaryKpi] = useState('Incremental Revenue (Rp150M)');
  const [measurementPeriod, setMeasurementPeriod] = useState('30 Days Post-Intervention');

  // Measurement Method
  const [measurementMethod, setMeasurementMethod] = useState<MeasurementMethodType>('Treatment vs Control');

  useEffect(() => {
    if (initialRecommendation) {
      setRecommendationId(initialRecommendation.recommendationId);
      setObjective(initialRecommendation.objective);
      setAreaId(initialRecommendation.areaId);
      setAreaName(initialRecommendation.areaName);
      setActionName(initialRecommendation.recommendedAction);

      if (initialRecommendation.objective === 'RETENTION') {
        setBaselineKpi('Baseline Retention Rate');
        setBaselineValue('72%');
        setPrimaryKpi('Incremental Retention Uplift');
        setTargetValue('78% (+6 ppt)');
        setSecondaryKpi('Incremental Revenue');
        setBudget('50000000');
        setTargetCustomers('5000');
        setMeasurementMethod('Treatment vs Control');
      } else if (initialRecommendation.objective === 'MARKET_DEFENSE') {
        setBaselineKpi('Defended Area Retention Rate');
        setBaselineValue('73%');
        setPrimaryKpi('Customer Retention in Defense Area');
        setTargetValue('78% (+5 ppt)');
        setSecondaryKpi('Revenue Protected');
        setBudget('65000000');
        setTargetCustomers('4200');
        setMeasurementMethod('Before vs After');
      } else if (initialRecommendation.objective === 'ACQUISITION') {
        setBaselineKpi('Baseline Gross Adds / Mo');
        setBaselineValue('310 accounts/mo');
        setPrimaryKpi('Incremental New Customers');
        setTargetValue('+1,450 New Subscribers');
        setSecondaryKpi('Customer Acquisition Cost (< Rp35k)');
        setBudget('45000000');
        setTargetCustomers('8500');
        setMeasurementMethod('Pilot vs Comparison Area');
      } else if (initialRecommendation.objective === 'EXPANSION') {
        setBaselineKpi('Catchment Coverage Gap');
        setBaselineValue('42% Unserved');
        setPrimaryKpi('Site Feasibility Validation');
        setTargetValue('Pass 5 Physical Gates (100%)');
        setSecondaryKpi('Payback Period (< 15 Mos)');
        setBudget('850000000');
        setTargetCustomers('24000');
        setMeasurementMethod('Historical Benchmark');
      }
    }
  }, [initialRecommendation]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPlan: ActionPlanItem = {
      id: `ACT-${Date.now().toString().slice(-6)}`,
      recommendationId,
      name: actionName,
      objective,
      areaId,
      areaName,
      owner,
      businessUnit,
      region,
      startDate,
      endDate,
      budget: Number(budget) || 50000000,
      budgetUsed: 0,
      targetCustomers: Number(targetCustomers) || 5000,
      contacted: 0,
      responded: 0,
      returned: 0,
      currentReturnRate: 0,
      targetReturnRate: 18.0,
      progress: 0,
      status: 'IN EXECUTION',
      health: 'ON TRACK',
      baseline: {
        period: baselinePeriod,
        kpi: baselineKpi,
        value: baselineValue,
      },
      target: {
        primaryKpi,
        targetValue,
        secondaryKpi,
        measurementPeriod,
      },
      measurementMethod,
      confidence: 'HIGH',
      notes: `Operational execution authorized from Recommendation ${recommendationId}`,
    };

    onSaveActionPlan(newPlan);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 overflow-y-auto">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-start justify-between shrink-0 sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                SCREEN G • OPERATIONAL TRANSITION
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {recommendationId}
              </span>
            </div>
            <h2 className="text-xl font-black tracking-tight text-white mt-1">
              Create Action Plan
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Transform approved SERVEON recommendation into an accountable, measurable field action plan.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1 text-xs">
          {/* Recommendation Metadata Box */}
          <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block font-mono">
                SOURCE RECOMMENDATION
              </span>
              <div className="font-bold text-slate-900 text-sm mt-0.5">
                {areaName} • {objective.replace('_', ' ')}
              </div>
              <div className="text-[11px] text-blue-900 font-mono mt-0.5">
                Ref ID: <span className="font-bold">{recommendationId}</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              Approved
            </span>
          </div>

          {/* Section 1: ACTION INFORMATION */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 pb-2 border-b border-slate-200">
              <Sparkles className="w-4 h-4 text-blue-700" />
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Action Information
              </h3>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Action Name <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={actionName}
                onChange={(e) => setActionName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Action Owner <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Business Unit
                </label>
                <input
                  type="text"
                  value={businessUnit}
                  onChange={(e) => setBusinessUnit(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Region</label>
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Start Date</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">End Date</label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Operational Budget (IDR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 font-semibold text-xs">Rp</span>
                  <input
                    type="number"
                    required
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-hidden font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Target Customers / Accounts
                </label>
                <input
                  type="number"
                  required
                  value={targetCustomers}
                  onChange={(e) => setTargetCustomers(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-hidden font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 2: BASELINE */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 pb-2 border-b border-slate-200">
              <BarChart3 className="w-4 h-4 text-slate-700" />
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Baseline (Pre-Intervention Reference)
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Baseline Period</label>
                <input
                  type="text"
                  value={baselinePeriod}
                  onChange={(e) => setBaselinePeriod(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Baseline KPI</label>
                <input
                  type="text"
                  value={baselineKpi}
                  onChange={(e) => setBaselineKpi(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Baseline Value</label>
                <input
                  type="text"
                  value={baselineValue}
                  onChange={(e) => setBaselineValue(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-hidden font-mono font-bold text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Section 3: TARGET */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 pb-2 border-b border-slate-200">
              <Target className="w-4 h-4 text-emerald-700" />
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Target Business Objectives
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Primary KPI</label>
                <input
                  type="text"
                  value={primaryKpi}
                  onChange={(e) => setPrimaryKpi(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Value</label>
                <input
                  type="text"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold text-emerald-800 focus:ring-2 focus:ring-blue-600 focus:outline-hidden font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Secondary KPI</label>
                <input
                  type="text"
                  value={secondaryKpi}
                  onChange={(e) => setSecondaryKpi(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Measurement Period</label>
                <input
                  type="text"
                  value={measurementPeriod}
                  onChange={(e) => setMeasurementPeriod(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section 4: MEASUREMENT METHOD */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 pb-2 border-b border-slate-200">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Rigorous Measurement Method
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                {
                  id: 'Treatment vs Control',
                  label: 'Treatment vs Control',
                  desc: 'Randomized 50/50 customer split within target cluster (Gold Standard)',
                },
                {
                  id: 'Before vs After',
                  label: 'Before vs After',
                  desc: 'Pre-intervention baseline vs post-intervention window analysis',
                },
                {
                  id: 'Pilot vs Comparison Area',
                  label: 'Pilot vs Comparison Area',
                  desc: 'Comparing active district vs demographically matched twin district',
                },
                {
                  id: 'Historical Benchmark',
                  label: 'Historical Benchmark',
                  desc: 'Comparing outcome against multi-year seasonal average run-rates',
                },
              ].map((m) => (
                <div
                  key={m.id}
                  onClick={() => setMeasurementMethod(m.id as MeasurementMethodType)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    measurementMethod === m.id
                      ? 'bg-blue-50/80 border-blue-600 ring-1 ring-blue-500 text-blue-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>{m.label}</span>
                    {measurementMethod === m.id && <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" />}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 leading-snug">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer CTAs */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-black tracking-wider uppercase shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <span>START EXECUTION</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
