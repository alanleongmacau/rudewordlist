"use client";

import { useState, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import GridView from "@/components/GridView";
import { tabooData } from "@/data/tabooData";
import { TabooItem } from "@/types/taboo";

// ─── SSR-safe Globe import ────────────────────────────────────────────────────

const GlobeView = dynamic(() => import("@/components/GlobeView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-gray-950">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        <p className="text-sm text-gray-400">載入地球中…</p>
      </div>
    </div>
  ),
});

// ─── 統計（固定） ─────────────────────────────────────────────────────────────

const TOTAL = tabooData.length;
const RED_COUNT = tabooData.filter((d) => d.severity_level === "Red").length;
const COUNTRY_COUNT = new Set(tabooData.map((d) => d.country)).size;

// ─── Toggle Switch 元件 ───────────────────────────────────────────────────────

function ViewToggle({
  mode,
  onChange,
  dark,
}: {
  mode: "2D" | "3D";
  onChange: (m: "2D" | "3D") => void;
  dark: boolean;
}) {
  const is3D = mode === "3D";
  return (
    <div className="flex items-center gap-2">
      <span
        className={`text-xs font-bold transition ${
          !is3D
            ? dark
              ? "text-white"
              : "text-gray-800"
            : dark
            ? "text-gray-500"
            : "text-gray-400"
        }`}
      >
        2D
      </span>
      <button
        onClick={() => onChange(is3D ? "2D" : "3D")}
        role="switch"
        aria-checked={is3D}
        aria-label="切換 2D / 3D 視圖"
        className={`relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
          is3D ? "bg-indigo-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
            is3D ? "translate-x-8" : "translate-x-1"
          }`}
        />
      </button>
      <span
        className={`text-xs font-bold transition ${
          is3D
            ? dark
              ? "text-white"
              : "text-gray-800"
            : dark
            ? "text-gray-500"
            : "text-gray-400"
        }`}
      >
        3D
      </span>
    </div>
  );
}

// ─── 搜尋建議下拉 ─────────────────────────────────────────────────────────────

