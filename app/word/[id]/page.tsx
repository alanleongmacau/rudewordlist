import Link from "next/link";
import { notFound } from "next/navigation";
import TabooCard from "@/components/TabooCard";
import { tabooData } from "@/data/tabooData";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function WordDetailPage({ params }: Props) {
  const { id } = await params;
  const item = tabooData.find((d) => d.id === id);

  if (!item) notFound();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-4 py-12">

      {/* 返回按鈕 */}
      <Link
        href="/"
        className="mb-8 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/20"
      >
        <span>🌍</span>
        返回地球
      </Link>

      {/* 卡片（最大寬度限制，保持可讀性） */}
      <div className="w-full max-w-lg">
        <TabooCard item={item} />
      </div>

      {/* 導航提示 */}
      <p className="mt-6 text-xs text-gray-600">
        共 {tabooData.length} 條目 · 點擊返回繼續探索地球
      </p>
    </main>
  );
}

// 靜態生成所有 id
export function generateStaticParams() {
  return tabooData.map((item) => ({ id: item.id }));
}
