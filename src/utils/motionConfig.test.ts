import { describe, expect, it } from 'vitest';
import { createMotionPlan } from './motionConfig';

describe('motionConfig', () => {
  it('disables all GSAP timelines when reduced motion is requested', () => {
    const plan = createMotionPlan(true);

    expect(plan.enabled).toBe(false);
    expect(plan.staggerTargets).toEqual([]);
    expect(plan.loopTargets).toEqual([]);
  });

  it('targets the dashboard shell, KPI cards, recommendations, and process map', () => {
    const plan = createMotionPlan(false);

    expect(plan.enabled).toBe(true);
    expect(plan.staggerTargets).toContain('.hero-panel');
    expect(plan.staggerTargets).toContain('.kpi-card');
    expect(plan.staggerTargets).toContain('.recommendation-card');
    expect(plan.staggerTargets).toContain('.industrial-card');
    expect(plan.loopTargets).toContain('.process-flow-map');
    expect(plan.loopTargets).toContain('.hero-metrics');
  });
});
