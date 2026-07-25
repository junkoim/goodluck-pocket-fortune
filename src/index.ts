interface Fetcher { fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>; }
interface Ai { run(model: string, input: unknown): Promise<unknown>; }
type ExportedHandler<E> = { fetch(request: Request, env: E, ctx?: ExecutionContext): Response | Promise<Response> };
interface ExecutionContext { waitUntil(promise: Promise<unknown>): void; passThroughOnException(): void; }
declare const caches: { default: { match(request: Request): Promise<Response | undefined>; put(request: Request, response: Response): Promise<void> } };

interface Env {
  ASSETS: Fetcher;
  AI?: Ai;
  MARKET_CONTEXT_JSON?: string;
}

type Gender = "male" | "female" | "other" | "unspecified";
type BloodType = "A" | "B" | "O" | "AB" | "unknown";
type Handedness = "right" | "left" | "both" | "unknown";
type Orientation = "正位置" | "逆位置";

interface FortuneRequest {
  birthDate: string;
  gender: Gender;
  bloodType: BloodType;
  handedness: Handedness;
}

interface CardData {
  id: number;
  number: string;
  name: string;
  keyword: string;
  image: string;
  uprightTone: string;
  reversedTone: string;
  scene: string;
  trade: string;
  mountain: string;
  uprightBaseScore: number;
  reversedBaseScore: number;
}

interface ReadingJson {
  cardName: string;
  cardNumber: string;
  orientation: Orientation;
  keyword: string;
  fortune: string;
  tradeScore: number;
  tradeFortune: string;
  lotManagementWarning: string;
  goldFortune: string;
  fxFortune: string;
  mountainFortune: string;
  action: string;
  poem: string;
  todayMessage: string;
  recommendArticle: string | null;
  luckyColor: string;
  luckyNumber: number;
}

interface FortuneResult extends ReadingJson {
  date: string;
  tarot: Pick<CardData, "number" | "name" | "keyword" | "image">;
  aiUsed: boolean;
}

interface VariantPack {
  images: readonly string[];
  verbs: readonly string[];
  tradeFocus: readonly string[];
  goldFocus: readonly string[];
  fxFocus: readonly string[];
  mountainFocus: readonly string[];
  poemLines: readonly string[];
}

interface DailyContext {
  date: string;
  weekday: string;
  season: "春" | "夏" | "秋" | "冬";
  market: {
    available: boolean;
    watched: readonly string[];
    notes: readonly string[];
    source: string;
  };
}

const CARDS: readonly CardData[] = [
  { id: 0, number: "0", name: "愚者", keyword: "始まり", image: "00.webp", uprightTone: "身軽な一歩", reversedTone: "足元の確認", scene: "朝霧の入口", trade: "追わずに眺める間合い", mountain: "まだ名前のない道", uprightBaseScore: 3, reversedBaseScore: 2 },
  { id: 1, number: "I", name: "魔術師", keyword: "創造", image: "01.webp", uprightTone: "手元の道具", reversedTone: "準備の整え直し", scene: "小さな灯り", trade: "決めた道具だけ使う静けさ", mountain: "荷物を詰め直す朝", uprightBaseScore: 4, reversedBaseScore: 3 },
  { id: 2, number: "II", name: "女教皇", keyword: "直感", image: "02.webp", uprightTone: "静かな直感", reversedTone: "言葉にならない迷い", scene: "月明かりの水面", trade: "見えない時は待つ判断", mountain: "霧の奥の足音", uprightBaseScore: 3, reversedBaseScore: 2 },
  { id: 3, number: "III", name: "女帝", keyword: "豊かさ", image: "03.webp", uprightTone: "育った実り", reversedTone: "与えすぎた余白", scene: "木漏れ日の草地", trade: "残す利益を大切にする手", mountain: "道端の花", uprightBaseScore: 4, reversedBaseScore: 3 },
  { id: 4, number: "IV", name: "皇帝", keyword: "秩序", image: "04.webp", uprightTone: "境界線", reversedTone: "固くなった肩", scene: "石の道標", trade: "ルールを守る強さ", mountain: "稜線の風", uprightBaseScore: 4, reversedBaseScore: 3 },
  { id: 5, number: "V", name: "法王", keyword: "導き", image: "05.webp", uprightTone: "基本に戻る知恵", reversedTone: "古い正解からの距離", scene: "古い山小屋", trade: "検証した型へ戻る時間", mountain: "地図を読む指先", uprightBaseScore: 4, reversedBaseScore: 3 },
  { id: 6, number: "VI", name: "恋人", keyword: "選択", image: "06.webp", uprightTone: "心に合う選択", reversedTone: "揺れる本音", scene: "二つに分かれる道", trade: "片方を選ぶ勇気", mountain: "分岐の標識", uprightBaseScore: 3, reversedBaseScore: 2 },
  { id: 7, number: "VII", name: "戦車", keyword: "前進", image: "07.webp", uprightTone: "進む力", reversedTone: "手綱の握り直し", scene: "風の強い坂", trade: "勢いを制御する目", mountain: "登り始めの呼吸", uprightBaseScore: 3, reversedBaseScore: 2 },
  { id: 8, number: "VIII", name: "力", keyword: "自制", image: "08.webp", uprightTone: "柔らかな粘り", reversedTone: "休む勇気", scene: "苔むした石", trade: "焦りをなだめる呼吸", mountain: "ゆっくり踏む足裏", uprightBaseScore: 4, reversedBaseScore: 3 },
  { id: 9, number: "IX", name: "隠者", keyword: "内省", image: "09.webp", uprightTone: "離れて見る目", reversedTone: "抱え込みすぎた灯り", scene: "尾根の小さなランタン", trade: "画面から離れる選択", mountain: "静かな休憩地", uprightBaseScore: 3, reversedBaseScore: 2 },
  { id: 10, number: "X", name: "運命の輪", keyword: "転機", image: "10.webp", uprightTone: "流れの変わり目", reversedTone: "遅い回転", scene: "雲の切れ間", trade: "変化を追わず受ける姿勢", mountain: "風向きの変化", uprightBaseScore: 3, reversedBaseScore: 2 },
  { id: 11, number: "XI", name: "正義", keyword: "均衡", image: "11.webp", uprightTone: "事実の秤", reversedTone: "正しさへの疲れ", scene: "水平な岩場", trade: "損切りと利確の均衡", mountain: "歩幅をそろえる道", uprightBaseScore: 4, reversedBaseScore: 3 },
  { id: 12, number: "XII", name: "吊るされた男", keyword: "静止", image: "12.webp", uprightTone: "待つ時間", reversedTone: "我慢のほどき方", scene: "逆さに映る森", trade: "入らないことで守る日", mountain: "立ち止まる木陰", uprightBaseScore: 3, reversedBaseScore: 2 },
  { id: 13, number: "XIII", name: "死神", keyword: "転換", image: "13.webp", uprightTone: "手放す余白", reversedTone: "終わりを恐れる心", scene: "落ち葉の道", trade: "古い負け方を置く勇気", mountain: "季節が変わる峠", uprightBaseScore: 3, reversedBaseScore: 2 },
  { id: 14, number: "XIV", name: "節制", keyword: "調和", image: "14.webp", uprightTone: "ほどよい加減", reversedTone: "乱れたリズム", scene: "細い沢の音", trade: "枚数を減らす静かな調整", mountain: "水を飲む休憩", uprightBaseScore: 4, reversedBaseScore: 2 },
  { id: 15, number: "XV", name: "悪魔", keyword: "執着", image: "15.webp", uprightTone: "欲の正体", reversedTone: "抜け出す習慣", scene: "黒い石の影", trade: "欲張りを見つめる夜", mountain: "重い荷を下ろす場所", uprightBaseScore: 2, reversedBaseScore: 2 },
  { id: 16, number: "XVI", name: "塔", keyword: "崩壊", image: "16.webp", uprightTone: "崩れた予定", reversedTone: "小さな違和感", scene: "遠雷の空", trade: "荒い値動きから距離を取る目", mountain: "天候を見直す尾根", uprightBaseScore: 2, reversedBaseScore: 1 },
  { id: 17, number: "XVII", name: "星", keyword: "希望", image: "17.webp", uprightTone: "遠い光", reversedTone: "小さくした歩幅", scene: "夜明け前の星", trade: "届くまで待つ灯り", mountain: "星の残る登山口", uprightBaseScore: 4, reversedBaseScore: 3 },
  { id: 18, number: "XVIII", name: "月", keyword: "揺らぎ", image: "18.webp", uprightTone: "曖昧な気配", reversedTone: "不安の仕分け", scene: "月夜の湖面", trade: "読めない流れを休む強さ", mountain: "霧の深い林道", uprightBaseScore: 2, reversedBaseScore: 2 },
  { id: 19, number: "XIX", name: "太陽", keyword: "生命", image: "19.webp", uprightTone: "素直な明るさ", reversedTone: "明るさの奥の疲れ", scene: "朝日に光る草", trade: "勝った後ほど静かに畳む心", mountain: "開けた展望", uprightBaseScore: 4, reversedBaseScore: 3 },
  { id: 20, number: "XX", name: "審判", keyword: "目覚め", image: "20.webp", uprightTone: "呼び戻される経験", reversedTone: "自分を裁かない朝", scene: "谷に響く音", trade: "記録から戻る判断", mountain: "来た道を振り返る場所", uprightBaseScore: 3, reversedBaseScore: 2 },
  { id: 21, number: "XXI", name: "世界", keyword: "完成", image: "21.webp", uprightTone: "整った区切り", reversedTone: "未完成の祝福", scene: "広い山頂の空", trade: "終える力を持つ日", mountain: "帰り道まで含めた景色", uprightBaseScore: 4, reversedBaseScore: 3 }
] as const;

