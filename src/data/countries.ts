import { Country, CountryCode } from '@/types';

/**
 * 国データの定義。
 * 新しい国を追加するときは CountryCode 型（types/index.ts）と
 * この COUNTRIES・COUNTRY_CODES の両方に追記してください。
 * あとは metrics.ts / trends.ts にデータを足すだけで全ページに反映されます。
 */
export const COUNTRIES: Record<CountryCode, Country> = {
  JP: { code: 'JP', name: '日本', flag: '🇯🇵', color: '#ef4444' },
  IS: { code: 'IS', name: 'アイスランド', flag: '🇮🇸', color: '#0ea5e9' },
  SE: { code: 'SE', name: 'スウェーデン', flag: '🇸🇪', color: '#f59e0b' },
  NO: { code: 'NO', name: 'ノルウェー', flag: '🇳🇴', color: '#3b82f6' },
  DE: { code: 'DE', name: 'ドイツ', flag: '🇩🇪', color: '#6b7280' },
  FR: { code: 'FR', name: 'フランス', flag: '🇫🇷', color: '#8b5cf6' },
  US: { code: 'US', name: 'アメリカ', flag: '🇺🇸', color: '#f97316' },
  KR: { code: 'KR', name: '韓国', flag: '🇰🇷', color: '#10b981' },
};

export const COUNTRY_CODES: CountryCode[] = ['JP', 'IS', 'SE', 'NO', 'DE', 'FR', 'US', 'KR'];
