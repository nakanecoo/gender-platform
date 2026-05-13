'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, LabelList,
} from 'recharts';

const DATA = [
  { country: '🇸🇪 スウェーデン', women: 162, men: 137 },
  { country: '🇮🇸 アイスランド', women: 178, men: 143 },
  { country: '🇳🇴 ノルウェー', women: 168, men: 131 },
  { country: '🇺🇸 アメリカ', women: 230, men: 161 },
  { country: '🇫🇷 フランス', women: 215, men: 132 },
  { country: '🇩🇪 ドイツ', women: 214, men: 92 },
  { country: '🇰🇷 韓国', women: 215, men: 45 },
  { country: '🇯🇵 日本', women: 224, men: 41 },
];

export default function ChartUnpaidLabor() {
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={340}>
        <BarChart
          data={DATA}
          layout="vertical"
          margin={{ top: 4, right: 52, left: 0, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: '#64748b' }}
            tickFormatter={(v) => `${v}分`}
          />
          <YAxis
            type="category"
            dataKey="country"
            tick={{ fontSize: 11, fill: '#334155' }}
            width={128}
          />
          <Tooltip
            formatter={(value: unknown, name: unknown) => [
              `${value}分`,
              name === 'women' ? '女性' : '男性',
            ]}
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
          />
          <Legend formatter={(v) => (v === 'women' ? '女性' : '男性')} />
          <Bar dataKey="women" name="women" fill="#ec4899" radius={[0, 3, 3, 0]}>
            <LabelList dataKey="women" position="right" fontSize={10} fill="#475569" formatter={(v: unknown) => `${v}`} />
          </Bar>
          <Bar dataKey="men" name="men" fill="#3b82f6" radius={[0, 3, 3, 0]}>
            <LabelList dataKey="men" position="right" fontSize={10} fill="#475569" formatter={(v: unknown) => `${v}`} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-slate-400 text-center mt-1">単位：分/日　出典：OECD生活時間調査2020</p>
    </div>
  );
}
