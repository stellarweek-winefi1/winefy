"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section
      className="relative bg-gradient-to-b from-stone-100 to-stone-50 py-20 px-4 sm:px-6 lg:px-8"
      aria-labelledby="hero-heading"
    >
      <div className="max-w-7xl mx-auto text-center">
        <motion.h1
          id="hero-heading"
          className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Invierte en Vinos <span className="text-wine-700">Premium</span>
        </motion.h1>

        <motion.p
          className="text-xl sm:text-2xl text-stone-600 mb-10 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Invierte en vinos premium de Chile, Argentina (Mendoza) y USA desde
          $50. Digitalización respaldada en Stellar.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link
            href="/mercado"
            className="inline-flex items-center gap-2 bg-wine-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-wine-800 transition-colors shadow-lg hover:shadow-xl"
            aria-label="Explorar mercado de vinos"
          >
            Explorar Mercado
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Link>

          <Link
            href="/digitalizar"
            className="inline-flex items-center gap-2 bg-white text-wine-700 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-wine-700 hover:bg-wine-50 transition-colors"
            aria-label="Digitalizar tus vinos"
          >
            Digitalizar Vinos
          </Link>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-4xl font-bold text-wine-700 mb-2">$340B</div>
            <div className="text-stone-600 text-sm">Mercado Global de Vinos</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-4xl font-bold text-wine-700 mb-2">7-10%</div>
            <div className="text-stone-600 text-sm">Retorno Anual Promedio</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-4xl font-bold text-wine-700 mb-2">$50</div>
            <div className="text-stone-600 text-sm">Inversión Mínima</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-4xl font-bold text-wine-700 mb-2">3-5s</div>
            <div className="text-stone-600 text-sm">Tiempo de Transacción</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
