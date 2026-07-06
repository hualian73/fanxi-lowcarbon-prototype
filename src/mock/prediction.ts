import type { AerationPrediction, DosingPrediction, PvPrediction } from '../types/prediction';

export const aerationPrediction: AerationPrediction = {
  basin: '2# 生化池',
  doTarget: 2.0,
  airFlowForecast: {
    id: 'air-flow',
    name: '曝气风量预测',
    unit: 'Nm3/h',
    risk: 'high',
    accuracy: 0.87,
    horizon: '未来 120 分钟',
    points: [
      { time: '18:00', value: 4520, forecast: 4620, upper: 4880, lower: 4380 },
      { time: '18:15', value: 4550, forecast: 4710, upper: 4960, lower: 4420 },
      { time: '18:30', value: 4610, forecast: 4820, upper: 5100, lower: 4510 },
      { time: '18:45', value: 4680, forecast: 4920, upper: 5180, lower: 4580 },
      { time: '19:00', value: 4740, forecast: 5010, upper: 5300, lower: 4660 },
      { time: '19:15', value: 4780, forecast: 5080, upper: 5380, lower: 4700 },
    ],
  },
  ammoniaForecast: {
    id: 'nh3n',
    name: '出水 NH3-N 预测',
    unit: 'mg/L',
    risk: 'medium',
    accuracy: 0.84,
    horizon: '未来 120 分钟',
    points: [
      { time: '18:00', value: 0.92, forecast: 0.98, upper: 1.18, lower: 0.82 },
      { time: '18:15', value: 0.98, forecast: 1.08, upper: 1.26, lower: 0.9 },
      { time: '18:30', value: 1.05, forecast: 1.18, upper: 1.36, lower: 0.95 },
      { time: '18:45', value: 1.1, forecast: 1.3, upper: 1.48, lower: 1.02 },
      { time: '19:00', value: 1.16, forecast: 1.38, upper: 1.58, lower: 1.08 },
      { time: '19:15', value: 1.2, forecast: 1.44, upper: 1.66, lower: 1.12 },
    ],
  },
  energyForecast: {
    id: 'blower-energy',
    name: '鼓风机电耗预测',
    unit: 'kWh',
    risk: 'medium',
    accuracy: 0.9,
    horizon: '未来 120 分钟',
    points: [
      { time: '18:00', value: 320, forecast: 328 },
      { time: '18:15', value: 331, forecast: 340 },
      { time: '18:30', value: 338, forecast: 352 },
      { time: '18:45', value: 344, forecast: 360 },
      { time: '19:00', value: 349, forecast: 368 },
      { time: '19:15', value: 351, forecast: 372 },
    ],
  },
};

export const dosingPrediction: DosingPrediction = {
  chemical: 'PAC',
  currentDose: 42,
  suggestedDose: 39,
  unit: 'L/h',
  reason: 'TP 安全余量充足，模型建议分阶段下调并设置 p90 回退阈值。',
  points: [
    { time: '18:00', value: 0.29, forecast: 0.28, upper: 0.34, lower: 0.23 },
    { time: '18:30', value: 0.3, forecast: 0.3, upper: 0.35, lower: 0.24 },
    { time: '19:00', value: 0.31, forecast: 0.32, upper: 0.37, lower: 0.25 },
    { time: '19:30', value: 0.33, forecast: 0.34, upper: 0.38, lower: 0.27 },
    { time: '20:00', value: 0.34, forecast: 0.35, upper: 0.39, lower: 0.28 },
  ],
};

export const pvPrediction: PvPrediction = {
  installedCapacityKw: 1280,
  selfUseRate: 0.836,
  carbonReductionKg: 812,
  generationForecast: {
    id: 'pv-generation',
    name: '光伏出力预测',
    unit: 'kW',
    risk: 'low',
    accuracy: 0.91,
    horizon: '未来 8 小时',
    points: [
      { time: '08:00', value: 210, forecast: 220 },
      { time: '10:00', value: 520, forecast: 548 },
      { time: '12:00', value: 690, forecast: 718 },
      { time: '14:00', value: 705, forecast: 735 },
      { time: '16:00', value: 410, forecast: 398 },
      { time: '18:00', value: 80, forecast: 72 },
    ],
  },
};
