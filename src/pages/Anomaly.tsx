import { useEffect, useState } from 'react';
import { Alert, Card, Col, Progress, Row, Select, Space, Tag } from 'antd';
import { BugOutlined, NodeIndexOutlined } from '@ant-design/icons';
import { EvidenceList } from '../components/EvidenceList';
import { RecommendationCard } from '../components/RecommendationCard';
import { RiskBadge } from '../components/RiskBadge';
import { mockService } from '../services/mockService';
import type { AnomalyEvent } from '../types/anomaly';

export function Anomaly() {
  const [events, setEvents] = useState<AnomalyEvent[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');

  useEffect(() => {
    mockService.getAnomalyEvents().then((data) => {
      setEvents(data);
      setSelectedId(data[0]?.id ?? '');
    });
  }, []);

  const selected = events.find((item) => item.id === selectedId) ?? events[0];

  return (
    <div className="page-grid">
      <section className="page-title-block">
        <span className="eyebrow">Anomaly Diagnosis</span>
        <h1>异常诊断中心</h1>
        <p>把残差检测、规则诊断、SHAP 解释和运行证据组合成可复核的根因排序。</p>
      </section>

      <Card className="industrial-card">
        <Select
          style={{ width: '100%' }}
          value={selectedId}
          onChange={setSelectedId}
          options={events.map((item) => ({ value: item.id, label: `${item.title} · ${item.detectedAt}` }))}
        />
      </Card>

      {selected && (
        <>
          <Alert
            type={selected.risk === 'high' ? 'error' : 'warning'}
            showIcon
            message={selected.title}
            description={`${selected.location} · ${selected.symptom}`}
          />

          <Row gutter={[16, 16]} className="balanced-row anomaly-diagnosis-row">
            <Col xs={24} xl={10}>
              <Card className="industrial-card fill-card" title="根因排序">
                <Space direction="vertical" size={14} style={{ width: '100%' }}>
                  {selected.rootCauses.map((cause, index) => (
                    <div className="root-cause-card" key={cause.id}>
                      <div className="root-cause-title">
                        <span>
                          <NodeIndexOutlined /> #{index + 1} {cause.name}
                        </span>
                        <RiskBadge risk={cause.risk} />
                      </div>
                      <Progress percent={Math.round(cause.score * 100)} strokeColor="#21D4FD" trailColor="#22344E" />
                      <p>{cause.mechanism}</p>
                      <Space wrap>
                        {cause.relatedTags.map((tag) => (
                          <Tag key={tag} color="cyan">
                            {tag}
                          </Tag>
                        ))}
                      </Space>
                    </div>
                  ))}
                </Space>
              </Card>
            </Col>
            <Col xs={24} xl={14}>
              <Card className="industrial-card fill-card" title="证据链">
                <EvidenceList evidence={selected.evidence} />
              </Card>
            </Col>
          </Row>

          <Card className="industrial-card" title="处置建议">
            {selected.recommendations.length > 0 ? (
              <div
                className={`recommendation-grid anomaly-recommendations ${
                  selected.recommendations.length === 1 ? 'single' : 'two'
                }`}
              >
                {selected.recommendations.map((item) => (
                  <RecommendationCard key={item.id} recommendation={item} />
                ))}
              </div>
            ) : (
              <div className="diagnosis-note">
                <BugOutlined />
                <span>当前异常以服务降级为主，建议联系数据平台确认接口 SLA，运行建议保持原计划。</span>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
