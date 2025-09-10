// src/pages/News/News.jsx
import React, { useEffect, useState } from "react";
import { newsService } from "../../services/newsService";

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("🔄 Fetching news...");
        
        const data = await newsService.fetchLatestNews();
        console.log("✅ News fetched:", data);
        
        if (data && data.length > 0) {
          setNews(data);
        } else {
          setError("No news articles found");
        }
      } catch (err) {
        console.error("❌ Error loading news:", err);
        setError("Failed to load news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    loadNews();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Latest Crypto News</h1>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-2xl p-4 animate-pulse">
              <div className="bg-gray-700 h-40 rounded-xl mb-3"></div>
              <div className="bg-gray-700 h-4 rounded mb-2"></div>
              <div className="bg-gray-700 h-3 rounded w-3/4 mb-2"></div>
              <div className="bg-gray-700 h-3 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-white mb-6">Latest Crypto News</h1>
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-6">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No news state
  if (!news.length) {
    return (
      <div className="p-6 max-w-7xl mx-auto text-center">
        <h1 className="text-2xl font-bold text-white mb-6">Latest Crypto News</h1>
        <p className="text-gray-400">No news available right now.</p>
      </div>
    );
  }

  // Success state
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Latest Crypto News</h1>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
        {news.map((article) => (
          <a
            key={article.id}
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 rounded-2xl shadow hover:shadow-lg hover:bg-gray-700 transition-all duration-300 p-4 flex flex-col group"
          >
            {article.imgURL && (
              <div className="overflow-hidden rounded-xl mb-3">
                <img
                  src={article.imgURL}
                  alt={article.title}
                  className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x200?text=News+Image';
                  }}
                />
              </div>
            )}
            <h2 className="text-lg font-semibold text-white mb-2 line-clamp-2">
              {article.title}
            </h2>
            <p className="text-gray-400 text-sm flex-grow line-clamp-3 mb-3">
              {article.description}
            </p>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{article.source}</span>
              <span>
                {new Date(article.feedDate).toLocaleDateString()}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}