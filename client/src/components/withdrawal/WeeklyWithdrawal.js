import React, { useState } from 'react';
import { 
    FaChartLine, FaMoneyBillWave, FaExchangeAlt, 
    FaChartPie, FaCalendarAlt, FaArrowUp, FaArrowDown,
    FaDollarSign, FaWallet, FaHistory
} from 'react-icons/fa';
import './WeeklyWithdrawal.css';

const WeeklyWithdrawal = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('current');

    // Mock data for company stats
    const companyStats = {
        totalLiquidity: 85000000,      // 85M total liquidity
        weeklyTurnover: 247000000,     // 247M weekly turnover (as specified)
        weeklyProfit: 22000000,        // 22M weekly profit (as specified)
        totalUsers: 15200,             // Total registered users
        activeUsers: 12800,            // Active users (84% of total)
        weeklyWithdrawals: 18500000,   // 18.5M in withdrawals
        weeklyDeposits: 28700000,      // 28.7M in deposits
        profitPercentage: 8.9,         // 8.9% profit rate (22M/247M)
        userGrowth: 5.8                // 5.8% weekly user growth
    };

    // Mock data for weekly withdrawals
    const weeklyData = [
        {
            week: 'Week 1',
            date: 'Feb 3 - Feb 10, 2024',
            withdrawals: 18500000,      // 18.5M withdrawals
            deposits: 28700000,         // 28.7M deposits
            profit: 22000000,           // 22M profit (as specified)
            turnover: 247000000,        // 247M turnover (as specified)
            userCount: 12800,           // Active users
            profitPercentage: 8.9       // 8.9% profit rate
        }
    ];

    return (
        <div className="withdrawal-container">
            {/* Header Section */}
            <div className="withdrawal-header">
                <h1>Weekly Withdrawal Report</h1>
                <div className="period-selector">
                    <button 
                        className={selectedPeriod === 'current' ? 'active' : ''}
                        onClick={() => setSelectedPeriod('current')}
                    >
                        Current Week
                    </button>
                    <button 
                        className={selectedPeriod === 'previous' ? 'active' : ''}
                        onClick={() => setSelectedPeriod('previous')}
                    >
                        Previous Weeks
                    </button>
                </div>
            </div>

            {/* Company Stats Grid */}
            <div className="company-stats-grid">
                <div className="stat-card liquidity">
                    <div className="stat-icon">
                        <FaWallet />
                    </div>
                    <div className="stat-content">
                        <h3>Total Liquidity</h3>
                        <div className="stat-value">
                            ${companyStats.totalLiquidity.toLocaleString()}
                        </div>
                        <div className="stat-change positive">
                            <FaArrowUp /> 8.5% from last week
                        </div>
                    </div>
                </div>

                <div className="stat-card turnover">
                    <div className="stat-icon">
                        <FaExchangeAlt />
                    </div>
                    <div className="stat-content">
                        <h3>Weekly Turnover</h3>
                        <div className="stat-value">
                            ${companyStats.weeklyTurnover.toLocaleString()}
                        </div>
                        <div className="stat-change positive">
                            <FaArrowUp /> 12.3% from last week
                        </div>
                    </div>
                </div>

                <div className="stat-card profit">
                    <div className="stat-icon">
                        <FaChartLine />
                    </div>
                    <div className="stat-content">
                        <h3>Weekly Profit</h3>
                        <div className="stat-value">
                            ${companyStats.weeklyProfit.toLocaleString()}
                        </div>
                        <div className="stat-change positive">
                            <FaArrowUp /> {companyStats.profitPercentage}% rate
                        </div>
                    </div>
                </div>

                <div className="stat-card users">
                    <div className="stat-icon">
                        <FaChartPie />
                    </div>
                    <div className="stat-content">
                        <h3>Active Users</h3>
                        <div className="stat-value">
                            {companyStats.activeUsers.toLocaleString()}
                        </div>
                        <div className="stat-change positive">
                            <FaArrowUp /> {companyStats.userGrowth}% growth
                        </div>
                    </div>
                </div>
            </div>

            {/* Wallet Actions */}
            <div className="wallet-actions">
                <button className="action-btn buy">
                    <FaMoneyBillWave />
                    <span>Buy</span>
                </button>
                <button className="action-btn sell">
                    <FaDollarSign />
                    <span>Sell</span>
                </button>
                <button className="action-btn swap">
                    <FaExchangeAlt />
                    <span>Swap</span>
                </button>
                <button className="action-btn receive">
                    <FaArrowDown />
                    <span>Receive</span>
                </button>
                <div className="action-btn more">
                    <FaChartLine />
                    <span>More</span>
                </div>
            </div>

            {/* Weekly History Table */}
            <div className="weekly-history-section">
                <h2>
                    <FaHistory /> Weekly Performance History
                </h2>
                <div className="weekly-table">
                    <div className="table-header">
                        <div className="th">Week</div>
                        <div className="th">Withdrawals</div>
                        <div className="th">Deposits</div>
                        <div className="th">Turnover</div>
                        <div className="th">Profit</div>
                        <div className="th">Users</div>
                    </div>
                    <div className="table-body">
                        {weeklyData.map((week, index) => (
                            <div key={week.week} className="table-row">
                                <div className="td week-info">
                                    <span className="week-number">{week.week}</span>
                                    <span className="week-date">{week.date}</span>
                                </div>
                                <div className="td withdrawals">
                                    <FaMoneyBillWave className="icon" />
                                    ${week.withdrawals.toLocaleString()}
                                </div>
                                <div className="td deposits">
                                    <FaDollarSign className="icon" />
                                    ${week.deposits.toLocaleString()}
                                </div>
                                <div className="td turnover">
                                    <FaExchangeAlt className="icon" />
                                    ${week.turnover.toLocaleString()}
                                </div>
                                <div className="td profit">
                                    <div className="profit-info">
                                        <span>${week.profit.toLocaleString()}</span>
                                        <span className="profit-percentage">
                                            {week.profitPercentage}%
                                        </span>
                                    </div>
                                </div>
                                <div className="td users">
                                    {week.userCount.toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Additional Info Section */}
            <div className="info-section">
                <div className="info-card">
                    <h3>
                        <FaCalendarAlt /> Withdrawal Schedule
                    </h3>
                    <p>Withdrawals are processed every Friday at 12:00 UTC</p>
                    <p>Minimum withdrawal amount: $100</p>
                    <p>Maximum withdrawal amount: $100,000 per week</p>
                </div>
                <div className="info-card">
                    <h3>
                        <FaChartLine /> Performance Metrics
                    </h3>
                    <p>Average weekly profit: 23.2%</p>
                    <p>User growth rate: 12.5% weekly</p>
                    <p>Average transaction volume: $3.2M weekly</p>
                </div>
            </div>
        </div>
    );
};

export default WeeklyWithdrawal; 