import React, { useState, useRef } from 'react';
import { FaSearch, FaChartLine, FaExternalLinkAlt, FaFilter, FaArrowUp, FaArrowDown, FaTrophy, FaUsers, FaChartArea, FaCalendar, FaArrowLeft, FaDownload, FaExchangeAlt } from 'react-icons/fa';
import TradingGraph from './TradingGraph';
import './PnL.css';

const PnL = () => {
    const [timeframe, setTimeframe] = useState('24h');
    const [sortBy, setSortBy] = useState('volume');
    const [sortOrder, setSortOrder] = useState('desc');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTrader, setSelectedTrader] = useState(null);
    const graphContainerRef = useRef(null);
    const [startDate, setStartDate] = useState('2024-03-01');
    const [endDate, setEndDate] = useState('2024-03-20');

    // Generate dummy candlestick data
    const generateCandlestickData = (days) => {
        const data = [];
        let basePrice = 45000;
        const now = new Date();

        for (let i = days; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            
            const volatility = 0.02;
            const open = basePrice * (1 + (Math.random() - 0.5) * volatility);
            const close = open * (1 + (Math.random() - 0.5) * volatility);
            const high = Math.max(open, close) * (1 + Math.random() * 0.01);
            const low = Math.min(open, close) * (1 - Math.random() * 0.01);

            data.push({
                time: date.toISOString().split('T')[0],
                open: open,
                high: high,
                low: low,
                close: close
            });

            basePrice = close;
        }
        return data;
    };

    // Expanded dummy traders data with more realistic trading info
    const traders = [
        {
            id: 1,
            address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
            username: 'whale_trader',
            avatar: null,
            stats: {
                '24h': {
                    trades: 45,
                    volume: 2450000,
                    pnl: 125000,
                    pnlPercentage: 15.8,
                    winRate: 72,
                    avgTrade: 54444.44,
                    bestTrade: 85000,
                    worstTrade: -32000,
                    totalTrades: 45,
                    successfulTrades: 32,
                    failedTrades: 13,
                    avgHoldTime: '2.5 hours'
                },
                '7d': {
                    trades: 287,
                    volume: 15750000,
                    pnl: 850000,
                    pnlPercentage: 35.8,
                    winRate: 68,
                    avgTrade: 54878.05,
                    bestTrade: 150000,
                    worstTrade: -45000,
                    totalTrades: 287,
                    successfulTrades: 195,
                    failedTrades: 92,
                    avgHoldTime: '3.2 hours'
                },
                '30d': {
                    trades: 1245,
                    volume: 68450000,
                    pnl: 3850000,
                    pnlPercentage: 125.5,
                    winRate: 70,
                    avgTrade: 54980.72,
                    bestTrade: 250000,
                    worstTrade: -75000,
                    totalTrades: 1245,
                    successfulTrades: 871,
                    failedTrades: 374,
                    avgHoldTime: '4.1 hours'
                }
            },
            recentTrades: [
                {
                    pair: 'BTC/USDT',
                    type: 'LONG',
                    entry: 45250,
                    exit: 46800,
                    pnl: '+$23,250',
                    pnlPercentage: '+3.42%',
                    date: '2024-03-20 14:30:25',
                    size: '$850,000',
                    leverage: '10x',
                    duration: '2h 15m'
                },
                {
                    pair: 'ETH/USDT',
                    type: 'SHORT',
                    entry: 3200,
                    exit: 3150,
                    pnl: '+$15,000',
                    pnlPercentage: '+1.56%',
                    date: '2024-03-20 12:15:10',
                    size: '$600,000',
                    leverage: '5x',
                    duration: '1h 45m'
                },
                {
                    pair: 'BNB/USDT',
                    type: 'LONG',
                    entry: 420,
                    exit: 412,
                    pnl: '-$8,000',
                    pnlPercentage: '-1.90%',
                    date: '2024-03-20 10:05:30',
                    size: '$400,000',
                    leverage: '10x',
                    duration: '45m'
                }
            ],
            tradingHistory: generateCandlestickData(30)
        },
        {
            id: 2,
            address: '0x8765...4321',
            username: 'crypto_master',
            avatar: null,
            stats: {
                '24h': {
                    trades: 28,
                    volume: 980000,
                    pnl: -35000,
                    pnlPercentage: -3.2,
                    winRate: 45,
                    avgTrade: 35000,
                    bestTrade: 45000,
                    worstTrade: -28000,
                    totalTrades: 28,
                    successfulTrades: 13,
                    failedTrades: 15,
                    avgHoldTime: '1.8 hours'
                },
                '7d': {
                    trades: 168,
                    volume: 5850000,
                    pnl: 125000,
                    pnlPercentage: 12.5,
                    winRate: 58,
                    avgTrade: 34821.43,
                    bestTrade: 85000,
                    worstTrade: -35000,
                    totalTrades: 168,
                    successfulTrades: 97,
                    failedTrades: 71,
                    avgHoldTime: '2.5 hours'
                },
                '30d': {
                    trades: 725,
                    volume: 25450000,
                    pnl: 850000,
                    pnlPercentage: 45.8,
                    winRate: 62,
                    avgTrade: 35103.45,
                    bestTrade: 120000,
                    worstTrade: -45000,
                    totalTrades: 725,
                    successfulTrades: 450,
                    failedTrades: 275,
                    avgHoldTime: '3.2 hours'
                }
            },
            recentTrades: [
                {
                    pair: 'SOL/USDT',
                    type: 'LONG',
                    entry: 125,
                    exit: 128,
                    pnl: '+$12,000',
                    pnlPercentage: '+2.40%',
                    date: '2024-03-20 13:45:20',
                    size: '$500,000',
                    leverage: '8x',
                    duration: '1h 30m'
                }
            ],
            tradingHistory: generateCandlestickData(30)
        },
        {
            id: 3,
            address: '0x9876...5432',
            username: 'alpha_hunter',
            avatar: null,
            stats: {
                '24h': {
                    trades: 65,
                    volume: 3250000,
                    pnl: 185000,
                    pnlPercentage: 18.5,
                    winRate: 75,
                    avgTrade: 50000,
                    bestTrade: 95000,
                    worstTrade: -25000,
                    totalTrades: 65,
                    successfulTrades: 49,
                    failedTrades: 16,
                    avgHoldTime: '1.5 hours'
                },
                '7d': {
                    trades: 385,
                    volume: 19250000,
                    pnl: 950000,
                    pnlPercentage: 42.5,
                    winRate: 72,
                    avgTrade: 50000,
                    bestTrade: 180000,
                    worstTrade: -55000,
                    totalTrades: 385,
                    successfulTrades: 277,
                    failedTrades: 108,
                    avgHoldTime: '2.8 hours'
                },
                '30d': {
                    trades: 1580,
                    volume: 79000000,
                    pnl: 4250000,
                    pnlPercentage: 135.8,
                    winRate: 73,
                    avgTrade: 50000,
                    bestTrade: 280000,
                    worstTrade: -85000,
                    totalTrades: 1580,
                    successfulTrades: 1153,
                    failedTrades: 427,
                    avgHoldTime: '3.5 hours'
                }
            },
            recentTrades: [
                {
                    pair: 'AVAX/USDT',
                    type: 'SHORT',
                    entry: 45,
                    exit: 43.5,
                    pnl: '+$15,000',
                    pnlPercentage: '+3.33%',
                    date: '2024-03-20 14:15:30',
                    size: '$450,000',
                    leverage: '10x',
                    duration: '1h 15m'
                }
            ],
            tradingHistory: generateCandlestickData(30)
        }
    ];

    const formatNumber = (num, isCurrency = true) => {
        if (Math.abs(num) >= 1e6) {
            return `${isCurrency ? '$' : ''}${(num / 1e6).toFixed(1)}M`;
        } else if (Math.abs(num) >= 1e3) {
            return `${isCurrency ? '$' : ''}${(num / 1e3).toFixed(1)}K`;
        }
        return `${isCurrency ? '$' : ''}${num.toFixed(0)}`;
    };

    const formatPercentage = (num) => {
        return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`;
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
    };

    const filteredTraders = traders
        .filter(trader => 
            trader.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            trader.address.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            const multiplier = sortOrder === 'asc' ? 1 : -1;
            const aValue = a.stats[timeframe][sortBy];
            const bValue = b.stats[timeframe][sortBy];
            return (aValue - bValue) * multiplier;
        });

    return (
        <div className="pnl-container">
            {selectedTrader ? (
                // Trading Data View with improved padding and layout
                <div className="trader-details-view">
                    {/* Back Button with better spacing */}
                    <button 
                        className="back-to-ranking"
                        onClick={() => setSelectedTrader(null)}
                    >
                        <FaArrowLeft /> Back to Rankings
                    </button>

                    {/* Trader Header with improved padding */}
                    <div className="trader-header">
                        <div className="trader-profile">
                            <div className="trader-avatar-large">
                                {selectedTrader.avatar || selectedTrader.username[0].toUpperCase()}
                            </div>
                            <div className="trader-info-main">
                                <h2>{selectedTrader.username}</h2>
                                <div className="trader-address-info">
                                    <span className="address-tag">
                                        {`${selectedTrader.address.slice(0, 6)}...${selectedTrader.address.slice(-4)}`}
                                    </span>
                                    <a 
                                        href={`https://bscscan.com/address/${selectedTrader.address}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bscscan-link"
                                    >
                                        <FaExternalLinkAlt /> View on BSCScan
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid - Now single column on mobile */}
                    <div className="performance-stats-grid">
                        <div className="stat-card" style={{ padding: '32px 40px' }}>
                            <div className="stat-header">
                                <FaChartLine className="stat-icon" />
                                <span>Total PnL</span>
                            </div>
                            <div className="stat-main">
                                <div className="stat-value">
                                    ${selectedTrader.stats[timeframe].pnl.toLocaleString()}
                                </div>
                                <div className={`stat-change ${selectedTrader.stats[timeframe].pnlPercentage >= 0 ? 'positive' : 'negative'}`}>
                                    {selectedTrader.stats[timeframe].pnlPercentage >= 0 ? '+' : ''}
                                    {selectedTrader.stats[timeframe].pnlPercentage}%
                                </div>
                            </div>
                        </div>

                        <div className="stat-card" style={{ padding: '32px 40px' }}>
                            <div className="stat-header">
                                <FaChartArea className="stat-icon" />
                                <span>Trading Volume</span>
                            </div>
                            <div className="stat-main">
                                <div className="stat-value">
                                    ${selectedTrader.stats[timeframe].volume.toLocaleString()}
                                </div>
                                <div className="stat-subtitle">
                                    {selectedTrader.stats[timeframe].trades} trades
                                </div>
                            </div>
                        </div>

                        <div className="stat-card" style={{ padding: '32px 40px' }}>
                            <div className="stat-header">
                                <FaTrophy className="stat-icon" />
                                <span>Win Rate</span>
                            </div>
                            <div className="stat-main">
                                <div className="stat-value-group">
                                    <div className="stat-value">{selectedTrader.stats[timeframe].winRate}%</div>
                                    <div className="stat-subtitle">
                                        {selectedTrader.stats[timeframe].successfulTrades}/{selectedTrader.stats[timeframe].totalTrades} trades
                                    </div>
                                </div>
                                <div className="win-rate-progress">
                                    <div 
                                        className="win-rate-bar" 
                                        style={{ width: `${selectedTrader.stats[timeframe].winRate}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Trading Performance - Improved mobile layout */}
                    <div className="trading-performance-card">
                        <div className="card-header">
                            <h3>Trading Performance</h3>
                            <div className="timeframe-selector">
                                {['24h', '7d', '30d'].map(tf => (
                                    <button
                                        key={tf}
                                        className={`timeframe-btn ${timeframe === tf ? 'active' : ''}`}
                                        onClick={() => setTimeframe(tf)}
                                    >
                                        {tf.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="graph-container" style={{ height: '300px' }}>
                            <TradingGraph />
                        </div>
                    </div>

                    {/* Recent Trades - Optimized for mobile */}
                    <div className="recent-trades-card">
                        <div className="card-header">
                            <h3>Recent Trades</h3>
                            <div className="trades-summary">
                                <span className="avg-trade">
                                    Avg Trade: ${selectedTrader.stats[timeframe].avgTrade.toLocaleString()}
                                </span>
                                <span className="avg-hold">
                                    Avg Hold Time: {selectedTrader.stats[timeframe].avgHoldTime}
                                </span>
                            </div>
                        </div>
                        <div className="trades-list">
                            {selectedTrader.recentTrades.map((trade, index) => (
                                <div key={index} className="trade-item">
                                    <div className="trade-main-info">
                                        <div className="trade-pair-info">
                                            <span className="pair-name">{trade.pair}</span>
                                            <span className={`trade-type ${trade.type.toLowerCase()}`}>
                                                {trade.type}
                                            </span>
                                        </div>
                                        <div className="trade-result">
                                            <span className={`trade-pnl ${trade.pnl.startsWith('+') ? 'positive' : 'negative'}`}>
                                                {trade.pnl}
                                            </span>
                                            <span className={`trade-percentage ${trade.pnlPercentage.startsWith('+') ? 'positive' : 'negative'}`}>
                                                {trade.pnlPercentage}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="trade-details">
                                        <div className="trade-prices">
                                            <div className="price-item">
                                                <span className="label">Entry</span>
                                                <span className="value">${trade.entry.toLocaleString()}</span>
                                            </div>
                                            <div className="price-item">
                                                <span className="label">Exit</span>
                                                <span className="value">${trade.exit.toLocaleString()}</span>
                                            </div>
                                            <div className="price-item">
                                                <span className="label">Size</span>
                                                <span className="value">{trade.size}</span>
                                            </div>
                                            <div className="price-item">
                                                <span className="label">Leverage</span>
                                                <span className="value">{trade.leverage}</span>
                                            </div>
                                        </div>
                                        <div className="trade-time">
                                            <FaCalendar />
                                            <span>{trade.date}</span>
                                            <span className="duration">({trade.duration})</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="profit-turnover-section">
                        <div className="section-header">
                            <h3>Profit & Turnover Analysis</h3>
                            <div className="header-controls">
                                <div className="date-picker-wrapper">
                                    <input 
                                        type="date" 
                                        className="date-picker-input"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                    <span className="date-separator">to</span>
                                    <input 
                                        type="date" 
                                        className="date-picker-input"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                                <button className="download-btn">
                                    <FaDownload /> Download CSV
                                </button>
                            </div>
                        </div>
                        
                        <div className="table-responsive">
                            <table className="profit-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Profit/Loss</th>
                                        <th>Turnover</th>
                                        <th>Trades</th>
                                        <th>Win Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...Array(5)].map((_, index) => (
                                        <tr key={index}>
                                            <td>Mar {20 - index}, 2024</td>
                                            <td>
                                                <span className={`profit-value ${index % 2 === 0 ? 'positive' : 'negative'}`}>
                                                    {index % 2 === 0 ? '+$' : '-$'}{(Math.random() * 10000).toFixed(2)}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="turnover-value">
                                                    ${(Math.random() * 100000).toFixed(2)}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="trade-count">
                                                    <FaExchangeAlt className="trade-count-icon" />
                                                    {Math.floor(Math.random() * 50) + 10}
                                                </span>
                                            </td>
                                            <td>{(Math.random() * 30 + 60).toFixed(1)}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                // Rankings View
                <div className="rankings-view">
                    {/* Mobile-Optimized Controls */}
                    <div className="pnl-controls">
                        <div className="search-wrapper">
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search traders..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                        </div>
                        <div className="controls-right">
                            <div className="timeframe-tabs">
                                {['24h', '7d', '30d'].map(tf => (
                                    <button
                                        key={tf}
                                        className={`tab-btn ${timeframe === tf ? 'active' : ''}`}
                                        onClick={() => setTimeframe(tf)}
                                    >
                                        {tf.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                            <button className="filter-btn">
                                <FaFilter /> Filters
                            </button>
                        </div>
                    </div>

                    {/* Mobile-Optimized Rankings Table */}
                    <div className="traders-table-container">
                        <div className="table-header">
                            <div className="th rank">#</div>
                            <div className="th trader">Trader</div>
                            <div className="th pnl">PnL</div>
                            <div className="th volume mobile-hide">Volume</div>
                            <div className="th win-rate mobile-hide">Win Rate</div>
                            <div className="th actions mobile-hide">Actions</div>
                        </div>

                        <div className="table-body">
                            {filteredTraders.map((trader, index) => (
                                <div 
                                    key={trader.id} 
                                    className="table-row"
                                    onClick={() => setSelectedTrader(trader)}
                                >
                                    <div className="td rank">
                                        {index < 3 ? (
                                            <div className={`trophy-icon rank-${index + 1}`}>
                                                <FaTrophy />
                                            </div>
                                        ) : (
                                            `#${index + 1}`
                                        )}
                                    </div>
                                    <div className="td trader">
                                        <div className="trader-info">
                                            <div className="trader-avatar">
                                                {trader.avatar || trader.username[0].toUpperCase()}
                                            </div>
                                            <div className="trader-details">
                                                <span className="trader-name">{trader.username}</span>
                                                <span className="trader-address">
                                                    {`${trader.address.slice(0, 6)}...${trader.address.slice(-4)}`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`td pnl ${trader.stats[timeframe].pnl >= 0 ? 'positive' : 'negative'}`}>
                                        <div className="pnl-info">
                                            <span className="pnl-value">
                                                {formatNumber(trader.stats[timeframe].pnl)}
                                            </span>
                                            <span className="pnl-percentage">
                                                {formatPercentage(trader.stats[timeframe].pnlPercentage)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="td volume mobile-hide">
                                        {formatNumber(trader.stats[timeframe].volume)}
                                    </div>
                                    <div className="td win-rate mobile-hide">
                                        <div className="win-rate-wrapper">
                                            <div className="win-rate-bar">
                                                <div 
                                                    className="win-rate-fill"
                                                    style={{ width: `${trader.stats[timeframe].winRate}%` }}
                                                />
                                            </div>
                                            <span>{trader.stats[timeframe].winRate}%</span>
                                        </div>
                                    </div>
                                    <div className="td actions mobile-hide">
                                        <a 
                                            href={`https://bscscan.com/address/${trader.address}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="action-btn"
                                        >
                                            <FaExternalLinkAlt />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PnL; 