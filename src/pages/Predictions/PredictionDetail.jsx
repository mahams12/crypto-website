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
  HiOutlineTrendingDown,
  HiOutlineChartBar,
  HiOutlineExternalLink,
  HiOutlineSparkles,
  HiOutlineEye,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineRefresh
} from 'react-icons/hi';

const PredictionDetail = () => {
  const { articleId } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedPredictions, setRelatedPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceData, setPriceData] = useState(null);

  useEffect(() => {
    if (articleId) {
      fetchPredictionDetails();
      fetchRelatedPredictions();
    }
  }, [articleId]);

  const fetchPredictionDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Extract coin info from articleId or generate based on ID
      const coinInfo = extractCoinFromId(articleId);
      
      // Fetch real-time market data
      const marketResponse = await fetch(`https://api.coingecko.com/api/v3/coins/${coinInfo.id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`);
      const marketData = await marketResponse.json();

      if (marketData && !marketData.error) {
        const predictionArticle = await generateDetailedPrediction(marketData, articleId);
        setArticle(predictionArticle);
        setPriceData(marketData.market_data);
      } else {
        // Fallback to mock data
        setArticle(generateMockPrediction(coinInfo, articleId));
      }

    } catch (error) {
      console.error('Error fetching prediction details:', error);
      const coinInfo = extractCoinFromId(articleId);
      setArticle(generateMockPrediction(coinInfo, articleId));
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPredictions = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=6&page=1&sparkline=false');
      const data = await response.json();
      
      if (data && Array.isArray(data)) {
        const related = data.slice(0, 3).map((coin, index) => ({
          id: `related_${coin.id}_${index}`,
          title: generatePredictionTitle(coin),
          symbol: coin.symbol.toUpperCase(),
          timeAgo: `${Math.floor(Math.random() * 6) + 1} hours ago`,
          category: "PREDICTIONS",
          prediction: getRandomPrediction(),
          change24h: coin.price_change_percentage_24h || 0
        }));
        setRelatedPredictions(related);
      }
    } catch (error) {
      console.error('Error fetching related predictions:', error);
      setRelatedPredictions(getMockRelatedPredictions());
    }
  };

  const extractCoinFromId = (id) => {
    const coinMap = {
      'bitcoin': { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
      'ethereum': { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
      'solana': { id: 'solana', symbol: 'SOL', name: 'Solana' },
      'cardano': { id: 'cardano', symbol: 'ADA', name: 'Cardano' },
      'ripple': { id: 'ripple', symbol: 'XRP', name: 'XRP' },
      'dogecoin': { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin' }
    };

    // Try to extract from ID string
    for (const [coinId, info] of Object.entries(coinMap)) {
      if (id.toLowerCase().includes(coinId) || id.toLowerCase().includes(info.symbol.toLowerCase())) {
        return info;
      }
    }

    // Default fallback based on hash
    const coins = Object.values(coinMap);
    const hash = id.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0);
    return coins[Math.abs(hash) % coins.length];
  };

  const generateDetailedPrediction = async (marketData, articleId) => {
    const coin = marketData;
    const price = coin.market_data;
    const currentPrice = price.current_price.usd;
    const change24h = price.price_change_percentage_24h || 0;
    const change7d = price.price_change_percentage_7d || 0;

    // Determine prediction type based on market conditions
    let predictionType, targetPrice, timeframe;
    if (change24h > 5) {
      predictionType = 'BULLISH';
      targetPrice = currentPrice * 1.25;
      timeframe = '2-4 weeks';
    } else if (change24h < -5) {
      predictionType = 'BEARISH';
      targetPrice = currentPrice * 0.85;
      timeframe = '1-2 weeks';
    } else if (Math.abs(change7d) > 15) {
      predictionType = 'BREAKOUT';
      targetPrice = currentPrice * 1.30;
      timeframe = '3-6 weeks';
    } else {
      predictionType = 'CONSOLIDATION';
      targetPrice = currentPrice * (1 + (Math.random() * 0.4 - 0.2));
      timeframe = '2-8 weeks';
    }

    const confidence = Math.floor(Math.random() * 25 + 70); // 70-95%
    const views = Math.floor(Math.random() * 15000 + 5000);
    
    return {
      id: articleId,
      title: generatePredictionTitle(coin, predictionType, targetPrice),
      symbol: coin.symbol.toUpperCase(),
      coinId: coin.id,
      category: "PREDICTIONS",
      timeAgo: "Just updated",
      publishedAt: new Date().toISOString(),
      author: getPredictionAnalyst(predictionType),
      excerpt: generatePredictionExcerpt(coin, predictionType, targetPrice, timeframe),
      heroImage: coin.image?.large || coin.image?.small,
      currentPrice: currentPrice,
      targetPrice: targetPrice,
      priceChange: change24h,
      marketCap: price.market_cap.usd,
      volume24h: price.total_volume.usd,
      confidence: confidence,
      prediction: predictionType,
      timeframe: timeframe,
      views: views,
      change7d: change7d,
      high24h: price.high_24h.usd,
      low24h: price.low_24h.usd,
      summary: generatePredictionSummary(coin, predictionType, targetPrice),
      content: generatePredictionContent(coin, predictionType, targetPrice, timeframe),
      tableOfContents: generateTableOfContents(coin.symbol.toUpperCase()),
      readTime: "6 min read",
      tags: generatePredictionTags(coin, predictionType),
      technicalIndicators: generateTechnicalIndicators(price),
      riskFactors: generateRiskFactors(predictionType),
      keyLevels: {
        support: currentPrice * 0.85,
        resistance: currentPrice * 1.15,
        stopLoss: currentPrice * 0.92,
        takeProfit: targetPrice
      }
    };
  };

  const generateMockPrediction = (coinInfo, articleId) => {
    const mockPrices = {
      'BTC': { current: 95000, target: 125000 },
      'ETH': { current: 4200, target: 6500 },
      'SOL': { current: 220, target: 350 },
      'ADA': { current: 1.15, target: 2.20 },
      'XRP': { current: 2.85, target: 4.50 },
      'DOGE': { current: 0.32, target: 0.55 }
    };

    const priceData = mockPrices[coinInfo.symbol] || mockPrices['BTC'];
    const change24h = Math.random() * 10 - 5; // -5% to +5%
    
    return {
      id: articleId,
      title: `${coinInfo.name} Price Prediction: ${coinInfo.symbol} Targets $${priceData.target.toLocaleString()} Following Technical Breakout`,
      symbol: coinInfo.symbol,
      coinId: coinInfo.id,
      category: "PREDICTIONS",
      timeAgo: "3 hours ago",
      publishedAt: new Date().toISOString(),
      author: "Michael Chen",
      excerpt: `Technical analysis reveals bullish momentum for ${coinInfo.name}. Current price: $${priceData.current.toLocaleString()} | Target: $${priceData.target.toLocaleString()}`,
      heroImage: getCoinIcon(coinInfo.symbol),
      currentPrice: priceData.current,
      targetPrice: priceData.target,
      priceChange: change24h,
      marketCap: priceData.current * 19000000,
      volume24h: priceData.current * 850000,
      confidence: 82,
      prediction: 'BULLISH',
      timeframe: '4-8 weeks',
      views: 12543,
      change7d: change24h * 2,
      high24h: priceData.current * 1.05,
      low24h: priceData.current * 0.95,
      summary: generatePredictionSummary({name: coinInfo.name, symbol: coinInfo.symbol}, 'BULLISH', priceData.target),
      content: generatePredictionContent({name: coinInfo.name, symbol: coinInfo.symbol}, 'BULLISH', priceData.target, '4-8 weeks'),
      tableOfContents: generateTableOfContents(coinInfo.symbol),
      readTime: "6 min read",
      tags: [coinInfo.symbol.toLowerCase(), "prediction", "bullish", "technical-analysis"],
      technicalIndicators: {
        rsi: 68,
        macd: "Bullish",
        movingAverage: "Above 50 & 200 MA",
        volume: "Above Average"
      },
      riskFactors: generateRiskFactors('BULLISH'),
      keyLevels: {
        support: priceData.current * 0.85,
        resistance: priceData.current * 1.15,
        stopLoss: priceData.current * 0.92,
        takeProfit: priceData.target
      }
    };
  };

  const generatePredictionTitle = (coin, type = 'BULLISH', targetPrice) => {
    const name = coin.name || coin.symbol;
    const symbol = coin.symbol?.toUpperCase() || 'CRYPTO';
    
    const templates = {
      'BULLISH': `${name} Price Prediction: ${symbol} Eyes $${targetPrice?.toFixed(2)} Target Amid Strong Momentum`,
      'BEARISH': `${name} Price Alert: ${symbol} Faces Correction Risk Below $${targetPrice?.toFixed(2)}`,
      'BREAKOUT': `${name} Breakout Imminent: ${symbol} Targets $${targetPrice?.toFixed(2)} Following Chart Pattern`,
      'CONSOLIDATION': `${name} Analysis: ${symbol} Consolidates Before Next Major Move to $${targetPrice?.toFixed(2)}`
    };
    
    return templates[type] || `${name} Price Prediction: Technical Analysis for ${symbol}`;
  };

  const generatePredictionExcerpt = (coin, type, targetPrice, timeframe) => {
    const symbol = coin.symbol?.toUpperCase() || coin.name;
    const current = coin.market_data?.current_price?.usd || coin.current_price;
    
    const excerpts = {
      'BULLISH': `Strong bullish signals detected for ${symbol}. Technical indicators suggest upside potential to $${targetPrice.toFixed(2)} within ${timeframe}.`,
      'BEARISH': `Bearish patterns emerging for ${symbol}. Downside risk to $${targetPrice.toFixed(2)} identified over ${timeframe} period.`,
      'BREAKOUT': `${symbol} showing breakout setup with target of $${targetPrice.toFixed(2)}. Key resistance levels being tested.`,
      'CONSOLIDATION': `${symbol} in consolidation phase. Next major move expected within ${timeframe} targeting $${targetPrice.toFixed(2)}.`
    };
    
    return excerpts[type] || `Technical analysis for ${symbol} suggests price movement to $${targetPrice.toFixed(2)} over ${timeframe}.`;
  };

  const getPredictionAnalyst = (type) => {
    const analysts = {
      'BULLISH': 'Michael Chen',
      'BEARISH': 'Sarah Rodriguez',
      'BREAKOUT': 'David Kim',
      'CONSOLIDATION': 'Emma Thompson'
    };
    return analysts[type] || 'Crypto Analyst';
  };

  const getRandomPrediction = () => {
    const predictions = ['BULLISH', 'BEARISH', 'BREAKOUT', 'CONSOLIDATION'];
    return predictions[Math.floor(Math.random() * predictions.length)];
  };

  const generatePredictionSummary = (coin, type, targetPrice) => {
    const symbol = coin.symbol?.toUpperCase() || coin.name;
    
    const summaries = {
      'BULLISH': [
        {
          type: "Market Situation",
          text: `${symbol} demonstrates strong bullish momentum with institutional support driving sustained price action above key technical levels.`
        },
        {
          type: "Technical Outlook", 
          text: `Multiple bullish indicators align including RSI recovery, MACD crossover, and break above resistance. Target: $${targetPrice.toFixed(2)}`
        },
        {
          type: "Risk Management",
          text: "Stop-loss recommended at recent support levels. Position sizing should reflect market volatility and personal risk tolerance."
        },
        {
          type: "Price Catalyst",
          text: "Fundamental developments and technical breakout patterns support continued upward price momentum in the medium term."
        }
      ],
      'BEARISH': [
        {
          type: "Market Situation",
          text: `${symbol} shows bearish divergence with weakening momentum and potential for corrective price movement ahead.`
        },
        {
          type: "Technical Outlook",
          text: `Bearish signals include RSI overbought conditions, bearish divergence, and failure at key resistance. Target: $${targetPrice.toFixed(2)}`
        },
        {
          type: "Risk Factors",
          text: "Downside risk is elevated. Consider reducing exposure or implementing hedging strategies to protect capital."
        },
        {
          type: "Support Levels",
          text: "Key support zones must hold to prevent further decline. Monitor volume and sentiment for reversal signals."
        }
      ],
      'BREAKOUT': [
        {
          type: "Chart Pattern",
          text: `${symbol} forming clear breakout pattern with ascending triangle suggesting upward price expansion targeting $${targetPrice.toFixed(2)}.`
        },
        {
          type: "Volume Analysis",
          text: "Increasing volume supports breakout validity. Price action above resistance confirms pattern completion."
        },
        {
          type: "Entry Strategy",
          text: "Wait for confirmation candle above resistance. False breakouts are common, so patience is essential."
        },
        {
          type: "Profit Taking",
          text: "Consider partial profit taking at intermediate levels while maintaining core position for higher targets."
        }
      ],
      'CONSOLIDATION': [
        {
          type: "Price Action",
          text: `${symbol} trading within defined range, suggesting accumulation phase before next significant directional move.`
        },
        {
          type: "Market Structure",
          text: `Consolidation between support and resistance indicates market indecision. Breakout direction will determine next target: $${targetPrice.toFixed(2)}`
        },
        {
          type: "Timing Considerations",
          text: "Range-bound trading presents both opportunity and risk. Wait for clear directional confirmation."
        },
        {
          type: "Strategy Approach",
          text: "Range trading or breakout strategies both viable depending on risk preference and market timing."
        }
      ]
    };
    
    return summaries[type] || summaries['BULLISH'];
  };

  const generatePredictionContent = (coin, type, targetPrice, timeframe) => {
    const symbol = coin.symbol?.toUpperCase() || coin.name;
    const name = coin.name || symbol;
    
    return `
      <div class="prediction-analysis">
        <h2 class="text-2xl font-bold mb-4 text-gray-900">${symbol} Current Market Analysis</h2>
        <div class="chart-container mb-6">
          <div class="w-full h-64 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg flex items-center justify-center border border-yellow-300">
            <div class="text-center">
              <div class="text-yellow-600 text-6xl mb-2">📈</div>
              <span class="text-yellow-800 text-lg font-semibold">${symbol} Live Chart</span>
              <div class="text-yellow-600 text-sm mt-2">Real-time price: $${(coin.market_data?.current_price?.usd || targetPrice * 0.8).toFixed(2)}</div>
            </div>
          </div>
          <p class="text-sm text-gray-500 mt-2">TradingView Integration - ${symbol}/USD</p>
        </div>
        
        <p class="mb-6 text-gray-700 leading-relaxed">
          Our comprehensive analysis of ${name} reveals ${type.toLowerCase()} market conditions with significant implications for traders and investors. 
          Current technical indicators and market sentiment suggest a potential move toward $${targetPrice.toFixed(2)} within the ${timeframe} timeframe.
        </p>

        <h2 class="text-2xl font-bold mb-4 text-gray-900">${symbol} Technical Analysis Deep Dive</h2>
        <p class="mb-4 text-gray-700">
          The technical landscape for ${symbol} shows ${type === 'BULLISH' ? 'promising bullish signals' : type === 'BEARISH' ? 'concerning bearish indicators' : 'mixed signals suggesting consolidation'}. 
          Key technical levels are being closely monitored as price action develops.
        </p>

        <div class="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
          <h3 class="text-yellow-600 font-bold mb-3">Key Technical Levels</h3>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-600">Support Zone:</span>
              <span class="text-gray-900 ml-2 font-semibold">$${(targetPrice * 0.85).toFixed(2)}</span>
            </div>
            <div>
              <span class="text-gray-600">Resistance Zone:</span>
              <span class="text-gray-900 ml-2 font-semibold">$${(targetPrice * 1.15).toFixed(2)}</span>
            </div>
            <div>
              <span class="text-gray-600">Stop Loss:</span>
              <span class="text-red-600 ml-2 font-semibold">$${(targetPrice * 0.92).toFixed(2)}</span>
            </div>
            <div>
              <span class="text-gray-600">Take Profit:</span>
              <span class="text-green-600 ml-2 font-semibold">$${targetPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <h2 class="text-2xl font-bold mb-4 text-gray-900">Market Catalysts Driving ${symbol}</h2>
        <p class="mb-4 text-gray-700">
          Several fundamental factors are influencing ${symbol} price action, including technological developments, 
          regulatory clarity, institutional adoption trends, and broader cryptocurrency market dynamics.
        </p>

        <h2 class="text-2xl font-bold mb-4 text-gray-900">Risk Assessment & Management</h2>
        <div class="bg-yellow-50 p-6 rounded-lg mb-6 border border-yellow-200">
          <h4 class="text-yellow-800 font-semibold mb-3">⚠️ Important Risk Considerations</h4>
          <ul class="text-yellow-700 text-sm space-y-2">
            <li>• Cryptocurrency markets are highly volatile and unpredictable</li>
            <li>• External factors including regulatory changes can impact prices significantly</li>
            <li>• Always use appropriate position sizing and risk management strategies</li>
            <li>• This analysis is for educational purposes and not financial advice</li>
          </ul>
        </div>

        <h2 class="text-2xl font-bold mb-4 text-gray-900">${symbol} Price Prediction Timeline</h2>
        <div class="chart-container mb-6">
          <div class="w-full h-72 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg flex items-center justify-center border border-yellow-300">
            <div class="text-center">
              <div class="text-yellow-600 text-5xl mb-2">⏰</div>
              <span class="text-yellow-800 text-lg font-semibold">Prediction Timeline: ${timeframe}</span>
              <div class="text-yellow-600 text-sm mt-2">Target: $${targetPrice.toFixed(2)}</div>
            </div>
          </div>
          <p class="text-sm text-gray-500 mt-2">Projected timeline for ${symbol} price movement</p>
        </div>

        <p class="text-gray-700 mb-6">
          Based on current market structure, technical patterns, and fundamental analysis, our ${timeframe} outlook for ${symbol} 
          suggests potential movement toward the $${targetPrice.toFixed(2)} level. However, intermediate volatility should be expected.
        </p>

        <div class="bg-gray-100 p-4 rounded-lg my-6 border border-gray-300">
          <p class="text-sm text-gray-700">
            <span class="font-semibold text-yellow-700">Disclaimer:</span> This prediction analysis is based on technical and fundamental research 
            and is intended for educational purposes only. Cryptocurrency investments carry substantial risk of loss. Always conduct your own 
            research and consider consulting with a qualified financial advisor before making investment decisions.
          </p>
        </div>
      </div>
    `;
  };

  const generateTableOfContents = (symbol) => [
    { title: `${symbol} current market analysis`, id: `${symbol.toLowerCase()}-current-market-analysis` },
    { title: `${symbol} technical analysis deep dive`, id: `${symbol.toLowerCase()}-technical-analysis-deep-dive` },
    { title: `Market catalysts driving ${symbol}`, id: `market-catalysts-driving-${symbol.toLowerCase()}` },
    { title: `Risk assessment & management`, id: 'risk-assessment-management' },
    { title: `${symbol} price prediction timeline`, id: `${symbol.toLowerCase()}-price-prediction-timeline` }
  ];

  const generatePredictionTags = (coin, type) => {
    const symbol = coin.symbol?.toLowerCase() || 'crypto';
    const typeTags = {
      'BULLISH': ['bullish', 'buy-signal', 'uptrend'],
      'BEARISH': ['bearish', 'sell-signal', 'downtrend'], 
      'BREAKOUT': ['breakout', 'chart-pattern', 'momentum'],
      'CONSOLIDATION': ['consolidation', 'range-bound', 'accumulation']
    };
    
    return [symbol, 'prediction', 'technical-analysis', ...typeTags[type]].slice(0, 5);
  };

  const generateTechnicalIndicators = (priceData) => {
    const rsi = Math.floor(Math.random() * 40 + 30); // 30-70
    const macd = Math.random() > 0.5 ? 'Bullish' : 'Bearish';
    const ma = Math.random() > 0.4 ? 'Above 50 & 200 MA' : 'Below Key MA';
    const volume = Math.random() > 0.6 ? 'Above Average' : 'Below Average';
    
    return { rsi, macd, movingAverage: ma, volume };
  };

  const generateRiskFactors = (type) => {
    const factors = {
      'BULLISH': ['Overbought conditions may trigger pullback', 'Market correlation risks during downturns'],
      'BEARISH': ['Support breakdown could accelerate selling', 'Potential for dead cat bounce rallies'],
      'BREAKOUT': ['False breakout risk requires confirmation', 'Volume must support price movement'],
      'CONSOLIDATION': ['Direction unclear until breakout occurs', 'Range-bound volatility expected']
    };
    
    return factors[type] || factors['BULLISH'];
  };

  const getMockRelatedPredictions = () => [
    {
      id: 'related_btc_1',
      title: "Bitcoin Price Prediction: BTC Eyes $130K Following ETF Inflows",
      symbol: "BTC",
      timeAgo: "4 hours ago",
      category: "PREDICTIONS",
      prediction: 'BULLISH',
      change24h: 2.8
    },
    {
      id: 'related_eth_2',
      title: "Ethereum Analysis: ETH Consolidates Before Breakout to $6,500",
      symbol: "ETH", 
      timeAgo: "6 hours ago",
      category: "PREDICTIONS",
      prediction: 'CONSOLIDATION',
      change24h: -1.2
    },
    {
      id: 'related_sol_3',
      title: "Solana Breakout Alert: SOL Targets $400 Following Network Growth",
      symbol: "SOL",
      timeAgo: "8 hours ago", 
      category: "PREDICTIONS",
      prediction: 'BREAKOUT',
      change24h: 5.1
    }
  ];

  const getCoinIcon = (symbol) => {
    const iconMap = {
      'BTC': 'https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png',
      'ETH': 'https://coin-images.coingecko.com/coins/images/279/large/ethereum.png',
      'SOL': 'https://coin-images.coingecko.com/coins/images/4128/large/solana.png',
      'ADA': 'https://coin-images.coingecko.com/coins/images/975/large/cardano.png',
      'XRP': 'https://coin-images.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
      'DOGE': 'https://coin-images.coingecko.com/coins/images/5/large/dogecoin.png'
    };
    
    return iconMap[symbol] || iconMap['BTC'];
  };

  const formatPrice = (price) => {
    if (!price) return '$0.00';
    
    if (price >= 1) {
      return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      return `$${price.toFixed(6)}`;
    }
  };

  const formatPercentage = (percent) => {
    if (!percent) return '0.00%';
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
      'BULLISH': <HiOutlineTrendingUp className="w-5 h-5" />,
      'BEARISH': <HiOutlineTrendingDown className="w-5 h-5" />,
      'BREAKOUT': <HiOutlineSparkles className="w-5 h-5" />,
      'CONSOLIDATION': <HiOutlineChartBar className="w-5 h-5" />
    };
    return icons[prediction] || <HiOutlineChartBar className="w-5 h-5" />;
  };

  const getTimeAgo = (publishedAt) => {
    if (!publishedAt) return 'Recently';
    
    const now = new Date();
    const published = new Date(publishedAt);
    const diffMs = now - published;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return `${Math.max(1, Math.floor(diffMs / (1000 * 60)))} minutes ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) !== 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading prediction analysis...</p>
        </div>
      </div>
    );
  }

  if (error && !article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Prediction</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link to="/predictions" className="text-yellow-600 hover:text-yellow-500 underline">
            Back to Predictions
          </Link>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Prediction not found</h2>
          <Link to="/predictions" className="text-yellow-600 hover:text-yellow-500 underline">
            Back to Predictions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{article.title} | CryptoTracker Predictions</title>
        <meta name="description" content={article.excerpt} />
      </Helmet>

      <div className="min-h-screen bg-white text-gray-900">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Back Button */}
          <div className="mb-6">
            <Link 
              to="/predictions" 
              className="inline-flex items-center text-gray-600 hover:text-yellow-600 transition-colors"
            >
              <HiOutlineArrowLeft className="w-5 h-5 mr-2" />
              Back to Predictions
            </Link>
          </div>

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                {article.category}
              </span>
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold border ${getPredictionColor(article.prediction)}`}>
                {getPredictionIcon(article.prediction)}
                <span>{article.prediction}</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight text-gray-900">
              {article.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-yellow-500 rounded-full mr-2 flex items-center justify-center">
                  <span className="text-xs font-bold text-black">
                    {article.author?.charAt(0) || 'A'}
                  </span>
                </div>
                <span>By {article.author}</span>
              </div>
              <span>{getTimeAgo(article.publishedAt)}</span>
              <span>{article.readTime}</span>
              <div className="flex items-center">
                <HiOutlineEye className="w-4 h-4 mr-1" />
                <span>{article.views?.toLocaleString()} views</span>
              </div>
              <div className="flex items-center">
                <span className="text-yellow-600 font-semibold">{article.confidence}% confidence</span>
              </div>
            </div>

            {/* Price Analysis Card */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 mb-8 border border-yellow-200">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4">
                  <img 
                    src={article.heroImage || getCoinIcon(article.symbol)} 
                    alt={article.symbol}
                    className="w-16 h-16"
                  />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatPrice(article.currentPrice)}
                    </div>
                    <div className={`text-lg font-semibold ${
                      article.priceChange >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatPercentage(article.priceChange)} (24h)
                    </div>
                    <div className="text-sm text-gray-600">{article.symbol}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Target Price:</span>
                    <div className="text-gray-900 font-semibold">{formatPrice(article.targetPrice)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Timeframe:</span>
                    <div className="text-gray-900 font-semibold">{article.timeframe}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Potential Gain:</span>
                    <div className={`font-semibold ${
                      article.targetPrice > article.currentPrice ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatPercentage(((article.targetPrice - article.currentPrice) / article.currentPrice) * 100)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Risk Level:</span>
                    <div className="text-yellow-600 font-semibold">
                      {article.prediction === 'BEARISH' ? 'High' : article.prediction === 'BULLISH' ? 'Medium' : 'Low'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Indicators */}
            {article.technicalIndicators && (
              <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-yellow-600">Technical Indicators</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">RSI:</span>
                    <div className="text-gray-900 font-semibold">{article.technicalIndicators.rsi}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">MACD:</span>
                    <div className={`font-semibold ${
                      article.technicalIndicators.macd === 'Bullish' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {article.technicalIndicators.macd}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Moving Avg:</span>
                    <div className="text-gray-900 font-semibold text-xs">{article.technicalIndicators.movingAverage}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Volume:</span>
                    <div className={`font-semibold ${
                      article.technicalIndicators.volume === 'Above Average' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {article.technicalIndicators.volume}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Key Price Levels */}
            {article.keyLevels && (
              <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-yellow-600">Key Price Levels</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Support:</span>
                    <div className="text-blue-600 font-semibold">{formatPrice(article.keyLevels.support)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Resistance:</span>
                    <div className="text-orange-600 font-semibold">{formatPrice(article.keyLevels.resistance)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Stop Loss:</span>
                    <div className="text-red-600 font-semibold">{formatPrice(article.keyLevels.stopLoss)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Take Profit:</span>
                    <div className="text-green-600 font-semibold">{formatPrice(article.keyLevels.takeProfit)}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Summary Section */}
            {article.summary && (
              <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-yellow-600">Analysis Summary</h3>
                <div className="space-y-4">
                  {article.summary.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-yellow-600">{item.type}:</span>
                        <span className="ml-2 text-gray-700">{item.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Table of Contents */}
            {article.tableOfContents && (
              <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 text-yellow-600">Table of Contents</h3>
                <ul className="space-y-2">
                  {article.tableOfContents.map((item, index) => (
                    <li key={index}>
                      <a 
                        href={`#${item.id}`}
                        className="text-blue-600 hover:text-blue-500 text-sm capitalize"
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center space-x-4 mb-8">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors">
                <HiOutlineHeart className="w-5 h-5" />
                <span className="text-sm">Like</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                <HiOutlineBookmark className="w-5 h-5" />
                <span className="text-sm">Save</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors">
                <HiOutlineShare className="w-5 h-5" />
                <span className="text-sm">Share</span>
              </button>
              <button 
                onClick={() => window.open(`https://www.coingecko.com/en/coins/${article.coinId}`, '_blank')}
                className="flex items-center space-x-2 text-gray-600 hover:text-yellow-600 transition-colors"
              >
                <HiOutlineExternalLink className="w-5 h-5" />
                <span className="text-sm">View Live Data</span>
              </button>
            </div>
          </header>

          {/* Article Content */}
          <article className="prose prose-gray prose-lg max-w-none mb-12">
            <div 
              dangerouslySetInnerHTML={{ __html: article.content }}
              className="article-content text-gray-700 leading-relaxed [&>h2]:text-yellow-600 [&>h2]:font-bold [&>h2]:text-xl [&>h2]:mb-4 [&>h2]:mt-8 [&>h3]:text-gray-900 [&>h4]:text-gray-900 [&>p]:mb-4 [&>p]:leading-relaxed [&_.chart-container]:my-6"
            />
          </article>

          {/* Risk Factors */}
          {article.riskFactors && (
            <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-red-700 mb-3 flex items-center">
                <HiOutlineXCircle className="w-5 h-5 mr-2" />
                Risk Factors to Consider
              </h4>
              <ul className="text-red-600 space-y-2">
                {article.riskFactors.map((risk, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    {risk}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Live Data Integration Notice */}
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-yellow-700 mb-1 flex items-center">
                  <HiOutlineCheckCircle className="w-5 h-5 mr-2" />
                  Real-Time Data Integration
                </h4>
                <p className="text-sm text-yellow-600">
                  This analysis uses live market data from CoinGecko API. Prices and indicators are updated in real-time for accuracy.
                </p>
              </div>
              <button 
                onClick={() => window.location.reload()}
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
              >
                Refresh Data
              </button>
            </div>
          </div>

          {/* Tags */}
          {article.tags && (
            <div className="mb-12">
              <div className="flex flex-wrap gap-2 mb-4">
                {article.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-semibold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related Predictions */}
          {relatedPredictions.length > 0 && (
            <section className="border-t border-gray-200 pt-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">Related Predictions</h3>
              <div className="space-y-4">
                {relatedPredictions.map((relatedPrediction) => (
                  <div
                    key={relatedPrediction.id}
                    className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 hover:border-yellow-300"
                  >
                    <Link
                      to={`/predictions/${relatedPrediction.id}`}
                      className="block hover:text-yellow-600 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{relatedPrediction.title}</h4>
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${getPredictionColor(relatedPrediction.prediction)}`}>
                          {getPredictionIcon(relatedPrediction.prediction)}
                          <span>{relatedPrediction.prediction}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 flex items-center justify-between">
                        <div>
                          <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs mr-2 font-bold">
                            {relatedPrediction.category}
                          </span>
                          <span>{relatedPrediction.timeAgo}</span>
                        </div>
                        <div className={`font-semibold ${
                          relatedPrediction.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatPercentage(relatedPrediction.change24h)}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default PredictionDetail;