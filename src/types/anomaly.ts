import type { EvidenceItem, Recommendation, RiskLevel } from './common';

export interface RootCause {
  id: string;
  name: string;
  score: number;
  risk: RiskLevel;
  mechanism: string;
  relatedTags: string[];
}

export interface AnomalyEvent {
  id: string;
  title: string;
  risk: RiskLevel;
  detectedAt: string;
  location: string;
  symptom: string;
  rootCauses: RootCause[];
  evidence: EvidenceItem[];
  recommendations: Recommendation[];
}
