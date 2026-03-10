"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import TabooCard from "./TabooCard";
import { tabooData } from "@/data/tabooData";
import { TabooItem } from "@/types/taboo";

// ─── Props ────────────────────────────────────────────────────────────────────

interface GridViewProps {
  searchQuery: string;
}

// ─── 雙層篩選 ─────────────────────────────────────────────────────────────────

export default function GridView({ searchQuery }: GridViewProps) {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState<string>("All");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");

  const countries = useMemo(
    () => Array.from(new Set(tabooData.map((d) => d.country))).sort(),
    []
  );

  const regions = useMemo(() => {
    if (selectedCountry === "All") return [];
    const set = new Set<string>();
    tabooData
      .filter((d) => d.country === selectedCountry)
      .forEach((d) => d.regions.forEach((r) => r !== "All" && set.add(r)));
    return Array.from(set).sort();
  }, [selectedCountry]);

  function handleCountrySelect(country: string) {
    setSelectedCountry(country);
    setSelectedRegion("All");
  }

  const filteredData: TabooItem[] = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return tabooData.filter((item) => {
      const matchesSearch =
        q === "" ||
        item.word.toLowerCase().includes(q) ||
        item.country.toLowerCase().includes(q) ||
        item.language.toLowerCase().includes(q) ||
        item.cultural_context.toLowerCase().includes(q);
      const matchesCountry =
        selectedCountry === "All" || item.country === selectedCountry;
      const matchesRegion =
        selectedRegion === "All" ||
        item.regions.includes("All") ||
        item.regions.includes(selectedRegion);
      return matchesSearch && matchesCountry && matchesRegion;
    });
  }, [searchQuery, selectedCountry, selectedRegion]);

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">

      {/* 第一層：國家 Tabs */}
      <div className="mb-3 pt-4">
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

      {/* 第二層：地區 Pills */}
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

      {/* 結果數量 */}
      <p className="mb-4 text-xs text-gray-400">
        顯示 {filteredData.length} / {tabooData.length} 條目
      </p>

      {/* 卡片網格 */}
      {filteredData.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredData.map((item) => (
            <div
              key={item.id}
              className="cursor-pointer"
              onClick={() => router.push(`/word/${item.id}`)}
            >
              <TabooCard item={item} />
            </div>
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
    </div>
  );
}
