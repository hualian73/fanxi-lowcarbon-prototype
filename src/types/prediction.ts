import type { RiskLevel, TimeSeriesPoint } from './common';

export interface PredictionSeries {
  id: string;
  name: string;
  unit: string;
  risk: RiskLevel;
  accuracy: number;
  horizon: string;
  points: TimeSeriesPoint[];
}

export interface AerationPrediction {
  basin: string;
  doTarget: number;
  airFlowForecast: PredictionSeries;
  ammoniaForecast: PredictionSeries;
  energyForecast: PredictionSeries;
}

export interface DosingPrediction {
  chemical: string;
  currentDose: number;
  suggestedDose: number;
  unit: string;
  reason: string;
  points: TimeSeriesPoint[];
}

export interface PvPrediction {
  installedCapacityKw: number;
  selfUseRate: number;
  carbonReductionKg: number;
  generationForecast: PredictionSeries;
}
