import type { CopilotMessage } from '../types/copilot';

export const initialCopilotMessages: CopilotMessage[] = [
  {
    id: 'MSG-HELLO',
    role: 'assistant',
    content: '我是低碳运行助手，可以解释预测、调度、异常和报表依据。我的建议不会直接控制 PLC，会给出证据、风险和可复核路径。',
    time: '17:45',
    risk: 'low',
    confidence: 0.94,
    sections: [
      {
        title: '当前摘要',
        content: '综合风险为中，重点关注 2# 生化池 DO 振荡和碳核算服务回退。',
      },
    ],
    toolTrace: [],
    evidence: [],
  },
];

export function buildCopilotAnswer(question: string): CopilotMessage {
  const asksAeration = /曝气|DO|氨氮|风量/.test(question);
  const asksCarbon = /碳|光伏|减排|电/.test(question);

  return {
    id: `MSG-${Date.now()}`,
    role: 'assistant',
    content: '已完成多源数据核查，下面是结构化建议。',
    time: '刚刚',
    risk: asksAeration ? 'high' : asksCarbon ? 'medium' : 'low',
    confidence: asksAeration ? 0.84 : 0.78,
    sections: [
      {
        title: '结论',
        content: asksAeration
          ? '2# 生化池建议先提高曝气下限并设置 2 小时有效期，原因是进水氨氮负荷正在抬升。'
          : '当前低碳优化重点是提高光伏自用率，并对药耗优化保持回退阈值。',
      },
      {
        title: '复核要点',
        content: '请核对关键传感器新鲜度、模型是否回退、以及该建议是否触发人工复核权限。',
      },
      {
        title: '人工反馈入口',
        content: '可在建议卡片中选择采纳、驳回或修改后采纳，系统会记录角色、时间、说明和追踪编号。',
      },
    ],
    toolTrace: [
      {
        id: 'CPT-01',
        name: 'query_realtime_tags',
        input: 'question intent + recent 2h plant tags',
        output: 'critical tags loaded; recycle_flow missing',
        durationMs: 520,
        status: 'fallback',
        time: '刚刚',
      },
      {
        id: 'CPT-02',
        name: asksAeration ? 'aeration_forecast' : 'dispatch_optimizer',
        input: asksAeration ? 'basin=2#, horizon=120min' : 'mode=balanced, pv forecast',
        output: asksAeration ? 'NH3-N risk high, DO lower bound 1.58' : 'carbon saving 122 kgCO2e/day',
        durationMs: 1180,
        status: 'success',
        time: '刚刚',
      },
      {
        id: 'CPT-03',
        name: 'rag_evidence_search',
        input: 'SOP + recent shift notes',
        output: 'SOP found, one shift note index failed',
        durationMs: 660,
        status: 'failed',
        time: '刚刚',
      },
    ],
    evidence: [
      {
        id: 'CPT-EV-01',
        title: '模型预测依据',
        source: asksAeration ? 'PatchTST/aeration_v3.2' : 'MILP dispatch optimizer',
        time: '刚刚',
        description: asksAeration ? '未来 90 分钟 NH3-N p95 接近内控线。' : '光伏峰值窗口存在可转移负荷。',
        confidence: asksAeration ? 0.84 : 0.78,
      },
      {
        id: 'CPT-EV-02',
        title: '异常状态',
        source: 'data_quality_monitor',
        time: '刚刚',
        description: '回流流量存在缺测，回答已标记模型回退。',
        confidence: 0.95,
        state: 'missing',
      },
    ],
  };
}
