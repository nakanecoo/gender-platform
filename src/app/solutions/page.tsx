'use client';

import { useState } from 'react';
import { SOLUTIONS } from '@/data/solutions';
import { METRIC_CATEGORIES } from '@/data/metrics';
import { MetricCategory } from '@/types';
import SolutionCard from '@/components/SolutionCard';

const CATEGORIES: MetricCategory[] = ['economy', 'careWork', 'politics', 'education', 'health', 'norms'];
const EFFECT_FILTERS = ['すべて', '高', '中', '低'];

const EFFECT_LABEL_MAP: Record<string, string> = {
  high: '高', medium: '中', low: '低', unknown: '評価中',
};

export default function SolutionsPage() {
  const [categoryFilter, setCategoryFilter] = useState<MetricCategory | 'all'>('all');
  const [effectFilter, setEffectFilter] = useState('すべて');

  const filtered = SOLUTIONS.filter((s) => {
    const catOk = categoryFilter === 'all' || s.category === categoryFilter;
    const effOk =
      effectFilter === 'すべて' || EFFECT_LABEL_MAP[s.effectSize] === effectFilter;
    return catOk && effOk;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">解決策ライブラリ</h1>
      <p className="text-slate-500 text-sm mb-6">
        各指標の改善に有効とされる政策をエビデンスとともに整理しています。
      </p>

      {/* フィルター */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 space-y-3">
        <div>
          <p className="text-xs font-semibold text-slate-500 mb-2">カテゴリ</p>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                categoryFilter === 'all'
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'border-slate-200 text-slate-600 hover:border-slate-400'
              }`}
            >
              すべて
            </button>
            {CATEGORIES.map((cat) => {
              const info = METRIC_CATEGORIES[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    categoryFilter === cat
                      ? `${info.bgColor} ${info.color} border-transparent`
                      : 'border-slate-200 text-slate-600 hover:border-slate-400'
                  }`}
                >
                  {info.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-500 mb-2">効果の大きさ</p>
          <div className="flex flex-wrap gap-1.5">
            {EFFECT_FILTERS.map((ef) => (
              <button
                key={ef}
                onClick={() => setEffectFilter(ef)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  effectFilter === ef
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'border-slate-200 text-slate-600 hover:border-slate-400'
                }`}
              >
                {ef === 'すべて' ? 'すべて' : `効果：${ef}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 件数 */}
      <p className="text-sm text-slate-500 mb-4">{filtered.length}件の解決策</p>

      {/* カード一覧 */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <p>該当する解決策がありません</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {filtered.map((solution) => (
            <SolutionCard key={solution.id} solution={solution} />
          ))}
        </div>
      )}
    </div>
  );
}
