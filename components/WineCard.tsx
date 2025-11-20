"use client";

import { MapPin, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface WineCardProps {
  id: string;
  name: string;
  region: string;
  country: string;
  countryFlag: string;
  rating: number;
  pricePerUnit: number;
  annualReturn: number;
  available: number;
  total: number;
  image?: string;
}

export default function WineCard({
  id,
  name,
  region,
  country,
  countryFlag,
  rating,
  pricePerUnit,
  annualReturn,
  available,
  total,
}: WineCardProps) {
  const availabilityPercentage = (available / total) * 100;

  return (
    <motion.div
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-black"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Wine Image */}
      <div className="bg-black h-64 flex items-center justify-center">
        <div className="text-8xl" role="img" aria-label="Vino">
          🍷
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Wine Name and Rating */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold text-black flex-1">
            {name}
          </h3>
          <div className="bg-black text-white px-3 py-1 rounded-lg font-semibold text-sm flex items-center gap-1 ml-2">
            <span aria-hidden="true">⭐</span>
            <span>{rating}</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-black mb-6">
          <span className="text-lg">{countryFlag}</span>
          <MapPin className="w-4 h-4" aria-hidden="true" />
          <span className="text-sm">{region}, {country}</span>
        </div>

        {/* Price and Return */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <div className="text-xs text-black mb-1">Precio/Unidad</div>
            <div className="text-2xl font-bold text-black">${pricePerUnit}</div>
          </div>
          <div>
            <div className="text-xs text-black mb-1">Retorno Anual</div>
            <div className="text-2xl font-bold text-black flex items-center gap-1">
              <TrendingUp className="w-5 h-5" aria-hidden="true" />
              {annualReturn}%
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-black">Disponibles</span>
            <span className="font-semibold text-black">
              {available} / {total} unidades
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-black h-full rounded-full transition-all duration-500"
              style={{ width: `${availabilityPercentage}%` }}
              role="progressbar"
              aria-valuenow={available}
              aria-valuemin={0}
              aria-valuemax={total}
              aria-label={`${available} de ${total} unidades disponibles`}
            />
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href={`/mercado/${id}`}
          className="block w-full bg-black text-white text-center py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          aria-label={`Invertir en ${name}`}
        >
          Invertir Ahora
        </Link>
      </div>
    </motion.div>
  );
}
