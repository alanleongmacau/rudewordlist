import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "全球文化禁忌與衝突避險指南",
  description: "識別跨文化的發音陷阱、手勢禁忌與語意差異，避免因文化隔閡造成的誤解與衝突。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body className="antialiased">{children}</body>
    </html>
  );
}
