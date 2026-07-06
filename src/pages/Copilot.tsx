import { useEffect, useState } from 'react';
import { Button, Card, Col, Input, List, Progress, Row, Space, Typography } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { EvidenceList } from '../components/EvidenceList';
import { ToolTracePanel } from '../components/ToolTracePanel';
import { RiskBadge } from '../components/RiskBadge';
import { mockService } from '../services/mockService';
import type { CopilotMessage } from '../types/copilot';

export function Copilot() {
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    mockService.getCopilotInitialMessages().then(setMessages);
  }, []);

  const ask = async () => {
    const content = question.trim();
    if (!content) return;

    setMessages((items) => [...items, { id: `USER-${Date.now()}`, role: 'user', content, time: '刚刚' }]);
    setQuestion('');
    setLoading(true);
    const answer = await mockService.askCopilot(content);
    setMessages((items) => [...items, answer]);
    setLoading(false);
  };

  const latestAssistant = [...messages].reverse().find((item) => item.role === 'assistant');

  return (
    <div className="page-grid">
      <section className="page-title-block">
        <span className="eyebrow">AI Copilot</span>
        <h1>AI 智能助手</h1>
        <p>用自然语言询问运行状态，助手必须展示工具调用轨迹、依据、风险等级与置信度。</p>
      </section>

      <Row gutter={[16, 16]} className="balanced-row copilot-layout-row">
        <Col xs={24} xl={10}>
          <Card className="industrial-card fill-card chat-panel" title="对话">
            <List
              dataSource={messages}
              renderItem={(item) => (
                <List.Item className={`chat-message ${item.role}`}>
                  <div>
                    <small>{item.role === 'assistant' ? '低碳助手' : '你'} · {item.time}</small>
                    <p>{item.content}</p>
                  </div>
                </List.Item>
              )}
            />
            <Input.Search
              value={question}
              loading={loading}
              enterButton={<Button type="primary" icon={<SendOutlined />}>发送</Button>}
              onChange={(event) => setQuestion(event.target.value)}
              onSearch={ask}
              placeholder="例如：为什么建议提高 2# 池曝气下限？"
            />
          </Card>
        </Col>

        <Col xs={24} xl={14}>
          <Space direction="vertical" size={16} className="copilot-side-stack">
            <Card className="industrial-card copilot-summary-card" title="结构化回答">
              {latestAssistant?.risk && (
                <Space className="answer-meta" wrap>
                  <RiskBadge risk={latestAssistant.risk} />
                  <span>置信度</span>
                  <Progress
                    percent={Math.round((latestAssistant.confidence ?? 0) * 100)}
                    size="small"
                    strokeColor="#21D4FD"
                    style={{ width: 180 }}
                  />
                </Space>
              )}
              <Space direction="vertical" size={12}>
                {latestAssistant?.sections?.map((section) => (
                  <div className="answer-section" key={section.title}>
                    <Typography.Title level={5}>{section.title}</Typography.Title>
                    <p>{section.content}</p>
                  </div>
                ))}
              </Space>
            </Card>

            <Row gutter={[16, 16]} className="balanced-row copilot-evidence-row">
              <Col xs={24} lg={12}>
                <Card className="industrial-card fill-card" title="工具调用轨迹">
                  <ToolTracePanel traces={latestAssistant?.toolTrace ?? []} />
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card className="industrial-card fill-card" title="依据">
                  <EvidenceList evidence={latestAssistant?.evidence ?? []} />
                </Card>
              </Col>
            </Row>
          </Space>
        </Col>
      </Row>
    </div>
  );
}
