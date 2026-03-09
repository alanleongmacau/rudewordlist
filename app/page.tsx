"use client";

import { useState, useMemo } from "react";
import TabooCard from "../components/TabooCard";
import { tabooData } from "../data/tabooData";

// ─── 統計（固定，不隨篩選變動）────────────────────────────────────────────────

const totalCount = tabooData.length;
const redCount = tabooData.filter((d) => d.severity_level === "Red").length;
const countryCount = new Set(tabooData.map((d) => d.country)).size;

// ─── 頁面 ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("All");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");

  // 第一層：所有可用國家（排序）
  const countries = useMemo(
    () => Array.from(new Set(tabooData.map((d) => d.country))).sort(),
    []
  );

  // 第二層：選定國家的所有地區（排除 "All"，排序）
  const regions = useMemo(() => {
    if (selectedCountry === "All") return [];
    const regionSet = new Set<string>();
    tabooData
      .filter((d) => d.country === selectedCountry)
      .forEach((d) => d.regions.forEach((r) => r !== "All" && regionSet.add(r)));
    return Array.from(regionSet).sort();
  }, [selectedCountry]);

  // 切換國家時重置地區篩選
  function handleCountrySelect(country: string) {
    setSelectedCountry(country);
    setSelectedRegion("All");
  }

  // 過濾邏輯：搜尋 AND 國家 AND 地區
  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return tabooData.filter((item) => {
      const matchesSearch =
        q === "" ||
        item.word.toLowerCase().includes(q) ||
        item.country.toLowerCase().includes(q) ||
        item.cultural_context.toLowerCase().includes(q) ||
        item.language.toLowerCase().includes(q);

      const matchesCountry =
        selectedCountry === "All" || item.country === selectedCountry;

      const matchesRegion =
        selectedRegion === "All" ||
        item.regions.includes("All") ||
        item.regions.includes(selectedRegion);

      return matchesSearch && matchesCountry && matchesRegion;
    });
  }, [searchQuery, selectedCountry, selectedRegion]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ── Hero Header ── */}
      <header className="border-b border-gray-200 bg-white px-6 py-10 text-center shadow-sm">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-500">
          Global Cultural Intelligence
        </p>
        <h1 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
          全球文化禁忌與衝突避險指南
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base text-gray-500">
          識別跨文化的發音陷阱、手勢禁忌與語意差異，避免因文化隔閡造成的誤解與衝突。
        </p>

        {/* 統計數字 */}
        <div className="mt-6 flex justify-center gap-8">
          {[
            { value: totalCount, label: "條目" },
            { value: redCount, label: "高危" },
            { value: countryCount, label: "國家" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <span className="block text-2xl font-bold text-indigo-600">
                {value}
              </span>
              <span className="text-xs text-gray-400">{label}</span>
            </div>
          ))}
        </div>
      </header>

      {/* ── 篩選區塊 ── */}
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">

        {/* 搜尋列 */}
        <div className="relative mb-5">
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-gray-400">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜尋詞彙、國家、語言..."
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-800 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* 第一層：國家 Tabs */}
        <div className="mb-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
            國家
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCountrySelect("All")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                selectedCountry === "All"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All Countries
            </button>
            {countries.map((country) => (
              <button
                key={country}
                onClick={() => handleCountrySelect(country)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  selectedCountry === country
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {country}
              </button>
            ))}
          </div>
        </div>

        {/* 第二層：地區 Pills（僅在選定國家後顯示） */}
        {selectedCountry !== "All" && regions.length > 0 && (
          <div className="mb-3 border-t border-gray-100 pt-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
              {selectedCountry} · 地區
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedRegion("All")}
                className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                  selectedRegion === "All"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                All Regions
              </button>
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                    selectedRegion === region
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 結果數量提示 */}
        <p className="mb-4 text-xs text-gray-400">
          顯示 {filteredData.length} / {totalCount} 條目
        </p>
      </div>

      {/* ── 卡片網格 ── */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredData.map((item) => (
              <TabooCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-20 text-center">
            <span className="text-4xl">🔎</span>
            <p className="mt-3 text-base font-medium text-gray-500">
              找不到符合條件的條目
            </p>
            <p className="mt-1 text-sm text-gray-400">
              請嘗試調整搜尋關鍵字或篩選條件
            </p>
          </div>
        )}

        <p className="mt-10 text-center text-xs text-gray-400">
          本指南僅供教育與文化敏感度提升用途，資料持續更新。
        </p>
      </section>
    </main>
  );
}
