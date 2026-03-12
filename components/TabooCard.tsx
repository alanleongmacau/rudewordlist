"use client";

import { TabooItem, SeverityLevel } from "../types/taboo";
import type { Lang } from "../app/page";

// ─── 卡片 UI 字典 ─────────────────────────────────────────────────────────────

const cardDict = {
  en: {
    trending:      "🔥 Trending",
    dualBlade:     "⚔️ Dual Edge",
    banterLabel:   "🟢 Banter",
    insultLabel:   "🔴 Insult",
    riskDashboard: "📊 Risk Dashboard",
    bondingRate:   "🤝 Bonding Rate",
    offenseRisk:   "⚠️ Offense Risk",
    severity: {
      Red:    "High Risk",
      Yellow: "Caution",
      Green:  "Relatively Safe",
    },
  },
  zh: {
    trending:      "🔥 熱搜",
    dualBlade:     "⚔️ 雙面刃情境",
    banterLabel:   "🟢 玩笑解讀",
    insultLabel:   "🔴 惡意解讀",
    riskDashboard: "📊 風險儀表板",
    bondingRate:   "🤝 破冰成功率",
    offenseRisk:   "⚠️ 冒犯風險",
    severity: {
      Red:    "高度危險",
      Yellow: "需要注意",
      Green:  "相對安全",
    },
  },
  ja: {
    trending:      "🔥 急上昇",
    dualBlade:     "⚔️ 二面性",
    banterLabel:   "🟢 冗談として",
    insultLabel:   "🔴 侮辱として",
    riskDashboard: "📊 リスク指標",
    bondingRate:   "🤝 打ち解け率",
    offenseRisk:   "⚠️ 侮辱リスク",
    severity: {
      Red:    "高度危険",
      Yellow: "要注意",
      Green:  "比較的安全",
    },
  },
} as const;

// ─── Severity 視覺設定（顏色只，文字由 cardDict 管） ──────────────────────────

const severityConfig: Record<
  SeverityLevel,
  { topBar: string; border: string; badge: string; icon: string }
> = {
  Red: {
    topBar: "from-red-500 to-rose-600",
    border: "border-red-200",
    badge:  "bg-red-100 text-red-700 border border-red-200",
    icon:   "🔴",
  },
  Yellow: {
    topBar: "from-amber-400 to-yellow-500",
    border: "border-amber-200",
    badge:  "bg-amber-100 text-amber-700 border border-amber-200",
    icon:   "🟡",
  },
  Green: {
    topBar: "from-emerald-400 to-teal-500",
    border: "border-emerald-200",
    badge:  "bg-emerald-100 text-emerald-700 border border-emerald-200",
    icon:   "🟢",
  },
};

// ─── 氛圍 Emoji（依 type）────────────────────────────────────────────────────

const moodEmoji: Record<string, string> = {
  "Pronunciation Trap":     "🗣️",
  "Gesture Taboo":          "🤚",
  "Context Inversion":      "🎭",
  "Dialect Trap":           "🗺️",
  "Semantic Difference":    "📖",
  "Semantic Inversion":     "🔃",
  "Vulgar Slang":           "💬",
  "Gesture / Context Trap": "🤔",
};

// ─── 子元件：ProgressBar ──────────────────────────────────────────────────────

function ProgressBar({
  label,
  value,
  colorClass,
  textClass,
}: {
  label: string;
  value: number;
  colorClass: string;
  textClass: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500">{label}</span>
        <span className={`text-xs font-black tabular-nums ${textClass}`}>
          {value}%
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colorClass} transition-all duration-700 ease-out`}
          style={{ width: `${value}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}

// ─── 主元件：TabooCard ────────────────────────────────────────────────────────

interface TabooCardProps {
  item: TabooItem;
  lang?: Lang;
}

