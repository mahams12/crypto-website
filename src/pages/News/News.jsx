// src/pages/News/News.jsx
import React, { useEffect, useState, useCallback } from "react";
import { newsService } from "../../services/newsService";

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔄 Fetching news...");
      
      const data = await newsService.fetchLatestNews();
      console.log("✅ News fetched:", data);
      
      if (data && data.length > 0) {
        setNews(data);
        setRetryCount(0); // Reset retry count on success
      } else {
        setError("No news articles found");
      }
    } catch (err) {
      console.error("❌ Error loading news:", err);
      setError("Failed to load news. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    loadNews();
  };

  const handleImageError = (e, article) => {
    console.log(`❌ Image failed to load for: ${article.title}`);
    // Fallback to a different placeholder service
    const fallbackImages = [
      `https://via.placeholder.com/400x200/1a1a1a/ffffff?text=${encodeURIComponent(article.source)}`,
      `https://dummyimage.com/400x200/333/fff&text=${encodeURIComponent('Crypto News')}`,
      `https://picsum.photos/400/200?grayscale&blur=1`
    ];
    
    const currentSrc = e.target.src;
    const nextFallback = fallbackImages.find(url => url !== currentSrc);
    
    if (nextFallback) {
      e.target.src = nextFallback;
    } else {
      // Hide image if all fallbacks fail
      e.target.style.display = 'none';
      e.target.nextSibling?.classList.add('pt-4'); // Add padding to title if image is hidden
    }
  };

  // Loading state with improved skeleton
  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Latest Crypto News</h1>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-2xl p-4 animate-pulse">
              <div className="bg-gray-700 h-40 rounded-xl mb-3"></div>
              <div className="space-y-2">
                <div className="bg-gray-700 h-4 rounded"></div>
                <div className="bg-gray-700 h-4 rounded w-4/5"></div>
                <div className="bg-gray-700 h-3 rounded w-3/4"></div>
                <div className="bg-gray-700 h-3 rounded w-1/2"></div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="bg-gray-700 h-3 rounded w-16"></div>
                <div className="bg-gray-700 h-3 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">Loading latest crypto news...</p>
        </div>
      </div>
    );
  }

  // Error state with better retry mechanism
  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-white mb-6">Latest Crypto News</h1>
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-8 max-w-md mx-auto">
          <div className="text-red-400 mb-4">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-medium mb-2">Unable to Load News</p>
            <p className="text-sm text-red-300">{error}</p>
            {retryCount > 0 && (
              <p className="text-xs text-red-200 mt-2">Retry attempts: {retryCount}</p>
            )}
          </div>
          <button
            onClick={handleRetry}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors"
          >
            {loading ? 'Retrying...' : 'Try Again'}
          </button>
          <div className="mt-4 text-xs text-gray-400">
            <p>Having trouble? Try refreshing the page or check your internet connection.</p>
          </div>
        </div>
      </div>
    );
  }

  // No news state
  if (!news.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-6 max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Latest Crypto News</h1>
            <p className="text-gray-600">Stay updated with the latest cryptocurrency news and market insights</p>
          </div>
          
          <div className="bg-white rounded-lg p-8 max-w-md mx-auto shadow">
            <div className="text-gray-500 mb-4">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <p className="text-lg text-gray-900 font-medium">No News Available</p>
              <p className="text-sm mt-2 text-gray-600">Check back later for the latest crypto updates.</p>
            </div>
            <button
              onClick={handleRetry}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success state with enhanced article cards
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Latest Crypto News</h1>
        <button
          onClick={handleRetry}
          className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
          title="Refresh news"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
        {news.map((article, index) => (
          <a
            key={article.id}
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 rounded-2xl shadow hover:shadow-lg hover:bg-gray-700 transition-all duration-300 p-4 flex flex-col group border border-gray-700 hover:border-gray-600"
          >
            <div className="overflow-hidden rounded-xl mb-3 bg-gray-700 min-h-[160px] flex items-center justify-center">
              <img
                src={article.imgURL}
                alt={article.title}
                className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => handleImageError(e, article)}
                loading="lazy"
              />
            </div>
            
            <h2 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
              {article.title}
            </h2>
            
            <p className="text-gray-400 text-sm flex-grow line-clamp-3 mb-3 leading-relaxed">
              {article.description}
            </p>
            
            <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-700">
              <span className="bg-gray-700 px-2 py-1 rounded text-gray-300 font-medium">
                {article.source}
              </span>
              <span>
                {new Date(article.feedDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
          </a>
        ))}
      </div>
      
      <div className="text-center mt-8 text-sm text-gray-500">
        <p>News updated regularly • Last refresh: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
}