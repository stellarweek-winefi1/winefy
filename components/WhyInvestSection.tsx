"use client";

import { Wine, TrendingUp, Shield, Globe, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  {
    icon: TrendingUp,
    title: "Apreciación con el Tiempo",
    description: "Los vinos de alta calidad tienden a aumentar su valor con el tiempo",
  },
  {
    icon: Shield,
    title: "Resistente a la Inflación",
    description: "Protege tu patrimonio de la volatilidad de los mercados tradicionales",
  },
  {
    icon: Globe,
    title: "Demanda Global",
    description: "Activo con demanda internacional y oferta limitada",
  },
  {
    icon: BarChart3,
    title: "Diversificación",
    description: "Inversión tangible, escasa y con potencial de crecimiento constante",
  },
];

export default function WhyInvestSection() {
  return (
    <section
      className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
      aria-labelledby="why-invest-heading"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-8 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-4 px-4">
            <Wine className="w-8 h-8 sm:w-10 sm:h-10 text-black" aria-hidden="true" />
            <h2
              id="why-invest-heading"
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black text-center"
            >
              ¿Por qué invertir en vinos premium?
            </h2>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-start lg:items-center mb-8 sm:mb-12 md:mb-16">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4 sm:space-y-5 md:space-y-6 px-4 lg:px-0"
          >
            <p className="text-base sm:text-lg text-black leading-relaxed">
              Invertir en vino no es solo una pasión: es una estrategia inteligente
              para proteger y hacer crecer tu patrimonio. Los vinos de alta calidad
              tienden a apreciarse con el tiempo, son resistentes a la inflación y no
              dependen de la volatilidad de los mercados tradicionales.
            </p>
            <p className="text-base sm:text-lg text-black leading-relaxed">
              Participar en vinos premium te permite construir un activo estable,
              respaldado por un producto real, con demanda global y oferta limitada.
            </p>
            <p className="text-base sm:text-lg text-black leading-relaxed">
              Es una forma de crear libertad a largo plazo, diversificando tu dinero
              en algo tangible, escaso y con potencial de crecimiento constante.
            </p>
          </motion.div>

          {/* Benefits Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 px-4 lg:px-0"
          >
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  className="bg-white rounded-2xl p-6 border-2 border-black hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="bg-black w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-black">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-black leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

