"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import WineCard from "@/components/WineCard";

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
  },
];

export default function MercadoPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredWines = wines.filter((wine) =>
    wine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wine.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wine.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative max-w-2xl mx-auto">
            <label htmlFor="search-wines" className="sr-only">
              Buscar vinos por nombre, región o tipo
            </label>
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400"
              aria-hidden="true"
            />
            <input
              id="search-wines"
              type="search"
              placeholder="Buscar por nombre, región o tipo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-wine-700 focus:border-transparent text-lg"
              aria-label="Buscar vinos"
            />
          </div>
        </div>

        {/* Wine Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredWines.length > 0 ? (
            filteredWines.map((wine) => (
              <WineCard key={wine.id} {...wine} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-xl text-stone-500">
                No se encontraron vinos que coincidan con tu búsqueda.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
