"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  // Array de navegação para renderizar os botões dinamicamente
  const navItems = [
    {
      label: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      label: "Relatórios",
      href: "/reports",
      icon: FileText,
    },
    {
      label: "Localização",
      href: "/maps",
      icon: MapPin,
    },
  ];

  return (
    <aside className="hidden border-r border-slate-200/80 bg-white md:block md:w-64 flex-shrink-0">
      <div className="flex h-full flex-col gap-2">
        {/* Logo / Título Principal */}
        <div className="flex h-14 items-center border-b border-slate-100 px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
            <span>Flood Monitor</span>
          </Link>
        </div>

        {/* Itens do Menu */}
        <div className="flex-1 px-4 py-3">
          <nav className="grid items-start gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}