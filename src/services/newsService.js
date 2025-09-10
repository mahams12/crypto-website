// src/services/newsService.js
import axios from "axios";

// Multiple fallback options for better reliability
export const newsService = {
  // Option 1: CoinGecko News (Most Reliable - Free)
  fetchLatestNews: async () => {
    try {
      // Try CoinGecko first (no CORS issues, free)
      const response = await axios.get('https://api.coingecko.com/api/v3/news', {
        params: {
          per_page: 12
        }
      });
      
      if (response.data?.data) {
        return response.data.data.map(article => ({
          id: article.id || Math.random().toString(36),
          title: article.title,
          description: article.description || article.content?.substring(0, 150) + '...',
          link: article.url,
          imgURL: article.thumb_2x || article.image,
          feedDate: article.published_at || new Date().toISOString(),
          source: article.news_site || 'CoinGecko'
        }));
      }
    } catch (error) {
      console.error("❌ CoinGecko API failed:", error);
    }

    // Fallback Option 2: NewsAPI with crypto keyword
    try {
      const API_KEY = process.env.REACT_APP_NEWS_API_KEY; // You'll need to add this
      if (API_KEY) {
        const response = await axios.get('https://newsapi.org/v2/everything', {
          params: {
            q: 'cryptocurrency OR bitcoin OR ethereum',
            sortBy: 'publishedAt',
            pageSize: 12,
            apiKey: API_KEY
          }
        });

        if (response.data?.articles) {
          return response.data.articles.map(article => ({
            id: article.url || Math.random().toString(36),
            title: article.title,
            description: article.description,
            link: article.url,
            imgURL: article.urlToImage,
            feedDate: article.publishedAt,
            source: article.source.name
          }));
        }
      }
    } catch (error) {
      console.error("❌ NewsAPI failed:", error);
    }

    // Fallback Option 3: CryptoNews API (Alternative)
    try {
      const response = await axios.get('https://cryptonews-api.com/api/v1/category', {
        params: {
          section: 'general',
          items: 12,
          token: process.env.REACT_APP_CRYPTO_NEWS_TOKEN // Optional
        }
      });

      if (response.data?.data) {
        return response.data.data.map(article => ({
          id: article.news_id || Math.random().toString(36),
          title: article.title,
          description: article.text?.substring(0, 150) + '...',
          link: article.news_url,
          imgURL: article.image_url,
          feedDate: article.date,
          source: article.source_name
        }));
      }
    } catch (error) {
      console.error("❌ CryptoNews API failed:", error);
    }

    // Fallback Option 4: Mock data for development
    console.log("🔄 All APIs failed, returning mock data");
    return [
      {
        id: '1',
        title: 'Bitcoin Reaches New All-Time High',
        description: 'Bitcoin has surged to unprecedented levels as institutional adoption continues to grow.',
        link: 'https://example.com',
        imgURL: 'https://via.placeholder.com/400x200?text=Bitcoin+News',
        feedDate: new Date().toISOString(),
        source: 'Mock News'
      },
      {
        id: '2',
        title: 'Ethereum 2.0 Upgrade Shows Promise',
        description: 'The latest Ethereum upgrade is showing significant improvements in transaction speed and efficiency.',
        link: 'https://example.com',
        imgURL: 'https://via.placeholder.com/400x200?text=Ethereum+News',
        feedDate: new Date(Date.now() - 3600000).toISOString(),
        source: 'Mock News'
      },
      {
        id: '3',
        title: 'DeFi Market Continues to Expand',
        description: 'Decentralized Finance protocols are seeing increased adoption and total value locked.',
        link: 'https://example.com',
        imgURL: 'https://via.placeholder.com/400x200?text=DeFi+News',
        feedDate: new Date(Date.now() - 7200000).toISOString(),
        source: 'Mock News'
      }
    ];
  }
};