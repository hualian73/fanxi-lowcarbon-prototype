import { ClockCircleOutlined } from '@ant-design/icons';
import { Timeline, Typography } from 'antd';
import type { DispatchPlanItem } from '../types/dispatch';
import { RiskBadge } from './RiskBadge';
import { signed } from '../utils/format';

interface DispatchTimelineProps {
  items: DispatchPlanItem[];
}

export function DispatchTimeline({ items }: DispatchTimelineProps) {
  return (
    <Timeline
      className="dispatch-timeline"
      items={items.map((item) => ({
        dot: <ClockCircleOutlined />,
        color: item.risk === 'high' ? 'red' : item.risk === 'medium' ? 'orange' : 'green',
        children: (
          <div className="timeline-item">
            <div className="timeline-title">
              <strong>{item.timeRange}</strong>
              <RiskBadge risk={item.risk} />
            </div>
            <Typography.Text>{item.unit}</Typography.Text>
            <p>{item.action}</p>
            <div className="timeline-metrics">
              <span>{item.setpoint}</span>
              <span>碳 {signed(item.carbonImpactKg, ' kgCO2e')}</span>
              <span>成本 {signed(item.costImpactYuan, ' 元')}</span>
            </div>
            <small>{item.rationale}</small>
          </div>
        ),
      }))}
    />
  );
}
