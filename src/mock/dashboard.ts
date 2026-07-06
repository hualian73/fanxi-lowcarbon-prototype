import type { KpiMetric, Recommendation, SystemAnomalyState, TimeSeriesPoint } from '../types/common';

export const dashboardKpis: KpiMetric[] = [
  {
    id: 'carbon-intensity',
    title: '综合碳排强度',
    value: 0.312,
    unit: 'kgCO2e/m3',
    trend: -6.8,
    status: 'low',
    hint: '较昨日下降，光伏自用率提升贡献 48%',
    sparkline: [0.34, 0.33, 0.33, 0.32, 0.31, 0.312],
  },
  {
    id: 'aeration-energy',
    title: '曝气单耗',
    value: 0.176,
    unit: 'kWh/m3',
    trend: 3.2,
    status: 'medium',
    hint: '2# 生化池 DO 波动扩大，建议复核风量下限',
    sparkline: [0.16, 0.165, 0.17, 0.168, 0.174, 0.176],
  },
  {
    id: 'pv-self-use',
    title: '光伏自用率',
    value: 83.6,
    unit: '%',
    trend: 5.4,
    status: 'low',
    hint: '午间可覆盖鼓风机 38% 负荷',
    sparkline: [67, 70, 74, 78, 81, 83.6],
  },
  {
    id: 'effluent-risk',
    title: '出水达标风险',
    value: '中',
    unit: 'NH3-N',
    trend: 1.1,
    status: 'medium',
    hint: '进水氨氮 2 小时内预计抬升',
    sparkline: [0.2, 0.25, 0.35, 0.42, 0.39, 0.44],
  },
];

export const carbonTrend: TimeSeriesPoint[] = [
  { time: '00:00', value: 0.34, forecast: 0.33 },
  { time: '04:00', value: 0.32, forecast: 0.31 },
  { time: '08:00', value: 0.31, forecast: 0.3 },
  { time: '12:00', value: 0.29, forecast: 0.28 },
  { time: '16:00', value: 0.31, forecast: 0.3 },
  { time: '20:00', value: 0.33, forecast: 0.32 },
  { time: '24:00', value: 0.312, forecast: 0.305 },
];

