// src/hooks/useCryptoData.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_BASE = "https://api.coingecko.com/api/v3";

// -------------------------
// Fetchers
// -------------------------
const fetchCoins = async (page = 1, limit = 20, sortBy = "market_cap_desc") => {
  const response = await axios.get(`${API_BASE}/coins/markets`, {
    params: {
      vs_currency: "usd",
      order: sortBy,
      per_page: limit,
      page,
      sparkline: false,
      price_change_percentage: "24h",
    },
  });
  return response.data;
};

const fetchCoin = async (coinId) => {
  const response = await axios.get(`${API_BASE}/coins/${coinId}`, {
    params: { localization: false, sparkline: false },
  });
  return response.data;
};

const fetchCoinHistory = async (coinId, days = 7) => {
  const response = await axios.get(
    `${API_BASE}/coins/${coinId}/market_chart`,
    {
      params: { vs_currency: "usd", days },
    }
  );
  return response.data?.prices || [];
};

// -------------------------
// Hooks
// -------------------------

// List of coins
export function useCryptoData(page = 1, limit = 20, sortBy = "market_cap_desc") {
  return useQuery({
    queryKey: ["coins", page, limit, sortBy],
    queryFn: () => fetchCoins(page, limit, sortBy),
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  });
}

// Single coin
export function useCoinData(coinId) {
  return useQuery({
    queryKey: ["coin", coinId],
    queryFn: () => fetchCoin(coinId),
    enabled: !!coinId,
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  });
}

// Coin history
export function useCoinHistory(coinId, days = 7) {
  return useQuery({
    queryKey: ["coin-history", coinId, days],
    queryFn: () => fetchCoinHistory(coinId, days),
    enabled: !!coinId,
    staleTime: 5 * 60 * 1000,
  });
}

// Market stats (overview)
export function useMarketStats() {
  return useQuery({
    queryKey: ["market-stats"],
    queryFn: async () => {
      const coins = await fetchCoins(1, 100);
      if (!coins.length) return null;

      const totalMarketCap = coins.reduce(
        (sum, coin) => sum + (coin.market_cap || 0),
        0
      );
      const total24hVolume = coins.reduce(
        (sum, coin) => sum + (coin.total_volume || 0),
        0
      );
      const gainers = coins.filter(
        (coin) => (coin.price_change_percentage_24h || 0) > 0
      ).length;
      const losers = coins.filter(
        (coin) => (coin.price_change_percentage_24h || 0) < 0
      ).length;
      const btc = coins.find((c) => c.symbol?.toLowerCase() === "btc");

      return {
        totalMarketCap,
        total24hVolume,
        gainers,
        losers,
        btcDominance: btc ? (btc.market_cap / totalMarketCap) * 100 : 0,
        totalCoins: coins.length,
      };
    },
    staleTime: 2 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
  });
}
