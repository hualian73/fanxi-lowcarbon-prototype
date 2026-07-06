import { Alert, Card, Col, Progress, Row, Space, Table, Tag } from 'antd';
import { ApiOutlined, DatabaseOutlined, RadarChartOutlined } from '@ant-design/icons';
import { DataFreshnessBadge } from '../components/DataFreshnessBadge';
import { TimeSeriesChart } from '../components/TimeSeriesChart';
import { systemAnomalies } from '../mock/dashboard';
import type { TimeSeriesPoint } from '../types/common';

const modelDrift: TimeSeriesPoint[] = [
  { time: '7/1', value: 0.08, forecast: 0.1 },
  { time: '7/2', value: 0.1, forecast: 0.11 },
  { time: '7/3', value: 0.13, forecast: 0.12 },
  { time: '7/4', value: 0.11, forecast: 0.12 },
  { time: '7/5', value: 0.18, forecast: 0.14 },
];

const dataHealth = [
  { name: 'SCADA 实时点位', freshness: '8 秒', completeness: 98.6, state: 'normal' },
  { name: '水质在线仪表', freshness: '42 秒', completeness: 96.2, state: 'normal' },
  { name: '3# 回流流量计', freshness: '16 分钟', completeness: 72.4, state: 'missing' },
  { name: '电网碳因子接口', freshness: '20 分钟', completeness: 88.1, state: 'fallback' },
];

export function Monitor() {
  return (
    <div className="page-grid">
      <section className="page-title-block">
        <span className="eyebrow">Data & Model Monitor</span>
        <h1>数据与模型监控</h1>
        <p>明确展示数据缺失、模型回退、工具调用失败和模型漂移，避免黑盒决策。</p>
      </section>

      <Row gutter={[16, 16]} className="balanced-row">
        <Col xs={24} md={8}>
          <Card className="industrial-card monitor-tile">
            <DatabaseOutlined />
            <strong>97.4%</strong>
            <span>关键数据完整率</span>
            <DataFreshnessBadge updatedAt="2026-07-05 17:45:20" state="normal" />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="industrial-card monitor-tile">
            <RadarChartOutlined />
            <strong>0.18</strong>
            <span>曝气模型漂移指数</span>
            <DataFreshnessBadge updatedAt="2026-07-05 17:40:00" state="stale" />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="industrial-card monitor-tile">
            <ApiOutlined />
            <strong>1</strong>
            <span>工具调用失败</span>
            <DataFreshnessBadge updatedAt="2026-07-05 17:28:00" state="failed" />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="balanced-row monitor-insight-row">
        <Col xs={24} xl={14}>
          <Card className="industrial-card fill-card" title="模型漂移趋势">
            <TimeSeriesChart unit="drift score" data={modelDrift} height={440} color="#FFB020" />
          </Card>
        </Col>
        <Col xs={24} xl={10}>
          <Card className="industrial-card fill-card monitor-anomaly-card" title="异常状态">
            <Space direction="vertical" style={{ width: '100%' }} className="monitor-alert-stack">
              {systemAnomalies.map((item) => (
                <Alert
                  key={item.id}
                  type={item.state === 'failed' || item.state === 'missing' ? 'error' : 'warning'}
                  showIcon
                  message={item.title}
                  description={`${item.description} · ${item.impact}`}
                />
              ))}
            </Space>
          </Card>
        </Col>
      </Row>

      <Card className="industrial-card monitor-table-card" title="数据源健康度">
        <Table
          rowKey="name"
          pagination={false}
          dataSource={dataHealth}
          columns={[
            { title: '数据源', dataIndex: 'name' },
            { title: '新鲜度', dataIndex: 'freshness' },
            {
              title: '完整率',
              dataIndex: 'completeness',
              render: (value: number) => <Progress percent={value} size="small" strokeColor="#21D4FD" />,
            },
            {
              title: '状态',
              dataIndex: 'state',
              render: (state: string) => <Tag color={state === 'normal' ? 'success' : state === 'fallback' ? 'warning' : 'error'}>{state}</Tag>,
            },
          ]}
        />
      </Card>
    </div>
  );
}
