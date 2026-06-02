"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { ReportsContent } from "@/components/reports-content";

export default function ReportsPage() {
  return (
    <div className="flex min-h-screen w-full bg-slate-50/50">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Header />
        <main className="flex-1 space-y-6 p-8">
          <ReportsContent />
        </main>
      </div>
    </div>
  );
}