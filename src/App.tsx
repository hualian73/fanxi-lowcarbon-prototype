import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertOutlined,
  BarChartOutlined,
  ControlOutlined,
  DashboardOutlined,
  FundProjectionScreenOutlined,
  MessageOutlined,
  MonitorOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { ConfigProvider, Layout, Menu, Select, Space, Typography, theme } from 'antd';
import type { MenuProps } from 'antd';
import { Dashboard } from './pages/Dashboard';
import { Prediction } from './pages/Prediction';
import { Dispatch } from './pages/Dispatch';
import { Anomaly } from './pages/Anomaly';
import { Copilot } from './pages/Copilot';
import { Reports } from './pages/Reports';
import { Monitor } from './pages/Monitor';
import { Settings } from './pages/Settings';
import { DataFreshnessBadge } from './components/DataFreshnessBadge';
import { RiskBadge } from './components/RiskBadge';
import { IndustrialBackdrop } from './components/IndustrialBackdrop';
import { useAppStore } from './store/appStore';
import type { UserRole } from './types/common';
import { useGsapMotion } from './hooks/useGsapMotion';
import { getRoutePathFromLocation, getRouteUrl } from './utils/navigation';

const { Header, Sider, Content } = Layout;

const routes = [
  { path: '/dashboard', label: '决策驾驶舱', icon: <DashboardOutlined />, element: <Dashboard /> },
  { path: '/prediction', label: '运行预测中心', icon: <FundProjectionScreenOutlined />, element: <Prediction /> },
  { path: '/dispatch', label: '低碳调度中心', icon: <ControlOutlined />, element: <Dispatch /> },
  { path: '/anomaly', label: '异常诊断中心', icon: <AlertOutlined />, element: <Anomaly /> },
  { path: '/copilot', label: 'AI 智能助手', icon: <MessageOutlined />, element: <Copilot /> },
  { path: '/reports', label: '报表中心', icon: <BarChartOutlined />, element: <Reports /> },
  { path: '/monitor', label: '数据与模型监控', icon: <MonitorOutlined />, element: <Monitor /> },
  { path: '/settings', label: '系统配置', icon: <SettingOutlined />, element: <Settings /> },
];

const roleOptions = [
  { value: 'operator', label: '运行员' },
  { value: 'engineer', label: '工艺工程师' },
  { value: 'manager', label: '值长' },
];

const routePaths = routes.map((route) => route.path);
const appBaseUrl = import.meta.env.BASE_URL;

function getCurrentPath() {
  return getRoutePathFromLocation(window.location, routePaths, '/dashboard', appBaseUrl);
}

export default function App() {
  const [path, setPath] = useState(getCurrentPath);
  const contentRef = useRef<HTMLElement>(null);
  const role = useAppStore((state) => state.role);
  const setRole = useAppStore((state) => state.setRole);
  const currentRisk = useAppStore((state) => state.currentRisk);
  const updatedAt = useAppStore((state) => state.dataUpdatedAt);

  useEffect(() => {
    if (window.location.pathname === '/' && appBaseUrl === '/') {
      window.history.replaceState(null, '', getRouteUrl('/dashboard', appBaseUrl));
    }

    if (appBaseUrl !== '/' && !window.location.hash) {
      window.history.replaceState(null, '', getRouteUrl(getCurrentPath(), appBaseUrl));
    }

    const syncPath = () => setPath(getCurrentPath());
    window.addEventListener('popstate', syncPath);
    window.addEventListener('hashchange', syncPath);
    syncPath();
    return () => {
      window.removeEventListener('popstate', syncPath);
      window.removeEventListener('hashchange', syncPath);
    };
  }, []);

  const menuItems: MenuProps['items'] = useMemo(
    () =>
      routes.map((route) => ({
        key: route.path,
        icon: route.icon,
        label: route.label,
      })),
    [],
  );

  const current = routes.find((route) => route.path === path) ?? routes[0];
  useGsapMotion(contentRef, current.path);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#21D4FD',
          colorBgBase: '#07111F',
          colorBgContainer: '#0D1B2E',
          borderRadius: 8,
          fontFamily:
            '"Inter", "Segoe UI", "PingFang SC", "Microsoft YaHei", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        },
        components: {
          Card: { colorBgContainer: '#0D1B2E', colorBorderSecondary: '#183450' },
          Layout: { headerBg: '#081522', siderBg: '#081522', bodyBg: '#07111F' },
          Menu: { darkItemBg: '#081522', darkItemSelectedBg: '#123653' },
        },
      }}
    >
      <Layout className="app-shell">
        <IndustrialBackdrop />
        <Sider className="app-sider" width={248} breakpoint="lg" collapsedWidth={72}>
          <div className="brand-block">
            <div className="brand-mark">LC</div>
            <div>
              <Typography.Title level={4}>Fanxi LowCarbon</Typography.Title>
              <span>AI 决策辅助原型</span>
            </div>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            items={menuItems}
            selectedKeys={[path]}
            onClick={({ key }) => {
              window.history.pushState(null, '', getRouteUrl(String(key), appBaseUrl));
              setPath(key);
            }}
          />
        </Sider>

        <Layout>
          <Header className="app-header">
            <Space size={18} wrap>
              <DataFreshnessBadge updatedAt={updatedAt} />
              <Space>
                <span className="header-label">综合风险</span>
                <RiskBadge risk={currentRisk} pulse={currentRisk === 'high'} />
              </Space>
            </Space>
            <Space>
              <span className="header-label">当前角色</span>
              <Select
                value={role}
                data-testid="role-select"
                style={{ width: 132 }}
                options={roleOptions}
                onChange={(value) => setRole(value as UserRole)}
              />
            </Space>
          </Header>
          <Content className="app-content" ref={contentRef}>
            {current.element}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
