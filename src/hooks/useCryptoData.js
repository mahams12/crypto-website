// src/hooks/useCryptoData.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Fetch crypto market data from CoinGecko
const fetchCryptoData = async () => {
  const response = await axios.get(
    "https://api.coingecko.com/api/v3/coins/markets",
    {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 100,
        page: 1,
        sparkline: false,
      },
    }
  );
  return response.data;
};

// Custom hook
export function useCryptoData() {
  return useQuery({
    queryKey: ["cryptoData"],
    queryFn: fetchCryptoData,
    refetchInterval: 60000, // refresh every 60s
  });
}
