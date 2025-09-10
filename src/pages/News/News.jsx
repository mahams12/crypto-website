import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useParams, useLocation, Link } from 'react-router-dom';
import { 
  HiOutlineNewspaper, 
  HiOutlineFilter, 
  HiOutlineSearch,
  HiOutlineTag
} from 'react-icons/hi';
import NewsCard from '../../components/NewsSection/NewsCard';
import { SkeletonNews } from '../../components/Common/Loading';
import { newsService } from '../../services/api';

const News = () => {
  const { category } = useParams();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Get category from URL params or default to 'all'
  const selectedCategory = category || 'all';
  
  const itemsPerPage = 12;

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Fetch news data based on selected category
  const { data: newsData, isLoading, error } = useQuery({
    queryKey: ['news', currentPage, itemsPerPage, selectedCategory],
    queryFn: () => newsService.getNews(currentPage, itemsPerPage, selectedCategory === 'all' ? null : selectedCategory),
    staleTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true,
  });

  const news = newsData?.data?.data || [];
  const totalPages = newsData?.data?.total_pages || 1;

  // Define categories that match crypto.news structure
  const categories = [
    { name: 'all', label: 'ALL', href: '/news' },
    { name: 'bitcoin', label: 'BITCOIN', href: '/news/category/bitcoin' },
    { name: 'blockchain', label: 'BLOCKCHAIN', href: '/news/category/blockchain' },
    { name: 'ethereum', label: 'ETHEREUM', href: '/news/category/ethereum' },
    { name: 'defi', label: 'DEFI', href: '/news/category/defi' },
    { name: 'altcoins', label: 'ALTCOIN', href: '/news/category/altcoins' },
    { name: 'regulation', label: 'REGULATION', href: '/news/category/regulation' },
    { name: 'solana', label: 'SOLANA', href: '/news/category/solana' },
    { name: 'shiba-inu', label: 'SHIBA INU', href: '/news/category/shiba-inu' }
  ];

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCategoryTitle = () => {
    if (selectedCategory === 'all') return 'Latest Crypto News';
    const categoryData = categories.find(cat => cat.name === selectedCategory);
    return categoryData ? `${categoryData.label} News` : 'Crypto News';
  };

  const getCategoryDescription = () => {
    if (selectedCategory === 'all') return 'Stay updated with the latest cryptocurrency news and market insights';
    const categoryData = categories.find(cat => cat.name === selectedCategory);
    return categoryData ? `Latest news and updates about ${categoryData.label.toLowerCase()}` : 'Cryptocurrency news and analysis';
  };

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-yellow-500 mb-4">
            <HiOutlineNewspaper className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to load news</h2>
          <p className="text-gray-600 mb-4">Please try again later</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-6 py-3 rounded-lg transition-colors"
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
        <title>{getCategoryTitle()} | crypto.news</title>
        <meta name="description" content={getCategoryDescription()} />
        <meta name="keywords" content="cryptocurrency news, bitcoin news, ethereum news, crypto analysis, blockchain news" />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Secondary Navigation Bar - Yellow Theme */}
        <div className="bg-yellow-400 border-b-2 border-yellow-500">
          <div className="container mx-auto px-4">
            <div className="flex items-center space-x-6 py-4 overflow-x-auto">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  to={cat.href}
                  className={`text-sm font-bold whitespace-nowrap px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === cat.name
                      ? 'text-white bg-black shadow-lg'
                      : 'text-black hover:text-white hover:bg-black'
                  }`}
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-3 text-black">
                  {getCategoryTitle()}
                </h1>
                <p className="text-gray-700 text-lg font-medium">
                  {getCategoryDescription()}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 mb-8 shadow-sm"
          >
            <div className="flex items-center">
              <div className="flex-1">
                <div className="relative">
                  <HiOutlineSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder={`Search ${selectedCategory === 'all' ? 'all' : selectedCategory} news...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* News Grid */}
          {isLoading ? (
            <SkeletonNews count={itemsPerPage} />
          ) : news.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
            >
              {news
                .filter(article => {
                  if (!searchQuery) return true;
                  return article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (article.description && article.description.toLowerCase().includes(searchQuery.toLowerCase()));
                })
                .map((article, index) => (
                  <motion.div
                    key={article.id || article.url}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <NewsCard article={article} />
                  </motion.div>
                ))}
            </motion.div>
          ) : (
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl text-center py-20 shadow-sm">
              <div className="text-gray-400 mb-6">
                <HiOutlineNewspaper className="w-20 h-20 mx-auto opacity-50" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                No news found
              </h3>
              <p className="text-gray-600 text-lg mb-6">
                {selectedCategory !== 'all' 
                  ? `No articles found in the ${selectedCategory} category.`
                  : 'Check back later for the latest crypto news.'
                }
              </p>
              <Link
                to="/news"
                className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3 rounded-lg transition-colors"
              >
                View All News
              </Link>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center space-x-4 mb-12"
            >
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-black font-medium px-6 py-3 rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <div className="flex items-center space-x-2">
                {[...Array(Math.min(5, totalPages))].map((_, index) => {
                  const pageNumber = Math.max(1, currentPage - 2) + index;
                  if (pageNumber > totalPages) return null;
                  
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`w-12 h-12 rounded-lg font-medium transition-colors ${
                        currentPage === pageNumber
                          ? 'bg-yellow-400 text-black'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-black font-medium px-6 py-3 rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                Next
              </button>
            </motion.div>
          )}

          {/* Back to All News */}
          {selectedCategory !== 'all' && (
            <div className="text-center mt-8">
              <Link
                to="/news"
                className="text-black hover:text-yellow-600 font-bold text-lg transition-colors inline-flex items-center"
              >
                ← Back to All News
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default News;