"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { MainContent } from "@/components/main-content";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full bg-slate-50/50">
      {/* Barra Lateral fixa na esquerda */}
      <Sidebar />

      {/* Contêiner da direita que ocupa o resto da tela de forma limpa */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* O Header agora vai cravar exatamente no topo da página, sem espaço vazio */}
        <Header />
        
        {/* Conteúdo principal com os cards e o gráfico azul */}
        <main className="flex-1">
          <MainContent />
        </main>
      </div>
    </div>
  );
}