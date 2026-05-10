'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import { Metric } from '@/types';
import { COUNTRIES } from '@/data/countries';
import { CountryCode } from '@/types';

interface Props {
  metric: Metric;
  selectedCountries: CountryCode[];
}

export default function ComparisonBarChart({ metric, selectedCountries }: Props) {
  const data = selectedCountries
    .map((code) => ({
      name: `${COUNTRIES[code].flag} ${COUNTRIES[code].name}`,
      value: metric.data[code],
      color: COUNTRIES[code].color,
      code,
    }))
    .sort((a, b) =>
      metric.higherIsBetter ? b.value - a.value : a.value - b.value
    );

  const formatValue = (v: number) => {
    if (metric.unit === '') return v.toFixed(3);
    return `${v}${metric.unit}`;
  };

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 60, left: 8, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
          <XAxis
            type="number"
            domain={[0, 'auto']}
            tick={{ fontSize: 11, fill: '#64748b' }}
            tickFormatter={(v) => (metric.unit === '' ? v.toFixed(2) : `${v}${metric.unit}`)}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 12, fill: '#334155' }}
            width={110}
          />
          <Tooltip
            formatter={(value) => [formatValue(Number(value)), metric.name]}
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} label={{ position: 'right', fontSize: 11, fill: '#475569', formatter: (v: unknown) => formatValue(Number(v)) }}>
            {data.map((entry) => (
              <Cell key={entry.code} fill={entry.color} />
            ))}
          </Bar>
          {metric.higherIsBetter === false && (
            <ReferenceLine x={0} stroke="#94a3b8" />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
