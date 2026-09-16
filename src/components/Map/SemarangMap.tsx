import React, { useState } from 'react';
import { AreaIntelligence } from '../../types';
import { SEMARANG_AREAS } from '../../data/semarangData';
import { SEMARANG_LANDMARKS } from '../../data/semarangPolygons';
import { LeafletSemarangMap, MapTileStyle, ActiveMapLayer } from './LeafletSemarangMap';
import {
  SpatialPatternMode,
  HexMetricObjective,
  SpatialHexCell,
  getSemarangHexagons,
} from '../../data/semarangHexagons';
import {
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  MapPin,
  Info,
  Map as MapIcon,
  Globe,
  Compass,
  Grid,
  Hexagon,
  Sparkles,
} from 'lucide-react';

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
  initialSpatialPattern?: SpatialPatternMode;
  initialHexMetric?: HexMetricObjective;
  showPatternToggle?: boolean;
  onSelectHex?: (hex: SpatialHexCell) => void;
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
  initialSpatialPattern = 'hexagonal',
  initialHexMetric = 'COMPOSITE',
  showPatternToggle = true,
  onSelectHex,
}) => {
  const safeAreas = Array.isArray(areas) && areas.length > 0 ? areas : SEMARANG_AREAS;

  const [internalLayer, setInternalLayer] = useState<ActiveMapLayer>(activeLayer || 'RETENTION');
  const [baseMode, setBaseMode] = useState<MapBaseMode>(initialBaseMode);
  const [tileStyle, setTileStyle] = useState<MapTileStyle>(initialTileStyle);
  const [spatialPattern, setSpatialPattern] = useState<SpatialPatternMode>(initialSpatialPattern);
  const [hexMetric, setHexMetric] = useState<HexMetricObjective>(initialHexMetric);
  const [showDistrictOutlines, setShowDistrictOutlines] = useState<boolean>(true);
  const [selectedHex, setSelectedHex] = useState<SpatialHexCell | null>(null);
  const [hoveredHex, setHoveredHex] = useState<SpatialHexCell | null>(null);

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

  const hexagons = getSemarangHexagons(safeAreas);

  const getAreaFill = (area: AreaIntelligence, isHovered: boolean, isSelected: boolean) => {
    if (isSelected) {
      return '#1d4ed8'; // Royal blue for selected
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
      if (v >= 90) return '#1e1b4b'; // Deep Indigo (Highest priority)
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

    return '#2563eb';
  };

  const getHexColor = (hex: SpatialHexCell, metric: HexMetricObjective, isHovered: boolean) => {
    if (metric === 'COMPOSITE') {
      const s = hex.compositeScore;
      if (s >= 85) return isHovered ? '#1e1b4b' : '#312e81';
      if (s >= 75) return isHovered ? '#1e3a8a' : '#1d4ed8';
      if (s >= 65) return isHovered ? '#2563eb' : '#3b82f6';
      if (s >= 50) return isHovered ? '#0284c7' : '#0ea5e9';
      if (s >= 35) return isHovered ? '#38bdf8' : '#7dd3fc';
      return '#bae6fd';
    }

    if (metric === 'RETENTION') {
      const s = hex.retentionScore;
      if (s >= 90) return isHovered ? '#1e1b4b' : '#312e81';
      if (s >= 80) return isHovered ? '#1e3a8a' : '#1e40af';
      if (s >= 70) return isHovered ? '#1d4ed8' : '#2563eb';
      if (s >= 55) return isHovered ? '#2563eb' : '#60a5fa';
      if (s >= 40) return isHovered ? '#60a5fa' : '#93c5fd';
      return '#bfdbfe';
    }

    if (metric === 'CHURN_RISK') {
      const r = hex.churnRiskRate;
      if (r >= 18) return isHovered ? '#7f1d1d' : '#991b1b';
      if (r >= 14) return isHovered ? '#991b1b' : '#dc2626';
      if (r >= 10) return isHovered ? '#c2410c' : '#ea580c';
      if (r >= 6) return isHovered ? '#d97706' : '#f59e0b';
      return '#fde68a';
    }

    if (metric === 'DEFENSE') {
      const s = hex.defenseScore;
      if (s >= 80) return isHovered ? '#7f1d1d' : '#991b1b';
      if (s >= 65) return isHovered ? '#c2410c' : '#ea580c';
      if (s >= 50) return isHovered ? '#d97706' : '#f59e0b';
      return '#fde68a';
    }

    if (metric === 'DOMINANT_ROLE') {
      switch (hex.dominantObjective) {
        case 'RETENTION':
          return isHovered ? '#1e40af' : '#2563eb';
        case 'DEFENSE':
          return isHovered ? '#d97706' : '#f59e0b';
        case 'ACQUISITION':
          return isHovered ? '#059669' : '#10b981';
        case 'EXPANSION':
          return isHovered ? '#6d28d9' : '#8b5cf6';
        default:
          return '#64748b';
      }
    }

    return '#2563eb';
  };

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(Math.max(prev + delta, 0.8), 2.5));
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
        <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 p-1 bg-white/95 backdrop-blur-md rounded-lg border border-slate-200 shadow-sm text-xs max-w-full">
          {/* Spatial Pattern Switcher: Hexagonal vs Polygon */}
          {showPatternToggle && (
            <div className="flex items-center gap-1 pr-1.5 border-r border-slate-200">
              <button
                type="button"
                onClick={() => setSpatialPattern('hexagonal')}
                className={`flex items-center gap-1 px-2 py-1 rounded font-semibold text-[11px] transition-colors ${
                  spatialPattern === 'hexagonal'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="Pola spasial hexagonal H3 untuk analisis multi-objektif granular"
              >
                <Hexagon className="w-3 h-3 text-amber-400" />
                <span>Pola Hexagonal</span>
              </button>

              <button
                type="button"
                onClick={() => setSpatialPattern('polygon')}
                className={`flex items-center gap-1 px-2 py-1 rounded font-semibold text-[11px] transition-colors ${
                  spatialPattern === 'polygon'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="Batas poligon administratif kecamatan"
              >
                <Layers className="w-3 h-3" />
                <span>Batas Kecamatan</span>
              </button>
            </div>
          )}

          {/* Hexagonal Sub-Metric Selector */}
          {spatialPattern === 'hexagonal' && (
            <div className="flex items-center gap-1 pr-1.5 border-r border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 px-0.5">METRIK:</span>
              <button
                type="button"
                onClick={() => setHexMetric('COMPOSITE')}
                className={`px-1.5 py-0.5 rounded font-medium text-[10.5px] transition-colors ${
                  hexMetric === 'COMPOSITE'
                    ? 'bg-indigo-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="Skor sintesis multi-objektif TOPSIS gabungan"
              >
                Composite
              </button>
              <button
                type="button"
                onClick={() => setHexMetric('RETENTION')}
                className={`px-1.5 py-0.5 rounded font-medium text-[10.5px] transition-colors ${
                  hexMetric === 'RETENTION'
                    ? 'bg-blue-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="Peluang & urgensi retensi pelanggan"
              >
                Retensi
              </button>
              <button
                type="button"
                onClick={() => setHexMetric('CHURN_RISK')}
                className={`px-1.5 py-0.5 rounded font-medium text-[10.5px] transition-colors ${
                  hexMetric === 'CHURN_RISK'
                    ? 'bg-rose-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="Kepadatan risiko churn"
              >
                Risiko Churn
              </button>
              <button
                type="button"
                onClick={() => setHexMetric('DOMINANT_ROLE')}
                className={`px-1.5 py-0.5 rounded font-medium text-[10.5px] transition-colors ${
                  hexMetric === 'DOMINANT_ROLE'
                    ? 'bg-amber-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="Sasaran prioritas utama per cell"
              >
                Objektif Utama
              </button>

              <button
                type="button"
                onClick={() => setShowDistrictOutlines(!showDistrictOutlines)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium border transition-colors ${
                  showDistrictOutlines
                    ? 'bg-slate-100 border-slate-300 text-slate-800'
                    : 'border-transparent text-slate-400 hover:bg-slate-50'
                }`}
                title="Tampilkan garis pembatas kecamatan"
              >
                {showDistrictOutlines ? '✓ Garis Batas' : 'Garis Batas'}
              </button>
            </div>
          )}

          {/* Basemap Switcher */}
          {showTileSelector && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setBaseMode('tile');
                  setTileStyle('positron');
                }}
                className={`flex items-center gap-1 px-2 py-1 rounded font-semibold text-[11px] transition-colors ${
                  baseMode === 'tile' && tileStyle === 'positron'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="Peta jalan (Street Map)"
              >
                <MapIcon className="w-3 h-3" />
                <span>Peta Jalan</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setBaseMode('tile');
                  setTileStyle('satellite');
                }}
                className={`flex items-center gap-1 px-2 py-1 rounded font-semibold text-[11px] transition-colors ${
                  baseMode === 'tile' && tileStyle === 'satellite'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="Foto satelit Semarang"
              >
                <Globe className="w-3 h-3" />
                <span>Satelit</span>
              </button>

              <button
                type="button"
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
                type="button"
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

          {/* Choropleth Layer Selector (Polygon mode only) */}
          {!compact && spatialPattern === 'polygon' && (
            <div className="flex items-center gap-1 pl-1.5 border-l border-slate-200">
              <span className="flex items-center gap-1 px-1 font-semibold text-slate-500 text-[10px]">
                <Layers className="w-3 h-3 text-slate-500" />
                LAYER:
              </span>
              <button
                type="button"
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
                type="button"
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
                type="button"
                onClick={() => setLayer('DENSITY')}
                className={`px-2 py-0.5 rounded font-medium text-[11px] transition-colors ${
                  currentLayer === 'DENSITY'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Density
              </button>
            </div>
          )}
        </div>

        {/* Vector Zoom Controls (only shown in vector mode) */}
        {baseMode === 'vector' && (
          <div className="pointer-events-auto flex items-center gap-1 p-1 bg-white/95 backdrop-blur-md rounded-lg border border-slate-200 shadow-sm">
            <button
              type="button"
              onClick={() => handleZoom(0.2)}
              className="p-1 hover:bg-slate-100 rounded text-slate-700 hover:text-slate-900"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleZoom(-0.2)}
              className="p-1 hover:bg-slate-100 rounded text-slate-700 hover:text-slate-900"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
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
            spatialPattern={spatialPattern}
            hexMetric={hexMetric}
            showDistrictOutlines={showDistrictOutlines}
            selectedHexId={selectedHex?.id || null}
            onSelectHex={(hex) => {
              setSelectedHex(hex);
              if (onSelectHex) onSelectHex(hex);
            }}
          />
        ) : (
          <div className="w-full h-full relative bg-slate-100 flex items-center justify-center select-none overflow-hidden">
            <svg
              viewBox="140 160 500 400"
              className="w-full h-full max-h-full cursor-grab active:cursor-grabbing transition-transform duration-75"
              style={{
                transform: `scale(${zoomLevel}) translate(${pan.x}px, ${pan.y}px)`,
              }}
            >
              <defs>
                <pattern id="mapGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
                </pattern>

                <linearGradient id="seaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.8" />
                </linearGradient>

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

              {/* Hexagonal Grid or District Polygons in Vector Mode */}
              {spatialPattern === 'hexagonal' ? (
                <g>
                  {/* District outlines wireframe if enabled */}
                  {showDistrictOutlines &&
                    safeAreas.map((area) => (
                      <path
                        key={`outline-${area.id}`}
                        d={area.coordinates.svgPath}
                        fill="none"
                        stroke={area.id === selectedAreaId ? '#1e3a8a' : '#475569'}
                        strokeWidth={area.id === selectedAreaId ? 2.5 : 1.2}
                        strokeDasharray={area.id === selectedAreaId ? '4,2' : '2,3'}
                        opacity={area.id === selectedAreaId ? 0.9 : 0.4}
                      />
                    ))}

                  {/* Render Hexagons */}
                  {hexagons.map((hex) => {
                    const isParentSelected = hex.areaId === selectedAreaId;
                    const isHexSelected = selectedHex?.id === hex.id;
                    const fillColor = getHexColor(hex, hexMetric, hoveredHex?.id === hex.id);

                    return (
                      <polygon
                        key={hex.id}
                        points={hex.svgPoints}
                        fill={fillColor}
                        fillOpacity={isHexSelected ? 0.9 : isParentSelected ? 0.75 : 0.6}
                        stroke={isHexSelected ? '#f59e0b' : isParentSelected ? '#1d4ed8' : '#ffffff'}
                        strokeWidth={isHexSelected ? 3 : isParentSelected ? 1.5 : 0.6}
                        className="cursor-pointer transition-colors duration-150"
                        onClick={() => {
                          setSelectedHex(hex);
                          onSelectArea(hex.areaId);
                          if (onSelectHex) onSelectHex(hex);
                        }}
                        onMouseEnter={() => setHoveredHex(hex)}
                        onMouseLeave={() => setHoveredHex(null)}
                      />
                    );
                  })}
                </g>
              ) : (
                /* Standard District Polygons */
                safeAreas.map((area) => {
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
                    </g>
                  );
                })
              )}

              {/* Landmarks on SVG Map */}
              {SEMARANG_LANDMARKS.map((lm) => (
                <g key={lm.id} transform={`translate(${lm.svgX}, ${lm.svgY})`} className="pointer-events-none select-none">
                  <circle cx="0" cy="0" r="2.5" fill="#2563eb" stroke="#ffffff" strokeWidth="1" />
                  <text x="4" y="2" fill="#334155" fontSize="7" fontWeight="600">{lm.name}</text>
                </g>
              ))}
            </svg>
          </div>
        )}
      </div>

      {/* Bottom Map Legend & Multi-Objective Status Bar */}
      <div className="bg-white border-t border-slate-200 px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-700 flex items-center gap-1 text-[11px]">
            <Info className="w-3.5 h-3.5 text-slate-500" />
            {spatialPattern === 'hexagonal' ? 'Hex Legend:' : 'Legend:'}
          </span>

          {spatialPattern === 'hexagonal' ? (
            hexMetric === 'COMPOSITE' ? (
              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-slate-500">Prioritas Standar (35)</span>
                <div className="w-24 sm:w-32 h-2.5 rounded-full bg-gradient-to-r from-sky-200 via-blue-500 to-indigo-950" />
                <span className="text-slate-900 font-bold">Multi-Objective Tertinggi (85-100)</span>
              </div>
            ) : hexMetric === 'RETENTION' ? (
              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-slate-500">Rendah</span>
                <div className="w-24 sm:w-32 h-2.5 rounded-full bg-gradient-to-r from-blue-200 via-blue-600 to-indigo-950" />
                <span className="text-blue-900 font-bold">Urgensi Retensi Tertinggi</span>
              </div>
            ) : hexMetric === 'CHURN_RISK' ? (
              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-slate-500">&lt;6% Churn</span>
                <div className="w-24 sm:w-32 h-2.5 rounded-full bg-gradient-to-r from-amber-200 via-orange-500 to-red-800" />
                <span className="text-red-900 font-bold">&gt;18% Churn Risk Tinggi</span>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2 text-[10.5px]">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-xs bg-blue-600" />
                  <span className="text-slate-600">Retensi</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" />
                  <span className="text-slate-600">Defend</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
                  <span className="text-slate-600">Akuisisi</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-xs bg-purple-500" />
                  <span className="text-slate-600">Ekspansi</span>
                </span>
              </div>
            )
          ) : currentLayer === 'RETENTION' ? (
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
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-slate-500">Low</span>
              <div className="w-24 h-2.5 rounded-full bg-gradient-to-r from-slate-200 via-blue-400 to-blue-800" />
              <span className="text-slate-700 font-medium">High</span>
            </div>
          )}
        </div>

        {/* Selected or Hovered Hexagon Quick Directive */}
        {(selectedHex || hoveredHex) && spatialPattern === 'hexagonal' ? (
          <div className="text-[11px] text-slate-700 flex items-center gap-1.5 bg-blue-50/80 px-2 py-0.5 rounded border border-blue-200 font-medium">
            <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
            <span className="font-bold text-slate-900">
              {(hoveredHex || selectedHex)?.zoneName}:
            </span>
            <span className="text-slate-600 truncate max-w-[280px]">
              {(hoveredHex || selectedHex)?.primaryRecommendation}
            </span>
          </div>
        ) : (
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-blue-600" />
            <span>Klik cell hexagonal pada peta untuk fokus detail area</span>
          </div>
        )}
      </div>
    </div>
  );
};
