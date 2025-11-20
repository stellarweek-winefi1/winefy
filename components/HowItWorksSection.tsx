"use client";

import { Wine, TrendingUp, Zap, Shield, Users } from "lucide-react";
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
];

export default function HowItWorksSection() {
  return (
    <section
      className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
      aria-labelledby="how-it-works-heading"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 id="how-it-works-heading" className="text-4xl sm:text-5xl font-bold mb-4">
            Cómo Funciona <span className="text-wine-700">VineFi</span>
          </h2>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto">
            Una plataforma simple y segura para democratizar la inversión en vinos
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="bg-stone-50 rounded-2xl p-8 border border-stone-200 hover:border-wine-700 hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="bg-wine-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-wine-700" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-stone-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
