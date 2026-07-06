import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { TimeSeriesPoint } from '../types/common';

interface TimeSeriesChartProps {
  title?: string;
  unit: string;
  data: TimeSeriesPoint[];
  height?: number;
  color?: string;
}

export function TimeSeriesChart({ title, unit, data, height = 280, color = '#21D4FD' }: TimeSeriesChartProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return undefined;
    }

    const chart = echarts.init(ref.current);
    const option: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      title: title ? { text: title, textStyle: { color: '#E6F4FF', fontSize: 14 } } : undefined,
      tooltip: { trigger: 'axis', backgroundColor: '#0D1B2E', borderColor: '#24415F', textStyle: { color: '#fff' } },
      legend: {
        top: title ? 24 : 4,
        textStyle: { color: '#9FB8D0' },
        data: ['实测', '预测', '上界', '下界'].filter((name) =>
          name === '实测'
            ? true
            : data.some((item) => {
                if (name === '预测') return item.forecast !== undefined;
                if (name === '上界') return item.upper !== undefined;
                return item.lower !== undefined;
              }),
        ),
      },
      grid: { top: title ? 72 : 48, left: 42, right: 24, bottom: 32 },
      xAxis: {
        type: 'category',
        data: data.map((item) => item.time),
        axisLine: { lineStyle: { color: '#24415F' } },
        axisLabel: { color: '#9FB8D0' },
      },
      yAxis: {
        type: 'value',
        name: unit,
        nameTextStyle: { color: '#8DA6BD' },
        splitLine: { lineStyle: { color: '#17283D' } },
        axisLabel: { color: '#9FB8D0' },
      },
      series: [
        {
          name: '实测',
          type: 'line',
          smooth: true,
          data: data.map((item) => item.value),
          symbolSize: 7,
          lineStyle: { width: 3, color },
          itemStyle: { color },
          areaStyle: { color: `${color}18` },
        },
        {
          name: '预测',
          type: 'line',
          smooth: true,
          data: data.map((item) => item.forecast),
          lineStyle: { width: 2, type: 'dashed', color: '#10B981' },
          itemStyle: { color: '#10B981' },
        },
        {
          name: '上界',
          type: 'line',
          smooth: true,
          data: data.map((item) => item.upper),
          lineStyle: { width: 1, type: 'dotted', color: '#FFB020' },
          itemStyle: { color: '#FFB020' },
        },
        {
          name: '下界',
          type: 'line',
          smooth: true,
          data: data.map((item) => item.lower),
          lineStyle: { width: 1, type: 'dotted', color: '#FFB020' },
          itemStyle: { color: '#FFB020' },
        },
      ],
    };

    chart.setOption(option);
    const resize = () => chart.resize();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      chart.dispose();
    };
  }, [color, data, title, unit]);

  return <div ref={ref} style={{ height }} />;
}
