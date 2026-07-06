import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import type { KpiMetric } from '../types/common';
import { RiskBadge } from './RiskBadge';
import { signed } from '../utils/format';

interface KpiCardProps {
  metric: KpiMetric;
}

export function KpiCard({ metric }: KpiCardProps) {
  const trendDown = metric.trend < 0;

  return (
    <Card className="kpi-card" variant="borderless">
      <div className="kpi-card-header">
        <span>{metric.title}</span>
        <RiskBadge risk={metric.status} />
      </div>
      <div className="kpi-value-row">
        <strong>{metric.value}</strong>
        {metric.unit && <span>{metric.unit}</span>}
      </div>
      <div className={trendDown ? 'kpi-trend down' : 'kpi-trend up'}>
        {trendDown ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
        <span>{signed(metric.trend, '%')}</span>
        <small>{metric.hint}</small>
      </div>
      <div className="sparkline" aria-hidden>
        {(metric.sparkline ?? []).map((value, index, array) => {
          const max = Math.max(...array);
          const min = Math.min(...array);
          const height = max === min ? 50 : ((value - min) / (max - min)) * 54 + 16;

          return <i key={`${metric.id}-${index}`} style={{ height: `${height}%` }} />;
        })}
      </div>
    </Card>
  );
}
