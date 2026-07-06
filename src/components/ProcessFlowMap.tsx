import ReactFlow, { Background, Controls, MarkerType, type Edge, type Node } from 'reactflow';
import 'reactflow/dist/style.css';

const nodes: Node[] = [
  { id: 'data', position: { x: 0, y: 80 }, data: { label: '数据接入\nSCADA / 水质 / 光伏' }, className: 'flow-node data' },
  { id: 'quality', position: { x: 210, y: 20 }, data: { label: '数据质量\n缺测 / 延迟 / 回退' }, className: 'flow-node warn' },
  { id: 'prediction', position: { x: 430, y: 80 }, data: { label: '模型预测\n曝气 / 加药 / 光伏' }, className: 'flow-node model' },
  { id: 'dispatch', position: { x: 650, y: 80 }, data: { label: '调度优化\n安全 / 成本 / 碳排' }, className: 'flow-node dispatch' },
  { id: 'diagnosis', position: { x: 650, y: 220 }, data: { label: '异常诊断\n根因排序 / 证据链' }, className: 'flow-node risk' },
  { id: 'ai', position: { x: 880, y: 80 }, data: { label: 'AI 解释\n工具轨迹 / 置信度' }, className: 'flow-node ai' },
  { id: 'human', position: { x: 1100, y: 80 }, data: { label: '人工反馈\n采纳 / 驳回 / 修改' }, className: 'flow-node human' },
];

const edges: Edge[] = [
  { id: 'e1', source: 'data', target: 'quality', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e2', source: 'quality', target: 'prediction', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e3', source: 'prediction', target: 'dispatch', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e4', source: 'prediction', target: 'diagnosis', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e5', source: 'dispatch', target: 'ai', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e6', source: 'diagnosis', target: 'ai', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e7', source: 'ai', target: 'human', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e8', source: 'human', target: 'data', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } },
];

export function ProcessFlowMap() {
  return (
    <div className="process-flow-map">
      <ReactFlow nodes={nodes} edges={edges} fitView nodesDraggable={false} nodesConnectable={false} zoomOnScroll={false}>
        <Background color="#1D344C" gap={20} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
