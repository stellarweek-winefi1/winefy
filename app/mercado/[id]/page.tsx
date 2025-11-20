"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { MapPin, TrendingUp, ArrowLeft, Calculator, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

// Wine data - in a real app, this would come from an API or database
const wines = [
  {
    id: "catena-zapata",
    name: "Catena Zapata Malbec Argentino",
    region: "Luján de Cuyo",
    country: "Mendoza, Argentina",
    countryFlag: "🇦🇷",
    rating: 95,
    pricePerUnit: 120,
    annualReturn: 8.2,
    available: 2100,
    total: 3000,
    description: "Un Malbec excepcional de la reconocida bodega Catena Zapata, con notas de frutos rojos y especias.",
  },
  {
    id: "almaviva-2018",
    name: "Almaviva 2018",
    region: "Valle de Maipo",
    country: "Chile",
    countryFlag: "🇨🇱",
    rating: 96,
    pricePerUnit: 180,
    annualReturn: 9.1,
    available: 1450,
    total: 2000,
    description: "Un vino premium resultado de la colaboración entre Concha y Toro y Baron Philippe de Rothschild.",
  },
  {
    id: "achaval-ferrer",
    name: "Achaval-Ferrer Finca Bella Vista",
    region: "Valle de Uco",
    country: "Mendoza, Argentina",
    countryFlag: "🇦🇷",
    rating: 94,
    pricePerUnit: 95,
    annualReturn: 7.8,
    available: 3200,
    total: 4500,
    description: "Un Malbec de alta expresión que refleja el terroir único del Valle de Uco.",
  },
];

