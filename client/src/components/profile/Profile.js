import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../../utils/connectors';
import { FaWallet, FaUser, FaEnvelope, FaCopy, FaCheck, FaExclamationCircle, FaPlus, FaTrash, FaArrowUp, FaArrowDown, FaChartLine, FaExchangeAlt, FaClock, FaShoppingCart, FaRocket, FaCrown, FaGem, FaSync } from 'react-icons/fa';
import './Profile.css';
import WalletGraph from './WalletGraph';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user, connectWalletToAccount, disconnectWalletFromAccount } = useAuth();
    const { active, account, activate, deactivate } = useWeb3React();
    const [isConnecting, setIsConnecting] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');
    const [selectedWallet, setSelectedWallet] = useState(null);

    // Dummy data for each wallet
    const getWalletData = (address) => ({
        balance: '1000 365COIN',
        balanceUSD: '$5,000',
        profitLoss: {
            percentage: '+15.8%',
            usdValue: '+$789.50',
            isPositive: true
        },
        stats: {
            '24h': {
                change: '+5.2%',
                volume: '$12,345',
                isPositive: true
            },
            '7d': {
                change: '+12.8%',
                volume: '$85,432',
                isPositive: true
            },
            '30d': {
                change: '-3.5%',
                volume: '$234,567',
                isPositive: false
            }
        },
        recentActivity: [
            {
                type: 'Buy',
                amount: '500 365COIN',
                price: '$2,500',
                time: '2 hours ago'
            },
            {
                type: 'Sell',
                amount: '200 365COIN',
                price: '$1,100',
                time: '5 hours ago'
            }
        ],
        transactions: [
            {
                id: 1,
                type: 'Purchase',
                amount: '1,000 365COIN',
                date: '2024-03-15',
                status: 'Completed',
                hash: '0x1234...5678'
            }
        ]
    });

    const connectNewWallet = async () => {
        setIsConnecting(true);
        setError('');
        
        try {
            if (!window.ethereum) {
                throw new Error('Please install MetaMask to connect your wallet');
            }

            // Request account access
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });

            // Get the first account
            const newAccount = accounts[0];

            // Activate Web3React
            await activate(injected);

            // Save wallet to user account through AuthContext
            if (user && newAccount) {
                try {
                    await connectWalletToAccount(newAccount);
                    console.log('Wallet connected and saved:', newAccount);
                    setSelectedWallet(newAccount);
                } catch (error) {
                    console.error('Error saving wallet to account:', error);
                    setError('Failed to save wallet to account');
                }
            }
        } catch (error) {
            console.error('Connection error:', error);
            setError(error.message || 'Failed to connect wallet');
        } finally {
            setIsConnecting(false);
        }
    };

    const switchWallet = async (walletAddress) => {
        try {
            // Disconnect current wallet if any
            if (active) {
                await deactivate();
            }
            
            // Request account access
            await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            // Switch to BSC network if needed
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x38' }], // BSC Mainnet
                });
            } catch (switchError) {
                // If BSC network is not added, add it
                if (switchError.code === 4902) {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: '0x38',
                            chainName: 'Binance Smart Chain',
                            nativeCurrency: {
                                name: 'BNB',
                                symbol: 'BNB',
                                decimals: 18
                            },
                            rpcUrls: ['https://bsc-dataseed.binance.org/'],
                            blockExplorerUrls: ['https://bscscan.com/']
                        }]
                    });
                }
            }
            
            // Activate Web3React with the selected wallet
            await activate(injected);
            setSelectedWallet(walletAddress);
            
            console.log('Switched to wallet:', walletAddress);
        } catch (error) {
            console.error('Error switching wallet:', error);
            setError('Failed to switch wallet');
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const disconnectWallet = async (walletAddress) => {
        try {
            // If it's the currently connected wallet, disconnect from Web3
            if (active && account.toLowerCase() === walletAddress.toLowerCase()) {
                await deactivate();
            }

            // Remove wallet from user's account
            await disconnectWalletFromAccount(walletAddress);
            
            // Clear selected wallet if it was selected
            if (selectedWallet === walletAddress) {
                setSelectedWallet(null);
            }
        } catch (error) {
            console.error('Error disconnecting wallet:', error);
            setError('Failed to disconnect wallet');
        }
    };

    const generateDummyGraphData = (timeframe) => {
        const labels = {
            '24h': Array.from({ length: 24 }, (_, i) => `${i}:00`),
            '7d': Array.from({ length: 7 }, (_, i) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]),
            '30d': Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`)
        };

        return {
            labels: labels[timeframe],
            datasets: [{
                data: Array.from({ length: labels[timeframe].length }, () => 
                    Math.random() * 1000 + 500
                ),
                borderColor: '#f0c000',
                backgroundColor: 'rgba(240, 192, 0, 0.1)',
                tension: 0.4,
                fill: true
            }]
        };
    };

    return (
        <div className="profile-container">
            {/* Profile Header */}
            <div className="profile-header">
                <div className="profile-avatar">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="profile-info">
                    <h1>{user?.username}</h1>
                    <p className="profile-email">
                        <FaEnvelope /> {user?.email}
                    </p>
                </div>
            </div>

            <div className="profile-grid">
                {/* Brand Section */}
                <div className="footer-brand">
                    {/* ... existing brand content */}
                </div>

                {/* Wallets Management Card */}
                <div className="profile-card wallets-card">
                    <h3>Your Wallets</h3>
                    <div className="wallets-list">
                        {user?.walletAddresses?.map((wallet) => (
                            <div 
                                key={wallet.address} 
                                className={`wallet-item ${selectedWallet === wallet.address ? 'selected' : ''}`}
                            >
                                <div 
                                    className="wallet-info"
                                    onClick={() => switchWallet(wallet.address)}
                                >
                                    <FaWallet className="wallet-icon" />
                                    <div className="wallet-details">
                                        <span className="wallet-address">
                                            {`${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`}
                                        </span>
                                        <span className="wallet-network">{wallet.network}</span>
                                    </div>
                                </div>
                                <div className="wallet-actions">
                                    <button 
                                        className="copy-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            copyToClipboard(wallet.address);
                                        }}
                                        title="Copy address"
                                    >
                                        {copied ? <FaCheck /> : <FaCopy />}
                                    </button>
                                    <button 
                                        className="disconnect-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            disconnectWallet(wallet.address);
                                        }}
                                        title="Disconnect wallet"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                        <button 
                            className="add-wallet-btn"
                            onClick={connectNewWallet}
                            disabled={isConnecting}
                        >
                            <FaPlus />
                            {isConnecting ? 'Connecting...' : 'Add New Wallet'}
                        </button>
                    </div>
                </div>

                {/* Selected Wallet Details */}
                {selectedWallet && (
                    <>
                        <div className="profile-card wallet-details-card">
                            <h3>Wallet Overview</h3>
                            <div className="wallet-overview">
                                <div className="balance-section">
                                    <div className="total-balance">
                                        <span className="label">Total Balance</span>
                                        <span className="value">{getWalletData(selectedWallet).balanceUSD}</span>
                                        <span className="token-balance">{getWalletData(selectedWallet).balance}</span>
                                    </div>
                                    <div className="profit-loss">
                                        <span className={`value ${getWalletData(selectedWallet).profitLoss.isPositive ? 'positive' : 'negative'}`}>
                                            {getWalletData(selectedWallet).profitLoss.percentage}
                                            <span className="usd-value">{getWalletData(selectedWallet).profitLoss.usdValue}</span>
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="wallet-actions-grid">
                                    <button className="wallet-action-btn send">
                                        <FaArrowUp className="action-icon" />
                                        <span className="action-label">Send</span>
                                    </button>
                                    <button className="wallet-action-btn receive">
                                        <FaArrowDown className="action-icon" />
                                        <span className="action-label">Receive</span>
                                    </button>
                                    <button className="wallet-action-btn buy">
                                        <FaShoppingCart className="action-icon" />
                                        <span className="action-label">Buy</span>
                                    </button>
                                    <button className="wallet-action-btn sell">
                                        <FaExchangeAlt className="action-icon" />
                                        <span className="action-label">Sell</span>
                                    </button>
                                </div>

                                <div className="stats-grid">
                                    {['24h', '7d', '30d'].map((period) => (
                                        <div key={period} className="stat-card">
                                            <span className="period">{period}</span>
                                            <span className={`change ${getWalletData(selectedWallet).stats[period].isPositive ? 'positive' : 'negative'}`}>
                                                {getWalletData(selectedWallet).stats[period].change}
                                            </span>
                                            <span className="volume">Vol: {getWalletData(selectedWallet).stats[period].volume}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="wallet-graph-container">
                                    <WalletGraph data={generateDummyGraphData('24h')} />
                                </div>

                                <div className="recent-activity">
                                    <h4>Recent Activity</h4>
                                    {getWalletData(selectedWallet).recentActivity.map((activity, index) => (
                                        <div key={index} className="activity-item">
                                            <div className="activity-type">
                                                <FaExchangeAlt className={activity.type.toLowerCase()} />
                                                <span>{activity.type}</span>
                                            </div>
                                            <div className="activity-details">
                                                <span className="amount">{activity.amount}</span>
                                                <span className="price">{activity.price}</span>
                                            </div>
                                            <div className="activity-time">
                                                <FaClock />
                                                <span>{activity.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="profile-card transactions-card">
                            <h3>Transaction History</h3>
                            <div className="transactions-list">
                                {getWalletData(selectedWallet).transactions.map(tx => (
                                    <div key={tx.id} className="transaction-item">
                                        <div className="transaction-info">
                                            <span className="transaction-type">{tx.type}</span>
                                            <span className="transaction-amount">{tx.amount}</span>
                                        </div>
                                        <div className="transaction-details">
                                            <span className="transaction-date">{tx.date}</span>
                                            <span className={`transaction-status ${tx.status.toLowerCase()}`}>
                                                {tx.status}
                                            </span>
                                            <a 
                                                href={`https://bscscan.com/tx/${tx.hash}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="transaction-hash"
                                            >
                                                View on BSCScan
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Profile; 