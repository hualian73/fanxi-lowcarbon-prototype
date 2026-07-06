import type { TimeSeriesPoint } from '../types/common';

export interface ReportCardData {
  id: string;
  title: string;
  period: string;
  owner: string;
  status: 'ready' | 'draft' | 'missing';
  summary: string;
}

export const reportCards: ReportCardData[] = [
  {
    id: 'RPT-01',
    title: '班组低碳运行复盘',
    period: '2026-07-05 白班',
    owner: '运行二班',
    status: 'ready',
    summary: '记录 3 条建议、1 条人工复核、预计减排 122 kgCO2e。',
  },
  {
    id: 'RPT-02',
    title: '光伏消纳与外购电分析',
    period: '2026-07-05',
    owner: '能源管理员',
    status: 'draft',
    summary: '光伏自用率 83.6%，弃光风险低，负荷转移仍有 126 kWh 空间。',
  },
  {
    id: 'RPT-03',
    title: '月度药耗碳核算',
    period: '2026-07',
    owner: '工艺工程师',
    status: 'missing',
    summary: '缺少 3 小时 PAC 批次台账，暂不能生成最终版。',
  },
];

export const carbonAccountingTrend: TimeSeriesPoint[] = [
  { time: '7/1', value: 4.8, forecast: 4.6 },
  { time: '7/2', value: 4.6, forecast: 4.5 },
  { time: '7/3', value: 4.4, forecast: 4.3 },
  { time: '7/4', value: 4.5, forecast: 4.2 },
  { time: '7/5', value: 4.1, forecast: 4.0 },
];

export const reportBreakdown = [
  { item: '外购电间接排放', value: 2860, unit: 'kgCO2e', trend: -8.2 },
  { item: '药剂间接排放', value: 420, unit: 'kgCO2e', trend: -3.4 },
  { item: 'N2O 直接排放估算', value: 760, unit: 'kgCO2e', trend: 1.6 },
  { item: '光伏抵扣', value: -812, unit: 'kgCO2e', trend: -12.1 },
];
