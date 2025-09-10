import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  HiOutlineTrendingUp, 
  HiOutlineNewspaper, 
  HiOutlineChartBar,
  HiOutlineGlobeAlt,
  HiOutlineArrowRight
} from 'react-icons/hi';

import PriceTable from '../../components/PriceTable/PriceTable';
import NewsSection from '../../components/NewsSection/NewsSection';
import { useCryptoData } from '../../hooks/useCryptoData';

const Home = () => {
  const { data: topCoins = [], isLoading } = useCryptoData(1, 10);

  const features = [
    {
      icon: HiOutlineTrendingUp,
      title: 'Real-time Prices',
      description: 'Live cryptocurrency prices updated every 30 seconds',
      color: 'text-green-600'
    },
    {
      icon: HiOutlineChartBar,
      title: 'Market Analysis',
      description: 'Comprehensive market cap and volume data',
      color: 'text-yellow-500'
    },
    {
      icon: HiOutlineNewspaper,
      title: 'Latest News',
      description: 'Stay updated with breaking crypto news',
      color: 'text-yellow-600'
    },
    {
      icon: HiOutlineGlobeAlt,
      title: 'Global Markets',
      description: 'Track cryptocurrencies from around the world',
      color: 'text-gray-700'
    }
  ];

  const stats = [
    { label: 'Cryptocurrencies', value: '2,000+' },
    { label: 'Market Cap', value: '$1.2T+' },
    { label: 'Daily Volume', value: '$50B+' },
    { label: 'Active Users', value: '10K+' }
  ];

  return (
    <>
      <Helmet>
        <title>CryptoTracker - Real-time Cryptocurrency Market Data</title>
        <meta name="description" content="Track Bitcoin, Ethereum and thousands of cryptocurrencies with real-time prices, charts and market analysis. Your ultimate crypto market companion." />
        <meta name="keywords" content="cryptocurrency, bitcoin, ethereum, crypto prices, market cap, trading, blockchain" />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden bg-white">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 via-white to-gray-50/50" />
          
          <div className="container relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">Track Crypto</span>
                <br />
                <span className="text-black">Like a Pro</span>
              </h1>
              
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Real-time cryptocurrency market data, prices, charts, and news. 
                Stay ahead of the market with CryptoTracker.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link to="/prices" className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg transition-all duration-200 bg-yellow-400 text-black hover:bg-yellow-500 border-2 border-yellow-400 hover:border-yellow-500">
                  <HiOutlineChartBar className="w-5 h-5 mr-2" />
                  View Markets
                </Link>
                <Link to="/news" className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg transition-all duration-200 bg-white text-black hover:bg-gray-50 border-2 border-gray-300 hover:border-gray-400">
                  <HiOutlineNewspaper className="w-5 h-5 mr-2" />
                  Latest News
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                    className="text-center"
                  >
                    <div className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <div className="text-gray-600 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Floating elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-200/30 rounded-full blur-xl animate-float" />
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-yellow-100/50 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
                Why Choose <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">CryptoTracker</span>?
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Everything you need to stay informed about the cryptocurrency market
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center hover:border-yellow-400 hover:shadow-lg transition-all duration-200"
                >
                  <div className={`w-12 h-12 ${feature.color} mx-auto mb-4`}>
                    <feature.icon className="w-full h-full" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-black">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Top Cryptocurrencies Section */}
        <section className="py-20 bg-gray-50">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-12"
            >
              <div>
                <h2 className="text-3xl font-bold mb-2 text-black">
                  Top <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">Cryptocurrencies</span>
                </h2>
                <p className="text-gray-600">
                  Market leaders by market capitalization
                </p>
              </div>
              <Link
                to="/prices"
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 text-gray-700 hover:text-yellow-500 hover:bg-gray-100 group"
              >
                View All Prices
                <HiOutlineArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <PriceTable 
                data={topCoins} 
                isLoading={isLoading} 
                showPagination={false}
                maxRows={10}
              />
            </motion.div>
          </div>
        </section>

        {/* News Section */}
        <section className="py-20 bg-white">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-12"
            >
              <div>
                <h2 className="text-3xl font-bold mb-2 text-black">
                  Latest <span style={{ background: 'linear-gradient(to right, #FFD700, #FFD700)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Crypto News</span>
                </h2>
                <p className="text-gray-600">
                  Stay updated with the latest market developments
                </p>
              </div>
              <Link
                to="/news"
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 text-gray-700 hover:text-yellow-500 hover:bg-gray-100 group"
              >
                All News
                <HiOutlineArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <NewsSection maxItems={6} showPagination={false} />
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-yellow-50 to-yellow-100">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-4xl font-bold mb-6 text-black">
                Ready to start tracking crypto?
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                Join thousands of traders and investors who trust CryptoTracker 
                for real-time market data and insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/prices" className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg transition-all duration-200 bg-yellow-400 text-black hover:bg-yellow-500 border-2 border-yellow-400 hover:border-yellow-500">
                  Explore Prices
                </Link>
                <Link to="/news" className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg transition-all duration-200 bg-white text-black hover:bg-gray-50 border-2 border-gray-300 hover:border-gray-400">
                  Read News
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;