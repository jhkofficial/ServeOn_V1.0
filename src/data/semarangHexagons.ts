import { AreaIntelligence, StrategicRole } from '../types';
import { SEMARANG_AREAS } from './semarangData';

export type SpatialPatternMode = 'hexagonal' | 'polygon';

export type HexMetricObjective = 'COMPOSITE' | 'RETENTION' | 'CHURN_RISK' | 'DEFENSE' | 'ACQUISITION' | 'DOMINANT_ROLE';

export interface SpatialHexCell {
  id: string; // e.g. 'HEX-SMG-101'
  code: string;
  centerLat: number;
  centerLng: number;
  vertices: [number, number][]; // 6 lat-lng pairs for Leaflet Polygon
  svgPoints: string; // for SVG canvas fallback
  areaId: string;
  areaName: string;
  zoneName: string; // Micro-zone descriptor (e.g. "Simpang Lima Core", "Tembalang Campus", "Pelabuhan Tanjung Emas")
  // Multi-Objective Spatial Scores (0 - 100)
  retentionScore: number;
  churnRiskCount: number;
  churnRiskRate: number; // %
  defenseScore: number;
  acquisitionScore: number;
  expansionScore: number;
  compositeScore: number; // TOPSIS synthesized multi-objective index
  dominantObjective: 'RETENTION' | 'DEFENSE' | 'ACQUISITION' | 'EXPANSION';
  strategicRole: StrategicRole;
  customerDensity: number;
  activeCustomerCount: number;
  primaryRecommendation: string;
}

// Convert lat/lng to SVG coordinates matching viewBox "140 160 500 400"
export function latLngToSvg(lat: number, lng: number): { x: number; y: number } {
  const x = Math.round((lng - 110.1964289) / 0.000521208958);
  const y = Math.round((lat - (-6.85548281)) / -0.000434436999);
  return { x, y };
}

// Known micro-zone landmarks by proximity
const MICRO_ZONE_LABELS: Record<string, string[]> = {
  'semarang-selatan': ['Simpang Lima Core', 'Peterongan Commercial', 'Pleburan Hub', 'Lempongsari District'],
  'semarang-tengah': ['Pandaran Business Belt', 'Pekunden Corridor', 'Kranggan Market Hub', 'Gajahmada Financial'],
  'semarang-timur': ['Citarum Logistics Area', 'Bugangan Trade Center', 'Karangtempel Residential'],
  'candisari': ['Candi Baru Heights', 'Kagok Hills', 'Tegalsari Residential', 'Jatingaleh Junction'],
  'gajahmungkur': ['Gajahmungkur Diplomatic', 'Bendan Duwur Hills', 'Sampangan Transit'],
  'semarang-barat': ['Kalibanteng Corridor', 'Krobokan Trade Belt', 'Manyaran Residential', 'Bandara Gateway'],
  'semarang-utara': ['Pelabuhan Tj. Emas Zone', 'Kota Lama Historic', 'Bandarharjo Waterfront', 'Panggung Lor Maritime'],
  'pedurungan': ['Majapahit Commercial Strip', 'Tlogosari Megah Hub', 'Plamongan Indah Area', 'Gemah Residential'],
  'gayamsari': ['Gajah Raya Axis', 'Sambirejo Commercial', 'Kaligawe Southern Link'],
  'banyumanik': ['Pudakpayung Suburb', 'Sukun Commercial Hub', 'Gedawang Residential', 'Srondol Tech corridor'],
  'tembalang': ['Undip Campus Gateway', 'Banjarsari Student Hub', 'Kramas Valley', 'Bulusan Residential'],
  'ngaliyan': ['BSB City Eco Park', 'Ngaliyan Industrial', 'Bringin Growth Corridor', 'Wates Tech Cluster'],
  'genuk': ['Kaligawe Industrial Port', 'Terboyo Freight Logistics', 'Bangetayu Megah', 'Genuksari Corridor'],
  'gunungpati': ['Unnes Campus Perimeter', 'Sekaran Academic Zone', 'Jatirejo Agritech Hub', 'Gunungpati Agro'],
  'mijen': ['BSB Uptown City Center', 'Cangkiran Transit Hub', 'Mijen Eco Corridor', 'Jatisari Greenfield'],
  'tugu': ['KIK Kendal-Tugu Industrial', 'Tambak Aji Factory Belt', 'Mangkang Terminal Axis', 'Karanganyar Logistics'],
};

