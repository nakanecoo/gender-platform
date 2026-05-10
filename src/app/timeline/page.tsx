'use client';

import { useState } from 'react';
import { COUNTRIES, COUNTRY_CODES } from '@/data/countries';
import { getPoliciesByCountry, PHASES_BY_COUNTRY } from '@/data/policies';
import { CountryCode } from '@/types';
import TimelineCard from '@/components/TimelineCard';

const PHASE_STYLES: Record<string, {
  band: string;
  text: string;
  subText: string;
  dot: string;
  line: string;
  bg: string;
  border: string;
  icon: string;
}> = {
  '問題提起期':    { band: 'bg-amber-500',   text: 'text-white', subText: 'text-amber-100', dot: '#d97706', line: '#d97706', bg: 'bg-amber-50',   border: 'border-amber-200',   icon: '💬' },
  '法整備期':      { band: 'bg-blue-500',    text: 'text-white', subText: 'text-blue-100',  dot: '#3b82f6', line: '#3b82f6', bg: 'bg-blue-50',    border: 'border-blue-200',    icon: '📜' },
  '制度設計期':    { band: 'bg-blue-500',    text: 'text-white', subText: 'text-blue-100',  dot: '#3b82f6', line: '#3b82f6', bg: 'bg-blue-50',    border: 'border-blue-200',    icon: '🔧' },
  'クォータ導入期':{ band: 'bg-indigo-500',  text: 'text-white', subText: 'text-indigo-100',dot: '#6366f1', line: '#6366f1', bg: 'bg-indigo-50',  border: 'border-indigo-200',  icon: '⚡' },
  '数値目標期':    { band: 'bg-purple-500',  text: 'text-white', subText: 'text-purple-100',dot: '#8b5cf6', line: '#8b5cf6', bg: 'bg-purple-50',  border: 'border-purple-200',  icon: '🎯' },
  '開示・透明化期':{ band: 'bg-emerald-500', text: 'text-white', subText: 'text-emerald-100',dot: '#10b981',line: '#10b981', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: '🔍' },
  '開示・義務化期':{ band: 'bg-emerald-500', text: 'text-white', subText: 'text-emerald-100',dot: '#10b981',line: '#10b981', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: '✅' },
  '定着・強化期':  { band: 'bg-teal-500',   text: 'text-white', subText: 'text-teal-100',  dot: '#14b8a6', line: '#14b8a6', bg: 'bg-teal-50',    border: 'border-teal-200',    icon: '🌱' },
};

const DEFAULT_STYLE = PHASE_STYLES['法整備期'];

export default function TimelinePage() {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('JP');
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);

  const policies = getPoliciesByCountry(selectedCountry);
  const phases = PHASES_BY_COUNTRY[selectedCountry] ?? [];
  const country = COUNTRIES[selectedCountry];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">政策タイムライン</h1>
      <p className="text-slate-500 text-sm mb-6">
        各国の政策の歴史を「時代フェーズ」ごとに整理。フェーズ帯をクリックすると時代背景、各カードをクリックすると詳細が開きます。
      </p>

      {/* 国選択 */}
      <div className="flex flex-wrap gap-2 mb-8">
        {COUNTRY_CODES.map((code) => {
          const c = COUNTRIES[code];
          const count = getPoliciesByCountry(code).length;
          return (
            <button
              key={code}
              onClick={() => { setSelectedCountry(code); setExpandedPhase(null); }}
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

      {/* タイムライン見出し */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">{country.flag}</span>
        <h2 className="text-lg font-bold text-slate-800">{country.name}の政策タイムライン</h2>
      </div>

      {phases.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-4xl mb-3">📭</p>
          <p>このページにはまだ政策データがありません</p>
        </div>
      ) : (
        <div>
          {phases.map((phase) => {
            const phasePolicies = policies.filter((p) => p.phase === phase.id);
            const style = PHASE_STYLES[phase.id] ?? DEFAULT_STYLE;
            const isExpanded = expandedPhase === phase.id;

            return (
              <div key={phase.id} className="mb-2">
                {/* フェーズ帯ヘッダー */}
                <button
                  onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                  className={`w-full text-left ${style.band} rounded-xl px-5 py-3 mb-4 transition-opacity hover:opacity-90`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{style.icon}</span>
                      <div>
                        <span className={`font-bold text-base ${style.text}`}>{phase.label}</span>
                        <span className={`ml-3 text-sm ${style.subText}`}>{phase.yearRange}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs ${style.subText}`}>
                        {phasePolicies.length}件の政策
                      </span>
                      <span className={`text-sm ${style.subText}`}>
                        {isExpanded ? '▲ 時代背景を閉じる' : '▼ 時代背景を読む'}
                      </span>
                    </div>
                  </div>
                </button>

                {/* 時代背景（展開） */}
                {isExpanded && (
                  <div className={`${style.bg} ${style.border} border rounded-xl p-4 mb-4 -mt-2`}>
                    <p className="text-sm text-slate-700 leading-relaxed">{phase.description}</p>
                  </div>
                )}

                {/* そのフェーズの政策一覧 */}
                {phasePolicies.length > 0 ? (
                  <div className="pl-2">
                    {phasePolicies.map((policy) => (
                      <TimelineCard
                        key={policy.id}
                        policy={policy}
                        lineColor={style.line}
                        dotColor={style.dot}
                      />
                    ))}
                  </div>
                ) : (
                  <div className={`${style.bg} rounded-xl p-4 mb-4 text-sm text-slate-500 text-center`}>
                    このフェーズの政策データは準備中です
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
