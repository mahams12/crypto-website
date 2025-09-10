// src/pages/News/News.jsx
import React, { useEffect, useState } from "react";
import { newsService } from "../../services/newsService";

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      const data = await newsService.fetchLatestNews();
      setNews(data);
      setLoading(false);
    };
    loadNews();
  }, []);

  if (loading) return <p className="text-center text-gray-400">Loading news...</p>;
  if (!news.length) return <p className="text-center text-gray-400">No news available right now.</p>;

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
            className="bg-gray-800 rounded-2xl shadow hover:shadow-lg hover:bg-gray-700 transition p-4 flex flex-col"
          >
            {article.imgURL && (
              <img
                src={article.imgURL}
                alt={article.title}
                className="rounded-xl mb-3 h-40 w-full object-cover"
              />
            )}
            <h2 className="text-lg font-semibold text-white mb-2">{article.title}</h2>
            <p className="text-gray-400 text-sm flex-grow">{article.description}</p>
            <span className="text-xs text-gray-500 mt-2">
              {new Date(article.feedDate).toLocaleDateString()}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
