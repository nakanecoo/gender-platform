import Link from "next/link";
import { REQUEST_COUNTRY_URL } from "@/config";

const COUNTRY_GROUPS = [
  {
    role: "目指すべき姿",
    flags: "🇮🇸 🇸🇪 🇳🇴",
    label: "アイスランド・スウェーデン・ノルウェー",
    desc: "WEFジェンダーギャップ指数の世界トップクラス。父親クォータ制・同一賃金認証・役員クォータなど先進的な政策を実施しており、「どこまで改善できるか」の上限を示す参照先。",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    badge: "bg-emerald-200 text-emerald-800",
  },
  {
    role: "政策転換の成功事例",
    flags: "🇩🇪 🇫🇷",
    label: "ドイツ・フランス",
    desc: "欧州の中間層として、かつては日本と近い水準だったが、育休制度改革・役員クォータ法などの政策転換によって短期間で大きく改善した国。「どう変えるか」のモデルとして参考になる。",
    bg: "bg-blue-50",
    border: "border-blue-200",
    badge: "bg-blue-200 text-blue-800",
  },
  {
    role: "対比事例",
    flags: "🇺🇸",
    label: "アメリカ",
    desc: "GDP・企業影響力ともに世界最大級でありながら、育休制度の整備が遅れ女性議員比率も低い。「経済力があれば自動的に平等になるわけではない」という対比として重要。",
    bg: "bg-amber-50",
    border: "border-amber-200",
    badge: "bg-amber-200 text-amber-800",
  },
  {
    role: "アジアの比較対象",
    flags: "🇯🇵 🇰🇷",
    label: "日本・韓国",
    desc: "儒教的な文化背景・男性稼ぎ手モデルの歴史を共有するアジア圏の国同士。制度設計や政策の変化が似た社会構造の中でどう機能するかを比較するため、セットで掲載。",
    bg: "bg-rose-50",
    border: "border-rose-200",
    badge: "bg-rose-200 text-rose-800",
  },
];

const KEY_STATS = [
  { label: "WEFジェンダーギャップ指数", jp: "0.663（118位）", best: "🇮🇸 0.935（1位）" },
  { label: "女性管理職比率", jp: "14%", best: "🇮🇸 45%" },
  { label: "父親育休取得率", jp: "17%", best: "🇮🇸 90%" },
  { label: "国会議員の女性比率", jp: "10%", best: "🇮🇸 48%" },
  { label: "男女賃金格差", jp: "22%", best: "🇮🇸 9%" },
];

const SECTIONS = [
  {
    href: "/dashboard",
    icon: "📊",
    title: "国別ダッシュボード",
    desc: "選んだ国の全指標を一覧。日本の現状を網羅的に確認できます。",
    color: "border-blue-200 hover:border-blue-400",
    iconBg: "bg-blue-50",
  },
  {
    href: "/compare",
    icon: "🔍",
    title: "国際比較ビュー",
    desc: "指標を選んで複数国を横並びで比較。強みと弱みが一目瞭然。",
    color: "border-purple-200 hover:border-purple-400",
    iconBg: "bg-purple-50",
  },
  {
    href: "/trends",
    icon: "📈",
    title: "トレンドグラフ",
    desc: "2015〜2024年の推移を可視化。政策変化との関係を読み解く。",
    color: "border-emerald-200 hover:border-emerald-400",
    iconBg: "bg-emerald-50",
  },
  {
    href: "/timeline",
    icon: "📅",
    title: "政策タイムライン",
    desc: "各国が取ってきた施策の歴史。「日本への適用」ボタンで効果を確認。",
    color: "border-amber-200 hover:border-amber-400",
    iconBg: "bg-amber-50",
  },
  {
    href: "/solutions",
    icon: "💡",
    title: "解決策ライブラリ",
    desc: "各指標の改善に有効な政策をエビデンスとともに整理。",
    color: "border-rose-200 hover:border-rose-400",
    iconBg: "bg-rose-50",
  },
];

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* ヒーロー */}
      <div className="text-center mb-12">
        <div className="inline-block bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
          WEF・OECD・ILOデータに基づく
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight">
          ジェンダーギャップを<br className="sm:hidden" />データで理解する
        </h1>
        <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          日本・アイスランド・スウェーデンほか8カ国のジェンダーギャップを多角的な指標で比較し、
          解決策を探るためのデータプラットフォームです。
        </p>
      </div>

      {/* 日本の現状サマリー */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-10 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
          🇯🇵 日本の現状（2024年・8カ国中）
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {KEY_STATS.map((s) => (
            <div key={s.label} className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-500 mb-1">{s.label}</p>
              <p className="text-base font-bold text-rose-600 mb-0.5">日本：{s.jp}</p>
              <p className="text-xs text-emerald-600">トップ：{s.best}</p>
            </div>
          ))}
        </div>
      </div>

      {/* セクションカード */}
      <h2 className="text-lg font-bold text-slate-800 mb-4">機能一覧</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className={`bg-white rounded-xl border-2 p-5 transition-all hover:shadow-md ${s.color}`}
          >
            <div className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center text-xl mb-3`}>
              {s.icon}
            </div>
            <h3 className="font-bold text-slate-900 mb-1">{s.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
          </Link>
        ))}
      </div>

      {/* なぜこの8か国なのか */}
      <section className="mt-14">
        <h2 className="text-lg font-bold text-slate-800 mb-1">なぜこの8か国なのか</h2>
        <p className="text-sm text-slate-500 mb-5">
          単に「平等な国」を並べるのではなく、<strong className="text-slate-700">目的・地域・政策の文脈</strong>が異なる国を選ぶことで、
          日本が参照できる多様な比較軸を持たせています。
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {COUNTRY_GROUPS.map((g) => (
            <div key={g.label} className={`rounded-xl border p-4 ${g.bg} ${g.border}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${g.badge}`}>
                  {g.role}
                </span>
                <span className="text-base">{g.flags}</span>
              </div>
              <p className="font-semibold text-slate-900 text-sm mb-1">{g.label}</p>
              <p className="text-xs text-slate-600 leading-relaxed">{g.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* データ追加リクエスト */}
      <section className="mt-10">
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900 mb-1">この国のデータを追加リクエスト</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              掲載してほしい国・指標がある場合は GitHub Issue からリクエストしてください。
              <br className="hidden sm:block" />
              データが揃い次第、順次追加予定です。
            </p>
          </div>
          <a
            href={REQUEST_COUNTRY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            リクエストする →
          </a>
        </div>
      </section>
    </div>
  );
}
