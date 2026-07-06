import { useEffect, useState } from 'react';
import { Button, Card, Col, Row, Space, Statistic, Table, Tag } from 'antd';
import { DownloadOutlined, FileTextOutlined } from '@ant-design/icons';
import { TimeSeriesChart } from '../components/TimeSeriesChart';
import { EmptyState } from '../components/EmptyState';
import { mockService } from '../services/mockService';
import type { TimeSeriesPoint } from '../types/common';
import type { ReportCardData } from '../mock/reports';

interface ReportState {
  reportCards: ReportCardData[];
  carbonAccountingTrend: TimeSeriesPoint[];
  reportBreakdown: Array<{ item: string; value: number; unit: string; trend: number }>;
}

export function Reports() {
  const [data, setData] = useState<ReportState | null>(null);

  useEffect(() => {
    mockService.getReports().then(setData);
  }, []);

  if (!data) {
    return <EmptyState title="正在生成报表中心" description="mock service 正在汇总碳核算、建议审计与数据质量信息。" />;
  }

  return (
    <div className="page-grid">
      <section className="page-title-block">
        <span className="eyebrow">Reports</span>
        <h1>报表中心</h1>
        <p>将预测、调度、异常、AI 解释和人工反馈汇总为可追溯的班组与月度报表。</p>
      </section>

      <Row gutter={[16, 16]} className="balanced-row">
        {data.reportCards.map((report) => (
          <Col xs={24} lg={8} key={report.id}>
            <Card
              className="industrial-card report-card"
              title={<span><FileTextOutlined /> {report.title}</span>}
              extra={<Tag color={report.status === 'ready' ? 'success' : report.status === 'draft' ? 'processing' : 'error'}>{report.status}</Tag>}
            >
              <p>{report.summary}</p>
              <small>{report.period} · {report.owner}</small>
              <Button block icon={<DownloadOutlined />} disabled={report.status === 'missing'}>
                生成演示报表
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} className="balanced-row">
        <Col xs={24} xl={14}>
          <Card className="industrial-card" title="碳核算趋势">
            <TimeSeriesChart unit="tCO2e/d" data={data.carbonAccountingTrend} color="#10B981" />
          </Card>
        </Col>
        <Col xs={24} xl={10}>
          <Card className="industrial-card" title="碳排构成">
            <Table
              rowKey="item"
              pagination={false}
              dataSource={data.reportBreakdown}
              columns={[
                { title: '项目', dataIndex: 'item' },
                {
                  title: '数值',
                  render: (_, row) => (
                    <Space>
                      <Statistic value={row.value} suffix={row.unit} valueStyle={{ fontSize: 16 }} />
                    </Space>
                  ),
                },
                {
                  title: '环比',
                  dataIndex: 'trend',
                  render: (value: number) => <Tag color={value > 0 ? 'warning' : 'success'}>{value}%</Tag>,
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
