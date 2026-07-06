import { ApiOutlined, CheckCircleOutlined, CloseCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { List, Space, Tag } from 'antd';
import type { ToolTrace } from '../types/common';

const iconByStatus = {
  success: <CheckCircleOutlined />,
  failed: <CloseCircleOutlined />,
  fallback: <SyncOutlined spin />,
};

const colorByStatus = {
  success: 'success',
  failed: 'error',
  fallback: 'warning',
};

interface ToolTracePanelProps {
  traces: ToolTrace[];
}

export function ToolTracePanel({ traces }: ToolTracePanelProps) {
  return (
    <List
      className="tool-trace-panel"
      dataSource={traces}
      locale={{ emptyText: '暂无工具调用' }}
      renderItem={(trace) => (
        <List.Item>
          <List.Item.Meta
            avatar={<ApiOutlined />}
            title={
              <Space wrap>
                <span>{trace.name}</span>
                <Tag color={colorByStatus[trace.status]} icon={iconByStatus[trace.status]}>
                  {trace.status}
                </Tag>
                <small>{trace.durationMs} ms</small>
              </Space>
            }
            description={
              <div className="trace-copy">
                <p>
                  <b>输入</b> {trace.input}
                </p>
                <p>
                  <b>输出</b> {trace.output}
                </p>
                <small>{trace.time}</small>
              </div>
            }
          />
        </List.Item>
      )}
    />
  );
}
