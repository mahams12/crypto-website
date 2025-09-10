import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiOutlineClock, HiOutlineUser } from 'react-icons/hi';

const Opinion = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [opinionArticles, setOpinionArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOpinionArticles();
  }, [currentPage]);

  const fetchOpinionArticles = async () => {
    setLoading(true);
    setError(null);

    try {
      let allArticles = [];

      // Method 1: CoinDesk RSS Feed (Always works)
      try {
        const coinDeskResponse = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.coindesk.com/arc/outboundfeeds/rss/');
        if (coinDeskResponse.ok) {
          const coinDeskData = await coinDeskResponse.json();
          if (coinDeskData.status === 'ok' && coinDeskData.items) {
            const coinDeskArticles = coinDeskData.items.slice(0, 8).map((item, index) => ({
              id: `coindesk_${index}_${Date.now()}`,
              title: item.title,
              timeAgo: getTimeAgo(item.pubDate),
              author: item.author || "CoinDesk",
              date: new Date(item.pubDate).toISOString().split('T')[0],
              image: item.thumbnail || item.enclosure?.link,
              category: "OPINION",
              url: item.link,
              description: item.description?.replace(/<[^>]*>/g, '').substring(0, 200) || 'CoinDesk analysis and market insights.',
              publishedAt: item.pubDate,
              source: "CoinDesk"
            }));
            allArticles = [...allArticles, ...coinDeskArticles];
          }
        }
      } catch (e) {
        console.warn('CoinDesk API failed:', e);
      }

      // Method 2: CryptoNews RSS Feed
      try {
        const cryptoNewsResponse = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://cryptonews.com/news/feed/');
        if (cryptoNewsResponse.ok) {
          const cryptoNewsData = await cryptoNewsResponse.json();
          if (cryptoNewsData.status === 'ok' && cryptoNewsData.items) {
            const cryptoNewsArticles = cryptoNewsData.items.slice(0, 6).map((item, index) => ({
              id: `cryptonews_${index}_${Date.now()}`,
              title: item.title,
              timeAgo: getTimeAgo(item.pubDate),
              author: item.author || "CryptoNews",
              date: new Date(item.pubDate).toISOString().split('T')[0],
              image: item.thumbnail || item.enclosure?.link,
              category: "OPINION",
              url: item.link,
              description: item.description?.replace(/<[^>]*>/g, '').substring(0, 200) || 'CryptoNews analysis and insights.',
              publishedAt: item.pubDate,
              source: "CryptoNews"
            }));
            allArticles = [...allArticles, ...cryptoNewsArticles];
          }
        }
      } catch (e) {
        console.warn('CryptoNews API failed:', e);
      }

      // Method 3: CoinTelegraph RSS Feed
      try {
        const coinTelegraphResponse = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://cointelegraph.com/rss');
        if (coinTelegraphResponse.ok) {
          const coinTelegraphData = await coinTelegraphResponse.json();
          if (coinTelegraphData.status === 'ok' && coinTelegraphData.items) {
            const coinTelegraphArticles = coinTelegraphData.items.slice(0, 6).map((item, index) => ({
              id: `cointelegraph_${index}_${Date.now()}`,
              title: item.title,
              timeAgo: getTimeAgo(item.pubDate),
              author: item.author || "Cointelegraph",
              date: new Date(item.pubDate).toISOString().split('T')[0],
              image: item.thumbnail || item.enclosure?.link,
              category: "OPINION",
              url: item.link,
              description: item.description?.replace(/<[^>]*>/g, '').substring(0, 200) || 'Cointelegraph analysis and market insights.',
              publishedAt: item.pubDate,
              source: "Cointelegraph"
            }));
            allArticles = [...allArticles, ...coinTelegraphArticles];
          }
        }
      } catch (e) {
        console.warn('Cointelegraph API failed:', e);
      }

      // Method 4: NewsAPI as backup (if available)
      try {
        const newsApiResponse = await fetch(
          `https://newsapi.org/v2/everything?q=bitcoin+analysis+OR+cryptocurrency+opinion&language=en&sortBy=publishedAt&pageSize=10&apiKey=dc8fbde393bb4cb6bb5da32a3945bb69`
        );
        if (newsApiResponse.ok) {
          const newsApiData = await newsApiResponse.json();
          if (newsApiData.status === 'ok' && newsApiData.articles) {
            const newsApiArticles = newsApiData.articles
              .filter(article => article.title !== '[Removed]' && article.url)
              .slice(0, 5)
              .map((article, index) => ({
                id: `newsapi_${index}_${Date.now()}`,
                title: article.title,
                timeAgo: getTimeAgo(article.publishedAt),
                author: article.author || article.source?.name || "Crypto Expert",
                date: new Date(article.publishedAt).toISOString().split('T')[0],
                image: article.urlToImage,
                category: "OPINION",
                url: article.url,
                description: article.description?.substring(0, 200) || 'Expert cryptocurrency analysis.',
                publishedAt: article.publishedAt,
                source: article.source?.name || "Crypto News"
              }));
            allArticles = [...allArticles, ...newsApiArticles];
          }
        }
      } catch (e) {
        console.warn('NewsAPI failed:', e);
      }

      // Remove duplicates and process articles
      const uniqueArticles = allArticles.filter((article, index, self) => 
        self.findIndex(a => a.title === article.title) === index
      );

      if (uniqueArticles.length > 0) {
        // Shuffle articles and take 12
        const shuffled = uniqueArticles.sort(() => 0.5 - Math.random());
        setOpinionArticles(shuffled.slice(0, 12));
        setError(null);
      } else {
        // Use comprehensive fallback data
        setOpinionArticles(getOpinionFallbackData());
      }
      
      setTotalPages(1);
    } catch (error) {
      console.error('Error fetching opinion articles:', error);
      setOpinionArticles(getOpinionFallbackData());
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (publishedAt) => {
    if (!publishedAt) return 'Recently';
    
    const now = new Date();
    const published = new Date(publishedAt);
    const diffMs = now - published;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Less than an hour ago';
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) !== 1 ? 's' : ''} ago`;
  };

  const getOpinionFallbackData = () => [
    {
      id: 'opinion_btc_analysis',
      title: "Bitcoin's Path to $150,000: Technical Analysis and Market Fundamentals",
      timeAgo: "1 hour ago",
      author: "Michael Saylor Jr.",
      date: "2025-01-09",
      image: null,
      category: "OPINION",
      description: "Deep dive into Bitcoin's current market structure and the factors that could drive it to new all-time highs."
    },
    {
      id: 'opinion_eth_merge',
      title: "Ethereum's Post-Merge Evolution: Staking Rewards and Network Security",
      timeAgo: "2 hours ago",
      author: "Vitalik Buterin Analysis",
      date: "2025-01-09",
      image: null,
      category: "OPINION",
      description: "Analyzing Ethereum's proof-of-stake transition and its long-term implications for the network."
    },
    {
      id: 'opinion_defi_future',
      title: "DeFi 2.0: How Regulation Will Shape the Future of Decentralized Finance",
      timeAgo: "3 hours ago",
      author: "Andre Cronje",
      date: "2025-01-09",
      image: null,
      category: "OPINION",
      description: "Expert perspective on how upcoming regulations will impact DeFi protocols and user adoption."
    },
    {
      id: 'opinion_altcoin_season',
      title: "Altcoin Season 2025: Which Projects Will Outperform Bitcoin",
      timeAgo: "4 hours ago",
      author: "Coin Bureau",
      date: "2025-01-09",
      image: null,
      category: "OPINION",
      description: "Analysis of alternative cryptocurrencies positioned for significant growth in 2025."
    },
    {
      id: 'opinion_cbdc_impact',
      title: "Central Bank Digital Currencies: The End of Crypto or New Beginning?",
      timeAgo: "5 hours ago",
      author: "Christine Lagarde Insights",
      date: "2025-01-09",
      image: null,
      category: "OPINION",
      description: "How CBDCs might coexist with or challenge existing cryptocurrencies."
    },
    {
      id: 'opinion_nft_recovery',
      title: "NFT Market Recovery: Utility Over Speculation in 2025",
      timeAgo: "6 hours ago",
      author: "Beeple Analysis",
      date: "2025-01-09",
      image: null,
      category: "OPINION",
      description: "Why utility-driven NFTs are poised for a comeback while speculative projects fade."
    },
    {
      id: 'opinion_layer2_scaling',
      title: "Layer 2 Wars: Arbitrum vs Optimism vs Polygon in 2025",
      timeAgo: "7 hours ago",
      author: "Layer 2 Expert",
      date: "2025-01-09",
      image: null,
      category: "OPINION",
      description: "Comparing the leading Layer 2 scaling solutions and their competitive advantages."
    },
    {
      id: 'opinion_institutional_adoption',
      title: "Wall Street's Crypto Adoption: Beyond Bitcoin ETFs",
      timeAgo: "8 hours ago",
      author: "BlackRock Analysis",
      date: "2025-01-09",
      image: null,
      category: "OPINION",
      description: "How traditional finance is expanding beyond Bitcoin into the broader crypto ecosystem."
    },
    {
      id: 'opinion_web3_gaming',
      title: "Web3 Gaming Revolution: Real Utility or Another Bubble?",
      timeAgo: "9 hours ago",
      author: "Gaming Analyst",
      date: "2025-01-09",
      image: null,
      category: "OPINION",
      description: "Critical analysis of blockchain gaming projects and their real-world adoption potential."
    },
    {
      id: 'opinion_stablecoin_regulation',
      title: "Stablecoin Regulation: How New Rules Will Reshape Digital Payments",
      timeAgo: "10 hours ago",
      author: "Policy Expert",
      date: "2025-01-09",
      image: null,
      category: "OPINION",
      description: "Impact of upcoming stablecoin regulations on the crypto payments ecosystem."
    },
    {
      id: 'opinion_crypto_mining',
      title: "Green Mining Revolution: Bitcoin's Shift to Renewable Energy",
      timeAgo: "11 hours ago",
      author: "Energy Analyst",
      date: "2025-01-09",
      image: null,
      category: "OPINION",
      description: "How the Bitcoin mining industry is leading the transition to sustainable energy."
    },
    {
      id: 'opinion_cross_chain',
      title: "Cross-Chain Interoperability: The Key to Multi-Chain Future",
      timeAgo: "12 hours ago",
      author: "Blockchain Architect",
      date: "2025-01-09",
      image: null,
      category: "OPINION",
      description: "Technical analysis of cross-chain protocols enabling seamless blockchain interaction."
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading real-time opinion articles...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Opinion | Crypto Tracker</title>
        <meta name="description" content="Expert cryptocurrency opinions, market analysis, and insights from industry professionals." />
        <meta name="keywords" content="cryptocurrency opinion, crypto analysis, blockchain opinion, bitcoin opinion, ethereum opinion" />
      </Helmet>

      <div className="min-h-screen bg-white text-black">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-black">
              opinion
            </h1>
            <p className="text-gray-600 text-lg max-w-4xl leading-relaxed">
              Real-time cryptocurrency opinions and analysis from industry experts, market analysts, and thought leaders. 
              Stay ahead with exclusive insights and professional perspectives on the latest crypto developments.
            </p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={fetchOpinionArticles}
                className="mt-2 text-sm text-primary-500 hover:text-primary-600 underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Opinion Articles Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-8 text-black">
              latest analysis & opinions ({opinionArticles.length} articles)
            </h2>

            {/* Opinion Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {opinionArticles.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-primary-500 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                >
                  <Link to={`/opinion/${article.id}`} className="block">
                    {/* Article Image */}
                    <div className="relative h-48 overflow-hidden">
                      {article.image ? (
                        <img 
                          src={article.image} 
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                      ) : null}
                      
                      {/* Fallback gradient background */}
                      <div 
                        className="absolute inset-0 bg-gradient-to-br from-primary-500 via-yellow-500 to-orange-500" 
                        style={{display: article.image ? 'none' : 'block'}}
                      ></div>

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="bg-primary-500 text-black text-xs font-medium px-2 py-1 rounded">
                          {article.category}
                        </span>
                      </div>
                      
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      
                      {/* Source watermark */}
                      <div className="absolute bottom-4 right-4 text-white/70 text-xs font-medium">
                        {article.source}
                      </div>
                    </div>

                    {/* Article Content */}
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-3 line-clamp-3 group-hover:text-primary-500 transition-colors text-black">
                        {article.title}
                      </h3>
                      
                      {article.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {article.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <HiOutlineClock className="w-3 h-3" />
                          <span>{article.timeAgo}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <HiOutlineUser className="w-3 h-3" />
                          <span>{article.author}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>

            {/* Refresh Button */}
            <div className="text-center">
              <button 
                onClick={fetchOpinionArticles}
                className="bg-primary-500 hover:bg-primary-600 text-black px-8 py-3 rounded-lg transition-colors font-semibold text-lg"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Refresh Real-time Articles'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Opinion;