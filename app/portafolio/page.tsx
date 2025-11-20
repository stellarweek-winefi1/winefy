"use client";

import { Wine, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const portfolioStats = {
  totalValue: 8450,
  invested: 7200,
  profit: 1250,
  return: 17.4,
};

const holdings = [
  {
    id: "catena-zapata",
    name: "Catena Zapata Malbec Argentino",
    region: "Mendoza, Argentina",
    country: "🇦🇷",
    units: 8,
    purchasePrice: 110,
    currentPrice: 120,
    totalValue: 960,
    return: 9.1,
  },
  {
    id: "almaviva-2018",
    name: "Almaviva 2018",
    region: "Valle de Maipo, Chile",
    country: "🇨🇱",
    units: 5,
    purchasePrice: 170,
    currentPrice: 180,
    totalValue: 900,
    return: 5.9,
  },
  {
    id: "vina-cobos",
    name: "Viña Cobos Malbec Marchiori",
    region: "Mendoza, Argentina",
    country: "🇦🇷",
    units: 20,
    purchasePrice: 68,
    currentPrice: 75,
    totalValue: 1500,
    return: 10.3,
  },
  {
    id: "montes-alpha",
    name: "Montes Alpha M",
    region: "Valle de Apalta, Chile",
    country: "🇨🇱",
    units: 12,
    purchasePrice: 85,
    currentPrice: 92,
    totalValue: 1104,
    return: 8.2,
  },
];

export default function PortafolioPage() {
  return (
    <main className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-sm text-stone-500 mb-2">Valor Total</div>
            <div className="text-3xl font-bold text-stone-900">
              ${portfolioStats.totalValue.toLocaleString()}
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl p-6 shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="text-sm text-stone-500 mb-2">Invertido</div>
            <div className="text-3xl font-bold text-stone-900">
              ${portfolioStats.invested.toLocaleString()}
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl p-6 shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-sm text-stone-500 mb-2">Ganancia</div>
            <div className="text-3xl font-bold text-orange-600">
              +${portfolioStats.profit.toLocaleString()}
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl p-6 shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="text-sm text-stone-500 mb-2">Retorno</div>
            <div className="text-3xl font-bold text-orange-600 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" aria-hidden="true" />
              +{portfolioStats.return}%
            </div>
          </motion.div>
        </div>

        {/* Holdings Section */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="px-6 py-5 border-b border-stone-200">
            <h2 className="text-2xl font-semibold text-stone-900 flex items-center gap-2">
              <Wine className="w-6 h-6 text-wine-700" aria-hidden="true" />
              Mis Vinos
            </h2>
          </div>

          <div className="divide-y divide-stone-200">
            {holdings.map((holding, index) => (
              <motion.div
                key={holding.id}
                className="p-6 hover:bg-stone-50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Wine Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-6xl" role="img" aria-label="Vino">
                      🍷
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-stone-900 mb-1">
                        {holding.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-stone-600">
                        <span>{holding.country}</span>
                        <span>{holding.region}</span>
                        <span>•</span>
                        <span>{holding.units} unidades</span>
                      </div>
                    </div>
                  </div>

                  {/* Price Info */}
                  <div className="grid grid-cols-4 gap-6 lg:gap-8 text-center">
                    <div>
                      <div className="text-xs text-stone-500 mb-1">Compra</div>
                      <div className="text-lg font-semibold text-stone-900">
                        ${holding.purchasePrice}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-stone-500 mb-1">Actual</div>
                      <div className="text-lg font-semibold text-stone-900">
                        ${holding.currentPrice}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-stone-500 mb-1">Valor Total</div>
                      <div className="text-lg font-semibold text-stone-900">
                        ${holding.totalValue.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-stone-500 mb-1">Retorno</div>
                      <div className="text-lg font-semibold text-orange-600 flex items-center justify-center gap-1">
                        <TrendingUp className="w-4 h-4" aria-hidden="true" />
                        +{holding.return}%
                      </div>
                    </div>
                  </div>

                  {/* Sell Button */}
                  <button
                    className="lg:ml-6 px-8 py-3 border-2 border-wine-700 text-wine-700 rounded-lg font-semibold hover:bg-wine-700 hover:text-white transition-colors"
                    aria-label={`Vender ${holding.name}`}
                  >
                    Vender
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
