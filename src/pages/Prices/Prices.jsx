import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  HiOutlineSearch, 
  HiOutlineAdjustments, 
  HiOutlineTrendingUp,
  HiOutlineTrendingDown,
  HiOutlineChartBar
} from 'react-icons/hi';
import PriceTable from '../../components/PriceTable/PriceTable';
import { useCryptoData, useMarketStats } from '../../hooks/useCryptoData';
import { formatMarketCap, formatVolume, formatPercentage } from '../../utils/formatters';
import Loading from '../../components/Common/Loading';

const Prices = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('market_cap_rank');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const itemsPerPage = 50;

  // Fetch crypto data
  const { 
    data: cryptoData = [], 
    isLoading, 
    error 
  } = useCryptoData(currentPage, itemsPerPage, sortBy);

  // Fetch market stats
  const { data: marketStats, isLoading: statsLoading } = useMarketStats();

  // Filter data based on search and category
  const filteredData = useMemo(() => {
    let filtered = cryptoData;

    if (searchQuery) {
      filtered = filtered.filter(coin => 
        coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [cryptoData, searchQuery, selectedCategory]);

  const categories = [
    { id: 'all', name: 'All', icon: HiOutlineChartBar },
    { id: 'gainers', name: 'Top Gainers', icon: HiOutlineTrendingUp },
    { id: 'losers', name: 'Top Losers', icon: HiOutlineTrendingDown },
  ];

  const sortOptions = [
    { value: 'market_cap_rank', label: 'Market Cap' },
    { value: 'price', label: 'Price' },
    { value: '24h_change', label: '24h Change' },
    { value: 'volume', label: 'Volume' },
    { value: 'name', label: 'Name' },
  ];

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <HiOutlineChartBar className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-black mb-2">Unable to load price data</h2>
          <p className="text-gray-600 mb-4">Please try again later</p>
          <button 
            onClick={() => window.location.reload()} 
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 bg-yellow-400 text-black hover:bg-yellow-500 border-2 border-yellow-400 hover:border-yellow-500"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Cryptocurrency Prices Today | Live Crypto Market Data</title>
        <meta name="description" content="Live cryptocurrency prices today with real-time market data. Track Bitcoin, Ethereum and top crypto prices with 24h changes and market cap." />
        <meta name="keywords" content="cryptocurrency prices today, crypto prices, bitcoin price, ethereum price, live crypto market" />
      </Helmet>

      <div className="min-h-screen bg-white pt-6 pb-20">
        <div className="container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-black">
                  Crypto <span style={{ color: '#FFD700' }}>Prices Today</span>
                </h1>
                <p className="text-gray-600 text-lg">
                  Live cryptocurrency prices and market data
                </p>
              </div>

              {/* Market Stats */}
              {!statsLoading && marketStats && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 lg:mt-0">
                  <div className="text-center lg:text-right">
                    <div className="text-2xl font-bold" style={{ color: '#FFD700' }}>
                      {formatMarketCap(marketStats.totalMarketCap)}
                    </div>
                    <div className="text-sm text-gray-500">Market Cap</div>
                  </div>
                  <div className="text-center lg:text-right">
                    <div className="text-2xl font-bold text-yellow-500">
                      {formatVolume(marketStats.total24hVolume)}
                    </div>
                    <div className="text-sm text-gray-500">24h Volume</div>
                  </div>
                  <div className="text-center lg:text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {marketStats.gainers}
                    </div>
                    <div className="text-sm text-gray-500">Gainers</div>
                  </div>
                  <div className="text-center lg:text-right">
                    <div className="text-2xl font-bold text-red-600">
                      {marketStats.losers}
                    </div>
                    <div className="text-sm text-gray-500">Losers</div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Filters and Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search cryptocurrencies..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full px-3 py-2 pl-10 bg-white border-2 border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-yellow-400 text-black border-2 border-yellow-400'
                        : 'bg-white text-black border-2 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <category.icon className="w-4 h-4 mr-2" />
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Sort Options */}
              <div className="flex items-center space-x-2">
                <HiOutlineAdjustments className="w-5 h-5 text-black" />
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-3 py-2 bg-white border-2 border-gray-300 rounded-lg text-black font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Price Data Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden"
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loading size="lg" text="Loading price data..." />
              </div>
            ) : (
              <PriceTable
                data={filteredData}
                isLoading={isLoading}
                showPagination={true}
                currentPage={currentPage}
                totalPages={Math.ceil(1000 / itemsPerPage)} // Approximate
                onPageChange={handlePageChange}
              />
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Prices;