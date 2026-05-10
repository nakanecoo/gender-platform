import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ??
  "https://gender-platform.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "ジェンダーデータ・プラットフォーム",
    template: "%s | ジェンダーデータ・プラットフォーム",
  },
  description:
    "日本・アイスランド・スウェーデンほか8カ国のジェンダーギャップを26の指標で比較。WEF・OECD・ILOのデータに基づく教育・啓発プラットフォーム。",

  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: siteUrl,
    siteName: "ジェンダーデータ・プラットフォーム",
    title: "ジェンダーデータ・プラットフォーム",
    description:
      "日本・北欧・欧米8カ国のジェンダーギャップをデータで比較・解説。26指標・6カテゴリ・政策タイムライン収録。WEF・OECD・ILOデータに基づく。",
  },

  twitter: {
    card: "summary_large_image",
    title: "ジェンダーデータ・プラットフォーム",
    description:
      "日本・北欧・欧米8カ国のジェンダーギャップをデータで比較・解説。26指標・政策タイムライン収録。",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="bg-slate-50 text-slate-800 min-h-screen" style={{ fontFamily: "'Hiragino Kaku Gothic ProN', 'Hiragino Sans', 'Yu Gothic', 'Meiryo', sans-serif" }}>
        <Navigation />
        <main>{children}</main>
        <footer className="mt-16 border-t border-slate-200 bg-white">
          <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
              {/* 左：プライバシー宣言 */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full border border-emerald-200">
                  🔒 個人情報を収集しません
                </span>
                <span>このサイトはCookieを使用せず、アクセス解析も行いません。</span>
              </div>
              {/* 右：教育目的 */}
              <span className="text-slate-400">教育・啓発目的</span>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400 text-center leading-relaxed">
              <p>
                <span className="font-medium text-slate-500">データ出典：</span>
                WEF Global Gender Gap Report 2024 ·{" "}
                OECD Family Database 2024 ·{" "}
                ILO Women in Business and Management 2024 ·{" "}
                UNESCO Institute for Statistics 2024 ·{" "}
                UN Women 2024 ·{" "}
                IPU Parline 2024 ·{" "}
                WHO World Health Statistics 2024 ·{" "}
                World Bank Women, Business and the Law 2024 ·{" "}
                UNDP Gender Social Norms Index 2023
              </p>
              <p className="mt-1 text-slate-300">
                ※ 掲載データは公表値をもとにした概算値を含みます。最新情報は各機関の公式サイトをご確認ください。
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
