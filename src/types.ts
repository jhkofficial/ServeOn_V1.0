export type StrategicRole = 'PROTECT' | 'DEFEND' | 'ACQUIRE' | 'EXPAND' | 'MONITOR';

export type BusinessObjective = 'ALL' | 'RETENTION' | 'MARKET_DEFENSE' | 'ACQUISITION' | 'EXPANSION';

export type ScreenId = 
  | 'login'
  | 'executive-overview'
  | 'strategic-map'
  | 'retention'
  | 'market-defense'
  | 'acquisition'
  | 'network-expansion'
  | 'candidate-detail'
  | 'explainability'
  | 'recommendation'
  | 'action-execution'
  | 'performance-measurement'
  | 'business-value'
  | 'learning-feedback'
  | 'user-management'
  | 'role-permission'
  | 'audit-log'
  | 'application-settings';

export type RecommendationLifecycleStatus = 
  | 'GENERATED'
  | 'UNDER REVIEW'
  | 'APPROVED'
  | 'IN EXECUTION'
  | 'COMPLETED'
  | 'MEASURED'
  | 'CLOSED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'ON HOLD';

export type ExecutionHealthStatus = 'ON TRACK' | 'AT RISK' | 'DELAYED' | 'COMPLETED';

export type MeasurementMethodType = 
  | 'Treatment vs Control'
  | 'Before vs After'
  | 'Pilot vs Comparison Area'
  | 'Historical Benchmark'
  | 'Counterfactual Benchmark';

export type OutcomeStatusType = 
  | 'POSITIVE OUTCOME'
  | 'NEUTRAL'
  | 'NEGATIVE OUTCOME'
  | 'INSUFFICIENT EVIDENCE';

export type MeasurementConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type LearningStatusType = 
  | 'VALIDATED'
  | 'NEEDS REVIEW'
  | 'MODEL REVIEW'
  | 'BUSINESS EXECUTION ISSUE';

export interface ActionPlanItem {
  id: string;
  recommendationId: string;
  name: string;
  objective: BusinessObjective;
  areaId: string;
  areaName: string;
  owner: string;
  businessUnit: string;
  region: string;
  startDate: string;
  endDate: string;
  budget: number;
  budgetUsed: number;
  targetCustomers: number;
  contacted: number;
  responded: number;
  returned: number;
  currentReturnRate: number;
  targetReturnRate: number;
  progress: number; // 0 - 100
  status: RecommendationLifecycleStatus;
  health: ExecutionHealthStatus;
  baseline: {
    period: string;
    kpi: string;
    value: string;
  };
  target: {
    primaryKpi: string;
    targetValue: string;
    secondaryKpi: string;
    measurementPeriod: string;
  };
  measurementMethod: MeasurementMethodType;
  confidence: MeasurementConfidenceLevel;
  notes?: string;
}

export interface PerformanceMeasurementItem {
  id: string;
  recommendationId: string;
  actionId: string;
  areaId: string;
  areaName: string;
  objective: BusinessObjective;
  method: MeasurementMethodType;
  confidence: MeasurementConfidenceLevel;
  outcomeStatus: OutcomeStatusType;
  baselineValue: string;
  controlValue: string;
  actualValue: string;
  incrementalUplift: string;
  treatmentConversion: number;
  controlConversion: number;
  incrementalCustomers: number;
  averageTransactionValue: number;
  incrementalRevenue: number;
  cost: number;
  netBenefit: number;
  roi: number;
  summary: string;
  objectiveDetails: Record<string, any>;
}

export interface HistoricalOutcomeItem {
  date: string;
  objective: BusinessObjective;
  recommendation: string;
  action: string;
  outcome: OutcomeStatusType;
  uplift: string;
  businessValue: string;
  confidence: MeasurementConfidenceLevel;
}

export interface LearningItem {
  id: string;
  areaName: string;
  areaId: string;
  objective: BusinessObjective;
  recommendationName: string;
  predictedOpportunity: string;
  actualOutcome: OutcomeStatusType;
  upliftSummary: string;
  incrementalRevenue: string;
  status: LearningStatusType;
  recommendationQuality: 'HIGH' | 'MEDIUM' | 'LOW';
  executionCompletion: number; // percentage
  businessOutcome: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'INCONCLUSIVE';
  systemInsight: string;
  feedbackRuleUpdate: string;
}

export type UserRole =
  | 'Super Admin'
  | 'Application Admin'
  | 'Executive / Management'
  | 'Regional Manager'
  | 'Network Planning'
  | 'CRM / Marketing'
  | 'Data Analyst'
  | 'Viewer';

export type UserStatus = 'Active' | 'Inactive' | 'Pending';

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  businessUnit: string;
  jobTitle: string;
  role: UserRole;
  regionAccess: string[];
  kabupatenAccess?: string[];
  lastLogin: string;
  status: UserStatus;
  avatarInitials: string;
  department?: string;
  createdAt?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  userEmail?: string;
  role: UserRole;
  activity: string;
  module: string;
  region: string;
  result: 'Success' | 'Reviewed' | 'Approved' | 'Failed' | 'Pending';
  details?: string;
  ipAddress?: string;
}

export interface RolePermissions {
  role: UserRole;
  description: string;
  userCount: number;
  permissions: {
    overview: {
      viewExecutiveOverview: boolean;
    };
    where: {
      viewStrategicActionMap: boolean;
      viewAllRegions: boolean;
    };
    protect: {
      viewRetention: boolean;
      viewMarketShareDefense: boolean;
    };
    grow: {
      viewAcquisition: boolean;
      viewNetworkExpansion: boolean;
    };
    understand: {
      viewCandidateDetail: boolean;
      viewExplainability: boolean;
    };
    decide: {
      viewRecommendation: boolean;
      approveRecommendation: boolean;
    };
    govern: {
      manageUsers: boolean;
      manageRoles: boolean;
      viewAuditLogs: boolean;
      manageApplicationSettings: boolean;
    };
  };
}

export interface ApplicationSettingsConfig {
  general: {
    applicationName: string;
    environment: 'Production' | 'Pilot' | 'Staging' | 'Development';
    defaultRegion: string;
    defaultPeriod: string;
  };
  decisionIntelligence: {
    frameworkVersion: string;
    recommendationApproval: 'Human Approval Required' | 'Autonomous Mode' | 'Dual Sign-off';
    evidenceConfidenceDisplay: 'Enabled' | 'Disabled';
    topsisWeightPreset: string;
  };
  data: {
    latestDataRefresh: string;
    dataStatus: 'Validated' | 'Syncing' | 'Stale';
    refreshCadence: string;
  };
  security: {
    authenticationMethod: 'Corporate SSO' | 'MFA + Corporate Password' | 'LDAP/AD';
    sessionTimeout: '15 minutes' | '30 minutes' | '60 minutes' | '8 hours';
    auditLogging: 'Enabled' | 'Strict' | 'Disabled';
  };
}

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
