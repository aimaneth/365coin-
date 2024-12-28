import React, { useState, useEffect } from 'react';
import { 
    FaSearch, FaChartLine, FaExternalLinkAlt, FaFilter, 
    FaArrowUp, FaArrowDown, FaTrophy, FaUsers, FaChartArea,
    FaWallet, FaTimes, FaMedal, FaCrown, FaStar
} from 'react-icons/fa';
import PerformanceGraph from './PerformanceGraph';
import TradingGraph from './TradingGraph';
import TradeHistory from './TradeHistory';
import './PnL.css';
import './TraderDetails.css';

const PnL = () => {
    const [timeframe, setTimeframe] = useState('24h');
    const [sortBy, setSortBy] = useState('pnl');
    const [sortOrder, setSortOrder] = useState('desc');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTrader, setSelectedTrader] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [performanceData, setPerformanceData] = useState(null);

    // Mock data - replace with API calls
    const traders = [
        {
            id: 1,
            username: 'CryptoWhale',
            address: '0x742d...44e',
            avatar: '🐋',
            stats: {
                '24h': {
                    pnl: 125000,
                    pnlPercentage: 12.5,
                    volume: 2500000,
                    trades: 45,
                    winRate: 78,
                    totalValue: 1250000
                },
                '7d': {
                    pnl: 450000,
                    pnlPercentage: 45.0,
                    volume: 8500000,
                    trades: 156,
                    winRate: 82,
                    totalValue: 1450000
                },
                '30d': {
                    pnl: 1250000,
                    pnlPercentage: 125.0,
                    volume: 25000000,
                    trades: 589,
                    winRate: 75,
                    totalValue: 2250000
                },
                'ALL': {
                    pnl: 5250000,
                    pnlPercentage: 525.0,
                    volume: 105000000,
                    trades: 2456,
                    winRate: 80,
                    totalValue: 6250000
                }
            }
        },
        {
            id: 2,
            username: 'DiamondHands',
            address: '0x123...abc',
            avatar: '💎',
            stats: {
                '24h': {
                    pnl: 85000,
                    pnlPercentage: 8.5,
                    volume: 1500000,
                    trades: 32,
                    winRate: 72,
                    totalValue: 950000
                },
                '7d': {
                    pnl: 320000,
                    pnlPercentage: 32.0,
                    volume: 6500000,
                    trades: 123,
                    winRate: 75,
                    totalValue: 1150000
                },
                '30d': {
                    pnl: 950000,
                    pnlPercentage: 95.0,
                    volume: 19000000,
                    trades: 432,
                    winRate: 70,
                    totalValue: 1850000
                },
                'ALL': {
                    pnl: 3850000,
                    pnlPercentage: 385.0,
                    volume: 85000000,
                    trades: 1876,
                    winRate: 73,
                    totalValue: 4850000
                }
            }
        }
        // Add more traders...
    ];

    // Generate mock performance data when a trader is selected
    const generatePerformanceData = (trader) => {
        const currentTime = Math.floor(Date.now() / 1000);
        const data = [];
        
        // Generate data points for the last 7 days
        for (let i = 0; i < 7; i++) {
            data.push({
                time: currentTime - (6 - i) * 86400, // 86400 seconds in a day
                value: Math.random() * 100 - 50 // Random values between -50 and 50
            });
        }

        return data;
    };

    const generateMockTrades = () => {
        const currentTime = Math.floor(Date.now() / 1000);
        return {
            candlesticks: Array.from({ length: 100 }, (_, i) => {
                const time = currentTime - (100 - i) * 300;
                const basePrice = 100 + Math.sin(i * 0.1) * 20;
                const range = 5 + Math.random() * 5;
                const open = basePrice + (Math.random() - 0.5) * range;
                const close = basePrice + (Math.random() - 0.5) * range;
                const high = Math.max(open, close) + Math.random() * 2;
                const low = Math.min(open, close) - Math.random() * 2;

                return {
                    time,
                    open,
                    high,
                    low,
                    close
                };
            }),
            trades: [
                {
                    time: currentTime - 1800,
                    type: 'buy',
                    amount: '0.5 BTC',
                    price: 35000
                },
                {
                    time: currentTime - 900,
                    type: 'sell',
                    amount: '0.5 BTC',
                    price: 35500
                }
            ]
        };
    };

    const [tradingData, setTradingData] = useState(generateMockTrades());

    const handleTraderSelect = (trader) => {
        setIsLoading(true);
        setSelectedTrader(trader);
        
        // Simulate API call and generate data
        setTimeout(() => {
            setPerformanceData(generatePerformanceData(trader));
            setTradingData(generateMockTrades());
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="pnl-container">
            {/* Header Section */}
            <div className="pnl-header">
                <h1>Trader Rankings</h1>
                <div className="pnl-stats">
                    <div className="stat-box">
                        <FaUsers className="stat-icon" />
                        <div className="stat-info">
                            <span className="stat-value">15.2K</span>
                            <span className="stat-label">Active Traders</span>
                        </div>
                    </div>
                    <div className="stat-box">
                        <FaChartLine className="stat-icon" />
                        <div className="stat-info">
                            <span className="stat-value">$2.5M</span>
                            <span className="stat-label">24h Volume</span>
                        </div>
                    </div>
                    <div className="stat-box">
                        <FaTrophy className="stat-icon" />
                        <div className="stat-info">
                            <span className="stat-value">82%</span>
                            <span className="stat-label">Success Rate</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pnl-content">
                {/* Left Section - Rankings */}
                <div className="rankings-section">
                    {/* Controls Section */}
                    <div className="pnl-controls">
                        <div className="search-wrapper">
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search traders..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="timeframe-controls">
                            {['24h', '7d', '30d', 'ALL'].map(tf => (
                                <button
                                    key={tf}
                                    className={`timeframe-btn ${timeframe === tf ? 'active' : ''}`}
                                    onClick={() => setTimeframe(tf)}
                                >
                                    {tf}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Rankings Table */}
                    <div className="rankings-table">
                        <div className="table-header">
                            <div className="th">Rank</div>
                            <div className="th">Trader</div>
                            <div className="th">PnL</div>
                            <div className="th">Volume</div>
                            <div className="th">Win Rate</div>
                        </div>
                        <div className="table-body">
                            {traders.map((trader, index) => (
                                <div 
                                    key={trader.id}
                                    className={`table-row ${selectedTrader?.id === trader.id ? 'selected' : ''}`}
                                    onClick={() => handleTraderSelect(trader)}
                                >
                                    <div className="td rank">
                                        {index < 3 ? (
                                            <div className="rank-badge">
                                                {index === 0 ? (
                                                    <FaCrown style={{ color: '#FFD700' }} data-tooltip="Top Trader" />
                                                ) : index === 1 ? (
                                                    <FaMedal style={{ color: '#C0C0C0' }} data-tooltip="Runner Up" />
                                                ) : (
                                                    <FaMedal style={{ color: '#CD7F32' }} data-tooltip="Third Place" />
                                                )}
                                            </div>
                                        ) : null}
                                        <span className="rank-number">#{index + 1}</span>
                                        <span className="trader-avatar" data-tooltip={`Trader Level ${Math.floor(Math.random() * 50) + 1}`}>
                                            {trader.avatar}
                                        </span>
                                    </div>
                                    <div className="td trader-info">
                                        <span className="trader-name">{trader.username}</span>
                                        <span className="trader-address">
                                            <FaWallet />
                                            {trader.address}
                                        </span>
                                    </div>
                                    <div className="td pnl">
                                        <span className={`pnl-value ${(trader.stats[timeframe]?.pnl || 0) >= 0 ? 'positive' : 'negative'}`}>
                                            {(trader.stats[timeframe]?.pnl || 0) >= 0 ? '+' : '-'}
                                            ${Math.abs(trader.stats[timeframe]?.pnl || 0).toLocaleString()}
                                        </span>
                                        <span className="pnl-percentage">
                                            {trader.stats[timeframe]?.pnlPercentage || 0}%
                                        </span>
                                    </div>
                                    <div className="td volume">
                                        ${(trader.stats[timeframe]?.volume || 0).toLocaleString()}
                                    </div>
                                    <div className="td win-rate">
                                        <div className="win-rate-bar">
                                            <div 
                                                className="win-rate-fill"
                                                style={{ width: `${trader.stats[timeframe]?.winRate || 0}%` }}
                                            />
                                        </div>
                                        <span>{trader.stats[timeframe]?.winRate || 0}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Section - Trader Details */}
                <div className={`trader-details-section ${selectedTrader ? 'active' : ''}`}>
                    {selectedTrader && (
                        <>
                            <div className="trader-details-header">
                                <div className="trader-profile">
                                    <div className="trader-avatar-large">{selectedTrader.avatar}</div>
                                    <div className="trader-info-large">
                                        <h2 className="trader-name-large">{selectedTrader.username}</h2>
                                        <div className="trader-address-large">
                                            <FaWallet />
                                            <span>{selectedTrader.address}</span>
                                            <button className="copy-btn">
                                                <FaExternalLinkAlt />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    className="close-details-btn"
                                    onClick={() => setSelectedTrader(null)}
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="trader-stats-grid">
                                <div className="stat-card" data-tooltip="Total portfolio value including unrealized gains">
                                    <span className="stat-title">Total Value</span>
                                    <span className="stat-value">
                                        ${selectedTrader.stats[timeframe].totalValue.toLocaleString()}
                                    </span>
                                </div>
                                <div className="stat-card" data-tooltip="Profit/Loss for the selected timeframe">
                                    <span className="stat-title">PnL</span>
                                    <span className={`stat-value ${selectedTrader.stats[timeframe].pnl >= 0 ? 'positive' : 'negative'}`}>
                                        {selectedTrader.stats[timeframe].pnl >= 0 ? '+' : '-'}
                                        ${Math.abs(selectedTrader.stats[timeframe].pnl).toLocaleString()}
                                    </span>
                                    <span className="stat-subtitle">
                                        {selectedTrader.stats[timeframe].pnlPercentage}% {selectedTrader.stats[timeframe].pnlPercentage >= 0 ? '↑' : '↓'}
                                    </span>
                                </div>
                                <div className="stat-card" data-tooltip="Percentage of profitable trades">
                                    <span className="stat-title">Win Rate</span>
                                    <span className="stat-value">
                                        {selectedTrader.stats[timeframe].winRate}%
                                        <FaStar style={{ color: '#FFD700', marginLeft: '8px' }} />
                                    </span>
                                </div>
                                <div className="stat-card" data-tooltip="Number of completed trades">
                                    <span className="stat-title">Total Trades</span>
                                    <span className="stat-value">
                                        {selectedTrader.stats[timeframe].trades.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <div className="trader-charts">
                                <div className="charts-row">
                                    <div className="chart-container">
                                        <h2 className="section-header">Performance</h2>
                                        {isLoading ? (
                                            <div className="graph-loading">
                                                <div className="loading-spinner" />
                                            </div>
                                        ) : performanceData ? (
                                            <PerformanceGraph 
                                                data={performanceData} 
                                                timeframe={timeframe} 
                                            />
                                        ) : null}
                                    </div>

                                    <div className="chart-container">
                                        <h2 className="section-header">Trading History</h2>
                                        <TradingGraph 
                                            data={tradingData.candlesticks} 
                                            trades={tradingData.trades} 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="trade-history-section">
                                <h2 className="section-header">Trade History</h2>
                                <TradeHistory trades={[
                                    {
                                        time: Date.now() / 1000,
                                        type: 'buy',
                                        entryPrice: 35000,
                                        exitPrice: 36500,
                                        amount: '0.5 BTC',
                                        pnl: 750,
                                        roi: 4.28
                                    },
                                    {
                                        time: (Date.now() - 86400000) / 1000,
                                        type: 'sell',
                                        entryPrice: 37000,
                                        exitPrice: 35800,
                                        amount: '0.3 BTC',
                                        pnl: -360,
                                        roi: -3.24
                                    },
                                    // Add more mock trades...
                                ]} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PnL; 