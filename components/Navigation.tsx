"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Wine, Home, TrendingUp, Briefcase, Lightbulb, Wallet, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu when clicking outside or on escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Close menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { href: "/", label: "Inicio", icon: Home },
    { href: "/mercado", label: "Mercado", icon: TrendingUp },
    { href: "/inversiones", label: "Mis Inversiones", icon: Wallet },
    { href: "/portafolio", label: "Mi Portafolio", icon: Briefcase },
    { href: "/digitalizar", label: "Digitalizar", icon: Lightbulb },
  ];

  return (
    <nav 
      className="sticky top-0 z-50 bg-white border-b border-black" 
      role="navigation" 
      aria-label="Navegación principal"
    >
      <div ref={menuRef} className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-1.5 sm:gap-2 text-black hover:text-gray-800 transition-colors flex-shrink-0"
            aria-label="VineFi - Ir a inicio"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Wine className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 flex-shrink-0" aria-hidden="true" />
            <span className="text-base sm:text-lg md:text-xl font-semibold whitespace-nowrap">VineFi</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 xl:px-4 py-2 rounded-lg transition-all duration-200",
                    "hover:bg-black hover:text-white",
                    isActive
                      ? "bg-black text-white"
                      : "text-black"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span className="font-medium text-sm xl:text-base">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 -mr-2 text-black hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors touch-manipulation"
            aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isMobileMenuOpen}
            type="button"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-black bg-white animate-in slide-in-from-top-2">
            <div className="flex flex-col gap-1 py-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 touch-manipulation",
                      "active:bg-gray-100",
                      "hover:bg-black hover:text-white",
                      isActive
                        ? "bg-black text-white font-semibold"
                        : "text-black"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                    <span className="font-medium text-base">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
