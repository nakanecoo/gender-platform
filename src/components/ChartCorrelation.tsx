'use client';

const COUNTRIES = [
  { abbr: 'JP', name: '🇯🇵 日本', ggi: 0.663, suicideM: 22.9, unpaidRatio: 5.46, fill: '#6366f1' },
  { abbr: 'KR', name: '🇰🇷 韓国', ggi: 0.680, suicideM: 35.6, unpaidRatio: 4.78, fill: '#94a3b8' },
  { abbr: 'DE', name: '🇩🇪 ドイツ', ggi: 0.815, suicideM: 12.3, unpaidRatio: 2.33, fill: '#64748b' },
  { abbr: 'FR', name: '🇫🇷 仏', ggi: 0.780, suicideM: 17.7, unpaidRatio: 1.63, fill: '#64748b' },
  { abbr: 'US', name: '🇺🇸 米', ggi: 0.748, suicideM: 22.1, unpaidRatio: 1.43, fill: '#64748b' },
  { abbr: 'NO', name: '🇳🇴 ノル', ggi: 0.875, suicideM: 15.2, unpaidRatio: 1.28, fill: '#10b981' },
  { abbr: 'IS', name: '🇮🇸 アイス', ggi: 0.935, suicideM: 19.3, unpaidRatio: 1.24, fill: '#10b981' },
  { abbr: 'SE', name: '🇸🇪 スウェ', ggi: 0.816, suicideM: 15.1, unpaidRatio: 1.18, fill: '#10b981' },
];

type PlotPoint = { x: number; y: number; name: string; abbr: string; fill: string };

function ScatterSVG({
  data, xLabel, yLabel, xMin, xMax, yMin, yMax,
}: {
  data: PlotPoint[];
  xLabel: string; yLabel: string;
  xMin: number; xMax: number; yMin: number; yMax: number;
}) {
  const W = 500, H = 260;
  const padL = 42, padR = 14, padT = 14, padB = 36;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const xs = (x: number) => padL + ((x - xMin) / (xMax - xMin)) * plotW;
  const ys = (y: number) => H - padB - ((y - yMin) / (yMax - yMin)) * plotH;

  const xTicks = [0.65, 0.70, 0.75, 0.80, 0.85, 0.90, 0.95];
  const ySteps = 5;
  const yTicks = Array.from({ length: ySteps }, (_, i) =>
    parseFloat((yMin + ((yMax - yMin) / (ySteps - 1)) * i).toFixed(1))
  );

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-label="相関散布図">
      {xTicks.map((x) => (
        <line key={x} x1={xs(x)} y1={padT} x2={xs(x)} y2={H - padB} stroke="#f1f5f9" strokeWidth="1" />
      ))}
      {yTicks.map((y) => (
        <line key={y} x1={padL} y1={ys(y)} x2={W - padR} y2={ys(y)} stroke="#f1f5f9" strokeWidth="1" />
      ))}
      <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="#cbd5e1" strokeWidth="1.5" />
      <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="#cbd5e1" strokeWidth="1.5" />
      {xTicks.map((x) => (
        <text key={x} x={xs(x)} y={H - padB + 11} textAnchor="middle" fontSize="8" fill="#94a3b8">
          {x.toFixed(2)}
        </text>
      ))}
      {yTicks.map((y) => (
        <text key={y} x={padL - 4} y={ys(y) + 3} textAnchor="end" fontSize="8" fill="#94a3b8">
          {y}
        </text>
      ))}
      <text x={padL + plotW / 2} y={H - 2} textAnchor="middle" fontSize="9" fill="#64748b">
        {xLabel}
      </text>
      <text
        x={10}
        y={padT + plotH / 2}
        textAnchor="middle"
        fontSize="9"
        fill="#64748b"
        transform={`rotate(-90, 10, ${padT + plotH / 2})`}
      >
        {yLabel}
      </text>
      {data.map((d) => (
        <g key={d.abbr}>
          <circle cx={xs(d.x)} cy={ys(d.y)} r={5.5} fill={d.fill} opacity={0.85} stroke="white" strokeWidth="1" />
          <text x={xs(d.x) + 8} y={ys(d.y) + 4} fontSize="8.5" fill="#334155">
            {d.name}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function ChartGGISuicide() {
  const data = COUNTRIES.map((c) => ({
    x: c.ggi, y: c.suicideM, name: c.name, abbr: c.abbr, fill: c.fill,
  }));
  return (
    <ScatterSVG
      data={data}
      xLabel="GGIスコア（ジェンダーギャップ指数）"
      yLabel="男性自殺死亡率（/10万人）"
      xMin={0.62} xMax={0.96}
      yMin={0} yMax={42}
    />
  );
}

export function ChartGGIUnpaid() {
  const data = COUNTRIES.map((c) => ({
    x: c.ggi, y: c.unpaidRatio, name: c.name, abbr: c.abbr, fill: c.fill,
  }));
  return (
    <ScatterSVG
      data={data}
      xLabel="GGIスコア（ジェンダーギャップ指数）"
      yLabel="無償労働の男女比（女性/男性）"
      xMin={0.62} xMax={0.96}
      yMin={0} yMax={6.5}
    />
  );
}
