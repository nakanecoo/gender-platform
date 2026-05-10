import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "ジェンダーデータ・プラットフォーム",
  description: "データに基づいてジェンダーギャップを理解し、解決策を検討できるプラットフォーム",
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
        <footer className="mt-16 border-t border-slate-200 py-8 text-center text-xs text-slate-400 px-4">
          <p>データ出典：WEF Global Gender Gap Report 2024・OECD Family Database・ILO・UNESCO・UN Women・IPU Parline（概算値を含む）</p>
          <p className="mt-1">このサイトは教育・啓発目的で作成されています。</p>
        </footer>
      </body>
    </html>
  );
}
