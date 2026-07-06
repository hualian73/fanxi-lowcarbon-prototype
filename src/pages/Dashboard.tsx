import { useEffect, useState } from 'react';
import { Alert, Card, Col, Drawer, Row, Space, Tabs } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import { KpiCard } from '../components/KpiCard';
import { ProcessFlowMap } from '../components/ProcessFlowMap';
import { RecommendationCard } from '../components/RecommendationCard';
import { TimeSeriesChart } from '../components/TimeSeriesChart';
import { EvidenceList } from '../components/EvidenceList';
import { ToolTracePanel } from '../components/ToolTracePanel';
import { FeedbackPanel } from '../components/FeedbackPanel';
import { RiskBadge } from '../components/RiskBadge';
import { mockService } from '../services/mockService';
import { useAppStore } from '../store/appStore';
import type { KpiMetric, Recommendation, SystemAnomalyState } from '../types/common';
import { carbonTrend } from '../mock/dashboard';

export function Dashboard() {
  const recommendations = useAppStore((state) => state.recommendations);
  const audits = useAppStore((state) => state.audits);
  const [kpis, setKpis] = useState<KpiMetric[]>([]);
  const [anomalies, setAnomalies] = useState<SystemAnomalyState[]>([]);
  const [selected, setSelected] = useState<Recommendation | null>(null);

  useEffect(() => {
    mockService.getDashboard().then((data) => {
      setKpis(data.kpis);
      setAnomalies(data.anomalies);
    });
  }, []);

  return (
    <div className="page-grid">
      <section className="hero-panel">
        <div>
          <span className="eyebrow">AI 低碳辅助决策闭环</span>
          <h1>光伏污水厂低碳辅助决策系统</h1>
          <p>覆盖曝气、加药、光伏消纳、碳核算、调度优化与异常诊断，输出可解释、可复核、可追溯的运行建议。</p>
        </div>
        <div className="hero-metrics">
          <strong>122</strong>
          <span>kgCO2e/d 预计减排</span>
          <small>基于均衡调度方案</small>
        </div>
      </section>

      <Row gutter={[16, 16]} className="balanced-row kpi-row">
        {kpis.map((metric) => (
          <Col xs={24} sm={12} xl={6} key={metric.id}>
            <KpiCard metric={metric} />
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} className="balanced-row dashboard-feature-row">
        <Col xs={24} xl={15}>
          <Card className="industrial-card fill-card dashboard-flow-card" title="数据进入系统 - 模型预测 - 调度优化 - AI 解释 - 人工反馈">
            <ProcessFlowMap />
          </Card>
        </Col>
        <Col xs={24} xl={9}>
          <Card className="industrial-card fill-card dashboard-carbon-card" title="碳排强度趋势">
            <TimeSeriesChart unit="kgCO2e/m3" data={carbonTrend} height={360} color="#10B981" />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="balanced-row dashboard-ops-row">
        <Col xs={24} xl={18}>
          <Card className="industrial-card fill-card" title="实时运行建议">
            <div className="recommendation-grid dashboard-recommendations">
              {recommendations.map((item) => (
                <RecommendationCard key={item.id} recommendation={item} onOpenDetails={setSelected} />
              ))}
            </div>
          </Card>
        </Col>
        <Col xs={24} xl={6}>
          <Card className="industrial-card fill-card dashboard-anomaly-card" title="异常状态与降级说明">
            <Space direction="vertical" size={10} style={{ width: '100%' }} className="compact-alert-stack">
              {anomalies.map((item) => (
                <Alert
                  key={item.id}
                  type={item.state === 'failed' || item.state === 'missing' ? 'error' : 'warning'}
                  showIcon
                  icon={<WarningOutlined />}
                  message={item.title}
                  description={
                    <div>
                      <p>{item.description}</p>
                      <small>
                        {item.impact} · {item.detectedAt}
                      </small>
                    </div>
                  }
                />
              ))}
            </Space>
          </Card>
        </Col>
      </Row>

      <Drawer
        title={selected?.title}
        open={Boolean(selected)}
        width={720}
        onClose={() => setSelected(null)}
        className="detail-drawer"
      >
        {selected && (
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Space>
              <RiskBadge risk={selected.risk} />
              <span>置信度 {Math.round(selected.confidence * 100)}%</span>
            </Space>
            <Card className="industrial-card compact">
              <p>{selected.explanation}</p>
            </Card>
            <Tabs
              items={[
                { key: 'evidence', label: '依据', children: <EvidenceList evidence={selected.evidence} /> },
                { key: 'trace', label: '工具轨迹', children: <ToolTracePanel traces={selected.toolTrace} /> },
                { key: 'feedback', label: '人工反馈', children: <FeedbackPanel audits={audits} /> },
              ]}
            />
          </Space>
        )}
      </Drawer>
    </div>
  );
}
