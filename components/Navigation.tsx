"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wine, Home, TrendingUp, Briefcase, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Inicio", icon: Home },
    { href: "/mercado", label: "Mercado", icon: TrendingUp },
    { href: "/portafolio", label: "Mi Portafolio", icon: Briefcase },
    { href: "/digitalizar", label: "Digitalizar", icon: Lightbulb },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-stone-50 border-b border-stone-200" role="navigation" aria-label="Navegación principal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-wine-700 hover:text-wine-800 transition-colors"
            aria-label="VineFi - Ir a inicio"
          >
            <Wine className="w-7 h-7" aria-hidden="true" />
            <span className="text-xl font-semibold">VineFi</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
                    "hover:bg-wine-700 hover:text-white",
                    isActive
                      ? "bg-wine-700 text-white"
                      : "text-stone-700"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