export const dashboardRecommendations: Recommendation[] = [
  {
    id: 'REC-AER-240705-01',
    title: '将 2# 生化池曝气风量下限提高至 4,850 Nm3/h',
    category: 'aeration',
    risk: 'high',
    confidence: 0.86,
    summary: '未来 90 分钟进水氨氮上升，当前 DO 安全裕度不足。',
    expectedImpact: '降低 NH3-N 超标概率 12.4%，增加电耗约 38 kWh。',
    explanation:
      'PatchTST 预测 2# 池末端氨氮将在 19:30 达到 1.48 mg/L，若维持现有风量下限，DO 低于 1.7 mg/L 的概率为 32%。建议只提高下限并设置 2 小时有效期，避免长期高曝气。',
    status: 'new',
    createdAt: '2026-07-05 17:40',
    evidence: [
      {
        id: 'EV-AER-01',
        title: '曝气负荷预测',
        source: 'PatchTST/aeration_v3.2',
        time: '2026-07-05 17:35',
        description: '进水 NH3-N 从 24.1 mg/L 上升至 31.6 mg/L，DO 置信下界为 1.58 mg/L。',
        confidence: 0.88,
      },
      {
        id: 'EV-AER-02',
        title: '历史相似工况',
        source: 'CaseBase/2026-Q2',
        time: '2026-07-05 17:36',
        description: '相似负荷下提高风量下限后，平均 45 分钟内恢复 DO 安全裕度。',
        confidence: 0.81,
      },
    ],
    toolTrace: [
      {
        id: 'TOOL-101',
        name: 'load_realtime_tags',
        input: 'DO, NH3-N, blower_power, influent_flow',
        output: '432 tags loaded, 0 missing in critical set',
        durationMs: 420,
        status: 'success',
        time: '17:35:12',
      },
      {
        id: 'TOOL-102',
        name: 'aeration_forecast',
        input: 'horizon=120min, basin=2#',
        output: 'risk=high, p95_NH3N=1.48mg/L',
        durationMs: 1260,
        status: 'success',
        time: '17:35:16',
      },
    ],
  },
  {
    id: 'REC-DOS-240705-02',
    title: 'PAC 加药从 42 L/h 调整至 39 L/h，并观察 60 分钟',
    category: 'dosing',
    risk: 'medium',
    confidence: 0.79,
    summary: 'TP 余量充足，短时下调可减少药耗与间接碳排。',
    expectedImpact: '节约药剂约 18.6 kg/d，减少 11.3 kgCO2e/d。',
    explanation:
      '当前二沉池出水 TP 预测中位值 0.28 mg/L，距离内控线 0.40 mg/L 有余量。建议小步下降并启用自动回退阈值。',
    status: 'new',
    createdAt: '2026-07-05 17:42',
    evidence: [
      {
        id: 'EV-DOS-01',
        title: '出水 TP 预测',
        source: 'dosing_safety_factor_v2',
        time: '2026-07-05 17:39',
        description: '未来 2 小时 TP p90 为 0.35 mg/L，未触发达标风险。',
        confidence: 0.79,
      },
    ],
    toolTrace: [
      {
        id: 'TOOL-201',
        name: 'dose_optimizer',
        input: 'chemical=PAC, constraint=TP<0.4',
        output: 'suggested=39L/h, rollback=TP p90>0.38',
        durationMs: 880,
        status: 'success',
        time: '17:41:20',
      },
    ],
  },
  {
    id: 'REC-PV-240705-03',
    title: '13:00-15:00 将反洗泵任务前移，消纳光伏峰值',
    category: 'pv',
    risk: 'low',
    confidence: 0.91,
    summary: '午后光伏出力高于曝气基础负荷，可转移弹性用电。',
    expectedImpact: '提升光伏自用率 4.2%，减少外购电 126 kWh。',
    explanation:
      '天气预报云量低，逆变器效率正常。将反洗任务前移不会影响水质约束，可减少弃光并降低碳排。',
    status: 'new',
    createdAt: '2026-07-05 10:05',
    evidence: [
      {
        id: 'EV-PV-01',
        title: '光伏功率预测',
        source: 'pvlib_simulation + inverter telemetry',
        time: '2026-07-05 09:55',
        description: '13:00-15:00 预测出力 690-735 kW，置信度 91%。',
        confidence: 0.91,
      },
    ],
    toolTrace: [
      {
        id: 'TOOL-301',
        name: 'pv_forecast',
        input: 'weather=local, horizon=6h',
        output: 'peak=735kW, self_use_gap=126kWh',
        durationMs: 730,
        status: 'success',
        time: '10:02:08',
      },
    ],
  },
];

export const systemAnomalies: SystemAnomalyState[] = [
  {
    id: 'SYS-01',
    title: '3# 硝化液回流流量计缺测',
    state: 'missing',
    description: '连续 16 分钟未上送数据，使用邻近泵频率回归估计。',
    impact: '调度优化置信度下降 7%，高风险建议需人工复核。',
    detectedAt: '2026-07-05 17:31',
  },
  {
    id: 'SYS-02',
    title: '碳核算服务降级',
    state: 'fallback',
    description: '实时电网因子接口超时，回退至本月平均排放因子。',
    impact: '碳减排估算可能存在 +/- 3.8% 偏差。',
    detectedAt: '2026-07-05 17:28',
  },
  {
    id: 'SYS-03',
    title: 'AI 工具调用失败样例',
    state: 'failed',
    description: '一次 RAG 检索未命中文档，系统返回可解释失败状态。',
    impact: '助手回答降级为结构化规则解释。',
    detectedAt: '2026-07-05 17:20',
  },
];
