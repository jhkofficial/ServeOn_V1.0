import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RotateCcw } from 'lucide-react';
import { AreaIntelligence, StrategicRole } from '../../types';
import { SEMARANG_AREAS } from '../../data/semarangData';
import { DISTRICT_POLYGONS, SEMARANG_LANDMARKS } from '../../data/semarangPolygons';

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
}

export const LeafletSemarangMap: React.FC<LeafletSemarangMapProps> = ({
  areas,
  selectedAreaId,
  onSelectArea,
  activeLayer = 'RETENTION',
  heightClass = 'h-[460px]',
  tileStyle = 'positron',
  showLandmarks = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const polygonLayersGroupRef = useRef<L.LayerGroup | null>(null);
  const landmarkGroupRef = useRef<L.LayerGroup | null>(null);

  const [hoveredArea, setHoveredArea] = useState<AreaIntelligence | null>(null);

  // Helper function to determine polygon fill color based on active layer
  const getAreaColor = (area: AreaIntelligence, isHovered: boolean): string => {
    if (activeLayer === 'ROLE') {
      switch (area.strategicRole) {
        case 'PROTECT':
          return isHovered ? '#1d4ed8' : '#2563eb'; // Royal Blue
        case 'DEFEND':
          return isHovered ? '#d97706' : '#f59e0b'; // Amber
        case 'ACQUIRE':
          return isHovered ? '#059669' : '#10b981'; // Emerald
        case 'EXPAND':
          return isHovered ? '#7c3aed' : '#8b5cf6'; // Purple
        case 'MONITOR':
        default:
          return isHovered ? '#64748b' : '#94a3b8'; // Slate
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

    // Semarang center coordinates: ~ -7.000, 110.420
    const map = L.map(mapContainerRef.current, {
      center: [-7.010, 110.415],
      zoom: 12,
      minZoom: 10,
      maxZoom: 16,
      zoomControl: false,
    });

    // Custom zoom control in bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Initial tile layer
    const config = getTileConfig(tileStyle);
    const tileLayer = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: config.maxZoom,
      subdomains: (config as any).subdomains || 'abc',
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Layer groups for polygons and landmarks
    const polygonGroup = L.layerGroup().addTo(map);
    const landmarkGroup = L.layerGroup().addTo(map);

    polygonLayersGroupRef.current = polygonGroup;
    landmarkGroupRef.current = landmarkGroup;
    mapInstanceRef.current = map;

    // Force size calculation after container mounts
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Update tile layer if tileStyle changes
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

  // 3. Render / Update District Polygons & Labels
  useEffect(() => {
    const map = mapInstanceRef.current;
    const polygonGroup = polygonLayersGroupRef.current;
    if (!map || !polygonGroup) return;

    polygonGroup.clearLayers();

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
        dashArray: isSelected ? '' : undefined,
      });

      // Events
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

      // Bind tooltip
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
      const centerLat = area.coordinates.lat;
      const centerLng = area.coordinates.lng;

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

      const labelMarker = L.marker([centerLat, centerLng], { icon: labelIcon, interactive: true });
      labelMarker.on('click', () => {
        onSelectArea(area.id);
      });
      labelMarker.addTo(polygonGroup);
    });

    // Fit bounds if selected area changed and map exists
    const currentSelected = areas.find((a) => a.id === selectedAreaId);
    if (currentSelected && map) {
      const selectedCoords = DISTRICT_POLYGONS[currentSelected.id];
      if (selectedCoords && selectedCoords.length > 0) {
        // Pan smoothly to selected area
        map.panTo([currentSelected.coordinates.lat, currentSelected.coordinates.lng], {
          animate: true,
          duration: 0.6,
        });
      }
    }
  }, [areas, selectedAreaId, activeLayer, tileStyle]);

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

      {/* Floating Mini Hover Card */}
      {hoveredArea && (
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
