import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HiOutlineExternalLink, 
  HiOutlineCalendar, 
  HiOutlineUser,
  HiOutlineTag,
  HiOutlinePhotograph,
  HiOutlineNewspaper
} from 'react-icons/hi';
import { formatTimeAgo, truncateText } from '../../utils/formatters';

const NewsCard = ({ article }) => {
  const [imageError, setImageError] = useState(false);
  
  const categoryColors = {
    bitcoin: 'bg-yellow-400 text-black border-yellow-500',
    ethereum: 'bg-yellow-400 text-black border-yellow-500',
    defi: 'bg-yellow-400 text-black border-yellow-500',
    solana: 'bg-yellow-400 text-black border-yellow-500',
    altcoins: 'bg-yellow-400 text-black border-yellow-500',
    blockchain: 'bg-yellow-400 text-black border-yellow-500',
    nft: 'bg-yellow-400 text-black border-yellow-500',
    trading: 'bg-yellow-400 text-black border-yellow-500',
    regulation: 'bg-yellow-400 text-black border-yellow-500',
    'shiba-inu': 'bg-yellow-400 text-black border-yellow-500',
    general: 'bg-yellow-400 text-black border-yellow-500'
  };

  const getCategoryStyle = (category) => {
    return categoryColors[category?.toLowerCase()] || categoryColors.general;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const openArticle = () => {
    if (article.url && article.url !== '#') {
      window.open(article.url, '_blank', 'noopener,noreferrer');
    }
  };

  // Create placeholder gradient based on category
  const getPlaceholderGradient = (category) => {
    const gradients = {
      bitcoin: 'from-orange-600 to-yellow-600',
      ethereum: 'from-blue-600 to-purple-600',
      defi: 'from-purple-600 to-pink-600',
      solana: 'from-green-600 to-teal-600',
      altcoins: 'from-blue-600 to-orange-600',
      blockchain: 'from-indigo-600 to-purple-600',
      regulation: 'from-red-600 to-pink-600',
      general: 'from-gray-600 to-slate-600'
    };
    return gradients[category?.toLowerCase()] || gradients.general;
  };

  // Check if article has valid data
  if (!article || !article.title) {
    return null;
  }

  return (
    <motion.article
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-white border-2 border-gray-200 rounded-xl p-0 shadow-md hover:shadow-xl hover:border-yellow-400 cursor-pointer group h-full flex flex-col transition-all duration-200"
      onClick={openArticle}
    >
      {/* Image */}
      <div className="relative overflow-hidden rounded-t-xl mb-4 bg-gray-100">
        {article.image_url && article.image_url.trim() && !imageError ? (
          <div className="aspect-video">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              onError={handleImageError}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ) : (
          <div className={`aspect-video flex items-center justify-center bg-gradient-to-br ${getPlaceholderGradient(article.category)} relative`}>
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10 flex flex-col items-center justify-center text-white">
              <HiOutlineNewspaper className="w-12 h-12 mb-2 opacity-80" />
              <span className="text-sm font-medium opacity-90">
                {article.category ? article.category.toUpperCase() : 'CRYPTO'} NEWS
              </span>
            </div>
          </div>
        )}
        
        {/* Category Badge */}
        {article.category && (
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-bold border-2 backdrop-blur-sm ${getCategoryStyle(article.category)}`}>
              <HiOutlineTag className="w-3 h-3 mr-1" />
              {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
            </span>
          </div>
        )}

        {/* External Link Icon */}
        {article.url && article.url !== '#' && (
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-8 h-8 bg-black/80 rounded-full flex items-center justify-center backdrop-blur-sm">
              <HiOutlineExternalLink className="w-4 h-4 text-gray-300" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 pb-6">
        {/* Title */}
        <h3 className="font-bold text-black mb-3 line-clamp-2 group-hover:text-gray-800 transition-colors leading-tight text-lg">
          {article.title}
        </h3>

        {/* Description */}
        {article.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1 leading-relaxed">
            {typeof truncateText === 'function' ? truncateText(article.description, 150) : article.description}
          </p>
        )}

        {/* Meta Information */}
        <div className="mt-auto">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            {/* Source */}
            {article.source && (
              <div className="flex items-center space-x-1">
                <HiOutlineUser className="w-3 h-3" />
                <span className="font-medium text-gray-700">{article.source}</span>
              </div>
            )}

            {/* Published Date */}
            {article.published_at && (
              <div className="flex items-center space-x-1">
                <HiOutlineCalendar className="w-3 h-3" />
                <time dateTime={article.published_at} className="text-gray-700">
                  {typeof formatTimeAgo === 'function' ? formatTimeAgo(article.published_at) : new Date(article.published_at).toLocaleDateString()}
                </time>
              </div>
            )}
          </div>

          {/* Author */}
          {article.author && (
            <div className="text-xs text-gray-600 italic font-medium">
              By {article.author}
            </div>
          )}
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-yellow-400/50 transition-colors pointer-events-none" />
    </motion.article>
  );
};

export default NewsCard;