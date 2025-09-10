// src/services/newsService.js
import axios from "axios";

const API_URL = "https://api.coinstats.app/public/v1/news/latest?skip=0&limit=12";

export const newsService = {
  async fetchLatestNews() {
    try {
      const response = await axios.get(API_URL);
      console.log("📰 DEBUG NEWS DATA:", response.data);
      return response.data.news || [];
    } catch (error) {
      console.error("❌ Error fetching CoinStats news:", error);
      return [];
    }
  },
};
