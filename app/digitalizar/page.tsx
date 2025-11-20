"use client";

import { useState } from "react";
import { Wine, Upload, DollarSign, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const steps = [
  {
    id: 1,
    title: "Información del Vino",
    description: "Detalles básicos de tu cosecha",
    icon: Wine,
  },
  {
    id: 2,
    title: "Documentación",
    description: "Certificados y fotos",
    icon: Upload,
  },
  {
    id: 3,
    title: "Precio y Digitalización",
    description: "Define el valor por unidad",
    icon: DollarSign,
  },
  {
    id: 4,
    title: "Confirmar",
    description: "Revisa y digitaliza",
    icon: CheckCircle,
  },
];

export default function DigitalizarPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    wineName: "",
    region: "",
    vintage: "",
    description: "",
    bottleCount: "",
    pricePerBottle: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-black">
            Digitaliza tu <span className="text-black">Cosecha</span>
          </h1>
          <p className="text-xl text-black">
            Convierte tus vinos en activos digitales y accede a capital inmediato
          </p>
        </motion.div>

        {/* Step Indicators */}
        <div className="grid grid-cols-4 gap-4 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <motion.div
                key={step.id}
                className={cn(
                  "rounded-2xl p-6 border-2 transition-all duration-300 cursor-pointer",
                  isActive
                    ? "bg-black text-white border-black"
                    : isCompleted
                    ? "bg-gray-100 text-black border-black"
                    : "bg-white text-black border-black"
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setCurrentStep(step.id)}
              >
                <div className="flex flex-col items-center text-center">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors",
                      isActive
                        ? "bg-white bg-opacity-20"
                        : isCompleted
                        ? "bg-black bg-opacity-10"
                        : "bg-gray-100"
                    )}
                  >
                    <Icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div className="font-semibold text-sm mb-1">{step.title}</div>
                  <div className={cn(
                    "text-xs",
                    isActive ? "text-white" : "text-black"
                  )}>
                    {step.description}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Form Content */}
        <motion.div
          className="bg-white rounded-2xl shadow-md p-8 border border-black"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6 text-black">
                Información del Vino
              </h2>

              <div>
                <label
                  htmlFor="wineName"
                  className="block text-sm font-medium text-black mb-2"
                >
                  Nombre del Vino <span className="text-black">*</span>
                </label>
                <input
                  type="text"
                  id="wineName"
                  name="wineName"
                  value={formData.wineName}
                  onChange={handleInputChange}
                  placeholder="Ej: Malbec Reserva 2020"
                  className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="region"
                    className="block text-sm font-medium text-black mb-2"
                  >
                    Región <span className="text-black">*</span>
                  </label>
                  <input
                    type="text"
                    id="region"
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    placeholder="Ej: Mendoza, Argentina"
                    className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="vintage"
                    className="block text-sm font-medium text-black mb-2"
                  >
                    Añada <span className="text-black">*</span>
                  </label>
                  <input
                    type="text"
                    id="vintage"
                    name="vintage"
                    value={formData.vintage}
                    onChange={handleInputChange}
                    placeholder="Ej: 2020"
                    className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-black mb-2"
                >
                  Descripción
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe tu vino: notas de cata, proceso de elaboración, premios..."
                  rows={6}
                  className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="bottleCount"
                    className="block text-sm font-medium text-black mb-2"
                  >
                    Cantidad de Botellas <span className="text-black">*</span>
                  </label>
                  <input
                    type="number"
                    id="bottleCount"
                    name="bottleCount"
                    value={formData.bottleCount}
                    onChange={handleInputChange}
                    placeholder="Ej: 5000"
                    className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="pricePerBottle"
                    className="block text-sm font-medium text-black mb-2"
                  >
                    Precio por Botella (USD) <span className="text-black">*</span>
                  </label>
                  <input
                    type="number"
                    id="pricePerBottle"
                    name="pricePerBottle"
                    value={formData.pricePerBottle}
                    onChange={handleInputChange}
                    placeholder="Ej: 85"
                    className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6 text-black">Documentación</h2>
              <div className="text-center py-12">
                <Upload className="w-16 h-16 text-black mx-auto mb-4" />
                <p className="text-black mb-4">
                  Sube certificados de autenticidad, fotos de las botellas y cualquier documentación relevante
                </p>
                <button className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                  Seleccionar Archivos
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6 text-black">
                Precio y Digitalización
              </h2>
              <div className="text-center py-12">
                <p className="text-xl text-black mb-8">
                  Define el precio por unidad y confirma los detalles de digitalización
                </p>
                <div className="bg-gray-50 rounded-xl p-6 max-w-md mx-auto border border-black">
                  <div className="text-sm text-black mb-2">Precio sugerido por botella</div>
                  <div className="text-4xl font-bold text-black mb-4">
                    ${formData.pricePerBottle || "0"}
                  </div>
                  <div className="text-sm text-black">
                    Basado en vinos similares del mercado
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6 text-black">Confirmar</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-6 border border-black">
                  <h3 className="font-semibold mb-4 text-black">Resumen de Digitalización</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-black">Vino:</span>
                      <span className="font-semibold text-black">{formData.wineName || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black">Región:</span>
                      <span className="font-semibold text-black">{formData.region || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black">Añada:</span>
                      <span className="font-semibold text-black">{formData.vintage || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black">Cantidad:</span>
                      <span className="font-semibold text-black">{formData.bottleCount || "N/A"} botellas</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black">Precio por botella:</span>
                      <span className="font-semibold text-black">${formData.pricePerBottle || "0"}</span>
                    </div>
                  </div>
                </div>
                <button className="w-full bg-black text-white py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors">
                  Confirmar Digitalización
                </button>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-8 border-t border-black">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className={cn(
                "px-6 py-3 rounded-lg font-semibold transition-colors",
                currentStep === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              )}
            >
              Anterior
            </button>

            <button
              onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
              className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              {currentStep === 4 ? "Finalizar" : "Siguiente"}
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
