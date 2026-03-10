"use client";

import { TabooItem, SeverityLevel } from "../types/taboo";

// ─── Severity 設定 ────────────────────────────────────────────────────────────

const severityConfig: Record<
  SeverityLevel,
  { topBar: string; border: string; badge: string; icon: string; label: string }
> = {
  Red: {
    topBar: "from-red-500 to-rose-600",
    border: "border-red-200",
    badge: "bg-red-100 text-red-700 border border-red-200",
    icon: "🔴",
    label: "高度危險",
  },
  Yellow: {
    topBar: "from-amber-400 to-yellow-500",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-700 border border-amber-200",
    icon: "🟡",
    label: "需要注意",
  },
  Green: {
    topBar: "from-emerald-400 to-teal-500",
    border: "border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    icon: "🟢",
    label: "相對安全",
  },
};

// ─── 氛圍 Emoji 映射（依 type）─────────────────────────────────────────────────

const moodEmoji: Record<string, string> = {
  "Pronunciation Trap": "🗣️",
  "Gesture Taboo": "🤚",
  "Context Inversion": "🎭",
  "Dialect Trap": "🗺️",
  "Semantic Difference": "📖",
  "Semantic Inversion": "🔃",
  "Vulgar Slang": "💬",
  "Gesture / Context Trap": "🤔",
};

// ─── 風險儀表板數值（由 severity 推算）───────────────────────────────────────────

const riskValues: Record<SeverityLevel, { bonding: number; offense: number }> = {
  Red:    { bonding: 12, offense: 91 },
  Yellow: { bonding: 60, offense: 50 },
  Green:  { bonding: 85, offense: 15 },
};

// ─── 自動生成情境標籤 ─────────────────────────────────────────────────────────

function generateTags(item: TabooItem): string[] {
  const tags: string[] = [];

  if (item.type.includes("Gesture"))      tags.push("🤚 肢體語言");
  if (item.type.includes("Dialect"))      tags.push("🗺️ 方言陷阱");
  if (item.type.includes("Pronunciation"))tags.push("🔊 發音地雷");
  if (item.type.includes("Vulgar"))       tags.push("🚫 粗口警告");
  if (item.type.includes("Inversion") || item.type.includes("Context"))
                                          tags.push("🎭 語境反轉");
  if (item.type.includes("Semantic"))     tags.push("📖 語意差距");

  if      (item.severity_level === "Red")    tags.push("⛔ 絕對高危");
  else if (item.severity_level === "Yellow") tags.push("🍻 酒局限定");
  else                                       tags.push("✅ 熟人專用");

  if (item.regions[0] !== "All") tags.push("📍 地區限定");
  else                           tags.push("🌐 全國通用");

  return tags.slice(0, 3);
}

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
}

export default function TabooCard({ item }: TabooCardProps) {
  const cfg   = severityConfig[item.severity_level];
  const risk  = riskValues[item.severity_level];
  const mood  = moodEmoji[item.type] ?? "💬";
  const tags  = generateTags(item);

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
          {/* 左：氛圍 Emoji + 詞彙 + 語言/地區 */}
          <div className="flex min-w-0 items-start gap-3">
            {/* 氛圍 Emoji 圖示框 */}
            <div
              className={`
                flex h-12 w-12 flex-shrink-0 items-center justify-center
                rounded-xl border border-gray-100 bg-gray-50 text-2xl
                transition-transform duration-300 group-hover:scale-110
              `}
              aria-hidden="true"
            >
              {mood}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-xl font-black leading-tight text-gray-900 md:text-2xl">
                {item.word}
              </h2>
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
            </div>
          </div>

          {/* 右：Severity Badge */}
          <div className="flex flex-shrink-0 flex-col items-end gap-1">
            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold ${cfg.badge}`}>
              {cfg.icon} {cfg.label}
            </span>
            <span className="max-w-[90px] text-right text-xs leading-tight text-gray-400">
              {item.type}
            </span>
          </div>
        </header>

        <hr className="border-gray-100" />

        {/* ── 區塊二：雙面刃情境 (Banter vs Insult) ── */}
        <section>
          <h3 className="mb-2.5 text-xs font-black uppercase tracking-widest text-gray-400">
            ⚔️ 雙面刃情境
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {/* 🟢 這樣用沒事 */}
            <div className="rounded-xl border border-emerald-200 bg-gradient-to-b from-emerald-50 to-teal-50 p-3.5">
              <p className="mb-1.5 text-xs font-black text-emerald-600">
                🟢 這樣用沒事
              </p>
              <p className="text-xs leading-relaxed text-emerald-900">
                {item.literal_meaning}
              </p>
            </div>
            {/* 🔴 這樣用出事 */}
            <div className="rounded-xl border border-red-200 bg-gradient-to-b from-red-50 to-rose-50 p-3.5">
              <p className="mb-1.5 text-xs font-black text-red-600">
                🔴 這樣用出事
              </p>
              <p className="text-xs leading-relaxed text-red-900">
                {item.misunderstood_as}
              </p>
            </div>
          </div>
        </section>

        {/* ── 區塊三：發動條件 Tags ── */}
        <section>
          <h3 className="mb-2 text-xs font-black uppercase tracking-widest text-gray-400">
            🎯 發動條件
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-gray-200 bg-gradient-to-r from-slate-50 to-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* ── 區塊四：風險儀表板 ── */}
        <section className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <h3 className="mb-3 text-xs font-black uppercase tracking-widest text-gray-400">
            📊 風險儀表板
          </h3>
          <div className="flex flex-col gap-3">
            <ProgressBar
              label="🤝 拉近距離機率"
              value={risk.bonding}
              colorClass="from-emerald-400 to-teal-500"
              textClass="text-emerald-600"
            />
            <ProgressBar
              label="💥 冒犯風險"
              value={risk.offense}
              colorClass="from-orange-400 to-red-500"
              textClass="text-red-500"
            />
          </div>
        </section>

        {/* ── 區塊五：文化背景 ── */}
        <section className="rounded-xl bg-gray-50 p-4">
          <h3 className="mb-1.5 text-xs font-black uppercase tracking-widest text-gray-400">
            📖 文化背景
          </h3>
          <p className="text-xs leading-relaxed text-gray-600">
            {item.cultural_context}
          </p>
        </section>
      </div>
    </article>
  );
}
