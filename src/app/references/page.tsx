'use client';

const SOURCES = [
  {
    category: '日本政府・省庁',
    items: [
      { cite: '内閣府「男女共同参画白書」', detail: '毎年更新', url: 'https://www.gender.go.jp/about_danjo/whitepaper/' },
      { cite: '内閣府「男女間における暴力に関する調査報告書」令和5年度', detail: '内閣府男女共同参画局', url: 'https://www.gender.go.jp/policy/no_violence/e-vaw/chousa/r05_boryoku_cyousa.html' },
      { cite: '内閣官房孤独・孤立対策担当室「人々のつながりに関する基礎調査」令和5年（2023年）', detail: '内閣官房', url: 'https://www.cas.go.jp/jp/seisaku/kodoku_koritsu_taisaku/' },
      { cite: '厚生労働省「令和5年度雇用均等基本調査」', detail: '2024年公表', url: 'https://www.mhlw.go.jp/toukei/list/71-r05.html' },
      { cite: '厚生労働省「令和3年度全国ひとり親世帯等調査」', detail: '厚生労働省', url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kodomo/kodomo_kosodate/hitorioya/index.html' },
      { cite: '厚生労働省・警察庁「令和6年中における自殺の状況」', detail: '2025年公表', url: 'https://www.npa.go.jp/publications/statistics/safetylife/jisatsu.html' },
    ],
  },
  {
    category: '国連機関・国際機関',
    items: [
      { cite: 'WEF「Global Gender Gap Report 2024」', detail: 'World Economic Forum', url: 'https://www.weforum.org/publications/global-gender-gap-report-2024/' },
      { cite: 'OECD Family Database 2024', detail: 'OECD', url: 'https://www.oecd.org/els/family/database.htm' },
      { cite: 'OECD Time Use Database 2020', detail: 'OECD', url: 'https://www.oecd.org/gender/data/time-spent-in-unpaid-paid-and-total-work-by-sex.htm' },
      { cite: 'OECD Labour Force Statistics 2024', detail: 'OECD', url: 'https://stats.oecd.org/' },
      { cite: 'OECD Gender Wage Gap 2024', detail: 'OECD', url: 'https://data.oecd.org/earnwage/gender-wage-gap.htm' },
      { cite: 'OECD「Employment Outlook: Gender and Jobs」2023', detail: 'OECD', url: 'https://www.oecd.org/employment/oecdemploymentoutlook.htm' },
      { cite: 'OECD「The Pursuit of Gender Equality: An Uphill Battle」2017', detail: 'OECD Publishing', url: 'https://doi.org/10.1787/9789264281318-en' },
      { cite: 'ILO「Women in Business and Management: The business case for change」2019', detail: 'International Labour Organization', url: 'https://www.ilo.org/acmop/WCMS_700953' },
      { cite: 'ILO Women in Business and Management 2024', detail: 'International Labour Organization', url: 'https://www.ilo.org/global/topics/equality-and-discrimination/gender-equality/lang--en/' },
      { cite: 'UN Women「Progress of the World\'s Women 2019–2020」', detail: 'UN Women', url: 'https://progress.unwomen.org/en/2019/' },
      { cite: 'UNDP「Gender Social Norms Index」2023', detail: 'United Nations Development Programme', url: 'https://hdr.undp.org/content/2023-gender-social-norms-index' },
      { cite: 'UNICEF Gender Policy 2022–2025', detail: 'United Nations Children\'s Fund', url: 'https://www.unicef.org/gender-equality' },
      { cite: 'UNESCO Science Report 2024', detail: 'United Nations Educational, Scientific and Cultural Organization', url: 'https://www.unesco.org/en/articles/unesco-science-report' },
      { cite: 'UNESCO Institute for Statistics 2024', detail: 'UNESCO', url: 'http://uis.unesco.org/' },
      { cite: 'WHO「World Health Statistics 2024」', detail: 'World Health Organization', url: 'https://www.who.int/docs/default-source/gho-documents/world-health-statistic-reports/2024/world-health-statistics-2024.pdf' },
      { cite: 'WHO「メンタルヘルスアクションプラン 2013–2030」', detail: 'World Health Organization', url: 'https://www.who.int/publications/i/item/9789241506021' },
      { cite: 'World Bank「Women, Business and the Law 2024」', detail: 'World Bank Group', url: 'https://wbl.worldbank.org/' },
      { cite: 'UNFPA「State of World Population 2024」', detail: 'United Nations Population Fund', url: 'https://www.unfpa.org/swop' },
      { cite: 'IPU Parline 2024', detail: 'Inter-Parliamentary Union', url: 'https://data.ipu.org/' },
    ],
  },
  {
    category: 'EU・各国政府機関',
    items: [
      { cite: 'EU基本権機関（FRA）「Violence against women: an EU-wide survey」2014', detail: 'European Union Agency for Fundamental Rights', url: 'https://fra.europa.eu/en/publication/2014/violence-against-women-eu-wide-survey-main-results-report' },
      { cite: 'EU EIGE Gender Equality Index', detail: 'European Institute for Gender Equality', url: 'https://eige.europa.eu/gender-equality-index' },
      { cite: 'UK Government Equalities Office「Gender Pay Gap Service」2023', detail: 'HM Government (UK)', url: 'https://gender-pay-gap.service.gov.uk/' },
      { cite: 'Equality and Human Rights Commission「Unconscious Bias Training: An Assessment of the Evidence for Effectiveness」2018', detail: 'Atewologun, D., Cornish, T. & Tresh, F. / EHRC', url: 'https://www.equalityhumanrights.com/en/publication-download/unconscious-bias-training-assessment-evidence-effectiveness' },
    ],
  },
  {
    category: '査読済み学術論文',
    items: [
      { cite: 'Gracia, E. & Merlo, J.「Intimate partner violence against women and the Nordic paradox」PLOS ONE 2016', detail: 'DOI: 10.1371/journal.pone.0156264', url: 'https://doi.org/10.1371/journal.pone.0156264' },
      { cite: 'Gracia, E. et al.「Prevalence of intimate partner violence against women in Sweden and Spain: a psychometric study」PLOS ONE 2019', detail: 'DOI: 10.1371/journal.pone.0213068', url: 'https://doi.org/10.1371/journal.pone.0213068' },
      { cite: 'Karpowitz, C.F., Mendelberg, T. & Shaker, L.「Gender Inequality in Deliberative Participation」American Political Science Review, 2012', detail: 'Vol. 106 (3), pp. 533–547', url: 'https://doi.org/10.1017/S0003055412000329' },
    ],
  },
  {
    category: 'その他の公的資料',
    items: [
      { cite: 'National Resource Center on Domestic Violence (NRCDV)「Gender-Responsive Services」2025', detail: '米国家庭内暴力防止サービス法（FVPSA）に基づく国家リソースセンター', url: 'https://www.nrcdv.org/' },
    ],
  },
];

export default function ReferencesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">参考文献・データソース</h1>
      <p className="text-slate-500 text-sm mb-2 leading-relaxed">
        このサイトで使用しているデータ・引用は、以下の公的機関・査読済み論文のみを出典としています。
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 text-xs text-blue-800 leading-relaxed">
        <p className="font-semibold mb-1">出典方針</p>
        <ul className="space-y-0.5 list-disc list-inside">
          <li>国連機関（UN Women・UNDP・ILO・UNICEF・WHO）</li>
          <li>各国政府・省庁の公式統計</li>
          <li>OECD・EU・世界銀行などの国際機関</li>
          <li>査読済み学術論文（journal名・著者・年を明記）</li>
        </ul>
        <p className="mt-2 text-blue-600">民間シンクタンク・コンサルティング企業・一般書籍は出典として使用していません。</p>
      </div>

      <div className="space-y-8">
        {SOURCES.map((section) => (
          <section key={section.category}>
            <h2 className="text-base font-bold text-slate-800 mb-3 border-b border-slate-200 pb-2">
              {section.category}
            </h2>
            <ul className="space-y-3">
              {section.items.map((item) => (
                <li key={item.cite} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                  <p className="text-sm font-semibold text-slate-800 leading-relaxed mb-1">{item.cite}</p>
                  <p className="text-xs text-slate-500">{item.detail}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-10 bg-slate-50 rounded-2xl border border-slate-200 p-5 text-xs text-slate-500 leading-relaxed">
        <p className="font-semibold text-slate-700 mb-1">注記</p>
        <p>
          掲載データは公表値をもとにした概算値を含む場合があります。
          各数値の最新情報は各機関の公式サイトをご確認ください。
          引用している数値は特定の年度のスナップショットであり、最新年度と異なる場合があります。
        </p>
      </div>
    </div>
  );
}
