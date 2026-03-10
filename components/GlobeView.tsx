"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Globe, { GlobeMethods } from "react-globe.gl";
import { TabooItem } from "@/types/taboo";

// ─── Severity 顏色映射 ────────────────────────────────────────────────────────

const severityColor: Record<TabooItem["severity_level"], string> = {
  Red: "#ef4444",
  Yellow: "#f59e0b",
  Green: "#22c55e",
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface GlobeViewProps {
  /** 搜尋後的資料（只渲染符合的氣泡） */
  data: TabooItem[];
  /** 從外部（搜尋列）觸發的飛行目標 */
  focusItem: TabooItem | null;
}

// ─── 主元件 ───────────────────────────────────────────────────────────────────

export default function GlobeView({ data, focusItem }: GlobeViewProps) {
  const router = useRouter();
  const globeEl = useRef<GlobeMethods | undefined>(undefined);

  // RWD：監聽視窗大小
  const [size, setSize] = useState({ w: 800, h: 600 });
  useEffect(() => {
    const update = () =>
      setSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // 初始視角 + 自轉
  useEffect(() => {
    if (!globeEl.current) return;
    globeEl.current.pointOfView({ lat: 20, lng: 10, altitude: 2 }, 0);
    const controls = globeEl.current.controls();
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.4;
    }
  }, []);

  // 點擊氣泡 or 搜尋選中 → 飛行 → 跳轉詳細頁
  const flyAndNavigate = useCallback(
    (item: TabooItem) => {
      if (!globeEl.current) return;
      const controls = globeEl.current.controls();
      if (controls) controls.autoRotate = false;
      globeEl.current.pointOfView(
        { lat: item.lat, lng: item.lng, altitude: 1.5 },
        1000
      );
      setTimeout(() => router.push(`/word/${item.id}`), 1200);
    },
    [router]
  );

  // 外部 focusItem 變化（搜尋選中）
  useEffect(() => {
    if (!focusItem) return;
    flyAndNavigate(focusItem);
  }, [focusItem, flyAndNavigate]);

  // 渲染 HTML 氣泡（imperative DOM，不能用 JSX）
  const htmlElement = useCallback(
    (d: object) => {
      const item = d as TabooItem;
      const color = severityColor[item.severity_level];
      const wrapper = document.createElement("div");
      wrapper.style.cssText = "pointer-events: auto; user-select: none;";
      wrapper.innerHTML = `
        <div style="
          position: relative;
          background: white;
          border: 2px solid ${color};
          border-radius: 12px;
          padding: 5px 10px;
          font-size: 11px;
          font-weight: 700;
          color: #1e293b;
          white-space: nowrap;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
          transform: translateY(-100%);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        " class="bubble">
          <span style="color:${color}; margin-right:4px; font-size:9px;">●</span>${item.word}
          <div style="
            position: absolute;
            bottom: -8px; left: 50%;
            transform: translateX(-50%);
            width: 0; height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 8px solid ${color};
          "></div>
        </div>`;
      const bubble = wrapper.querySelector(".bubble") as HTMLElement;
      wrapper.addEventListener("mouseenter", () => {
        bubble.style.transform = "translateY(-108%) scale(1.06)";
        bubble.style.boxShadow = "0 6px 20px rgba(0,0,0,0.4)";
      });
      wrapper.addEventListener("mouseleave", () => {
        bubble.style.transform = "translateY(-100%) scale(1)";
        bubble.style.boxShadow = "0 4px 16px rgba(0,0,0,0.3)";
      });
      wrapper.addEventListener("click", () => flyAndNavigate(item));
      return wrapper;
    },
    [flyAndNavigate]
  );

  return (
    <Globe
      ref={globeEl}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
      bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
      backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
      htmlElementsData={data}
      htmlLat={(d) => (d as TabooItem).lat}
      htmlLng={(d) => (d as TabooItem).lng}
      htmlAltitude={0.01}
      htmlElement={htmlElement}
      width={size.w}
      height={size.h}
    />
  );
}
