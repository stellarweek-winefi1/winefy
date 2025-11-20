"use client";

import { MapPin, TrendingUp, TrendingDown, Calendar, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { UserInvestment } from "@/lib/getUserInvestments";

interface InvestmentCardProps {
  investment: UserInvestment;
}

export default function InvestmentCard({ investment }: InvestmentCardProps) {
  const isPositiveReturn = investment.returnPercentage >= 0;
  const formattedDate = new Date(investment.purchaseDate).toLocaleDateString(
    "es-ES",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <motion.div
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-black flex flex-col h-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Wine Image */}
      <div className="bg-black h-40 sm:h-44 md:h-48 flex items-center justify-center flex-shrink-0">
        <div className="text-5xl sm:text-6xl" role="img" aria-label="Vino">
          🍷
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-grow">
        {/* Wine Name and Rating */}
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex-1 min-w-0 pr-2">
            <h3 className="text-lg sm:text-xl font-semibold text-black mb-1 leading-tight">
              {investment.wineName}
            </h3>
            {investment.vintage && (
              <span className="text-xs sm:text-sm text-gray-600">Añada {investment.vintage}</span>
            )}
          </div>
          <div className="bg-black text-white px-2 sm:px-3 py-1 rounded-lg font-semibold text-xs sm:text-sm flex items-center gap-1 flex-shrink-0">
            <span aria-hidden="true">⭐</span>
            <span>{investment.rating}</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-black mb-4 sm:mb-5">
          <span className="text-base sm:text-lg flex-shrink-0">{investment.countryFlag}</span>
          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" aria-hidden="true" />
          <span className="text-xs sm:text-sm truncate">{investment.region}, {investment.country}</span>
        </div>

        {/* Investment Details */}
        <div className="space-y-3 mb-5">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Unidades</span>
            <span className="font-semibold text-black">{investment.units}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Precio por unidad</span>
            <span className="font-semibold text-black">${investment.pricePerUnit}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Inversión inicial</span>
            <span className="font-semibold text-black">
              ${investment.investedAmount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Valor actual</span>
            <span className="font-semibold text-black">
              ${investment.currentValue.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Return */}
        <div className="bg-gray-50 rounded-lg p-4 mb-5 border border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isPositiveReturn ? (
                <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0" aria-hidden="true" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600 flex-shrink-0" aria-hidden="true" />
              )}
              <span className="text-sm font-medium text-gray-700">Retorno</span>
            </div>
            <div className="text-right">
              <div
                className={`text-lg font-bold ${
                  isPositiveReturn ? "text-green-600" : "text-red-600"
                }`}
              >
                {isPositiveReturn ? "+" : ""}
                {investment.returnPercentage.toFixed(1)}%
              </div>
              <div
                className={`text-sm ${
                  isPositiveReturn ? "text-green-600" : "text-red-600"
                }`}
              >
                {isPositiveReturn ? "+" : ""}
                ${(investment.currentValue - investment.investedAmount).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Date */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-5 flex-shrink-0">
          <Calendar className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          <span className="truncate">Comprado el {formattedDate}</span>
        </div>

        {/* Actions - Push to bottom */}
        <div className="flex gap-3 mt-auto pt-2">
          <Link
            href={`/mercado/${investment.wineId}`}
            className="flex-1 bg-black text-white text-center py-2.5 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-sm"
            aria-label={`Ver detalles de ${investment.wineName}`}
          >
            Ver Detalles
          </Link>
          <button
            className="flex-1 border-2 border-black text-black text-center py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm"
            aria-label={`Vender ${investment.wineName}`}
          >
            Vender
          </button>
        </div>
      </div>
    </motion.div>
  );
}

