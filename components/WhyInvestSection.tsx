"use client";

import { Wine, Shield, Globe, TrendingUp, FileCheck, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useRef } from "react";

const benefits = [
  {
    icon: Shield,
    title: "Protección de Marca",
    description: "Protege tu marca contra falsificaciones. Cada lote certificado tiene una identidad única verificable que no se puede copiar.",
  },
  {
    icon: FileCheck,
    title: "Certificación Automática",
    description: "Obtén certificaciones digitales automáticas para tus lotes. Ideal para exportaciones y cumplimiento regulatorio.",
  },
  {
    icon: Users,
    title: "Confianza del Cliente",
    description: "Tus clientes pueden verificar la autenticidad y origen de cada botella. Transparencia que construye lealtad y valor de marca.",
  },
  {
    icon: TrendingUp,
    title: "Soporte para Exportación",
    description: "Documentación completa y verificable para cumplir con requisitos internacionales. Facilita la exportación a nuevos mercados.",
  },
  {
    icon: Globe,
    title: "Detección de Problemas",
    description: "Identifica rápidamente problemas en la cadena de distribución. Registra cada movimiento desde el viñedo hasta el cliente final.",
  },
  {
    icon: Wine,
    title: "Fácil de Usar",
    description: "No necesitas conocimientos técnicos. Simplemente escanea QR y registra eventos. Funciona desde cualquier teléfono o tablet.",
  },
];

export default function WhyInvestSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden"
      aria-labelledby="value-heading"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-8 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-4 px-4"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Wine className="w-8 h-8 sm:w-10 sm:h-10 text-black" aria-hidden="true" />
            </motion.div>
            <h2
              id="value-heading"
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black text-center"
            >
              ¿Por qué Vinifica para tu Bodega?
            </h2>
          </motion.div>
          <motion.p
            className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto px-4 mt-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Diseñado específicamente para bodegas y productores que buscan proteger su marca, 
            demostrar autenticidad y simplificar la trazabilidad sin complicaciones técnicas.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-black relative overflow-hidden group cursor-pointer"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1]
                }}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
              >
                {/* Hover background effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                
                {/* Animated icon container */}
                <motion.div
                  className="bg-black w-14 h-14 rounded-xl flex items-center justify-center mb-5 relative z-10"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 5,
                    transition: { duration: 0.3 }
                  }}
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      repeatDelay: 2,
                      ease: "easeInOut"
                    }}
                  >
                    <Icon className="w-7 h-7 text-white" aria-hidden="true" />
                  </motion.div>
                </motion.div>
                
                <div className="relative z-10">
                  <motion.h3
                    className="text-xl font-semibold mb-3 text-black"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {benefit.title}
                  </motion.h3>
                  <p className="text-base text-gray-700 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>

                {/* Decorative corner */}
                <motion.div
                  className="absolute bottom-0 right-0 w-24 h-24 bg-black/5 rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
