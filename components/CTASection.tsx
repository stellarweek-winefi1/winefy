"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section
      className="py-20 px-4 sm:px-6 lg:px-8 bg-wine-700"
      aria-labelledby="cta-heading"
    >
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 id="cta-heading" className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Comienza Hoy
          </h2>
          <p className="text-xl text-wine-100 mb-10 max-w-3xl mx-auto">
            Únete a la revolución de la digitalización de vinos. Sin comisiones ocultas, sin barreras de entrada.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/mercado"
              className="inline-flex items-center justify-center bg-yellow-500 text-stone-900 px-10 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-400 transition-colors shadow-lg hover:shadow-xl min-w-[250px]"
              aria-label="Ver vinos disponibles en el mercado"
            >
              Ver Vinos Disponibles
            </Link>

            <Link
              href="/digitalizar"
              className="inline-flex items-center justify-center bg-white text-wine-700 px-10 py-4 rounded-lg font-semibold text-lg hover:bg-stone-100 transition-colors min-w-[250px]"
              aria-label="Digitalizar tus vinos"
            >
              Digitalizar Vinos
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
