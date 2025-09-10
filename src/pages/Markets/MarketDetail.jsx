import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  HiOutlineClock, 
  HiOutlineUser, 
  HiOutlineShare,
  HiOutlineHeart,
  HiOutlineBookmark,
  HiOutlineArrowLeft,
  HiOutlineTrendingUp,
  HiOutlineChartBar,
  HiOutlineExternalLink,
  HiOutlineRefresh,
  HiOutlineTrendingDown
} from 'react-icons/hi';

const MarketDetail = () => {
  const { articleId } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (articleId) {
      fetchMarketDetails();
      fetchRelatedMarkets();
    }
  }, [articleId]);

  const fetchMarketDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch real-time market data for the specific asset
      const marketData = await fetchRealTimeMarketDetail(articleId);
      
      if (marketData) {
        setArticle(marketData);
      } else {
        setArticle(getMockMarketById(articleId));
      }

    } catch (error) {
      console.error('Error fetching market details:', error);
      setError('Failed to load market analysis. Please try again later.');
      setArticle(getMockMarketById(articleId));
    } finally {
      setLoading(false);
    }
  };

  const fetchRealTimeMarketDetail = async (id) => {
    try {
      // Extract cryptocurrency symbol from ID or use fallback
      const coinId = extractCoinId(id);
      
      // Fetch detailed market data from CoinGecko
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=false&sparkline=true`
      );

      if (response.ok) {
        const data = await response.json();
        return generateMarketAnalysis(id, data);
      }

      // Fallback: try to get basic price data
      const priceResponse = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`
      );

      if (priceResponse.ok) {
        const priceData = await priceResponse.json();
        if (priceData[coinId]) {
          return generateBasicMarketAnalysis(id, coinId, priceData[coinId]);
        }
      }

      return null;
    } catch (error) {
      console.error('Real-time market detail fetch failed:', error);
      return null;
    }
  };

  const extractCoinId = (articleId) => {
    // Extract coin ID from article ID or use default mapping
    const coinMappings = {
      'btc': 'bitcoin',
      'eth': 'ethereum',
      'sol': 'solana',
      'ada': 'cardano',
      'dot': 'polkadot',
      'link': 'chainlink',
      'uni': 'uniswap',
      'aave': 'aave'
    };

    const lowerArticleId = articleId.toLowerCase();
    
    for (const [symbol, coinId] of Object.entries(coinMappings)) {
      if (lowerArticleId.includes(symbol)) {
        return coinId;
      }
    }

    // Default fallback based on hash
    const coinIds = ['bitcoin', 'ethereum', 'solana', 'cardano', 'polkadot'];
    const hash = articleId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return coinIds[Math.abs(hash) % coinIds.length];
  };

  const generateMarketAnalysis = (id, coinData) => {
    const marketData = coinData.market_data;
    const change24h = marketData.price_change_percentage_24h || 0;
    const price = marketData.current_price?.usd || 0;
    const marketCap = marketData.market_cap?.usd || 0;
    const volume = marketData.total_volume?.usd || 0;

    return {
      id: id,
      title: `${coinData.name} Market Analysis: ${change24h >= 0 ? 'Bullish' : 'Bearish'} Momentum Continues`,
      category: "MARKETS",
      timeAgo: "Live update",
      publishedAt: formatPublishedDate(new Date()),
      author: "Real-time Market Analysis",
      excerpt: `Comprehensive analysis of ${coinData.name} showing ${Math.abs(change24h).toFixed(2)}% ${change24h >= 0 ? 'gains' : 'decline'} with current price at $${price.toLocaleString()}.`,
      content: generateDetailedMarketContent(coinData, marketData),
      tags: generateMarketTags(coinData, marketData),
      readTime: "4 min read",
      image: coinData.image?.large,
      marketData: {
        symbol: coinData.symbol?.toUpperCase(),
        name: coinData.name,
        price: price,
        change24h: change24h,
        change7d: marketData.price_change_percentage_7d,
        change30d: marketData.price_change_percentage_30d,
        marketCap: marketCap,
        volume: volume,
        rank: coinData.market_cap_rank,
        ath: marketData.ath?.usd,
        atl: marketData.atl?.usd,
        sparkline: marketData.sparkline_7d?.price
      },
      isRealTime: true
    };
  };

  const generateBasicMarketAnalysis = (id, coinId, priceData) => {
    const change24h = priceData.usd_24h_change || 0;
    const price = priceData.usd || 0;

    return {
      id: id,
      title: `${coinId.charAt(0).toUpperCase() + coinId.slice(1)} Market Update: ${change24h >= 0 ? 'Positive' : 'Negative'} Price Action`,
      category: "MARKETS",
      timeAgo: "Live update",
      publishedAt: formatPublishedDate(new Date()),
      author: "Live Market Data",
      excerpt: `Current market analysis showing ${Math.abs(change24h).toFixed(2)}% ${change24h >= 0 ? 'gains' : 'decline'} in the last 24 hours.`,
      content: generateBasicMarketContent(coinId, priceData),
      tags: [coinId.toUpperCase().slice(0, 3), change24h >= 0 ? 'BULLISH' : 'BEARISH', 'ANALYSIS'],
      readTime: "3 min read",
      marketData: {
        symbol: coinId.toUpperCase().slice(0, 3),
        price: price,
        change24h: change24h,
        marketCap: priceData.usd_market_cap,
        volume: priceData.usd_24h_vol
      },
      isRealTime: true
    };
  };

  const generateDetailedMarketContent = (coinData, marketData) => {
    const change24h = marketData.price_change_percentage_24h || 0;
    const price = marketData.current_price?.usd || 0;
    const marketCap = marketData.market_cap?.usd || 0;
    const volume = marketData.total_volume?.usd || 0;
    const rank = coinData.market_cap_rank || 0;

    return `
      <div class="border-l-4 border-yellow-500 pl-6 mb-8 bg-yellow-50 p-4 rounded-r-lg">
        <p class="lead text-lg font-medium text-gray-800">Real-time market analysis for ${coinData.name} showing current price action, technical indicators, and market sentiment.</p>
      </div>
      
      <h2 class="text-2xl font-bold mb-4 text-gray-900">Current Market Overview</h2>
      <p class="mb-6 text-gray-700 leading-relaxed">${coinData.name} is currently trading at ${price.toLocaleString()} with a ${change24h >= 0 ? 'positive' : 'negative'} ${Math.abs(change24h).toFixed(2)}% price movement in the last 24 hours. The asset maintains its #${rank} position by market capitalization.</p>
      
      <div class="bg-gray-50 border border-gray-200 p-6 rounded-lg mb-8">
        <h3 class="text-lg font-semibold mb-4 text-gray-900">Key Market Metrics</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p class="text-gray-600 text-sm">Current Price</p>
            <p class="text-xl font-bold text-gray-900">${price.toLocaleString()}</p>
          </div>
          <div>
            <p class="text-gray-600 text-sm">24h Change</p>
            <p class="text-xl font-bold ${change24h >= 0 ? 'text-green-600' : 'text-red-600'}">
              ${change24h >= 0 ? '+' : ''}${change24h.toFixed(2)}%
            </p>
          </div>
          <div>
            <p class="text-gray-600 text-sm">Market Cap</p>
            <p class="text-xl font-bold text-gray-900">${(marketCap / 1e9).toFixed(2)}B</p>
          </div>
          <div>
            <p class="text-gray-600 text-sm">24h Volume</p>
            <p class="text-xl font-bold text-gray-900">${(volume / 1e9).toFixed(2)}B</p>
          </div>
        </div>
      </div>
      
      <h2 class="text-2xl font-bold mb-4 text-gray-900">Technical Analysis</h2>
      <p class="mb-6 text-gray-700 leading-relaxed">Technical indicators suggest ${change24h >= 0 ? 'bullish momentum with potential for continued upward movement' : 'bearish pressure with support levels being tested'}. Trading volume of ${(volume / 1e9).toFixed(2)}B indicates ${volume > 1e9 ? 'strong' : 'moderate'} market participation.</p>
      
      <ul class="list-disc pl-6 mb-8 space-y-3 text-gray-700">
        <li>Price action shows ${change24h >= 0 ? 'strength above key support levels' : 'testing of critical support zones'}</li>
        <li>Volume profile indicates ${volume > marketCap * 0.1 ? 'high liquidity and active trading' : 'steady trading with normal volume patterns'}</li>
        <li>Market structure suggests ${change24h >= 0 ? 'potential for further gains if momentum continues' : 'consolidation phase with possible reversal signals'}</li>
        <li>Risk assessment: ${Math.abs(change24h) > 5 ? 'Elevated volatility requires careful position management' : 'Normal volatility levels with standard risk parameters'}</li>
      </ul>
      
      <h2 class="text-2xl font-bold mb-4 text-gray-900">Market Sentiment & Outlook</h2>
      <p class="mb-6 text-gray-700 leading-relaxed">Current market sentiment for ${coinData.name} appears ${change24h >= 0 ? 'optimistic' : 'cautious'} based on price action and trading patterns. The asset's position as the #${rank} cryptocurrency by market cap provides ${rank <= 10 ? 'strong institutional recognition' : 'growth potential in the expanding crypto market'}.</p>
      
      <div class="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
        <h3 class="text-sm font-medium text-yellow-800">Real-time Market Data</h3>
        <p class="text-sm text-yellow-700 mt-1">This analysis is based on live market data and updates automatically. Market conditions can change rapidly, and this information should be used in conjunction with your own research and risk management strategies.</p>
      </div>
    `;
  };

  const generateBasicMarketContent = (coinId, priceData) => {
    const change24h = priceData.usd_24h_change || 0;
    const price = priceData.usd || 0;

    return `
      <div class="border-l-4 border-yellow-500 pl-6 mb-8 bg-yellow-50 p-4 rounded-r-lg">
        <p class="lead text-lg font-medium text-gray-800">Live market update for ${coinId} with current price data and short-term analysis.</p>
      </div>
      
      <h2 class="text-2xl font-bold mb-4 text-gray-900">Current Price Action</h2>
      <p class="mb-6 text-gray-700 leading-relaxed">${coinId.charAt(0).toUpperCase() + coinId.slice(1)} is showing ${change24h >= 0 ? 'positive momentum' : 'corrective movement'} with a ${Math.abs(change24h).toFixed(2)}% change over the last 24 hours, currently priced at ${price.toLocaleString()}.</p>
      
      <h2 class="text-2xl font-bold mb-4 text-gray-900">Market Analysis</h2>
      <p class="mb-6 text-gray-700 leading-relaxed">The ${change24h >= 0 ? 'upward' : 'downward'} price movement indicates ${change24h >= 0 ? 'buying interest and potential bullish sentiment' : 'selling pressure and cautious market sentiment'}. Traders and investors should monitor key support and resistance levels for potential trading opportunities.</p>
      
      <div class="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
        <p class="text-sm text-gray-700"><strong class="text-yellow-800">Live Data:</strong> This analysis reflects real-time market conditions and may change as new data becomes available.</p>
      </div>
    `;
  };

  const generateMarketTags = (coinData, marketData) => {
    const tags = [coinData.symbol?.toUpperCase() || 'CRYPTO'];
    const change24h = marketData.price_change_percentage_24h || 0;

    if (change24h >= 5) tags.push('BULLISH', 'SURGE');
    else if (change24h <= -5) tags.push('BEARISH', 'CORRECTION');
    else tags.push('CONSOLIDATION');

    if (coinData.market_cap_rank <= 10) tags.push('TOP-10');
    if (marketData.total_volume?.usd > 1e9) tags.push('HIGH-VOLUME');

    return tags.slice(0, 4);
  };

  const fetchRelatedMarkets = async () => {
    try {
      // Generate related market analyses
      const relatedMarkets = [
        {
          id: 'market_btc_analysis_' + Date.now(),
          title: "Bitcoin Market Dynamics: Institutional Interest Continues",
          timeAgo: "1 hour ago",
          category: "MARKETS"
        },
        {
          id: 'market_eth_defi_' + Date.now(),
          title: "Ethereum Ecosystem Growth: DeFi TVL Reaches New Heights",
          timeAgo: "2 hours ago",
          category: "MARKETS"
        },
        {
          id: 'market_altcoin_season_' + Date.now(),
          title: "Altcoin Market Analysis: Selective Strength Across Assets",
          timeAgo: "3 hours ago",
          category: "MARKETS"
        },
        {
          id: 'market_defi_protocols_' + Date.now(),
          title: "DeFi Protocol Analysis: Yield Farming Returns Stabilize",
          timeAgo: "4 hours ago",
          category: "MARKETS"
        }
      ];

      setRelatedArticles(relatedMarkets);
    } catch (error) {
      console.error('Error fetching related markets:', error);
      setRelatedArticles([]);
    }
  };

  const formatPublishedDate = (publishedAt) => {
    return new Date(publishedAt).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', 
      hour: 'numeric', minute: '2-digit', timeZoneName: 'short'
    });
  };

  const getMockMarketById = (id) => {
    return {
      id: id,
      title: "Cryptocurrency Market Analysis: Real-time Price Action Review",
      category: "MARKETS",
      timeAgo: "Live update",
      publishedAt: formatPublishedDate(new Date()),
      author: "Market Analysis Team",
      excerpt: "Comprehensive real-time analysis of cryptocurrency market conditions with technical indicators and sentiment analysis.",
      content: `
        <div class="border-l-4 border-yellow-500 pl-6 mb-8 bg-yellow-50 p-4 rounded-r-lg">
          <p class="lead text-lg font-medium text-gray-800">Real-time cryptocurrency market analysis examining current trends, price movements, and trading opportunities.</p>
        </div>
        
        <h2 class="text-2xl font-bold mb-4 text-gray-900">Market Overview</h2>
        <p class="mb-6 text-gray-700 leading-relaxed">Current cryptocurrency market conditions show dynamic trading patterns with various assets displaying different momentum characteristics across multiple timeframes.</p>
        
        <h2 class="text-2xl font-bold mb-4 text-gray-900">Technical Analysis</h2>
        <p class="mb-6 text-gray-700 leading-relaxed">Key technical indicators are providing insights into potential market direction and trading opportunities across major cryptocurrency assets.</p>
      `,
      tags: ['MARKETS', 'ANALYSIS', 'CRYPTO', 'TECHNICAL'],
      readTime: "4 min read",
      isRealTime: false
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading market analysis...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Market analysis not found</h2>
              <p className="text-gray-600 mb-4">
                {error || 'The market analysis you are looking for could not be found.'}
              </p>
              <Link to="/markets" className="text-yellow-600 hover:text-yellow-500 font-medium">
                Back to Markets
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{article.title} | Crypto Markets</title>
        <meta name="description" content={article.excerpt} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:type" content="article" />
      </Helmet>

      <div className="min-h-screen bg-white text-gray-900">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Back Button */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link 
              to="/markets" 
              className="inline-flex items-center text-gray-600 hover:text-yellow-600 transition-colors duration-200 font-medium"
            >
              <HiOutlineArrowLeft className="w-5 h-5 mr-2" />
              Back to Markets
            </Link>
          </motion.div>

          {/* Article Header */}
          <motion.header 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                {article.category}
              </span>
              {article.isRealTime && (
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                  <HiOutlineRefresh className="w-3 h-3 mr-1" />
                  LIVE
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-gray-900">
              {article.title}
            </h1>

            {/* Market Data Summary */}
            {article.marketData && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {article.marketData.price && (
                    <div className="text-center">
                      <p className="text-gray-600 text-sm">Current Price</p>
                      <p className="text-2xl font-bold text-gray-900">${article.marketData.price.toLocaleString()}</p>
                    </div>
                  )}
                  {article.marketData.change24h !== undefined && (
                    <div className="text-center">
                      <p className="text-gray-600 text-sm">24h Change</p>
                      <p className={`text-2xl font-bold ${article.marketData.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {article.marketData.change24h >= 0 ? '+' : ''}{article.marketData.change24h.toFixed(2)}%
                      </p>
                    </div>
                  )}
                  {article.marketData.marketCap && (
                    <div className="text-center">
                      <p className="text-gray-600 text-sm">Market Cap</p>
                      <p className="text-2xl font-bold text-gray-900">${(article.marketData.marketCap / 1e9).toFixed(2)}B</p>
                    </div>
                  )}
                  {article.marketData.rank && (
                    <div className="text-center">
                      <p className="text-gray-600 text-sm">Rank</p>
                      <p className="text-2xl font-bold text-gray-900">#{article.marketData.rank}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Author and Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-500 rounded-full mr-3 flex items-center justify-center">
                  <HiOutlineUser className="w-4 h-4 text-black" />
                </div>
                <span>By {article.author}</span>
              </div>
              <div className="flex items-center">
                <HiOutlineClock className="w-4 h-4 mr-1" />
                <span>{article.publishedAt}</span>
              </div>
              <span>{article.readTime}</span>
            </div>

            {/* Action Buttons */}
            <motion.div 
              className="flex items-center space-x-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors duration-200">
                <HiOutlineHeart className="w-5 h-5" />
                <span className="text-sm font-medium">Like</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-yellow-600 transition-colors duration-200">
                <HiOutlineBookmark className="w-5 h-5" />
                <span className="text-sm font-medium">Save</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200">
                <HiOutlineShare className="w-5 h-5" />
                <span className="text-sm font-medium">Share</span>
              </button>
              {article.isRealTime && (
                <button 
                  onClick={() => window.location.reload()}
                  className="flex items-center space-x-2 text-gray-600 hover:text-yellow-600 transition-colors duration-200"
                >
                  <HiOutlineRefresh className="w-5 h-5" />
                  <span className="text-sm font-medium">Refresh Data</span>
                </button>
              )}
            </motion.div>
          </motion.header>

          {/* Article Excerpt */}
          {article.excerpt && (
            <motion.div 
              className="mb-8 p-6 bg-yellow-50 rounded-lg border-l-4 border-yellow-500"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <p className="text-lg text-gray-800 italic leading-relaxed">{article.excerpt}</p>
            </motion.div>
          )}

          {/* Article Content */}
          <motion.article 
            className="prose prose-lg max-w-none mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div 
              dangerouslySetInnerHTML={{ __html: article.content }}
              className="article-content text-gray-700 leading-relaxed [&>h2]:text-gray-900 [&>h3]:text-gray-900 [&>h4]:text-gray-900 [&>p]:mb-4 [&>ul]:mb-6 [&>li]:mb-2"
            />
          </motion.article>

          {/* Read More CTA */}
          <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-yellow-800 mb-1">Live Market Data</h4>
                <p className="text-sm text-gray-700">
                  Get real-time updates and comprehensive market analysis.
                </p>
              </div>
              <button 
                onClick={() => window.location.reload()}
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-lg transition-colors font-medium flex items-center space-x-2"
              >
                <span>Refresh Analysis</span>
                <HiOutlineRefresh className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Market Tags</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-semibold hover:bg-yellow-300 transition-colors cursor-pointer"
                  >
                    #{tag.toLowerCase()}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <motion.section 
              className="border-t border-gray-200 pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
                <HiOutlineTrendingUp className="w-6 h-6 mr-2 text-yellow-500" />
                Related Market Analysis
              </h3>
              <div className="grid gap-4 md:gap-6">
                {relatedArticles.map((relatedArticle, index) => (
                  <motion.div
                    key={relatedArticle.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    <Link
                      to={`/markets/${relatedArticle.id}`}
                      className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200 border border-gray-200 hover:border-yellow-300 group"
                    >
                      <h4 className="font-semibold mb-2 text-gray-900 group-hover:text-yellow-600 transition-colors">
                        {relatedArticle.title}
                      </h4>
                      <div className="text-sm text-gray-600 flex items-center gap-3">
                        <span className="bg-yellow-400 text-black px-2 py-1 rounded text-xs font-semibold">
                          {relatedArticle.category}
                        </span>
                        <span className="flex items-center">
                          <HiOutlineClock className="w-3 h-3 mr-1" />
                          {relatedArticle.timeAgo}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </div>
    </>
  );
};

export default MarketDetail;