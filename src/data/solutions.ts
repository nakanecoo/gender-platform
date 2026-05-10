import { Solution } from '@/types';

export const SOLUTIONS: Solution[] = [
  {
    id: 'paternity-quota',
    title: '父親専用育休クォータ制',
    category: 'careWork',
    description:
      '育児休業の一定期間（2〜3ヶ月）を父親専用とし、使わなければ権利が消滅する「use-it-or-lose-it」方式にする。母親への移譲を不可とすることで、職場の圧力に関わらず父親が取得せざるを得ない環境を作る。',
    evidence:
      'アイスランド（2000年）では導入後、父親育休取得率が2%から90%超へ急増。ノルウェー（1993年）では3%から35%超へ。スウェーデン（1995年）では45%から75%以上へ上昇した。',
    mechanism:
      '職場の「取りにくい」雰囲気を制度設計で無効化する。個人の判断や職場の慣行ではなく、制度の構造そのものが取得を促す「デフォルト変更」効果が働く。',
    exampleCountries: ['IS', 'NO', 'SE'],
    effectSize: 'high',
    targetMetrics: ['paternity_rate', 'paternity_weeks_m', 'unpaid_care_m', 'managers_f'],
  },
  {
    id: 'income-replacement',
    title: '育休中の所得保障強化（給付率引き上げ）',
    category: 'careWork',
    description:
      '育休中の給付を従前給与の80〜100%に引き上げ、上限額を実質的な所得補償が得られる水準に設定する。特に高収入層の父親が取得しやすくなることで、「収入が減る」という取得障壁を除去する。',
    evidence:
      'ドイツが2007年に給付率67%・上限1800ユーロの制度を導入後、父親取得率が3%から36%へ急増。給付率と取得率の正の相関は、北欧諸国でも一貫して確認されている。',
    mechanism:
      '育休取得の最大の障壁のひとつは収入減少への不安。高い給付率は特に世帯の主たる稼ぎ手（多くの場合父親）の取得を促進する。',
    exampleCountries: ['DE', 'SE', 'IS'],
    effectSize: 'high',
    targetMetrics: ['paternity_rate', 'paternity_weeks_m', 'unpaid_care_m'],
  },
  {
    id: 'equal-pay-certification',
    title: '同一賃金認証制度の義務化',
    category: 'economy',
    description:
      '一定規模以上の企業・公共機関に対し、職種・勤続年数・業績等を考慮した上で賃金に性別格差がないことを第三者機関が認証することを義務付ける。認証未取得には罰金等の制裁を科す。',
    evidence:
      'アイスランドが2018年に世界初の義務化を実施。認証プロセスで各企業は隠れた格差を洗い出し是正する義務を負い、導入後5年で賃金格差が14%から9%へ縮小した。',
    mechanism:
      '格差の「可視化」と「説明責任」が同時に働く。企業は格差の存在を「知らなかった」と言えなくなり、組織内での賃金公正化が経営課題となる。',
    exampleCountries: ['IS'],
    effectSize: 'high',
    targetMetrics: ['pay_gap', 'managers_f'],
  },
  {
    id: 'pay-gap-disclosure',
    title: '賃金格差の企業開示・是正義務',
    category: 'economy',
    description:
      '一定規模以上の企業に男女賃金格差をスコア化して毎年開示することを義務付け、是正義務と達成期限・罰則をセットで設ける。',
    evidence:
      'フランス（2019年）は50人以上の企業にスコアの開示と85点未満の場合の3年以内是正を義務化。ドイツ・イギリスも同様の開示制度を持つ。開示後、企業の自主的な格差是正行動が増加した。',
    mechanism:
      '開示による「見られている」効果（ホーソン効果）と社会的評判リスクが企業行動を変える。採用市場でも格差の少ない企業が人材獲得で有利になる。',
    exampleCountries: ['FR', 'DE'],
    effectSize: 'medium',
    targetMetrics: ['pay_gap'],
  },
  {
    id: 'board-quota',
    title: '役員・管理職への女性クォータ法',
    category: 'economy',
    description:
      '上場企業・大企業の取締役会や管理職に一定割合（30〜40%）の女性を含めることを法律で義務付け、未達成には報酬無効化・罰金・強制解散等の実効的な罰則を設ける。',
    evidence:
      'ノルウェー（2003年）の40%クォータ導入後、女性役員比率が7%から42%へ。フランス（2011年）は12%から45%へ。ドイツ（2015年）は18%から35%へ改善した。',
    mechanism:
      '自発的な変化を待つのではなく、法的強制力によって「女性が入れる椅子」を先に作ることで、女性候補者のパイプラインと組織文化の変革が加速する。',
    exampleCountries: ['NO', 'FR', 'DE'],
    effectSize: 'high',
    targetMetrics: ['boards_f', 'managers_f'],
  },
  {
    id: 'universal-childcare',
    title: '保育サービスの拡充と公費補助',
    category: 'careWork',
    description:
      '認可保育所・こども園を大幅に拡充し、保護者の負担を実質無償または低額にする。特に1〜3歳の待機児童解消と保育士の処遇改善を一体で進める。',
    evidence:
      '北欧3国は3歳未満の保育利用率が97%前後（日本54%）。保育所の拡充が母親の就業率・フルタイム率を高めることはOECD各国で一貫して確認されている。フランスも保育拡充で母親の就業継続率が上昇した。',
    mechanism:
      'ケアの社会化により、子育てを個人（主に女性）の責任から社会全体の責任へ転換する。女性が「キャリアか育児か」の二択を迫られる状況を制度設計で取り除く。',
    exampleCountries: ['IS', 'SE', 'NO', 'FR'],
    effectSize: 'high',
    targetMetrics: ['childcare_rate', 'labor_f', 'unpaid_care_f', 'managers_f'],
  },
  {
    id: 'flexible-work',
    title: 'フレキシブルワーク・在宅勤務の法的保障',
    category: 'economy',
    description:
      '育児・介護を担う労働者が時間・場所の柔軟な働き方を申請できる権利を法律で保障し、企業が正当な理由なく拒否できない仕組みを作る。',
    evidence:
      'コロナ禍でのリモートワーク普及後の研究（Goldin等）で、柔軟な就労形態が可能な職種では女性の就業継続率と昇進率が向上することが実証されている。スウェーデン・ドイツはフレックスワーク権を法制化。',
    mechanism:
      '「育児か仕事か」のトレードオフを縮小し、女性がキャリアを中断せずに継続できる条件を整える。男性も育児参加しやすくなる副次効果もある。',
    exampleCountries: ['SE', 'DE'],
    effectSize: 'medium',
    targetMetrics: ['labor_f', 'managers_f', 'unpaid_care_m'],
  },
  {
    id: 'political-quota',
    title: '選挙における女性候補者クォータ制',
    category: 'politics',
    description:
      '比例代表リストに男女を交互に並べる「ジッパー制」や、候補者の一定割合（50%等）を女性にすることを義務付け、達成できない場合はリストを受け付けない罰則を設ける。',
    evidence:
      'フランスはパリテ法（2000年）で男女交互のリストを義務化し、国会女性議員比率が26%から38%へ上昇。北欧諸国は自主的なクォータと合わせて女性議員比率40%超を維持している。',
    mechanism:
      '選挙制度の構造を変えることで「女性が出馬しやすい」慣行を作り、メディア露出や有権者の認識が変わることで長期的な政治参画文化が育つ。',
    exampleCountries: ['NO', 'SE', 'FR'],
    effectSize: 'high',
    targetMetrics: ['parliament_f', 'cabinet_f'],
  },
  {
    id: 'stem-support',
    title: 'STEM教育における女性支援プログラム',
    category: 'education',
    description:
      '理工系分野への女子の進学を促すメンタリング・ロールモデル提示・奨学金制度・アウトリーチプログラムを整備し、女子が「STEM＝男性の世界」という固定観念を持たないよう幼少期から継続的に働きかける。',
    evidence:
      'スウェーデン・カナダ・アイルランドなどでのSTEM女性支援プログラムにより、女性のSTEM系学部進学率が段階的に向上している。特に教師・保護者への意識変革を組み合わせたプログラムが効果的。',
    mechanism:
      '「女性はSTEMが苦手」というステレオタイプを幼少期に解除し、ロールモデルとの接触で自己効力感を高める。構造的な奨学金・採用支援は参入障壁を下げる。',
    exampleCountries: ['SE', 'US'],
    effectSize: 'medium',
    targetMetrics: ['stem_ed_f', 'stem_workforce_f'],
  },
  {
    id: 'dv-legal-framework',
    title: 'DV・性暴力に関する法整備と支援体制の確立',
    category: 'health',
    description:
      'DV・ストーカー・性暴力を包括的に規制する法律を整備し、被害者支援（シェルター・相談窓口・法的支援）と加害者更生プログラムを一体として構築する。刑事司法改革も含めた包括的アプローチが鍵。',
    evidence:
      'アイスランド・スウェーデン・ノルウェーでは強固な法整備と被害者支援体制の組み合わせにより、DVの重篤化率・再犯率が低下している。スウェーデンの性同意法（2018年）はコンセント原則を明確化した。',
    mechanism:
      '法的保護の強化は被害者が声を上げやすくする効果があり、社会的なノーマの変化（「DV・性暴力は許されない」という規範）と組み合わさって長期的に暴力の発生率を下げる。',
    exampleCountries: ['IS', 'SE', 'NO'],
    effectSize: 'medium',
    targetMetrics: ['dv_legal', 'reproductive_rights'],
  },
];