const LUCKY_COLORS = ["薄明の青", "古い金色", "朝霧の白", "深い紫", "濡れた石の黒", "木漏れ日の緑", "夕暮れの銅色", "星明かりの銀"] as const;
const WATCHED_MARKETS = ["Gold", "BTC", "USDJPY", "VIX", "FOMC", "CPI", "雇用統計"] as const;
const TODAY_MESSAGE_SUFFIXES = ["今日も一歩ずつ", "焦らず拾う", "小さく整える", "静かに待つ", "余白を残す"] as const;

const DEFAULT_VARIANT: VariantPack = {
  images: ["朝霧", "木漏れ日", "沢の音", "濡れた石", "尾根の風"],
  verbs: ["急がず見る", "小さく進む", "静かに待つ", "一度離れる", "余白を残す"],
  tradeFocus: ["判断の輪郭", "待機力", "欲との距離", "決めた幅", "終える力"],
  goldFocus: ["ボラティリティ", "指標前の静けさ", "利確の余白", "引きつける間合い", "追わない目"],
  fxFocus: ["資金管理", "損切りの線", "エントリー回数", "連敗後の休憩", "メンタルの温度"],
  mountainFocus: ["足元", "装備", "天候", "休憩", "引き返す判断"],
  poemLines: ["風は遅れて届く", "石は黙って光る", "道はまだ消えない", "小さな灯りを持つ", "空は少し残る"]
} as const;

