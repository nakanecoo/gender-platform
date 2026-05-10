'use client';

import { useState } from 'react';
import { TREND_METRICS } from '@/data/trends';
import { COUNTRIES, COUNTRY_CODES } from '@/data/countries';
import { CountryCode } from '@/types';
import dynamic from 'next/dynamic';

const TrendLineChart = dynamic(() => import('@/components/TrendLineChart'), { ssr: false });

export default function TrendsPage() {
  const [selectedMetricId, setSelectedMetricId] = useState(TREND_METRICS[0].id);
  // デフォルト：日本・アイスランド・スウェーデンの3カ国
  const [selectedCountries, setSelectedCountries] = useState<CountryCode[]>(['JP', 'IS', 'SE']);

  const metric = TREND_METRICS.find((m) => m.id === selectedMetricId) ?? TREND_METRICS[0];

  const toggleCountry = (code: CountryCode) => {
    setSelectedCountries((prev) =>
      prev.includes(code)
        ? prev.length > 2 ? prev.filter((c) => c !== code) : prev
        : [...prev, code]
    );
  };

  const years = metric.data['JP'];
  const latestYear = years[years.length - 1].year;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">トレンドグラフ</h1>
      <p className="text-slate-500 text-sm mb-6">
        2015〜2024年の主要指標の推移。
        <span className="text-indigo-600 font-medium">日本の赤い線</span>が最も目立つように表示されます。
      </p>

      {/* 指標選択 */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
        <p className="text-xs font-semibold text-slate-500 mb-3">指標を選択</p>
        <div className="flex flex-wrap gap-2">
          {TREND_METRICS.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMetricId(m.id)}
              className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                selectedMetricId === m.id
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>

      {/* 国選択 */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-slate-500">比較する国を選択（2カ国以上）</p>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-500">
            {selectedCountries.length}カ国選択中
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {COUNTRY_CODES.map((code) => {
            const c = COUNTRIES[code];
            const isSelected = selectedCountries.includes(code);
            return (
              <button
                key={code}
                onClick={() => toggleCountry(code)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border-2 transition-all ${
                  isSelected
                    ? code === 'JP'
                      ? 'border-red-500 bg-red-500 text-white'
                      : 'border-slate-700 bg-slate-800 text-white'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{
                    backgroundColor: isSelected ? COUNTRIES[code].color : '#e2e8f0',
                  }}
                />
                {c.flag} {c.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* グラフ */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <div className="flex items-start justify-between mb-1 flex-wrap gap-2">
          <h2 className="font-bold text-slate-900">{metric.name}</h2>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${metric.higherIsBetter ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
            {metric.higherIsBetter ? '↑ 高いほど平等' : '↓ 低いほど格差が小さい'}
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-4">単位：{metric.unit || 'スコア（0〜1）'}　Y軸はデータ範囲に合わせてズームしています</p>
        <TrendLineChart trendMetric={metric} selectedCountries={selectedCountries} />
      </div>

      {/* 変化テーブル */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700">2015年 → {latestYear}年 の変化</h3>
          <p className="text-xs text-slate-400">
            {metric.higherIsBetter
              ? '↑緑＝改善（値が増加）　↓赤＝悪化（値が減少）'
              : '↓緑＝改善（格差が縮小）　↑赤＝悪化（格差が拡大）'}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-4 py-3 font-semibold text-slate-500">国</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-500">2015年</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-500">{latestYear}年</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-500">変化</th>
              </tr>
            </thead>
            <tbody>
              {[...selectedCountries]
                .sort((a, b) => {
                  const aLast = metric.data[a][metric.data[a].length - 1].value;
                  const bLast = metric.data[b][metric.data[b].length - 1].value;
                  return metric.higherIsBetter ? bLast - aLast : aLast - bLast;
                })
                .map((code) => {
                  const data = metric.data[code];
                  const first = data[0].value;
                  const last = data[data.length - 1].value;
                  const change = last - first;
                  const isGood = metric.higherIsBetter ? change >= 0 : change <= 0;
                  const arrow = change >= 0 ? '↑' : '↓';

                  const fmt = (v: number) =>
                    metric.unit === ''
                      ? v.toFixed(3)
                      : `${v.toFixed(1)}${metric.unit}`;

                  const fmtChange = (v: number) => {
                    const abs = metric.unit === ''
                      ? Math.abs(v).toFixed(3)
                      : `${Math.abs(v).toFixed(1)}${metric.unit}`;
                    return abs;
                  };

                  return (
                    <tr
                      key={code}
                      className={`border-b border-slate-50 last:border-0 ${
                        code === 'JP' ? 'bg-red-50' : ''
                      }`}
                    >
                      <td className="px-4 py-3 font-medium">
                        <span
                          className="inline-block w-2.5 h-2.5 rounded-full mr-2 align-middle"
                          style={{ backgroundColor: COUNTRIES[code].color }}
                        />
                        {COUNTRIES[code].flag} {COUNTRIES[code].name}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-500">{fmt(first)}</td>
                      <td
                        className={`px-4 py-3 text-right font-semibold ${
                          code === 'JP' ? 'text-red-600' : 'text-slate-700'
                        }`}
                      >
                        {fmt(last)}
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-bold text-base ${
                          isGood ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {arrow} {fmtChange(change)}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
