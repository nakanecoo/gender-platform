'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { ChartGGISuicide, ChartGGIUnpaid } from '@/components/ChartCorrelation';

const ChartUnpaidLabor = dynamic(() => import('@/components/ChartUnpaidLabor'), { ssr: false });
const ChartDVRate = dynamic(
  () => import('@/components/ChartDVBars').then((m) => ({ default: m.ChartDVRate })),
  { ssr: false }
);
const ChartNoConsult = dynamic(
  () => import('@/components/ChartDVBars').then((m) => ({ default: m.ChartNoConsult })),
  { ssr: false }
);

type IcebergLayer = 'surface' | 'institutional' | 'norms' | null;
type Tab = 'data' | 'why' | 'solution';
type DVChoice = 'A' | 'B' | 'C' | null;

/* ─── Shared helpers ─── */

function Src({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-slate-400 mt-3 leading-relaxed">出典：{children}</p>;
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2 text-sm text-slate-700 leading-relaxed">
      <span className="mt-1 shrink-0 text-slate-400">•</span>
      <span>{children}</span>
    </li>
  );
}

function Stars({ n }: { n: number }) {
  return <span className="text-amber-400 text-sm font-mono">{'★'.repeat(n)}{'☆'.repeat(3 - n)}</span>;
}

function StatGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">{children}</div>;
}

