'use client';

import { useState } from 'react';
import { Policy } from '@/types';
import { COUNTRIES } from '@/data/countries';

const EFFECT_LABELS: Record<string, { label: string; color: string }> = {
  high:    { label: '効果：高', color: 'bg-emerald-100 text-emerald-800' },
  medium:  { label: '効果：中', color: 'bg-amber-100 text-amber-800' },
  low:     { label: '効果：低', color: 'bg-red-100 text-red-800' },
  unknown: { label: '効果：評価中', color: 'bg-slate-100 text-slate-600' },
};

const CATEGORY_COLORS: Record<string, string> = {
  育休:     'bg-blue-100 text-blue-800',
  役員:     'bg-purple-100 text-purple-800',
  賃金:     'bg-emerald-100 text-emerald-800',
  雇用:     'bg-indigo-100 text-indigo-800',
  政策:     'bg-slate-100 text-slate-700',
  社会運動: 'bg-rose-100 text-rose-800',
};

interface Props {
  policy: Policy;
}

export default function TimelineCard({ policy }: Props) {
  const [showModal, setShowModal] = useState(false);
  const effect = EFFECT_LABELS[policy.effectRating];
  const catColor = CATEGORY_COLORS[policy.category] ?? 'bg-slate-100 text-slate-700';

  return (
    <>
      <div className="flex gap-4">
        {/* 年ライン */}
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
            {policy.year}
          </div>
          <div className="w-0.5 flex-1 bg-slate-200 mt-2" />
        </div>

        {/* カード */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 flex-1 hover:shadow-md transition-shadow">
          <div className="flex flex-wrap gap-1.5 mb-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${catColor}`}>
              {policy.category}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${effect.color}`}>
              {effect.label}
            </span>
            {policy.referencedBy?.map((c) => (
              <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {COUNTRIES[c].flag} {COUNTRIES[c].name}が参考
              </span>
            ))}
          </div>

          <h3 className="font-semibold text-slate-900 mb-1">{policy.title}</h3>
          <p className="text-sm text-slate-600 leading-relaxed mb-3">{policy.description}</p>

          {/* 実施前後 */}
          {policy.impact && (
            <div className="bg-slate-50 rounded-lg p-3 mb-3 flex items-center gap-4">
              <div className="text-center">
                <p className="text-xs text-slate-500 mb-0.5">実施前</p>
                <p className="text-lg font-bold text-slate-700">
                  {policy.impact.before}{policy.impact.unit}
                </p>
              </div>
              <div className="text-slate-400 text-xl">→</div>
              <div className="text-center">
                <p className="text-xs text-slate-500 mb-0.5">実施後</p>
                <p className="text-lg font-bold text-emerald-600">
                  {policy.impact.after}{policy.impact.unit}
                </p>
              </div>
              <div className="ml-2">
                <p className="text-xs text-slate-500">{policy.impact.metric}</p>
              </div>
            </div>
          )}

          {policy.japanApplication && (
            <button
              onClick={() => setShowModal(true)}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 transition-colors"
            >
              🇯🇵 この施策を日本に適用したら？
            </button>
          )}
        </div>
      </div>

      {/* モーダル */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  🇯🇵 もし日本が「{policy.title}」を導入したら？
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-xl leading-none ml-4 shrink-0"
                >
                  ✕
                </button>
              </div>
              <div className="bg-indigo-50 rounded-xl p-4 mb-4">
                <p className="text-sm text-indigo-900 leading-relaxed">{policy.japanApplication}</p>
              </div>
              {policy.impact && (
                <div className="text-sm text-slate-600">
                  <p className="font-medium mb-1">参考：{COUNTRIES[policy.country].flag}{COUNTRIES[policy.country].name}での実績</p>
                  <p>{policy.impact.metric}：{policy.impact.before}{policy.impact.unit} → {policy.impact.after}{policy.impact.unit}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
