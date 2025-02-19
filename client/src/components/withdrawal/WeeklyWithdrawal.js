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
        totalLiquidity: 25800000,
        weeklyTurnover: 3450000,
        weeklyProfit: 850000,
        totalUsers: 15200,
        activeUsers: 8500,
        weeklyWithdrawals: 650000,
        weeklyDeposits: 950000,
        profitPercentage: 24.6,
        userGrowth: 12.5
    };

    // Mock data for weekly withdrawals
    const weeklyData = [
        {
            week: 'Week 12',
            date: 'Mar 18 - Mar 24, 2024',
            withdrawals: 650000,
            deposits: 950000,
            profit: 850000,
            turnover: 3450000,
            userCount: 8500,
            profitPercentage: 24.6
        },
        {
            week: 'Week 11',
            date: 'Mar 11 - Mar 17, 2024',
            withdrawals: 580000,
            deposits: 820000,
            profit: 720000,
            turnover: 3100000,
            userCount: 8200,
            profitPercentage: 23.2
        },
        {
            week: 'Week 10',
            date: 'Mar 4 - Mar 10, 2024',
            withdrawals: 520000,
            deposits: 780000,
            profit: 680000,
            turnover: 2950000,
            userCount: 7800,
            profitPercentage: 23.1
        },
        {
            week: 'Week 9',
            date: 'Feb 26 - Mar 3, 2024',
            withdrawals: 480000,
            deposits: 720000,
            profit: 620000,
            turnover: 2800000,
            userCount: 7500,
            profitPercentage: 22.1
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