import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { List, Progress, Space, Tag } from 'antd';
import type { EvidenceItem } from '../types/common';

const stateLabel = {
  normal: '正常',
  missing: '缺失',
  fallback: '回退',
  failed: '失败',
  stale: '延迟',
};

interface EvidenceListProps {
  evidence: EvidenceItem[];
}

export function EvidenceList({ evidence }: EvidenceListProps) {
  return (
    <List
      className="evidence-list"
      dataSource={evidence}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta
            avatar={item.state && item.state !== 'normal' ? <ExclamationCircleOutlined /> : <CheckCircleOutlined />}
            title={
              <Space wrap>
                <span>{item.title}</span>
                {item.state && item.state !== 'normal' && <Tag color="warning">{stateLabel[item.state]}</Tag>}
              </Space>
            }
            description={
              <div>
                <p>{item.description}</p>
                <small>
                  {item.source} · {item.time}
                </small>
                <Progress
                  percent={Math.round(item.confidence * 100)}
                  size="small"
                  strokeColor="#21D4FD"
                  trailColor="#23344d"
                />
              </div>
            }
          />
        </List.Item>
      )}
    />
  );
}
