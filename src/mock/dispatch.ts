import type { DispatchModeProfile } from '../types/dispatch';

const sharedPlan = [
  {
    id: 'DP-01',
    timeRange: '18:00-19:00',
    unit: '2# 生化池 / 鼓风机 B',
    action: '提高风量下限，保持 DO 2.0 mg/L 安全边界',
    setpoint: '4,850 Nm3/h',
    carbonImpactKg: 18,
    costImpactYuan: 46,
    risk: 'high' as const,
    rationale: '进水氨氮上升，优先压低达标风险。',
  },
  {
    id: 'DP-02',
    timeRange: '13:00-15:00',
    unit: '反洗泵组',
    action: '前移可调负荷以匹配光伏峰值',
    setpoint: '2 台泵轮换运行',
    carbonImpactKg: -64,
    costImpactYuan: -82,
    risk: 'low' as const,
    rationale: '利用 PV 出力高峰，提高自发自用。',
  },
  {
    id: 'DP-03',
    timeRange: '20:00-22:00',
    unit: 'PAC 加药间',
    action: '分阶段下调加药并启用回退阈值',
    setpoint: '39 L/h，TP p90>0.38 回退',
    carbonImpactKg: -11,
    costImpactYuan: -138,
    risk: 'medium' as const,
    rationale: '药耗有优化空间，但保留内控裕度。',
  },
];

export const dispatchProfiles: DispatchModeProfile[] = [
  {
    mode: 'balanced',
    label: '均衡模式',
    objective: '同时约束达标风险、碳排和运行成本',
    expectedSaving: '预计日减排 122 kgCO2e，运行成本下降 3.4%',
    riskNote: '高风险动作需人工复核后进入班组执行清单。',
    plan: sharedPlan,
  },
  {
    mode: 'safety',
    label: '安全优先',
    objective: '放大水质与设备安全裕度',
    expectedSaving: '预计日减排 64 kgCO2e，成本可能上升 1.8%',
    riskNote: '曝气与回流保守运行，碳收益让位于达标。',
    plan: sharedPlan.map((item) =>
      item.id === 'DP-01'
        ? { ...item, setpoint: '5,050 Nm3/h', carbonImpactKg: 31, costImpactYuan: 72 }
        : item,
    ),
  },
  {
    mode: 'cost',
    label: '成本优先',
    objective: '在不突破内控线前提下降低电费与药耗',
    expectedSaving: '预计日成本下降 5.8%，减排 94 kgCO2e',
    riskNote: '对 TP 与 DO 边界更敏感，建议缩短复核周期。',
    plan: sharedPlan.map((item) =>
      item.id === 'DP-03'
        ? { ...item, setpoint: '37 L/h，TP p90>0.36 回退', risk: 'high' as const }
        : item,
    ),
  },
  {
    mode: 'carbon',
    label: '碳排优先',
    objective: '最大化光伏消纳并降低间接碳排',
    expectedSaving: '预计日减排 181 kgCO2e，成本下降 2.7%',
    riskNote: '保留所有水质硬约束，不建议自动下发 PLC。',
    plan: sharedPlan.map((item) =>
      item.id === 'DP-02'
        ? { ...item, carbonImpactKg: -92, costImpactYuan: -103, setpoint: '3 台泵错峰 40 分钟' }
        : item,
    ),
  },
];