// Tactical recommendations by dominant objective
const RECOMMENDATIONS = {
  RETENTION: [
    'Proaktif Program Bundling VIP & Free Bandwidth Boost 6 Bulan',
    'Customer Care Visit khusus untuk 100 akun beromzet tertinggi',
    'Prioritas Pemeliharaan Jaringan & SLA Penggantian Perangkat < 2 Jam',
    'Lock-in Kontrak Jangka Panjang dengan diskon loyalti bertingkat',
  ],
  DEFENSE: [
    'Counter-Promo Agresif menghadang penetrasi paket promo kompetitor',
    'Penguatan BTS & Microcell densification di titik rawan churn ke pesaing',
    'Pemberian Voucher Upgrade Gratis bagi pelanggan yang terdeteksi dual-SIM',
  ],
  ACQUISITION: [
    'Direct Sales Blitz door-to-door dengan paket bundling sambungan baru',
    'Aktivasi Partnership dengan pengembang perumahan baru & ruko UMKM',
    'Program Referral Komunitas berhadiah reward tunai instan',
  ],
  EXPANSION: [
    'Akselerasi Feeder Fiber Optik & instalasi FAT (Fiber Access Terminal)',
    'Akuisisi lokasi pole sharing dengan utilitas lokal untuk perluasan jangkauan',
    'Penyusunan feasibility study penambahan node distribusi jaringan',
  ],
};

let cachedHexagons: SpatialHexCell[] | null = null;