const CARD_VARIANTS: Record<number, VariantPack> = {
  0: { images: ["朝霧の入口", "白い崖の端", "新しい靴紐", "まだ薄い地図", "鳥の影"], verbs: ["身軽に始める", "足元を見る", "余白を選ぶ", "荷を軽くする", "笑わず急がない"], tradeFocus: ["入りすぎない勇気", "最初の一手", "小さなロット感", "追わない目", "試す前の沈黙"], goldFocus: ["速い跳ねに乗りすぎない", "初動を見送る", "ボラティリティの入口", "指標前の深呼吸", "引きつける間合い"], fxFocus: ["ルールを一つだけ持つ", "回数を増やさない", "損切り幅を先に置く", "勢いより資金管理", "新しい手法を試しすぎない"], mountainFocus: ["登山口の朝霧", "靴底の感触", "標識の小さな文字", "軽い荷物", "小鳥の声"], poemLines: ["はじまりは軽い", "まだ道は白い", "風が靴紐をほどく", "一歩だけが今日を開く", "空白にも灯りがある"] },
  1: { images: ["手元の灯り", "銅の器", "細い火花", "磨いた道具", "夜明けの机"], verbs: ["準備を整える", "一つだけ使う", "手元を見る", "形にする", "焦点を結ぶ"], tradeFocus: ["使う道具の限定", "セットアップの精度", "無駄な画面を閉じる", "一手の明確さ", "準備後の待機"], goldFocus: ["XAUUSDの速さに道具を増やさない", "利確位置を先に描く", "指標前に手順を見る", "引きつけた後だけ触れる", "ボラに飲まれない準備"], fxFocus: ["ルールの書き出し", "資金管理表の確認", "損切りを先に決める", "エントリー条件を絞る", "迷うペアを閉じる"], mountainFocus: ["荷物の詰め直し", "水筒の重さ", "地図の折り目", "ヘッドライトの確認", "朝の支度"], poemLines: ["手の中の灯り", "道具は多くなくていい", "小さな火が形を呼ぶ", "準備の音が朝になる", "一つを選べば道は細く光る"] },
  2: { images: ["月明かりの水面", "霧の奥", "閉じた本", "青い沈黙", "夜の湖"], verbs: ["沈黙を聞く", "見えない時は待つ", "直感を薄く持つ", "言葉に急がない", "水面を乱さない"], tradeFocus: ["待機力", "迷いの仕分け", "チャートを見すぎない", "直感をルールで包む", "入らない判断"], goldFocus: ["見えない波を追わない", "指標前後の静観", "ボラの奥を待つ", "引きつけても曖昧なら休む", "利確後に沈黙する"], fxFocus: ["エントリー回数を減らす", "損切り位置を曖昧にしない", "資金管理を紙に戻す", "迷うペアから離れる", "感覚だけで押さない"], mountainFocus: ["朝霧", "沢の反射", "濡れた石", "森の沈黙", "遠い小鳥"], poemLines: ["月は答えを急がない", "水面は少しだけ揺れる", "沈黙にも道がある", "夜の知恵は細い", "見えない光を汲む"] },
  3: { images: ["木漏れ日の草地", "花の影", "熟した実", "やわらかな土", "春の斜面"], verbs: ["育ちを受け取る", "残す利益を見る", "与えすぎない", "満ちた分だけ休む", "ゆるやかに守る"], tradeFocus: ["利益を残す手", "伸ばしすぎない判断", "穏やかな利確", "余裕のある待機", "増やしすぎない枚数"], goldFocus: ["伸びた利益を残す", "ボラの実りを欲張らない", "指標前に畳む余白", "追撃より利確", "金色の波を摘みすぎない"], fxFocus: ["勝った後の過信を避ける", "資金を守る", "回数を増やさない", "利確後に休む", "ルール内で終える"], mountainFocus: ["道端の花", "木漏れ日", "虫の羽音", "草の匂い", "緩い休憩"], poemLines: ["花は急がず開く", "実りは両手に少し", "木漏れ日が肩をほどく", "残したものが明日になる", "土の匂いに幸運がある"] },
  4: { images: ["石の道標", "稜線の柱", "硬い地面", "境界の影", "低い城壁"], verbs: ["線を引く", "守る", "決めた場所に立つ", "崩さない", "余計な扉を閉じる"], tradeFocus: ["規律", "ロットの上限", "損切りの線", "一日の枠", "決めた終了条件"], goldFocus: ["ボラティリティに線を引く", "指標前に枠を守る", "利確と撤退を先に置く", "追いかけない境界", "XAUUSDの速さへ壁を作る"], fxFocus: ["資金管理", "ルール遵守", "損切り固定", "エントリー回数の上限", "勝った後も同じ幅"], mountainFocus: ["石の道標", "稜線の風", "固い靴底", "地図の境界", "予定時刻"], poemLines: ["石は動かない", "線を引く手が守る", "風は境界を知っている", "強さは静かな形", "閉じた門にも灯りがある"] },
  5: { images: ["古い山小屋", "地図の折り目", "鐘の音", "木の階段", "古道"], verbs: ["基本へ戻る", "教わった型を見る", "古い知恵を借りる", "記録を開く", "丁寧に確かめる"], tradeFocus: ["検証済みの型", "記録の読み直し", "基本ルール", "無理な応用を避ける", "いつもの手順"], goldFocus: ["XAUUSDほど基本に戻る", "指標前の型を確認", "ボラに古いルールを当てる", "利確の記録を見る", "見送りも手順に入れる"], fxFocus: ["トレードノート", "資金管理ルール", "損切り記録", "エントリー条件の復習", "連敗時の休憩規定"], mountainFocus: ["地図を読む指先", "古い山小屋", "標識", "登山届", "木の階段"], poemLines: ["古い道にも朝が来る", "地図のしわが教える", "鐘は急がない", "基本は小さな灯り", "戻ることも前へ進むこと"] },
  6: { images: ["二つに分かれる道", "並ぶ影", "分岐の標識", "淡い風", "開いた手"], verbs: ["片方を選ぶ", "本音を聞く", "迷いを減らす", "近い道を選ぶ", "余白を残して決める"], tradeFocus: ["選ばない勇気", "ペアの絞り込み", "一つの条件", "迷う場面の見送り", "心に合う判断"], goldFocus: ["XAUUSDを触る理由を選ぶ", "速さに惹かれて追わない", "指標前は片方に決めつけない", "利確か保有かを先に分ける", "迷うなら待つ"], fxFocus: ["通貨ペアを絞る", "エントリー条件を一つにする", "損切りを選ぶ", "資金配分を迷わせない", "欲と本音を分ける"], mountainFocus: ["分岐の標識", "二つの尾根", "風の通り道", "鳥の声", "道端の花"], poemLines: ["道は二つに光る", "選ばない道も残る", "心の近くで風が鳴る", "手放した方にも空がある", "一つ選べば足音が澄む"] },
  7: { images: ["風の強い坂", "登りの息", "砂利道", "速い雲", "揺れる手綱"], verbs: ["勢いを制御する", "前へ出すぎない", "手綱を握る", "呼吸をそろえる", "挑む前に止まる"], tradeFocus: ["連続エントリーの制御", "勢いの管理", "勝負所の厳選", "追撃の抑制", "熱を冷ます"], goldFocus: ["XAUUSDの急伸急落に飛び乗らない", "ボラを追わず待つ", "利確後の再突入を抑える", "指標後の熱を冷ます", "引きつけてから見る"], fxFocus: ["エントリー回数の制限", "損切り後の再エントリー注意", "資金管理で手綱を取る", "焦りを止める", "勝った後の過信を抑える"], mountainFocus: ["登り始めの呼吸", "風の坂", "砂利", "尾根へ続く道", "汗の冷え"], poemLines: ["風が背を押す", "速さには手綱がいる", "坂は逃げない", "呼吸が道を整える", "前進は静かにもできる"] },
  8: { images: ["苔むした石", "柔らかな手", "深い呼吸", "森の影", "静かな力"], verbs: ["焦りをなだめる", "やわらかく耐える", "力を抜く", "荒さを包む", "静かに粘る"], tradeFocus: ["自制心", "ロットを育てすぎない", "待つ筋力", "損切り後の呼吸", "欲の扱い"], goldFocus: ["ボラに力で向かわない", "XAUUSDの速さを呼吸で受ける", "利確をやさしく守る", "指標前に力を抜く", "追わない強さ"], fxFocus: ["メンタルの温度", "資金管理の継続", "損切り後の落ち着き", "回数を抑える粘り", "ルールを破らない柔らかさ"], mountainFocus: ["苔むした石", "ゆっくり踏む足裏", "森の湿り", "小さな虫", "休憩の水"], poemLines: ["強さは声を荒げない", "苔は石を包む", "呼吸が熱をほどく", "やわらかい手が道を守る", "急がない力が残る"] },
  9: { images: ["尾根のランタン", "一人の休憩地", "暗い森の灯り", "遠い小屋", "静かな背中"], verbs: ["離れて見る", "画面を閉じる", "内側を照らす", "少し黙る", "記録へ戻る"], tradeFocus: ["画面から離れる選択", "孤独な検証", "少ない回数", "記録の灯り", "静かな待機"], goldFocus: ["XAUUSDの速さから離れる", "指標前後はランタンを小さくする", "見えないボラを追わない", "利確後に閉じる", "待つ時間を灯りにする"], fxFocus: ["トレードノート", "連敗後の休憩", "エントリーを絞る", "資金管理の点検", "メンタルを静める"], mountainFocus: ["静かな休憩地", "尾根の灯り", "夜明け前の道", "小屋の窓", "冷たい石"], poemLines: ["小さな灯りで足りる", "遠くを見るために離れる", "沈黙が道を照らす", "一人の時間にも風がある", "明るすぎない光を持つ"] },
  10: { images: ["雲の切れ間", "回る風", "峠の影", "変わる空", "揺れる輪"], verbs: ["変化を受ける", "追わずに待つ", "回転を見送る", "流れを読み直す", "無理に合わせない"], tradeFocus: ["転換点の見極め", "追随しすぎない", "シナリオの更新", "急変後の待機", "回数を減らす"], goldFocus: ["XAUUSDの急な転換を追わない", "ボラの回転を見送る", "指標後の乱れを待つ", "利確後に次を急がない", "引きつけて変化を見る"], fxFocus: ["ルールの再確認", "エントリー回数を抑える", "損切りを遅らせない", "資金管理を固定する", "勝ち負けで判断を変えない"], mountainFocus: ["風向きの変化", "雲の切れ間", "峠", "雨の匂い", "尾根の明暗"], poemLines: ["輪は静かに回る", "雲は形を変える", "追わない手にも運は触れる", "峠の風が知らせる", "変わる空を見上げる"] },
  11: { images: ["水平な岩場", "二つの皿", "真っ直ぐな影", "澄んだ水", "白い線"], verbs: ["均衡を取る", "事実を見る", "線をそろえる", "感情を置く", "重さを量る"], tradeFocus: ["損切りと利確の均衡", "資金管理", "ルールの公平さ", "感情を外す", "記録を見る"], goldFocus: ["XAUUSDの速さに秤を置く", "利確と損切りを同じ重さで見る", "指標前に条件を公平にする", "追う理由を測る", "ボラに偏らない"], fxFocus: ["資金管理", "損切りの一貫性", "エントリー基準", "トレードノート", "感情的な再エントリーを避ける"], mountainFocus: ["歩幅をそろえる道", "水平な岩場", "沢の透明さ", "白い石", "予定と体力"], poemLines: ["秤は静かに揺れる", "水はまっすぐ低い方へ行く", "正しさより均衡", "白い線を越えすぎない", "軽い心で量る"] },
  12: { images: ["逆さに映る森", "木陰の停止", "吊られた時間", "止まった雫", "静かな枝"], verbs: ["待つ", "入らず守る", "景色を逆から見る", "我慢をほどく", "時間を置く"], tradeFocus: ["待機", "ノートレードの価値", "入らない判断", "焦りの停止", "時間差の確認"], goldFocus: ["XAUUSDを触らず観察する", "ボラが落ち着くまで待つ", "指標前の停止", "利確後に休む", "逆行時に無理をしない"], fxFocus: ["エントリーを待つ", "資金を減らさない", "損切り後の休止", "回数を絞る", "焦りの停止"], mountainFocus: ["立ち止まる木陰", "逆さの森", "枝の影", "休憩の水", "沢の音"], poemLines: ["止まる時間が道になる", "逆さの森に空がある", "待つ手は何も失わない", "雫は落ちる時を知る", "静止にも風は通る"] },
  13: { images: ["落ち葉の道", "季節の峠", "枯れ枝", "黒い土", "朝の冷気"], verbs: ["手放す", "終える", "古い癖を置く", "区切る", "軽くなる"], tradeFocus: ["古い負け方を置く", "損切りの受容", "終了条件", "手法の整理", "執着を切る"], goldFocus: ["XAUUSDで古い追い方を終える", "利確後に欲を残さない", "逆行時に切る", "指標前に区切る", "ボラへ執着しない"], fxFocus: ["損切りを認める", "資金管理を優先する", "連敗の流れを断つ", "エントリー癖を減らす", "記録を整理する"], mountainFocus: ["落ち葉", "季節が変わる峠", "冷たい土", "枯れ枝", "帰り道"], poemLines: ["落ち葉は道を隠さない", "終わりは静かな入口", "手放した手に風が残る", "季節は声を荒げない", "軽くなった影が歩く"] },
  14: { images: ["細い沢の音", "水を注ぐ手", "静かな器", "緩い流れ", "淡い朝"], verbs: ["調和を取る", "待つ", "混ぜすぎない", "ほどよく整える", "流れを細くする"], tradeFocus: ["枚数を減らす調整", "ロット管理", "待機力", "利確と損切りの幅", "淡い規律"], goldFocus: ["XAUUSDのボラを細く受ける", "指標前は水を濁さない", "利確をほどよく残す", "引きつける", "速さに混ざりすぎない"], fxFocus: ["資金管理", "エントリー回数の調整", "損切り幅の見直し", "ルールの温度", "メンタルを整える"], mountainFocus: ["細い沢", "水を飲む休憩", "濡れた石", "木漏れ日", "静かな尾根"], poemLines: ["水は急がず混ざる", "器には余白がいる", "沢の音が心を整える", "ちょうどよさは小さな光", "待つことで流れが澄む"] },
  15: { images: ["黒い石の影", "重い鎖", "濃い夜", "甘い匂い", "閉じた洞"], verbs: ["欲を見つめる", "執着から離れる", "焦りをほどく", "重さを下ろす", "誘惑を見送る"], tradeFocus: ["取り返したい気持ち", "ロット欲", "連続エントリー", "執着", "離れる選択"], goldFocus: ["XAUUSDの速さに欲を重ねない", "大きなボラを追わない", "利確後の再突入注意", "指標前の誘惑を見送る", "含み損へ執着しない"], fxFocus: ["ロットを抑える", "連続エントリーを避ける", "損切り後の休憩", "資金管理", "取り返そうとしない"], mountainFocus: ["重い荷を下ろす場所", "黒い石", "暗い森", "湿った根", "引き返す道"], poemLines: ["欲は影を長くする", "鎖は見つめると細くなる", "黒い石にも朝露がある", "離れる足音は弱くない", "夜を置いて進む"] },
  16: { images: ["遠雷の空", "崩れた石段", "急な雨", "割れた雲", "濡れた尾根"], verbs: ["距離を取る", "守れるものを先に守る", "予定を崩す", "違和感を見る", "無理をしない"], tradeFocus: ["荒い値動きから距離", "損失限定", "見送り", "急変後の停止", "資金防衛"], goldFocus: ["XAUUSDの荒いボラから距離を取る", "指標前後は特に慎重", "逆行時に無理をしない", "利確を残す", "崩れた形を追わない"], fxFocus: ["損切りを遅らせない", "ロットを抑える", "連続エントリー停止", "資金管理最優先", "感情的な再挑戦を避ける"], mountainFocus: ["遠雷", "雨", "天候を見直す尾根", "濡れた石段", "引き返す判断"], poemLines: ["雷は遠くで知らせる", "崩れる前に守る", "雨の匂いが道を変える", "戻る足跡も山の一部", "割れた雲から光が細い"] },
  17: { images: ["夜明け前の星", "小さな光", "冷たい空", "遠い灯", "澄んだ水"], verbs: ["希望を小さく持つ", "届くまで待つ", "光を見失わない", "歩幅を細くする", "静かに信じる"], tradeFocus: ["待つ灯り", "冷静な期待", "小さな根拠", "無理に伸ばさない", "規律ある希望"], goldFocus: ["XAUUSDの光る値動きを追いすぎない", "利確を星のように残す", "指標前は遠くから見る", "引きつけて待つ", "ボラの中の小さな根拠"], fxFocus: ["資金管理の光", "ルールを信じる", "エントリーを厳選", "損切り後も崩れない", "勝ちを伸ばしすぎない"], mountainFocus: ["星の残る登山口", "冷たい空気", "朝霧", "小鳥の声", "澄んだ沢"], poemLines: ["星は遠くても消えない", "小さな光で歩ける", "夜明けは声を出さない", "希望は手のひらほどでいい", "空の奥に道がある"] },
  18: { images: ["月夜の湖面", "霧の林道", "揺れる影", "濡れた葉", "青い夜"], verbs: ["曖昧さを分ける", "不安を置く", "読めない時は休む", "影を追わない", "夜を待つ"], tradeFocus: ["迷い", "不安の仕分け", "見送り", "勘だけで入らない", "チャートを見すぎない"], goldFocus: ["XAUUSDの読めないボラを休む", "指標前後の影を追わない", "引きつけても不明なら見送る", "利確後に夜を置く", "急な反転を断定しない"], fxFocus: ["損切りを曖昧にしない", "資金管理で不安を区切る", "エントリー回数を減らす", "メンタルの揺れを見る", "連敗後は休む"], mountainFocus: ["霧の深い林道", "月夜", "濡れた葉", "沢の暗さ", "虫の声"], poemLines: ["月は水面で揺れる", "影にも理由はある", "夜を急がせない", "不安を小石のように置く", "霧の奥で鳥が鳴く"] },
  19: { images: ["朝日に光る草", "開けた展望", "乾いた道", "明るい尾根", "金の空"], verbs: ["明るさを受ける", "勝った後に休む", "素直に終える", "開けた場所で止まる", "光を残す"], tradeFocus: ["勝った後の過信注意", "利確後の休憩", "明るい判断", "ロットを増やさない", "終える力"], goldFocus: ["XAUUSDの明るい値動きでも追いすぎない", "利確を陽だまりに残す", "指標後の熱を冷ます", "ボラの眩しさに注意", "勝った後ほど静かに畳む"], fxFocus: ["資金管理を崩さない", "エントリー回数を増やさない", "利確後に休む", "過信を置く", "損切りも明るく受ける"], mountainFocus: ["朝日に光る草", "開けた展望", "乾いた石", "小鳥", "花の色"], poemLines: ["太陽は急かさない", "明るさにも休憩がいる", "草は光を少し返す", "眩しい日ほど影を見る", "終えた手に朝が残る"] },
  20: { images: ["谷に響く音", "戻る声", "朝の鐘", "古い足跡", "白い息"], verbs: ["記録へ戻る", "呼び戻す", "裁かない", "経験を聞く", "やり直す"], tradeFocus: ["トレード記録", "過去の癖", "自責しない修正", "ルールへの復帰", "損失後の学び"], goldFocus: ["XAUUSDの過去チャートを見る", "指標前後の記録へ戻る", "利確できた理由を聞く", "逆行の癖を裁かない", "次を急がない"], fxFocus: ["トレードノート", "損切り記録", "資金管理の復帰", "連敗の原因整理", "再エントリー前の確認"], mountainFocus: ["来た道を振り返る場所", "谷の音", "古い足跡", "朝の鐘", "白い息"], poemLines: ["谷に声が返る", "過去は責めずに灯る", "足跡が今日を呼ぶ", "鐘は一度だけ鳴る", "戻った道にも朝がある"] },
  21: { images: ["広い山頂の空", "帰り道の光", "円い地平", "遠い稜線", "澄んだ終点"], verbs: ["区切る", "終える", "帰り道まで見る", "完成を小さく祝う", "広く眺める"], tradeFocus: ["終える力", "一日の区切り", "利確後の停止", "資金を残す", "完了の判断"], goldFocus: ["XAUUSDで終える場所を先に持つ", "利確後に追わない", "ボラの終点を探しすぎない", "指標前に区切る", "利益を残す"], fxFocus: ["一日の終了条件", "資金管理の完了", "エントリー回数の締め", "損切り後の区切り", "勝った後に閉じる"], mountainFocus: ["帰り道まで含めた景色", "広い山頂の空", "遠い稜線", "石の上の休憩", "夕方の風"], poemLines: ["終点にも風がある", "帰り道までが景色", "円い空に今日を置く", "終える手が運を残す", "世界は静かに閉じる"] }
};

