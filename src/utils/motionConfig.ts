export interface MotionPlan {
  enabled: boolean;
  staggerTargets: string[];
  loopTargets: string[];
}

export function createMotionPlan(reducedMotion: boolean): MotionPlan {
  if (reducedMotion) {
    return {
      enabled: false,
      staggerTargets: [],
      loopTargets: [],
    };
  }

  return {
    enabled: true,
    staggerTargets: ['.hero-panel', '.page-title-block', '.kpi-card', '.industrial-card', '.recommendation-card'],
    loopTargets: ['.process-flow-map', '.hero-metrics'],
  };
}
