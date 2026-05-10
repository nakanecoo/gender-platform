'use client';

import { useState } from 'react';
import { COUNTRIES, COUNTRY_CODES } from '@/data/countries';
import { METRICS, METRIC_CATEGORIES, getMetricsByCategory } from '@/data/metrics';
import { CountryCode, MetricCategory } from '@/types';
import MetricCard from '@/components/MetricCard';
import CategoryBadge from '@/components/CategoryBadge';

const CATEGORIES: MetricCategory[] = ['economy', 'careWork', 'politics', 'education', 'health', 'norms'];

export default function DashboardPage() {
  const [selected, setSelected] = useState<CountryCode>('JP');

  const country = COUNTRIES[selected];
  const ggi = METRICS.find((m) => m.id === 'ggi_score');
  const ggiValue = ggi ? ggi.data[selected].toFixed(3) : '-';
  const ggiRank = ggi
    ? [...COUNTRY_CODES].sort((a, b) => ggi.data[b] - ggi.data[a]).indexOf(selected) + 1
    : '-';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">国別ダッシュボード</h1>
      <p className="text-slate-500 text-sm mb-6">国を選択すると、その国の全指標を一覧表示します。</p>

      {/* 国選択 */}
      <div className="flex flex-wrap gap-2 mb-8">
        {COUNTRY_CODES.map((code) => {
          const c = COUNTRIES[code];
          return (
            <button
              key={code}
              onClick={() => setSelected(code)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                selected === code
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              <span>{c.flag}</span>
              <span>{c.name}</span>
            </button>
          );
        })}
      </div>

      {/* サマリーヘッダー */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-8 flex items-center gap-4 shadow-sm">
        <div className="text-4xl">{country.flag}</div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">{country.name}</h2>
          <p className="text-sm text-slate-500">
            WEF ジェンダーギャップ指数：
            <span className="font-semibold text-slate-700"> {ggiValue}</span>
            　8カ国中
            <span className="font-semibold text-slate-700"> {ggiRank}位</span>
          </p>
        </div>
      </div>

      {/* カテゴリ別 */}
      {CATEGORIES.map((cat) => {
        const metrics = getMetricsByCategory(cat);
        const catInfo = METRIC_CATEGORIES[cat];
        return (
          <section key={cat} className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <CategoryBadge category={cat} />
              <span className="text-slate-400 text-sm">（{metrics.length}指標）</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {metrics.map((metric) => (
                <MetricCard key={metric.id} metric={metric} highlightCountry={selected} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