function json(data: unknown, status = 200, cacheControl = "no-store"): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": cacheControl,
      "x-content-type-options": "nosniff"
    }
  });
}

function getJstDate(): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

function getWeekday(date: string): string {
  const value = new Date(`${date}T00:00:00+09:00`);
  return new Intl.DateTimeFormat("ja-JP", { timeZone: "Asia/Tokyo", weekday: "long" }).format(value);
}

function getSeason(date: string): DailyContext["season"] {
  const month = Number(date.slice(5, 7));
  if (month >= 3 && month <= 5) return "春";
  if (month >= 6 && month <= 8) return "夏";
  if (month >= 9 && month <= 11) return "秋";
  return "冬";
}

function weekdayMarketNote(weekday: string): string {
  if (weekday === "土曜日" || weekday === "日曜日") return "週末は市場の足音が遠くなりやすい日";
  if (weekday === "月曜日") return "週明けは流れを急いで決めつけない日";
  if (weekday === "金曜日") return "週末前は利益と疲れを残しすぎない日";
  return "平日の市場は指標と流動性の変化を静かに見る日";
}

function seasonNatureNote(season: DailyContext["season"]): string {
  if (season === "春") return "花と朝霧が足元を明るくする季節";
  if (season === "夏") return "沢と木漏れ日が呼吸を冷ます季節";
  if (season === "秋") return "紅葉と落葉が歩幅を整える季節";
  return "霜と雪と静かな森が音を小さくする季節";
}

