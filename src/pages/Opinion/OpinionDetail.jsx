import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  HiOutlineClock, 
  HiOutlineUser, 
  HiOutlineShare,
  HiOutlineHeart,
  HiOutlineBookmark,
  HiOutlineArrowLeft,
  HiOutlineExternalLink
} from 'react-icons/hi';

const OpinionDetail = () => {
  const { articleId } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (articleId) {
      fetchArticleDetails();
      fetchRelatedArticles();
    }
  }, [articleId]);

  const fetchArticleDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if articleId is a fallback ID
      if (articleId.startsWith('opinion_')) {
        setArticle(getMockArticleById(articleId));
        return;
      }

      // Try to fetch from NewsAPI for opinion content
      try {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=cryptocurrency+opinion+analysis&language=en&sortBy=publishedAt&pageSize=20&apiKey=${process.env.REACT_APP_NEWS_API_KEY || 'dc8fbde393bb4cb6bb5da32a3945bb69'}`
        );
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.status === 'ok' && data.articles && data.articles.length > 0) {
            // Find article by creating a similar ID hash
            let articleData = null;
            
            // Try to find matching article by ID hash
            for (const apiArticle of data.articles) {
              if (apiArticle.url) {
                const generatedId = btoa(apiArticle.url).replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);
                if (generatedId === articleId) {
                  articleData = apiArticle;
                  break;
                }
              }
            }
            
            // If no exact match, use a deterministic approach based on articleId
            if (!articleData && data.articles.length > 0) {
              const hash = articleId.split('').reduce((a, b) => {
                a = ((a << 5) - a) + b.charCodeAt(0);
                return a & a;
              }, 0);
              const index = Math.abs(hash) % data.articles.length;
              articleData = data.articles[index];
            }

            if (articleData) {
              const formattedArticle = {
                id: articleId,
                title: articleData.title || 'Cryptocurrency Opinion Analysis',
                category: "OPINION",
                timeAgo: getTimeAgo(articleData.publishedAt),
                publishedAt: formatPublishedDate(articleData.publishedAt),
                author: articleData.author || articleData.source?.name || "Crypto Expert",
                excerpt: articleData.description || "Expert analysis on cryptocurrency market trends and developments.",
                content: formatArticleContent(articleData),
                tags: extractTags(articleData),
                readTime: calculateReadTime(articleData.content || articleData.description),
                image: articleData.urlToImage,
                url: articleData.url,
                source: articleData.source?.name || "Crypto News"
              };
              
              setArticle(formattedArticle);
              return;
            }
          }
        }
      } catch (apiError) {
        console.error('API fetch failed:', apiError);
      }

      // Fallback to mock article
      setArticle(getMockArticleById(articleId));

    } catch (error) {
      console.error('Error fetching article:', error);
      setError('Failed to load article. Please try again later.');
      setArticle(getMockArticleById(articleId));
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedArticles = async () => {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=bitcoin+opinion+OR+ethereum+analysis&language=en&sortBy=publishedAt&pageSize=6&apiKey=${process.env.REACT_APP_NEWS_API_KEY || 'dc8fbde393bb4cb6bb5da32a3945bb69'}`
      );
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.status === 'ok' && data.articles) {
          const formatted = data.articles
            .filter(article => article.title !== '[Removed]' && article.url)
            .slice(0, 3)
            .map((article) => ({
              id: btoa(article.url).replace(/[^a-zA-Z0-9]/g, '').substring(0, 20),
              title: article.title,
              timeAgo: getTimeAgo(article.publishedAt),
              category: "OPINION",
              url: article.url
            }));
          
          setRelatedArticles(formatted);
          return;
        }
      }
      
      setRelatedArticles(getMockRelatedArticles());
    } catch (error) {
      console.error('Error fetching related articles:', error);
      setRelatedArticles(getMockRelatedArticles());
    }
  };

  const formatArticleContent = (articleData) => {
    if (!articleData) {
      return getMockContent();
    }

    const content = articleData.content || '';
    const description = articleData.description || '';

    if (content && content.length > 200) {
      return `
        <div class="article-intro">
          <p class="lead text-lg font-medium mb-6 text-gray-700">${description}</p>
        </div>
        
        <div class="article-body">
          ${content.replace(/\n/g, '</p><p class="mb-4 text-gray-700">')}
        </div>
      `;
    }

    return `
      <div class="article-intro">
        <p class="lead text-lg font-medium mb-6 text-gray-700">${description}</p>
      </div>
      
      <h2 class="text-2xl font-bold mb-4 text-black">Market Analysis</h2>
      <p class="mb-6 text-gray-700">The cryptocurrency market continues to evolve with new developments in blockchain technology, regulatory frameworks, and institutional adoption affecting investor sentiment and market dynamics.</p>
      
      <h2 class="text-2xl font-bold mb-4 text-black">Key Insights</h2>
      <p class="mb-6 text-gray-700">Industry experts are closely monitoring various factors that could influence cryptocurrency prices and market trends in the coming months.</p>
      
      <h2 class="text-2xl font-bold mb-4 text-black">Investment Implications</h2>
      <ul class="list-disc pl-6 mb-6 space-y-2 text-gray-700">
        <li>Market volatility requires careful risk management strategies</li>
        <li>Regulatory developments continue to shape institutional adoption</li>
        <li>Technological innovations drive new investment opportunities</li>
        <li>Global economic factors influence cryptocurrency market sentiment</li>
      </ul>
      
      <div class="disclaimer bg-yellow-50 p-4 rounded-lg border-l-4 border-primary-500 mt-8">
        <p class="text-sm text-gray-700"><strong class="text-black">Disclaimer:</strong> This analysis is for educational purposes only and should not be considered financial advice. Cryptocurrency investments carry significant risks. Always conduct thorough research and consider consulting with financial professionals before making investment decisions.</p>
      </div>
    `;
  };

  const getMockContent = () => {
    return `
      <div class="article-intro">
        <p class="lead text-lg font-medium mb-6 text-gray-700">Expert analysis on current cryptocurrency market trends and future outlook for digital assets.</p>
      </div>
      
      <h2 class="text-2xl font-bold mb-4 text-black">Current Market Landscape</h2>
      <p class="mb-6 text-gray-700">The cryptocurrency market has shown remarkable resilience and growth over recent months, with institutional adoption continuing to drive mainstream acceptance of digital assets.</p>
      
      <h2 class="text-2xl font-bold mb-4 text-black">Key Market Drivers</h2>
      <p class="mb-6 text-gray-700">Several factors are contributing to the current market dynamics, including regulatory clarity, technological innovations, and changing investor sentiment toward digital assets.</p>
      
      <h2 class="text-2xl font-bold mb-4 text-black">Future Outlook</h2>
      <p class="mb-6 text-gray-700">As the cryptocurrency ecosystem matures, we can expect continued evolution in both technology and regulation, creating new opportunities and challenges for investors.</p>
    `;
  };

  const extractTags = (articleData) => {
    if (!articleData) return ['CRYPTO', 'ANALYSIS', 'OPINION'];

    const text = `${articleData.title || ''} ${articleData.description || ''} ${articleData.content || ''}`.toUpperCase();
    const commonCryptoTerms = [
      'BTC', 'BITCOIN', 'ETH', 'ETHEREUM', 'DEFI', 'NFT', 'BLOCKCHAIN', 
      'CRYPTO', 'ANALYSIS', 'OPINION', 'MARKET', 'TRADING'
    ];
    
    const foundTags = commonCryptoTerms.filter(term => text.includes(term));
    return foundTags.length > 0 ? foundTags.slice(0, 4) : ['CRYPTO', 'ANALYSIS', 'OPINION'];
  };

  const calculateReadTime = (content) => {
    if (!content) return '5 min read';
    
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${Math.max(1, readTime)} min read`;
  };

  const getTimeAgo = (publishedAt) => {
    if (!publishedAt) return 'Recently';
    
    const now = new Date();
    const published = new Date(publishedAt);
    const diffMs = now - published;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Less than an hour ago';
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) !== 1 ? 's' : ''} ago`;
  };

  const formatPublishedDate = (publishedAt) => {
    if (!publishedAt) return new Date().toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
    });

    return new Date(publishedAt).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', 
      hour: 'numeric', minute: '2-digit', timeZoneName: 'short'
    });
  };

  const getMockArticleById = (id) => {
    const mockArticles = {
      'opinion_1': {
        title: "Why Bitcoin's Recent Rally Signals a New Era of Institutional Adoption",
        excerpt: "Expert analysis on how institutional players are driving Bitcoin's price momentum and what it means for the future.",
        author: "Michael Chen"
      },
      'opinion_2': {
        title: "The Ethereum Merge: A Technical Analysis of What Went Right and Wrong",
        excerpt: "A deep dive into Ethereum's transition to proof-of-stake and its long-term implications for the network.",
        author: "Sarah Johnson"
      },
      'opinion_3': {
        title: "DeFi's Growing Pains: Why Regulation Might Actually Help the Space",
        excerpt: "Exploring how regulatory clarity could boost DeFi adoption while maintaining innovation.",
        author: "David Williams"
      }
    };

    const mock = mockArticles[id] || mockArticles['opinion_1'];

    return {
      id: id,
      title: mock.title,
      category: "OPINION",
      timeAgo: "3 hours ago",
      publishedAt: formatPublishedDate(new Date()),
      author: mock.author,
      excerpt: mock.excerpt,
      content: getMockContent(),
      tags: ['CRYPTO', 'ANALYSIS', 'MARKET', 'OPINION'],
      readTime: "6 min read"
    };
  };

  const getMockRelatedArticles = () => [
    {
      id: 'related_defi_growth',
      title: "DeFi Protocols Show Strong Growth Despite Market Volatility",
      timeAgo: "5 hours ago",
      category: "OPINION",
      url: `/opinion/related_defi_growth`
    },
    {
      id: 'related_btc_institutional',
      title: "Institutional Bitcoin Adoption Reaches New Milestones",
      timeAgo: "1 day ago",
      category: "OPINION",
      url: `/opinion/related_btc_institutional`
    },
    {
      id: 'related_eth_upgrades',
      title: "Ethereum Network Upgrades Drive Developer Activity",
      timeAgo: "2 days ago",
      category: "OPINION",
      url: `/opinion/related_eth_upgrades`
    }
  ];

  const handleExternalLink = () => {
    if (article?.url) {
      window.open(article.url, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading article...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white text-black">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-black mb-2">Article not found</h2>
              <p className="text-gray-600 mb-4">
                {error || 'The article you are looking for could not be found.'}
              </p>
              <Link to="/opinion" className="text-primary-500 hover:text-primary-600">
                Back to Opinion
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            to="/opinion" 
            className="inline-flex items-center text-gray-600 hover:text-primary-500 transition-colors"
          >
            <HiOutlineArrowLeft className="w-5 h-5 mr-2" />
            Back to Opinion
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <span className="bg-primary-500 text-black px-3 py-1 rounded-full text-xs font-semibold">
              {article.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight text-black">
            {article.title}
          </h1>

          {/* Author and Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-primary-500 rounded-full mr-2"></div>
              <span>By {article.author}</span>
            </div>
            <span>{article.publishedAt}</span>
            <span>{article.readTime}</span>
          </div>

          {/* Featured Image */}
          <div className="relative mb-8">
            <div className="aspect-[16/10] rounded-lg overflow-hidden relative">
              {article.image ? (
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : null}
              
              {/* Fallback gradient background */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-primary-500 via-yellow-500 to-orange-500" 
                style={{display: article.image ? 'none' : 'block'}}
              >
                <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg"></div>
              </div>
              
              <div className="absolute bottom-4 right-4 bg-primary-500 text-black rounded-full px-4 py-2">
                <span className="text-sm font-bold">{article.source || 'Crypto Tracker'}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4 mb-8">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors">
              <HiOutlineHeart className="w-5 h-5" />
              <span className="text-sm">Like</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-primary-500 transition-colors">
              <HiOutlineBookmark className="w-5 h-5" />
              <span className="text-sm">Save</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors">
              <HiOutlineShare className="w-5 h-5" />
              <span className="text-sm">Share</span>
            </button>
            {article.url && (
              <button 
                onClick={handleExternalLink}
                className="flex items-center space-x-2 text-gray-600 hover:text-primary-500 transition-colors"
              >
                <HiOutlineExternalLink className="w-5 h-5" />
                <span className="text-sm">Read Original</span>
              </button>
            )}
          </div>
        </header>

        {/* Article Excerpt */}
        {article.excerpt && (
          <div className="mb-8 p-6 bg-yellow-50 rounded-lg border-l-4 border-primary-500">
            <p className="text-lg text-gray-700 italic">{article.excerpt}</p>
          </div>
        )}

        {/* Article Content */}
        <article className="prose prose-lg max-w-none mb-12">
          <div 
            dangerouslySetInnerHTML={{ __html: article.content }}
            className="article-content leading-relaxed [&>h2]:text-black [&>h3]:text-black [&>h4]:text-black [&>p]:mb-4 [&>ul]:mb-6 [&>li]:mb-2"
          />
        </article>

        {/* External Link Notice */}
        {article.url && (
          <div className="mb-8 p-4 bg-primary-50 border border-primary-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-primary-600 mb-1">Read the Full Article</h4>
                <p className="text-sm text-gray-700">
                  Visit the original source for the complete article and additional details.
                </p>
              </div>
              <button 
                onClick={handleExternalLink}
                className="bg-primary-500 hover:bg-primary-600 text-black px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 font-semibold"
              >
                <span>Read More</span>
                <HiOutlineExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mb-12">
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="bg-primary-500 text-black px-3 py-1 rounded text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="border-t border-gray-200 pt-8">
            <h3 className="text-2xl font-bold mb-6 text-black">Related Opinions</h3>
            <div className="space-y-4">
              {relatedArticles.map((relatedArticle) => (
                <div
                  key={relatedArticle.id}
                  className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Link
                    to={`/opinion/${relatedArticle.id}`}
                    className="block hover:text-primary-500 transition-colors"
                  >
                    <h4 className="font-semibold mb-1 text-black">{relatedArticle.title}</h4>
                    <div className="text-sm text-gray-600">
                      <span className="bg-primary-500 text-black px-2 py-1 rounded text-xs mr-2 font-medium">
                        {relatedArticle.category}
                      </span>
                      <span>{relatedArticle.timeAgo}</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default OpinionDetail;