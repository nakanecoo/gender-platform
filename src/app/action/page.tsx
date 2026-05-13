'use client';

import { useState } from 'react';

type Perspective = 'personal' | 'org' | 'policy' | 'unsure';

/* ─── Shared helpers ─── */

function Stars({ n, max = 3 }: { n: number; max?: number }) {
  return (
    <span className="text-amber-400 text-sm font-mono">
      {'★'.repeat(n)}{'☆'.repeat(max - n)}
    </span>
  );
}

function Src({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-slate-400 mt-2 leading-relaxed">出典：{children}</p>;
}

function SectionCard({ title, children, color = 'border-slate-200' }: {
  title: string; children: React.ReactNode; color?: string;
}) {
  return (
    <div className={`bg-white rounded-2xl border ${color} shadow-sm p-6 mb-5`}>
      <h3 className="text-base font-bold text-slate-800 mb-4">{title}</h3>
      {children}
    </div>
  );
}

/* ─── Perspective Switcher (sticky bar) ─── */

const PERSPECTIVES: { id: Perspective; label: string; emoji: string; color: string; activeColor: string }[] = [
  { id: 'personal', label: '自分の生活・職場で', emoji: '👤', color: 'border-indigo-200 text-indigo-700 hover:bg-indigo-50', activeColor: 'bg-indigo-600 text-white border-indigo-600' },
  { id: 'org',      label: '会社・組織として',  emoji: '🏢', color: 'border-sky-200 text-sky-700 hover:bg-sky-50',     activeColor: 'bg-sky-600 text-white border-sky-600' },
  { id: 'policy',   label: '政策・制度として',  emoji: '📜', color: 'border-emerald-200 text-emerald-700 hover:bg-emerald-50', activeColor: 'bg-emerald-600 text-white border-emerald-600' },
  { id: 'unsure',   label: 'まだわからない',    emoji: '🤔', color: 'border-amber-200 text-amber-700 hover:bg-amber-50', activeColor: 'bg-amber-500 text-white border-amber-500' },
];

function PerspectiveSwitcher({ active, onChange }: { active: Perspective; onChange: (p: Perspective) => void }) {
  return (
    <div className="sticky top-14 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <p className="text-xs text-slate-500 mb-2">あなたはどこから考えますか？</p>
        <div className="flex flex-wrap gap-2">
          {PERSPECTIVES.map((p) => (
            <button
              key={p.id}
              onClick={() => onChange(p.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border-2 transition-all ${
                active === p.id ? p.activeColor : p.color
              }`}
            >
              <span>{p.emoji}</span>
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Personal section ─── */

const CHECK_ITEMS = [
  '会議で女性の発言が男性より早く遮られていないか確認している',
  '育休取得を「自分には関係ない」と思わず、制度を調べたことがある',
  '家事・育児の担当を相手と定期的に話し合っている',
  '職場で感情的になった女性を「ヒステリック」と思ったことがない',
  '困ったとき、誰かに助けを求めることができている',
];

const CHECK_REASONS = [
  '会議・審議の場で女性の発言が遮られやすい傾向は複数の研究で示されています（Karpowitz, C.F., Mendelberg, T. & Shaker, L., 2012, American Political Science Review）。意識的に注目することが第一歩です。',
  '男性が育休を取得した家庭では、5年後の家事分担が均等化する傾向があります（OECD Family Database 2021）。まず制度を知ることが行動につながります。',
  '担当の「見える化」と定期的な対話があると、無意識の負担偏在に気づきやすくなります（内閣府「男女共同参画白書」2022年版）。',
  '同じ感情表現でも女性は「感情的」・男性は「情熱的」と評価される傾向が複数の研究で示されています。気づきがバイアスを減らします。',
  '困ったときに助けを求められる環境は精神的健康の維持に寄与する（WHO「メンタルヘルスアクションプラン 2013–2030」）。「強がらない」ことは自分と周囲を守るスキルです。',
];

const CHECK_FEEDBACK = [
  'まだどれもチェックしていません。まず一つから始めてみましょう。',
  '一つ意識できています。あと4つ、少しずつ取り組んでみましょう。',
  '着実に増えています。あと3つでさらに意識が高まります。',
  '半分以上できています。あと2つでグレードアップです。',
  'もう一歩！最後の一項目にチャレンジしてみましょう。',
  '素晴らしい意識です。次は周囲への働きかけを考えてみましょう。',
];

function RatioCompareChart({ ratio }: { ratio: number }) {
  const capped = Math.min(ratio, 10);
  const benchmarks = [
    { label: 'あなたの家庭', value: capped, color: capped > 5 ? '#ef4444' : capped > 2 ? '#f59e0b' : '#10b981', bold: true },
    { label: '日本平均', value: 5.5, color: '#6366f1', bold: false },
    { label: 'OECD平均', value: 2.0, color: '#64748b', bold: false },
    { label: '北欧平均', value: 1.2, color: '#10b981', bold: false },
  ];
  const maxVal = Math.max(capped + 1, 7);
  const W = 380, barH = 22, gap = 8, padL = 88, padR = 55, padT = 4;
  const H = benchmarks.length * (barH + gap) + padT;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 160 }}>
      {benchmarks.map((b, i) => {
        const y = padT + i * (barH + gap);
        const bw = Math.max((b.value / maxVal) * (W - padL - padR), 6);
        const label = b.value >= 10 ? '10倍以上' : `${b.value.toFixed(1)}倍`;
        return (
          <g key={b.label}>
            <text x={padL - 4} y={y + barH / 2 + 4} textAnchor="end" fontSize="10"
              fill={b.bold ? '#1e40af' : '#64748b'} fontWeight={b.bold ? '700' : '400'}>
              {b.label}
            </text>
            <rect x={padL} y={y} width={bw} height={barH} rx="3" fill={b.color} opacity={b.bold ? 1 : 0.55} />
            <text x={padL + bw + 4} y={y + barH / 2 + 4} fontSize="10" fill="#475569">{label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function PersonalSection({ onPerspective }: { onPerspective: (p: Perspective) => void }) {
  const [womanH, setWomanH] = useState('');
  const [manH, setManH] = useState('');
  const [checklist, setChecklist] = useState<Record<number, boolean>>({});
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});

  const womanNum = parseFloat(womanH) || 0;
  const manNum   = parseFloat(manH)   || 0;
  const hasResult = womanH !== '' && manH !== '';
  const ratio = manNum > 0 ? womanNum / manNum : womanNum > 0 ? 99 : 0;
  const ratioLabel = ratio === 99 ? '∞（男性が0時間）' : ratio === 0 ? '—' : `${ratio.toFixed(1)}倍`;

  const getComment = () => {
    if (!hasResult || ratio === 0) return '';
    if (ratio === 99 || ratio >= 5.0) return '日本平均（5.5倍）と同水準か、それ以上の格差がある状態です。ケアの負担偏在が大きいといえます。';
    if (ratio >= 2.5) return '日本平均（5.5倍）より小さいですが、OECD平均（約2倍）を上回っています。さらなる均等化が改善につながります。';
    if (ratio >= 1.5) return 'OECD平均（約2倍）に近い水準です。引き続き意識的な分担を続けましょう。';
    return '北欧平均（約1.2倍）に近い、比較的バランスのとれた状態です。この状態を維持することが重要です。';
  };

  const checkedCount = Object.values(checklist).filter(Boolean).length;

  const RESOURCES = [
    { category: '公的統計・白書', items: [
      '内閣府「男女共同参画白書」（毎年更新）',
      '内閣官房孤独・孤立対策担当室「人々のつながりに関する基礎調査」令和5年（2023）',
      '厚生労働省「雇用均等基本調査」（毎年）',
    ]},
    { category: '国際機関レポート', items: [
      'WEF Global Gender Gap Report（毎年）',
      'OECD Family Database（多言語）',
      'ILO「Women in Business and Management」2019',
      'UN Women「Progress of the World\'s Women」',
    ]},
    { category: '相談・支援', items: [
      'よりそいホットライン（0120-279-338・24時間）',
      'DV相談ナビ（#8008）',
      '男性相談窓口（各都道府県）',
    ]},
  ];

  return (
    <div>
      {/* Section 1: Care labor check */}
      <SectionCard title="セクション1：自分の状況を知る" color="border-indigo-200">
        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
          あなたの家庭のケア労働時間を入力すると、OECD平均・日本平均・北欧平均と比較できます。
          日本では女性が週平均約26時間、男性は約5時間の無償ケア労働を担っています。
        </p>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              女性の家事・育児・介護時間（週・時間）
            </label>
            <input type="number" min="0" max="100" value={womanH}
              onChange={(e) => setWomanH(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
              placeholder="例：20" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              男性の家事・育児・介護時間（週・時間）
            </label>
            <input type="number" min="0" max="100" value={manH}
              onChange={(e) => setManH(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
              placeholder="例：5" />
          </div>
        </div>

        {hasResult && ratio !== 0 && (
          <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200 space-y-3">
            {/* Ratio headline */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-indigo-700">{ratioLabel}</span>
              <span className="text-sm text-indigo-600">があなたの家庭の男女比です</span>
            </div>

            {/* Comparison chart */}
            <RatioCompareChart ratio={ratio === 99 ? 10 : ratio} />

            {/* What it means */}
            <div className={`rounded-lg px-3 py-2 text-xs font-semibold leading-relaxed ${
              ratio >= 5 ? 'bg-red-100 text-red-700' :
              ratio >= 2.5 ? 'bg-amber-100 text-amber-700' :
              ratio >= 1.5 ? 'bg-blue-100 text-blue-700' :
              'bg-emerald-100 text-emerald-700'
            }`}>
              {getComment()}
            </div>

            {/* Next action button */}
            <button
              onClick={() => document.getElementById('checklist-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
            >
              次にできること を見る ▼
            </button>
          </div>
        )}
        <Src>OECD生活時間調査2020、内閣府男女共同参画局</Src>
      </SectionCard>

      {/* Section 2: Workplace */}
      <SectionCard title="セクション2：職場・日常でできること" color="border-indigo-200">
        <div className="mb-6">
          <p className="text-sm font-semibold text-slate-700 mb-3">育休を取りやすくするための会話例</p>
          <div className="space-y-3">
            {[
              { situation: '上司に育休を申請するとき', example: '来年〇月に子どもが生まれます。育児休業を〇か月取得したいのですが、業務の引き継ぎについて相談させてください。' },
              { situation: 'パートナーに家事分担を提案するとき', example: '今の分担だとあなたの負担が大きいと思う。週1回、家事の担当を一緒に確認する時間を作れないかな？' },
              { situation: '職場の雰囲気が取りにくいとき', example: '育休の取得率をチームとして上げていきたいと思っています。私が取得することで、後に続く人が取りやすくなれば、と考えています。' },
            ].map((item) => (
              <div key={item.situation} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <p className="text-xs font-semibold text-slate-500 mb-1">{item.situation}</p>
                <p className="text-sm text-slate-700 leading-relaxed italic">「{item.example}」</p>
              </div>
            ))}
          </div>
        </div>

        {/* Checklist */}
        <div id="checklist-section" className="mb-4">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <p className="text-sm font-semibold text-slate-700">「気づきやすいバイアス」チェックリスト</p>
            <span className="text-xs text-slate-400">{checkedCount}/5 チェック済み</span>
          </div>

          {/* Feedback banner */}
          {checkedCount > 0 && (
            <div className={`mb-3 rounded-xl p-3 text-xs font-semibold leading-relaxed ${
              checkedCount === 5 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
              checkedCount >= 3 ? 'bg-blue-50 text-blue-700 border border-blue-200' :
              'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {CHECK_FEEDBACK[checkedCount]}
            </div>
          )}

          <div className="space-y-2">
            {CHECK_ITEMS.map((item, i) => (
              <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="flex items-center gap-3 p-3">
                  <input type="checkbox" checked={checklist[i] ?? false}
                    onChange={(e) => setChecklist(prev => ({ ...prev, [i]: e.target.checked }))}
                    className="w-4 h-4 accent-indigo-600 shrink-0 cursor-pointer" />
                  <span className={`text-sm leading-relaxed flex-1 ${checklist[i] ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                    {item}
                  </span>
                  {!checklist[i] && (
                    <button
                      onClick={() => setExpandedItems(prev => ({ ...prev, [i]: !prev[i] }))}
                      className="text-xs text-slate-400 hover:text-indigo-500 shrink-0 px-2 py-1 rounded border border-slate-200 hover:border-indigo-300 transition-colors"
                    >
                      {expandedItems[i] ? '閉じる' : 'なぜ？'}
                    </button>
                  )}
                </div>
                {!checklist[i] && expandedItems[i] && (
                  <div className="px-4 pb-3 pt-1 bg-slate-50 border-t border-slate-100 text-xs text-slate-600 leading-relaxed">
                    {CHECK_REASONS[i]}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Next step cards (visible after any check) */}
          {checkedCount > 0 && (
            <div className="mt-4 bg-emerald-50 rounded-xl p-4 border border-emerald-200">
              <p className="text-xs font-semibold text-emerald-800 mb-3">次のステップ</p>
              <div className="space-y-2">
                {[
                  { label: '会社・組織としての取り組みを見る', action: () => onPerspective('org'), emoji: '🏢' },
                  { label: '政策レベルで何が変わるかを確認する', action: () => onPerspective('policy'), emoji: '📜' },
                  { label: 'よくある疑問への回答を読む', action: () => onPerspective('unsure'), emoji: '🤔' },
                ].map((step) => (
                  <button key={step.label} onClick={step.action}
                    className="w-full flex items-center gap-2 px-3 py-2.5 bg-white rounded-lg border border-emerald-200 text-sm text-emerald-800 hover:bg-emerald-100 transition-colors text-left">
                    <span>{step.emoji}</span>
                    <span className="flex-1">{step.label}</span>
                    <span className="text-emerald-400">→</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
          <p className="text-sm font-semibold text-amber-800 mb-2">助けを求めることへの心理的ハードルについて</p>
          <p className="text-sm text-slate-700 leading-relaxed">
            「男性は助けを求めるべきではない」という規範が、男性の孤立・メンタルヘルス問題・
            自殺率の高さに直結しています（日本男性の自殺死亡率は女性の約2.2倍）。
            助けを求めることは弱さではなく、自分と周囲を守るスキルです。
          </p>
        </div>
      </SectionCard>

      {/* Section 3: Resources */}
      <SectionCard title="セクション3：学ぶ・つながる" color="border-indigo-200">
        <div className="space-y-4">
          {RESOURCES.map((cat) => (
            <div key={cat.category}>
              <p className="text-xs font-bold text-slate-500 mb-2">{cat.category}</p>
              <ul className="space-y-1">
                {cat.items.map((item) => (
                  <li key={item} className="text-sm text-slate-700 flex gap-2">
                    <span className="text-slate-300 shrink-0">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

/* ─── Organization section ─── */

function OrgSection() {
  const [checkState, setCheckState] = useState<Record<number, boolean>>({});
  const checkedCount = Object.values(checkState).filter(Boolean).length;

  const diagItems = [
    '男女別の育休取得率を把握・公開している',
    '男女間の賃金格差を定期的に分析している（または今後する予定がある）',
    '管理職候補の女性比率を把握し、育成計画がある',
    '採用・昇進の選考基準が明文化・透明化されている',
    'ハラスメントやDVの相談窓口があり、従業員に周知されている',
  ];

  const stage = checkedCount <= 1 ? '入門' : checkedCount <= 3 ? '実践' : '先進';
  const stageColor = stage === '入門' ? 'text-amber-600 bg-amber-50 border-amber-200'
    : stage === '実践' ? 'text-blue-600 bg-blue-50 border-blue-200'
    : 'text-emerald-600 bg-emerald-50 border-emerald-200';
  const stageNext = stage === '入門'
    ? 'まずは男女別育休取得率の把握と、賃金格差の社内調査から始めましょう。'
    : stage === '実践'
    ? '数値の可視化と公開が次のステップです。透明性が採用力と従業員信頼を高めます。'
    : '先進的な取り組みを他社と共有し、業界標準を引き上げることが貢献になります。';

  const POLICIES = [
    { stars: 3, title: '育休取得率の公開義務（法的根拠あり）', desc: '従業員1000人超は義務（2023年〜）。1000人以下も自主公開が採用力強化につながる。', evidence: '厚生労働省「令和5年度雇用均等基本調査」（2024）：育休取得率の開示義務化後、大企業での男性取得率が上昇傾向。' },
    { stars: 3, title: '賃金格差の定期的な自社分析と是正', desc: '男女別の基本給・賞与・昇進率を定期チェックし、差があれば原因を分析・是正する。', evidence: '英国・Government Equalities Office（2022）：賃金格差報告義務化（2017年〜）後、報告企業の格差縮小取組が広がった。' },
    { stars: 2, title: 'メンター・スポンサーシップ制度', desc: '女性管理職候補を支援するメンターを制度化。「後援者（スポンサー）」として積極的に推薦する。', evidence: 'ILO「Women in Business and Management」2019：インフォーマルネットワークへのアクセス格差が女性昇進の障壁。メンタリング・スポンサーシップ制度による支援の重要性が報告されている。' },
    { stars: 2, title: '採用・昇進基準の透明化', desc: '評価基準を明文化・全員に共有する。曖昧な基準は無意識バイアスの温床になる。', evidence: 'ILO「Women in Business and Management」2019：採用・昇進基準の透明化は無意識バイアスを低減し、ジェンダー平等な意思決定に寄与するとされている。' },
    { stars: 1, title: '無意識バイアス研修', desc: '無意識バイアス研修は認知変化には一定の効果があるが、行動変容への効果は限定的とする研究もある。構造的変化（採用・昇進基準の透明化、賃金開示）と組み合わせることが重要とされている。', evidence: '出典：Equality and Human Rights Commission「Unconscious Bias Training: An Assessment of the Evidence for Effectiveness」2018' },
  ];

  return (
    <div>
      <SectionCard title="セクション1：自社の現状を知る（簡易診断）" color="border-sky-200">
        <p className="text-sm text-slate-600 mb-4">当てはまる項目をチェックしてください</p>
        <div className="space-y-2 mb-4">
          {diagItems.map((item, i) => (
            <label key={i} className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={checkState[i] ?? false}
                onChange={(e) => setCheckState(prev => ({ ...prev, [i]: e.target.checked }))}
                className="mt-0.5 w-4 h-4 accent-sky-600 shrink-0"
              />
              <span className={`text-sm leading-relaxed ${checkState[i] ? 'text-slate-400' : 'text-slate-700'}`}>{item}</span>
            </label>
          ))}
        </div>
        {checkedCount > 0 && (
          <div className={`rounded-xl p-4 border ${stageColor}`}>
            <p className="font-bold mb-1">現在のステージ：{stage}段階（{checkedCount}/5項目）</p>
            <p className="text-sm leading-relaxed">{stageNext}</p>
          </div>
        )}
      </SectionCard>

      <SectionCard title="セクション2：取り組みの効果データ" color="border-sky-200">
        <div className="space-y-4">
          {[
            { label: '離職率の改善', value: '育休を取りやすい職場は、そうでない職場より女性の5年後定着率が高い（厚生労働省「令和5年度雇用均等基本調査」2024）。', icon: '📉' },
            { label: '採用力の向上', value: 'OECD（2023）「Employment Outlook」：ダイバーシティへの取り組みが雇用主ブランドに影響するとの調査結果が示されている。', icon: '🎯' },
            { label: '業績との相関', value: 'ILO「Women in Business and Management」2019：管理職の男女比が均等に近い企業ほど生産性・従業員定着率が高い傾向が報告されている（相関関係、因果関係の証明ではない）。', icon: '📈' },
            { label: '生産性への影響', value: 'OECD（2017）「The Pursuit of Gender Equality」：育児支援制度の充実が労働生産性に正の効果をもたらす傾向がある。', icon: '⚡' },
          ].map((item) => (
            <div key={item.label} className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xl shrink-0">{item.icon}</span>
              <div>
                <p className="text-xs font-semibold text-slate-700 mb-0.5">{item.label}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="セクション3：施策メニュー（エビデンス付き）" color="border-sky-200">
        <div className="flex gap-4 text-xs text-slate-500 mb-4 flex-wrap">
          <span><span className="text-amber-400">★★★</span> 大規模研究・効果確認</span>
          <span><span className="text-amber-400">★★☆</span> 複数研究で示唆</span>
          <span><span className="text-amber-400">★☆☆</span> 単一研究・観察段階</span>
        </div>
        <div className="space-y-4">
          {POLICIES.map((p) => (
            <div key={p.title} className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="font-semibold text-slate-800 text-sm">{p.title}</p>
                <Stars n={p.stars} />
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-2">{p.desc}</p>
              <div className="bg-emerald-50 rounded-lg px-3 py-2 border border-emerald-100 text-xs text-emerald-800">
                {p.evidence}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

/* ─── Policy section ─── */

const COUNTRY_LABEL: Record<string, string> = {
  IS: 'アイスランド',
  DE: 'ドイツ',
  JP: '日本',
  Nordic: '北欧',
};

const POLICY_MATRIX = [
  { label: '父親\nクォータ制', country: 'IS', effectRow: 0, easeCol: 1, color: '#6366f1',
    cite: 'Nordic Council of Ministers, 2025' },
  { label: '同一賃金\n認証制度', country: 'IS', effectRow: 0, easeCol: 2, color: '#6366f1',
    cite: 'ILO, Equal Pay Laws, 2022' },
  { label: '無償保育\n制度拡充', country: 'Nordic', effectRow: 0, easeCol: 2, color: '#10b981',
    cite: 'OECD Family Database, 2023' },
  { label: '養育費\n強制徴収制度', country: 'DE', effectRow: 0, easeCol: 1, color: '#64748b',
    cite: 'OECD Family Database, 2023' },
  { label: '育休取得率\n開示義務化', country: 'JP', effectRow: 1, easeCol: 0, color: '#f59e0b',
    cite: '厚生労働省, 2023' },
  { label: 'メンター\n制度', country: '—', effectRow: 1, easeCol: 1, color: '#94a3b8',
    cite: 'ILO, 2019' },
  { label: '無意識\nバイアス研修', country: '—', effectRow: 2, easeCol: 0, color: '#94a3b8',
    cite: 'Equality and Human Rights Commission, 2018' },
];

const SVG_FONT = "'Hiragino Kaku Gothic ProN', 'Hiragino Sans', 'Yu Gothic', Meiryo, sans-serif";

function PolicyMatrixChart() {
  const ROWS = ['効果：大', '効果：中', '効果：小'];
  const COLS = ['実施しやすい', '中程度', '実施困難'];
  const cellW = 160, cellH = 100;
  const padL = 72, padT = 36;
  const W = padL + cellW * 3 + 10;
  const H = padT + cellH * 3 + 10;

  return (
    <div>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 420, maxHeight: 380, fontFamily: SVG_FONT }}>
          {/* Column headers */}
          {COLS.map((col, ci) => (
            <text key={col} x={padL + cellW * ci + cellW / 2} y={20} textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="600">
              {col}
            </text>
          ))}
          {/* Row headers */}
          {ROWS.map((row, ri) => (
            <text key={row} x={padL - 4} y={padT + cellH * ri + cellH / 2 + 4} textAnchor="end" fontSize="10" fill="#64748b" fontWeight="600">
              {row}
            </text>
          ))}
          {/* Grid cells */}
          {ROWS.map((_, ri) =>
            COLS.map((_, ci) => {
              const x = padL + ci * cellW;
              const y = padT + ri * cellH;
              const isGood = ri === 0 || ci === 0;
              return (
                <rect key={`${ri}-${ci}`} x={x} y={y} width={cellW} height={cellH}
                  fill={isGood ? '#f0fdf4' : '#f8fafc'}
                  stroke="#e2e8f0" strokeWidth="1" />
              );
            })
          )}
          {/* Policy items */}
          {POLICY_MATRIX.map((p) => {
            const cx = padL + p.easeCol * cellW + cellW / 2;
            const cy = padT + p.effectRow * cellH + cellH / 2;
            const lines = p.label.split('\n');
            const countryName = p.country !== '—' ? COUNTRY_LABEL[p.country] ?? p.country : null;
            return (
              <g key={p.label}>
                <circle cx={cx} cy={cy - (lines.length > 1 ? 14 : 8)} r={6} fill={p.color} opacity={0.9} />
                {lines.map((line, li) => (
                  <text key={li} x={cx} y={cy + 4 + li * 13} textAnchor="middle" fontSize="9" fill="#334155">
                    {line}
                  </text>
                ))}
                {countryName && (
                  <text x={cx} y={cy + 4 + lines.length * 13} textAnchor="middle" fontSize="8" fill="#64748b">
                    （{countryName}）
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* 凡例 */}
      <div className="flex flex-wrap gap-3 justify-center mt-2 text-xs text-slate-500">
        <span><span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-500 mr-1 align-middle" />アイスランド</span>
        <span><span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1 align-middle" />北欧（保育）</span>
        <span><span className="inline-block w-2.5 h-2.5 rounded-full bg-slate-400 mr-1 align-middle" />ドイツ・その他</span>
        <span><span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400 mr-1 align-middle" />日本</span>
      </div>

      {/* 出典リスト */}
      <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-3 py-2 font-semibold text-slate-600">施策</th>
              <th className="text-left px-3 py-2 font-semibold text-slate-600">出典</th>
            </tr>
          </thead>
          <tbody>
            {POLICY_MATRIX.map((p) => {
              const name = p.label.replace('\n', '');
              const country = p.country !== '—' ? `（${COUNTRY_LABEL[p.country] ?? p.country}）` : '';
              return (
                <tr key={p.label} className="border-b border-slate-100 last:border-0">
                  <td className="px-3 py-2 text-slate-700 font-medium whitespace-nowrap">
                    <span className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle" style={{ backgroundColor: p.color }} />
                    {name}{country}
                  </td>
                  <td className="px-3 py-2 text-slate-500">
                    {p.cite}
                    {p.country === '—' && p.label.includes('バイアス') && (
                      <span className="ml-1 text-orange-600 font-medium">（効果は限定的との注記あり）</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 注記 */}
      <p className="mt-3 text-xs text-slate-400 leading-relaxed">
        効果の評価は各国の実施データおよび国際機関の政策評価に基づきます。
        実施しやすさは日本の制度・文化的文脈を考慮した評価です。
        出典：OECD, ILO, 各国政府統計
      </p>
    </div>
  );
}

const JAPAN_POLICIES = [
  {
    policy: '父親クォータ制',
    current: '「産後パパ育休」として2022年に創設。ただし取得率は17.1%と低く、形骸化リスクがある。',
    effect: '父親育休取得率を30%以上に引き上げると、女性の管理職比率・キャリア継続率が向上する見込み。',
    changes: '現行制度に「使わないと消失するパパ枠」を追加。職場文化の変革と組み合わせることが不可欠。',
    model: 'アイスランド（2000年導入、取得率90%超）',
  },
  {
    policy: '同一賃金認証制度',
    current: '日本には認証制度がなく、企業が自主的に格差是正をする仕組みがない。',
    effect: '認証を義務付けると、賃金格差を平均5〜8%縮小できるとの推計がある（ILO 2022）。',
    changes: '従業員100人超を対象に、男女別賃金の格差報告と是正計画の公開を義務化。',
    model: 'アイスランド（2018年から義務化）',
  },
  {
    policy: '養育費の強制徴収制度',
    current: '日本では養育費を受け取れているひとり親は28.1%のみ。強制徴収の仕組みがない。',
    effect: 'ドイツ型の立替・徴収制度を導入すると、ひとり親の貧困率が大幅に改善される見込み。',
    changes: '国が養育費を立替払いし、国が未払い親から回収する制度の創設。',
    model: 'ドイツ（立替制度あり）・スウェーデン（強制徴収あり）',
  },
];

const DATA_SOURCES = [
  { org: 'WEF', name: 'Global Gender Gap Report', freq: '毎年', note: 'GGI・経済・政治・教育・健康の4分野' },
  { org: 'OECD', name: 'Family Database', freq: '毎年更新', note: '育休・保育・就業・賃金格差等' },
  { org: 'ILO', name: 'ILOSTAT', freq: '毎月更新', note: '就業・賃金・労働時間等' },
  { org: '内閣府', name: '男女共同参画白書', freq: '毎年', note: '日本の各種ジェンダー指標' },
  { org: '厚生労働省', name: '賃金構造基本統計調査', freq: '毎年', note: '男女別賃金・職種別' },
  { org: 'UN Women', name: 'Facts & Figures', freq: '随時更新', note: '国際比較・SDGs進捗' },
];

function PolicySection() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div>
      <SectionCard title="セクション1：エビデンスで見る施策効果マトリクス" color="border-emerald-200">
        <p className="text-xs text-slate-500 mb-4">縦軸：効果の大きさ　横軸：実施のしやすさ（右ほど導入しやすい）</p>
        <PolicyMatrixChart />
      </SectionCard>

      <SectionCard title="セクション2：日本への適用可能性" color="border-emerald-200">
        <div className="space-y-4">
          {JAPAN_POLICIES.map((p, i) => (
            <div key={p.policy} className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
              >
                <span className="font-semibold text-slate-800 text-sm">{p.policy}</span>
                <span className="text-slate-400 text-xs">{expanded === i ? '▲ 閉じる' : '▼ 詳細'}</span>
              </button>
              {expanded === i && (
                <div className="px-4 py-4 space-y-3 text-sm">
                  <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                    <p className="text-xs font-semibold text-amber-700 mb-1">現在の日本の状況</p>
                    <p className="text-slate-700 leading-relaxed">{p.current}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                    <p className="text-xs font-semibold text-blue-700 mb-1">導入した場合の推定効果</p>
                    <p className="text-slate-700 leading-relaxed">{p.effect}</p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                    <p className="text-xs font-semibold text-emerald-700 mb-1">必要な制度変更</p>
                    <p className="text-slate-700 leading-relaxed">{p.changes}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                    <p className="text-xs font-semibold text-purple-700 mb-1">参考モデル</p>
                    <p className="text-slate-700">{p.model}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="セクション3：政策立案に使えるデータソース" color="border-emerald-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-3 py-2 font-semibold text-slate-600 text-xs">機関</th>
                <th className="text-left px-3 py-2 font-semibold text-slate-600 text-xs">データ名</th>
                <th className="text-left px-3 py-2 font-semibold text-slate-600 text-xs">更新頻度</th>
                <th className="text-left px-3 py-2 font-semibold text-slate-600 text-xs hidden sm:table-cell">内容</th>
              </tr>
            </thead>
            <tbody>
              {DATA_SOURCES.map((d) => (
                <tr key={d.name} className="border-b border-slate-100 last:border-0">
                  <td className="px-3 py-2.5 font-medium text-slate-700 text-xs whitespace-nowrap">{d.org}</td>
                  <td className="px-3 py-2.5 text-slate-600 text-xs">{d.name}</td>
                  <td className="px-3 py-2.5 text-slate-500 text-xs whitespace-nowrap">{d.freq}</td>
                  <td className="px-3 py-2.5 text-slate-400 text-xs hidden sm:table-cell">{d.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

/* ─── Unsure section (FAQ) ─── */

const FAQS = [
  {
    q: '男性も困っているのでは？ジェンダー問題は女性だけの問題？',
    a: `ジェンダー規範はすべての人を苦しめています。「男らしさ」の規範が、男性の孤立・メンタルヘルス悪化・高い自殺率につながっています。

データが示す男性の困難：
• 日本男性の自殺死亡率：22.9（女性10.3の約2.2倍）
• 10〜44歳男性の死因第1位：自殺
• 「友人がいない」男性：約40%（内閣官房2023調査）
• DV被害経験：男性22.0%（内閣府2023調査）

ジェンダー平等は「女性のため」ではなく、全性別が自分らしく生きるための問題です。男性がケアを担い、感情を表現し、助けを求める社会は、男性自身のwell-beingも改善します。`,
  },
  {
    q: '日本は本当にひどいのか？他の国と比べてどうなの？',
    a: `GGIランキングだけで判断するのは不完全です。日本は分野によって状況が異なります。

悪い指標：
• 政治分野GGI：0.233（146か国中138位）
• 女性管理職比率：13.2%（OECD平均33%）
• 男女賃金格差：21.3%（OECD最大水準）

比較的改善傾向の指標：
• 教育の男女平等（識字率・高等教育進学率）
• 健康寿命の男女差は世界水準

「全体的にひどい」ではなく「特定の分野で構造的な問題がある」というのが正確な理解です。何が問題で、何がそうでもないかを多面的に見ることが大切です。`,
  },
  {
    q: '頑張れば女性も上に行けるのでは？個人の努力の問題では？',
    a: `個人の努力は重要です。しかし、同等の努力をした場合でも構造的な障壁が存在することがデータで確認されています。

構造的障壁の証拠：
• 同一の履歴書で「男性名」vs「女性名」の場合、男性名のほうが面接率が高い（監査研究・複数の国で再現）
• 女性は管理職になるための「スポンサー」を得にくい傾向
• 女性の無償ケア労働時間が男性の5.5倍（OECD2020）という構造が、キャリアの継続を難しくしている

個人の努力を否定するのではなく、同じ努力をした場合に同じ結果が得られる環境を整えることが「構造の改善」の意味です。努力の必要性と構造的障壁の存在は、どちらも同時に本当のことです。`,
  },
  {
    q: 'ジェンダー平等が進むと男性が損をするの？',
    a: `ジェンダー平等が進んだ国のデータは逆を示しています。

ジェンダー平等先進国（北欧）の男性の状況：
• 男性の平均寿命：日本より長い
• 男性の「幸福度」：OECDトップレベル
• 男性の孤独感：日本より低い傾向
• 育児参加による家族関係の豊かさ

「ゼロサムゲーム」（女性が得ると男性が損）ではなく、ジェンダー規範から全員が自由になることで、男性も恩恵を受けます。特に「弱みを見せてはいけない」「稼がなければならない」というプレッシャーからの解放は、男性のメンタルヘルスに直結します。`,
  },
  {
    q: '何から始めればいいかわからない',
    a: `どこから始めるかは、立場によって違います。このページの上部のボタンで立場を切り替えると、具体的な行動案が見られます。

よくある「最初の一歩」：
• 個人として：家庭のケア労働時間を配偶者・パートナーと話し合ってみる
• 職場として：職場の育休取得率を調べてみる（会社のHRに聞く、または有価証券報告書を見る）
• 政策として：内閣府の男女共同参画白書を読んでみる（無料・オンライン公開）

完璧な理解より、小さな行動の方が価値があります。このサイトを読んだことも、すでに一歩です。`,
  },
];

function UnsureSection() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div>
      <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 mb-6">
        <p className="text-sm text-amber-800 leading-relaxed">
          「よくわからない」は大切な出発点です。
          ここでは、ジェンダーの議論でよく出る疑問に、データとともに誠実にお答えします。
          どの立場からも「断定しない」姿勢を大切にしています。
        </p>
      </div>
      <div className="space-y-3">
        {FAQS.map((faq, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <button
              onClick={() => setExpanded(expanded === i ? null : i)}
              className="w-full flex items-start justify-between px-5 py-4 hover:bg-slate-50 transition-colors text-left gap-3"
            >
              <span className="font-semibold text-slate-800 text-sm leading-relaxed">Q{i + 1}：{faq.q}</span>
              <span className="text-slate-400 text-sm shrink-0 mt-0.5">{expanded === i ? '▲' : '▼'}</span>
            </button>
            {expanded === i && (
              <div className="px-5 py-4 border-t border-slate-100 bg-slate-50">
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{faq.a}</div>
                {i === 4 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {PERSPECTIVES.filter(p => p.id !== 'unsure').map(p => (
                      <span key={p.id} className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 ${p.color}`}>
                        {p.emoji} {p.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main page ─── */

export default function ActionPage() {
  const [perspective, setPerspective] = useState<Perspective>('personal');

  const CONTENT: Record<Perspective, React.ReactNode> = {
    personal: <PersonalSection onPerspective={setPerspective} />,
    org:      <OrgSection />,
    policy:   <PolicySection />,
    unsure:   <UnsureSection />,
  };

  const current = PERSPECTIVES.find(p => p.id === perspective)!;

  return (
    <div>
      {/* Page header (not sticky) */}
      <div className="max-w-4xl mx-auto px-4 py-8 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">行動を考える</h1>
        <p className="text-slate-600 text-sm leading-relaxed max-w-2xl">
          同じ現実を、違う角度から見る。<br />
          データは一つ。でも関わり方は人それぞれです。<br />
          <span className="font-semibold">あなたはどこから考えますか？</span>
        </p>
      </div>

      {/* Sticky switcher */}
      <PerspectiveSwitcher active={perspective} onChange={setPerspective} />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl">{current.emoji}</span>
          <h2 className="text-lg font-bold text-slate-800">{current.label}</h2>
        </div>
        {CONTENT[perspective]}
      </div>
    </div>
  );
}
