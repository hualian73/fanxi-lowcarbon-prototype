import { useEffect, useMemo, useState } from 'react';
import { Alert, Card, Col, Row, Segmented, Space, Statistic } from 'antd';
import { BranchesOutlined, DollarOutlined, SafetyCertificateOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { DispatchTimeline } from '../components/DispatchTimeline';
import { RecommendationCard } from '../components/RecommendationCard';
import { TimeSeriesChart } from '../components/TimeSeriesChart';
import { mockService } from '../services/mockService';
import { useAppStore } from '../store/appStore';
import type { DispatchMode, DispatchModeProfile } from '../types/dispatch';
import type { TimeSeriesPoint } from '../types/common';

const planCurve: TimeSeriesPoint[] = [
  { time: '08:00', value: 310, forecast: 292 },
  { time: '10:00', value: 338, forecast: 310 },
  { time: '12:00', value: 365, forecast: 318 },
  { time: '14:00', value: 348, forecast: 286 },
  { time: '16:00', value: 332, forecast: 301 },
  { time: '18:00', value: 360, forecast: 352 },
  { time: '20:00', value: 372, forecast: 356 },
];

export function Dispatch() {
  const [profiles, setProfiles] = useState<DispatchModeProfile[]>([]);
  const [mode, setMode] = useState<DispatchMode>('balanced');
  const recommendations = useAppStore((state) => state.recommendations);

  useEffect(() => {
    mockService.getDispatchProfiles().then(setProfiles);
  }, []);

  const current = useMemo(() => profiles.find((item) => item.mode === mode) ?? profiles[0], [mode, profiles]);

  return (
    <div className="page-grid">
      <section className="page-title-block">
        <span className="eyebrow">Dispatch Optimization</span>
        <h1>低碳调度中心</h1>
        <p>切换安全、成本、碳排与均衡目标，输出可复核的班组执行建议，不直接下发 PLC。</p>
      </section>

      <Card className="industrial-card dispatch-mode-card">
        <Segmented
          block
          value={mode}
          onChange={(value) => setMode(value as DispatchMode)}
          options={[
            { label: '均衡模式', value: 'balanced', icon: <BranchesOutlined /> },
            { label: '安全优先', value: 'safety', icon: <SafetyCertificateOutlined /> },
            { label: '成本优先', value: 'cost', icon: <DollarOutlined /> },
            { label: '碳排优先', value: 'carbon', icon: <ThunderboltOutlined /> },
          ]}
        />
      </Card>

      {current && (
        <>
          <Alert type="info" showIcon message={current.objective} description={`${current.expectedSaving}。${current.riskNote}`} />

          <Row gutter={[16, 16]} className="balanced-row dispatch-main-row">
            <Col xs={24} xl={14}>
              <Card className="industrial-card fill-card" title={`${current.label} · 调度计划`}>
                <DispatchTimeline items={current.plan} />
              </Card>
            </Col>
            <Col xs={24} xl={10}>
              <Space direction="vertical" size={16} style={{ width: '100%' }} className="dispatch-side-stack">
                <Card className="industrial-card metric-tile">
                  <Statistic title="日减排估算" value={current.plan.reduce((sum, item) => sum + item.carbonImpactKg, 0) * -1} suffix="kgCO2e" />
                  <span>负值表示减排，正值表示为达标增加碳排</span>
                </Card>
                <Card className="industrial-card" title="优化前后能耗曲线">
                  <TimeSeriesChart unit="kWh" data={planCurve} height={260} color="#21D4FD" />
                </Card>
                <Card className="industrial-card dispatch-guard-card" title="执行边界">
                  <div className="dispatch-guard-grid">
                    <span>不下发 PLC</span>
                    <span>高风险复核</span>
                    <span>保留回退阈值</span>
                    <span>班组审计记录</span>
                  </div>
                </Card>
              </Space>
            </Col>
          </Row>
        </>
      )}

      <Card className="industrial-card" title="调度相关建议">
        <div className="recommendation-grid dispatch-recommendations">
          {recommendations
            .filter((item) => ['aeration', 'dosing', 'pv', 'dispatch'].includes(item.category))
            .map((item) => (
              <RecommendationCard key={item.id} recommendation={item} />
            ))}
        </div>
      </Card>
    </div>
  );
}
