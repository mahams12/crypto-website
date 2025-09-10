import axios from "axios";

// Base URL from environment variables or fallback
const API_BASE_URL = process.env.REACT_APP_API_URL || "https://api.coingecko.com/api/v3";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// ---- Crypto API helpers ----
export const cryptoService = {
  getCoins: (params) => api.get("/coins/markets", { params }),
  getCoinDetails: (id) => api.get(`/coins/${id}`),
  getCoinHistory: (id, params) => api.get(`/coins/${id}/market_chart`, { params }),
  getMarketStats: () => api.get("/global"),
};

// ---- News API helpers ----
export const newsService = {
  getNews: (params) => api.get("/news", { params }), // <-- replace with real news API endpoint if you have one
};

// Default export for existing imports
export default api;