function SearchDropdown({
  results,
  onSelect,
  dark,
}: {
  results: TabooItem[];
  onSelect: (item: TabooItem) => void;
  dark: boolean;
}) {
  if (results.length === 0) return null;
  return (
    <ul
      className={`absolute left-0 right-0 top-full z-30 mt-1 max-h-64 overflow-auto rounded-xl border shadow-2xl backdrop-blur-md ${
        dark
          ? "border-white/20 bg-gray-900/95 text-white"
          : "border-gray-200 bg-white text-gray-900 shadow-lg"
      }`}
    >
      {results.map((item) => (
        <li key={item.id}>
          <button
            onClick={() => onSelect(item)}
            className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${
              dark ? "hover:bg-white/10" : "hover:bg-gray-50"
            }`}
          >
            <span
              className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${
                item.severity_level === "Red"
                  ? "bg-red-500"
                  : item.severity_level === "Yellow"
                  ? "bg-yellow-400"
                  : "bg-green-500"
              }`}
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{item.word}</p>
              <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>
                {item.country}
                {item.regions[0] !== "All"
                  ? ` · ${item.regions.join(", ")}`
                  : ""}
              </p>
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}

// ─── 頁面 ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [viewMode, setViewMode] = useState<"2D" | "3D">("3D");
  const [query, setQuery] = useState("");
  const [focusItem, setFocusItem] = useState<TabooItem | null>(null);
  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const is3D = viewMode === "3D";

  // 搜尋建議（3D 模式下點選會飛到座標；2D 模式傳給 GridView 過濾）
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return tabooData.filter(
      (item) =>
        item.word.toLowerCase().includes(q) ||
        item.country.toLowerCase().includes(q)
    );
  }, [query]);

  function handleSelect(item: TabooItem) {
    setQuery(item.word);
    if (is3D) {
      setFocusItem(null); // 先 reset 讓 useEffect 重新觸發
      requestAnimationFrame(() => setFocusItem(item));
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
    }
  }

  function handleModeChange(m: "2D" | "3D") {
    setViewMode(m);
    setQuery("");
    setFocusItem(null);
  }

  // ─── Control Bar ──────────────────────────────────────────────────────────

  const controlBar = (
    <div
      className={`z-20 px-4 py-3 transition-all sm:px-6 ${
        is3D
          ? "absolute left-0 right-0 top-0"
          : "sticky top-0 border-b border-gray-200 bg-white shadow-sm"
      }`}
    >
      {/* 毛玻璃背景（3D 模式） */}
      {is3D && (
        <div className="absolute inset-0 bg-gray-950/60 backdrop-blur-md" />
      )}

      <div className="relative mx-auto max-w-4xl">
        {/* 第一行：品牌 + 統計 + Toggle */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-widest ${is3D ? "text-indigo-400" : "text-indigo-500"}`}>
              Global Cultural Intelligence
            </p>
            <h1 className={`text-base font-extrabold sm:text-lg ${is3D ? "text-white" : "text-gray-900"}`}>
              全球文化禁忌避險指南
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* 統計 pills */}
            <div className="hidden items-center gap-2 sm:flex">
              {[
                { value: TOTAL, label: "條目", color: is3D ? "text-white" : "text-gray-800" },
                { value: RED_COUNT, label: "高危", color: "text-red-500" },
                { value: COUNTRY_COUNT, label: "國家", color: "text-indigo-500" },
              ].map(({ value, label, color }) => (
                <div
                  key={label}
                  className={`rounded-full border px-2.5 py-1 text-xs ${
                    is3D
                      ? "border-white/15 bg-white/5"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <span className={`font-bold ${color}`}>{value}</span>{" "}
                  <span className={is3D ? "text-gray-400" : "text-gray-500"}>{label}</span>
                </div>
              ))}
            </div>

            <ViewToggle mode={viewMode} onChange={handleModeChange} dark={is3D} />
          </div>
        </div>

        {/* 第二行：搜尋列 */}
        <div className="relative mt-2.5">
          <div
            className={`flex items-center rounded-xl border px-4 py-2.5 transition focus-within:ring-2 focus-within:ring-indigo-400/50 ${
              is3D
                ? "border-white/20 bg-white/10 text-white"
                : "border-gray-200 bg-gray-50 text-gray-900 focus-within:border-indigo-300 focus-within:bg-white"
            }`}
          >
            <span className={`mr-3 text-sm ${is3D ? "text-gray-400" : "text-gray-400"}`}>🔍</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={is3D ? "搜尋禁忌詞彙或國家，點擊後飛往該地…" : "搜尋禁忌詞彙、國家或語言…"}
              className={`flex-1 bg-transparent text-sm outline-none placeholder:text-gray-500 ${
                is3D ? "text-white" : "text-gray-800"
              }`}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className={`ml-2 text-sm transition ${is3D ? "text-gray-500 hover:text-white" : "text-gray-400 hover:text-gray-700"}`}
              >
                ✕
              </button>
            )}
          </div>
          <SearchDropdown
            results={searchResults}
            onSelect={handleSelect}
            dark={is3D}
          />
        </div>
      </div>
    </div>
  );

  // ─── 3D 模式 ──────────────────────────────────────────────────────────────

  if (is3D) {
    return (
      <main className="relative h-screen w-screen overflow-hidden bg-gray-950">
        {controlBar}
        <div className="h-full w-full">
          <GlobeView data={tabooData} focusItem={focusItem} />
        </div>
        <p className="absolute bottom-4 left-0 right-0 z-20 text-center text-xs text-gray-600">
          點擊氣泡查看詳情 · 拖曳旋轉 · 滾輪縮放
        </p>
      </main>
    );
  }

  // ─── 2D 模式 ──────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-gray-50">
      {controlBar}
      <GridView searchQuery={query} />
    </main>
  );
}
