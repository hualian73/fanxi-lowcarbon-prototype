# fanxi-lowcarbon-prototype

面向光伏污水厂的低碳辅助决策系统 Web 原型。系统不直接控制 PLC，只输出可解释、可复核、可追溯的运行建议，用于产品汇报和原型演示。

## 启动方式

```bash
npm install
npm run dev
```

默认访问：

```text
https://fanxi-lowcarbon-prototype.vercel.app
```

生产构建：

```bash
npm run build
```

测试：

```bash
npm test
```

## 技术栈

- React 18 + TypeScript + Vite
- Ant Design + @ant-design/icons
- Apache ECharts
- React Flow
- Zustand
- dayjs
- GSAP
- Vitest

## 项目结构

```text
src/
  components/    复用组件：KPI、风险、建议卡、流程图、图表、证据链、工具轨迹等
  mock/          业务 mock 数据：驾驶舱、预测、调度、异常、助手、报表
  pages/         8 个业务页面
  services/      mock service，模拟接口延迟与数据返回
  store/         Zustand 全局状态：角色、综合风险、建议状态、人工反馈审计
  styles/        深色工业驾驶舱视觉样式
  types/         核心 TypeScript 类型定义
  utils/         建议策略、格式化工具和测试
  hooks/         GSAP 页面入场、卡片错位浮现与工业光效动效
```

## 页面功能

- `/dashboard` 决策驾驶舱：KPI、流程闭环图、碳排趋势、建议卡片、异常状态、建议详情抽屉。
- `/prediction` 运行预测中心：曝气、出水氨氮、加药、光伏出力预测，展示模型回退状态。
- `/dispatch` 低碳调度中心：支持安全优先、成本优先、碳排优先、均衡模式切换。
- `/anomaly` 异常诊断中心：根因排序、证据链、异常事件与处置建议。
- `/copilot` AI 智能助手：输入问题后返回模拟结构化回答、工具调用轨迹、依据、风险和置信度。
- `/reports` 报表中心：班组复盘、光伏消纳、药耗碳核算和碳排构成。
- `/monitor` 数据与模型监控：数据缺失、模型回退、工具调用失败、模型漂移监控。
- `/settings` 系统配置：角色权限、复核阈值、模型与工具回退策略。

## 核心交互

- 首页建议卡片可打开详情抽屉。
- 建议卡片支持采纳、驳回、修改后采纳，并记录审计轨迹。
- 高风险建议会弹出人工复核确认。
- 当前角色为 `operator` 时，高风险确认按钮不可用，只能提交复核。
- 当前角色切换为 `engineer` 或 `manager` 后，高风险确认按钮变为可用。
- 数据缺失、模型回退、工具调用失败均在页面中以明确状态展示。
- GSAP 动效包括页面入场、KPI/卡片错位浮现、流程图呼吸光效、核心指标浮动和 sparkline 微动效。
- Canvas 工业背景包括光伏太阳弧、能流曲线、微粒网络和 PV/AIR/DO/PAC/CO2/AI 节点，突出数据流、能源流与工艺流的联动。


## 说明

所有数据均来自 `src/mock` 与 `src/services/mockService.ts`，没有真实后端依赖。视觉效果使用 CSS、图表和组件实现，没有使用外部图片。
