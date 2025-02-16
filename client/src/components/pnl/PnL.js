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
                    pnl: 185000,
                    pnlPercentage: 18.5,
                    volume: 3500000,
                    trades: 52,
                    winRate: 85,
                    totalValue: 1850000
                },
                '7d': {
                    pnl: 650000,
                    pnlPercentage: 65.0,
                    volume: 12500000,
                    trades: 186,
                    winRate: 88,
                    totalValue: 2150000
                },
                '30d': {
                    pnl: 1850000,
                    pnlPercentage: 185.0,
                    volume: 35000000,
                    trades: 689,
                    winRate: 82,
                    totalValue: 3250000
                },
                'ALL': {
                    pnl: 7500000,
                    pnlPercentage: 750.0,
                    volume: 145000000,
                    trades: 2856,
                    winRate: 85,
                    totalValue: 8500000
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
                    pnl: 125000,
                    pnlPercentage: 12.5,
                    volume: 2800000,
                    trades: 42,
                    winRate: 82,
                    totalValue: 1450000
                },
                '7d': {
                    pnl: 480000,
                    pnlPercentage: 48.0,
                    volume: 9500000,
                    trades: 143,
                    winRate: 84,
                    totalValue: 1750000
                },
                '30d': {
                    pnl: 1450000,
                    pnlPercentage: 145.0,
                    volume: 28000000,
                    trades: 532,
                    winRate: 80,
                    totalValue: 2650000
                },
                'ALL': {
                    pnl: 5800000,
                    pnlPercentage: 580.0,
                    volume: 115000000,
                    trades: 2276,
                    winRate: 82,
                    totalValue: 6850000
                }
            }
        },
        {
            id: 3,
            username: 'AlphaTrader',
            address: '0x456...def',
            avatar: '🎯',
            stats: {
                '24h': {
                    pnl: 65000,
                    pnlPercentage: 6.5,
                    volume: 1200000,
                    trades: 28,
                    winRate: 75,
                    totalValue: 850000
                },
                '7d': {
                    pnl: 280000,
                    pnlPercentage: 28.0,
                    volume: 5500000,
                    trades: 98,
                    winRate: 77,
                    totalValue: 980000
                },
                '30d': {
                    pnl: 820000,
                    pnlPercentage: 82.0,
                    volume: 16000000,
                    trades: 385,
                    winRate: 73,
                    totalValue: 1650000
                },
                'ALL': {
                    pnl: 3200000,
                    pnlPercentage: 320.0,
                    volume: 75000000,
                    trades: 1654,
                    winRate: 75,
                    totalValue: 4200000
                }
            }
        },
        {
            id: 4,
            username: 'TradingNinja',
            address: '0x789...ghi',
            avatar: '⚔️',
            stats: {
                '24h': {
                    pnl: 45000,
                    pnlPercentage: 4.5,
                    volume: 950000,
                    trades: 25,
                    winRate: 70,
                    totalValue: 750000
                },
                '7d': {
                    pnl: 220000,
                    pnlPercentage: 22.0,
                    volume: 4800000,
                    trades: 85,
                    winRate: 72,
                    totalValue: 880000
                },
                '30d': {
                    pnl: 680000,
                    pnlPercentage: 68.0,
                    volume: 14000000,
                    trades: 342,
                    winRate: 68,
                    totalValue: 1450000
                },
                'ALL': {
                    pnl: 2800000,
                    pnlPercentage: 280.0,
                    volume: 65000000,
                    trades: 1543,
                    winRate: 70,
                    totalValue: 3800000
                }
            }
        },
        {
            id: 5,
            username: 'CryptoSage',
            address: '0xabc...jkl',
            avatar: '🧙',
            stats: {
                '24h': {
                    pnl: 35000,
                    pnlPercentage: 3.5,
                    volume: 850000,
                    trades: 22,
                    winRate: 68,
                    totalValue: 650000
                },
                '7d': {
                    pnl: 180000,
                    pnlPercentage: 18.0,
                    volume: 4200000,
                    trades: 76,
                    winRate: 70,
                    totalValue: 780000
                },
                '30d': {
                    pnl: 580000,
                    pnlPercentage: 58.0,
                    volume: 12000000,
                    trades: 298,
                    winRate: 65,
                    totalValue: 1250000
                },
                'ALL': {
                    pnl: 2400000,
                    pnlPercentage: 240.0,
                    volume: 55000000,
                    trades: 1432,
                    winRate: 68,
                    totalValue: 3400000
                }
            }
        },
        {
            id: 6,
            username: 'BullRunner',
            address: '0xdef...mno',
            avatar: '🐂',
            stats: {
                '24h': {
                    pnl: 28000,
                    pnlPercentage: 2.8,
                    volume: 720000,
                    trades: 18,
                    winRate: 65,
                    totalValue: 580000
                },
                '7d': {
                    pnl: 150000,
                    pnlPercentage: 15.0,
                    volume: 3800000,
                    trades: 65,
                    winRate: 67,
                    totalValue: 680000
                },
                '30d': {
                    pnl: 480000,
                    pnlPercentage: 48.0,
                    volume: 10000000,
                    trades: 265,
                    winRate: 63,
                    totalValue: 1150000
                },
                'ALL': {
                    pnl: 2100000,
                    pnlPercentage: 210.0,
                    volume: 48000000,
                    trades: 1321,
                    winRate: 65,
                    totalValue: 3100000
                }
            }
        },
        {
            id: 7,
            username: 'PhoenixTrader',
            address: '0xghi...pqr',
            avatar: '🔥',
            stats: {
                '24h': {
                    pnl: 22000,
                    pnlPercentage: 2.2,
                    volume: 650000,
                    trades: 15,
                    winRate: 62,
                    totalValue: 520000
                },
                '7d': {
                    pnl: 120000,
                    pnlPercentage: 12.0,
                    volume: 3200000,
                    trades: 58,
                    winRate: 65,
                    totalValue: 620000
                },
                '30d': {
                    pnl: 420000,
                    pnlPercentage: 42.0,
                    volume: 9000000,
                    trades: 234,
                    winRate: 60,
                    totalValue: 1050000
                },
                'ALL': {
                    pnl: 1800000,
                    pnlPercentage: 180.0,
                    volume: 42000000,
                    trades: 1234,
                    winRate: 63,
                    totalValue: 2800000
                }
            }
        }
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