import { describe, expect, it } from 'vitest';
import {
  buildRecommendationAudit,
  canConfirmHighRisk,
  nextRecommendationStatus,
} from './recommendationPolicy';

describe('recommendationPolicy', () => {
  it('allows only authorized roles to confirm high-risk recommendations', () => {
    expect(canConfirmHighRisk('operator')).toBe(false);
    expect(canConfirmHighRisk('engineer')).toBe(true);
    expect(canConfirmHighRisk('manager')).toBe(true);
  });

  it('keeps high-risk adoption pending review when role lacks approval authority', () => {
    expect(nextRecommendationStatus({ risk: 'high', role: 'operator', action: 'adopt' })).toBe(
      'pending_review',
    );
    expect(nextRecommendationStatus({ risk: 'high', role: 'engineer', action: 'adopt' })).toBe(
      'adopted',
    );
  });

  it('records auditable feedback for modified adoption', () => {
    const audit = buildRecommendationAudit({
      id: 'REC-AER-01',
      action: 'modify',
      role: 'engineer',
      note: '将 DO 下限由 1.8 调整为 2.0 mg/L',
    });

    expect(audit).toMatchObject({
      recommendationId: 'REC-AER-01',
      action: 'modify',
      role: 'engineer',
      note: '将 DO 下限由 1.8 调整为 2.0 mg/L',
    });
    expect(audit.traceId).toMatch(/^AUD-/);
  });

  it('marks modified adoption separately from direct adoption', () => {
    expect(nextRecommendationStatus({ risk: 'medium', role: 'operator', action: 'modify' })).toBe(
      'modified',
    );
  });
});
