export type SeverityLevel = "Red" | "Yellow" | "Green";

export interface TabooItem {
  id: string;
  word: string;
  language: string;
  country: string;
  regions: string[];
  lat: number;
  lng: number;
  type: string;
  severity_level: SeverityLevel;
  literal_meaning: string;
  misunderstood_as: string;
  cultural_context: string;
  bonding_rate: number;   // 0–100：破冰成功率
  offense_risk: number;   // 0–100：冒犯風險
  // ── 遊戲卡牌 & 趨勢欄位 ──────────────────────────────
  tags: string[];          // 場景標籤，例如 "酒吧必備"、"長輩雷區"
  banter_context: string;  // 友善玩笑情境說明（🟢 玩笑解讀）
  insult_context: string;  // 惡意攻擊情境說明（🔴 惡意解讀）
  is_trending: boolean;    // 是否為近期熱搜
}