function buildDailyContext(date: string, env: Env): DailyContext {
  const weekday = getWeekday(date);
  const season = getSeason(date);
  const notes = [weekdayMarketNote(weekday), seasonNatureNote(season)];

  if (env.MARKET_CONTEXT_JSON) {
    try {
      const parsed = JSON.parse(env.MARKET_CONTEXT_JSON) as { watched?: string[]; notes?: string[]; source?: string };
      return {
        date,
        weekday,
        season,
        market: {
          available: true,
          watched: parsed.watched?.length ? parsed.watched.slice(0, 12) : WATCHED_MARKETS,
          notes: parsed.notes?.length ? [...notes, ...parsed.notes.slice(0, 8)] : notes,
          source: parsed.source || "MARKET_CONTEXT_JSON"
        }
      };
    } catch {
      // Invalid optional market context should never block a reading.
    }
  }

  return {
    date,
    weekday,
    season,
    market: {
      available: false,
      watched: WATCHED_MARKETS,
      notes,
      source: "future-market-data-extension"
    }
  };
}

function dailyCacheKey(origin: string, date: string, input: FortuneRequest): Request {
  const key = [
    "v4.0",
    date,
    input.birthDate,
    input.gender,
    input.bloodType,
    input.handedness
  ].map(encodeURIComponent).join("/");
  return new Request(`${origin}/api/fortune-cache/${key}`, { method: "GET" });
}