export default function InvestmentPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  
  const [wine, setWine] = useState<typeof wines[0] | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState<string>("");
  const [units, setUnits] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastEdited, setLastEdited] = useState<"amount" | "units" | null>(null);

  useEffect(() => {
    const foundWine = wines.find((w) => w.id === id);
    if (foundWine) {
      setWine(foundWine);
    }
  }, [id]);

  // Calculate units from investment amount
  useEffect(() => {
    if (wine && investmentAmount && lastEdited === "amount") {
      const amount = parseFloat(investmentAmount);
      if (!isNaN(amount) && amount > 0) {
        const calculatedUnits = Math.floor(amount / wine.pricePerUnit);
        setUnits(calculatedUnits.toString());
      } else {
        setUnits("");
      }
    }
  }, [investmentAmount, wine, lastEdited]);

  // Calculate investment amount from units
  useEffect(() => {
    if (wine && units && lastEdited === "units") {
      const numUnits = parseInt(units);
      if (!isNaN(numUnits) && numUnits > 0) {
        const calculatedAmount = (numUnits * wine.pricePerUnit).toFixed(2);
        setInvestmentAmount(calculatedAmount);
      } else {
        setInvestmentAmount("");
      }
    }
  }, [units, wine, lastEdited]);

  const handleInvestmentAmountChange = (value: string) => {
    // Allow only numbers and decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setInvestmentAmount(value);
      setLastEdited("amount");
    }
  };

  const handleUnitsChange = (value: string) => {
    // Allow only integers
    if (value === "" || /^\d+$/.test(value)) {
      if (wine) {
        const numUnits = parseInt(value) || 0;
        if (numUnits > wine.available) {
          setUnits(wine.available.toString());
          setLastEdited("units");
          return;
        }
      }
      setUnits(value);
      setLastEdited("units");
    }
  };

  const handleInvest = async () => {
    if (!wine) return;

    const numUnits = parseInt(units) || 0;
    const amount = parseFloat(investmentAmount) || 0;

    if (numUnits <= 0 || amount <= 0) {
      alert("Por favor, ingresa una cantidad válida");
      return;
    }

    if (numUnits > wine.available) {
      alert(`Solo hay ${wine.available} unidades disponibles`);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/portafolio");
      }, 2000);
    }, 1500);
  };

  if (!wine) {
    return (
      <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p className="text-xl text-black mb-4">Vino no encontrado</p>
            <Link
              href="/mercado"
              className="inline-flex items-center gap-2 text-black hover:text-gray-800 underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al mercado
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const numUnits = parseInt(units) || 0;
  const totalAmount = numUnits * wine.pricePerUnit;
  const projectedReturn = (totalAmount * wine.annualReturn) / 100;
  const availabilityPercentage = (wine.available / wine.total) * 100;

  return (
    <main className="min-h-screen bg-white py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          href="/mercado"
          className="inline-flex items-center gap-2 text-black hover:text-gray-800 mb-4 sm:mb-6 md:mb-8 transition-colors text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
          <span className="font-medium">Volver al mercado</span>
        </Link>

        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border-2 border-black rounded-2xl p-6 sm:p-8 md:p-12 text-center"
          >
            <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 text-black mx-auto mb-4 sm:mb-6" />
            <h2 className="text-2xl sm:text-3xl font-bold text-black mb-3 sm:mb-4">
              ¡Inversión realizada con éxito!
            </h2>
            <p className="text-base sm:text-lg text-black mb-6 sm:mb-8">
              Has invertido en {numUnits} unidades de {wine.name}
            </p>
            <p className="text-xs sm:text-sm text-gray-600">
              Redirigiendo a tu portafolio...
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {/* Wine Details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border-2 border-black rounded-2xl overflow-hidden"
            >
              {/* Wine Image */}
              <div className="bg-black h-48 sm:h-56 md:h-64 flex items-center justify-center">
                <div className="text-6xl sm:text-7xl md:text-8xl" role="img" aria-label="Vino">
                  🍷
                </div>
              </div>

              {/* Wine Info */}
              <div className="p-4 sm:p-5 md:p-6">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-black flex-1 pr-2">
                    {wine.name}
                  </h1>
                  <div className="bg-black text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-sm sm:text-base flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                    <span aria-hidden="true">⭐</span>
                    <span>{wine.rating}</span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-black mb-4 sm:mb-5 md:mb-6">
                  <span className="text-lg sm:text-xl flex-shrink-0">{wine.countryFlag}</span>
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" aria-hidden="true" />
                  <span className="text-sm sm:text-base truncate">{wine.region}, {wine.country}</span>
                </div>

                {/* Description */}
                {wine.description && (
                  <p className="text-sm sm:text-base text-black mb-4 sm:mb-5 md:mb-6 leading-relaxed">
                    {wine.description}
                  </p>
                )}

                {/* Price and Return */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-xs text-black mb-1">Precio/Unidad</div>
                    <div className="text-xl sm:text-2xl font-bold text-black">${wine.pricePerUnit}</div>
                  </div>
                  <div>
                    <div className="text-xs text-black mb-1">Retorno Anual</div>
                    <div className="text-xl sm:text-2xl font-bold text-black flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                      {wine.annualReturn}%
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-black font-medium">Disponibles</span>
                    <span className="font-semibold text-black">
                      {wine.available} / {wine.total} unidades
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-black h-full rounded-full transition-all duration-500"
                      style={{ width: `${availabilityPercentage}%` }}
                      role="progressbar"
                      aria-valuenow={wine.available}
                      aria-valuemin={0}
                      aria-valuemax={wine.total}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Investment Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border-2 border-black rounded-2xl p-4 sm:p-6 md:p-8"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-5 md:mb-6 flex items-center gap-2">
                <Calculator className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
                Realizar Inversión
              </h2>

              {/* Investment Amount Input */}
              <div className="mb-4 sm:mb-5 md:mb-6">
                <label
                  htmlFor="investment-amount"
                  className="block text-sm font-medium text-black mb-2"
                >
                  Monto de Inversión (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-black font-semibold">
                    $
                  </span>
                  <input
                    id="investment-amount"
                    type="text"
                    inputMode="decimal"
                    value={investmentAmount}
                    onChange={(e) => handleInvestmentAmountChange(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-7 sm:pl-8 pr-4 py-2.5 sm:py-3 rounded-lg border-2 border-black focus:outline-none focus:ring-2 focus:ring-black text-base sm:text-lg font-semibold"
                    aria-label="Monto de inversión en dólares"
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Mínimo: ${wine.pricePerUnit}
                </p>
              </div>

              {/* Units Input */}
              <div className="mb-4 sm:mb-5 md:mb-6">
                <label
                  htmlFor="units"
                  className="block text-sm font-medium text-black mb-2"
                >
                  Número de Unidades
                </label>
                <input
                  id="units"
                  type="text"
                  inputMode="numeric"
                  value={units}
                  onChange={(e) => handleUnitsChange(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-2.5 sm:py-3 rounded-lg border-2 border-black focus:outline-none focus:ring-2 focus:ring-black text-base sm:text-lg font-semibold"
                  aria-label="Número de unidades a comprar"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Máximo: {wine.available} unidades disponibles
                </p>
              </div>

              {/* Investment Summary */}
              {numUnits > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-gray-50 border-2 border-black rounded-lg p-4 sm:p-5 md:p-6 mb-4 sm:mb-5 md:mb-6"
                >
                  <h3 className="text-base sm:text-lg font-semibold text-black mb-3 sm:mb-4">
                    Resumen de Inversión
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between text-sm sm:text-base text-black">
                      <span>Unidades:</span>
                      <span className="font-semibold">{numUnits}</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base text-black">
                      <span>Precio por unidad:</span>
                      <span className="font-semibold">${wine.pricePerUnit}</span>
                    </div>
                    <div className="border-t-2 border-black pt-2 sm:pt-3 flex justify-between text-sm sm:text-base text-black">
                      <span className="font-semibold">Total a invertir:</span>
                      <span className="font-bold text-lg sm:text-xl">${totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="pt-2 sm:pt-3 border-t border-gray-300">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-sm sm:text-base text-black">
                        <span className="break-words">Retorno anual estimado ({wine.annualReturn}%):</span>
                        <span className="font-semibold text-green-600 sm:text-right">
                          +${projectedReturn.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Invest Button */}
              <button
                onClick={handleInvest}
                disabled={
                  isSubmitting ||
                  numUnits <= 0 ||
                  numUnits > wine.available ||
                  totalAmount < wine.pricePerUnit
                }
                className="w-full bg-black text-white text-center py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                aria-label="Confirmar inversión"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Procesando...</span>
                  </>
                ) : (
                  "Confirmar Inversión"
                )}
              </button>

              {/* Info Note */}
              <p className="text-xs text-gray-600 mt-3 sm:mt-4 text-center">
                Al confirmar, serás redirigido para completar el pago y la transacción.
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </main>
  );
}

