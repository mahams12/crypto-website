import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineArrowUp, 
  HiOutlineArrowDown,
  HiOutlineStar,
  HiStar,
  HiOutlineChevronUp,
  HiOutlineChevronDown
} from 'react-icons/hi';
import CoinRow from './CoinRow';
import { SkeletonTable } from '../Common/Loading';
import { formatPrice, formatMarketCap, formatVolume, formatPercentage } from '../../utils/formatters';

const PriceTable = ({ 
  data = [], 
  isLoading = false, 
  showPagination = true,
  maxRows = null,
  onPageChange,
  currentPage = 1,
  totalPages = 1
}) => {
  const [sortField, setSortField] = useState('market_cap_rank');
  const [sortDirection, setSortDirection] = useState('asc');
  const [watchlist, setWatchlist] = useState(new Set());

  // Sort data
  const sortedData = useMemo(() => {
    if (!data.length) return [];

    const sorted = [...data].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) aValue = 0;
      if (bValue === null || bValue === undefined) bValue = 0;

      // Handle string values
      if (typeof aValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Handle numeric values
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return maxRows ? sorted.slice(0, maxRows) : sorted;
  }, [data, sortField, sortDirection, maxRows]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleWatchlist = (coinId) => {
    setWatchlist(prev => {
      const newWatchlist = new Set(prev);
      if (newWatchlist.has(coinId)) {
        newWatchlist.delete(coinId);
      } else {
        newWatchlist.add(coinId);
      }
      return newWatchlist;
    });
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return <HiOutlineChevronUp className="w-4 h-4 text-gray-500 opacity-50" />;
    }
    return sortDirection === 'asc' ? (
      <HiOutlineChevronUp className="w-4 h-4" style={{ color: '#FFD700' }} />
    ) : (
      <HiOutlineChevronDown className="w-4 h-4" style={{ color: '#FFD700' }} />
    );
  };

  if (isLoading) {
    return <SkeletonTable rows={maxRows || 10} />;
  }

  if (!sortedData.length) {
    return (
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center py-12">
        <div className="text-gray-400 mb-4">
          <HiOutlineChevronDown className="w-12 h-12 mx-auto opacity-50" />
        </div>
        <h3 className="text-lg font-medium text-black mb-2">No data available</h3>
        <p className="text-gray-600">Market data will appear here when available.</p>
      </div>
    );
  }

  const tableHeaders = [
    { key: 'market_cap_rank', label: '#', className: 'w-12 text-center' },
    { key: 'name', label: 'Asset', className: 'min-w-48' },
    { key: 'current_price', label: 'Price', className: 'text-right min-w-24' },
    { key: 'market_cap', label: 'Market Cap', className: 'text-right min-w-32', hideOnMobile: true },
    { key: 'volume_24h', label: '24h Volume', className: 'text-right min-w-32', hideOnMobile: true },
    { key: 'price_change_percentage_24h', label: '24h', className: 'text-right min-w-20' },
    { key: 'price_change_percentage_7d', label: '7d', className: 'text-right min-w-20', hideOnMobile: true },
    { key: 'price_change_percentage_30d', label: '30d', className: 'text-right min-w-20', hideOnMobile: true },
    { key: 'actions', label: '', className: 'w-12' }
  ];

  return (
    <div className="overflow-hidden">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* Header */}
          <thead className="bg-gray-50">
            <tr>
              {tableHeaders.map((header) => (
                <th
                  key={header.key}
                  className={`px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider border-b-2 border-gray-200 ${header.className} ${header.hideOnMobile ? 'hidden md:table-cell' : ''}`}
                >
                  {header.key !== 'actions' && header.key !== 'name' ? (
                    <button
                      onClick={() => handleSort(header.key)}
                      className="flex items-center space-x-1 hover:text-yellow-500 transition-colors font-bold"
                    >
                      <span>{header.label}</span>
                      <SortIcon field={header.key} />
                    </button>
                  ) : (
                    <span className="font-bold">{header.label}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="bg-white">
            <AnimatePresence mode="popLayout">
              {sortedData.map((coin, index) => (
                <motion.tr
                  key={coin.coin_id || coin.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.02, duration: 0.3 }}
                  className="hover:bg-gray-50 transition-colors group border-b border-gray-100"
                >
                  {/* Rank */}
                  <td className="text-center px-4 py-4">
                    <span className="text-black font-bold">
                      {coin.market_cap_rank || index + 1}
                    </span>
                  </td>

                  {/* Name & Symbol */}
                  <td className="px-4 py-4">
                    <Link
                      to={`/coin/${coin.coin_id || coin.id}`}
                      className="flex items-center space-x-3 hover:text-yellow-500 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        {coin.image_url || coin.image ? (
                          <img
                            src={coin.image_url || coin.image}
                            alt={coin.name}
                            className="w-8 h-8 rounded-full"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-black">
                              {coin.symbol?.charAt(0) || '?'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-black group-hover:text-yellow-500 transition-colors">
                          {coin.name}
                        </div>
                        <div className="text-sm text-gray-600 uppercase font-semibold">
                          {coin.symbol}
                        </div>
                      </div>
                    </Link>
                  </td>

                  {/* Price */}
                  <td className="text-right px-4 py-4">
                    <div className="font-mono font-bold text-black">
                      {formatPrice(coin.current_price)}
                    </div>
                  </td>

                  {/* Market Cap */}
                  <td className="text-right hidden md:table-cell px-4 py-4">
                    <div className="font-mono font-semibold text-black">
                      {formatMarketCap(coin.market_cap)}
                    </div>
                  </td>

                  {/* Volume */}
                  <td className="text-right hidden md:table-cell px-4 py-4">
                    <div className="font-mono font-semibold text-black">
                      {formatVolume(coin.volume_24h || coin.total_volume)}
                    </div>
                  </td>

                  {/* 24h Change */}
                  <td className="text-right px-4 py-4">
                    <PriceChange percentage={coin.price_change_percentage_24h} />
                  </td>

                  {/* 7d Change */}
                  <td className="text-right hidden md:table-cell px-4 py-4">
                    <PriceChange percentage={coin.price_change_percentage_7d} />
                  </td>

                  {/* 30d Change */}
                  <td className="text-right hidden md:table-cell px-4 py-4">
                    <PriceChange percentage={coin.price_change_percentage_30d} />
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4">
                    <button
                      onClick={() => toggleWatchlist(coin.coin_id || coin.id)}
                      className="p-1 text-gray-400 hover:text-yellow-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      {watchlist.has(coin.coin_id || coin.id) ? (
                        <HiStar className="w-4 h-4 text-yellow-500" />
                      ) : (
                        <HiOutlineStar className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 px-4">
          <div className="text-sm text-black font-semibold">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage <= 1}
              className="inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 bg-white text-black border-2 border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 bg-white text-black border-2 border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Price change component
const PriceChange = ({ percentage }) => {
  if (percentage === null || percentage === undefined) {
    return <span className="text-gray-500 text-sm font-semibold">N/A</span>;
  }

  const isPositive = percentage >= 0;
  const isZero = percentage === 0;

  return (
    <div className={`flex items-center justify-end space-x-1 ${
      isZero ? 'text-gray-600' : isPositive ? 'text-green-600' : 'text-red-600'
    }`}>
      {!isZero && (
        <>
          {isPositive ? (
            <HiOutlineArrowUp className="w-3 h-3" />
          ) : (
            <HiOutlineArrowDown className="w-3 h-3" />
          )}
        </>
      )}
      <span className="font-mono text-sm font-bold">
        {isPositive && !isZero ? '+' : ''}{formatPercentage(percentage)}
      </span>
    </div>
  );
};

export default PriceTable;