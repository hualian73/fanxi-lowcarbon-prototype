import { Empty } from 'antd';

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span>{title}</span>} />
      <p>{description}</p>
    </div>
  );
}
