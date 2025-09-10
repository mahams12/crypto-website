// src/hooks/useCryptoData.js
import { useQuery } from "@tanstack/react-query";
import { cryptoService } from "../services/api";

// -----------------------
// Get list of coins
// -----------------------
export const useCoins = (page = 1, limit = 20, sortBy = "market_cap_rank") => {
  return useQuery({
    queryKey: ["coins", page, limit, sortBy],
    queryFn: () => cryptoService.getCoins(page, limit, sortBy),
    select: (res) => res?.data,
  });
};

// -----------------------
// Get single coin details
// -----------------------
export const useCoin = (coinId) => {
  return useQuery({
    queryKey: ["coin", coinId],
    queryFn: () => cryptoService.getCoin(coinId),
    enabled: !!coinId,
    select: (res) => res?.data,
  });
};

// -----------------------
// Get coin price history
// -----------------------
export const useCoinHistory = (coinId, days = 7) => {
  return useQuery({
    queryKey: ["coinHistory", coinId, days],
    queryFn: () => cryptoService.getCoinHistory(coinId, days),
    enabled: !!coinId,
    select: (res) => res?.data,
  });
};

// -----------------------
// Get trending coins
// -----------------------
export const useTrendingCoins = (limit = 10) => {
  return useQuery({
    queryKey: ["trendingCoins", limit],
    queryFn: () => cryptoService.getTrendingCoins(limit),
    select: (res) => res?.data,
  });
};
