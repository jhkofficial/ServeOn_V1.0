import React, { useState } from 'react';
import { AreaIntelligence, StrategicRole } from '../../types';
import { SEMARANG_AREAS } from '../../data/semarangData';
import { SEMARANG_LANDMARKS } from '../../data/semarangPolygons';
import { LeafletSemarangMap, MapTileStyle, ActiveMapLayer } from './LeafletSemarangMap';
import { Layers, ZoomIn, ZoomOut, RotateCcw, MapPin, Shield, Info, Map as MapIcon, Globe, Compass, Grid } from 'lucide-react';

export type MapBaseMode = 'tile' | 'vector';

interface SemarangMapProps {
  areas?: AreaIntelligence[];
  selectedAreaId: string;
  onSelectArea: (areaId: string) => void;
  activeLayer?: ActiveMapLayer;
  onLayerChange?: (layer: ActiveMapLayer) => void;
  heightClass?: string;
  compact?: boolean;
  initialBaseMode?: MapBaseMode;
  initialTileStyle?: MapTileStyle;
  showTileSelector?: boolean;
}

export const SemarangMap: React.FC<SemarangMapProps> = ({
  areas = [],
  selectedAreaId,
  onSelectArea,
  activeLayer = 'RETENTION',
  onLayerChange,
  heightClass = 'h-[480px]',
  compact = false,
  initialBaseMode = 'tile',
  initialTileStyle = 'positron',
  showTileSelector = true,
}) => {
  const safeAreas = Array.isArray(areas) && areas.length > 0 ? areas : SEMARANG_AREAS;

  const [internalLayer, setInternalLayer] = useState<ActiveMapLayer>(activeLayer || 'RETENTION');
  const [baseMode, setBaseMode] = useState<MapBaseMode>(initialBaseMode);
  const [tileStyle, setTileStyle] = useState<MapTileStyle>(initialTileStyle);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredArea, setHoveredArea] = useState<AreaIntelligence | null>(null);

  const currentLayer = onLayerChange ? activeLayer : internalLayer;
  const setLayer = (layer: ActiveMapLayer) => {
    if (onLayerChange) {
      onLayerChange(layer);
    } else {
      setInternalLayer(layer);
    }
  };

  const getAreaFill = (area: AreaIntelligence, isHovered: boolean, isSelected: boolean) => {
    if (isSelected) {
      return '#1d4ed8'; // Bold royal blue for selected focus
    }

    if (currentLayer === 'ROLE') {
      switch (area.strategicRole) {
        case 'PROTECT':
          return isHovered ? '#2563eb' : '#3b82f6';
        case 'DEFEND':
          return isHovered ? '#d97706' : '#f59e0b';
        case 'ACQUIRE':
          return isHovered ? '#059669' : '#10b981';
        case 'EXPAND':
          return isHovered ? '#7c3aed' : '#8b5cf6';
        case 'MONITOR':
        default:
          return isHovered ? '#64748b' : '#94a3b8';
      }
    }

    if (currentLayer === 'RETENTION') {
      const v = area.retentionOpportunityScore;
      if (v >= 90) return '#1e1b4b'; // Deep Indigo (Highest retention urgency)
      if (v >= 85) return '#1e3a8a'; // Dark Navy
      if (v >= 75) return '#2563eb'; // Blue
      if (v >= 65) return '#3b82f6'; // Medium Blue
      if (v >= 50) return '#60a5fa'; // Light Blue
      return '#93c5fd';
    }

    if (currentLayer === 'DENSITY') {
      const v = area.customerDensity;
      if (v > 85) return '#1e3a8a';
      if (v > 70) return '#2563eb';
      if (v > 50) return '#60a5fa';
      if (v > 30) return '#93c5fd';
      return '#dbeafe';
    }

    if (currentLayer === 'COMPETITION') {
      const v = area.competitionPressureScore;
      if (v > 85) return '#991b1b';
      if (v > 75) return '#dc2626';
      if (v > 65) return '#ea580c';
      if (v > 50) return '#f59e0b';
      return '#fef3c7';
    }

    if (currentLayer === 'ACQUISITION') {
      const v = area.marketPotentialScore;
      if (v > 85) return '#064e3b';
      if (v > 75) return '#059669';
      if (v > 60) return '#10b981';
      if (v > 45) return '#34d399';
      return '#d1fae5';
    }

    if (currentLayer === 'COVERAGE_GAP') {
      const v = area.relativeCoverageGapScore;
      if (v > 50) return '#581c87';
      if (v > 35) return '#7c3aed';
      if (v > 25) return '#8b5cf6';
      if (v > 15) return '#a78bfa';
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
      <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Layer Selector & Basemap Mode */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 p-1 bg-white/95 backdrop-blur-md rounded-lg border border-slate-200 shadow-sm text-xs">
          {/* Basemap Switcher */}
          {showTileSelector && (
            <div className="flex items-center gap-1 pr-1.5 border-r border-slate-200">
              <button
                onClick={() => {
                  setBaseMode('tile');
                  setTileStyle('positron');
                }}
                className={`flex items-center gap-1 px-2 py-1 rounded font-semibold text-[11px] transition-colors ${
                  baseMode === 'tile' && tileStyle === 'positron'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="Tampilkan peta jalan (Street Map)"
              >
                <MapIcon className="w-3 h-3" />
                <span>Peta Jalan</span>
              </button>

              <button
                onClick={() => {
                  setBaseMode('tile');
                  setTileStyle('satellite');
                }}
                className={`flex items-center gap-1 px-2 py-1 rounded font-semibold text-[11px] transition-colors ${
                  baseMode === 'tile' && tileStyle === 'satellite'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="Tampilkan foto satelit Semarang"
              >
                <Globe className="w-3 h-3" />
                <span>Satelit</span>
              </button>

              <button
                onClick={() => {
                  setBaseMode('tile');
                  setTileStyle('osm');
                }}
                className={`flex items-center gap-1 px-2 py-1 rounded font-semibold text-[11px] transition-colors ${
                  baseMode === 'tile' && tileStyle === 'osm'
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="OpenStreetMap Standard"
              >
                <Compass className="w-3 h-3" />
                <span>OSM</span>
              </button>

              <button
                onClick={() => setBaseMode('vector')}
                className={`flex items-center gap-1 px-2 py-1 rounded font-semibold text-[11px] transition-colors ${
                  baseMode === 'vector'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="Tampilan Skematik Vektor"
              >
                <Grid className="w-3 h-3" />
                <span>Vektor</span>
              </button>
            </div>
          )}

          {/* Choropleth Layer Selector */}
          {!compact && (
            <div className="flex items-center gap-1">
              <span className="flex items-center gap-1 px-1 font-semibold text-slate-500 text-[10px]">
                <Layers className="w-3 h-3 text-slate-500" />
                LAYER:
              </span>
              <button
                onClick={() => setLayer('RETENTION')}
                className={`px-2 py-0.5 rounded font-medium text-[11px] transition-colors ${
                  currentLayer === 'RETENTION'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Retention
              </button>
              <button
                onClick={() => setLayer('ROLE')}
                className={`px-2 py-0.5 rounded font-medium text-[11px] transition-colors ${
                  currentLayer === 'ROLE'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Roles
              </button>
              <button
                onClick={() => setLayer('DENSITY')}
                className={`px-2 py-0.5 rounded font-medium text-[11px] transition-colors ${
                  currentLayer === 'DENSITY'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Density
              </button>
              <button
                onClick={() => setLayer('COMPETITION')}
                className={`px-2 py-0.5 rounded font-medium text-[11px] transition-colors ${
                  currentLayer === 'COMPETITION'
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Competition
              </button>
              <button
                onClick={() => setLayer('ACQUISITION')}
                className={`px-2 py-0.5 rounded font-medium text-[11px] transition-colors ${
                  currentLayer === 'ACQUISITION'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Acquisition
              </button>
            </div>
          )}
        </div>

        {/* Vector Zoom Controls (only shown in vector mode) */}
        {baseMode === 'vector' && (
          <div className="pointer-events-auto flex items-center gap-1 p-1 bg-white/95 backdrop-blur-md rounded-lg border border-slate-200 shadow-sm">
            <button
              onClick={() => handleZoom(0.2)}
              className="p-1 hover:bg-slate-100 rounded text-slate-700 hover:text-slate-900"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleZoom(-0.2)}
              className="p-1 hover:bg-slate-100 rounded text-slate-700 hover:text-slate-900"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={resetView}
              className="p-1 hover:bg-slate-100 rounded text-slate-700 hover:text-slate-900"
              title="Reset view"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Main Map Body: either Leaflet real basemap OR SVG vector map */}
      <div className="flex-1 w-full h-full relative overflow-hidden">
        {baseMode === 'tile' ? (
          <LeafletSemarangMap
            areas={safeAreas}
            selectedAreaId={selectedAreaId}
            onSelectArea={onSelectArea}
            activeLayer={currentLayer}
            heightClass="h-full"
            tileStyle={tileStyle}
            showLandmarks={true}
          />
        ) : (
          /* Enriched SVG Map Canvas with Geographic Features (Coast, Highway, Rivers, Landmarks) */
          <div className="w-full h-full relative cursor-grab active:cursor-grabbing overflow-hidden">
            <svg
              viewBox="140 160 500 400"
              className="w-full h-full object-contain select-none transition-transform duration-200"
              style={{
                transform: `scale(${zoomLevel}) translate(${pan.x}px, ${pan.y}px)`,
              }}
            >
              <defs>
                {/* Background Pattern */}
                <pattern id="mapGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="1.5,1.5" />
                </pattern>

                {/* Sea Gradient */}
                <linearGradient id="seaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.8" />
                </linearGradient>

                {/* Land Topography Gradient */}
                <linearGradient id="landGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="100%" stopColor="#f1f5f9" />
                </linearGradient>
              </defs>

              {/* Land Background Canvas */}
              <rect x="100" y="100" width="600" height="500" fill="url(#landGradient)" />
              <rect x="100" y="100" width="600" height="500" fill="url(#mapGrid)" opacity="0.6" />

              {/* Geographic Coastline & Java Sea */}
              <path
                d="M 140 180 Q 230 205 320 200 T 430 195 T 540 215 T 640 195 L 640 130 L 140 130 Z"
                fill="url(#seaGradient)"
              />
              <path
                d="M 140 180 Q 230 205 320 200 T 430 195 T 540 215 T 640 195"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="4,2"
              />
              <text x="500" y="165" fill="#0369a1" fontSize="10" fontWeight="700" letterSpacing="1.2">
                LAUT JAWA (JAVA SEA)
              </text>

              {/* Tanjung Emas Port Pier structures */}
              <rect x="420" y="185" width="22" height="15" fill="#94a3b8" rx="2" />
              <rect x="446" y="180" width="12" height="20" fill="#94a3b8" rx="2" />
              <text x="435" y="180" fill="#475569" fontSize="7" fontWeight="600" textAnchor="middle">Tj. Emas</text>

              {/* Rivers: Kali Banjir Kanal Barat & Timur */}
              <path
                d="M 380 198 Q 385 280 395 350 T 400 450"
                fill="none"
                stroke="#7dd3fc"
                strokeWidth="2"
                strokeOpacity="0.7"
              />
              <path
                d="M 465 210 Q 470 280 460 340 T 475 440"
                fill="none"
                stroke="#7dd3fc"
                strokeWidth="2"
                strokeOpacity="0.7"
              />

              {/* Arterial Highways: Tol Semarang-Batang & Tol Semarang-Solo */}
              <path
                d="M 140 290 Q 240 280 340 300 T 440 370 T 470 480"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M 140 290 Q 240 280 340 300 T 440 370 T 470 480"
                fill="none"
                stroke="#f97316"
                strokeWidth="1.5"
                strokeDasharray="6,4"
              />

              {/* Ahmad Yani Airport Runway */}
              <line x1="330" y1="260" x2="360" y2="285" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
              <line x1="330" y1="260" x2="360" y2="285" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="3,2" />
              <text x="325" y="255" fill="#475569" fontSize="7" fontWeight="600">Bandara Ahmad Yani</text>

              {/* Simpang Lima Roundabout representation */}
              <circle cx="432" cy="335" r="5" fill="#ef4444" fillOpacity="0.2" stroke="#dc2626" strokeWidth="1" />

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
                      fillOpacity={isSelected ? 0.85 : 0.65}
                      stroke={isSelected ? '#1e3a8a' : isHovered ? '#0f172a' : '#ffffff'}
                      strokeWidth={isSelected ? '3.5' : isHovered ? '2' : '1.5'}
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
                        x="-38"
                        y="-9"
                        width="76"
                        height="18"
                        rx="3"
                        fill={isSelected ? '#1e3a8a' : '#0f172a'}
                        fillOpacity={isSelected ? '0.95' : '0.8'}
                      />
                      <text
                        x="0"
                        y="3"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="8.5"
                        fontWeight="700"
                        fontFamily="Plus Jakarta Sans, sans-serif"
                      >
                        {area.name.replace('Semarang ', 'SMG ')}
                      </text>
                    </g>

                    {/* Active Focus Pin */}
                    {isSelected && (
                      <circle
                        cx={area.coordinates.svgX}
                        cy={area.coordinates.svgY - 13}
                        r="4"
                        fill="#ef4444"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                    )}
                  </g>
                );
              })}

              {/* Landmarks on SVG Map */}
              {SEMARANG_LANDMARKS.map((lm) => (
                <g key={lm.id} transform={`translate(${lm.svgX}, ${lm.svgY})`} className="pointer-events-none select-none">
                  <circle cx="0" cy="0" r="2.5" fill="#2563eb" stroke="#ffffff" strokeWidth="1" />
                  <text x="4" y="2" fill="#334155" fontSize="7" fontWeight="600">{lm.name}</text>
                </g>
              ))}
            </svg>

            {/* Floating Tooltip in Vector Mode */}
            {hoveredArea && (
              <div
                className="absolute z-20 pointer-events-none rounded-lg bg-slate-900/95 text-white p-2.5 shadow-xl border border-slate-700 text-xs w-56 animate-in fade-in duration-150"
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
                    <span className="text-slate-400">Retention Opportunity:</span>
                    <span className="font-mono font-bold text-blue-300">{hoveredArea.retentionOpportunityScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Churn Risk Accounts:</span>
                    <span className="font-mono font-semibold text-rose-300">{hoveredArea.churnRiskCount.toLocaleString()} ({hoveredArea.churnRiskPercent}%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Retention Rank:</span>
                    <span className="font-mono font-medium text-white">#{hoveredArea.objectives.retention.rank}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Customer Count:</span>
                    <span className="font-mono font-medium text-slate-200">{hoveredArea.customerCount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Map Legend Bar */}
      <div className="bg-white border-t border-slate-200 px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-700 flex items-center gap-1 text-[11px]">
            <Info className="w-3.5 h-3.5 text-slate-500" />
            Legend:
          </span>

          {currentLayer === 'RETENTION' ? (
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-slate-500">Low Urgency</span>
              <div className="w-20 sm:w-28 h-2.5 rounded-full bg-gradient-to-r from-sky-200 via-blue-600 to-indigo-950" />
              <span className="text-slate-900 font-bold">Highest Priority (Rank #1)</span>
            </div>
          ) : currentLayer === 'ROLE' ? (
            <div className="flex flex-wrap items-center gap-2.5 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-blue-600" />
                <span className="text-slate-600 font-medium">PROTECT</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" />
                <span className="text-slate-600 font-medium">DEFEND</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
                <span className="text-slate-600 font-medium">ACQUIRE</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-purple-500" />
                <span className="text-slate-600 font-medium">EXPAND</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-xs bg-slate-400" />
                <span className="text-slate-600 font-medium">MONITOR</span>
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-slate-500">Low</span>
              <div className="w-24 h-2.5 rounded-full bg-gradient-to-r from-slate-200 via-blue-400 to-blue-800" />
              <span className="text-slate-700 font-medium">High</span>
            </div>
          )}
        </div>

        <div className="text-[11px] text-slate-500 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-blue-600" />
          <span>Klik kecamatan pada peta untuk fokus detail &amp; rekomendasi</span>
        </div>
      </div>
    </div>
  );
};
