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

function PersonalSection() {
  const [womanH, setWomanH] = useState('');
  const [manH, setManH] = useState('');
  const [checklist, setChecklist] = useState<Record<number, boolean>>({});
  const [showResources, setShowResources] = useState(false);

  const oecd_w = 26; // OECD Japan avg women weekly unpaid hours
  const oecd_m = 5;

  const womanNum = parseFloat(womanH) || 0;
  const manNum = parseFloat(manH) || 0;
  const total = womanNum + manNum;
  const womanPct = total > 0 ? Math.round((womanNum / total) * 100) : 0;
  const hasResult = womanH !== '' && manH !== '';

  const checkItems = [
    '会議で女性の発言が男性より早く遮られていないか確認している',
    '育休取得を「自分には関係ない」と思わず、制度を調べたことがある',
    '家事・育児の担当を相手と定期的に話し合っている',
    '職場で感情的になった女性を「ヒステリック」と思ったことがない',
    '困ったとき、誰かに助けを求めることができている',
  ];

  const checkedCount = Object.values(checklist).filter(Boolean).length;

  const RESOURCES = [
    { category: '書籍', items: ['田中俊之『男がつらいよ』双葉社', '竹信三恵子『家事労働ハラスメント』岩波新書', '浜田敬子『男性中心企業の終焉』文藝春秋'] },
    { category: '研究・レポート', items: ['内閣府「男女共同参画白書」（毎年更新）', 'OECD Family Database（多言語）', 'WEF Global Gender Gap Report（毎年）'] },
    { category: '相談・支援団体', items: ['よりそいホットライン（0120-279-338・24時間）', 'DV相談ナビ（#8008）', '男性相談窓口（各都道府県）'] },
  ];

  return (
    <div>
      <SectionCard title="セクション1：自分の状況を知る" color="border-indigo-200">
        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
          あなたの家庭のケア労働時間は、OECD平均と比べてどうでしょうか？
          日本では女性が週平均約26時間、男性は約5時間の無償ケア労働を担っています。
        </p>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              女性の家事・育児・介護時間（週・時間）
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={womanH}
              onChange={(e) => setWomanH(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
              placeholder="例：20"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              男性の家事・育児・介護時間（週・時間）
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={manH}
              onChange={(e) => setManH(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
              placeholder="例：5"
            />
          </div>
        </div>

        {hasResult && (
          <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
            <p className="text-sm font-semibold text-indigo-800 mb-2">あなたの家庭の状況</p>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 bg-white rounded-full h-4 border border-indigo-200 overflow-hidden">
                <div
                  className="h-full bg-rose-400 transition-all"
                  style={{ width: `${womanPct}%` }}
                />
              </div>
              <span className="text-xs text-slate-600 whitespace-nowrap">女性{womanPct}% / 男性{100 - womanPct}%</span>
            </div>
            {womanPct > 75 && (
              <p className="text-xs text-rose-700 leading-relaxed">
                女性の負担が大きい状態です。日本の平均（女性84.6%）に近い水準です。
                この状態が続くと、女性のキャリアや健康に影響が出やすくなります。
              </p>
            )}
            {womanPct >= 50 && womanPct <= 75 && (
              <p className="text-xs text-amber-700 leading-relaxed">
                女性の負担がやや多い状態です。日本平均（84.6%）より改善されていますが、
                北欧の平均（55〜65%）にはまだ差があります。
              </p>
            )}
            {womanPct < 50 && (
              <p className="text-xs text-emerald-700 leading-relaxed">
                比較的バランスのとれた分担です。北欧諸国の平均に近い水準です。
                この状態を維持・改善していくことが重要です。
              </p>
            )}
            <div className="mt-2 text-xs text-slate-500 flex gap-4">
              <span>OECD日本平均：女性{oecd_w}時間・男性{oecd_m}時間（週）</span>
            </div>
          </div>
        )}
        <Src>OECD生活時間調査2020、内閣府男女共同参画局</Src>
      </SectionCard>

      <SectionCard title="セクション2：職場・日常でできること" color="border-indigo-200">
        <div className="mb-6">
          <p className="text-sm font-semibold text-slate-700 mb-3">育休を取りやすくするための会話例</p>
          <div className="space-y-3">
            {[
              { situation: '上司に育休を申請するとき', example: '「来年〇月に子どもが生まれます。育児休業を〇か月取得したいのですが、業務の引き継ぎについて相談させてください。」' },
              { situation: 'パートナーに家事分担を提案するとき', example: '「今の分担だとあなたの負担が大きいと思う。週1回、家事の担当を一緒に確認する時間を作れないかな？」' },
              { situation: '職場の雰囲気が育休を取りにくいとき', example: '「育休の取得率をチームとして上げていきたいと思っています。私が取得することで、後に続く人が取りやすくなれば、と考えています。」' },
            ].map((item) => (
              <div key={item.situation} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <p className="text-xs font-semibold text-slate-500 mb-1">{item.situation}</p>
                <p className="text-sm text-slate-700 leading-relaxed italic">「{item.example}」</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm font-semibold text-slate-700 mb-3">
            「気づきやすいバイアス」チェックリスト
            <span className="text-xs font-normal text-slate-400 ml-2">（{checkedCount}/5 チェック済み）</span>
          </p>
          <div className="space-y-2">
            {checkItems.map((item, i) => (
              <label key={i} className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={checklist[i] ?? false}
                  onChange={(e) => setChecklist(prev => ({ ...prev, [i]: e.target.checked }))}
                  className="mt-0.5 w-4 h-4 accent-indigo-600 shrink-0"
                />
                <span className={`text-sm leading-relaxed ${checklist[i] ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{item}</span>
              </label>
            ))}
          </div>
          {checkedCount === 5 && (
            <div className="mt-3 bg-emerald-50 rounded-xl p-3 border border-emerald-200 text-xs text-emerald-800">
              すべてチェックできました。小さな気づきの積み重ねが職場文化を変えます。
            </div>
          )}
        </div>

        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
          <p className="text-sm font-semibold text-amber-800 mb-2">助けを求めることへの心理的ハードルについて</p>
          <p className="text-sm text-slate-700 leading-relaxed">
            「男性は助けを求めるべきではない」という規範が、男性の孤立・メンタルヘルス問題・
            自殺率の高さに直結しています（日本男性の自殺死亡率は女性の約2.2倍）。
            助けを求めることは弱さではなく、自分と周囲を守るスキルです。
            困ったとき、まず身近な人に「少し話してもいいか」と声をかけることから始められます。
          </p>
        </div>
      </SectionCard>

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
    { stars: 3, title: '育休取得率の公開義務（法的根拠あり）', desc: '従業員1000人超は義務（2023年〜）。1000人以下も自主公開が採用力強化につながる。', evidence: '大企業での公開後、認知度・志望者数が向上（経団連2024調査）。' },
    { stars: 3, title: '賃金格差の定期的な自社分析と是正', desc: '男女別の基本給・賞与・昇進率を定期チェックし、差があれば原因を分析・是正する。', evidence: '英国では格差報告義務化後、企業の自発的是正が進んだ（CIPD 2023）。' },
    { stars: 2, title: 'メンター・スポンサーシップ制度', desc: '女性管理職候補を支援するメンターを制度化。「後援者（スポンサー）」として積極的に推薦する。', evidence: 'McKinsey Women in the Workplace 2023：スポンサー付き女性は昇進率が有意に高い。' },
    { stars: 2, title: '採用・昇進基準の透明化', desc: '評価基準を明文化・全員に共有する。曖昧な基準は無意識バイアスの温床になる。', evidence: 'HBR 2023：透明な評価基準は女性昇進率を平均15%改善。' },
    { stars: 1, title: '無意識バイアス研修', desc: '管理職向けに半日〜1日の研修を実施。ただし研修単独では効果が限定的。他の施策との組み合わせが重要。', evidence: 'メタ分析：研修単独の効果は小さい（Atewologun et al. 2018）。制度変更と組み合わせると効果増。' },
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
            { label: '離職率の改善', value: '育休を取りやすい職場は、そうでない職場より女性の5年後定着率が18ポイント高い（厚労省2023）。', icon: '📉' },
            { label: '採用力の向上', value: 'ジェンダー平等への取り組みを「重視する」と答えた就活生：70%（リクルート2023調査）。', icon: '🎯' },
            { label: '業績との相関', value: '役員の多様性が高い企業は、そうでない企業より収益性が36%高い確率（McKinsey 2020）。', icon: '📈' },
            { label: '生産性への影響', value: '男性育休取得者のいるチームは、翌年の業務効率改善率が平均12%高い（BERD調査2022）。', icon: '⚡' },
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

const POLICY_MATRIX = [
  { label: '父親クォータ制', country: '🇮🇸', effectRow: 0, easeCol: 1, color: '#6366f1' },
  { label: '同一賃金\n認証制度', country: '🇮🇸', effectRow: 0, easeCol: 2, color: '#6366f1' },
  { label: '保育の\n無償化・拡充', country: '🇫🇷', effectRow: 0, easeCol: 2, color: '#10b981' },
  { label: '養育費\n強制徴収制度', country: '🇩🇪', effectRow: 0, easeCol: 1, color: '#64748b' },
  { label: '育休開示\n義務化', country: '🇯🇵', effectRow: 1, easeCol: 0, color: '#f59e0b' },
  { label: 'メンター\n制度', country: '—', effectRow: 1, easeCol: 1, color: '#94a3b8' },
  { label: '無意識バイアス\n研修', country: '—', effectRow: 2, easeCol: 0, color: '#94a3b8' },
];

function PolicyMatrixChart() {
  const ROWS = ['効果：大', '効果：中', '効果：小'];
  const COLS = ['実施しやすい', '中程度', '実施困難'];
  const cellW = 160, cellH = 90;
  const padL = 72, padT = 36;
  const W = padL + cellW * 3 + 10;
  const H = padT + cellH * 3 + 10;

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 420, maxHeight: 340 }}>
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
          return (
            <g key={p.label}>
              <circle cx={cx} cy={cy - (lines.length > 1 ? 10 : 5)} r={6} fill={p.color} opacity={0.9} />
              {lines.map((line, li) => (
                <text key={li} x={cx} y={cy + 8 + li * 12} textAnchor="middle" fontSize="8.5" fill="#334155">
                  {line} {li === 0 && p.country !== '—' ? p.country : ''}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
      <p className="text-xs text-slate-400 text-center mt-1">
        ● 紫：アイスランド　● 緑：フランス　● 灰：ドイツ・その他　● 黄：日本
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
    model: '🇮🇸 アイスランド（2000年導入、取得率90%超）',
  },
  {
    policy: '同一賃金認証制度',
    current: '日本には認証制度がなく、企業が自主的に格差是正をする仕組みがない。',
    effect: '認証を義務付けると、賃金格差を平均5〜8%縮小できるとの推計がある（ILO 2022）。',
    changes: '従業員100人超を対象に、男女別賃金の格差報告と是正計画の公開を義務化。',
    model: '🇮🇸 アイスランド（2018年から義務化）',
  },
  {
    policy: '養育費の強制徴収制度',
    current: '日本では養育費を受け取れているひとり親は28.1%のみ。強制徴収の仕組みがない。',
    effect: 'ドイツ型の立替・徴収制度を導入すると、ひとり親の貧困率が大幅に改善される見込み。',
    changes: '国が養育費を立替払いし、国が未払い親から回収する制度の創設。',
    model: '🇩🇪 ドイツ（立替制度あり）・🇸🇪 スウェーデン（強制徴収あり）',
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
    personal: <PersonalSection />,
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
