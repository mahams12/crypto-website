// src/services/newsService.js
import axios from "axios";

// Add a public CORS proxy
const CORS_PROXY = "https://api.allorigins.win/raw?url="; // free, simple proxy

export const newsService = {
  fetchLatestNews: async () => {
    try {
      const url = encodeURIComponent("https://api.coinstats.app/public/v1/news/latest?skip=0&limit=12");
      const response = await axios.get(`${CORS_PROXY}${url}`);
      return response.data?.data || []; // CoinStats API returns { data: [...] }
    } catch (error) {
      console.error("❌ Error fetching CoinStats news:", error);
      return [];
    }
  },
};
