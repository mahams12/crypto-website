// src/services/newsService.js
export const fetchLatestNews = async () => {
  const apiKey = process.env.REACT_APP_NEWS_API_KEY;

  if (!apiKey) {
    console.error("❌ Missing NewsAPI key! Add REACT_APP_NEWS_API_KEY in .env");
    return [];
  }

  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=cryptocurrency&language=en&pageSize=12&sortBy=publishedAt&apiKey=${apiKey}`
    );

    const data = await response.json();
    console.log("📰 DEBUG NEWS DATA:", data);

    if (data.status === "ok" && data.articles) {
      // Normalize news articles
      return data.articles
        .filter(article => article.title && article.url && article.urlToImage)
        .map((article, index) => ({
          id: `news_${index}_${Date.now()}`,
          title: article.title,
          description: article.description || "No description available",
          url: article.url,
          image: article.urlToImage,
          author: article.author || article.source?.name || "Crypto News",
          source: article.source?.name || "Unknown",
          publishedAt: article.publishedAt,
          timeAgo: getTimeAgo(article.publishedAt),
          category: "NEWS",
        }));
    } else {
      console.warn("⚠️ No news returned from API", data);
      return [];
    }
  } catch (error) {
    console.error("❌ Error fetching news:", error);
    return [];
  }
};

// Helper to format time
const getTimeAgo = (publishedAt) => {
  if (!publishedAt) return "Recently";
  const now = new Date();
  const published = new Date(publishedAt);
  const diffMs = now - published;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return "Less than an hour ago";
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) !== 1 ? "s" : ""} ago`;
};
