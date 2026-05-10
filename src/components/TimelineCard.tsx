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
  lineColor: string;
  dotColor: string;
}

export default function TimelineCard({ policy, lineColor, dotColor }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const effect = EFFECT_LABELS[policy.effectRating];
  const catColor = CATEGORY_COLORS[policy.category] ?? 'bg-slate-100 text-slate-700';

  return (
    <>
      <div className="flex gap-4 group">
        {/* 年ライン */}
        <div className="flex flex-col items-center shrink-0">
          <div
            className="w-12 h-12 rounded-full text-white text-xs font-bold flex flex-col items-center justify-center shadow-sm"
            style={{ backgroundColor: dotColor }}
          >
            <span className="text-[10px] leading-none opacity-80">年</span>
            <span className="text-sm leading-tight">{policy.year}</span>
          </div>
          <div className="w-0.5 flex-1 mt-2" style={{ backgroundColor: lineColor, opacity: 0.3 }} />
        </div>

        {/* カード本体 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 flex-1 transition-shadow hover:shadow-md">
          {/* ヘッダー（常時表示） */}
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

          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-slate-900 leading-snug">{policy.title}</h3>
            <button
              onClick={() => setExpanded(!expanded)}
              className="shrink-0 text-xs text-slate-400 hover:text-indigo-600 flex items-center gap-0.5 transition-colors mt-0.5"
              aria-label={expanded ? '閉じる' : '詳細を見る'}
            >
              {expanded ? '▲ 閉じる' : '▼ 詳細'}
            </button>
          </div>

          {/* サマリー（折りたたみ時） */}
          {!expanded && (
            <p className="text-sm text-slate-500 mt-1 leading-relaxed line-clamp-2">
              {policy.background ?? policy.description}
            </p>
          )}

          {/* 展開コンテンツ */}
          {expanded && (
            <div className="mt-3 space-y-3">
              {/* 背景 */}
              {policy.background && (
                <DetailSection
                  label="背景"
                  icon="📌"
                  color="amber"
                  text={policy.background}
                />
              )}

              {/* 内容 */}
              <DetailSection
                label="内容"
                icon="📋"
                color="blue"
                text={policy.description}
              />

              {/* 成果 */}
              {policy.impact && (
                <div>
                  <SectionLabel icon="📈" label="成果" color="emerald" />
                  <div className="bg-emerald-50 rounded-lg p-3 flex items-center gap-4 mt-1">
                    <div className="text-center">
                      <p className="text-xs text-slate-500 mb-0.5">実施前</p>
                      <p className="text-lg font-bold text-slate-700">
                        {policy.impact.before}{policy.impact.unit}
                      </p>
                    </div>
                    <div className="text-slate-400 text-xl flex-1 text-center">→</div>
                    <div className="text-center">
                      <p className="text-xs text-slate-500 mb-0.5">実施後</p>
                      <p className="text-lg font-bold text-emerald-600">
                        {policy.impact.after}{policy.impact.unit}
                      </p>
                    </div>
                    <div className="ml-1">
                      <p className="text-xs text-slate-500 leading-snug">{policy.impact.metric}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 限界・課題 */}
              {policy.limitation && (
                <DetailSection
                  label="限界・課題"
                  icon="⚠️"
                  color="rose"
                  text={policy.limitation}
                />
              )}

              {/* 次への布石 */}
              {policy.nextStep && (
                <DetailSection
                  label="次への布石"
                  icon="🔗"
                  color="purple"
                  text={policy.nextStep}
                />
              )}

              {/* 日本適用ボタン */}
              {policy.japanApplication && (
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-center gap-1.5 py-2 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors mt-1"
                >
                  🇯🇵 この施策を日本に適用したら？
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 日本適用モーダル */}
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
                  <p className="font-medium mb-1">
                    参考：{COUNTRIES[policy.country].flag}{COUNTRIES[policy.country].name}での実績
                  </p>
                  <p>
                    {policy.impact.metric}：{policy.impact.before}{policy.impact.unit} → {policy.impact.after}{policy.impact.unit}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SectionLabel({ icon, label, color }: { icon: string; label: string; color: string }) {
  const colorMap: Record<string, string> = {
    amber:   'text-amber-700',
    blue:    'text-blue-700',
    emerald: 'text-emerald-700',
    rose:    'text-rose-700',
    purple:  'text-purple-700',
  };
  return (
    <p className={`text-xs font-bold mb-1 flex items-center gap-1 ${colorMap[color] ?? 'text-slate-600'}`}>
      <span>{icon}</span>{label}
    </p>
  );
}

function DetailSection({
  label, icon, color, text,
}: {
  label: string; icon: string; color: string; text: string;
}) {
  const bgMap: Record<string, string> = {
    amber:   'bg-amber-50',
    blue:    'bg-blue-50',
    emerald: 'bg-emerald-50',
    rose:    'bg-rose-50',
    purple:  'bg-purple-50',
  };
  const textMap: Record<string, string> = {
    amber:   'text-amber-900',
    blue:    'text-blue-900',
    emerald: 'text-emerald-900',
    rose:    'text-rose-900',
    purple:  'text-purple-900',
  };
  return (
    <div>
      <SectionLabel icon={icon} label={label} color={color} />
      <div className={`${bgMap[color] ?? 'bg-slate-50'} rounded-lg p-3`}>
        <p className={`text-sm leading-relaxed ${textMap[color] ?? 'text-slate-800'}`}>{text}</p>
      </div>
    </div>
  );
}
