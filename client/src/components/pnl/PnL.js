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
import api from '../../config/axios';

const PnL = () => {
    const [timeframe, setTimeframe] = useState('24h');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTrader, setSelectedTrader] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [performanceData, setPerformanceData] = useState(null);
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch rankings data
    useEffect(() => {
        const fetchRankings = async () => {
            try {
                setLoading(true);
                console.log('Fetching rankings data...');
                const response = await api.get('/api/rankings');
                console.log('Rankings response:', response.data);
                
                if (response.data.success) {
                    setRankings(response.data.rankings);
                } else {
                    setError('Failed to load rankings data');
                }
            } catch (err) {
                console.error('Error fetching rankings:', err);
                setError('Failed to load trader rankings');
            } finally {
                setLoading(false);
            }
        };

        fetchRankings();
    }, []);

    // Filter rankings based on search query
    const filteredRankings = rankings.filter(trader => 
        trader.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trader.walletAddress.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleTraderClick = (trader) => {
        setIsLoading(true);
        setSelectedTrader({
            id: trader.rank,
            username: trader.username,
            address: trader.walletAddress,
            avatar: trader.username[0].toUpperCase(),
            stats: {
                [timeframe]: {
                    pnl: trader.stats.totalPnL,
                    pnlPercentage: trader.stats.winRate,
                    volume: trader.stats.totalVolume,
                    trades: trader.stats.totalTrades,
                    winRate: trader.stats.winRate,
                    totalValue: trader.stats.totalVolume
                }
            }
        });

        // Generate performance data
        setTimeout(() => {
            setPerformanceData(generatePerformanceData(trader));
            setTradingData(generateMockTrades());
            setIsLoading(false);
        }, 1000);
    };

    const formatAddress = (address) => {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const formatNumber = (num) => {
        if (typeof num !== 'number') return '0.00';
        return new Intl.NumberFormat('en-US', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(num);
    };

    const formatVolume = (volume) => {
        if (typeof volume !== 'number') return '$0.00';
        if (volume >= 1000000) {
            return `$${(volume / 1000000).toFixed(2)}M`;
        } else if (volume >= 1000) {
            return `$${(volume / 1000).toFixed(2)}K`;
        }
        return `$${volume.toFixed(2)}`;
    };

    if (loading) {
        return (
            <div className="pnl-container">
                <div className="pnl-loading">
                    Loading rankings...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="pnl-container">
                <div className="pnl-error">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="pnl-container">
            {/* Header Section */}
            <div className="pnl-header">
                <h1>Trader Rankings</h1>
                <div className="pnl-stats">
                    <div className="stat-box">
                        <FaUsers className="stat-icon" />
                        <div className="stat-info">
                            <span className="stat-value">{rankings.length}</span>
                            <span className="stat-label">Active Traders</span>
                        </div>
                    </div>
                    <div className="stat-box">
                        <FaChartLine className="stat-icon" />
                        <div className="stat-info">
                            <span className="stat-value">
                                {formatVolume(rankings.reduce((sum, trader) => sum + trader.stats.totalVolume, 0))}
                            </span>
                            <span className="stat-label">Total Volume</span>
                        </div>
                    </div>
                    <div className="stat-box">
                        <FaTrophy className="stat-icon" />
                        <div className="stat-info">
                            <span className="stat-value">
                                {formatNumber(rankings.reduce((sum, trader) => sum + trader.stats.winRate, 0) / rankings.length)}%
                            </span>
                            <span className="stat-label">Avg. Win Rate</span>
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
                            <div className="rank-col">Rank</div>
                            <div className="trader-col">Trader</div>
                            <div className="pnl-col">Total PnL</div>
                            <div className="trades-col">Trades</div>
                            <div className="winrate-col">Win Rate</div>
                            <div className="volume-col">Volume</div>
                        </div>
                        <div className="table-body">
                            {filteredRankings.map((trader) => (
                                <div 
                                    key={trader.walletAddress} 
                                    className={`table-row ${selectedTrader?.address === trader.walletAddress ? 'selected' : ''}`}
                                    onClick={() => handleTraderClick(trader)}
                                >
                                    <div className="rank-col">
                                        {trader.rank <= 3 ? (
                                            <div className="rank-badge">
                                                {trader.rank === 1 ? (
                                                    <FaCrown style={{ color: '#FFD700' }} />
                                                ) : trader.rank === 2 ? (
                                                    <FaMedal style={{ color: '#C0C0C0' }} />
                                                ) : (
                                                    <FaMedal style={{ color: '#CD7F32' }} />
                                                )}
                                            </div>
                                        ) : null}
                                        #{trader.rank}
                                    </div>
                                    <div className="trader-col">
                                        <span className="trader-name">{trader.username}</span>
                                        <span className="trader-address">{formatAddress(trader.walletAddress)}</span>
                                    </div>
                                    <div className={`pnl-col ${trader.stats.totalPnL >= 0 ? 'positive' : 'negative'}`}>
                                        ${formatNumber(Math.abs(trader.stats.totalPnL))}
                                    </div>
                                    <div className="trades-col">{trader.stats.totalTrades}</div>
                                    <div className="winrate-col">{formatNumber(trader.stats.winRate)}%</div>
                                    <div className="volume-col">{formatVolume(trader.stats.totalVolume)}</div>
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