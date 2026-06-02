"use client";

import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  // Define o título dinamicamente de acordo com a URL que está aberta
  const getTitle = () => {
    if (pathname === "/reports") return "Relatórios";
    if (pathname === "/maps") return "Localização";
    return "Dashboard"; // Padrão para a home "/"
  };

  return (
    <header className="flex h-14 items-center gap-4 border-b border-slate-200/80 bg-white px-6 flex-shrink-0">
      <div className="flex flex-1 items-center">
        {/* Agora o título vai mudar sozinho ao clicar nos menus laterais! */}
        <h1 className="text-lg font-semibold text-slate-900 transition-all duration-200">
          {getTitle()}
        </h1>
      </div>
    </header>
  );
}