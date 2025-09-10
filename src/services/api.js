// src/services/api.js
import axios from "axios";

// ----------------------
// CoinGecko API (prices)
// ----------------------
const COINGECKO_API = "https://api.coingecko.com/api/v3";

// ----------------------
// CryptoPanic API (news)
// ----------------------
const CRYPTOPANIC_API = "https://cryptopanic.com/api/v1/posts/";
// 👉 Replace "demo" with your real API key from cryptopanic.com
const CRYPTOPANIC_KEY = "demo";

// ---------------
// Crypto Service
// ---------------
export const cryptoService = {
  getCoins: async (page = 1, limit = 20, sortBy = "market_cap_rank") => {
    const order =
      sortBy === "market_cap_rank" ? "market_cap_desc" : "volume_desc";

    const { data } = await axios.get(`${COINGECKO_API}/coins/markets`, {
      params: {
        vs_currency: "usd",
        order,
        per_page: limit,
        page,
        sparkline: false,
        price_change_percentage: "24h",
      },
    });
    return { data };
  },

  getCoin: async (coinId) => {
    const { data } = await axios.get(`${COINGECKO_API}/coins/${coinId}`, {
      params: { localization: false, sparkline: false },
    });
    return { data };
  },

  getCoinHistory: async (coinId, days = 7) => {
    const { data } = await axios.get(
      `${COINGECKO_API}/coins/${coinId}/market_chart`,
      { params: { vs_currency: "usd", days } }
    );
    return { data: data.prices };
  },

  getTrendingCoins: async (limit = 10) => {
    const { data } = await axios.get(`${COINGECKO_API}/search/trending`);
    return { data: data.coins.slice(0, limit).map((c) => c.item) };
  },
};

// ---------------
// News Service
// ---------------
export const newsService = {
  getNews: async (page = 1, limit = 20, category = "all") => {
    const { data } = await axios.get(CRYPTOPANIC_API, {
      params: {
        auth_token: CRYPTOPANIC_KEY,
        filter: category,
        page,
      },
    });
    return {
      data: {
        data: data.results,
        total_pages: Math.ceil(data.count / limit),
      },
    };
  },

  getLatestNews: async (limit = 10) => {
    const { data } = await axios.get(CRYPTOPANIC_API, {
      params: { auth_token: CRYPTOPANIC_KEY, filter: "all", page: 1 },
    });
    return { data: data.results.slice(0, limit) };
  },

  getNewsByCategory: async (category, page = 1, limit = 20) => {
    return newsService.getNews(page, limit, category);
  },

  getNewsCategories: async () => {
    return {
      data: {
        categories: [
          { name: "all", count: 0 },
          { name: "news", count: 0 },
          { name: "media", count: 0 },
        ],
      },
    };
  },
};
