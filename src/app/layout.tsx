import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { LanguageProvider } from "@/lib/i18n";

const sarabun = Sarabun({ subsets: ["thai", "latin"], weight: ["300", "400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "SkillShiftAI - แพลตฟอร์มออกแบบงานและพัฒนาทักษะ",
  description: "แพลตฟอร์ม AI สำหรับออกแบบงาน ปรับทักษะ และเปลี่ยนผ่านองค์กร",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className="dark">
      <body className={`${sarabun.className} bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen`}>
        <LanguageProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 lg:ml-64 transition-all duration-300 pt-14 lg:pt-0">
              <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">{children}</div>
            </main>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
