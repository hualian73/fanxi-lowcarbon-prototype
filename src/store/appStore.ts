import { create } from 'zustand';
import type {
  AuditRecord,
  Recommendation,
  RecommendationAction,
  RecommendationStatus,
  RiskLevel,
  UserRole,
} from '../types/common';
import { dashboardRecommendations } from '../mock/dashboard';
import { buildRecommendationAudit, nextRecommendationStatus } from '../utils/recommendationPolicy';

interface AppState {
  role: UserRole;
  currentRisk: RiskLevel;
  dataUpdatedAt: string;
  recommendations: Recommendation[];
  audits: AuditRecord[];
  setRole: (role: UserRole) => void;
  setCurrentRisk: (risk: RiskLevel) => void;
  handleRecommendationAction: (id: string, action: RecommendationAction, note?: string) => RecommendationStatus;
}

export const useAppStore = create<AppState>((set, get) => ({
  role: 'operator',
  currentRisk: 'medium',
  dataUpdatedAt: '2026-07-05 17:45:20',
  recommendations: dashboardRecommendations,
  audits: [],
  setRole: (role) => set({ role }),
  setCurrentRisk: (currentRisk) => set({ currentRisk }),
  handleRecommendationAction: (id, action, note) => {
    const state = get();
    const target = state.recommendations.find((item) => item.id === id);
    if (!target) {
      return 'new';
    }

    const status = nextRecommendationStatus({ risk: target.risk, role: state.role, action });
    const audit = buildRecommendationAudit({ id, action, role: state.role, note });

    set({
      recommendations: state.recommendations.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              explanation: note && action === 'modify' ? `${item.explanation}\n人工修改说明：${note}` : item.explanation,
            }
          : item,
      ),
      audits: [audit, ...state.audits],
    });

    return status;
  },
}));
