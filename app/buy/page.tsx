"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Wine, X, CheckCircle, MapPin, Calendar, ShoppingCart } from "lucide-react";
import { useState } from "react";

// Mock lots data - same structure as in /lotes page
const mockLotes = [
  {
    id: "catena-zapata",
    nombre: "Catena Zapata Malbec Argentino",
    varietal: "Malbec",
    año: 2020,
    cantidad: 3000,
    region: "Luján de Cuyo, Mendoza, Argentina",
    estado: "Certificado",
    wtt: "CATENA-ZAPATA-2020-CERT",
    ultimoEvento: "Lote certificado",
    fecha: "2024-01-15",
    eventos: 3,
    priceUSDC: 2500,
    isSold: false,
  },
  {
    id: "almaviva-2018",
    nombre: "Almaviva 2018",
    varietal: "Bordeaux Blend",
    año: 2018,
    cantidad: 2000,
    region: "Valle de Maipo, Chile",
    estado: "Certificado",
    wtt: "ALMAVIVA-2018-CERT",
    ultimoEvento: "Embotellado completado",
    fecha: "2024-02-20",
    eventos: 5,
    priceUSDC: 3200,
    isSold: false,
  },
  {
    id: "achaval-ferrer",
    nombre: "Achaval-Ferrer Finca Bella Vista",
    varietal: "Malbec",
    año: 2019,
    cantidad: 4500,
    region: "Valle de Uco, Mendoza, Argentina",
    estado: "Certificado",
    wtt: "ACHAVAL-FERRER-2019-CERT",
    ultimoEvento: "En barrica",
    fecha: "2024-03-10",
    eventos: 4,
    priceUSDC: 2800,
    isSold: false,
  },
  {
    id: "don-melchor-2019",
    nombre: "Don Melchor 2019",
    varietal: "Cabernet Sauvignon",
    año: 2019,
    cantidad: 2500,
    region: "Puente Alto, Valle de Maipo, Chile",
    estado: "Certificado",
    wtt: "DON-MELCHOR-2019-CERT",
    ultimoEvento: "Crianza completada",
    fecha: "2024-04-05",
    eventos: 6,
    priceUSDC: 3500,
    isSold: false,
  },
  {
    id: "sena-2020",
    nombre: "Seña 2020",
    varietal: "Bordeaux Blend",
    año: 2020,
    cantidad: 1800,
    region: "Valle de Aconcagua, Chile",
    estado: "Certificado",
    wtt: "SENA-2020-CERT",
    ultimoEvento: "Embotellado completado",
    fecha: "2024-04-12",
    eventos: 5,
    priceUSDC: 4200,
    isSold: false,
  },
  {
    id: "vega-sicilia-2018",
    nombre: "Vega Sicilia Unico 2018",
    varietal: "Tempranillo Blend",
    año: 2018,
    cantidad: 1200,
    region: "Ribera del Duero, España",
    estado: "Certificado",
    wtt: "VEGA-SICILIA-2018-CERT",
    ultimoEvento: "En crianza",
    fecha: "2024-03-25",
    eventos: 4,
    priceUSDC: 5800,
    isSold: false,
  },
  {
    id: "opus-one-2019",
    nombre: "Opus One 2019",
    varietal: "Bordeaux Blend",
    año: 2019,
    cantidad: 2800,
    region: "Oakville, Napa Valley, USA",
    estado: "Certificado",
    wtt: "OPUS-ONE-2019-CERT",
    ultimoEvento: "Crianza en barrica",
    fecha: "2024-05-01",
    eventos: 7,
    priceUSDC: 6500,
    isSold: false,
  },
  {
    id: "penfolds-grange-2018",
    nombre: "Penfolds Grange 2018",
    varietal: "Shiraz",
    año: 2018,
    cantidad: 1500,
    region: "Barossa Valley, Australia",
    estado: "Certificado",
    wtt: "PENFOLDS-GRANGE-2018-CERT",
    ultimoEvento: "Embotellado completado",
    fecha: "2024-04-18",
    eventos: 6,
    priceUSDC: 5200,
    isSold: false,
  },
];

type Lot = typeof mockLotes[0];

