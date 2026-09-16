import React, { useState } from 'react';
import { AreaIntelligence, ScreenId } from '../../types';
import { SEMARANG_AREAS } from '../../data/semarangData';
import { StrategicRoleBadge } from '../Common/StrategicRoleBadge';
import { ConfidenceIndicator } from '../Common/ConfidenceIndicator';
import { 
  Award, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Send, 
  FileCheck, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  AlertCircle,
  HelpCircle,
  MapPin,
  Share2,
  Download
} from 'lucide-react';

interface Props {
  areas: AreaIntelligence[];
  selectedAreaId: string;
  onSelectArea: (id: string) => void;
  onNavigate: (screen: ScreenId, areaId?: string) => void;
}

export const Screen09Recommendation: React.FC<Props> = ({
  areas = [],
  selectedAreaId,
  onSelectArea,
  onNavigate,
}) => {
  const safeAreas = areas && areas.length > 0 ? areas : SEMARANG_AREAS;
  const area = safeAreas.find((a) => a.id === selectedAreaId) || SEMARANG_AREAS.find((a) => a.id === selectedAreaId) || SEMARANG_AREAS[0];
  const { recommendation } = area;

  const [workflowStage, setWorkflowStage] = useState<'GENERATED' | 'REVIEWED' | 'APPROVED' | 'EXECUTED' | 'MEASURED'>(
    recommendation.workflowStage
  );
  const [approvalNote, setApprovalNote] = useState('');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNumber) ? prev.filter((s) => s !== stepNumber) : [...prev, stepNumber]
    );
  };

  const stages = [
    { id: 'GENERATED', label: 'Generated', desc: 'AI/Analytics recommendation drafted' },
    { id: 'REVIEWED', label: 'Reviewed', desc: 'Regional planning validation' },
    { id: 'APPROVED', label: 'Approved', desc: 'Management sign-off granted' },
    { id: 'EXECUTED', label: 'Executed', desc: 'Field operations underway' },
    { id: 'MEASURED', label: 'Measured', desc: 'Business impact tracked' },
  ];

  const currentStageIndex = stages.findIndex((s) => s.id === workflowStage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider font-mono">
              Screen 09 • Final Decision Support
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">DECIDE Pillar</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            What should we do?
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Synthesized, explainable recommendation with operational action milestones and management governance approval lifecycle.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('strategic-map')}
            className="px-3.5 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Map View</span>
          </button>
          <button
            onClick={() => setShowApprovalModal(true)}
            className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <FileCheck className="w-4 h-4" />
            <span>Approve &amp; Endorse Action</span>
          </button>
        </div>
      </div>

      {/* Decision Card (Block 1 - Signature Decision Card from Blueprint) */}
      <div className="rounded-2xl border-2 border-blue-600 bg-white p-6 shadow-md relative overflow-hidden">
        {/* Subtle decorative accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50/50 rounded-full blur-2xl pointer-events-none -mr-12 -mt-12" />

        <div className="relative z-10 space-y-5">
          {/* Top Row: Area, Role, Objective, Priority, Confidence */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                Official SERVEON Decision Card • Area Reference: {area.code}
              </span>
              <div className="flex items-center gap-3 mt-1">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {area.name}
                </h2>
                <StrategicRoleBadge role={area.strategicRole} size="lg" />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Objective</span>
                <span className="font-extrabold text-blue-800 font-sans">{recommendation.primaryObjective}</span>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-xs">
                <span className="text-blue-600 block text-[10px] uppercase font-bold">Priority Level</span>
                <span className="font-extrabold text-blue-900">{recommendation.priority}</span>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                <span className="text-emerald-700 block text-[10px] uppercase font-bold">Evidence Confidence</span>
                <span className="font-extrabold text-emerald-900 font-mono">{area.confidenceScore}%</span>
              </div>
            </div>
          </div>

          {/* Block 2: WHY Supporting Reasons */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>WHY THIS DECISION (Top Analytical Drivers):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              {area.businessReasons.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Block 3: RECOMMENDED ACTION */}
          <div className="p-4 rounded-xl bg-blue-900 text-white shadow-xs space-y-1.5">
            <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block font-mono">
              RECOMMENDED ACTION
            </span>
            <div className="text-lg sm:text-xl font-bold tracking-tight text-white">
              {recommendation.recommendedAction}
            </div>
            <p className="text-xs text-blue-100 leading-relaxed max-w-4xl">
              {recommendation.executiveSummary}
            </p>
          </div>

          {/* Block 4: NEXT ACTIONS (3-5 actionable steps) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                NEXT ACTIONS &amp; OPERATIONAL CADENCE ({completedSteps.length}/{recommendation.nextActions.length} Started)
              </span>
              <span className="text-slate-500 text-[11px]">Click checkbox to toggle milestone execution</span>
            </div>

            <div className="space-y-2">
              {recommendation.nextActions.map((action) => {
                const isDone = completedSteps.includes(action.step);
                return (
                  <div
                    key={action.step}
                    onClick={() => toggleStep(action.step)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      isDone
                        ? 'bg-blue-50/50 border-blue-300'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                          <span>Step {action.step}: {action.title}</span>
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            Owner: {action.owner}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                          {action.detail}
                        </p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                      isDone ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {isDone ? 'Initiated' : 'Pending'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Block 5: Future Workflow Lifecycle (Generated → Reviewed → Approved → Executed → Measured) */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Governance Decision Lifecycle</h3>
            <p className="text-xs text-slate-500">
              Generated → Reviewed → Approved → Executed → Measured
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Current Status:</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              {workflowStage}
            </span>
          </div>
        </div>

        {/* 5-Step Process Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
          {stages.map((stg, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <div
                key={stg.id}
                onClick={() => setWorkflowStage(stg.id as any)}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                  isCurrent
                    ? 'border-blue-600 bg-blue-50/80 shadow-xs ring-1 ring-blue-500'
                    : isCompleted
                    ? 'border-emerald-200 bg-emerald-50/40 text-emerald-950'
                    : 'border-slate-200 bg-slate-50/50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold font-mono">Stage {idx + 1}</span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : isCurrent ? (
                    <Clock className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-slate-300" />
                  )}
                </div>
                <div className="font-bold text-slate-900 text-xs mt-1.5">{stg.label}</div>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{stg.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Approval Modal / Action Endorsement Dialogue */}
      {showApprovalModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <FileCheck className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-base">Management Endorsement</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              You are endorsing the <strong>{recommendation.recommendedAction}</strong> for <strong>{area.name}</strong> under the <strong>{recommendation.primaryObjective}</strong> objective.
            </p>

            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-slate-700">Executive Endorsement Note (Optional):</label>
              <textarea
                value={approvalNote}
                onChange={(e) => setApprovalNote(e.target.value)}
                placeholder="e.g., Endorsed for immediate Q4 budget authorization. VIP retention hotline prioritized."
                className="w-full h-24 p-3 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 text-xs font-semibold">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setWorkflowStage('APPROVED');
                  setShowApprovalModal(false);
                }}
                className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white shadow-xs"
              >
                Confirm Management Approval
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
