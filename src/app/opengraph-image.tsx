import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'ジェンダーデータ・プラットフォーム';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const STATS = [
  { value: '26', label: 'Metrics' },
  { value: '8',  label: 'Countries' },
  { value: '6',  label: 'Categories' },
];

const COUNTRY_LABELS = [
  { code: 'JP', color: '#ef4444' },
  { code: 'IS', color: '#0ea5e9' },
  { code: 'SE', color: '#f59e0b' },
  { code: 'NO', color: '#3b82f6' },
  { code: 'DE', color: '#6b7280' },
  { code: 'FR', color: '#8b5cf6' },
  { code: 'US', color: '#f97316' },
  { code: 'KR', color: '#10b981' },
];

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #3730a3 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '56px 72px',
          justifyContent: 'space-between',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top: source badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              background: 'rgba(255,255,255,0.12)',
              color: '#c7d2fe',
              fontSize: 17,
              padding: '7px 18px',
              borderRadius: 100,
              letterSpacing: '0.06em',
            }}
          >
            WEF · OECD · ILO · UN Women · IPU
          </div>
        </div>

        {/* Center: main title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ color: '#a5b4fc', fontSize: 22, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Gender Gap Data Platform
          </div>
          <div style={{ color: 'white', fontSize: 60, fontWeight: 800, lineHeight: 1.15 }}>
            ジェンダーギャップを<br />データで理解する
          </div>
          <div style={{ color: '#93c5fd', fontSize: 24 }}>
            日本・北欧・欧米 8カ国の国際比較プラットフォーム
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 24, marginTop: 8 }}>
            {STATS.map((s) => (
              <div
                key={s.label}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 14,
                  padding: '14px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <span style={{ color: 'white', fontSize: 36, fontWeight: 700 }}>{s.value}</span>
                <span style={{ color: '#a5b4fc', fontSize: 15 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: country pills */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 10 }}>
            {COUNTRY_LABELS.map((c) => (
              <div
                key={c.code}
                style={{
                  background: c.color,
                  color: 'white',
                  fontSize: 17,
                  fontWeight: 700,
                  padding: '6px 16px',
                  borderRadius: 8,
                  opacity: 0.9,
                }}
              >
                {c.code}
              </div>
            ))}
          </div>
          <div style={{ color: '#6366f1', fontSize: 18 }}>
            gender-platform.vercel.app
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