function validate(input: unknown): FortuneRequest | null {
  if (!input || typeof input !== "object") return null;
  const data = input as Record<string, unknown>;
  const birthDate = typeof data.birthDate === "string" ? data.birthDate : "";
  const gender = data.gender as Gender;
  const bloodType = data.bloodType as BloodType;
  const handedness = data.handedness as Handedness;
  const date = new Date(`${birthDate}T00:00:00Z`);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate) || Number.isNaN(date.getTime()) || date > new Date()) return null;
  if (!["male", "female", "other", "unspecified"].includes(gender)) return null;
  if (!["A", "B", "O", "AB", "unknown"].includes(bloodType)) return null;
  if (!["right", "left", "both", "unknown"].includes(handedness)) return null;
  return { birthDate, gender, bloodType, handedness };
}

async function hashToNumbers(seed: string): Promise<number[]> {
  const bytes = new TextEncoder().encode(seed);
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
  return [...digest];
}

function clampScore(value: unknown, fallback = 3): number {
  const numeric = Math.round(Number(value));
  const safe = Number.isFinite(numeric) ? numeric : fallback;
  return Math.max(1, Math.min(5, safe));
}

function normalizeText(value: unknown, fallback: string, minLength = 8): string {
  const text = typeof value === "string" ? value.trim() : "";
  if (text.length < minLength) return fallback;
  return text.replace(/\r\n/g, "\n");
}

function extractJson(value: unknown): Partial<ReadingJson> | null {
  const raw = typeof value === "object" && value && "response" in value
    ? String((value as { response?: unknown }).response || "")
    : "";
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]) as Partial<ReadingJson>;
  } catch {
    return null;
  }
}

function pick<T>(items: readonly T[], h: number[], offset: number): T {
  return items[h[offset % h.length] % items.length];
}

function pickDifferent<T>(items: readonly T[], h: number[], offset: number, avoid: T): T {
  if (items.length < 2) return avoid;
  const first = pick(items, h, offset);
  if (first !== avoid) return first;
  const index = (items.indexOf(first) + 1 + (h[(offset + 1) % h.length] % (items.length - 1))) % items.length;
  return items[index] === avoid ? items[(index + 1) % items.length] : items[index];
}

function variantFor(card: CardData): VariantPack {
  return CARD_VARIANTS[card.id] || DEFAULT_VARIANT;
}

function compactLines(lines: readonly string[]): string {
  return lines.filter(Boolean).join("\n");
}

function clampLuckyNumber(value: unknown, fallback: number): number {
  const numeric = Math.round(Number(value));
  if (!Number.isFinite(numeric)) return fallback;
  return Math.max(1, Math.min(99, numeric));
}

function todayMessageFor(card: CardData, h: number[]): string {
  const variant = variantFor(card);
  const line = pick(variant.poemLines, h, 14).replace(/[。、.]/g, "");
  const suffix = pick(TODAY_MESSAGE_SUFFIXES, h, 15);
  const message = `${line}。${suffix}。`;
  if (message.length >= 20 && message.length <= 40) return message;
  const compact = `${card.keyword}を小さく持つ。${suffix}。`;
  return compact.length <= 40 ? compact : `${card.keyword}を小さく持つ。`;
}

function seasonMountainLine(season: DailyContext["season"], h: number[]): string {
  const seasonal = {
    "春": ["花の色", "朝霧", "やわらかな土", "芽吹き", "小鳥の声"],
    "夏": ["沢の音", "木漏れ日", "濡れた石", "虫の羽音", "深い緑"],
    "秋": ["紅葉", "落葉", "乾いた尾根", "夕暮れの風", "木の実"],
    "冬": ["霜", "雪の気配", "静かな森", "白い息", "凍った石"]
  } as const;
  return pick(seasonal[season], h, 16);
}

function tradeScoreFor(card: CardData, orientation: Orientation, h: number[]): number {
  const base = orientation === "正位置" ? card.uprightBaseScore : card.reversedBaseScore;
  const inputTilt = ((h[2] + h[5] + h[11]) % 3) - 1;
  const cardTilt = card.id === 4 || card.id === 8 || card.id === 11 || card.id === 14 || card.id === 17 || card.id === 19 || card.id === 21 ? 1 : 0;
  const riskTilt = orientation === "逆位置" && [0, 7, 10, 15, 16, 18].includes(card.id) ? -1 : 0;
  const adjustment = Math.max(-1, Math.min(1, inputTilt + cardTilt + riskTilt));
  return clampScore(base + adjustment, base);
}

