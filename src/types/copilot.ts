import type { EvidenceItem, RiskLevel, ToolTrace } from './common';

export interface CopilotAnswerSection {
  title: string;
  content: string;
}

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
  risk?: RiskLevel;
  confidence?: number;
  sections?: CopilotAnswerSection[];
  toolTrace?: ToolTrace[];
  evidence?: EvidenceItem[];
}
