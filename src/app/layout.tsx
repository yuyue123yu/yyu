import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Legal Consultation Malaysia | 马来西亚法律咨询",
  description: "专业的在线法律咨询平台，为马来西亚用户提供便捷的法律服务",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ms">
      <body className={inter.className}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