function tradeFortuneFor(score: number, card: CardData, orientation: Orientation): string {
  const variant = variantFor(card);
  const focus = variant.tradeFocus[score % variant.tradeFocus.length];
  if (score >= 5) {
    return compactLines([
      `${focus}が`,
      "見えやすい日",
      "",
      "ただし",
      "調子の良さを理由に",
      "大きくしない"
    ]);
  }
  if (score === 4) {
    return compactLines([
      `${card.trade}を`,
      "静かに守る日",
      "",
      "いつもの幅で",
      "相場を見る"
    ]);
  }
  if (score === 3) {
    return compactLines([
      "流れは",
      "まだ定まらない",
      "",
      "数を減らし",
      `${focus}だけを見る`
    ]);
  }
  if (score === 2) {
    return compactLines([
      `${orientation === "逆位置" ? card.reversedTone : card.uprightTone}が`,
      "前へ出やすい日",
      "",
      "ロットを抑え",
      `${focus}を急がない`
    ]);
  }
  return compactLines([
    "今日は",
    "相場に参加しない選択もある",
    "",
    "チャートを見るだけで終えることも",
    "立派なトレード"
  ]);
}

function lotWarningFor(score: number): string {
  if (score >= 3) return "";
  if (score === 1) {
    return `参加しない選択もある\n\nチャートを見るだけで\n終えてもいい`;
  }
  return `数量を抑え\nエントリー回数を絞る\n\n一度負けたあとほど\n次の判断を急がない`;
}

function fallbackReading(card: CardData, orientation: Orientation, h: number[], context: DailyContext): ReadingJson {
  const isUpright = orientation === "正位置";
  const tone = isUpright ? card.uprightTone : card.reversedTone;
  const tradeScore = tradeScoreFor(card, orientation, h);
  const variant = variantFor(card);
  const image = pick(variant.images, h, 3);
  const verb = pick(variant.verbs, h, 4);
  const goldFocus = pick(variant.goldFocus, h, 5);
  const fxFocus = pick(variant.fxFocus, h, 6);
  const mountainFocus = pick(variant.mountainFocus, h, 7);
  const seasonalMountain = seasonMountainLine(context.season, h);
  const poemLine = pick(variant.poemLines, h, 8);
  const secondPoemLine = pickDifferent(variant.poemLines, h, 12, poemLine);
  const mountainScene = pickDifferent(variant.images, h, 9, mountainFocus);
  const goldLine = isUpright
    ? `${goldFocus}\n金色の波の手前に置く`
    : `${goldFocus}\n追いかけず見送る余白を残す`;
  const fxLine = isUpright
    ? `${fxFocus}\n今日の小さな柵にする`
    : `${fxFocus}\nもう一度だけ確かめる`;
  const mountainLine = isUpright
    ? `${mountainFocus}に\n小さな合図がある`
    : `${mountainFocus}を\n無理に越えない`;

  return {
    cardName: card.name,
    cardNumber: card.number,
    orientation,
    keyword: card.keyword,
    fortune: compactLines([
      `${context.weekday}の${image}に`,
      `${tone}の気配がある`,
      "",
      context.market.notes[0],
      "",
      `${verb}`,
      "",
      "急がなくても",
      "道はまだ消えない"
    ]),
    tradeScore,
    tradeFortune: tradeFortuneFor(tradeScore, card, orientation),
    lotManagementWarning: lotWarningFor(tradeScore),
    goldFortune: compactLines([
      goldLine,
      "",
      "XAUUSDの速さより",
      "自分の間合い",
      "",
      context.market.available ? "市場の風を" : "市場の風は",
      context.market.available ? "静かに重ねて見る" : "まだ余白として見る",
      "",
      "指標前後は",
      "灯りを少し小さくする"
    ]),
    fxFortune: compactLines([
      fxLine,
      "",
      "増やすことより",
      "残すこと",
      "",
      "損切りの線を",
      "先に置く"
    ]),
    mountainFortune: compactLines([
      mountainLine,
      "",
      `${context.season}の${seasonalMountain}を`,
      "小さな目印にする",
      "",
      `${mountainScene}のそばで`,
      "足元を見直す",
      "",
      "天候と道を確認し",
      "安全を近くに置く"
    ]),
    action: isUpright
      ? "チャートを閉じて\n空を見る"
      : "一度止まり\n靴紐を結び直す",
    poem: compactLines([
      image,
      "",
      poemLine,
      "",
      "風は",
      "少し遅れて",
      "山を越える",
      "",
      secondPoemLine
    ]),
    todayMessage: todayMessageFor(card, h),
    recommendArticle: "",
    luckyColor: LUCKY_COLORS[h[7] % LUCKY_COLORS.length],
    luckyNumber: 1 + (h[8] % 99)
  };
}

function mergeReading(base: ReadingJson, ai: Partial<ReadingJson> | null): ReadingJson {
  if (!ai) return base;
  const tradeScore = clampScore(ai.tradeScore, base.tradeScore);
  return {
    cardName: base.cardName,
    cardNumber: base.cardNumber,
    orientation: base.orientation,
    keyword: base.keyword,
    fortune: normalizeText(ai.fortune, base.fortune, 30),
    tradeScore,
    tradeFortune: normalizeText(ai.tradeFortune, base.tradeFortune, 12),
    lotManagementWarning: tradeScore < 3 ? normalizeText(ai.lotManagementWarning, lotWarningFor(tradeScore), 12) : "",
    goldFortune: normalizeText(ai.goldFortune, base.goldFortune, 24),
    fxFortune: normalizeText(ai.fxFortune, base.fxFortune, 24),
    mountainFortune: normalizeText(ai.mountainFortune, base.mountainFortune, 24),
    action: normalizeText(ai.action, base.action, 8),
    poem: normalizeText(ai.poem, base.poem, 20),
    todayMessage: normalizeText(ai.todayMessage, base.todayMessage, 8),
    recommendArticle: typeof ai.recommendArticle === "string" ? ai.recommendArticle.trim() : base.recommendArticle,
    luckyColor: normalizeText(ai.luckyColor, base.luckyColor, 2),
    luckyNumber: clampLuckyNumber(ai.luckyNumber, base.luckyNumber)
  };
}

