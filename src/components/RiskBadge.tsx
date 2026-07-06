import { Tag } from 'antd';
import type { RiskLevel } from '../types/common';
import { riskColor, riskLabel } from '../utils/format';

interface RiskBadgeProps {
  risk: RiskLevel;
  pulse?: boolean;
}

export function RiskBadge({ risk, pulse }: RiskBadgeProps) {
  return (
    <Tag
      className={pulse ? 'risk-badge risk-badge-pulse' : 'risk-badge'}
      style={{
        borderColor: riskColor[risk],
        color: riskColor[risk],
        background: `${riskColor[risk]}18`,
      }}
    >
      {riskLabel[risk]}
    </Tag>
  );
}
