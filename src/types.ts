export type StrategicRole = 'PROTECT' | 'DEFEND' | 'ACQUIRE' | 'EXPAND' | 'MONITOR';

export type BusinessObjective = 'ALL' | 'RETENTION' | 'MARKET_DEFENSE' | 'ACQUISITION' | 'EXPANSION';

export type ScreenId = 
  | 'executive-overview'
  | 'strategic-map'
  | 'retention'
  | 'market-defense'
  | 'acquisition'
  | 'network-expansion'
  | 'candidate-detail'
  | 'explainability'
  | 'recommendation';

export interface ExpansionGate {
  marketPotentialPass: boolean;
  marketPotentialValue: number;
  accessibilityPass: boolean;
  accessibilityValue: number;
  customerDensityPass: boolean;
  customerDensityValue: number;
  relativeCoverageGapPass: boolean;
  relativeCoverageGapValue: number;
  absoluteCoverageGapPass: boolean;
  absoluteCoverageGapValue: number;
  allPassed: boolean;
  failedGates: string[];
}

export interface AreaObjectiveScore {
  rank: number | null;
  score: number;
  priority: 'VERY HIGH' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NOT ELIGIBLE';
  eligible: boolean;
  topsisScore?: number;
}

export interface AreaIntelligence {
  id: string;
  name: string;
  code: string;
  region: string;
  city: string;
  strategicRole: StrategicRole;
  customerCount: number;
  customerGrowthRate: number; // % YoY
  arpu: number; // in IDR thousands
  churnRiskCount: number; // High-risk customers count
  churnRiskPercent: number; // %
  competitionLevel: 'HIGH' | 'MODERATE' | 'LOW';
  competitionIndex: number; // 0-100
  marketShare: number; // %
  competitorShare: number; // %
  totalAddressableMarket: number;
  penetrationRate: number; // %
  customerDensity: number; // customers / km² or normalized 0-100
  retentionOpportunityScore: number; // 0-100
  competitionPressureScore: number; // 0-100
  accessibilityScore: number; // 0-100
  marketPotentialScore: number; // 0-100
  relativeCoverageGapScore: number; // 0-100
  absoluteCoverageGapScore: number; // 0-100
  businessContributionScore: number; // 0-100
  
  // Overall Evidence Confidence (0-100%)
  confidenceScore: number;
  confidenceComponents: {
    dataQuality: number;
    freshness: number;
    modelEvidence: number;
    sampleSize: number;
  };

  // Four Objective Evaluations
  objectives: {
    retention: AreaObjectiveScore;
    defense: AreaObjectiveScore;
    acquisition: AreaObjectiveScore;
    expansion: AreaObjectiveScore;
  };

  expansionGate: ExpansionGate;

  // Plain business narrative
  areaStory: string;
  topDrivers: { factor: string; impact: string; weight: number; positive: boolean }[];
  businessReasons: string[];
  
  // Analytical modeling details (V2.1)
  analyticalEvidence: {
    championModel: string;
    auroc: number;
    recall: number;
    precision: number;
    threshold: number;
    ahpConsistencyRatio: number; // Must be < 0.10 for AHP validity
    topsisRelativeCloseness: number;
    shapValues: { feature: string; shapValue: number; importance: number }[];
  };

  // Recommendations
  recommendation: {
    primaryObjective: BusinessObjective;
    priority: 'VERY HIGH' | 'HIGH' | 'MEDIUM' | 'MONITOR ONLY';
    recommendedAction: string;
    actionType: 'RETENTION_CAMPAIGN' | 'MARKET_DEFENSE' | 'DEMAND_TEST' | 'EXPANSION_STUDY' | 'CONTINUE_MONITOR';
    executiveSummary: string;
    nextActions: { step: number; title: string; detail: string; owner: string; completed?: boolean }[];
    workflowStage: 'GENERATED' | 'REVIEWED' | 'APPROVED' | 'EXECUTED' | 'MEASURED';
  };

  // Coordinates for Map
  coordinates: {
    lat: number;
    lng: number;
    svgX: number;
    svgY: number;
    svgPath: string;
  };
}

export interface GlobalFilterState {
  region: string;
  city: string;
  selectedKecamatanId: string;
  period: string;
  objective: BusinessObjective;
  strategicRoleFilter: 'ALL' | StrategicRole;
}
