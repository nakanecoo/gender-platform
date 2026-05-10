'use client';

import { useState } from 'react';
import { COUNTRIES, COUNTRY_CODES } from '@/data/countries';
import { getPoliciesByCountry } from '@/data/policies';
import { CountryCode } from '@/types';
import TimelineCard from '@/components/TimelineCard';

const CATEGORY_FILTERS = ['すべて', '育休', '役員', '賃金', '雇用', '政策', '社会運動'];

export default function TimelinePage() {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('JP');
  const [categoryFilter, setCategoryFilter] = useState('すべて');

  const policies = getPoliciesByCountry(selectedCountry);
  const filtered =
    categoryFilter === 'すべて' ? policies : policies.filter((p) => p.category === categoryFilter);

  const country = COUNTRIES[selectedCountry];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">政策タイムライン</h1>
      <p className="text-slate-500 text-sm mb-6">
        各国が取ってきた施策の歴史を時系列で確認できます。
        「🇯🇵 この施策を日本に適用したら？」ボタンで日本への示唆を確認できます。
      </p>

      {/* 国選択 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {COUNTRY_CODES.map((code) => {
          const c = COUNTRIES[code];
          const count = getPoliciesByCountry(code).length;
          return (
            <button
              key={code}
              onClick={() => setSelectedCountry(code)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                selectedCountry === code
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              {c.flag} {c.name}
              <span className={`text-xs rounded-full px-1.5 py-0.5 ${selectedCountry === code ? 'bg-indigo-200 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* カテゴリフィルター */}
      <div className="flex flex-wrap gap-1.5 mb-8">
        {CATEGORY_FILTERS.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              categoryFilter === cat
                ? 'bg-slate-800 text-white border-slate-800'
                : 'border-slate-200 text-slate-600 hover:border-slate-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* タイムライン */}
      <div className="mb-4 flex items-center gap-3">
        <span className="text-2xl">{country.flag}</span>
        <h2 className="text-lg font-bold text-slate-800">{country.name}の政策タイムライン</h2>
        <span className="text-sm text-slate-400">{filtered.length}件</span>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <p>該当する施策がありません</p>
        </div>
      ) : (
        <div>
          {filtered.map((policy) => (
            <TimelineCard key={policy.id} policy={policy} />
          ))}
        </div>
      )}
    </div>
  );
}
