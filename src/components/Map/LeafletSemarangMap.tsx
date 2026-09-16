import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RotateCcw, Hexagon, Sparkles } from 'lucide-react';
import { AreaIntelligence } from '../../types';
import { DISTRICT_POLYGONS, SEMARANG_LANDMARKS } from '../../data/semarangPolygons';
import {
  SpatialHexCell,
  SpatialPatternMode,
  HexMetricObjective,
  getSemarangHexagons,
} from '../../data/semarangHexagons';

export type MapTileStyle = 'positron' | 'osm' | 'satellite';

export type ActiveMapLayer = 'ROLE' | 'RETENTION' | 'DENSITY' | 'COMPETITION' | 'ACQUISITION' | 'COVERAGE_GAP';

interface LeafletSemarangMapProps {
  areas: AreaIntelligence[];
  selectedAreaId: string;
  onSelectArea: (areaId: string) => void;
  activeLayer?: ActiveMapLayer;
  heightClass?: string;
  tileStyle?: MapTileStyle;
  showLandmarks?: boolean;
  spatialPattern?: SpatialPatternMode;
  hexMetric?: HexMetricObjective;
  showDistrictOutlines?: boolean;
  selectedHexId?: string | null;
  onSelectHex?: (hex: SpatialHexCell) => void;
}

