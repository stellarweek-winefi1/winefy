"use client";

import { Wine, TrendingUp, Zap, Shield, Users, ArrowLeftRight } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Wine,
    title: "Digitaliza Vinos",
    description:
      "Convierte tu cosecha en activos digitales respaldados 1:1 por botellas reales",
  },
  {
    icon: TrendingUp,
    title: "Invierte desde $50",
    description:
      "Accede al mercado de vinos premium con inversiones fraccionadas",
  },
  {
    icon: Zap,
    title: "Transacciones Rápidas",
    description:
      "Construido en Stellar: comisiones de $0.00001 y liquidación en 3-5 segundos",
  },
  {
    icon: Shield,
    title: "100% Respaldado",
    description:
      "Cada activo digital representa una botella física en bodega certificada",
  },
  {
    icon: Users,
    title: "Para Todos",
    description:
      "Diseñado para ser fácil de usar, sin necesidad de experiencia técnica",
  },
  {
    icon: ArrowLeftRight,
    title: "Liquidez Total",
    description:
      "Vende tus activos digitales en cualquier momento a través del mercado secundario",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
      aria-labelledby="how-it-works-heading"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-8 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 id="how-it-works-heading" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-black px-4">
            Cómo Funciona <span className="text-black">VineFi</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-black max-w-3xl mx-auto px-4">
            Una plataforma simple y segura para democratizar la inversión en vinos
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 border border-black hover:border-black hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="bg-black w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" aria-hidden="true" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-black">{feature.title}</h3>
                <p className="text-sm sm:text-base text-black leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
