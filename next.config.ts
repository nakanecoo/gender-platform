import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';

const CSP = [
  "default-src 'self'",
  // Next.js は __NEXT_DATA__ という inline script を埋め込むため unsafe-inline が必要
  // 開発環境では Turbopack が eval() を使用するため unsafe-eval も許可
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  // Tailwind CSS は style 属性を使うため unsafe-inline が必要
  "style-src 'self' 'unsafe-inline'",
  // data: は Recharts が canvas を blob 変換する場合に使用
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  // フレームへの埋め込みを完全に禁止（frame-ancestors は X-Frame-Options の上位互換）
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  // iframe への埋め込みを禁止（古いブラウザ向けに X-Frame-Options も設定）
  { key: "X-Frame-Options", value: "DENY" },
  // MIME スニッフィングを無効化
  { key: "X-Content-Type-Options", value: "nosniff" },
  // リファラ情報の送信を同一オリジンのみに制限
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // 不要なブラウザ機能へのアクセスを禁止
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // 不正スクリプトの実行を防ぐ CSP
  { key: "Content-Security-Policy", value: CSP },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
