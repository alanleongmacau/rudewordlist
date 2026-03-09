import { TabooItem } from "@/types/taboo";

export const tabooData: TabooItem[] = [
  // ─── 中國 ────────────────────────────────────────────────────────────────────
  {
    id: "1",
    word: "那個 (Nèi ge / Nà ge)",
    language: "Chinese (Mandarin)",
    country: "China",
    regions: ["All"],
    type: "Pronunciation Trap",
    severity_level: "Red",
    literal_meaning: "That / That one",
    misunderstood_as: "N-word（種族歧視詞彙）",
    cultural_context:
      "中文裡極度常用的口頭禪或代名詞。但在非華語圈，其發音極容易被誤認為是對黑人具強烈侮辱性的 N-word。",
  },
  {
    id: "9",
    word: "契弟 (Kai Dai)",
    language: "Cantonese",
    country: "China",
    regions: ["Hong Kong", "Macau"],
    type: "Vulgar Slang",
    severity_level: "Red",
    literal_meaning: "（粵語方言詞，無直接對應字面意思）",
    misunderstood_as: "看似普通粵語詞，實為極度粗俗的侮辱性罵語",
    cultural_context:
      "「契弟」在香港及澳門粵語口語中是嚴重侮辱性詞彙，字面看似無害，但在粵語文化圈中屬禁忌用語。外來者若在聽到此詞後學著使用，極可能在商務或社交場合造成嚴重冒犯。此詞在港澳兩地均屬禁用詞，絕不可輕率使用。",
  },

  // ─── 英國 ────────────────────────────────────────────────────────────────────
  {
    id: "2",
    word: "Fart (放屁)",
    language: "English",
    country: "United Kingdom",
    regions: ["All"],
    type: "Gesture / Context Trap",
    severity_level: "Yellow",
    literal_meaning: "Passing gas（排氣）",
    misunderstood_as: "在某些正式場合用此詞開玩笑會被視為嚴重失禮",
    cultural_context:
      "在英式英語的正式商業或社交場合中，提及身體功能相關詞彙被認為極度粗俗，即使在輕鬆場合也應謹慎使用。",
  },

  // ─── 希臘 ────────────────────────────────────────────────────────────────────
  {
    id: "3",
    word: "👍 (大拇指朝上)",
    language: "Non-verbal / Gesture",
    country: "Greece",
    regions: ["All"],
    type: "Gesture Taboo",
    severity_level: "Red",
    literal_meaning: "Good / Approval（讚、同意）",
    misunderstood_as: "嚴重侮辱（相當於豎中指）",
    cultural_context:
      "在西方文化中象徵正面肯定的大拇指手勢，在希臘、伊朗等中東及地中海國家被視為嚴重的侮辱手勢，含義接近豎中指。旅行時應特別注意。",
  },

  // ─── 巴西 ────────────────────────────────────────────────────────────────────
  {
    id: "4",
    word: "OK 手勢 (👌)",
    language: "Non-verbal / Gesture",
    country: "Brazil",
    regions: ["All"],
    type: "Gesture Taboo",
    severity_level: "Yellow",
    literal_meaning: "OK / Everything is fine（沒問題）",
    misunderstood_as: "粗俗侮辱或暗指對方為「零」（廢物）",
    cultural_context:
      "在巴西、土耳其及部分地中海國家，OK 圈圈手勢具有粗俗或侮辱性含義。在某些歐洲國家則暗示「你是個零」（廢物）。在北美、東亞等地則完全無害。",
  },

  // ─── 印度 ────────────────────────────────────────────────────────────────────
  {
    id: "5",
    word: "Namaste (नमस्ते)",
    language: "Hindi / Sanskrit",
    country: "India",
    regions: ["All"],
    type: "Semantic Difference",
    severity_level: "Green",
    literal_meaning: "我向你內心的神性致敬（I bow to the divine in you）",
    misunderstood_as: "被西方文化單純理解為「你好」，失去宗教與哲學深度",
    cultural_context:
      "Namaste 在印度文化中蘊含深刻的宗教與哲學意涵，代表對對方靈性的尊重。在全球瑜伽文化流行後，此詞常被簡化為普通問候語，對印度人而言可能略感文化淡化，但不至於冒犯。",
  },

  // ─── 法國 ────────────────────────────────────────────────────────────────────
  {
    id: "6",
    word: "Merde (メルド)",
    language: "French",
    country: "France",
    regions: ["All"],
    type: "Context Inversion",
    severity_level: "Green",
    literal_meaning: "Shit（髒話）",
    misunderstood_as: "在劇場文化中是祝福語，外來者用「Good Luck」反而不吉利",
    cultural_context:
      "在法語劇場傳統中，演出前說「Merde！」是帶來好運的習俗，相當於英語劇場說「Break a leg」。若外來者在後台對演員說「Good Luck」，反而會被視為咒語帶來厄運。",
  },

  // ─── 日本 ────────────────────────────────────────────────────────────────────
  {
    id: "7",
    word: "おおきに (Ōkini)",
    language: "Japanese (Kansai Dialect)",
    country: "Japan",
    regions: ["Kansai"],
    type: "Dialect Trap",
    severity_level: "Yellow",
    literal_meaning: "非常感謝 (Thank you very much)",
    misunderstood_as: "在關東（東京）使用會顯得戲謔、造作，甚至帶有輕蔑意味",
    cultural_context:
      "「おおきに」是大阪、京都等關西地區常用的道謝語，在當地是自然親切的表達。但若在東京等關東地區對陌生人使用，對方可能感到困惑甚至覺得你在模仿或嘲弄方言，建議在關東一律使用標準語「ありがとう」。",
  },
  {
    id: "10",
    word: "やばい (Yabai)",
    language: "Japanese",
    country: "Japan",
    regions: ["Kanto"],
    type: "Semantic Inversion",
    severity_level: "Green",
    literal_meaning: "危險、麻煩（傳統含義）",
    misunderstood_as: "年長者聽到「やばい」表示讚美時，以為對方在說情況很糟糕",
    cultural_context:
      "「やばい」傳統上在關東（東京）意指「危險的、麻煩的、糟糕的」，帶有負面警示意涵。然而在現代日本青年文化中，此詞已演變為「超讚！」「令人震撼！」等極度正面的讚嘆詞。這種語意反轉在跨世代溝通中易造成嚴重誤解，在正式商業場合尤其需要謹慎。",
  },

  // ─── 義大利 ──────────────────────────────────────────────────────────────────
  {
    id: "8",
    word: "下頷刷手 (Chin Flick)",
    language: "Non-verbal / Gesture",
    country: "Italy",
    regions: ["Southern Italy", "Sicily"],
    type: "Gesture Taboo",
    severity_level: "Red",
    literal_meaning: "不知道 / 沒有 (I don't know / Nothing here)",
    misunderstood_as: "嚴重輕視、「滾開」或「我不在乎你」",
    cultural_context:
      "在義大利南部及西西里，以手背輕刷下頷向外彈出，表示「我不知道」或「這裡什麼都沒有」。但在北義，此手勢較不常見，易被解讀為強烈的鄙視或拒絕，甚至可能引發衝突。北部旅客前往南部時需特別留意此手勢的語境差異。",
  },
  {
    id: "11",
    word: "手指併攏上下擺動 (Mano a Borsa)",
    language: "Non-verbal / Gesture",
    country: "Italy",
    regions: ["Southern Italy", "Rome"],
    type: "Gesture Taboo",
    severity_level: "Yellow",
    literal_meaning: "「你到底想說什麼？」（What do you want? / What are you saying?）",
    misunderstood_as: "北義及外國旅客以為對方在乞討或表達飢餓",
    cultural_context:
      "將五指併攏朝上，手腕上下輕彈的「錢袋手勢（Mano a Borsa）」在羅馬及南義是強調問句的常用肢體語言，充滿表達力。但在北義米蘭等地較少使用，外來者不了解語境時，常誤以為對方在要錢或表達不耐，易造成溝通誤解。",
  },
];
