"use client";

import { useState, useRef } from "react";
import { Wine, Upload, DollarSign, CheckCircle, X, File, Image as ImageIcon } from "lucide-react";
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

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
}

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
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: UploadedFile[] = Array.from(files).map((file) => {
      const id = `${Date.now()}-${Math.random()}`;
      const uploadedFile: UploadedFile = { id, file };

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === id ? { ...f, preview: reader.result as string } : f
            )
          );
        };
        reader.readAsDataURL(file);
      }

      return uploadedFile;
    });

    setUploadedFiles((prev) => [...prev, ...newFiles]);
    
    // Reset input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (id: string) => {
    setUploadedFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return ImageIcon;
    }
    return File;
  };

  return (
    <main className="min-h-screen bg-white py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-6 sm:mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-black px-4">
            Digitaliza tu <span className="text-black">Cosecha</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-black px-4">
            Convierte tus vinos en activos digitales y accede a capital inmediato
          </p>
        </motion.div>

        {/* Step Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 md:mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <motion.div
                key={step.id}
                className={cn(
                  "rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border-2 transition-all duration-300 cursor-pointer",
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
                      "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3 transition-colors",
                      isActive
                        ? "bg-white bg-opacity-20"
                        : isCompleted
                        ? "bg-black bg-opacity-10"
                        : "bg-gray-100"
                    )}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" aria-hidden="true" />
                  </div>
                  <div className="font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1">{step.title}</div>
                  <div className={cn(
                    "text-[10px] sm:text-xs leading-tight",
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
          className="bg-white rounded-2xl shadow-md p-4 sm:p-6 md:p-8 border border-black"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-5 md:mb-6 text-black">
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
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-5 md:mb-6 text-black">Documentación</h2>
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Seleccionar archivos"
              />

              {/* Upload area */}
              <div className="text-center py-12">
                <Upload className="w-16 h-16 text-black mx-auto mb-4" />
                <p className="text-black mb-4">
                  Sube certificados de autenticidad, fotos de las botellas y cualquier documentación relevante
                </p>
                <button
                  onClick={handleFileSelect}
                  className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Seleccionar Archivos
                </button>
                <p className="text-xs text-gray-600 mt-2">
                  Formatos aceptados: Imágenes (JPG, PNG), PDF, DOC, DOCX
                </p>
              </div>

              {/* Uploaded files list */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-black">
                    Archivos Subidos ({uploadedFiles.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {uploadedFiles.map((uploadedFile) => {
                      const Icon = getFileIcon(uploadedFile.file);
                      const isImage = uploadedFile.file.type.startsWith("image/");

                      return (
                        <motion.div
                          key={uploadedFile.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gray-50 border-2 border-black rounded-lg p-4 relative group"
                        >
                          {/* Remove button */}
                          <button
                            onClick={() => handleRemoveFile(uploadedFile.id)}
                            className="absolute top-2 right-2 p-1 bg-black text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-800"
                            aria-label={`Eliminar ${uploadedFile.file.name}`}
                          >
                            <X className="w-4 h-4" />
                          </button>

                          {/* Image preview or file icon */}
                          {isImage && uploadedFile.preview ? (
                            <div className="mb-3">
                              <img
                                src={uploadedFile.preview}
                                alt={uploadedFile.file.name}
                                className="w-full h-32 object-cover rounded-lg border border-black"
                              />
                            </div>
                          ) : (
                            <div className="mb-3 flex items-center justify-center h-32 bg-white rounded-lg border border-black">
                              <Icon className="w-12 h-12 text-black" />
                            </div>
                          )}

                          {/* File info */}
                          <div className="space-y-1">
                            <p className="font-semibold text-black text-sm truncate" title={uploadedFile.file.name}>
                              {uploadedFile.file.name}
                            </p>
                            <p className="text-xs text-gray-600">
                              {formatFileSize(uploadedFile.file.size)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {uploadedFile.file.type || "Tipo desconocido"}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-5 md:mb-6 text-black">
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
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-5 md:mb-6 text-black">Confirmar</h2>
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
