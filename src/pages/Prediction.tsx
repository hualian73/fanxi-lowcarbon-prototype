import { useEffect, useState } from 'react';
import { Alert, Card, Col, Descriptions, Row, Space, Statistic } from 'antd';
import { CloudOutlined, ExperimentOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { TimeSeriesChart } from '../components/TimeSeriesChart';
import { RiskBadge } from '../components/RiskBadge';
import { EmptyState } from '../components/EmptyState';
import { mockService } from '../services/mockService';
import type { AerationPrediction, DosingPrediction, PvPrediction } from '../types/prediction';
import { percent } from '../utils/format';

export function Prediction() {
  const [aeration, setAeration] = useState<AerationPrediction | null>(null);
  const [dosing, setDosing] = useState<DosingPrediction | null>(null);
  const [pv, setPv] = useState<PvPrediction | null>(null);

  useEffect(() => {
    mockService.getPredictions().then((data) => {
      setAeration(data.aerationPrediction);
      setDosing(data.dosingPrediction);
      setPv(data.pvPrediction);
    });
  }, []);

  if (!aeration || !dosing || !pv) {
    return <EmptyState title="正在加载预测数据" description="mock service 正在模拟接口响应。" />;
  }

  return (
    <div className="page-grid">
      <section className="page-title-block">
        <span className="eyebrow">Prediction Center</span>
        <h1>运行预测中心</h1>
        <p>统一展示曝气、加药、光伏出力与碳排趋势预测，异常输入会明确标记为回退或缺测。</p>
      </section>

      <Alert
        type="warning"
        showIcon
        message="模型回退提醒"
        description="3# 回流流量计缺测，曝气预测已使用泵频率估计特征；预测置信区间已自动放宽。"
      />

      <Row gutter={[16, 16]} className="balanced-row">
        <Col xs={24} md={8}>
          <Card className="industrial-card metric-tile">
            <Statistic prefix={<ThunderboltOutlined />} title="曝气预测准确率" value={aeration.airFlowForecast.accuracy * 100} suffix="%" />
            <RiskBadge risk={aeration.airFlowForecast.risk} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="industrial-card metric-tile">
            <Statistic prefix={<ExperimentOutlined />} title="建议 PAC 加药" value={dosing.suggestedDose} suffix={dosing.unit} />
            <span>当前 {dosing.currentDose} {dosing.unit}</span>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="industrial-card metric-tile">
            <Statistic prefix={<CloudOutlined />} title="光伏自用率预测" value={pv.selfUseRate * 100} precision={1} suffix="%" />
            <span>减排 {pv.carbonReductionKg} kgCO2e/d</span>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="balanced-row">
        <Col xs={24} xl={12}>
          <Card className="industrial-card" title={`${aeration.basin} · ${aeration.airFlowForecast.name}`}>
            <TimeSeriesChart unit={aeration.airFlowForecast.unit} data={aeration.airFlowForecast.points} color="#21D4FD" />
          </Card>
        </Col>
        <Col xs={24} xl={12}>
          <Card className="industrial-card" title={aeration.ammoniaForecast.name}>
            <TimeSeriesChart unit={aeration.ammoniaForecast.unit} data={aeration.ammoniaForecast.points} color="#FACC15" />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="balanced-row">
        <Col xs={24} xl={12}>
          <Card className="industrial-card" title="加药预测与安全余量">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="药剂">{dosing.chemical}</Descriptions.Item>
              <Descriptions.Item label="建议原因">{dosing.reason}</Descriptions.Item>
              <Descriptions.Item label="回退阈值">TP p90 超过 0.38 mg/L 自动撤销建议</Descriptions.Item>
            </Descriptions>
            <TimeSeriesChart unit="mg/L" data={dosing.points} height={240} color="#10B981" />
          </Card>
        </Col>
        <Col xs={24} xl={12}>
          <Card className="industrial-card" title="光伏出力与碳减排预测">
            <Space direction="vertical" style={{ width: '100%' }}>
              <span>装机容量 {pv.installedCapacityKw} kW · 自用率 {percent(pv.selfUseRate)}</span>
              <TimeSeriesChart unit={pv.generationForecast.unit} data={pv.generationForecast.points} height={280} color="#FACC15" />
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
