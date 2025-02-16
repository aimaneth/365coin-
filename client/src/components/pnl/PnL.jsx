import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatNumber, formatPercentage, shortenAddress } from '../../utils/format';
import './PnL.css';

const PnL = () => {
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get('/api/rankings');
                console.log('Rankings response:', response.data);
                
                if (response.data.success) {
                    setRankings(response.data.rankings || []);
                } else {
                    throw new Error(response.data.message || 'Failed to fetch rankings');
                }
            } catch (err) {
                console.error('Error fetching rankings:', err);
                setError(err.message || 'Failed to fetch rankings');
            } finally {
                setLoading(false);
            }
        };

        fetchRankings();
    }, []);

    if (loading) {
        return <div className="pnl-loading">Loading trader rankings...</div>;
    }

    if (error) {
        return <div className="pnl-error">Error: {error}</div>;
    }

    if (!rankings || rankings.length === 0) {
        return <div className="pnl-container">
            <div className="pnl-header">
                <h1>Trader Rankings</h1>
            </div>
            <div className="pnl-error">No trader data available</div>
        </div>;
    }

    return (
        <div className="pnl-container">
            <div className="pnl-header">
                <h1>Trader Rankings</h1>
            </div>

            <div className="rankings-section">
                <div className="rankings-table">
                    <div className="table-header">
                        <div>Rank</div>
                        <div>Trader</div>
                        <div>Total PnL</div>
                        <div className="trades-col">Trades</div>
                        <div className="winrate-col">Win Rate</div>
                        <div className="volume-col">Volume</div>
                    </div>
                    <div className="table-body">
                        {rankings.map((trader) => (
                            <div key={trader.username} className="table-row">
                                <div className="rank-cell">
                                    {trader.rank <= 3 ? (
                                        <div className={`rank-badge rank-${trader.rank}`}>
                                            {trader.rank}
                                        </div>
                                    ) : (
                                        <span className="rank-number">{trader.rank}</span>
                                    )}
                                </div>
                                <div className="trader-cell">
                                    <div className="trader-name">{trader.username}</div>
                                    <div className="trader-address">
                                        {shortenAddress(trader.walletAddress)}
                                    </div>
                                </div>
                                <div className={`pnl-cell ${trader.stats.totalPnL >= 0 ? 'positive' : 'negative'}`}>
                                    <div className="pnl-value">
                                        {formatNumber(trader.stats.totalPnL, 2)} USDT
                                    </div>
                                </div>
                                <div className="trades-col">
                                    {trader.stats.totalTrades}
                                </div>
                                <div className="winrate-col">
                                    {formatPercentage(trader.stats.winRate)}
                                </div>
                                <div className="volume-col">
                                    {formatNumber(trader.stats.totalVolume, 2)} USDT
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PnL; 