export const LeafletSemarangMap: React.FC<LeafletSemarangMapProps> = ({
  areas,
  selectedAreaId,
  onSelectArea,
  activeLayer = 'RETENTION',
  heightClass = 'h-[460px]',
  tileStyle = 'positron',
  showLandmarks = true,
  spatialPattern = 'hexagonal',
  hexMetric = 'COMPOSITE',
  showDistrictOutlines = true,
  selectedHexId = null,
  onSelectHex,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const polygonLayersGroupRef = useRef<L.LayerGroup | null>(null);
  const landmarkGroupRef = useRef<L.LayerGroup | null>(null);

  const [hoveredArea, setHoveredArea] = useState<AreaIntelligence | null>(null);
  const [hoveredHex, setHoveredHex] = useState<SpatialHexCell | null>(null);
  const [activeHex, setActiveHex] = useState<SpatialHexCell | null>(null);

  // Helper function for district polygon fill color
  const getAreaColor = (area: AreaIntelligence, isHovered: boolean): string => {
    if (activeLayer === 'ROLE') {
      switch (area.strategicRole) {
        case 'PROTECT':
          return isHovered ? '#1d4ed8' : '#2563eb';
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

    if (activeLayer === 'RETENTION') {
      const v = area.retentionOpportunityScore;
      if (v >= 90) return '#1e1b4b'; // Deep Indigo (Highest priority)
      if (v >= 85) return '#1e3a8a'; // Dark Navy
      if (v >= 75) return '#2563eb'; // Blue
      if (v >= 65) return '#3b82f6'; // Bright Blue
      if (v >= 50) return '#60a5fa'; // Light Blue
      return '#93c5fd';
    }

    if (activeLayer === 'DENSITY') {
      const v = area.customerDensity;
      if (v > 85) return '#1e3a8a';
      if (v > 70) return '#2563eb';
      if (v > 50) return '#60a5fa';
      if (v > 30) return '#93c5fd';
      return '#bfdbfe';
    }

    if (activeLayer === 'COMPETITION') {
      const v = area.competitionPressureScore;
      if (v > 85) return '#991b1b';
      if (v > 75) return '#dc2626';
      if (v > 65) return '#ea580c';
      if (v > 50) return '#f59e0b';
      return '#fde68a';
    }

    if (activeLayer === 'ACQUISITION') {
      const v = area.marketPotentialScore;
      if (v > 85) return '#064e3b';
      if (v > 75) return '#059669';
      if (v > 60) return '#10b981';
      if (v > 45) return '#34d399';
      return '#a7f3d0';
    }

    if (activeLayer === 'COVERAGE_GAP') {
      const v = area.relativeCoverageGapScore;
      if (v > 50) return '#581c87';
      if (v > 35) return '#7c3aed';
      if (v > 25) return '#8b5cf6';
      if (v > 15) return '#a78bfa';
      return '#ddd6fe';
    }

    return '#2563eb';
  };

  // Helper function for hexagonal cell fill color
  const getHexagonColor = (
    hex: SpatialHexCell,
    metric: HexMetricObjective | string,
    isHovered: boolean
  ): string => {
    if (metric === 'COMPOSITE') {
      const s = hex.compositeScore;
      if (s >= 85) return isHovered ? '#1e1b4b' : '#312e81'; // Deep Indigo (Highest priority)
      if (s >= 75) return isHovered ? '#1e3a8a' : '#1d4ed8'; // Navy
      if (s >= 65) return isHovered ? '#2563eb' : '#3b82f6'; // Royal Blue
      if (s >= 50) return isHovered ? '#0284c7' : '#0ea5e9'; // Cyan/Sky
      if (s >= 35) return isHovered ? '#38bdf8' : '#7dd3fc'; // Soft Sky
      return '#bae6fd';
    }

    if (metric === 'RETENTION') {
      const s = hex.retentionScore;
      if (s >= 90) return isHovered ? '#1e1b4b' : '#312e81'; // Deep Indigo (Highest retention urgency)
      if (s >= 80) return isHovered ? '#1e3a8a' : '#1e40af';
      if (s >= 70) return isHovered ? '#1d4ed8' : '#2563eb';
      if (s >= 55) return isHovered ? '#2563eb' : '#60a5fa';
      if (s >= 40) return isHovered ? '#60a5fa' : '#93c5fd';
      return '#bfdbfe';
    }

    if (metric === 'CHURN_RISK') {
      const r = hex.churnRiskRate;
      if (r >= 18) return isHovered ? '#7f1d1d' : '#991b1b'; // Deep Crimson
      if (r >= 14) return isHovered ? '#991b1b' : '#dc2626'; // Red
      if (r >= 10) return isHovered ? '#c2410c' : '#ea580c'; // Orange
      if (r >= 6) return isHovered ? '#d97706' : '#f59e0b'; // Amber
      return '#fde68a'; // Pale Yellow
    }

    if (metric === 'DEFENSE') {
      const s = hex.defenseScore;
      if (s >= 80) return isHovered ? '#7f1d1d' : '#991b1b';
      if (s >= 65) return isHovered ? '#c2410c' : '#ea580c';
      if (s >= 50) return isHovered ? '#d97706' : '#f59e0b';
      return '#fde68a';
    }

    if (metric === 'ACQUISITION') {
      const s = hex.acquisitionScore;
      if (s >= 80) return isHovered ? '#064e3b' : '#065f46';
      if (s >= 65) return isHovered ? '#059669' : '#10b981';
      if (s >= 50) return isHovered ? '#10b981' : '#34d399';
      return '#a7f3d0';
    }

    if (metric === 'DOMINANT_ROLE') {
      switch (hex.dominantObjective) {
        case 'RETENTION':
          return isHovered ? '#1e40af' : '#2563eb'; // Blue
        case 'DEFENSE':
          return isHovered ? '#d97706' : '#f59e0b'; // Amber
        case 'ACQUISITION':
          return isHovered ? '#059669' : '#10b981'; // Emerald
        case 'EXPANSION':
          return isHovered ? '#6d28d9' : '#8b5cf6'; // Purple
        default:
          return '#64748b';
      }
    }

    return '#2563eb';
  };

  // Get tile config
  const getTileConfig = (style: MapTileStyle | string) => {
    switch (style) {
      case 'osm':
        return {
          url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
        };
      case 'satellite':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
          maxZoom: 18,
        };
      case 'positron':
      default:
        return {
          url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19,
        };
    }
  };

  // 1. Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Semarang center coordinates: ~ -7.010, 110.415
    const map = L.map(mapContainerRef.current, {
      center: [-7.010, 110.415],
      zoom: 12,
      minZoom: 10,
      maxZoom: 16,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // Tile Layer initial
    const config = getTileConfig(tileStyle);
    const tileLayer = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: config.maxZoom,
      subdomains: (config as any).subdomains || 'abc',
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Groups
    const polygonGroup = L.layerGroup().addTo(map);
    polygonLayersGroupRef.current = polygonGroup;

    const landmarkGroup = L.layerGroup().addTo(map);
    landmarkGroupRef.current = landmarkGroup;

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Switch Tile Style dynamically
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const config = getTileConfig(tileStyle);
    const newTileLayer = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: config.maxZoom,
      subdomains: (config as any).subdomains || 'abc',
    }).addTo(map);

    // Ensure tiles stay at the bottom
    newTileLayer.bringToBack();
    tileLayerRef.current = newTileLayer;
  }, [tileStyle]);

  // 3. Render / Update Spatial Layer (Hexagonal Grid or District Polygons)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const polygonGroup = polygonLayersGroupRef.current;
    if (!map || !polygonGroup) return;

    polygonGroup.clearLayers();

    if (spatialPattern === 'hexagonal') {
      const hexagons = getSemarangHexagons(areas);

      // A. If district outlines requested, render outline wireframes first
      if (showDistrictOutlines) {
        areas.forEach((area) => {
          const coords = DISTRICT_POLYGONS[area.id];
          if (!coords || coords.length === 0) return;

          const isSelected = area.id === selectedAreaId;
          const outline = L.polygon(coords, {
            color: isSelected ? '#1e3a8a' : '#475569',
            weight: isSelected ? 2.5 : 1.2,
            dashArray: isSelected ? '5, 3' : '3, 4',
            opacity: isSelected ? 0.9 : 0.45,
            fill: false,
            interactive: false,
          });
          outline.addTo(polygonGroup);
        });
      }

      // B. Render Hexagonal Cells
      hexagons.forEach((hex) => {
        const isParentSelected = hex.areaId === selectedAreaId;
        const isHexSelected = selectedHexId === hex.id || activeHex?.id === hex.id;
        const color = getHexagonColor(hex, hexMetric, false);

        const hexPolygon = L.polygon(hex.vertices, {
          color: isHexSelected ? '#f59e0b' : isParentSelected ? '#1d4ed8' : '#ffffff',
          weight: isHexSelected ? 3.5 : isParentSelected ? 1.8 : 0.8,
          opacity: isHexSelected ? 1 : 0.85,
          fillColor: color,
          fillOpacity: isHexSelected ? 0.88 : isParentSelected ? 0.72 : 0.58,
        });

        hexPolygon.on('click', () => {
          setActiveHex(hex);
          if (onSelectHex) onSelectHex(hex);
          onSelectArea(hex.areaId);
        });

        hexPolygon.on('mouseover', () => {
          setHoveredHex(hex);
          const parentArea = areas.find((a) => a.id === hex.areaId) || null;
          setHoveredArea(parentArea);
          hexPolygon.setStyle({
            weight: isHexSelected ? 4 : 2.5,
            color: isHexSelected ? '#f59e0b' : '#0f172a',
            fillOpacity: 0.85,
          });
        });

        hexPolygon.on('mouseout', () => {
          setHoveredHex(null);
          setHoveredArea(null);
          hexPolygon.setStyle({
            weight: isHexSelected ? 3.5 : isParentSelected ? 1.8 : 0.8,
            color: isHexSelected ? '#f59e0b' : isParentSelected ? '#1d4ed8' : '#ffffff',
            fillOpacity: isHexSelected ? 0.88 : isParentSelected ? 0.72 : 0.58,
          });
        });

        const tooltipMetric =
          hexMetric === 'COMPOSITE'
            ? `Multi-Obj Composite: <strong>${hex.compositeScore}</strong>/100`
            : hexMetric === 'RETENTION'
            ? `Retention Score: <strong>${hex.retentionScore}</strong>/100`
            : hexMetric === 'CHURN_RISK'
            ? `Risiko Churn: <strong>${hex.churnRiskCount} akun</strong> (${hex.churnRiskRate}%)`
            : hexMetric === 'DEFENSE'
            ? `Tekanan Kompetitor: <strong>${hex.defenseScore}</strong>/100`
            : hexMetric === 'ACQUISITION'
            ? `Potensi Akuisisi: <strong>${hex.acquisitionScore}</strong>/100`
            : `Fokus Utama: <strong>${hex.dominantObjective}</strong>`;

        hexPolygon.bindTooltip(
          `<div style="font-family: inherit; min-width: 170px;">
            <div style="font-weight: 700; font-size: 11px; margin-bottom: 2px;">${hex.zoneName}</div>
            <div style="font-size: 10.5px; color: #93c5fd; margin-bottom: 2px;">${tooltipMetric}</div>
            <div style="font-size: 9.5px; color: #cbd5e1;">Objektif Dominan: <span style="font-weight:600; color:#fbbf24;">${hex.dominantObjective}</span></div>
          </div>`,
          { sticky: true, direction: 'auto', className: 'leaflet-custom-tooltip' }
        );

        hexPolygon.addTo(polygonGroup);
      });

      // C. District Centroid Label Tags for orientation
      areas.forEach((area) => {
        const isSelected = area.id === selectedAreaId;
        const labelIcon = L.divIcon({
          className: 'custom-area-label-wrapper',
          html: `
            <div class="px-1.5 py-0.5 rounded text-[9.5px] font-bold text-center whitespace-nowrap shadow-xs cursor-pointer select-none transition-transform hover:scale-105 pointer-events-auto ${
              isSelected
                ? 'bg-blue-900 text-white ring-2 ring-blue-400 ring-offset-1 ring-offset-white'
                : 'bg-slate-900/80 text-slate-100 backdrop-blur-xs'
            }">
              <span>${area.name.replace('Semarang ', 'SMG ')}</span>
            </div>
          `,
          iconSize: [75, 20],
          iconAnchor: [37, 10],
        });

        const labelMarker = L.marker([area.coordinates.lat, area.coordinates.lng], { icon: labelIcon });
        labelMarker.on('click', () => {
          onSelectArea(area.id);
        });
        labelMarker.addTo(polygonGroup);
      });
    } else {
      // Standard District Polygon Mode
      areas.forEach((area) => {
        const coords = DISTRICT_POLYGONS[area.id];
        if (!coords || coords.length === 0) return;

        const isSelected = area.id === selectedAreaId;
        const color = getAreaColor(area, false);

        // Create polygon
        const polygon = L.polygon(coords, {
          color: isSelected ? '#1e3a8a' : '#334155',
          weight: isSelected ? 3.5 : 1.5,
          opacity: isSelected ? 1 : 0.7,
          fillColor: color,
          fillOpacity: isSelected ? 0.68 : 0.52,
        });

        polygon.on('click', () => {
          onSelectArea(area.id);
        });

        polygon.on('mouseover', () => {
          setHoveredArea(area);
          polygon.setStyle({
            weight: isSelected ? 4 : 2.5,
            color: isSelected ? '#1e3a8a' : '#0f172a',
            fillOpacity: 0.75,
          });
        });

        polygon.on('mouseout', () => {
          setHoveredArea(null);
          polygon.setStyle({
            weight: isSelected ? 3.5 : 1.5,
            color: isSelected ? '#1e3a8a' : '#334155',
            fillOpacity: isSelected ? 0.68 : 0.52,
          });
        });

        const badgeText =
          activeLayer === 'RETENTION'
            ? `Ret. Score: ${area.retentionOpportunityScore}`
            : activeLayer === 'ROLE'
            ? `Role: ${area.strategicRole}`
            : activeLayer === 'DENSITY'
            ? `Density: ${area.customerDensity}`
            : activeLayer === 'COMPETITION'
            ? `Comp: ${area.competitionIndex}`
            : `TAM: ${area.totalAddressableMarket.toLocaleString()}`;

        polygon.bindTooltip(
          `<strong>${area.name}</strong><br/><span style="font-size:11px;color:#475569;">${badgeText}</span>`,
          { sticky: true, direction: 'auto', className: 'leaflet-custom-tooltip' }
        );

        polygon.addTo(polygonGroup);

        // District Center Label Marker
        const labelIcon = L.divIcon({
          className: 'custom-area-label-wrapper',
          html: `
            <div class="px-2 py-0.5 rounded text-[10px] font-bold text-center whitespace-nowrap shadow-xs cursor-pointer select-none transition-transform hover:scale-105 ${
              isSelected
                ? 'bg-blue-900 text-white ring-2 ring-blue-400 ring-offset-1 ring-offset-white'
                : 'bg-slate-900/80 text-white backdrop-blur-xs'
            }">
              <span>${area.name.replace('Semarang ', 'SMG ')}</span>
              ${isSelected ? '<div class="text-[9px] text-blue-200 font-normal">Active</div>' : ''}
            </div>
          `,
          iconSize: [80, 24],
          iconAnchor: [40, 12],
        });

        const labelMarker = L.marker([area.coordinates.lat, area.coordinates.lng], { icon: labelIcon });
        labelMarker.on('click', () => {
          onSelectArea(area.id);
        });
        labelMarker.addTo(polygonGroup);
      });
    }

    // Pan smoothly if selected area changed
    const currentSelected = areas.find((a) => a.id === selectedAreaId);
    if (currentSelected && map) {
      const selectedCoords = DISTRICT_POLYGONS[currentSelected.id];
      if (selectedCoords && selectedCoords.length > 0) {
        map.panTo([currentSelected.coordinates.lat, currentSelected.coordinates.lng], {
          animate: true,
          duration: 0.6,
        });
      }
    }
  }, [
    areas,
    selectedAreaId,
    activeLayer,
    tileStyle,
    spatialPattern,
    hexMetric,
    showDistrictOutlines,
    selectedHexId,
    activeHex,
  ]);

  // 4. Render Landmarks (Simpang Lima, Tanjung Emas, Bandara, etc.)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const landmarkGroup = landmarkGroupRef.current;
    if (!map || !landmarkGroup) return;

    landmarkGroup.clearLayers();

    if (!showLandmarks) return;

    SEMARANG_LANDMARKS.forEach((lm) => {
      const markerIcon = L.divIcon({
        className: 'custom-landmark-pin',
        html: `
          <div class="flex items-center gap-1 bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded-full border border-slate-300 shadow-xs text-[9px] font-semibold text-slate-700 pointer-events-auto">
            <span class="w-1.5 h-1.5 rounded-full ${
              lm.category === 'TRANSPORT'
                ? 'bg-sky-500'
                : lm.category === 'CIVIC'
                ? 'bg-rose-500'
                : lm.category === 'EDUCATION'
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }"></span>
            <span class="truncate max-w-[85px]">${lm.name}</span>
          </div>
        `,
        iconSize: [95, 20],
        iconAnchor: [47, 10],
      });

      const marker = L.marker([lm.lat, lm.lng], { icon: markerIcon });
      marker.bindPopup(`<strong>${lm.name}</strong><br/><span class="text-xs text-slate-500">${lm.category} in Semarang</span>`);
      marker.addTo(landmarkGroup);
    });
  }, [showLandmarks]);

  return (
    <div className={`relative w-full ${heightClass} rounded-xl overflow-hidden border border-slate-200 shadow-xs z-0`}>
      {/* Map Container Element */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Recenter Control */}
      <button
        type="button"
        onClick={() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([-7.010, 110.415], 12, { animate: true });
          }
        }}
        className="absolute bottom-3 left-3 z-[999] bg-white/95 hover:bg-white text-slate-700 hover:text-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer select-none active:scale-95"
        title="Pusatkan kembali peta ke Kota Semarang"
      >
        <RotateCcw className="w-3 h-3 text-blue-600" />
        <span>Pusat Semarang</span>
      </button>

      {/* Floating Mini Hover Card: Hexagon Cell Details */}
      {hoveredHex && spatialPattern === 'hexagonal' && (
        <div className="absolute top-3 right-3 z-[1000] pointer-events-none rounded-xl bg-slate-900/95 text-white p-3 shadow-2xl border border-slate-700/80 text-xs w-64 animate-in fade-in duration-150 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <div className="flex items-center gap-1.5">
              <Hexagon className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />
              <span className="font-bold text-xs text-white truncate max-w-[150px]">{hoveredHex.zoneName}</span>
            </div>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
              {hoveredHex.id}
            </span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Multi-Objective Index:</span>
              <span className="font-mono font-bold text-amber-300">{hoveredHex.compositeScore}/100</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Retention Opportunity:</span>
              <span className="font-mono font-bold text-blue-300">{hoveredHex.retentionScore}/100</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Risiko Churn:</span>
              <span className="font-mono font-semibold text-rose-300">
                {hoveredHex.churnRiskCount} akun ({hoveredHex.churnRiskRate}%)
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Tekanan Kompetitor:</span>
              <span className="font-mono font-medium text-orange-300">{hoveredHex.defenseScore}/100</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Objektif Dominan:</span>
              <span
                className={`font-semibold text-[10px] px-1.5 py-0.5 rounded ${
                  hoveredHex.dominantObjective === 'RETENTION'
                    ? 'bg-blue-600/30 text-blue-300'
                    : hoveredHex.dominantObjective === 'DEFENSE'
                    ? 'bg-amber-600/30 text-amber-300'
                    : hoveredHex.dominantObjective === 'ACQUISITION'
                    ? 'bg-emerald-600/30 text-emerald-300'
                    : 'bg-purple-600/30 text-purple-300'
                }`}
              >
                {hoveredHex.dominantObjective}
              </span>
            </div>

            <div className="pt-2 mt-1 border-t border-slate-800/80 text-[10px] text-slate-300 italic flex items-start gap-1">
              <Sparkles className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
              <span>{hoveredHex.primaryRecommendation}</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Mini Hover Card: District Boundary Mode */}
      {hoveredArea && spatialPattern === 'polygon' && (
        <div className="absolute top-3 right-3 z-[1000] pointer-events-none rounded-lg bg-slate-900/95 text-white p-2.5 shadow-xl border border-slate-700 text-xs w-56 animate-in fade-in duration-150">
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
              <span className="text-slate-400">Customer Density:</span>
              <span className="font-mono font-medium text-white">{hoveredArea.customerDensity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Retention Rank:</span>
              <span className="font-mono font-bold text-emerald-300">#{hoveredArea.objectives.retention.rank}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Customers:</span>
              <span className="font-mono font-medium text-slate-200">{hoveredArea.customerCount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
