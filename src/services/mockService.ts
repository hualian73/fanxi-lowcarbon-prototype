import { anomalyEvents } from '../mock/anomaly';
import { buildCopilotAnswer, initialCopilotMessages } from '../mock/copilot';
import { dashboardKpis, dashboardRecommendations, systemAnomalies } from '../mock/dashboard';
import { dispatchProfiles } from '../mock/dispatch';
import { aerationPrediction, dosingPrediction, pvPrediction } from '../mock/prediction';
import { carbonAccountingTrend, reportBreakdown, reportCards } from '../mock/reports';

const latency = 180;

function clone<T>(data: T): T {
  return JSON.parse(JSON.stringify(data)) as T;
}

function delay<T>(data: T): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(clone(data)), latency);
  });
}

export const mockService = {
  getDashboard: () =>
    delay({
      kpis: dashboardKpis,
      recommendations: dashboardRecommendations,
      anomalies: systemAnomalies,
    }),
  getPredictions: () => delay({ aerationPrediction, dosingPrediction, pvPrediction }),
  getDispatchProfiles: () => delay(dispatchProfiles),
  getAnomalyEvents: () => delay(anomalyEvents),
  getCopilotInitialMessages: () => delay(initialCopilotMessages),
  askCopilot: (question: string) => delay(buildCopilotAnswer(question)),
  getReports: () => delay({ reportCards, carbonAccountingTrend, reportBreakdown }),
};