export default function BuyPage() {
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [purchasedLots, setPurchasedLots] = useState<Set<string>>(new Set());

  // Filter only available lots (not sold)
  const availableLots = mockLotes.filter((lote) => !lote.isSold && !purchasedLots.has(lote.id));

  const handleBuyClick = (lote: Lot) => {
    setSelectedLot(lote);
    setIsPurchased(false);
  };

  const handleQuickBuy = (lote: Lot) => {
    // Direct purchase without confirmation modal
    setPurchasedLots((prev) => new Set(prev).add(lote.id));
    setSelectedLot(lote);
    setIsPurchased(true);
  };

  const handleConfirmPurchase = () => {
    if (selectedLot) {
      // Simulate purchase: mark as sold
      setPurchasedLots((prev) => new Set(prev).add(selectedLot.id));
      setIsPurchased(true);
    }
  };

  const handleCloseModal = () => {
    setSelectedLot(null);
    setIsPurchased(false);
  };

  return (
    <main className="min-h-screen bg-white py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-black px-4">
            Comprar Lotes
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-black max-w-3xl mx-auto px-4">
            Explora y compra lotes certificados disponibles
          </p>
        </div>

        {/* Available Lots Grid */}
        {availableLots.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {availableLots.map((lote, index) => (
              <motion.div
                key={lote.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white border-2 border-black rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
              >
                {/* Header */}
                <div className="p-4 sm:p-5 md:p-6 flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Wine className="w-5 h-5 sm:w-6 sm:h-6 text-black flex-shrink-0" />
                      <h3 className="text-lg sm:text-xl font-bold text-black truncate">
                        {lote.nombre}
                      </h3>
                    </div>
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 flex-shrink-0 ml-2">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {lote.estado}
                    </span>
                  </div>

                  {/* Price - Prominent */}
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-1">Precio</div>
                    <div className="text-3xl sm:text-4xl font-bold text-black">
                      {lote.priceUSDC.toLocaleString()} USDC
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-2 sm:space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{lote.region}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>Año: {lote.año} • Varietal: {lote.varietal}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Cantidad: <span className="font-semibold text-black">{lote.cantidad.toLocaleString()} botellas</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t-2 border-black p-4 bg-gray-50 space-y-2">
                  <button
                    onClick={() => handleQuickBuy(lote)}
                    className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-gray-800 transition-colors w-full text-sm sm:text-base"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Comprar Ahora
                  </button>
                  <button
                    onClick={() => handleBuyClick(lote)}
                    className="flex items-center justify-center gap-2 bg-white text-black border-2 border-black px-4 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition-colors w-full text-sm sm:text-base"
                  >
                    Ver Detalles
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Wine className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No hay lotes disponibles
            </h3>
            <p className="text-gray-500">
              Todos los lotes han sido vendidos
            </p>
          </div>
        )}

        {/* Purchase Modal */}
        <AnimatePresence>
          {selectedLot && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={handleCloseModal}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-black"
                onClick={(e) => e.stopPropagation()}
              >
                {!isPurchased ? (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl sm:text-3xl font-bold text-black">
                        Confirmar Compra
                      </h2>
                      <button
                        onClick={handleCloseModal}
                        className="text-gray-500 hover:text-black transition-colors"
                        aria-label="Cerrar"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    {/* Lot Details */}
                    <div className="space-y-4 mb-6">
                      <div>
                        <h3 className="text-xl font-semibold text-black mb-2">{selectedLot.nombre}</h3>
                        <div className="bg-black text-white rounded-lg p-3 mb-3">
                          <div className="text-xs text-gray-300 mb-1">Certificado</div>
                          <div className="text-sm font-mono font-semibold">{selectedLot.wtt}</div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Región:</span>
                          <span className="font-semibold text-black">{selectedLot.region}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Varietal:</span>
                          <span className="font-semibold text-black">{selectedLot.varietal}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Año:</span>
                          <span className="font-semibold text-black">{selectedLot.año}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cantidad:</span>
                          <span className="font-semibold text-black">{selectedLot.cantidad.toLocaleString()} botellas</span>
                        </div>
                        <div className="border-t border-gray-300 pt-3 mt-3">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-black">Total:</span>
                            <span className="text-2xl font-bold text-black">
                              {selectedLot.priceUSDC.toLocaleString()} USDC
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <button
                        onClick={handleCloseModal}
                        className="flex-1 px-6 py-3 border-2 border-black rounded-lg font-semibold text-black hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleConfirmPurchase}
                        className="flex-1 px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                      >
                        Confirmar Compra
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-6">
                        <div className="bg-green-100 rounded-full p-4">
                          <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-600" />
                        </div>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4">
                        ¡Compra Exitosa!
                      </h2>
                      <p className="text-base sm:text-lg text-gray-600 mb-8">
                        Has comprado el lote <strong>{selectedLot.nombre}</strong> por{" "}
                        <strong>{selectedLot.priceUSDC.toLocaleString()} USDC</strong>
                      </p>

                      <button
                        onClick={handleCloseModal}
                        className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                      >
                        Cerrar
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Count */}
        {availableLots.length > 0 && (
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-sm text-gray-600">
              Mostrando {availableLots.length} {availableLots.length === 1 ? "lote" : "lotes"} disponible{availableLots.length === 1 ? "" : "s"}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

