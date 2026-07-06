export type RiskLevel = 'low' | 'medium' | 'high';

export type UserRole = 'operator' | 'engineer' | 'manager';

export type RecommendationAction = 'adopt' | 'reject' | 'modify';

export type RecommendationStatus = 'new' | 'adopted' | 'rejected' | 'modified' | 'pending_review';

export type DataQualityState = 'normal' | 'missing' | 'fallback' | 'failed' | 'stale';

export interface KpiMetric {
  id: string;
  title: string;
  value: string | number;
  unit?: string;
  trend: number;
  status: RiskLevel;
  hint: string;
  sparkline?: number[];
}

export interface EvidenceItem {
  id: string;
  title: string;
  source: string;
  time: string;
  description: string;
  confidence: number;
  state?: DataQualityState;
}

export interface ToolTrace {
  id: string;
  name: string;
  input: string;
  output: string;
  durationMs: number;
  status: 'success' | 'failed' | 'fallback';
  time: string;
}

export interface Recommendation {
  id: string;
  title: string;
  category: 'aeration' | 'dosing' | 'pv' | 'carbon' | 'dispatch' | 'anomaly';
  risk: RiskLevel;
  confidence: number;
  summary: string;
  expectedImpact: string;
  explanation: string;
  status: RecommendationStatus;
  createdAt: string;
  evidence: EvidenceItem[];
  toolTrace: ToolTrace[];
}

export interface SystemAnomalyState {
  id: string;
  title: string;
  state: DataQualityState;
  description: string;
  impact: string;
  detectedAt: string;
}

export interface AuditRecord {
  traceId: string;
  recommendationId: string;
  action: RecommendationAction;
  role: UserRole;
  note: string;
  at: string;
}

export interface TimeSeriesPoint {
  time: string;
  value: number;
  forecast?: number;
  upper?: number;
  lower?: number;
  label?: string;
}
