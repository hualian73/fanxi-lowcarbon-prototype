import dayjs from 'dayjs';
import type { RecommendationAction, RecommendationStatus, RiskLevel, UserRole } from '../types/common';

const highRiskApprovalRoles: UserRole[] = ['engineer', 'manager'];

export function canConfirmHighRisk(role: UserRole): boolean {
  return highRiskApprovalRoles.includes(role);
}

export function nextRecommendationStatus(params: {
  risk: RiskLevel;
  role: UserRole;
  action: RecommendationAction;
}): RecommendationStatus {
  if (params.action === 'reject') {
    return 'rejected';
  }

  if (params.risk === 'high' && !canConfirmHighRisk(params.role)) {
    return 'pending_review';
  }

  if (params.action === 'modify') {
    return 'modified';
  }

  return 'adopted';
}

export function buildRecommendationAudit(params: {
  id: string;
  action: RecommendationAction;
  role: UserRole;
  note?: string;
}) {
  return {
    traceId: `AUD-${dayjs().format('YYYYMMDDHHmmss')}-${params.id}`,
    recommendationId: params.id,
    action: params.action,
    role: params.role,
    note: params.note ?? '',
    at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  };
}
