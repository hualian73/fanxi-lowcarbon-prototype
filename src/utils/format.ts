import type { RiskLevel } from '../types/common';

export const riskLabel: Record<RiskLevel, string> = {
  low: '低风险',
  medium: '中风险',
  high: '高风险',
};

export const riskColor: Record<RiskLevel, string> = {
  low: '#10B981',
  medium: '#FFB020',
  high: '#FF4D4F',
};

export function percent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function signed(value: number, unit = ''): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value}${unit}`;
}
