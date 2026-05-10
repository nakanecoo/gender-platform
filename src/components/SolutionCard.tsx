import { Solution } from '@/types';
import { COUNTRIES } from '@/data/countries';
import { METRICS } from '@/data/metrics';
import CategoryBadge from './CategoryBadge';

const EFFECT_CONFIG: Record<string, { label: string; color: string }> = {
  high:    { label: '効果：高', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  medium:  { label: '効果：中', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  low:     { label: '効果：低', color: 'bg-red-100 text-red-800 border-red-200' },
  unknown: { label: '効果：評価中', color: 'bg-slate-100 text-slate-600 border-slate-200' },
};

interface Props {
  solution: Solution;
}

export default function SolutionCard({ solution }: Props) {
  const effect = EFFECT_CONFIG[solution.effectSize];

  const relatedMetrics = solution.targetMetrics
    .map((id) => METRICS.find((m) => m.id === id))
    .filter(Boolean);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg transition-shadow flex flex-col gap-4">
      {/* ヘッダー */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <CategoryBadge category={solution.category} />
          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${effect.color}`}>
            {effect.label}
          </span>
        </div>
        <h3 className="font-bold text-slate-900 text-base">{solution.title}</h3>
      </div>

      {/* 説明 */}
      <p className="text-sm text-slate-600 leading-relaxed">{solution.description}</p>

      {/* エビデンス */}
      <div className="bg-blue-50 rounded-lg p-3">
        <p className="text-xs font-semibold text-blue-800 mb-1">📊 エビデンス</p>
        <p className="text-xs text-blue-900 leading-relaxed">{solution.evidence}</p>
      </div>

      {/* メカニズム */}
      <div className="bg-slate-50 rounded-lg p-3">
        <p className="text-xs font-semibold text-slate-700 mb-1">⚙️ なぜ効くのか</p>
        <p className="text-xs text-slate-600 leading-relaxed">{solution.mechanism}</p>
      </div>

      {/* 参考国 */}
      <div>
        <p className="text-xs font-semibold text-slate-500 mb-1.5">実施している国</p>
        <div className="flex flex-wrap gap-1.5">
          {solution.exampleCountries.map((code) => (
            <span key={code} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-lg">
              {COUNTRIES[code].flag} {COUNTRIES[code].name}
            </span>
          ))}
        </div>
      </div>

      {/* 関連指標 */}
      {relatedMetrics.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 mb-1.5">改善が期待できる指標</p>
          <div className="flex flex-wrap gap-1.5">
            {relatedMetrics.map((m) => m && (
              <span key={m.id} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg">
                {m.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