export function getSemarangHexagons(areas: AreaIntelligence[] = SEMARANG_AREAS): SpatialHexCell[] {
  if (cachedHexagons && cachedHexagons.length > 0) {
    return cachedHexagons;
  }

  const hexList: SpatialHexCell[] = [];
  const r = 0.0078; // radius ~860m
  const dy = r * 1.5;
  const dx = r * Math.sqrt(3);

  let idCounter = 101;
  const zoneIndices: Record<string, number> = {};

  // Grid bounding envelope covering Semarang
  const minLat = -7.085;
  const maxLat = -6.935;
  const minLng = 110.29;
  const maxLng = 110.50;

  for (let row = 0, y = minLat; y <= maxLat; row++, y += dy) {
    const xOffset = (row % 2) * (dx / 2);
    for (let x = minLng + xOffset; x <= maxLng; x += dx) {
      // Find nearest district centroid
      let nearestDist = 999;
      let nearestArea: AreaIntelligence | null = null;
      for (const a of areas) {
        const d = Math.hypot(x - a.coordinates.lng, y - a.coordinates.lat);
        if (d < nearestDist) {
          nearestDist = d;
          nearestArea = a;
        }
      }

      // Keep cell if within reasonable proximity to municipal district
      if (nearestArea && nearestDist <= 0.038) {
        // Calculate 6 vertices
        const vertices: [number, number][] = [];
        const svgVertices: string[] = [];

        for (let i = 0; i < 6; i++) {
          const angle = ((60 * i - 30) * Math.PI) / 180;
          const vLat = Number((y + r * Math.sin(angle)).toFixed(5));
          const vLng = Number((x + (r / Math.cos((y * Math.PI) / 180)) * Math.cos(angle)).toFixed(5));
          vertices.push([vLat, vLng]);

          const svgCoord = latLngToSvg(vLat, vLng);
          svgVertices.push(`${svgCoord.x},${svgCoord.y}`);
        }

        // Spatial noise generator for natural variance across micro-cells
        const seed = Math.sin(x * 14.123 + y * 91.456) * 43758.5453;
        const noise = (seed - Math.floor(seed)) - 0.5; // -0.5 to 0.5
        const noise2 = Math.cos(x * 23.45 + y * 12.89);

        // Calculate Multi-Objective Scores for this hex
        const retScore = Math.min(99, Math.max(25, Math.round(nearestArea.retentionOpportunityScore + noise * 14)));
        const defScore = Math.min(99, Math.max(20, Math.round(nearestArea.competitionPressureScore + noise2 * 15)));
        const acqScore = Math.min(99, Math.max(20, Math.round(nearestArea.marketPotentialScore - noise * 12)));
        const expScore = Math.min(99, Math.max(15, Math.round((nearestArea.customerDensity * 0.4 + nearestArea.relativeCoverageGapScore * 0.6) + noise2 * 10)));

        // Multi-Objective Composite Synthesis (TOPSIS-weighted: Retention 35%, Defense 25%, Acq 25%, Exp 15%)
        const compositeScore = Number((0.35 * retScore + 0.25 * defScore + 0.25 * acqScore + 0.15 * expScore).toFixed(1));

        // Determine dominant objective
        let dominant: 'RETENTION' | 'DEFENSE' | 'ACQUISITION' | 'EXPANSION' = 'RETENTION';
        if (defScore > retScore && defScore > acqScore && defScore > expScore) {
          dominant = 'DEFENSE';
        } else if (acqScore > retScore && acqScore > defScore && acqScore > expScore) {
          dominant = 'ACQUISITION';
        } else if (expScore > retScore && expScore > defScore && expScore > acqScore) {
          dominant = 'EXPANSION';
        }

        // Zone label
        const areaZones = MICRO_ZONE_LABELS[nearestArea.id] || [`${nearestArea.name} Sector`];
        const zIdx = (zoneIndices[nearestArea.id] || 0) % areaZones.length;
        zoneIndices[nearestArea.id] = (zoneIndices[nearestArea.id] || 0) + 1;
        const zoneName = areaZones[zIdx];

        // Estimated customers & churn count in this micro hex
        const hexShare = 1 / Math.max(3, areaZones.length * 1.5);
        const activeCust = Math.round(nearestArea.customerCount * hexShare * (0.8 + Math.abs(noise) * 0.4));
        const churnCount = Math.round(activeCust * (nearestArea.churnRiskPercent / 100) * (0.9 + Math.abs(noise2) * 0.3));
        const churnRate = Number(((churnCount / Math.max(1, activeCust)) * 100).toFixed(1));

        // Recommendation
        const recList = RECOMMENDATIONS[dominant];
        const rec = recList[Math.floor(Math.abs(noise * 10)) % recList.length];

        hexList.push({
          id: `HEX-SMG-${idCounter++}`,
          code: `H3-SMG-${(idCounter - 1).toString(16).toUpperCase()}`,
          centerLat: Number(y.toFixed(5)),
          centerLng: Number(x.toFixed(5)),
          vertices,
          svgPoints: svgVertices.join(' '),
          areaId: nearestArea.id,
          areaName: nearestArea.name,
          zoneName: `${nearestArea.name} • ${zoneName}`,
          retentionScore: retScore,
          churnRiskCount: churnCount,
          churnRiskRate: churnRate,
          defenseScore: defScore,
          acquisitionScore: acqScore,
          expansionScore: expScore,
          compositeScore,
          dominantObjective: dominant,
          strategicRole: nearestArea.strategicRole,
          customerDensity: nearestArea.customerDensity,
          activeCustomerCount: activeCust,
          primaryRecommendation: rec,
        });
      }
    }
  }

  cachedHexagons = hexList;
  return hexList;
}
