import { Badge } from 'antd';
import dayjs from 'dayjs';
import type { DataQualityState } from '../types/common';

const stateText: Record<DataQualityState, string> = {
  normal: '数据新鲜',
  missing: '数据缺失',
  fallback: '模型回退',
  failed: '工具失败',
  stale: '数据延迟',
};

const badgeStatus: Record<DataQualityState, 'success' | 'warning' | 'error' | 'processing' | 'default'> = {
  normal: 'success',
  missing: 'error',
  fallback: 'warning',
  failed: 'error',
  stale: 'processing',
};

interface DataFreshnessBadgeProps {
  updatedAt: string;
  state?: DataQualityState;
}

export function DataFreshnessBadge({ updatedAt, state = 'normal' }: DataFreshnessBadgeProps) {
  const relative = dayjs(updatedAt).isValid() ? dayjs(updatedAt).format('MM-DD HH:mm:ss') : updatedAt;

  return (
    <span title={`${stateText[state]}，最近更新时间 ${updatedAt}`}>
      <Badge status={badgeStatus[state]} text={<span className="freshness-text">数据更新 {relative}</span>} />
    </span>
  );
}
