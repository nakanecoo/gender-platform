/**
 * 対応国コード。新しい国を追加する手順：
 *  1. ここに国コードを追加する（例: | 'GB'）
 *  2. src/data/countries.ts の COUNTRIES と COUNTRY_CODES に追加
 *  3. src/data/metrics.ts の全指標 data フィールドに値を追加
 *     （TypeScript が未設定箇所をコンパイルエラーで教えてくれます）
 *  4. src/data/trends.ts の各トレンド指標に追加
 *  5. 任意で src/data/policies.ts に施策を追加
 */
export type CountryCode = 'JP' | 'IS' | 'SE' | 'NO' | 'DE' | 'FR' | 'US' | 'KR';

export type MetricCategory =
  | 'economy'
  | 'careWork'
  | 'politics'
  | 'education'
  | 'health'
  | 'norms';

export type EffectRating = 'high' | 'medium' | 'low' | 'unknown';

export interface Country {
  code: CountryCode;
  name: string;
  flag: string;
  color: string;
}

export interface Metric {
  id: string;
  name: string;
  icon: string;
  category: MetricCategory;
  unit: string;
  description: string;
  higherIsBetter: boolean;
  source: string;
  data: Record<CountryCode, number>;
  worldRanks: Record<CountryCode, number>;
  totalCountriesRanked: number;
}

export interface TrendPoint {
  year: number;
  value: number;
}

export interface TrendMetric {
  id: string;
  name: string;
  unit: string;
  higherIsBetter: boolean;
  data: Record<CountryCode, TrendPoint[]>;
}

export interface BeforeAfterValue {
  metric: string;
  before: number;
  after: number;
  unit: string;
}

export interface PhaseConfig {
  id: string;
  label: string;
  yearRange: string;
  description: string;
}

export interface Policy {
  id: string;
  country: CountryCode;
  year: number;
  title: string;
  description: string;
  category: string;
  phase: string;
  background?: string;
  limitation?: string;
  nextStep?: string;
  impact?: BeforeAfterValue;
  effectRating: EffectRating;
  referencedBy?: CountryCode[];
  japanApplication?: string;
}

export interface Solution {
  id: string;
  title: string;
  category: MetricCategory;
  description: string;
  evidence: string;
  mechanism: string;
  exampleCountries: CountryCode[];
  effectSize: EffectRating;
  targetMetrics: string[];
}
