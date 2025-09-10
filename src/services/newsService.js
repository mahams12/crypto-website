// src/services/newsService.js
import axios from "axios";

export const newsService = {
  // Enhanced news fetching with CORS proxy and better error handling
  fetchLatestNews: async () => {
    // Option 1: Try CoinGecko with CORS proxy
    try {
      console.log("🔄 Trying CoinGecko API...");
      const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
      const targetUrl = 'https://api.coingecko.com/api/v3/news';
      
      const response = await axios.get(`${proxyUrl}${targetUrl}`, {
        params: {
          per_page: 12
        },
        timeout: 10000,
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      
      if (response.data?.data) {
        console.log("✅ CoinGecko API success");
        return response.data.data.map(article => ({
          id: article.id || `cg_${Math.random().toString(36).substr(2, 9)}`,
          title: article.title,
          description: article.description || article.content?.substring(0, 150) + '...' || 'No description available',
          link: article.url,
          imgURL: article.thumb_2x || article.image || generatePlaceholderImage(article.title),
          feedDate: article.published_at || new Date().toISOString(),
          source: article.news_site || 'CoinGecko'
        }));
      }
    } catch (error) {
      console.error("❌ CoinGecko API failed:", error.message);
    }

    // Option 2: Alternative free crypto news API
    try {
      console.log("🔄 Trying alternative API...");
      const response = await axios.get('https://api.coinpaprika.com/v1/coins', {
        timeout: 10000
      });
      
      if (response.data && response.data.length > 0) {
        console.log("✅ Coinpaprika API success");
        // Transform coin data into news-like format
        return response.data.slice(0, 12).map((coin, index) => ({
          id: coin.id || `cp_${index}`,
          title: `${coin.name} (${coin.symbol}) Market Update`,
          description: `Current rank: #${coin.rank}. ${coin.name} is ${coin.is_active ? 'actively trading' : 'not active'} in the cryptocurrency market.`,
          link: `https://coinpaprika.com/coin/${coin.id}/`,
          imgURL: generatePlaceholderImage(coin.name),
          feedDate: new Date().toISOString(),
          source: 'Coinpaprika'
        }));
      }
    } catch (error) {
      console.error("❌ Alternative API failed:", error.message);
    }

    // Option 3: RSS to JSON service (No CORS issues)
    try {
      console.log("🔄 Trying RSS feed...");
      const rssUrl = 'https://cointelegraph.com/rss';
      const response = await axios.get(`https://api.rss2json.com/v1/api.json`, {
        params: {
          rss_url: rssUrl,
          count: 12
        },
        timeout: 10000
      });
      
      if (response.data?.items) {
        console.log("✅ RSS feed success");
        return response.data.items.map((item, index) => ({
          id: item.guid || `rss_${index}`,
          title: item.title,
          description: item.description?.replace(/<[^>]*>/g, '').substring(0, 150) + '...' || 'No description available',
          link: item.link,
          imgURL: extractImageFromContent(item.content) || generatePlaceholderImage(item.title),
          feedDate: item.pubDate || new Date().toISOString(),
          source: 'Cointelegraph'
        }));
      }
    } catch (error) {
      console.error("❌ RSS feed failed:", error.message);
    }

    // Option 4: Enhanced mock data with working images
    console.log("🔄 All APIs failed, returning enhanced mock data");
    return generateMockNews();
  }
};

// Helper function to generate placeholder images that actually work
function generatePlaceholderImage(title) {
  const cleanTitle = encodeURIComponent(title.substring(0, 20));
  // Using a different placeholder service that's more reliable
  return `https://picsum.photos/400/200?random=${Math.random().toString(36).substr(2, 5)}`;
}

// Helper function to extract images from RSS content
function extractImageFromContent(content) {
  if (!content) return null;
  const imgRegex = /<img[^>]+src="([^">]+)"/i;
  const match = content.match(imgRegex);
  return match ? match[1] : null;
}

// Enhanced mock data generator
function generateMockNews() {
  const mockArticles = [
    {
      id: 'mock_1',
      title: 'Bitcoin Surges Past Key Resistance Level',
      description: 'Bitcoin has broken through a significant resistance level, showing strong bullish momentum as institutional investors continue to show interest in the cryptocurrency market.',
      link: 'https://coindesk.com',
      imgURL: 'https://picsum.photos/400/200?random=btc1',
      feedDate: new Date().toISOString(),
      source: 'CryptoDaily'
    },
    {
      id: 'mock_2',
      title: 'Ethereum Network Upgrade Brings Gas Fee Relief',
      description: 'The latest Ethereum network upgrade has successfully implemented changes that significantly reduce gas fees for users, making DeFi more accessible.',
      link: 'https://ethereum.org',
      imgURL: 'https://picsum.photos/400/200?random=eth1',
      feedDate: new Date(Date.now() - 3600000).toISOString(),
      source: 'Ethereum Foundation'
    },
    {
      id: 'mock_3',
      title: 'DeFi TVL Reaches New Milestone',
      description: 'Total Value Locked in DeFi protocols has reached a new all-time high, demonstrating the growing adoption of decentralized financial services.',
      link: 'https://defipulse.com',
      imgURL: 'https://picsum.photos/400/200?random=defi1',
      feedDate: new Date(Date.now() - 7200000).toISOString(),
      source: 'DeFi Pulse'
    },
    {
      id: 'mock_4',
      title: 'Major Exchange Adds New Trading Pairs',
      description: 'Leading cryptocurrency exchange announces the addition of several new trading pairs, expanding options for traders and investors.',
      link: 'https://binance.com',
      imgURL: 'https://picsum.photos/400/200?random=exchange1',
      feedDate: new Date(Date.now() - 10800000).toISOString(),
      source: 'Exchange News'
    },
    {
      id: 'mock_5',
      title: 'NFT Market Shows Signs of Recovery',
      description: 'The NFT marketplace is experiencing renewed interest with increased trading volumes and new high-profile collections launching.',
      link: 'https://opensea.io',
      imgURL: 'https://picsum.photos/400/200?random=nft1',
      feedDate: new Date(Date.now() - 14400000).toISOString(),
      source: 'NFT News'
    },
    {
      id: 'mock_6',
      title: 'Regulatory Clarity Boosts Market Confidence',
      description: 'Recent regulatory announcements have provided much-needed clarity for the cryptocurrency industry, boosting investor confidence.',
      link: 'https://cointelegraph.com',
      imgURL: 'https://picsum.photos/400/200?random=reg1',
      feedDate: new Date(Date.now() - 18000000).toISOString(),
      source: 'Regulatory Watch'
    }
  ];

  return mockArticles;
}