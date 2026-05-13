'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, LabelList, Cell,
} from 'recharts';

const DV_TYPE_DATA = [
  { label: '配偶者暴力\n経験あり', women: 27.5, men: 22.0 },
  { label: '「何度も」\n被害', women: 13.2, men: 7.2 },
  { label: '命の危険\n感じた', women: 15.6, men: 7.5 },
  { label: '性暴力\n被害経験', women: 8.1, men: 0.7 },
];

const CONSULT_DATA = [
  { label: '女性', rate: 36.3 },
  { label: '男性', rate: 57.2 },
];

export function ChartDVRate() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={DV_TYPE_DATA} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#334155' }} />
        <YAxis
          tick={{ fontSize: 11, fill: '#64748b' }}
          tickFormatter={(v) => `${v}%`}
          domain={[0, 35]}
        />
        <Tooltip
          formatter={(value: unknown, name: unknown) => [
            `${value}%`,
            name === 'women' ? '女性' : '男性',
          ]}
          contentStyle={{ fontSize: 12, borderRadius: 8 }}
        />
        <Legend formatter={(v) => (v === 'women' ? '女性' : '男性')} />
        <Bar dataKey="women" name="women" fill="#ec4899" radius={[3, 3, 0, 0]} />
        <Bar dataKey="men" name="men" fill="#3b82f6" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ChartNoConsult() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={CONSULT_DATA} margin={{ top: 16, right: 16, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="label" tick={{ fontSize: 13, fill: '#334155' }} />
        <YAxis
          tick={{ fontSize: 11, fill: '#64748b' }}
          tickFormatter={(v) => `${v}%`}
          domain={[0, 70]}
        />
        <Tooltip
          formatter={(v: unknown) => [`${v}%`, '誰にも相談しなかった']}
          contentStyle={{ fontSize: 12, borderRadius: 8 }}
        />
        <Bar dataKey="rate" name="rate" radius={[4, 4, 0, 0]}>
          <LabelList
            dataKey="rate"
            position="top"
            fontSize={13}
            fontWeight={700}
            formatter={(v: unknown) => `${v}%`}
          />
          {CONSULT_DATA.map((entry) => (
            <Cell key={entry.label} fill={entry.label === '女性' ? '#ec4899' : '#3b82f6'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