async function aiReading(env: Env, card: CardData, orientation: Orientation, fallback: ReadingJson, context: DailyContext): Promise<{ reading: ReadingJson; aiUsed: boolean }> {
  if (!env.AI) return { reading: fallback, aiUsed: false };
  const variant = variantFor(card);

  try {
    const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct-fast", {
      messages: [
        {
          role: "system",
          content: `あなたはGoodLuck Pocket専属のAI詩人です。
あなたは占い師ではありません。
未来を当てることもしません。

あなたが見るものは
今日という景色です。

タロットカード
市場
季節
曜日
自然

これらを重ね合わせ
今日という空気を書いてください。

読む人の背中を
少しだけ押してください。

断定しない。
説教しない。
希望だけでもない。
恐怖でもない。
静かな余韻を残してください。

カードは
今日の心の鏡です。

市場は
今日の風です。

自然は
今日のリズムです。

その三つを
静かな日本語で一つの物語にしてください。

必須ルール:
一行を短くする
スマホで読みやすく改行する
説明ではなく情景を書く
同じ語尾を繰り返さない
同じ比喩を続けない
占い用語を多用しない
未来を断定しない
不安を煽らない
句読点を最小限にする

生成する項目:
今日の運勢
トレード運
ゴールド運
FX運
登山の運
今日の一歩
カードからの短いポエム
今日の言葉

トレード運を1〜5の整数で評価してください。
この星評価は勝率や利益予測ではありません。
その日の心理状態、規律、冷静さ、欲、焦り、待機力、自制心を
カードの象徴から読み取った目安です。
星5でも、勝てる、利益が出る、ロットを上げてよい、とは表現しないでください。
星1でも、必ず負ける、取引してはいけない、とは断定しないでください。
星3未満の場合だけ
ロットを抑える
エントリー回数を減らす
連続エントリーを避ける
取り返そうとしない
という趣旨の注意文を静かに生成してください。

ゴールド運はXAUUSD向けにしてください。
市場情報が取得できる場合は
その日の市場の空気を反映してください。
ボラティリティ
待つ
引きつける
利確
焦らない
指標前後の慎重さ
を自然に織り交ぜてください。
売買指示
投資助言
価格予想
方向性
上昇予想
下落予想
具体的な価格
ロング
ショート
買い
売り
エントリー指示
は出さないでください。

FX運はゴールド運と分けてください。
資金管理
規律
エントリー回数
損切り
メンタル
連敗後の休憩
を中心にしてください。

登山の運はGoodLuck Pocketの大切な特徴です。
山頂ばかりを書かず
朝霧、木漏れ日、沢、小鳥、花、石、尾根、雨、虫、森など
自然の細部を変えてください。
危険な登山や悪天候での強行を勧めないでください。

今日の一歩は一つだけ。
短く。
必ず実行できる内容にしてください。

ポエムは6〜10行。
説明ではなく詩にしてください。

今日の言葉は20〜40文字程度。
GoodLuck Pocket全体からの一言として
余韻を残してください。

recommendArticleは将来のブログ連携用です。
現時点では空文字で構いません。

返答はJSONのみ。説明文やMarkdownを付けないでください。`
        },
        {
          role: "user",
          content: JSON.stringify({
            cardName: card.name,
            cardNumber: card.number,
            orientation,
            keyword: card.keyword,
            today: {
              date: context.date,
              weekday: context.weekday,
              season: context.season
            },
            marketContext: context.market,
            scene: card.scene,
            tradeHint: card.trade,
            mountainHint: card.mountain,
            dailySeedNote: "同じ日と同じ入力では同じ景色になるよう、このヒント群から組み立てること。",
            variationHints: {
              images: variant.images,
              verbs: variant.verbs,
              tradeFocus: variant.tradeFocus,
              goldFocus: variant.goldFocus,
              fxFocus: variant.fxFocus,
              mountainFocus: variant.mountainFocus,
              poemLines: variant.poemLines
            },
            baseTradeScore: fallback.tradeScore,
            requiredShape: {
              cardName: "節制",
              cardNumber: "XIV",
              orientation: "正位置",
              keyword: "調和",
              fortune: "今日の運勢",
              tradeScore: 4,
              tradeFortune: "トレード運の本文",
              lotManagementWarning: "",
              goldFortune: "ゴールド運",
              fxFortune: "FX運",
              mountainFortune: "登山の運",
              action: "今日の一歩",
              poem: "カードからのポエム",
              todayMessage: "今日の言葉",
              recommendArticle: "",
              luckyColor: "薄明の青",
              luckyNumber: 7
            }
          })
        }
      ],
      max_tokens: 780,
      temperature: 0.35
    });
    const parsed = extractJson(response);
    const merged = mergeReading(fallback, parsed);
    return { reading: merged, aiUsed: Boolean(parsed) };
  } catch (error) {
    console.error("Workers AI fallback:", error);
    return { reading: fallback, aiUsed: false };
  }
}

async function buildFortune(input: FortuneRequest, env: Env): Promise<FortuneResult> {
  const date = getJstDate();
  const context = buildDailyContext(date, env);
  const h = await hashToNumbers(`${date}|${input.birthDate}|${input.gender}|${input.bloodType}|${input.handedness}|v4.0`);
  const card = CARDS[h[0] % CARDS.length];
  const orientation: Orientation = (h[1] % 2 === 0) ? "正位置" : "逆位置";
  const fallback = fallbackReading(card, orientation, h, context);
  const { reading, aiUsed } = await aiReading(env, card, orientation, fallback, context);

  return {
    date,
    tarot: { number: card.number, name: card.name, keyword: card.keyword, image: `/cards/${card.image}` },
    ...reading,
    aiUsed
  };
}

export default {
  async fetch(request: Request, env: Env, ctx?: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/fortune") {
      if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
      const contentLength = Number(request.headers.get("content-length") || "0");
      if (contentLength > 10_000) return json({ error: "Request too large" }, 413);

      try {
        const input = validate(await request.json());
        if (!input) return json({ error: "入力内容を確認してください。" }, 400);
        const date = getJstDate();
        const cacheKey = dailyCacheKey(url.origin, date, input);
        const cached = await caches.default.match(cacheKey).catch(() => undefined);
        if (cached) return json(await cached.json());

        const result = await buildFortune(input, env);
        const response = json(result);
        const cacheResponse = json(result, 200, "public, max-age=86400");
        ctx?.waitUntil(caches.default.put(cacheKey, cacheResponse).catch(() => undefined));
        return response;
      } catch {
        return json({ error: "占い結果を生成できませんでした。時間をおいて再度お試しください。" }, 500);
      }
    }

    return env.ASSETS.fetch(request);
  }
} satisfies ExportedHandler<Env>;
