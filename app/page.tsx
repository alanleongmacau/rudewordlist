"use client";

import { useState, useMemo } from "react";
import { tabooData } from "@/data/tabooData";
import TabooCard from "@/components/TabooCard";
import { SeverityLevel } from "@/types/taboo";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Lang = "en" | "zh" | "ja";
type FilterType = "ALL" | SeverityLevel;

// ─── UI Dictionary ────────────────────────────────────────────────────────────

const uiDict = {
  en: {
    eyebrow:           "Global Cultural Intelligence",
    subtitle:          "The Global Guide to Taboos, Slang, and Context.",
    subtitleSub:       "Global Cultural Landmine Encyclopedia",
    searchPlaceholder: "Search a word, country, or gesture...",
    trendingLabel:     "🔥 Trending Now:",
    sectionFilter:     "FILTERS",
    countryLabel:      "Country / Region",
    allCountries:      "🌍 All",
    riskLabel:         "Risk Level",
    filterAll:         "All",
    filterRed:         "High Risk",
    filterYellow:      "Caution",
    filterGreen:       "Safe Joke",
    showingPre:        "Showing",
    showingMid:        "of",
    showingPost:       "entries",
    clearFilter:       "Clear filters",
    noResults:         "No results found",
    noResultsHint:     "Try adjusting your search or filters",
    resetFilters:      "Reset all filters",
    statEntries:       "Entries",
    statDanger:        "High Risk",
    statRegions:       "Regions",
    adSlotTitle:       "Ad Space",
    adSlot:            "[ Sponsored Ad Space Reserved ]",
    adNote:            "728 × 90 Banner · Full-page / Sidebar / Inline",
    adContact:         "Contact us for advertising opportunities",
    beerPrompt:        "Find this useful? Support the author!",
    beerBtn:           "🍻 Buy me a beer",
    footerNote:        "For educational and cultural awareness purposes only. Data updated regularly.",
  },
  zh: {
    eyebrow:           "全球文化智識庫",
    subtitle:          "The Global Guide to Taboos, Slang, and Context.",
    subtitleSub:       "全球文化避雷圖鑑",
    searchPlaceholder: "Search a word, country, or gesture... (搜尋單字、國家或手勢)",
    trendingLabel:     "🔥 Trending Now:",
    sectionFilter:     "快速篩選",
    countryLabel:      "國家 / 地區",
    allCountries:      "🌍 全球",
    riskLabel:         "風險等級",
    filterAll:         "全部",
    filterRed:         "高風險",
    filterYellow:      "需注意",
    filterGreen:       "輕鬆玩笑",
    showingPre:        "顯示",
    showingMid:        "/",
    showingPost:       "條地雷",
    clearFilter:       "清除篩選",
    noResults:         "找不到符合條件的地雷",
    noResultsHint:     "請嘗試調整關鍵字或切換篩選條件",
    resetFilters:      "重設所有篩選",
    statEntries:       "條地雷",
    statDanger:        "高危詞",
    statRegions:       "個地區",
    adSlotTitle:       "廣告版位",
    adSlot:            "[ 贊助商廣告版位預留區 ]",
    adNote:            "728 × 90 Banner Ad · 支援全螢幕 / 側欄 / 文中插入",
    adContact:         "如欲投放廣告，歡迎聯繫合作",
    beerPrompt:        "覺得這個指南實用嗎？幫作者補個油吧！",
    beerBtn:           "🍻 請作者喝杯啤酒",
    footerNote:        "本指南僅供教育與文化敏感度提升用途，資料持續更新中。",
  },
  ja: {
    eyebrow:           "グローバル文化インテリジェンス",
    subtitle:          "タブー・スラング・文脈の世界ガイド",
    subtitleSub:       "世界の文化地雷マップ",
    searchPlaceholder: "単語・国・ジェスチャーで検索...",
    trendingLabel:     "🔥 トレンド:",
    sectionFilter:     "フィルター",
    countryLabel:      "国 / 地域",
    allCountries:      "🌍 全世界",
    riskLabel:         "リスクレベル",
    filterAll:         "すべて",
    filterRed:         "危険",
    filterYellow:      "要注意",
    filterGreen:       "軽めのジョーク",
    showingPre:        "表示中",
    showingMid:        "/",
    showingPost:       "件",
    clearFilter:       "クリア",
    noResults:         "結果が見つかりません",
    noResultsHint:     "キーワードや絞り込み条件を変えてみてください",
    resetFilters:      "すべてリセット",
    statEntries:       "件",
    statDanger:        "高危険",
    statRegions:       "か国",
    adSlotTitle:       "広告枠",
    adSlot:            "[ スポンサー広告スペース ]",
    adNote:            "728 × 90 バナー広告 · 全ページ / サイドバー / インライン",
    adContact:         "広告掲載のお問い合わせはこちら",
    beerPrompt:        "役に立ちましたか？作者を応援しよう！",
    beerBtn:           "🍻 コーヒーを贈る (Buy me a beer)",
    footerNote:        "教育・文化的認識向上を目的としています。",
  },
} as const;

