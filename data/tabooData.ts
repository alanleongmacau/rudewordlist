import { TabooItem } from "@/types/taboo";

export const tabooData: TabooItem[] = [

  // ─── 1. 日本：關東 / 關西 バカ 差異 ─────────────────────────────────────────
  {
    id: "baka-jp",
    word: "バカ (Baka)",
    language: "Japanese",
    country: "Japan",
    regions: ["Kanto", "Kansai"],
    lat: 36.2,
    lng: 138.25,
    type: "Dialect Trap",
    severity_level: "Yellow",
    literal_meaning: "笨蛋、傻瓜（Stupid / Idiot）",
    misunderstood_as: "在關東（東京）等同正面侮辱，越大聲越嚴重，可能引發嚴重衝突",
    cultural_context:
      "「バカ」在關西（大阪・京都）朋友間是親密調侃的吐槽用語，是搞笑文化（ツッコミ）的核心詞彙。但在關東（東京）同樣的詞卻帶有直接批評的意涵，對陌生人或長輩使用風險極高。地域差異之大，足以讓同一個詞從破冰神器變成社死炸彈。",
    bonding_rate: 58,
    offense_risk: 72,
    tags: ["🗺️ 方言陷阱", "酒吧必備", "長輩雷區"],
    banter_context:
      "在關西（大阪・京都）的朋友圈，「バカ！」是親密的吐槽，宛如台灣人互稱「白癡」一樣日常。當地搞笑文化（ツッコミ）的核心用詞，笑著說完全沒問題——不說反而顯得冷漠。居酒屋裡越吵越親近。",
    insult_context:
      "在關東（東京）對陌生人或長輩直接說「バカ」等同正面開罵，語氣越重、分貝越高越嚴重。帶著關西親密習慣進東京居酒屋，是最常見的跨地雷區。對上司或長輩，這個詞在東京絕無任何友善空間。",
    is_trending: true,
  },

  // ─── 2. 英國足球酒吧：反手 V 字手勢 ───────────────────────────────────────
  {
    id: "reverse-v-uk",
    word: "✌️ 反手 V 字 (Reverse V-sign)",
    language: "Non-verbal / Gesture",
    country: "United Kingdom",
    regions: ["England", "Scotland", "Wales"],
    lat: 51.5,
    lng: -1.5,
    type: "Gesture Taboo",
    severity_level: "Red",
    literal_meaning: "（依方向不同）勝利 / 和平 或 極度侮辱",
    misunderstood_as: "反手 V 字在英國等同豎中指，是最嚴重的侮辱手勢，可能引發肢體衝突",
    cultural_context:
      "英國足球酒吧文化的高危手勢。手心方向決定一切：手心朝外（手背對自己）是 Churchill 式 V for Victory；手背朝外（手心對自己）則是英式 F*** You，程度等同豎中指。大量亞洲遊客拍照時不自覺做出反手版，在英格蘭球賽現場是極度危險的行為。",
    bonding_rate: 4,
    offense_risk: 96,
    tags: ["🤚 肢體語言", "酒吧必備", "⛔ 絕對高危"],
    banter_context:
      "手心朝外的正面 V 字（手背朝自己）是全球通用的勝利／和平手勢，Churchill 的 V for Victory 就是此版本。英國人拍照時比正面 V 完全無害，是標準觀光客動作，對方球迷看到也不會有反應。",
    insult_context:
      "手背朝外的「反手 V 字」（手心朝自己）在英國及愛爾蘭等同豎中指，是最嚴重侮辱手勢之一。英格蘭足球酒吧裡對著對方球迷比出此手勢，可能直接引發群架。許多亞洲遊客拍照時習慣性反手比 V，在英國需極度警覺——尤其在任何球賽場合。",
    is_trending: true,
  },

  // ─── 3. 粵語區（香港 / 澳門）：仆街 / 頂你情境差異 ─────────────────────────
  {
    id: "puk-gaai-hk",
    word: "仆街 / 頂你",
    language: "Cantonese",
    country: "China",
    regions: ["Hong Kong", "Macau"],
    lat: 22.3,
    lng: 114.17,
    type: "Vulgar Slang",
    severity_level: "Red",
    literal_meaning: "仆街：字面為「倒斃在街頭」；頂你：「頂撞你」（Cantonese expletives）",
    misunderstood_as:
      "外來者誤以為是普通口頭禪，實為粵語最嚴重粗口之一，在陌生場合使用極易引發衝突",
    cultural_context:
      "「仆街」與「頂你」是港澳粵語日常發洩詞，情境差異極大。熟識度與場合是唯一判斷邊界的依據。外來者若因聽到本地人使用便跟著模仿，幾乎必然踩雷——只有在地人才知道那條隱形紅線在哪裡。",
    bonding_rate: 28,
    offense_risk: 87,
    tags: ["🚫 粗口警告", "酒吧必備", "📍 地區限定"],
    banter_context:
      "在香港及澳門的至交好友圈，「仆街！」可作驚訝感嘆詞，類似英語「Oh sh*t!」，不帶惡意；「頂你咋」則是輕鬆的抱怨表達。本地年輕人日常對話偶爾使用，需要極深的熟識度——這條線只有本地人能準確判斷。",
    insult_context:
      "「仆街」字面意指「倒斃在街頭」，是咒人橫死的最惡毒粵語粗口之一。「頂你」（頂撞你）對長輩、上司或陌生人使用，等同嚴重失禮甚至人身攻擊。外來者在不熟識的場合使用，極易被視為刻意挑釁，引發口頭甚至肢體衝突。",
    is_trending: false,
  },

  // ─── 4. 北美：那個 / 內個 N-word 發音陷阱 ────────────────────────────────
  {
    id: "neige-nword",
    word: "那個 / 內個 (Nèi ge)",
    language: "Chinese (Mandarin)",
    country: "United States",
    regions: ["All"],
    lat: 37.09,
    lng: -95.71,
    type: "Pronunciation Trap",
    severity_level: "Red",
    literal_meaning: "那個 / 那一個（That / That one）——中文最日常的代名詞與填充詞",
    misunderstood_as:
      "在北美英語多族裔環境中，發音與英語最嚴重種族歧視詞彙（N-word）高度相似，可能引發嚴重社會與法律後果",
    cultural_context:
      "「那個／內個」是中文裡頻率最高的代名詞與語助詞，相當於英文的「that thing」或口語停頓「uh...」。在中文母語者日常對話中完全無害，成年人每天可能使用數十次。然而在北美多族裔公共場所、學校、職場環境中，其發音「Nèi ge」與英語最嚴重種族歧視詞彙相似程度驚人，即便毫無惡意也可能引發嚴重後果。",
    bonding_rate: 2,
    offense_risk: 98,
    tags: ["🔊 發音地雷", "長輩雷區", "⛔ 絕對高危"],
    banter_context:
      "「那個／內個」在中文裡是最日常的代名詞與填充語助詞，相當於英文的「that thing」或「uh...」。在任何中文母語者的環境中完全無害，是再自然不過的語言習慣，甚至出現在央視播音員的正式播報中。",
    insult_context:
      "在北美英語環境，「Nèi ge」的發音與英語最嚴重種族歧視詞彙（N-word）高度相似。即便毫無惡意，在多族裔公共場所、學校、職場中使用，可能立刻引發嚴重社會及法律後果。在北美建議一律改用「這個（zhège）」或「嗯……」作為填充詞——這是有過真實案例的教訓。",
    is_trending: true,
  },
];
