import { Card, Col, Form, InputNumber, Row, Select, Switch, Table, Tag } from 'antd';
import { useAppStore } from '../store/appStore';
import type { UserRole } from '../types/common';

const permissions = [
  { role: 'operator', highRisk: false, export: true, configure: false },
  { role: 'engineer', highRisk: true, export: true, configure: true },
  { role: 'manager', highRisk: true, export: true, configure: true },
];

export function Settings() {
  const role = useAppStore((state) => state.role);
  const setRole = useAppStore((state) => state.setRole);

  return (
    <div className="page-grid">
      <section className="page-title-block">
        <span className="eyebrow">System Settings</span>
        <h1>系统配置</h1>
        <p>配置角色权限、复核阈值、模型回退策略和数据新鲜度规则。</p>
      </section>

      <Row gutter={[16, 16]} className="balanced-row">
        <Col xs={24} xl={10}>
          <Card className="industrial-card" title="当前角色">
            <Form layout="vertical">
              <Form.Item label="角色切换">
                <Select
                  value={role}
                  onChange={(value) => setRole(value as UserRole)}
                  options={[
                    { value: 'operator', label: '运行员 operator' },
                    { value: 'engineer', label: '工艺工程师 engineer' },
                    { value: 'manager', label: '值长 manager' },
                  ]}
                />
              </Form.Item>
              <Form.Item label="高风险建议人工复核">
                <Switch checked={role !== 'operator'} disabled checkedChildren="允许" unCheckedChildren="不允许" />
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col xs={24} xl={14}>
          <Card className="industrial-card" title="角色权限矩阵">
            <Table
              rowKey="role"
              pagination={false}
              dataSource={permissions}
              columns={[
                { title: '角色', dataIndex: 'role' },
                {
                  title: '高风险确认',
                  dataIndex: 'highRisk',
                  render: (value: boolean) => <Tag color={value ? 'success' : 'error'}>{value ? '允许' : '不允许'}</Tag>,
                },
                {
                  title: '报表导出',
                  dataIndex: 'export',
                  render: (value: boolean) => <Tag color={value ? 'success' : 'error'}>{value ? '允许' : '不允许'}</Tag>,
                },
                {
                  title: '阈值配置',
                  dataIndex: 'configure',
                  render: (value: boolean) => <Tag color={value ? 'success' : 'warning'}>{value ? '允许' : '只读'}</Tag>,
                },
              ]}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="balanced-row">
        <Col xs={24} lg={12}>
          <Card className="industrial-card" title="风险阈值">
            <Form layout="vertical" initialValues={{ nh3: 1.5, tp: 0.38, drift: 0.2 }}>
              <Form.Item label="NH3-N 预测高风险阈值 mg/L" name="nh3">
                <InputNumber min={0} max={5} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item label="TP 回退阈值 mg/L" name="tp">
                <InputNumber min={0} max={1} step={0.01} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item label="模型漂移告警阈值" name="drift">
                <InputNumber min={0} max={1} step={0.01} style={{ width: '100%' }} />
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card className="industrial-card" title="模型与工具回退策略">
            <Form layout="vertical" initialValues={{ missing: true, fallback: true, trace: true }}>
              <Form.Item label="关键数据缺失时禁止自动确认高风险建议" name="missing" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item label="碳核算接口失败时使用月均排放因子" name="fallback" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item label="AI 回答必须展示工具调用轨迹" name="trace" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
