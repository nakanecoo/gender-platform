'use client';

import Link from 'next/link';

const SECTIONS = [
  {
    href: '/dashboard',
    icon: '🌍',
    title: '国別ダッシュボード',
    desc: '国を選択して全26指標を一覧表示。日本の現在地を多面的に確認できます。',
    color: 'border-indigo-200 hover:border-indigo-400 bg-indigo-50',
    badge: '国選択式',
  },
  {
    href: '/compare',
    icon: '📊',
    title: '国際比較ビュー',
    desc: '指標を選んで8か国を横断比較。どの国がどの指標で上位／下位かを視覚的に確認。',
    color: 'border-sky-200 hover:border-sky-400 bg-sky-50',
    badge: '指標選択式',
  },
  {
    href: '/trends',
    icon: '📈',
    title: 'トレンド分析',
    desc: '過去10〜30年の時系列データで、各国の変化の速度と方向性を確認。',
    color: 'border-emerald-200 hover:border-emerald-400 bg-emerald-50',
    badge: '時系列',
  },
];

const KEY_STATS = [
  { label: 'GGIランキング（日本）', value: '118位', sub: '146か国中（WEF 2024）', color: 'text-rose-600' },
  { label: '女性管理職比率（日本）', value: '13.2%', sub: '北欧平均40%超', color: 'text-amber-600' },
  { label: '男性育休取得率（日本）', value: '17.1%', sub: '目標30%（2025年）', color: 'text-blue-600' },
  { label: '男女賃金格差（日本）', value: '21.3%', sub: '女性の賃金は男性の約79%', color: 'text-purple-600' },
];

export default function DataPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">データで見る</h1>
      <p className="text-slate-500 text-sm mb-8 leading-relaxed">
        WEF・OECD・ILOなど国際機関のデータをもとに、日本と世界のジェンダーギャップを数値で確認します。
      </p>

      {/* Key stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {KEY_STATS.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <p className="text-xs text-slate-500 mb-1 leading-tight">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Section cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className={`block rounded-2xl border-2 p-6 transition-all ${s.color} hover:shadow-md`}
          >
            <div className="text-3xl mb-3">{s.icon}</div>
            <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 mb-2">
              {s.badge}
            </span>
            <h2 className="font-bold text-slate-900 mb-2">{s.title}</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
            <p className="text-xs text-indigo-500 mt-3 font-medium">詳細を見る →</p>
          </Link>
        ))}
      </div>

      {/* Data note */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 text-sm text-slate-600 leading-relaxed">
        <p className="font-semibold text-slate-700 mb-2">📋 データについて</p>
        <ul className="space-y-1 text-xs">
          <li>・すべてのデータは WEF・OECD・ILO・UNESCO・UN Women・WHO などの公開データに基づきます</li>
          <li>・掲載値は公表値をもとにした概算値を含む場合があります。最新情報は各機関の公式サイトをご確認ください</li>
          <li>・比較対象は JP（日本）・IS（アイスランド）・SE（スウェーデン）・NO（ノルウェー）・DE（ドイツ）・FR（フランス）・US（アメリカ）・KR（韓国）の8か国です</li>
        </ul>
      </div>
    </div>
  );
}
