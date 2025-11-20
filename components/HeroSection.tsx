"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section
      className="relative bg-white py-20 px-4 sm:px-6 lg:px-8"
      aria-labelledby="hero-heading"
    >
      <div className="max-w-7xl mx-auto text-center">
        <motion.h1
          id="hero-heading"
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 text-black leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Invierte en Vinos <span className="text-black">Premium</span>
        </motion.h1>

        <motion.p
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-black mb-6 sm:mb-8 md:mb-10 max-w-4xl mx-auto px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Invierte en vinos premium de Chile, Argentina (Mendoza) y USA desde
          $50. Digitalización respaldada en Stellar.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 md:mb-20 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link
            href="/mercado"
            className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl w-full sm:w-auto"
            aria-label="Explorar mercado de vinos"
          >
            Explorar Mercado
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
          </Link>

          <Link
            href="/digitalizar"
            className="inline-flex items-center justify-center gap-2 bg-white text-black px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg border-2 border-black hover:bg-gray-50 transition-colors w-full sm:w-auto"
            aria-label="Digitalizar tus vinos"
          >
            Digitalizar Vinos
          </Link>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-6xl mx-auto px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="bg-white rounded-xl p-4 sm:p-5 md:p-6 shadow-md border border-black">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-1 sm:mb-2">$340B</div>
            <div className="text-black text-xs sm:text-sm">Mercado Global de Vinos</div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-5 md:p-6 shadow-md border border-black">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-1 sm:mb-2">7-10%</div>
            <div className="text-black text-xs sm:text-sm">Retorno Anual Promedio</div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-5 md:p-6 shadow-md border border-black">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-1 sm:mb-2">$50</div>
            <div className="text-black text-xs sm:text-sm">Inversión Mínima</div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-5 md:p-6 shadow-md border border-black">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-1 sm:mb-2">3-5s</div>
            <div className="text-black text-xs sm:text-sm">Tiempo de Transacción</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
