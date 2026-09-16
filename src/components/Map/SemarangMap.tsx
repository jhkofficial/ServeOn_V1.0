import React, { useState } from 'react';
import { AreaIntelligence, StrategicRole } from '../../types';
import { SEMARANG_AREAS } from '../../data/semarangData';
import { Layers, ZoomIn, ZoomOut, RotateCcw, MapPin, Shield, ShieldAlert, UserPlus, Eye, Info } from 'lucide-react';

interface SemarangMapProps {
  areas?: AreaIntelligence[];
  selectedAreaId: string;
  onSelectArea: (areaId: string) => void;
  activeLayer?: 'ROLE' | 'DENSITY' | 'COMPETITION' | 'ACQUISITION' | 'COVERAGE_GAP';
  onLayerChange?: (layer: 'ROLE' | 'DENSITY' | 'COMPETITION' | 'ACQUISITION' | 'COVERAGE_GAP') => void;
  heightClass?: string;
  compact?: boolean;
}

export const SemarangMap: React.FC<SemarangMapProps> = ({
  areas = [],
  selectedAreaId,
  onSelectArea,
  activeLayer = 'ROLE',
  onLayerChange,
  heightClass = 'h-[480px]',
  compact = false,
}) => {
  const safeAreas = Array.isArray(areas) && areas.length > 0 ? areas : SEMARANG_AREAS;
  const [internalLayer, setInternalLayer] = useState<'ROLE' | 'DENSITY' | 'COMPETITION' | 'ACQUISITION' | 'COVERAGE_GAP'>('ROLE');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredArea, setHoveredArea] = useState<AreaIntelligence | null>(null);

  const currentLayer = onLayerChange ? activeLayer : internalLayer;
  const setLayer = (layer: 'ROLE' | 'DENSITY' | 'COMPETITION' | 'ACQUISITION' | 'COVERAGE_GAP') => {
    if (onLayerChange) {
      onLayerChange(layer);
    } else {
      setInternalLayer(layer);
    }
  };

  const getAreaFill = (area: AreaIntelligence, isHovered: boolean, isSelected: boolean) => {
    if (isSelected) {
      return '#2563eb'; // Bright royal blue for selected focus
    }

    if (currentLayer === 'ROLE') {
      switch (area.strategicRole) {
        case 'PROTECT':
          return isHovered ? '#3b82f6' : '#60a5fa'; // Blue
        case 'DEFEND':
          return isHovered ? '#f59e0b' : '#fbbf24'; // Amber
        case 'ACQUIRE':
          return isHovered ? '#10b981' : '#34d399'; // Emerald
        case 'EXPAND':
          return isHovered ? '#8b5cf6' : '#a78bfa'; // Purple
        case 'MONITOR':
        default:
          return isHovered ? '#94a3b8' : '#cbd5e1'; // Slate gray
      }
    }

    if (currentLayer === 'DENSITY') {
      const v = area.customerDensity; // 0-100
      if (v > 85) return '#1e3a8a';
      if (v > 70) return '#2563eb';
      if (v > 50) return '#60a5fa';
      if (v > 30) return '#93c5fd';
      return '#dbeafe';
    }

    if (currentLayer === 'COMPETITION') {
      const v = area.competitionPressureScore;
      if (v > 85) return '#b91c1c';
      if (v > 75) return '#dc2626';
      if (v > 65) return '#f97316';
      if (v > 50) return '#fbbf24';
      return '#fef3c7';
    }

    if (currentLayer === 'ACQUISITION') {
      const v = area.marketPotentialScore;
      if (v > 85) return '#047857';
      if (v > 75) return '#059669';
      if (v > 60) return '#10b981';
      if (v > 45) return '#6ee7b7';
      return '#d1fae5';
    }

    if (currentLayer === 'COVERAGE_GAP') {
      const v = area.relativeCoverageGapScore;
      if (v > 50) return '#7c3aed';
      if (v > 35) return '#8b5cf6';
      if (v > 25) return '#a78bfa';
      if (v > 15) return '#c4b5fd';
      return '#ede9fe';
    }

    return '#94a3b8';
  };

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(2.5, Math.max(0.8, Number((prev + delta).toFixed(1)))));
  };

  const resetView = () => {
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className={`relative w-full ${heightClass} rounded-xl border border-slate-200 bg-slate-50/50 overflow-hidden flex flex-col`}>
      {/* Top Map Control Bar */}
      {!compact && (
        <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* Layer Selector */}
          <div className="pointer-events-auto flex items-center gap-1 p-1 bg-white/95 backdrop-blur-md rounded-lg border border-slate-200 shadow-sm text-xs">
            <span className="flex items-center gap-1 px-2 font-semibold text-slate-500 text-[11px]">
              <Layers className="w-3.5 h-3.5 text-slate-600" />
              LAYER:
            </span>
            <button
              onClick={() => setLayer('ROLE')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                currentLayer === 'ROLE'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Strategic Roles
            </button>
            <button
              onClick={() => setLayer('DENSITY')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                currentLayer === 'DENSITY'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Density
            </button>
            <button
              onClick={() => setLayer('COMPETITION')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                currentLayer === 'COMPETITION'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Competition
            </button>
            <button
              onClick={() => setLayer('ACQUISITION')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                currentLayer === 'ACQUISITION'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Acquisition Potential
            </button>
            <button
              onClick={() => setLayer('COVERAGE_GAP')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                currentLayer === 'COVERAGE_GAP'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Coverage Gap
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="pointer-events-auto flex items-center gap-1 p-1 bg-white/95 backdrop-blur-md rounded-lg border border-slate-200 shadow-sm">
            <button
              onClick={() => handleZoom(0.2)}
              className="p-1.5 hover:bg-slate-100 rounded text-slate-700 hover:text-slate-900"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleZoom(-0.2)}
              className="p-1.5 hover:bg-slate-100 rounded text-slate-700 hover:text-slate-900"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={resetView}
              className="p-1.5 hover:bg-slate-100 rounded text-slate-700 hover:text-slate-900"
              title="Reset view"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* SVG Map Canvas */}
      <div className="flex-1 w-full h-full relative cursor-grab active:cursor-grabbing overflow-hidden">
        <svg
          viewBox="140 160 500 400"
          className="w-full h-full object-contain select-none transition-transform duration-200"
          style={{
            transform: `scale(${zoomLevel}) translate(${pan.x}px, ${pan.y}px)`,
          }}
        >
          {/* Subtle Grid / Marine Background */}
          <defs>
            <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2,2" />
            </pattern>
          </defs>
          <rect x="100" y="100" width="600" height="500" fill="url(#mapGrid)" opacity="0.6" />

          {/* Java Sea / Coastal Northern Edge */}
          <path
            d="M 140 180 Q 280 210 400 190 T 640 195 L 640 140 L 140 140 Z"
            fill="#e0f2fe"
            opacity="0.8"
          />
          <text x="500" y="170" fill="#0284c7" fontSize="11" fontWeight="600" letterSpacing="1.5">
            LAUT JAWA (JAVA SEA)
          </text>

          {/* District Polygons */}
          {safeAreas.map((area) => {
            const isSelected = area.id === selectedAreaId;
            const isHovered = hoveredArea?.id === area.id;
            const fillColor = getAreaFill(area, isHovered, isSelected);

            return (
              <g key={area.id} className="transition-all duration-150">
                <path
                  d={area.coordinates.svgPath}
                  fill={fillColor}
                  stroke={isSelected ? '#1e40af' : isHovered ? '#0f172a' : '#ffffff'}
                  strokeWidth={isSelected ? '3' : isHovered ? '2' : '1.5'}
                  strokeLinejoin="round"
                  className="cursor-pointer transition-colors duration-150"
                  onClick={() => onSelectArea(area.id)}
                  onMouseEnter={() => setHoveredArea(area)}
                  onMouseLeave={() => setHoveredArea(null)}
                />

                {/* District Label Tag */}
                <g
                  transform={`translate(${area.coordinates.svgX}, ${area.coordinates.svgY})`}
                  className="pointer-events-none select-none"
                >
                  <rect
                    x="-40"
                    y="-10"
                    width="80"
                    height="20"
                    rx="4"
                    fill={isSelected ? '#1e3a8a' : '#0f172a'}
                    fillOpacity={isSelected ? '0.95' : '0.75'}
                  />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="9"
                    fontWeight="700"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    {area.name.replace('Semarang ', 'SMG ')}
                  </text>
                </g>

                {/* Pin marker for active focus */}
                {isSelected && (
                  <circle
                    cx={area.coordinates.svgX}
                    cy={area.coordinates.svgY - 14}
                    r="4"
                    fill="#ef4444"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip when hovering over an area */}
        {hoveredArea && (
          <div
            className="absolute z-20 pointer-events-none rounded-lg bg-slate-900/95 text-white p-2.5 shadow-xl border border-slate-700 text-xs w-56"
            style={{
              bottom: '16px',
              left: '16px',
            }}
          >
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-1.5 mb-1.5">
              <span className="font-bold text-sm text-white">{hoveredArea.name}</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  hoveredArea.strategicRole === 'PROTECT'
                    ? 'bg-blue-500/30 text-blue-300'
                    : hoveredArea.strategicRole === 'DEFEND'
                    ? 'bg-amber-500/30 text-amber-300'
                    : hoveredArea.strategicRole === 'ACQUIRE'
                    ? 'bg-emerald-500/30 text-emerald-300'
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                {hoveredArea.strategicRole}
              </span>
            </div>

            <div className="space-y-1 text-[11px] text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Customers:</span>
                <span className="font-mono font-medium text-white">{hoveredArea.customerCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Retention Rank:</span>
                <span className="font-mono font-medium text-white">#{hoveredArea.objectives.retention.rank}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Defense Rank:</span>
                <span className="font-mono font-medium text-white">#{hoveredArea.objectives.defense.rank}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Acquisition Rank:</span>
                <span className="font-mono font-medium text-white">#{hoveredArea.objectives.acquisition.rank}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Expansion:</span>
                <span className="font-mono font-medium text-rose-300">
                  {hoveredArea.expansionGate.allPassed ? 'Eligible' : 'Not Eligible'}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-800">
                <span className="text-slate-400">Confidence:</span>
                <span className="font-mono font-bold text-blue-300">{hoveredArea.confidenceScore}%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Map Legend Bar */}
      <div className="bg-white border-t border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-slate-700 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-slate-500" />
            Legend:
          </span>

          {currentLayer === 'ROLE' ? (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-blue-500" />
                <span className="text-slate-600 font-medium">PROTECT</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-amber-400" />
                <span className="text-slate-600 font-medium">DEFEND</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-emerald-400" />
                <span className="text-slate-600 font-medium">ACQUIRE</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-purple-400" />
                <span className="text-slate-600 font-medium">EXPAND</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-slate-300" />
                <span className="text-slate-600 font-medium">MONITOR</span>
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Low</span>
              <div className="w-24 h-2.5 rounded-full bg-gradient-to-r from-slate-200 via-blue-400 to-blue-800" />
              <span className="text-slate-700 font-medium">High</span>
            </div>
          )}
        </div>

        <div className="text-[11px] text-slate-500 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-blue-600" />
          <span>Click any district polygon to inspect candidate detail &amp; recommendations</span>
        </div>
      </div>
    </div>
  );
};
