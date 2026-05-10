'use client';

import { useState } from 'react';
import { COUNTRIES, COUNTRY_CODES } from '@/data/countries';
import { METRICS, METRIC_CATEGORIES } from '@/data/metrics';
import { CountryCode, Metric, MetricCategory } from '@/types';
import dynamic from 'next/dynamic';
import CategoryBadge from '@/components/CategoryBadge';

const ComparisonBarChart = dynamic(() => import('@/components/ComparisonBarChart'), { ssr: false });

const CATEGORIES: MetricCategory[] = ['economy', 'careWork', 'politics', 'education', 'health', 'norms'];

export default function ComparePage() {
  const [selectedCountries, setSelectedCountries] = useState<CountryCode[]>(['JP', 'IS', 'SE', 'NO', 'DE', 'FR', 'US', 'KR']);
  const [selectedMetric, setSelectedMetric] = useState<Metric>(METRICS[0]);
  const [activeCategory, setActiveCategory] = useState<MetricCategory | 'all'>('all');

  const toggleCountry = (code: CountryCode) => {
    setSelectedCountries((prev) =>
      prev.includes(code)
        ? prev.length > 2 ? prev.filter((c) => c !== code) : prev
        : [...prev, code]
    );
  };

  const filteredMetrics =
    activeCategory === 'all' ? METRICS : METRICS.filter((m) => m.category === activeCategory);

  const formatValue = (v: number) => {
    if (selectedMetric.unit === '') return v.toFixed(3);
    if (Number.isInteger(v)) return `${v}${selectedMetric.unit}`;
    return `${v.toFixed(1)}${selectedMetric.unit}`;
  };

  const sortedCountries = [...selectedCountries].sort((a, b) =>
    selectedMetric.higherIsBetter
      ? selectedMetric.data[b] - selectedMetric.data[a]
      : selectedMetric.data[a] - selectedMetric.data[b]
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">国際比較ビュー</h1>
      <p className="text-slate-500 text-sm mb-6">指標を選び、国を絞り込んで横断比較できます。</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左パネル：指標選択 */}
        <div className="lg:col-span-1">
          {/* カテゴリフィルター */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
            <p className="text-xs font-semibold text-slate-500 mb-3">カテゴリで絞り込み</p>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setActiveCategory('all')}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'border-slate-200 text-slate-600 hover:border-slate-400'
                }`}
              >
                すべて
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    activeCategory === cat
                      ? `${METRIC_CATEGORIES[cat].bgColor} ${METRIC_CATEGORIES[cat].color} border-transparent`
                      : 'border-slate-200 text-slate-600 hover:border-slate-400'
                  }`}
                >
                  {METRIC_CATEGORIES[cat].label}
                </button>
              ))}
            </div>
          </div>

          {/* 指標リスト */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-y-auto max-h-[420px]">
              {filteredMetrics.map((metric) => (
                <button
                  key={metric.id}
                  onClick={() => setSelectedMetric(metric)}
                  className={`w-full text-left px-4 py-3 border-b border-slate-100 last:border-0 transition-colors ${
                    selectedMetric.id === metric.id
                      ? 'bg-indigo-50 border-l-2 border-l-indigo-500'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base shrink-0">{metric.icon}</span>
                    <div className="min-w-0">
                      <p className={`text-sm font-medium leading-snug ${selectedMetric.id === metric.id ? 'text-indigo-700' : 'text-slate-800'}`}>
                        {metric.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{METRIC_CATEGORIES[metric.category].label}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 右パネル：グラフと結果 */}
        <div className="lg:col-span-2 space-y-4">
          {/* 国選択チェックボックス */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs font-semibold text-slate-500 mb-3">比較する国（2カ国以上選択）</p>
            <div className="flex flex-wrap gap-2">
              {COUNTRY_CODES.map((code) => {
                const c = COUNTRIES[code];
                const isSelected = selectedCountries.includes(code);
                return (
                  <button
                    key={code}
                    onClick={() => toggleCountry(code)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm border-2 transition-all ${
                      isSelected
                        ? 'border-slate-700 bg-slate-800 text-white'
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {c.flag} {c.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* グラフ */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="mb-1 flex items-center justify-between flex-wrap gap-2">
              <h2 className="font-bold text-slate-900">{selectedMetric.name}</h2>
              <CategoryBadge category={selectedMetric.category} size="sm" />
            </div>
            <p className="text-xs text-slate-500 mb-4">{selectedMetric.description}</p>
            <ComparisonBarChart metric={selectedMetric} selectedCountries={selectedCountries} />
          </div>

          {/* 表 */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">順位</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">国</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-600">
                    {selectedMetric.name}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedCountries.map((code, i) => (
                  <tr key={code} className={`border-b border-slate-100 last:border-0 ${code === 'JP' ? 'bg-indigo-50' : ''}`}>
                    <td className="px-4 py-3 text-slate-400 font-mono">{i + 1}</td>
                    <td className="px-4 py-3">
                      {COUNTRIES[code].flag} {COUNTRIES[code].name}
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold ${code === 'JP' ? 'text-indigo-700' : 'text-slate-700'}`}>
                      {formatValue(selectedMetric.data[code])}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="px-4 py-2 text-xs text-slate-400 bg-slate-50 border-t border-slate-100">
              出典：{selectedMetric.source}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