// ─── 語言切換器設定 ────────────────────────────────────────────────────────────

const LANG_OPTIONS: { id: Lang; label: string }[] = [
  { id: "zh", label: "中文"   },
  { id: "en", label: "EN"     },
  { id: "ja", label: "日本語" },
];

// ─── 靜態統計（渲染前計算一次）────────────────────────────────────────────────

const TOTAL         = tabooData.length;
const RED_COUNT     = tabooData.filter((d) => d.severity_level === "Red").length;
const YELLOW_COUNT  = tabooData.filter((d) => d.severity_level === "Yellow").length;
const GREEN_COUNT   = tabooData.filter((d) => d.severity_level === "Green").length;
const COUNTRY_COUNT = new Set(tabooData.map((d) => d.country)).size;
const TRENDING      = tabooData.filter((d) => d.is_trending);
const COUNTRIES     = Array.from(new Set(tabooData.map((d) => d.country))).sort();

// ─── 頁面 ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [lang,    setLang]    = useState<Lang>("zh");
  const [query,   setQuery]   = useState("");
  const [filter,  setFilter]  = useState<FilterType>("ALL");
  const [country, setCountry] = useState("ALL");

  const dict = uiDict[lang];

  // 風險過濾器設定（依語言動態生成）
  const filterConfig = useMemo(() => [
    { id: "ALL"    as FilterType, label: dict.filterAll,    icon: "🌐", count: TOTAL        },
    { id: "Red"    as FilterType, label: dict.filterRed,    icon: "🔴", count: RED_COUNT    },
    { id: "Yellow" as FilterType, label: dict.filterYellow, icon: "🟡", count: YELLOW_COUNT },
    { id: "Green"  as FilterType, label: dict.filterGreen,  icon: "🟢", count: GREEN_COUNT  },
  ], [dict]);

  // 交叉過濾：關鍵字 AND 國家 AND 風險等級
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return tabooData.filter((item) => {
      const matchRisk    = filter  === "ALL" || item.severity_level === filter;
      const matchCountry = country === "ALL" || item.country === country;
      const matchQuery   =
        !q ||
        [
          item.word,
          item.language,
          item.country,
          item.type,
          item.banter_context,
          item.insult_context,
          item.cultural_context,
          ...item.regions,
          ...item.tags,
        ].some((s) => s.toLowerCase().includes(q));
      return matchRisk && matchCountry && matchQuery;
    });
  }, [query, filter, country]);

  const hasActiveFilter = query || filter !== "ALL" || country !== "ALL";

  function resetAll() {
    setQuery("");
    setFilter("ALL");
    setCountry("ALL");
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-slate-50">

      {/* Ticker 動畫 keyframe */}
      <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track {
          animation: ticker-scroll 22s linear infinite;
          display: flex;
          width: max-content;
          align-items: center;
          gap: 10px;
        }
        .ticker-track:hover { animation-play-state: paused; }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════════════
          Section 1：Hero & 搜尋區
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-900 px-6 pb-16 pt-14 text-center">

        {/* 裝飾光暈 */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

        {/* ── 語言切換器（右上角） ── */}
        <div className="absolute right-4 top-4 z-10 flex items-center gap-0.5 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-sm">
          {LANG_OPTIONS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setLang(id)}
              className={`
                rounded-full px-3 py-1.5 text-xs font-bold transition-all duration-200
                ${lang === id
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-400 hover:text-white"
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Eyebrow */}
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-indigo-400">
          {dict.eyebrow}
        </p>

        {/* 品牌主標題 */}
        <h1
          className="
            mx-auto max-w-3xl bg-gradient-to-r from-violet-300 via-fuchsia-300 to-pink-300
            bg-clip-text text-7xl font-black tracking-tight text-transparent
            md:text-8xl lg:text-9xl
          "
        >
          Taboodex
        </h1>

        {/* 雙語副標題 */}
        <div className="mx-auto mt-4 max-w-xl space-y-1">
          <p className="text-base font-medium text-slate-300 md:text-lg">
            {dict.subtitle}
          </p>
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
            {dict.subtitleSub}
          </p>
        </div>

        {/* 統計數字 */}
        <div className="mx-auto mt-8 flex max-w-sm justify-center gap-10">
          {[
            { v: TOTAL,         l: dict.statEntries, c: "text-indigo-300" },
            { v: RED_COUNT,     l: dict.statDanger,  c: "text-pink-400"   },
            { v: COUNTRY_COUNT, l: dict.statRegions, c: "text-indigo-300" },
          ].map(({ v, l, c }) => (
            <div key={l} className="text-center">
              <span className={`block text-3xl font-black tabular-nums ${c}`}>{v}</span>
              <span className="text-xs text-slate-400">{l}</span>
            </div>
          ))}
        </div>

        {/* 搜尋列 */}
        <div className="relative mx-auto mt-8 max-w-2xl">
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
            🔍
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={dict.searchPlaceholder}
            className="
              w-full rounded-2xl border border-white/10 bg-white/10 py-4
              pl-12 pr-12 text-sm text-white placeholder-slate-400
              backdrop-blur-sm outline-none transition
              focus:border-indigo-400 focus:bg-white/15
              focus:ring-2 focus:ring-indigo-400/30
            "
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-white"
              aria-label="clear search"
            >
              ✕
            </button>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          Section 2：趨勢跑馬燈 (Trending Ticker)
      ══════════════════════════════════════════════════════════════════════ */}
      {TRENDING.length > 0 && (
        <section className="overflow-hidden border-b border-indigo-900/40 bg-indigo-950">
          <div className="flex items-stretch">
            <div className="flex flex-shrink-0 items-center border-r border-indigo-800 px-4 py-3">
              <span className="animate-pulse text-sm font-black text-orange-400">
                {dict.trendingLabel}
              </span>
            </div>
            <div className="flex-1 overflow-hidden py-3">
              <div className="ticker-track">
                {[...TRENDING, ...TRENDING].map((item, i) => (
                  <button
                    key={`${item.id}-${i}`}
                    onClick={() => setQuery(item.word)}
                    className="
                      inline-flex flex-shrink-0 items-center gap-1.5
                      rounded-full border border-indigo-700/60 bg-indigo-900/80
                      px-3 py-1 text-xs font-semibold text-indigo-200
                      transition hover:border-indigo-400 hover:bg-indigo-700 hover:text-white
                    "
                  >
                    <span className="text-orange-400">🔥</span>
                    <span>{item.word}</span>
                    <span className="text-indigo-600">·</span>
                    <span className="text-slate-400">{item.country}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          Section 3：篩選器（國家 + 風險等級）
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="border-b border-slate-200 bg-white px-6 py-5">
        <div className="mx-auto max-w-6xl space-y-4">

          {/* ── 國家篩選器 ── */}
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">
              {dict.countryLabel}
            </p>
            <div className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex w-max gap-2">

                {/* 全球選項 */}
                <button
                  onClick={() => setCountry("ALL")}
                  className={`
                    flex-shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold
                    transition-all duration-200
                    ${country === "ALL"
                      ? "border-indigo-500 bg-indigo-500 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    }
                  `}
                >
                  {dict.allCountries}
                </button>

                {/* 各國按鈕（動態生成） */}
                {COUNTRIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCountry(c)}
                    className={`
                      flex-shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold
                      transition-all duration-200
                      ${country === c
                        ? "border-violet-500 bg-violet-500 text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                      }
                    `}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── 風險等級篩選器 ── */}
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">
              {dict.riskLabel}
            </p>
            <div className="flex flex-wrap gap-2">
              {filterConfig.map(({ id, label, icon, count }) => {
                const isActive = filter === id;
                const activeStyle =
                  id === "ALL"    ? "border-indigo-500 bg-indigo-500 text-white shadow-md shadow-indigo-200"
                  : id === "Red"    ? "border-red-500 bg-red-500 text-white shadow-md shadow-red-200"
                  : id === "Yellow" ? "border-amber-400 bg-amber-400 text-white shadow-md shadow-amber-200"
                  :                   "border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-200";

                return (
                  <button
                    key={id}
                    onClick={() => setFilter(id)}
                    className={`
                      inline-flex items-center gap-2 rounded-full border px-4 py-2
                      text-sm font-semibold transition-all duration-200
                      ${isActive
                        ? activeStyle
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                      }
                    `}
                  >
                    <span>{icon}</span>
                    <span>{label}</span>
                    <span
                      className={`
                        rounded-full px-1.5 py-0.5 text-xs font-black
                        ${isActive ? "bg-white/25 text-white" : "bg-slate-100 text-slate-500"}
                      `}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 結果計數 + 清除篩選 */}
          <p className="text-xs text-slate-400">
            {dict.showingPre}{" "}
            <span className="font-bold text-slate-700">{filtered.length}</span>
            {" "}{dict.showingMid}{" "}{TOTAL}{" "}
            {dict.showingPost}
            {hasActiveFilter && (
              <button
                onClick={resetAll}
                className="ml-3 text-indigo-500 hover:underline"
              >
                {dict.clearFilter}
              </button>
            )}
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          Section 4：卡片網格 (Card Grid)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="px-6 py-10">
        <div className="mx-auto max-w-6xl">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((item) => (
                <TabooCard key={item.id} item={item} lang={lang} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-24 text-center">
              <span className="text-5xl">🔎</span>
              <p className="mt-4 text-base font-semibold text-slate-500">
                {dict.noResults}
              </p>
              <p className="mt-1 text-sm text-slate-400">
                {dict.noResultsHint}
              </p>
              <button
                onClick={resetAll}
                className="mt-5 rounded-full border border-slate-200 bg-slate-50 px-5 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100"
              >
                {dict.resetFilters}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          Footer：廣告版位預留區 + Buy me a beer
      ══════════════════════════════════════════════════════════════════════ */}
      <footer className="mt-4 bg-slate-900 px-6 py-14 text-center">

        {/* 廣告版位預留區 */}
        <div className="mx-auto mb-12 max-w-3xl rounded-2xl border-2 border-dashed border-slate-700 bg-slate-800/60 px-8 py-10">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
            {dict.adSlotTitle}
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-400">
            {dict.adSlot}
          </p>
          <p className="mt-1.5 text-sm text-slate-500">{dict.adNote}</p>
          <p className="mt-1 text-xs text-slate-600">{dict.adContact}</p>
        </div>

        {/* Buy me a beer */}
        <div className="mb-10">
          <p className="mb-4 text-sm text-slate-400">{dict.beerPrompt}</p>
          <a
            href="#"
            className="
              inline-flex items-center gap-2.5 rounded-full
              border border-amber-500/40
              bg-gradient-to-r from-amber-500 to-orange-500
              px-7 py-3.5 text-sm font-bold text-white
              shadow-lg shadow-amber-500/25
              transition-all duration-200
              hover:from-amber-400 hover:to-orange-400
              hover:shadow-amber-500/50 hover:-translate-y-0.5
            "
          >
            {dict.beerBtn}
          </a>
        </div>

        <hr className="mx-auto mb-6 max-w-xs border-slate-800" />

        <p className="text-xs text-slate-600">{dict.footerNote}</p>
      </footer>

    </main>
  );
}
