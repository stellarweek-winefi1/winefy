export interface UserInvestment {
  id: string;
  wineId: string;
  wineName: string;
  region: string;
  country: string;
  countryFlag: string;
  vintage?: string;
  rating: number;
  pricePerUnit: number;
  units: number;
  investedAmount: number;
  currentValue: number;
  returnPercentage: number;
  purchaseDate: string;
  image?: string;
}

export const getUserInvestments = (): UserInvestment[] => {
  return [
    {
      id: "inv-1",
      wineId: "almaviva-2018",
      wineName: "Almaviva 2018",
      region: "Valle de Maipo",
      country: "Chile",
      countryFlag: "🇨🇱",
      vintage: "2018",
      rating: 96,
      pricePerUnit: 180,
      units: 5,
      investedAmount: 900,
      currentValue: 990,
      returnPercentage: 10.0,
      purchaseDate: "2024-01-15",
    },
    {
      id: "inv-2",
      wineId: "catena-zapata",
      wineName: "Catena Zapata Malbec Argentino",
      region: "Luján de Cuyo",
      country: "Mendoza, Argentina",
      countryFlag: "🇦🇷",
      vintage: "2020",
      rating: 95,
      pricePerUnit: 120,
      units: 10,
      investedAmount: 1200,
      currentValue: 1296,
      returnPercentage: 8.0,
      purchaseDate: "2024-02-20",
    },
    {
      id: "inv-3",
      wineId: "achaval-ferrer",
      wineName: "Achaval-Ferrer Finca Bella Vista",
      region: "Valle de Uco",
      country: "Mendoza, Argentina",
      countryFlag: "🇦🇷",
      vintage: "2019",
      rating: 94,
      pricePerUnit: 95,
      units: 8,
      investedAmount: 760,
      currentValue: 820.8,
      returnPercentage: 8.0,
      purchaseDate: "2024-03-10",
    },
  ];
};

export const getInvestmentSummary = (investments: UserInvestment[]) => {
  const totalInvested = investments.reduce(
    (sum, inv) => sum + inv.investedAmount,
    0
  );
  const totalCurrentValue = investments.reduce(
    (sum, inv) => sum + inv.currentValue,
    0
  );
  const totalReturn = totalCurrentValue - totalInvested;
  const totalReturnPercentage =
    totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;
  const wineCount = investments.length;
  const averageValuePerWine =
    wineCount > 0 ? totalInvested / wineCount : 0;

  return {
    totalInvested,
    totalCurrentValue,
    totalReturn,
    totalReturnPercentage,
    wineCount,
    averageValuePerWine,
  };
};


