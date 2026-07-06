import { useState } from 'react';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  FileSearchOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { Button, Card, Input, Modal, Progress, Space, Tag, message } from 'antd';
import type { Recommendation, RecommendationAction } from '../types/common';
import { useAppStore } from '../store/appStore';
import { canConfirmHighRisk } from '../utils/recommendationPolicy';
import { RiskBadge } from './RiskBadge';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onOpenDetails?: (recommendation: Recommendation) => void;
}

const statusLabel = {
  new: '待处理',
  adopted: '已采纳',
  rejected: '已驳回',
  modified: '修改后采纳',
  pending_review: '待人工复核',
};

export function RecommendationCard({ recommendation, onOpenDetails }: RecommendationCardProps) {
  const role = useAppStore((state) => state.role);
  const handleAction = useAppStore((state) => state.handleRecommendationAction);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [modifyOpen, setModifyOpen] = useState(false);
  const [note, setNote] = useState('');
  const canApprove = canConfirmHighRisk(role);

  const commit = (action: RecommendationAction, actionNote?: string) => {
    const status = handleAction(recommendation.id, action, actionNote);
    message.success(`建议状态已更新为：${statusLabel[status]}`);
  };

  const requestAdopt = () => {
    if (recommendation.risk === 'high') {
      setReviewOpen(true);
      return;
    }

    commit('adopt');
  };

  const submitModified = () => {
    const actionNote = note.trim() || '人工修改后采纳';
    if (recommendation.risk === 'high' && !canApprove) {
      commit('modify', actionNote);
      setModifyOpen(false);
      return;
    }

    commit('modify', actionNote);
    setModifyOpen(false);
    setNote('');
  };

  return (
    <Card className={`recommendation-card risk-${recommendation.risk}`} variant="borderless">
      <div className="recommendation-top">
        <Space wrap>
          <RiskBadge risk={recommendation.risk} pulse={recommendation.risk === 'high'} />
          <Tag color="geekblue">{recommendation.category}</Tag>
          <Tag color={recommendation.status === 'new' ? 'default' : 'cyan'}>{statusLabel[recommendation.status]}</Tag>
        </Space>
        <span className="recommendation-time">{recommendation.createdAt}</span>
      </div>
      <h3>{recommendation.title}</h3>
      <p>{recommendation.summary}</p>
      <div className="recommendation-impact">{recommendation.expectedImpact}</div>
      <div className="confidence-row">
        <span>置信度</span>
        <Progress percent={Math.round(recommendation.confidence * 100)} size="small" strokeColor="#21D4FD" />
      </div>
      <div className="recommendation-actions">
        <Button icon={<FileSearchOutlined />} onClick={() => onOpenDetails?.(recommendation)}>
          详情
        </Button>
        <Button
          type="primary"
          icon={<CheckCircleOutlined />}
          data-testid={`adopt-${recommendation.id}`}
          onClick={requestAdopt}
        >
          采纳
        </Button>
        <Button icon={<EditOutlined />} data-testid={`modify-${recommendation.id}`} onClick={() => setModifyOpen(true)}>
          修改后采纳
        </Button>
        <Button danger icon={<CloseCircleOutlined />} data-testid={`reject-${recommendation.id}`} onClick={() => commit('reject', '人工驳回')}>
          驳回
        </Button>
      </div>

      <Modal
        title="高风险建议人工复核"
        open={reviewOpen}
        onCancel={() => setReviewOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setReviewOpen(false)}>
            取消
          </Button>,
          <Button
            key="submit-review"
            icon={<SafetyCertificateOutlined />}
            data-testid="submit-high-risk-review"
            disabled={canApprove}
            onClick={() => {
              commit('adopt', '当前角色无高风险确认权限，提交工程师复核');
              setReviewOpen(false);
            }}
          >
            提交复核
          </Button>,
          <Button
            key="confirm"
            type="primary"
            data-testid="confirm-high-risk-adopt"
            disabled={!canApprove}
            onClick={() => {
              commit('adopt', '高风险建议已人工确认');
              setReviewOpen(false);
            }}
          >
            确认采纳
          </Button>,
        ]}
      >
        <p>该建议会影响水质安全边界，系统不会直接控制 PLC。请确认当前角色具备高风险复核权限。</p>
        <div className="permission-box">
          当前角色：<b>{role}</b> · 高风险确认权限：<b>{canApprove ? '允许' : '不允许'}</b>
        </div>
      </Modal>

      <Modal title="修改后采纳" open={modifyOpen} onCancel={() => setModifyOpen(false)} onOk={submitModified} okText="提交">
        <Input.TextArea
          rows={5}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="请输入人工修改说明，例如：将 DO 下限从 1.8 调整为 2.0 mg/L，执行 90 分钟后复核。"
        />
      </Modal>
    </Card>
  );
}
