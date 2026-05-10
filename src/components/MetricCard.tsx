import { Metric } from '@/types';
import { COUNTRIES, COUNTRY_CODES } from '@/data/countries';
import { CountryCode } from '@/types';

interface Props {
  metric: Metric;
  highlightCountry: CountryCode;
}

export default function MetricCard({ metric, highlightCountry }: Props) {
  const values = COUNTRY_CODES.map((c) => metric.data[c]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const currentValue = metric.data[highlightCountry];
  const worldRank = metric.worldRanks[highlightCountry];
  const total = metric.totalCountriesRanked;

  const getRatingColor = () => {
    const ratio = worldRank / total;
    if (ratio <= 0.25) return 'text-emerald-600';
    if (ratio <= 0.50) return 'text-amber-600';
    return 'text-rose-600';
  };

  const formatValue = (v: number) => {
    if (metric.unit === '') return v.toFixed(3);
    if (Number.isInteger(v)) return v.toString();
    return v.toFixed(1);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-start gap-2 min-w-0">
          <span className="text-xl leading-tight shrink-0">{metric.icon}</span>
          <p className="text-sm font-medium text-slate-800 leading-snug">{metric.name}</p>
        </div>
        <span className={`text-xs font-semibold shrink-0 ${getRatingColor()}`}>
          世界{worldRank}位 / {total}カ国中
        </span>
      </div>

      <div className="flex items-baseline gap-1 mb-3">
        <span className="text-2xl font-bold text-slate-900">{formatValue(currentValue)}</span>
        <span className="text-sm text-slate-500">{metric.unit}</span>
      </div>

      {/* 全国バー */}
      <div className="space-y-1.5">
        {COUNTRY_CODES.sort((a, b) =>
          metric.higherIsBetter
            ? metric.data[b] - metric.data[a]
            : metric.data[a] - metric.data[b]
        ).map((code) => {
          const v = metric.data[code];
          const pct = ((v - min) / range) * 100;
          const barPct = metric.higherIsBetter ? pct : 100 - pct;
          const country = COUNTRIES[code];
          const isHighlight = code === highlightCountry;

          return (
            <div key={code} className="flex items-center gap-2">
              <span className="text-xs w-20 shrink-0 truncate text-slate-600">
                {country.flag} {country.name}
              </span>
              <div className="flex-1 bg-slate-100 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.max(barPct, 2)}%`,
                    backgroundColor: isHighlight ? '#4f46e5' : country.color,
                    opacity: isHighlight ? 1 : 0.5,
                  }}
                />
              </div>
              <span className={`text-xs w-12 text-right shrink-0 ${isHighlight ? 'font-bold text-indigo-700' : 'text-slate-500'}`}>
                {formatValue(v)}{metric.unit && metric.unit !== '' ? metric.unit : ''}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-slate-400 leading-snug">{metric.source}</p>
    </div>
  );
}