function Stat({ label, value, sub, variant = 'confirmed' }: {
  label: string; value: string; sub?: string;
  variant?: 'confirmed' | 'hypothesis' | 'research';
}) {
  const configs = {
    confirmed:  { bg: 'bg-blue-50 border-blue-200', textColor: 'text-blue-700',   inlineStyle: { borderLeftWidth: '4px', borderLeftColor: '#3b82f6' } },
    hypothesis: { bg: 'bg-slate-50 border-slate-200', textColor: 'text-slate-500', inlineStyle: { borderStyle: 'dashed' as const } },
    research:   { bg: 'bg-orange-50 border-orange-200', textColor: 'text-orange-600', inlineStyle: {} },
  };
  const badgeLabel = { confirmed: null, hypothesis: '仮説', research: '研究中' } as const;
  const cfg = configs[variant];
  return (
    <div className={`rounded-xl p-3 border ${cfg.bg}`} style={cfg.inlineStyle}>
      <p className="text-xs text-slate-500 mb-1 leading-tight">{label}</p>
      <p className={`text-xl font-bold ${cfg.textColor}`}>{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      {badgeLabel[variant] && (
        <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 border border-orange-200">
          {badgeLabel[variant]}
        </span>
      )}
    </div>
  );
}

/* ─── Tab bar ─── */

function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const tabs = [
    { id: 'data' as Tab,     label: '📊 データ',         cls: 'text-blue-600 border-blue-500' },
    { id: 'why' as Tab,      label: '🔍 なぜ起きるか',    cls: 'text-amber-600 border-amber-500' },
    { id: 'solution' as Tab, label: '💡 何をすれば変わるか', cls: 'text-emerald-600 border-emerald-500' },
  ];
  return (
    <div className="flex border-b border-slate-200 mb-5 overflow-x-auto shrink-0">
      {tabs.map((t) => (
        <button key={t.id} onClick={() => onChange(t.id)}
          className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
            active === t.id ? t.cls : 'text-slate-500 border-transparent hover:text-slate-700'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

/* ─── Topic section wrapper ─── */

function TopicSection({ no, title, color, tab, onTab, data, why, solution }: {
  no: number; title: string; color: string;
  tab: Tab; onTab: (t: Tab) => void;
  data: React.ReactNode; why: React.ReactNode; solution: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
      <div className={`${color} px-6 py-4`}>
        <span className="text-xs font-semibold opacity-70 mb-1 block">トピック {no}</span>
        <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">{title}</h2>
      </div>
      <div className="px-4 sm:px-6 py-5">
        <TabBar active={tab} onChange={onTab} />
        {tab === 'data' && data}
        {tab === 'why' && why}
        {tab === 'solution' && solution}
      </div>
    </section>
  );
}

/* ─── Iceberg SVG ─── */

const ICEBERG_PATH = `M 248 170 L 280 138 L 315 102 L 342 73 L 362 54
L 384 64 L 410 95 L 436 131 L 458 164 L 458 170
L 495 242 L 522 314 L 514 382 L 461 420
L 360 434 L 254 430 L 202 414 L 155 383
L 149 314 L 175 242 Z`;

const LAYER_INFO = {
  surface: {
    label: '【水面上】見えている現象',
    color: '#1e40af',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    items: ['賃金格差', '管理職比率の低さ', '育休取得率の差', 'DV件数', 'ひとり親の貧困率'],
    detail: `これらは統計に現れ、ニュースで報じられる「見えやすい」問題です。しかし、これらを個別に対処しても根本は変わりません。水面下の構造を理解する必要があります。`,
    refs: 'WEF Global Gender Gap Report 2024、内閣府男女共同参画白書',
  },
  institutional: {
    label: '【水面下】制度的固定',
    color: '#1e40af',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    items: ['長時間労働前提の雇用慣行', 'ケア労働の経済的過小評価', '教育・採用・昇進における無意識バイアス'],
    detail: `制度が規範を固定化します。「フルタイムで長時間働ける人」を前提とした雇用慣行は、ケアを担う人（多くの場合女性）を不利にします。また、感情的・ケア的とされる職種（看護・介護・教育）の賃金が低い構造は、ケア労働を「女性的＝低価値」とみなす規範を再生産します。`,
    refs: 'CEPR「The evolution of gender in the labour market」2025、ODI ALIGN Report 2024',
  },
  norms: {
    label: '【氷山の底】社会規範・歴史的背景',
    color: '#bfdbfe',
    bg: 'bg-indigo-950',
    border: 'border-indigo-800',
    items: ['「男は稼ぐべき、女はケアすべき」という規範', '規範は5レベルで同時に作用する', 'ステレオタイプの自己強化循環'],
    detail: `ジェンダー規範は「個人の気持ち」ではなく、社会の5レベルで同時に作用します：\n
①個人（自己認識・行動）\n②家族（役割分担・期待）\n③コミュニティ（慣習・評判）\n④制度（法律・政策）\n⑤政策（国際的枠組み）\n
これらが相互強化することで、規範は個人の意思を超えた構造となります。教育・メディア・職場・家庭がステレオタイプを再生産し、それが次世代の規範形成につながる循環が生まれています。`,
    refs: 'UNICEF Gender Policy 2022-2025、UNDP Gender Social Norms Index 2023',
  },
} as const;

function IcebergDiagram({ active, onToggle }: {
  active: IcebergLayer;
  onToggle: (l: IcebergLayer) => void;
}) {
  const toggle = (l: Exclude<IcebergLayer, null>) =>
    onToggle(active === l ? null : l);

  const surfaceFill = active === 'surface' ? '#93c5fd' : '#dbeafe';
  const midFill     = active === 'institutional' ? '#3b82f6' : '#60a5fa';
  const deepFill    = active === 'norms' ? '#1d4ed8' : '#2563eb';

  return (
    <div>
      <svg viewBox="0 0 700 445" className="w-full" role="img" aria-label="ジェンダー問題の氷山モデル。3層をクリックして詳細を表示。">
        <defs>
          <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f0f9ff" /><stop offset="100%" stopColor="#e0f2fe" />
          </linearGradient>
          <linearGradient id="seaG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#bfdbfe" /><stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.9" />
          </linearGradient>
          <clipPath id="clip-s"><rect x="0" y="0"   width="700" height="170" /></clipPath>
          <clipPath id="clip-m"><rect x="0" y="170" width="700" height="148" /></clipPath>
          <clipPath id="clip-d"><rect x="0" y="318" width="700" height="130" /></clipPath>
        </defs>

        {/* Backgrounds */}
        <rect x="0" y="0"   width="700" height="170" fill="url(#skyG)" />
        <rect x="0" y="170" width="700" height="275" fill="url(#seaG)" />

        {/* Waterline */}
        <line x1="0" y1="170" x2="700" y2="170" stroke="#60a5fa" strokeWidth="2" strokeDasharray="10 5" />
        <text x="8" y="165" fontSize="10" fill="#3b82f6" fontWeight="600">水面</text>

        {/* Iceberg: surface zone */}
        <path d={ICEBERG_PATH} fill={surfaceFill} clipPath="url(#clip-s)"
          className="cursor-pointer transition-colors" style={{ transition: 'fill 0.2s' }}
          onClick={() => toggle('surface')} />

        {/* Iceberg: mid zone */}
        <path d={ICEBERG_PATH} fill={midFill} clipPath="url(#clip-m)"
          className="cursor-pointer transition-colors" style={{ transition: 'fill 0.2s' }}
          onClick={() => toggle('institutional')} />

        {/* Iceberg: deep zone */}
        <path d={ICEBERG_PATH} fill={deepFill} clipPath="url(#clip-d)"
          className="cursor-pointer transition-colors" style={{ transition: 'fill 0.2s' }}
          onClick={() => toggle('norms')} />

        {/* Outline */}
        <path d={ICEBERG_PATH} fill="none" stroke="#93c5fd" strokeWidth="1.5" />

        {/* Divider between mid and deep */}
        <line x1="155" y1="318" x2="545" y2="318" stroke="#93c5fd" strokeWidth="1" strokeDasharray="6 3" opacity="0.6" />

        {/* Labels – surface */}
        <text x="353" y="110" textAnchor="middle" fill="#1e40af" fontSize="12" fontWeight="700">【水面上】見えている現象</text>
        <text x="353" y="126" textAnchor="middle" fill="#1e40af" fontSize="9" opacity="0.8">賃金格差・管理職比率・育休格差・DV・ひとり親貧困</text>
        <text x="353" y="145" textAnchor="middle" fill="#3b82f6" fontSize="9">▶ クリックして詳細</text>

        {/* Labels – mid */}
        <text x="353" y="234" textAnchor="middle" fill="white" fontSize="12" fontWeight="700">【水面下】制度的固定</text>
        <text x="353" y="250" textAnchor="middle" fill="#e0f2fe" fontSize="9" opacity="0.9">長時間労働・ケア労働の過小評価・無意識バイアス</text>
        <text x="353" y="268" textAnchor="middle" fill="#bfdbfe" fontSize="9">▶ クリックして詳細</text>

        {/* Labels – deep */}
        <text x="353" y="352" textAnchor="middle" fill="#bfdbfe" fontSize="12" fontWeight="700">【底】社会規範・歴史的背景</text>
        <text x="353" y="368" textAnchor="middle" fill="#93c5fd" fontSize="9" opacity="0.9">性別役割規範・5レベル構造・ステレオタイプ循環</text>
        <text x="353" y="386" textAnchor="middle" fill="#93c5fd" fontSize="9">▶ クリックして詳細</text>
      </svg>

      {/* Detail panels */}
      {(['surface', 'institutional', 'norms'] as const).map((layer) => {
        if (active !== layer) return null;
        const info = LAYER_INFO[layer];
        const isDark = layer === 'norms';
        return (
          <div key={layer}
            className={`mt-4 rounded-2xl border p-5 ${info.bg} ${info.border} ${isDark ? 'text-slate-100' : ''}`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{info.label}</h3>
              <button onClick={() => onToggle(null)}
                className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-indigo-800 text-indigo-200' : 'bg-white border border-slate-200 text-slate-500'} hover:opacity-80`}>
                閉じる
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {info.items.map((item) => (
                <span key={item}
                  className={`text-xs px-2.5 py-1 rounded-full border ${
                    isDark ? 'bg-indigo-900 border-indigo-700 text-indigo-200' : 'bg-white border-slate-200 text-slate-700'
                  }`}>
                  {item}
                </span>
              ))}
            </div>
            <p className={`text-sm leading-relaxed whitespace-pre-line ${isDark ? 'text-indigo-100' : 'text-slate-700'}`}>
              {info.detail}
            </p>
            <p className={`text-xs mt-3 ${isDark ? 'text-indigo-300' : 'text-slate-400'}`}>出典：{info.refs}</p>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Nordic Paradox panel ─── */

function NordicParadox({ onReveal }: { onReveal: () => void }) {
  return (
    <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-5 mb-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">⚠️</span>
        <h3 className="font-bold text-amber-900 text-base">このグラフを読む前に：データには謎があります</h3>
      </div>
      <p className="text-sm text-amber-800 leading-relaxed mb-4">
        ジェンダー平等が最も進んでいる北欧諸国は、DV被害率がEU平均を<strong>上回っています</strong>。
        これは「北欧パラドックス」と呼ばれ、研究者たちがまだ解明できていない現象です。
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {[
          { letter: 'A', title: '仮説A：情報バイアス仮説', color: 'text-blue-700 bg-blue-50', body: '平等な社会では被害を「被害だ」と認識しやすく、相談窓口も整備されているため、数値として現れやすい。「多い」のではなく「見えやすい」可能性がある。', ref: 'EU基本権機関（FRA）調査 2014' },
          { letter: 'B', title: '仮説B：バックラッシュ効果仮説', color: 'text-orange-700 bg-orange-50', body: 'ジェンダー平等が進む過程で、権力や特権を失うことへの反動として暴力が増える可能性がある。', ref: 'Gracia & Merlo「Nordic paradox」PLOS ONE 2016' },
        ].map((hyp) => (
          <div key={hyp.letter} className="bg-white rounded-xl p-4 border border-amber-200 border-dashed">
            <p className={`text-xs font-bold mb-2 flex items-center gap-1 ${hyp.color.split(' ')[0]}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${hyp.color}`}>{hyp.letter}</span>
              {hyp.title}
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">{hyp.body}</p>
            <p className="text-xs text-slate-400 mt-2">根拠：{hyp.ref}</p>
          </div>
        ))}
      </div>
      <div className="bg-amber-100 rounded-xl p-3 mb-5 text-xs text-amber-900 leading-relaxed">
        <strong>重要：どちらとも断定できない</strong>
        　スウェーデンとスペインの比較研究（Gracia et al. 2019）では、測定バイアスを
        除外してもスウェーデンのDV率が高いことが確認。しかし「なぜそうなるのか」は現在も研究中。
        <span className="block mt-1 text-amber-600">出典：PLOS ONE, 2019</span>
      </div>
      <button onClick={onReveal}
        className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold transition-colors">
        ▼ データを見る
      </button>
    </div>
  );
}

/* ─── DV A/B/C Interaction ─── */

function DVInterpretation({ choice, setChoice }: { choice: DVChoice; setChoice: (c: DVChoice) => void }) {
  const BTN = [
    { id: 'A' as DVChoice, label: 'A：平等化が進むと暴力が増える可能性がある', active: 'bg-blue-600 text-white border-blue-600', inactive: 'bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-400' },
    { id: 'B' as DVChoice, label: 'B：相談できる環境が整うと数値に現れやすくなる', active: 'bg-amber-500 text-white border-amber-500', inactive: 'bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-400' },
    { id: 'C' as DVChoice, label: 'C：どちらとも言えない・複数の要因がある', active: 'bg-purple-600 text-white border-purple-600', inactive: 'bg-purple-50 text-purple-700 border-purple-200 hover:border-purple-400' },
  ];
  const EXPLANATIONS: Record<NonNullable<DVChoice>, { header: string; bg: string; body: string; ref?: string }> = {
    A: { header: 'バックラッシュ効果仮説（Gracia & Merlo 2016）', bg: 'bg-blue-50 border-blue-200',
         body: 'ただし：これは仮説であり、因果関係は証明されていません。「平等化のせい」という解釈は、平等化を止める政策につながるリスクがあります。研究者はより慎重な解釈を求めています。' },
    B: { header: '情報バイアス仮説（FRA調査 2014）', bg: 'bg-amber-50 border-amber-200',
         body: 'ただし：測定バイアスを除外してもスウェーデンの被害率が高かったことが確認されており、この仮説だけでは説明しきれない可能性があります。', ref: 'PLOS ONE 2019' },
    C: { header: 'この見方が現時点では最も研究者の見解に近いです。', bg: 'bg-purple-50 border-purple-200',
         body: '「北欧パラドックス」は2016年に命名されてから現在も研究が続いており、単一の原因では説明できないと考えられています。複雑な問題を単純化しないことが、データリテラシーの第一歩です。' },
  };

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <p className="font-bold text-slate-800 text-sm mb-4">GGIが高い国のDV数値が高い。あなたはこのデータをどう読みますか？</p>
      <div className="flex flex-col sm:flex-row gap-2 mb-5">
        {BTN.map(b => (
          <button key={String(b.id)} onClick={() => setChoice(b.id)}
            className={`flex-1 py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all border-2 ${choice === b.id ? b.active : b.inactive}`}>
            {b.label}
          </button>
        ))}
      </div>
      {choice && (() => {
        const exp = EXPLANATIONS[choice];
        return (
          <>
            <div className={`rounded-xl p-4 border ${exp.bg} text-sm text-slate-700 leading-relaxed mb-4`}>
              <p className="font-semibold mb-1">この見方を支持する研究：{exp.header}</p>
              <p className="text-slate-500 text-xs">{exp.body}</p>
              {exp.ref && <p className="text-xs text-slate-400 mt-1">出典：{exp.ref}</p>}
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs leading-relaxed">
              <p className="font-bold text-slate-700 mb-2">このデータから言えること：</p>
              <ul className="space-y-1">
                <li><span className="text-emerald-600 font-bold">✅</span> 日本のDV被害者の多くが誰にも相談していない（男性57%、女性36%）</li>
                <li><span className="text-emerald-600 font-bold">✅</span> 相談窓口へのアクセスと被害の申告率には関係がある</li>
                <li><span className="text-red-500 font-bold">❌</span> 「数値が低い国は安全」とは断定できない</li>
                <li><span className="text-red-500 font-bold">❌</span> 「平等化がDVを増やす」とは証明されていない</li>
                <li><span className="text-amber-500 font-bold">🔍</span> 北欧パラドックスの原因は現在も研究中</li>
              </ul>
            </div>
          </>
        );
      })()}
    </div>
  );
}

/* ─── Single parent multi-country chart (SVG) ─── */

function ChartSingleParentPoverty() {
  const DATA = [
    { country: '🇸🇪 スウェーデン', rate: 6,   fill: '#10b981' },
    { country: '🇳🇴 ノルウェー',   rate: 5,   fill: '#10b981' },
    { country: '🇮🇸 アイスランド', rate: 5,   fill: '#10b981' },
    { country: '🇫🇷 フランス',     rate: 18,  fill: '#64748b' },
    { country: '🇩🇪 ドイツ',       rate: 20,  fill: '#64748b' },
    { country: '🇺🇸 アメリカ',     rate: 35,  fill: '#64748b' },
    { country: '🇰🇷 韓国',         rate: 40,  fill: '#94a3b8' },
    { country: '🇯🇵 日本',         rate: 51,  fill: '#6366f1' },
  ].sort((a, b) => a.rate - b.rate);

  const W = 500, H = 280, padL = 130, padR = 50, padT = 10, padB = 20;
  const barH = 26, gap = 4;
  const maxVal = 55;
  const xs = (v: number) => padL + (v / maxVal) * (W - padL - padR);

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 300 }}>
        {DATA.map((d, i) => {
          const y = padT + i * (barH + gap);
          const barW = xs(d.rate) - padL;
          return (
            <g key={d.country}>
              <text x={padL - 5} y={y + barH / 2 + 4} textAnchor="end" fontSize="10" fill="#334155">{d.country}</text>
              <rect x={padL} y={y} width={barW} height={barH} rx="3" fill={d.fill} />
              <text x={padL + barW + 4} y={y + barH / 2 + 4} fontSize="10" fill="#475569">{d.rate}%</text>
            </g>
          );
        })}
      </svg>
      <p className="text-xs text-slate-400 text-center mt-1">ひとり親世帯の相対的貧困率　出典：OECD Family Database 2022（概算値含む）</p>
    </div>
  );
}

/* ─── Male suicide multi-country chart (SVG) ─── */

function ChartMaleSuicide() {
  const DATA = [
    { country: '🇩🇪 ドイツ',       rate: 12.3, fill: '#64748b' },
    { country: '🇸🇪 スウェーデン', rate: 15.1, fill: '#10b981' },
    { country: '🇳🇴 ノルウェー',   rate: 15.2, fill: '#10b981' },
    { country: '🇫🇷 フランス',     rate: 17.7, fill: '#64748b' },
    { country: '🇮🇸 アイスランド', rate: 19.3, fill: '#10b981' },
    { country: '🇺🇸 アメリカ',     rate: 22.1, fill: '#64748b' },
    { country: '🇯🇵 日本',         rate: 22.9, fill: '#6366f1' },
    { country: '🇰🇷 韓国',         rate: 35.6, fill: '#94a3b8' },
  ].sort((a, b) => a.rate - b.rate);

  const W = 500, H = 270, padL = 130, padR = 50, padT = 10;
  const barH = 24, gap = 5;
  const maxVal = 40;
  const xs = (v: number) => padL + (v / maxVal) * (W - padL - padR);

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 300 }}>
        {DATA.map((d, i) => {
          const y = padT + i * (barH + gap);
          const barW = xs(d.rate) - padL;
          return (
            <g key={d.country}>
              <text x={padL - 5} y={y + barH / 2 + 4} textAnchor="end" fontSize="10" fill="#334155">{d.country}</text>
              <rect x={padL} y={y} width={barW} height={barH} rx="3" fill={d.fill} />
              <text x={padL + barW + 4} y={y + barH / 2 + 4} fontSize="10" fill="#475569">{d.rate}</text>
            </g>
          );
        })}
      </svg>
      <p className="text-xs text-slate-400 text-center mt-1">男性自殺死亡率（人口10万人あたり）　出典：WHO / 警察庁 2021〜2022</p>
    </div>
  );
}

/* ─── Main Page ─── */

export default function StructurePage() {
  const [activeLayer, setActiveLayer] = useState<IcebergLayer>(null);
  const [tab1, setTab1] = useState<Tab>('data');
  const [tab2, setTab2] = useState<Tab>('data');
  const [tab3, setTab3] = useState<Tab>('data');
  const [tab4, setTab4] = useState<Tab>('data');
  const [dvDataVisible, setDvDataVisible] = useState(false);
  const [dvChoice, setDvChoice] = useState<DVChoice>(null);

  /* Topic 1 */
  const t1Data = (
    <div>
      <StatGrid>
        <Stat label="日本・女性の無償労働時間" value="224分/日" />
        <Stat label="日本・男性の無償労働時間" value="41分/日" sub="OECD加盟国最低水準" />
        <Stat label="男女比（日本）" value="5.5倍" sub="比較国中最大" />
        <Stat label="女性が担う割合" value="84.6%" sub="11か国中最大" />
      </StatGrid>
      <ChartUnpaidLabor />
      <Src>内閣府男女共同参画局・OECD生活時間調査2020</Src>
    </div>
  );
  const t1Why = (
    <div>
      <ul className="space-y-3 mb-4">
        <Bullet>日本男性の有償労働時間はOECD平均317分に対して<strong>452分</strong>（約2時間超過）。長時間労働の構造が男性のケア参加を妨げている。</Bullet>
        <Bullet>「男は仕事、女は家庭」という性別役割規範が依然として根強く残存している。</Bullet>
        <Bullet>ケアの偏在は個人の選択ではなく、労働市場と規範の複合的な結果として生じている。</Bullet>
      </ul>
      <Src>OECD生活時間調査2020、内閣府男女共同参画白書</Src>
    </div>
  );
  const t1Solution = (
    <div>
      <div className="flex gap-4 text-xs text-slate-500 mb-4 flex-wrap">
        <span><span className="text-amber-400">★★★</span> 大規模研究・効果確認</span>
        <span><span className="text-amber-400">★★☆</span> 複数研究で示唆</span>
        <span><span className="text-amber-400">★☆☆</span> 観察段階</span>
      </div>
      <ul className="space-y-3 mb-4">
        <li className="flex gap-2 items-start"><Stars n={3} /><span className="text-sm text-slate-700 leading-relaxed"><strong>父親クォータ制（育休パパ枠）</strong>：アイスランド2000年導入後、父親取得率が世界最高水準（約90%）へ。使わないと消失する設計が鍵。</span></li>
        <li className="flex gap-2 items-start"><Stars n={3} /><span className="text-sm text-slate-700 leading-relaxed"><strong>男性の長時間労働の是正（労働時間規制）</strong>：男性がケアに使える時間を物理的に確保する。</span></li>
        <li className="flex gap-2 items-start"><Stars n={2} /><span className="text-sm text-slate-700 leading-relaxed"><strong>保育サービスの拡充</strong>：公的保育の整備がケア労働の社会化を促す（フランスモデル）。</span></li>
      </ul>
      <Src>OECD Family Database、ILO政策勧告2024</Src>
    </div>
  );

  /* Topic 2 */
  const t2Data = (
    <div>
      <StatGrid>
        <Stat label="友人がいずれもいない日本男性" value="約40%" sub="同性・異性ともにいない" />
        <Stat label="孤独感が高い年代（男性）" value="50代 7.3%" sub="女性は30代7.9%" />
        <Stat label="男性自殺死亡率（日本）" value="22.9" sub="人口10万人あたり・女性の2.2倍" />
        <Stat label="男性10〜44歳の死因第1位" value="自殺" />
      </StatGrid>
      <p className="text-xs font-semibold text-slate-600 mb-2">8か国の男性自殺死亡率比較</p>
      <ChartMaleSuicide />
      <Src>内閣官房「令和5年 人々のつながりに関する基礎調査」、厚生労働省・警察庁「令和6年中における自殺の状況」、WHO 2021-2022</Src>
    </div>
  );
  const t2Why = (
    <div>
      <ul className="space-y-3 mb-4">
        <Bullet><strong>「男性性の規範」</strong>＝弱みを見せてはならない、感情を出してはならない、自分で解決しなければならない。この規範が助けを求めることを妨げる。</Bullet>
        <Bullet>会社中心の人間関係が<strong>定年後に崩壊</strong>する構造。仕事以外のつながりを育む機会が少ない。</Bullet>
        <Bullet>ケアを受けることも、ケアをすることも、男性は社会化されてこなかった。感情的つながりを作るスキルが育ちにくい。</Bullet>
      </ul>
      <Src>田中俊之（武蔵大学）男性学研究、内閣府孤独・孤立対策担当室資料2024</Src>
    </div>
  );
  const t2Solution = (
    <div>
      <ul className="space-y-3 mb-4">
        <li className="flex gap-2 items-start"><Stars n={3} /><span className="text-sm text-slate-700 leading-relaxed"><strong>育児・介護への男性参加を促す制度</strong>：ケアを経験することで感情的つながりが育まれる。</span></li>
        <li className="flex gap-2 items-start"><Stars n={2} /><span className="text-sm text-slate-700 leading-relaxed"><strong>男性向け相談窓口・メンタルヘルス支援の拡充</strong>：「男性だから相談しにくい」という障壁を取り除く。</span></li>
        <li className="flex gap-2 items-start"><Stars n={2} /><span className="text-sm text-slate-700 leading-relaxed"><strong>学校教育での感情表現・助けを求めるスキルの育成</strong>：幼少期から「助けを求めることは当然」と学ぶ環境作り。</span></li>
      </ul>
      <Src>OECD Gender Equality報告2024</Src>
    </div>
  );

  /* Topic 3 */
  const t3Data = (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
          <p className="text-xs font-bold text-rose-700 mb-3">シングルマザー（日本）</p>
          {[
            ['世帯数',   '約119.5万世帯'],
            ['貧困率',   '51.4%'],
            ['就業率',   '86.6%（OECD平均71.2%超）'],
            ['平均年収', '236万円'],
            ['主な課題', '養育費未払い・非正規雇用への固定'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between text-xs mb-1 gap-2">
              <span className="text-slate-500 shrink-0">{k}</span>
              <span className="font-semibold text-slate-700 text-right">{v}</span>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
          <p className="text-xs font-bold text-sky-700 mb-3">シングルファザー（日本）</p>
          {[
            ['世帯数',   '約14.9万世帯（母子の約1/8）'],
            ['貧困率',   'データ限定的（厚労省調査での対象が限定的）'],
            ['就業率',   '88.8%（厚労省令和3年度調査）'],
            ['平均年収', '496万円（母子の約2倍）'],
            ['主な課題', '感情的サポート・支援窓口不足'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between text-xs mb-1 gap-2">
              <span className="text-slate-500 shrink-0">{k}</span>
              <span className="font-semibold text-slate-700 text-right">{v}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs font-semibold text-slate-600 mb-2">ひとり親世帯の相対的貧困率・国際比較</p>
      <ChartSingleParentPoverty />
      <Src>厚生労働省「令和3年度全国ひとり親世帯等調査」、OECD Family Database 2022</Src>
    </div>
  );
  const t3Why = (
    <div>
      <ul className="space-y-3 mb-4">
        <Bullet>シングルマザーの貧困は「働いていないから」ではなく<strong>「働いても稼げない」</strong>構造。就業率は高いのに収入が低い。</Bullet>
        <Bullet><strong>非正規雇用への固定・養育費未払い・保育サービス不足</strong>が複合的に作用している。</Bullet>
        <Bullet>シングルファザーは収入面では恵まれているが、<strong>ケアの孤立と支援へのアクセス不足</strong>が課題。制度的支援の多くが母子世帯向けに設計されている。</Bullet>
      </ul>
      <Src>龍谷大学・砂脇恵准教授研究、第一生命経済研究所2023</Src>
    </div>
  );
  const t3Solution = (
    <div>
      <ul className="space-y-3 mb-4">
        <li className="flex gap-2 items-start"><Stars n={3} /><span className="text-sm text-slate-700 leading-relaxed"><strong>養育費の強制徴収制度</strong>（北欧・ドイツ型）：国が立替払いをし、国が回収する。日本では28%しか受け取れていない現状を変える。</span></li>
        <li className="flex gap-2 items-start"><Stars n={2} /><span className="text-sm text-slate-700 leading-relaxed"><strong>非正規から正規への転換支援</strong>：職業訓練・マッチング支援で安定雇用へ。</span></li>
        <li className="flex gap-2 items-start"><Stars n={2} /><span className="text-sm text-slate-700 leading-relaxed"><strong>父子世帯への相談支援の拡充</strong>：「母子世帯向け」制度の見直しと、感情的サポートへのアクセス改善。</span></li>
      </ul>
      <Src>こども家庭庁ひとり親支援資料2023</Src>
    </div>
  );

  /* Topic 4 */
  const t4Data = (
    <div>
      {!dvDataVisible ? (
        <NordicParadox onReveal={() => setDvDataVisible(true)} />
      ) : (
        <>
          <NordicParadox onReveal={() => setDvDataVisible(false)} />
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-3 text-xs text-blue-800">
            <p className="font-bold mb-1">📊 これは「DV被害を受けたことがある」と自己申告した割合を測った数字です</p>
            <p className="text-blue-600">⚠️ この数値が低い国は、被害が少ない可能性と、言えない環境がある可能性の両方があります</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-2 text-center">DV被害の種別・男女比（日本）</p>
              <ChartDVRate />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-2 text-center">📊「誰にも相談しなかった」割合（日本）</p>
              <p className="text-xs text-slate-400 mb-1 text-center">⚠️ 相談しない理由は様々（恥・恐怖・相談先を知らない等）</p>
              <ChartNoConsult />
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs text-slate-600 mb-2">
            <ul className="space-y-1">
              <li>・配偶者暴力被害経験あり：女性27.5%、男性22.0%</li>
              <li>・「何度も」被害：女性13.2%、男性7.2%</li>
              <li>・命の危険を感じた：女性15.6%、男性7.5%</li>
              <li>・性暴力被害経験：女性8.1%、男性0.7%</li>
              <li className="font-semibold text-slate-700 mt-1">・誰にも相談しなかった：男性<span className="text-blue-600">57.2%</span>、女性<span className="text-rose-600">36.3%</span></li>
            </ul>
          </div>
          <Src>内閣府「男女間における暴力に関する調査」令和5年度</Src>
          <DVInterpretation choice={dvChoice} setChoice={setDvChoice} />
        </>
      )}
    </div>
  );
  const t4Why = (
    <div>
      <ul className="space-y-3 mb-4">
        <Bullet><strong>力の不均衡・支配欲求</strong>がDVの根底にある。</Bullet>
        <Bullet>男性被害者は<strong>「男なのに被害者」という偏見</strong>から相談できない。男性の57%が相談していない。</Bullet>
        <Bullet>相談窓口の多くが女性向けに設計されており、<strong>男性被害者の経路が少ない</strong>。</Bullet>
      </ul>
      <Src>内閣府男女共同参画白書令和4年版</Src>
    </div>
  );
  const t4Solution = (
    <div>
      <ul className="space-y-3 mb-4">
        <li className="flex gap-2 items-start"><Stars n={2} /><span className="text-sm text-slate-700 leading-relaxed"><strong>男女ともにアクセスできる相談窓口の整備</strong>：ジェンダーニュートラルな設計。</span></li>
        <li className="flex gap-2 items-start"><Stars n={2} /><span className="text-sm text-slate-700 leading-relaxed"><strong>学校でのDV・暴力防止教育（関係性教育）</strong>：「健全な関係性とは何か」を早期から教える。</span></li>
        <li className="flex gap-2 items-start"><Stars n={2} /><span className="text-sm text-slate-700 leading-relaxed"><strong>加害者更生プログラムの制度化</strong>：英・加・北欧の事例あり。処罰だけでなく再発防止に直結。</span></li>
      </ul>
      <Src>内閣府配偶者暴力対策資料2025</Src>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">構造を知る</h1>
      <p className="text-slate-500 text-sm mb-8">なぜこれらの問題は繋がっているのか ― 根っこから理解するジェンダー問題</p>

      {/* Iceberg section */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-1">ジェンダー問題の氷山モデル</h2>
        <p className="text-sm text-slate-500 mb-4">各層をクリックすると詳細が展開します</p>
        <IcebergDiagram active={activeLayer} onToggle={setActiveLayer} />
      </section>

      {/* Color legend */}
      <div className="flex flex-wrap gap-3 mb-6 text-xs">
        {[
          { cls: 'bg-blue-500', label: '確定データ' },
          { cls: 'bg-slate-400 border-dashed', label: '仮説' },
          { cls: 'bg-orange-400', label: '研究中' },
          { cls: 'bg-emerald-500', label: '行動提案' },
        ].map(b => (
          <span key={b.label} className="flex items-center gap-1.5 bg-white text-slate-600 px-3 py-1.5 rounded-full border border-slate-200">
            <span className={`w-2 h-2 rounded-full ${b.cls} inline-block`} /> {b.label}
          </span>
        ))}
      </div>

      {/* Topics */}
      <TopicSection no={1} title="女性へのケア労働の偏重" color="bg-blue-600"
        tab={tab1} onTab={setTab1} data={t1Data} why={t1Why} solution={t1Solution} />
      <TopicSection no={2} title="男性のケア不足と孤立" color="bg-violet-600"
        tab={tab2} onTab={setTab2} data={t2Data} why={t2Why} solution={t2Solution} />
      <TopicSection no={3} title="ひとり親の実態（母子・父子）" color="bg-orange-500"
        tab={tab3} onTab={setTab3} data={t3Data} why={t3Why} solution={t3Solution} />
      <TopicSection no={4} title="DV・暴力（男女両方の被害）" color="bg-red-600"
        tab={tab4} onTab={setTab4} data={t4Data} why={t4Why} solution={t4Solution} />

      {/* Correlation charts */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-1">相関グラフ：GGIスコアと社会指標</h2>
        <p className="text-sm text-slate-500 mb-5">8か国データ（JP・KR・DE・FR・US・NO・IS・SE）</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-2 text-center">グラフ1：GGIスコア × 男性自殺死亡率</p>
            <ChartGGISuicide />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-2 text-center">グラフ2：GGIスコア × 無償労働の男女比（女性/男性）</p>
            <ChartGGIUnpaid />
          </div>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs text-slate-600 leading-relaxed">
          <span className="font-semibold text-slate-700">注記：</span>
          これらは<strong>相関関係</strong>を示すものです。因果関係を証明するものではありません。各国の文化・制度・統計手法の違いも影響しています。
        </div>
      </section>

      {/* References */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 mb-8">
        <h2 className="text-base font-bold text-slate-800 mb-4">参考文献</h2>
        <ul className="space-y-1.5 text-xs text-slate-500 leading-relaxed">
          {[
            'WEF Global Gender Gap Report 2025',
            'OECD生活時間国際比較調査2020',
            '内閣府「令和5年 人々のつながりに関する基礎調査」',
            '厚生労働省・警察庁「令和6年中における自殺の状況」',
            '厚生労働省「令和3年度全国ひとり親世帯等調査」',
            '内閣府「男女間における暴力に関する調査」令和5年度',
            'CEPR「The evolution of gender in the labour market」2025',
            'ODI ALIGN Report 2024',
            'UNICEF Gender Policy 2022-2025',
            'UNDP Gender Social Norms Index 2023',
            'Gracia, E. & Merlo, J.「Intimate partner violence against women and the Nordic paradox」PLOS ONE 2016',
            'Gracia, E. et al.「Prevalence of intimate partner violence against women in Sweden and Spain」PLOS ONE 2019',
            'EU基本権機関（FRA）「Violence against women: an EU-wide survey」2014',
            '田中俊之『男がつらいよ』双葉社 2015',
          ].map((ref) => (
            <li key={ref} className="flex gap-2"><span className="text-slate-300 shrink-0">—</span><span>{ref}</span></li>
          ))}
        </ul>
      </section>
    </div>
  );
}
