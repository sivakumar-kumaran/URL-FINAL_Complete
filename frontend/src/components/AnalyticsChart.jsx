import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import useTheme from '../hooks/useTheme';

export const AnalyticsChart = ({ data, type = 'daily' }) => {
  const { theme } = useTheme();

  const isDark = theme === 'dark';
  const gridColor = isDark ? '#1e293b' : '#f1f5f9';
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const primaryColor = isDark ? '#a855f7' : '#2563eb'; // purple-500 vs blue-600
  const gradientStart = isDark ? 'rgba(168, 85, 247, 0.4)' : 'rgba(37, 99, 235, 0.2)';
  const gradientEnd = isDark ? 'rgba(168, 85, 247, 0.0)' : 'rgba(37, 99, 235, 0.0)';

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-72 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
        <span className="text-sm text-slate-400 dark:text-slate-500">No data available for this range</span>
      </div>
    );
  }

  // Format data labels based on type
  const chartData = data.map((d) => {
    if (type === 'daily') {
      const dateObj = new Date(d.date);
      return {
        ...d,
        label: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      };
    }
    return {
      ...d,
      label: d.week || d.date,
    };
  });

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">
            {payload[0].payload.label || payload[0].payload.date}
          </p>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Clicks: <span className="text-blue-600 dark:text-purple-400">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        {type === 'daily' ? (
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={primaryColor} stopOpacity={0.4} />
                <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="label"
              stroke={textColor}
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke={textColor}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="clicks"
              stroke={primaryColor}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#chartGradient)"
            />
          </AreaChart>
        ) : (
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="label"
              stroke={textColor}
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke={textColor}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="clicks"
              fill={primaryColor}
              radius={[4, 4, 0, 0]}
              maxBarSize={45}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsChart;
