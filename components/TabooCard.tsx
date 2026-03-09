"use client";

import { TabooItem, SeverityLevel } from "../types/taboo";

// ─── Severity 色彩映射 ────────────────────────────────────────────────────────

const severityConfig: Record<
  SeverityLevel,
  {
    topBar: string;
    border: string;
    badge: string;
    badgeText: string;
    icon: string;
    label: string;
  }
> = {
  Red: {
    topBar: "bg-red-500",
    border: "border-red-300",
    badge: "bg-red-100 text-red-700 border border-red-300",
    badgeText: "text-red-700",
    icon: "🔴",
    label: "高度危險",
  },
  Yellow: {
    topBar: "bg-yellow-400",
    border: "border-yellow-300",
    badge: "bg-yellow-100 text-yellow-700 border border-yellow-300",
    badgeText: "text-yellow-700",
    icon: "🟡",
    label: "需要注意",
  },
  Green: {
    topBar: "bg-green-500",
    border: "border-green-300",
    badge: "bg-green-100 text-green-700 border border-green-300",
    badgeText: "text-green-700",
    icon: "🟢",
    label: "相對安全",
  },
};

// ─── 子元件：Badge ────────────────────────────────────────────────────────────

function Badge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {children}
    </span>
  );
}

// ─── 子元件：MeaningBlock ─────────────────────────────────────────────────────

function MeaningBlock({
  label,
  content,
  variant,
}: {
  label: string;
  content: string;
  variant: "safe" | "danger";
}) {
  const styles =
    variant === "safe"
      ? {
          wrapper: "bg-blue-50 border border-blue-200 rounded-lg p-4",
          label: "text-blue-500 font-semibold text-xs uppercase tracking-wide",
          icon: "💬",
          text: "text-blue-900 font-medium",
        }
      : {
          wrapper: "bg-red-50 border border-red-200 rounded-lg p-4",
          label: "text-red-500 font-semibold text-xs uppercase tracking-wide",
          icon: "⚠️",
          text: "text-red-900 font-medium",
        };

  return (
    <div className={styles.wrapper}>
      <p className={styles.label}>
        {styles.icon} {label}
      </p>
      <p className={`mt-1.5 text-sm leading-snug ${styles.text}`}>{content}</p>
    </div>
  );
}

// ─── 主元件：TabooCard ────────────────────────────────────────────────────────

interface TabooCardProps {
  item: TabooItem;
}

export default function TabooCard({ item }: TabooCardProps) {
  const config = severityConfig[item.severity_level];

  return (
    <article
      className={`
        relative flex flex-col overflow-hidden rounded-lg border bg-white shadow-md
        transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg
        ${config.border}
      `}
    >
      {/* 頂部色條 */}
      <div className={`h-1.5 w-full ${config.topBar}`} />

      {/* 卡片主體 */}
      <div className="flex flex-col gap-4 p-5">

        {/* ── 區塊一：Header ── */}
        <header className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-2">
            {/* 詞彙標題 */}
            <h2 className="text-xl font-bold leading-tight text-gray-900 md:text-2xl">
              {item.word}
            </h2>

            {/* Language + Region Badges */}
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge className="bg-gray-100 text-gray-600 border border-gray-200">
                🌐 {item.language}
              </Badge>
              <Badge className="bg-purple-50 text-purple-600 border border-purple-200">
                🌍 {item.country}
              </Badge>
              {item.regions[0] !== "All" &&
                item.regions.map((r) => (
                  <Badge
                    key={r}
                    className="bg-indigo-50 text-indigo-600 border border-indigo-200"
                  >
                    📍 {r}
                  </Badge>
                ))}
            </div>
          </div>

          {/* Severity Badge（右上角） */}
          <div className="flex flex-shrink-0 flex-col items-end gap-1">
            <Badge className={config.badge}>
              {config.icon} {config.label}
            </Badge>
            <span className="text-xs text-gray-400">{item.type}</span>
          </div>
        </header>

        {/* 分隔線 */}
        <hr className="border-gray-100" />

        {/* ── 區塊二：語意對比 ── */}
        <section>
          <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-gray-400">
            語意對比
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <MeaningBlock
              label="原意 · Literal Meaning"
              content={item.literal_meaning}
              variant="safe"
            />
            <MeaningBlock
              label="易被誤解為 · Misunderstood As"
              content={item.misunderstood_as}
              variant="danger"
            />
          </div>
        </section>

        {/* ── 區塊三：文化背景 ── */}
        <section className="rounded-lg bg-gray-50 p-4">
          <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-gray-400">
            📖 文化背景說明
          </h3>
          <p className="text-sm leading-relaxed text-gray-600">
            {item.cultural_context}
          </p>
        </section>
      </div>
    </article>
  );
}
