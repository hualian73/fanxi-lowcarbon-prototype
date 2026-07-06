import type { RiskLevel } from './common';

export type DispatchMode = 'safety' | 'cost' | 'carbon' | 'balanced';

export interface DispatchPlanItem {
  id: string;
  timeRange: string;
  unit: string;
  action: string;
  setpoint: string;
  carbonImpactKg: number;
  costImpactYuan: number;
  risk: RiskLevel;
  rationale: string;
}

export interface DispatchModeProfile {
  mode: DispatchMode;
  label: string;
  objective: string;
  expectedSaving: string;
  riskNote: string;
  plan: DispatchPlanItem[];
}
