import { AuditOutlined } from '@ant-design/icons';
import { List, Tag } from 'antd';
import type { AuditRecord } from '../types/common';

interface FeedbackPanelProps {
  audits: AuditRecord[];
}

export function FeedbackPanel({ audits }: FeedbackPanelProps) {
  return (
    <List
      className="feedback-panel"
      dataSource={audits}
      locale={{ emptyText: '尚无人工反馈记录' }}
      renderItem={(audit) => (
        <List.Item>
          <List.Item.Meta
            avatar={<AuditOutlined />}
            title={
              <span>
                {audit.role} · <Tag color="cyan">{audit.action}</Tag> {audit.recommendationId}
              </span>
            }
            description={
              <div>
                <p>{audit.note || '未填写说明'}</p>
                <small>
                  {audit.traceId} · {audit.at}
                </small>
              </div>
            }
          />
        </List.Item>
      )}
    />
  );
}
