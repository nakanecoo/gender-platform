'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendMetric } from '@/types';
import { COUNTRIES } from '@/data/countries';
import { CountryCode } from '@/types';

interface Props {
  trendMetric: TrendMetric;
  selectedCountries: CountryCode[];
}

// 最後のデータ点にだけ国名ラベルを描画
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeEndLabel(code: CountryCode, totalPoints: number): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function EndLabel(props: any) {
    const x = Number(props.x ?? 0);
    const y = Number(props.y ?? 0);
    const index = Number(props.index ?? 0);
    if (index !== totalPoints - 1) return <g />;
    const c = COUNTRIES[code];
    const isJP = code === 'JP';
    return (
      <text
        x={x + 10}
        y={y + 4}
        fill={c.color}
        fontSize={isJP ? 12 : 11}
        fontWeight={isJP ? '700' : '600'}
        textAnchor="start"
      >
        {c.flag} {c.name}
      </text>
    );
  };
}

export default function TrendLineChart({ trendMetric, selectedCountries }: Props) {
  const years = trendMetric.data['JP'].map((p) => p.year);

  const chartData = years.map((year) => {
    const row: Record<string, number | string> = { year };
    selectedCountries.forEach((code) => {
      const point = trendMetric.data[code].find((p) => p.year === year);
      if (point) row[code] = point.value;
    });
    return row;
  });

  // 実データの範囲に合わせてY軸を拡大
  const allValues = selectedCountries.flatMap(
    (code) => (trendMetric.data[code] ?? []).map((p) => p.value)
  );
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);
  const range = maxVal - minVal || 1;
  const padding = range * 0.15;
  const yMin = Math.max(0, minVal - padding);
  const yMax = maxVal + padding;

  const formatValue = (v: number) =>
    trendMetric.unit === '' ? v.toFixed(3) : `${v}${trendMetric.unit}`;

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 16, right: 110, left: 4, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#64748b' }} />
          <YAxis
            domain={[yMin, yMax]}
            tick={{ fontSize: 11, fill: '#64748b' }}
            tickFormatter={(v) =>
              trendMetric.unit === '' ? v.toFixed(2) : `${v}${trendMetric.unit}`
            }
            width={52}
          />
          <Tooltip
            formatter={(value, name) => [
              formatValue(Number(value)),
              `${COUNTRIES[name as CountryCode]?.flag ?? ''} ${COUNTRIES[name as CountryCode]?.name ?? String(name)}`,
            ]}
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
          />

          {/* 日本以外の線（細め・背景） */}
          {selectedCountries
            .filter((c) => c !== 'JP')
            .map((code) => (
              <Line
                key={code}
                type="monotone"
                dataKey={code}
                stroke={COUNTRIES[code].color}
                strokeWidth={1.8}
                dot={false}
                activeDot={{ r: 4 }}
                label={makeEndLabel(code, chartData.length)}
              />
            ))}

          {/* 日本の線（太く・前面） */}
          {selectedCountries.includes('JP') && (
            <Line
              key="JP"
              type="monotone"
              dataKey="JP"
              stroke="#dc2626"
              strokeWidth={3.5}
              dot={{ r: 3, fill: '#dc2626', strokeWidth: 0 }}
              activeDot={{ r: 6 }}
              label={makeEndLabel('JP', chartData.length)}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