export default function TabooCard({ item, lang = "zh" }: TabooCardProps) {
  const cd   = cardDict[lang];
  const cfg  = severityConfig[item.severity_level];
  const mood = moodEmoji[item.type] ?? "💬";

  return (
    <article
      className={`
        group flex flex-col overflow-hidden rounded-2xl border bg-white shadow-md
        transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
        ${cfg.border}
      `}
    >
      {/* ── 漸層頂部色條 ── */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${cfg.topBar}`} />

      <div className="flex flex-col gap-5 p-5">

        {/* ── 區塊一：Header ── */}
        <header className="flex items-start justify-between gap-3">

          {/* 左：Emoji + 詞彙 + 語言 + 地區 + Tags */}
          <div className="flex min-w-0 items-start gap-3">

            {/* 氛圍 Emoji 圖示框 */}
            <div
              className="
                flex h-12 w-12 flex-shrink-0 items-center justify-center
                rounded-xl border border-gray-100 bg-gray-50 text-2xl
                transition-transform duration-300 group-hover:scale-110
              "
              aria-hidden="true"
            >
              {mood}
            </div>

            <div className="min-w-0 flex-1">
              {/* 詞彙標題 + 熱搜徽章 */}
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-black leading-tight text-gray-900 md:text-2xl">
                  {item.word}
                </h2>
                {item.is_trending && (
                  <span className="inline-flex flex-shrink-0 items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-xs font-bold text-orange-600">
                    {cd.trending}
                  </span>
                )}
              </div>

              {/* 語言 / 國家 / 地區 */}
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                  🌐 {item.language}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700">
                  🌍 {item.country}
                </span>
                {item.regions[0] !== "All" &&
                  item.regions.map((r) => (
                    <span
                      key={r}
                      className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600"
                    >
                      📍 {r}
                    </span>
                  ))}
              </div>

              {/* Tags Badges */}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-600 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 右：Severity Badge（多語言標籤）+ Type */}
          <div className="flex flex-shrink-0 flex-col items-end gap-1">
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold ${cfg.badge}`}
            >
              {cfg.icon} {cd.severity[item.severity_level]}
            </span>
            <span className="max-w-[90px] text-right text-xs leading-tight text-gray-400">
              {item.type}
            </span>
          </div>
        </header>

        <hr className="border-gray-100" />

        {/* ── 區塊二：雙面刃情境 ── */}
        <section>
          <h3 className="mb-2.5 text-xs font-black uppercase tracking-widest text-gray-400">
            {cd.dualBlade}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {/* 玩笑解讀 */}
            <div className="rounded-xl border border-emerald-200 bg-gradient-to-b from-emerald-50 to-teal-50 p-3.5">
              <p className="mb-1.5 text-xs font-black text-emerald-600">
                {cd.banterLabel}
              </p>
              <p className="text-xs leading-relaxed text-emerald-900">
                {item.banter_context}
              </p>
            </div>
            {/* 惡意解讀 */}
            <div className="rounded-xl border border-red-200 bg-gradient-to-b from-red-50 to-rose-50 p-3.5">
              <p className="mb-1.5 text-xs font-black text-red-600">
                {cd.insultLabel}
              </p>
              <p className="text-xs leading-relaxed text-red-900">
                {item.insult_context}
              </p>
            </div>
          </div>
        </section>

        {/* ── 區塊三：風險儀表板 ── */}
        <section className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <h3 className="mb-3 text-xs font-black uppercase tracking-widest text-gray-400">
            {cd.riskDashboard}
          </h3>
          <div className="flex flex-col gap-3">
            <ProgressBar
              label={cd.bondingRate}
              value={item.bonding_rate}
              colorClass="from-emerald-400 to-teal-500"
              textClass="text-emerald-600"
            />
            <ProgressBar
              label={cd.offenseRisk}
              value={item.offense_risk}
              colorClass="from-orange-400 to-red-500"
              textClass="text-red-500"
            />
          </div>
        </section>

      </div>
    </article>
  );
}
