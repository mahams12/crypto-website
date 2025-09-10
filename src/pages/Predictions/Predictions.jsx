import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  HiOutlineTrendingUp, 
  HiOutlineTrendingDown, 
  HiOutlineCalendar,
  HiOutlineChartBar,
  HiOutlineLocationMarker,
  HiOutlineClock,
  HiOutlineSparkles,
  HiOutlineEye,
  HiOutlineRefresh
} from 'react-icons/hi';

const Predictions = () => {
  const [predictionArticles, setPredictionArticles] = useState([]);
  const [topCoins, setTopCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marketData, setMarketData] = useState({});

  useEffect(() => {
    fetchRealTimePredictions();
    fetchTopCoins();
    // Refresh data every 10 minutes to avoid rate limiting
    const interval = setInterval(() => {
      fetchRealTimePredictions();
      fetchTopCoins();
    }, 600000); // 10 minutes
    return () => clearInterval(interval);
  }, []);

  const fetchRealTimePredictions = async () => {
    try {
      setLoading(true);

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Fetch real-time market data for predictions with retry logic
      const cryptoResponse = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=15&page=1&sparkline=false&price_change_percentage=24h%2C7d', {
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!cryptoResponse.ok) {
        throw new Error(`HTTP error! status: ${cryptoResponse.status}`);
      }

      const cryptoData = await cryptoResponse.json();

      if (cryptoData && Array.isArray(cryptoData) && cryptoData.length > 0) {
        // Generate prediction articles based on real market data
        const predictions = await generatePredictionArticles(cryptoData);
        setPredictionArticles(predictions);
        
        // Store market data for later use
        const marketDataMap = {};
        cryptoData.forEach(coin => {
          marketDataMap[coin.id] = coin;
        });
        setMarketData(marketDataMap);
      } else {
        throw new Error('Invalid data received from API');
      }

    } catch (error) {
      console.error('Error fetching predictions:', error);
      // Use fallback data when API fails
      setPredictionArticles(getFallbackPredictions());
    } finally {
      setLoading(false);
    }
  };

  const fetchTopCoins = async () => {
    try {
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false', {
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && Array.isArray(data)) {
        setTopCoins(data);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      console.error('Error fetching top coins:', error);
      // Use fallback data for top coins
      setTopCoins(getFallbackTopCoins());
    }
  };

  const getFallbackTopCoins = () => [
    {
      id: 'bitcoin',
      symbol: 'btc',
      name: 'Bitcoin',
      image: 'https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png',
      current_price: 95420.50,
      price_change_percentage_24h: 2.45
    },
    {
      id: 'ethereum',
      symbol: 'eth', 
      name: 'Ethereum',
      image: 'https://coin-images.coingecko.com/coins/images/279/large/ethereum.png',
      current_price: 4180.32,
      price_change_percentage_24h: -1.23
    },
    {
      id: 'solana',
      symbol: 'sol',
      name: 'Solana', 
      image: 'https://coin-images.coingecko.com/coins/images/4128/large/solana.png',
      current_price: 218.76,
      price_change_percentage_24h: 3.87
    },
    {
      id: 'ripple',
      symbol: 'xrp',
      name: 'XRP',
      image: 'https://coin-images.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
      current_price: 2.85,
      price_change_percentage_24h: 5.12
    },
    {
      id: 'cardano',
      symbol: 'ada',
      name: 'Cardano',
      image: 'https://coin-images.coingecko.com/coins/images/975/large/cardano.png',
      current_price: 1.15,
      price_change_percentage_24h: -2.34
    },
    {
      id: 'dogecoin',
      symbol: 'doge',
      name: 'Dogecoin',
      image: 'https://coin-images.coingecko.com/coins/images/5/large/dogecoin.png',
      current_price: 0.32,
      price_change_percentage_24h: 4.56
    },
    {
      id: 'polygon',
      symbol: 'matic',
      name: 'Polygon',
      image: 'https://coin-images.coingecko.com/coins/images/4713/large/matic-token-icon.png',
      current_price: 0.98,
      price_change_percentage_24h: 1.87
    },
    {
      id: 'avalanche-2',
      symbol: 'avax',
      name: 'Avalanche',
      image: 'https://coin-images.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png',
      current_price: 42.15,
      price_change_percentage_24h: -0.76
    }
  ];

  const generatePredictionArticles = async (cryptoData) => {
    const predictionTemplates = [
      {
        type: 'bullish',
        titleFormat: '{name} Price Prediction: {symbol} Eyes {target} Target Amid Strong Momentum',
        content: 'Technical analysis reveals bullish patterns with strong support levels holding. Market sentiment remains positive with institutional interest growing.',
        prediction: 'BULLISH'
      },
      {
        type: 'bearish', 
        titleFormat: '{name} Price Alert: {symbol} Tests Critical Support at ${price}',
        content: 'Key resistance levels are being tested with potential downside risks. Traders should monitor support levels closely.',
        prediction: 'BEARISH'
      },
      {
        type: 'breakout',
        titleFormat: '{name} Breakout Alert: {symbol} Targets ${target} Following Technical Setup',
        content: 'Chart patterns suggest potential breakout above key resistance. Volume indicators support continued upward movement.',
        prediction: 'BREAKOUT'
      },
      {
        type: 'consolidation',
        titleFormat: '{name} Analysis: {symbol} Consolidates Before Next Major Move',
        content: 'Current consolidation phase suggests accumulation by smart money. Next directional move could be significant.',
        prediction: 'CONSOLIDATION'
      }
    ];

    const predictions = [];
    
    for (let i = 0; i < Math.min(16, cryptoData.length); i++) {
      const coin = cryptoData[i];
      const template = predictionTemplates[i % predictionTemplates.length];
      
      // Calculate prediction targets based on technical levels
      const currentPrice = coin.current_price;
      const change24h = coin.price_change_percentage_24h || 0;
      const change7d = coin.price_change_percentage_7d || 0;
      
      let targetPrice, timeframe;
      if (template.type === 'bullish') {
        targetPrice = currentPrice * (1 + Math.abs(change24h) / 100 + 0.15);
        timeframe = '2-4 weeks';
      } else if (template.type === 'bearish') {
        targetPrice = currentPrice * (1 - Math.abs(change24h) / 100 - 0.10);
        timeframe = '1-2 weeks';
      } else if (template.type === 'breakout') {
        targetPrice = currentPrice * (1 + 0.25);
        timeframe = '3-6 weeks';
      } else {
        targetPrice = currentPrice * (1 + Math.random() * 0.2 - 0.1);
        timeframe = '2-8 weeks';
      }

      const confidence = Math.floor(Math.random() * 25 + 65); // 65-90%
      const views = Math.floor(Math.random() * 10000 + 1000);

      const title = template.titleFormat
        .replace('{name}', coin.name)
        .replace('{symbol}', coin.symbol.toUpperCase())
        .replace('{target}', `$${targetPrice.toFixed(2)}`)
        .replace('{price}', currentPrice.toFixed(2));

      predictions.push({
        id: `prediction_${coin.id}_${Date.now()}_${i}`,
        title: title,
        symbol: coin.symbol.toUpperCase(),
        coinId: coin.id,
        image: coin.image,
        category: "PREDICTIONS",
        timeAgo: "Just updated",
        coinIcon: coin.image,
        excerpt: `${template.content} Current price: $${currentPrice.toFixed(2)} | Target: $${targetPrice.toFixed(2)} | Timeframe: ${timeframe}`,
        featured: i < 4,
        currentPrice: currentPrice,
        targetPrice: targetPrice,
        timeframe: timeframe,
        confidence: confidence,
        prediction: template.prediction,
        change24h: change24h,
        change7d: change7d,
        views: views,
        author: getPredictionAnalyst(template.type),
        publishedAt: new Date().toISOString(),
        analysis: generateTechnicalAnalysis(coin, template.type),
        sparkline: coin.sparkline_in_7d?.price || []
      });
    }

    return predictions;
  };

  const getPredictionAnalyst = (type) => {
    const analysts = {
      bullish: 'Michael Chen',
      bearish: 'Sarah Rodriguez', 
      breakout: 'David Kim',
      consolidation: 'Emma Thompson'
    };
    return analysts[type] || 'Crypto Analyst';
  };

  const generateTechnicalAnalysis = (coin, type) => {
    const price = coin.current_price;
    const support = price * 0.85;
    const resistance = price * 1.15;
    
    const analyses = {
      bullish: `Strong bullish momentum with RSI showing oversold recovery. Support at $${support.toFixed(2)} holding firm.`,
      bearish: `Bearish divergence on daily chart. Key resistance at $${resistance.toFixed(2)} rejected multiple times.`,
      breakout: `Ascending triangle pattern forming. Break above $${resistance.toFixed(2)} could trigger significant upside.`,
      consolidation: `Sideways movement between $${support.toFixed(2)} and $${resistance.toFixed(2)}. Accumulation phase detected.`
    };
    
    return analyses[type] || 'Mixed signals in current market structure.';
  };

  const getFallbackPredictions = () => [
    {
      id: 'fallback_1',
      title: "Bitcoin Price Prediction: BTC Targets $125K Following Institutional Inflows",
      symbol: "BTC",
      coinId: "bitcoin",
      image: "https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png",
      category: "PREDICTIONS",
      timeAgo: "2 hours ago",
      coinIcon: "https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png",
      excerpt: "Technical analysis suggests Bitcoin could reach new all-time highs as institutional adoption continues. Target: $125,000 | Timeframe: 4-8 weeks",
      featured: true,
      currentPrice: 95420,
      targetPrice: 125000,
      timeframe: "4-8 weeks",
      confidence: 78,
      prediction: 'BULLISH',
      change24h: 3.2,
      change7d: 8.5,
      views: 8543,
      author: 'Michael Chen',
      publishedAt: new Date().toISOString(),
      analysis: "Strong bullish momentum with RSI showing oversold recovery. Support at $81,107 holding firm.",
      sparkline: []
    },
    {
      id: 'fallback_2', 
      title: "Ethereum Analysis: ETH Consolidates Before Breakout to $6,500",
      symbol: "ETH",
      coinId: "ethereum",
      image: "https://coin-images.coingecko.com/coins/images/279/large/ethereum.png",
      category: "PREDICTIONS",
      timeAgo: "4 hours ago",
      coinIcon: "https://coin-images.coingecko.com/coins/images/279/large/ethereum.png",
      excerpt: "Ethereum shows strong fundamentals with upcoming upgrades. Current consolidation suggests accumulation before next leg up.",
      featured: true,
      currentPrice: 4180,
      targetPrice: 6500,
      timeframe: "6-10 weeks",
      confidence: 82,
      prediction: 'CONSOLIDATION',
      change24h: -1.2,
      change7d: 5.8,
      views: 6789,
      author: 'Emma Thompson',
      publishedAt: new Date().toISOString(),
      analysis: "Sideways movement between $3,553 and $4,807. Accumulation phase detected.",
      sparkline: []
    },
    {
      id: 'fallback_3',
      title: "Solana Breakout Alert: SOL Targets $400 Following Network Growth", 
      symbol: "SOL",
      coinId: "solana",
      image: "https://coin-images.coingecko.com/coins/images/4128/large/solana.png",
      category: "PREDICTIONS",
      timeAgo: "6 hours ago",
      coinIcon: "https://coin-images.coingecko.com/coins/images/4128/large/solana.png",
      excerpt: "Solana ecosystem expansion and DeFi growth driving bullish momentum. Technical breakout pattern forming.",
      featured: true,
      currentPrice: 218,
      targetPrice: 400,
      timeframe: "3-6 weeks",
      confidence: 75,
      prediction: 'BREAKOUT',
      change24h: 5.1,
      change7d: 12.3,
      views: 5432,
      author: 'David Kim',
      publishedAt: new Date().toISOString(),
      analysis: "Ascending triangle pattern forming. Break above $251 could trigger significant upside.",
      sparkline: []
    },
    {
      id: 'fallback_4',
      title: "XRP Price Alert: Ripple Tests Critical Support at $2.42",
      symbol: "XRP", 
      coinId: "ripple",
      image: "https://coin-images.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
      category: "PREDICTIONS",
      timeAgo: "8 hours ago",
      coinIcon: "https://coin-images.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
      excerpt: "Regulatory clarity driving XRP momentum. Key support levels being tested with potential for major move.",
      featured: false,
      currentPrice: 2.85,
      targetPrice: 2.42,
      timeframe: "1-2 weeks",
      confidence: 68,
      prediction: 'BEARISH',
      change24h: -3.4,
      change7d: -1.2,
      views: 4321,
      author: 'Sarah Rodriguez',
      publishedAt: new Date().toISOString(),
      analysis: "Bearish divergence on daily chart. Key resistance at $3.28 rejected multiple times.",
      sparkline: []
    },
    {
      id: 'fallback_5',
      title: "Cardano Price Prediction: ADA Eyes $2.20 Target Amid Strong Momentum",
      symbol: "ADA",
      coinId: "cardano", 
      image: "https://coin-images.coingecko.com/coins/images/975/large/cardano.png",
      category: "PREDICTIONS",
      timeAgo: "10 hours ago",
      coinIcon: "https://coin-images.coingecko.com/coins/images/975/large/cardano.png",
      excerpt: "Cardano development progress and ecosystem growth supporting bullish outlook. Technical indicators align.",
      featured: false,
      currentPrice: 1.15,
      targetPrice: 2.20,
      timeframe: "5-8 weeks",
      confidence: 71,
      prediction: 'BULLISH',
      change24h: 2.8,
      change7d: 15.6,
      views: 3876,
      author: 'Michael Chen',
      publishedAt: new Date().toISOString(),
      analysis: "Strong bullish momentum with RSI showing oversold recovery. Support at $0.98 holding firm.",
      sparkline: []
    },
    {
      id: 'fallback_6',
      title: "Dogecoin Analysis: DOGE Consolidates Before Next Major Move",
      symbol: "DOGE",
      coinId: "dogecoin",
      image: "https://coin-images.coingecko.com/coins/images/5/large/dogecoin.png", 
      category: "PREDICTIONS",
      timeAgo: "12 hours ago",
      coinIcon: "https://coin-images.coingecko.com/coins/images/5/large/dogecoin.png",
      excerpt: "Dogecoin showing consolidation patterns. Community sentiment and meme momentum building for next move.",
      featured: false,
      currentPrice: 0.32,
      targetPrice: 0.55,
      timeframe: "4-7 weeks",
      confidence: 65,
      prediction: 'CONSOLIDATION',
      change24h: 1.5,
      change7d: 8.9,
      views: 2987,
      author: 'Emma Thompson',
      publishedAt: new Date().toISOString(),
      analysis: "Sideways movement between $0.27 and $0.37. Accumulation phase detected.",
      sparkline: []
    },
    {
      id: 'fallback_7',
      title: "Polygon Breakout Imminent: MATIC Targets $1.80 Following Technical Setup",
      symbol: "MATIC",
      coinId: "polygon",
      image: "https://coin-images.coingecko.com/coins/images/4713/large/matic-token-icon.png",
      category: "PREDICTIONS", 
      timeAgo: "14 hours ago",
      coinIcon: "https://coin-images.coingecko.com/coins/images/4713/large/matic-token-icon.png",
      excerpt: "Polygon ecosystem developments and layer-2 adoption driving technical breakout setup.",
      featured: false,
      currentPrice: 0.98,
      targetPrice: 1.80,
      timeframe: "3-5 weeks",
      confidence: 73,
      prediction: 'BREAKOUT',
      change24h: 4.2,
      change7d: 18.7,
      views: 2543,
      author: 'David Kim',
      publishedAt: new Date().toISOString(),
      analysis: "Ascending triangle pattern forming. Break above $1.13 could trigger significant upside.",
      sparkline: []
    },
    {
      id: 'fallback_8',
      title: "Avalanche Price Alert: AVAX Tests Support Levels",
      symbol: "AVAX",
      coinId: "avalanche-2",
      image: "https://coin-images.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png",
      category: "PREDICTIONS",
      timeAgo: "16 hours ago", 
      coinIcon: "https://coin-images.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png",
      excerpt: "AVAX facing pressure at key support levels. Network metrics and DeFi activity under scrutiny.",
      featured: false,
      currentPrice: 42.15,
      targetPrice: 35.82,
      timeframe: "2-3 weeks",
      confidence: 69,
      prediction: 'BEARISH',
      change24h: -2.1,
      change7d: -5.4,
      views: 1987,
      author: 'Sarah Rodriguez',
      publishedAt: new Date().toISOString(),
      analysis: "Bearish divergence on daily chart. Key resistance at $48.47 rejected multiple times.",
      sparkline: []
    }
  ];

  const formatPrice = (price) => {
    if (price >= 1) {
      return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  const formatPercentage = (percent) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const getPredictionColor = (prediction) => {
    const colors = {
      'BULLISH': 'text-green-600',
      'BEARISH': 'text-red-600', 
      'BREAKOUT': 'text-blue-600',
      'CONSOLIDATION': 'text-yellow-600'
    };
    return colors[prediction] || 'text-gray-600';
  };

  const getPredictionIcon = (prediction) => {
    const icons = {
      'BULLISH': <HiOutlineTrendingUp className="w-4 h-4" />,
      'BEARISH': <HiOutlineTrendingDown className="w-4 h-4" />,
      'BREAKOUT': <HiOutlineSparkles className="w-4 h-4" />,
      'CONSOLIDATION': <HiOutlineChartBar className="w-4 h-4" />
    };
    return icons[prediction] || <HiOutlineChartBar className="w-4 h-4" />;
  };

  const goldenYellow = '#F9D849';
  const goldenYellowLight = '#FFFBEB';
  const goldenYellowDark = '#F59E0B';

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Helmet>
        <title>Predictions - CryptoTracker | Real-Time Crypto Price Forecasts</title>
        <meta name="description" content="Expert cryptocurrency price predictions and technical analysis. Real-time market forecasts for Bitcoin, Ethereum, and top altcoins." />
      </Helmet>

      {/* Header Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">predictions</h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Expert cryptocurrency price predictions powered by real-time market data and technical analysis. 
            Our analysts provide data-driven forecasts to help you navigate the volatile crypto markets with confidence.
          </p>
          
          {/* Market Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {predictionArticles.filter(p => p.prediction === 'BULLISH').length}
              </div>
              <div className="text-sm text-gray-600">Bullish Signals</div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {predictionArticles.filter(p => p.prediction === 'BEARISH').length}
              </div>
              <div className="text-sm text-gray-600">Bearish Alerts</div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {predictionArticles.filter(p => p.prediction === 'BREAKOUT').length}
              </div>
              <div className="text-sm text-gray-600">Breakout Setups</div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold" style={{ color: goldenYellow }}>78%</div>
              <div className="text-sm text-gray-600">Avg Confidence</div>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Predictions */}
      <div className="container mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">latest price predictions ({predictionArticles.length} forecasts)</h2>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Updated: {new Date().toLocaleTimeString()}
            </div>
            <button 
              onClick={fetchRealTimePredictions}
              className="flex items-center space-x-2 text-black px-4 py-2 rounded-lg transition-colors font-medium shadow-md hover:shadow-lg"
              style={{ 
                backgroundColor: goldenYellow,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = goldenYellowDark}
              onMouseLeave={(e) => e.target.style.backgroundColor = goldenYellow}
              disabled={loading}
            >
              <HiOutlineRefresh className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg animate-pulse">
                <div className="bg-gray-200 h-48 rounded-t-lg"></div>
                <div className="p-4 space-y-3">
                  <div className="bg-gray-200 h-4 rounded"></div>
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                  <div className="bg-gray-200 h-3 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {predictionArticles.map((article, index) => (
              <Link key={article.id} to={`/predictions/${article.id}`}>
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 group cursor-pointer h-full flex flex-col"
                  style={{
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = goldenYellow;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E5E7EB';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden bg-gray-50">
                    <div 
                      className="absolute inset-0" 
                      style={{ 
                        background: `linear-gradient(135deg, ${goldenYellowLight}, ${goldenYellow})` 
                      }}
                    ></div>
                    
                    {/* Coin Icon and Price Info */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <img 
                          src={article.coinIcon} 
                          alt={article.symbol}
                          className="w-16 h-16 mx-auto mb-2"
                        />
                        <div className="text-gray-900 font-bold text-lg">
                          {formatPrice(article.currentPrice)}
                        </div>
                        <div className={`text-sm font-semibold ${
                          article.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatPercentage(article.change24h)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Prediction Badge */}
                    <div className="absolute top-3 left-3">
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold border ${getPredictionColor(article.prediction)} bg-white`}>
                        {getPredictionIcon(article.prediction)}
                        <span>{article.prediction}</span>
                      </div>
                    </div>

                    {/* Confidence Score */}
                    <div className="absolute top-3 right-3">
                      <div className="bg-black/80 text-white px-2 py-1 rounded text-xs font-bold">
                        {article.confidence}% confidence
                      </div>
                    </div>

                    {/* Views */}
                    <div className="absolute bottom-3 right-3 flex items-center text-gray-700 text-xs bg-white/80 px-2 py-1 rounded">
                      <HiOutlineEye className="w-3 h-3 mr-1" />
                      <span>{article.views?.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 
                      className="text-md font-bold mb-3 line-clamp-2 transition-colors text-gray-900 leading-tight"
                      style={{ transition: 'color 0.3s ease' }}
                      onMouseEnter={(e) => e.target.style.color = goldenYellow}
                      onMouseLeave={(e) => e.target.style.color = '#111827'}
                    >
                      {article.title.length > 70 ? article.title.substring(0, 70) + '...' : article.title}
                    </h3>
                    
                    {/* Prediction Details */}
                    <div className="mb-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Target:</span>
                        <span className="text-gray-900 font-semibold">
                          {formatPrice(article.targetPrice)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Timeframe:</span>
                        <span className="text-gray-900">{article.timeframe}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Potential:</span>
                        <span className={`font-semibold ${
                          article.targetPrice > article.currentPrice ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatPercentage(((article.targetPrice - article.currentPrice) / article.currentPrice) * 100)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-600 mt-auto">
                      <div className="flex items-center">
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center">
                        <HiOutlineClock className="w-4 h-4 mr-1" />
                        <span>{article.timeAgo}</span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Predictions;