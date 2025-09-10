// src/pages/News/News.jsx
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { HiOutlineClock, HiOutlineUser } from "react-icons/hi";
import { fetchLatestNews } from "../../services/newsService";

const News = () => {
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const articles = await fetchLatestNews();
      if (articles.length === 0) {
        setError("No news available right now.");
      }
      setNewsArticles(articles);
    } catch (err) {
      console.error("Error loading news:", err);
      setError("Failed to load news.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <p className="text-gray-600">Loading latest crypto news...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>News | Crypto Tracker</title>
        <meta
          name="description"
          content="Latest cryptocurrency news and updates from trusted sources."
        />
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
              News
            </h1>
            <p className="text-gray-600 text-lg max-w-4xl leading-relaxed">
              Real-time cryptocurrency news from trusted sources. Stay ahead
              with the latest updates on Bitcoin, Ethereum, and other digital
              assets.
            </p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
              <p className="text-red-600">{error}</p>
              <button
                onClick={loadNews}
                className="mt-2 text-sm text-primary-500 hover:text-primary-600 underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* News Articles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-8 text-black">
              Latest News ({newsArticles.length} articles)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {newsArticles.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-primary-500 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => window.open(article.url, "_blank")}
                >
                  {/* Article Image */}
                  <div className="relative h-48 overflow-hidden">
                    {article.image ? (
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-yellow-500 to-orange-500"></div>
                    )}

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

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {article.description}
                    </p>

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
                </motion.article>
              ))}
            </div>

            {/* Refresh Button */}
            <div className="text-center">
              <button
                onClick={loadNews}
                className="bg-primary-500 hover:bg-primary-600 text-black px-8 py-3 rounded-lg transition-colors font-semibold text-lg"
                disabled={loading}
              >
                {loading ? "Loading..." : "Refresh Real-time News"}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default News;
