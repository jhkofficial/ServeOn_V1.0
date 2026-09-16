import React, { useState } from 'react';
import { AreaIntelligence, ScreenId, StrategicRole } from '../../types';
import { SEMARANG_AREAS } from '../../data/semarangData';
import { SemarangMap } from '../Map/SemarangMap';
import { AreaSidePanel } from '../Map/AreaSidePanel';
import { StrategicRoleBadge } from '../Common/StrategicRoleBadge';
import { Filter, MapPin, Layers, Info, CheckCircle2 } from 'lucide-react';

interface Props {
  areas: AreaIntelligence[];
  selectedAreaId: string;
  onSelectArea: (id: string) => void;
  onNavigate: (screen: ScreenId, areaId?: string) => void;
}

export const Screen02StrategicActionMap: React.FC<Props> = ({
  areas = [],
  selectedAreaId,
  onSelectArea,
  onNavigate,
}) => {
  const [roleFilter, setRoleFilter] = useState<'ALL' | StrategicRole>('ALL');
  const [mapLayer, setMapLayer] = useState<'ROLE' | 'DENSITY' | 'COMPETITION' | 'ACQUISITION' | 'COVERAGE_GAP'>('ROLE');

  const sourceAreas = areas && areas.length > 0 ? areas : SEMARANG_AREAS;
  const selectedArea = sourceAreas.find((a) => a.id === selectedAreaId) || SEMARANG_AREAS.find((a) => a.id === selectedAreaId) || SEMARANG_AREAS[0];

  const filteredAreas = roleFilter === 'ALL'
    ? sourceAreas
    : sourceAreas.filter((a) => a.strategicRole === roleFilter);

  const roleCounts: Record<StrategicRole, number> = {
    PROTECT: SEMARANG_AREAS.filter((a) => a.strategicRole === 'PROTECT').length,
    DEFEND: SEMARANG_AREAS.filter((a) => a.strategicRole === 'DEFEND').length,
    ACQUIRE: SEMARANG_AREAS.filter((a) => a.strategicRole === 'ACQUIRE').length,
    EXPAND: SEMARANG_AREAS.filter((a) => a.strategicRole === 'EXPAND').length,
    MONITOR: SEMARANG_AREAS.filter((a) => a.strategicRole === 'MONITOR').length,
  };

  return (
    <div className="space-y-4">
      {/* Title & Question Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider font-mono">
              Screen 02 • Strategic Action Map
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">Signature SERVEON Map</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Where are the strategic priorities?
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Multi-objective spatial classification categorizing Kota Semarang's 16 districts into Protect, Defend, Acquire, Expand, and Monitor action postures.
          </p>
        </div>

        {/* Role Summary Counts Pill Group */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white rounded-xl border border-slate-200 shadow-2xs text-xs">
          <button
            onClick={() => setRoleFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
              roleFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All (16)
          </button>
          <button
            onClick={() => setRoleFilter('PROTECT')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition-colors ${
              roleFilter === 'PROTECT'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-blue-700 hover:bg-blue-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            PROTECT ({roleCounts.PROTECT})
          </button>
          <button
            onClick={() => setRoleFilter('DEFEND')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition-colors ${
              roleFilter === 'DEFEND'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-amber-800 hover:bg-amber-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            DEFEND ({roleCounts.DEFEND})
          </button>
          <button
            onClick={() => setRoleFilter('ACQUIRE')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition-colors ${
              roleFilter === 'ACQUIRE'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            ACQUIRE ({roleCounts.ACQUIRE})
          </button>
          <button
            onClick={() => setRoleFilter('EXPAND')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition-colors ${
              roleFilter === 'EXPAND'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-purple-800 hover:bg-purple-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            EXPAND ({roleCounts.EXPAND})
          </button>
          <button
            onClick={() => setRoleFilter('MONITOR')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition-colors ${
              roleFilter === 'MONITOR'
                ? 'bg-slate-600 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            MONITOR ({roleCounts.MONITOR})
          </button>
        </div>
      </div>

      {/* Main Map + Side Panel Layout (Map-First) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Central Map Surface (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-3">
          <SemarangMap
            areas={filteredAreas}
            selectedAreaId={selectedAreaId}
            onSelectArea={onSelectArea}
            activeLayer={mapLayer}
            onLayerChange={setMapLayer}
            heightClass="h-[560px]"
            initialSpatialPattern="hexagonal"
            initialHexMetric="DOMINANT_ROLE"
            showPatternToggle={true}
          />

          {/* Quick Area Cards below map */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs">
            <div className="flex items-center justify-between text-xs pb-2 mb-2 border-b border-slate-100">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Active Filter Areas ({filteredAreas.length})
              </span>
              <span className="text-slate-500 text-[11px]">Click to focus on district</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
              {filteredAreas.map((area) => (
                <button
                  key={area.id}
                  onClick={() => onSelectArea(area.id)}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    area.id === selectedAreaId
                      ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-100'
                      : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="text-[11px] font-bold text-slate-900 truncate">{area.name}</div>
                  <div className="mt-0.5 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">{area.code}</span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        area.strategicRole === 'PROTECT'
                          ? 'bg-blue-600'
                          : area.strategicRole === 'DEFEND'
                          ? 'bg-amber-500'
                          : area.strategicRole === 'ACQUIRE'
                          ? 'bg-emerald-500'
                          : area.strategicRole === 'EXPAND'
                          ? 'bg-purple-600'
                          : 'bg-slate-400'
                      }`}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Contextual Intelligence Panel (4 Cols) */}
        <div className="lg:col-span-4 sticky top-24">
          <AreaSidePanel
            area={selectedArea}
            onNavigate={onNavigate}
          />
        </div>
      </div>
    </div>
  );
};
