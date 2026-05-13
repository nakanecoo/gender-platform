'use client';

import Link from 'next/link';

const SECTIONS = [
  {
    href: '/timeline',
    icon: '🗓️',
    title: '政策タイムライン',
    desc: 'アイスランド・スウェーデン・ノルウェーなど先進国が導入した政策を時系列で追跡。何がどのタイミングで変わったかを確認できます。',
    color: 'border-violet-200 hover:border-violet-400 bg-violet-50',
    badge: '国別・時系列',
  },
  {
    href: '/solutions',
    icon: '💡',
    title: '解決策ライブラリ',
    desc: 'エビデンスの強さ別・カテゴリ別に政策を整理。効果が実証された施策と、まだ研究段階のものを区別して表示。',
    color: 'border-emerald-200 hover:border-emerald-400 bg-emerald-50',
    badge: 'エビデンス付き',
  },
];

const HIGHLIGHTS = [
  {
    country: '🇮🇸 アイスランド',
    policy: '同一賃金認証制度',
    year: 2018,
    result: '男女賃金格差を2030年までに解消する法的義務を企業に課す。世界初の制度。',
    impact: 'GGI 1位を維持・男女賃金格差が継続縮小',
    stars: 3,
  },
  {
    country: '🇮🇸 アイスランド',
    policy: '父親クォータ制（育休パパ枠）',
    year: 2000,
    result: '育休を父親・母親・共有の3分割。父親枠を使わないと消失する設計。',
    impact: '父親育休取得率が世界最高水準（約90%）へ',
    stars: 3,
  },
  {
    country: '🇩🇪 ドイツ',
    policy: '養育費立替・強制徴収制度',
    year: 2017,
    result: '国が養育費を立替払いし、国が未払い親から回収。ひとり親の生活保障に直結。',
    impact: 'ひとり親貧困率が日本の51%に対しドイツは約20%',
    stars: 3,
  },
  {
    country: '🇫🇷 フランス',
    policy: '公的保育の拡充（エコール・マテルネル）',
    year: 1970,
    result: '3歳以上の就学前保育を無償化。女性の就業継続を制度で支える。',
    impact: '女性就業率80%超・出生率1.8（OECD上位）',
    stars: 3,
  },
  {
    country: '🇯🇵 日本',
    policy: '育児休業取得率の公開義務化',
    year: 2023,
    result: '従業員1000人超の企業に男女別育休取得率の公開を義務付け。',
    impact: '施行直後から大企業の取得率が上昇傾向',
    stars: 2,
  },
];

function Stars({ n }: { n: number }) {
  return (
    <span className="text-amber-400 text-sm">
      {'★'.repeat(n)}{'☆'.repeat(3 - n)}
    </span>
  );
}

export default function PoliciesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">施策と成果</h1>
      <p className="text-slate-500 text-sm mb-8 leading-relaxed">
        各国が実施した政策とその効果をエビデンスとともに整理。何が変化をもたらしたかを確認できます。
      </p>

      {/* Section cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
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

      {/* Evidence legend */}
      <div className="flex items-center gap-4 mb-6 text-xs text-slate-500">
        <span className="font-semibold text-slate-700">エビデンスの強さ：</span>
        <span><span className="text-amber-400">★★★</span> 大規模研究・因果関係確認済み</span>
        <span><span className="text-amber-400">★★☆</span> 複数研究で効果確認</span>
        <span><span className="text-amber-400">★☆☆</span> 単一研究・観察段階</span>
      </div>

      {/* Highlights */}
      <h2 className="text-lg font-bold text-slate-800 mb-4">注目の施策</h2>
      <div className="space-y-4">
        {HIGHLIGHTS.map((h) => (
          <div key={h.policy} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
              <div>
                <span className="text-xs text-slate-400">{h.country}　{h.year}年</span>
                <h3 className="font-bold text-slate-900">{h.policy}</h3>
              </div>
              <Stars n={h.stars} />
            </div>
            <p className="text-sm text-slate-600 mb-2 leading-relaxed">{h.result}</p>
            <div className="bg-emerald-50 rounded-lg px-3 py-2 border border-emerald-100">
              <span className="text-xs font-semibold text-emerald-700">効果：</span>
              <span className="text-xs text-emerald-800">{h.impact}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
