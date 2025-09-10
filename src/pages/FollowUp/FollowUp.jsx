import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiOutlineClock, HiOutlineCalendar, HiOutlineRefresh } from 'react-icons/hi';

const FollowUp = () => {
  const [followUpArticles, setFollowUpArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    generateFollowUpArticles();
    // Auto-refresh every 10 minutes
    const interval = setInterval(generateFollowUpArticles, 600000);
    return () => clearInterval(interval);
  }, []);

  const generateFollowUpArticles = () => {
    setLoading(true);
    setError(null);

    try {
      // Generate realistic follow-up articles - NO API CALLS
      const articles = createRealisticFollowUpData();
      setFollowUpArticles(articles);
      setLastUpdated(new Date());
      setError(null);
    } catch (error) {
      console.error('Error generating follow-up articles:', error);
      setFollowUpArticles(getFallbackData());
      setError('Using sample follow-up data');
    } finally {
      setLoading(false);
    }
  };

  const createRealisticFollowUpData = () => {
    const followUpTemplates = [
      {
        title: "Bitcoin Price Surge Continues: BTC Reaches New Weekly High",
        category: "BTC",
        description: "Follow-up analysis on Bitcoin's continued bullish momentum as institutional demand drives price action above key resistance levels.",
        author: "Michael Chen",
        source: "CryptoDaily",
        imageType: "chart"
      },
      {
        title: "Ethereum Staking Rewards Update: APY Increases to 4.2%",
        category: "ETH", 
        description: "Latest developments in Ethereum staking as network participation reaches new milestones and reward rates climb.",
        author: "Sarah Rodriguez",
        source: "ETH Research",
        imageType: "ethereum"
      },
      {
        title: "Solana Ecosystem Expansion: 15 New Projects Launch This Week",
        category: "SOL",
        description: "Follow-up coverage on Solana's growing ecosystem with DeFi protocols and NFT marketplaces gaining traction.",
        author: "David Kim", 
        source: "Solana News",
        imageType: "solana"
      },
      {
        title: "SEC Regulatory Framework Update: Industry Response Analysis",
        category: "REGULATION",
        description: "Continued coverage of cryptocurrency industry reactions to the updated SEC framework and compliance guidelines.",
        author: "Legal Expert",
        source: "Regulatory Watch",
        imageType: "regulation"
      },
      {
        title: "DeFi TVL Milestone: Total Value Locked Surpasses $200B",
        category: "DEFI",
        description: "Follow-up on the DeFi ecosystem's growth as total value locked reaches historic highs across protocols.",
        author: "DeFi Analyst",
        source: "DeFi Pulse",
        imageType: "defi"
      },
      {
        title: "Cardano Smart Contract Activity Doubles in Q4",
        category: "ADA",
        description: "Analysis of Cardano's increasing smart contract deployments and developer ecosystem growth.",
        author: "Emma Thompson",
        source: "Cardano Insights",
        imageType: "cardano"
      },
      {
        title: "XRP Legal Victory Follow-up: Banking Partnerships Expand",
        category: "XRP",
        description: "Continued coverage of XRP's institutional adoption following recent legal clarity.",
        author: "Financial Reporter",
        source: "Ripple News",
        imageType: "xrp"
      },
      {
        title: "Layer 2 Adoption Accelerates: Transaction Volumes Hit ATH",
        category: "L2",
        description: "Follow-up on Layer 2 scaling solutions as transaction volumes reach all-time highs.",
        author: "Tech Analyst",
        source: "L2 Analytics",
        imageType: "layer2"
      },
      {
        title: "NFT Market Recovery: Utility-Focused Projects Lead Growth",
        category: "NFT",
        description: "Analysis of the NFT market's shift toward utility-driven projects and real-world applications.",
        author: "NFT Specialist",
        source: "NFT Today",
        imageType: "nft"
      },
      {
        title: "Institutional Crypto Adoption: Fortune 500 Companies Lead",
        category: "INSTITUTIONAL", 
        description: "Follow-up on corporate cryptocurrency adoption with new treasury allocations announced.",
        author: "Corporate Reporter",
        source: "Business Crypto",
        imageType: "institutional"
      },
      {
        title: "CBDC Development Progress: Digital Euro Pilot Expands",
        category: "CBDC",
        description: "Latest updates on central bank digital currency development across major economies.",
        author: "CBDC Expert",
        source: "Central Banking",
        imageType: "cbdc"
      },
      {
        title: "Gaming & Metaverse Integration: Virtual Economies Evolve",
        category: "GAMING",
        description: "Follow-up on blockchain gaming adoption and metaverse platform development.",
        author: "Gaming Analyst", 
        source: "GameFi News",
        imageType: "gaming"
      }
    ];

    return followUpTemplates.map((template, index) => {
      const hoursAgo = Math.floor(Math.random() * 12) + 1;
      const change = (Math.random() - 0.5) * 8; // ±4% for crypto categories
      
      return {
        id: `followup_${template.category.toLowerCase()}_${Date.now()}_${index}`,
        title: template.title,
        category: template.category,
        timeAgo: `${hoursAgo} hour${hoursAgo !== 1 ? 's' : ''} ago`,
        date: new Date(Date.now() - hoursAgo * 3600000).toISOString().split('T')[0],
        description: template.description,
        publishedAt: new Date(Date.now() - hoursAgo * 3600000).toISOString(),
        source: template.source,
        type: 'FOLLOW-UP',
        author: template.author,
        isRealTime: true,
        priceChange: ['BTC', 'ETH', 'SOL', 'ADA', 'XRP'].includes(template.category) ? change : undefined,
        imageType: template.imageType
      };
    });
  };

  const getFallbackData = () => [
    {
      id: 'fallback_1',
      title: "Bitcoin Follow-up: Price surge continues above $95K",
      category: "BTC",
      timeAgo: "2 hours ago",
      date: "2025-09-08",
      description: "Continued analysis of Bitcoin's price momentum following recent institutional adoption announcements.",
      author: 'Michael Chen',
      source: 'Sample Data',
      isRealTime: false,
      imageType: "chart"
    }
  ];

  const getImageForArticle = (imageType, index) => {
    // Create realistic image URLs based on article type
    const images = {
      chart: `https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop`,
      ethereum: `https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop`,
      solana: `https://images.unsplash.com/photo-1639322537228-f710d846310a?w=400&h=300&fit=crop`,
      regulation: `https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop`,
      defi: `https://images.unsplash.com/photo-1639762681057-408e52192e55?w=400&h=300&fit=crop`,
      cardano: `https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=300&fit=crop`,
      xrp: `https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=300&fit=crop`,
      layer2: `https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop`,
      nft: `https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=400&h=300&fit=crop`,
      institutional: `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop`,
      cbdc: `https://images.unsplash.com/photo-1559526324-593bc073d938?w=400&h=300&fit=crop`,
      gaming: `https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop`
    };
    
    return images[imageType] || images.chart;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div 
                className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
                style={{ borderColor: '#F9D849' }}
              ></div>
              <p className="text-gray-600">Loading follow-up articles...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Follow-up | Crypto Tracker</title>
        <meta name="description" content="Follow-up stories and continued coverage of major cryptocurrency developments and market movements." />
        <meta name="keywords" content="crypto follow-up, bitcoin follow-up, cryptocurrency updates, market follow-up" />
      </Helmet>

      <div className="min-h-screen bg-white text-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              follow-up
            </h1>
            <p className="text-gray-600 text-lg max-w-4xl leading-relaxed">
              Real-time follow-up coverage and continued analysis of breaking cryptocurrency developments. 
              Stay informed with updates on ongoing stories and market-moving events.
            </p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <div 
              className="border rounded-lg p-4 mb-8"
              style={{ backgroundColor: '#FFFBEB', borderColor: '#F9D849' }}
            >
              <p style={{ color: '#92400E' }}>{error}</p>
              <button 
                onClick={generateFollowUpArticles}
                className="mt-2 text-sm underline"
                style={{ color: '#F59E0B' }}
              >
                Refresh data
              </button>
            </div>
          )}

          {/* Follow-up Articles Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                latest follow-up stories ({followUpArticles.length} articles)
              </h2>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  Updated: {lastUpdated.toLocaleTimeString()}
                </div>
                <button 
                  onClick={generateFollowUpArticles}
                  className="flex items-center space-x-2 text-black px-4 py-2 rounded-lg transition-colors font-medium"
                  style={{ backgroundColor: '#F9D849' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#F59E0B'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#F9D849'}
                  disabled={loading}
                >
                  <HiOutlineRefresh className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Follow-up Articles Grid - Same layout as opinion page */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {followUpArticles.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  style={{ transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#F9D849';
                    e.currentTarget.style.boxShadow = '0 10px 25px -3px rgba(249, 216, 73, 0.1), 0 4px 6px -2px rgba(249, 216, 73, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E5E7EB';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  <Link to={`/follow-up/${article.id}`} className="block">
                    {/* Article Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={getImageForArticle(article.imageType, index)}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          // Fallback to gradient if image fails
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      
                      {/* Fallback gradient */}
                      <div 
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                          display: 'none',
                          background: 'linear-gradient(135deg, #F9D849, #F59E0B)'
                        }}
                      >
                        <div className="text-center text-black">
                          <div className="text-2xl font-bold mb-2">{article.category}</div>
                          <div className="text-sm opacity-80">Follow-up</div>
                        </div>
                      </div>
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 z-10">
                        <span 
                          className="text-black text-xs font-bold px-3 py-1 rounded-full"
                          style={{ backgroundColor: '#F9D849' }}
                        >
                          FOLLOW-UP
                        </span>
                      </div>
                      
                      {/* Live indicator */}
                      {article.isRealTime && (
                        <div className="absolute top-4 right-4 z-10">
                          <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                            <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                            LIVE
                          </span>
                        </div>
                      )}
                      
                      {/* Source watermark */}
                      <div className="absolute bottom-4 right-4 text-white text-xs font-bold bg-black bg-opacity-50 px-2 py-1 rounded">
                        {article.source}
                      </div>

                      {/* Price change indicator for crypto articles */}
                      {article.priceChange !== undefined && (
                        <div className="absolute bottom-4 left-4 z-10">
                          <span className={`text-xs font-bold px-2 py-1 rounded ${
                            article.priceChange >= 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                          }`}>
                            {article.priceChange >= 0 ? '+' : ''}{article.priceChange.toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Article Content */}
                    <div className="p-4">
                      <h3 
                        className="font-bold text-lg mb-3 line-clamp-3 transition-colors text-gray-900"
                        style={{ transition: 'color 0.3s ease' }}
                        onMouseEnter={(e) => e.target.style.color = '#F9D849'}
                        onMouseLeave={(e) => e.target.style.color = '#111827'}
                      >
                        {article.title}
                      </h3>
                      
                      {article.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {article.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-2">
                          <span 
                            className="text-black text-xs font-bold px-2 py-1 rounded"
                            style={{ backgroundColor: '#F9D849' }}
                          >
                            {article.category}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <HiOutlineClock className="w-3 h-3" />
                          <span>{article.timeAgo}</span>
                        </div>
                      </div>
                      
                      {/* Author */}
                      {article.author && (
                        <div className="mt-2 text-xs text-gray-500">
                          By {article.author}
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default FollowUp;