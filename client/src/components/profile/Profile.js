import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../../utils/connectors';
import { FaWallet, FaUser, FaEnvelope, FaCopy, FaCheck, FaExclamationCircle, FaPlus, FaTrash, FaArrowUp, FaArrowDown, FaChartLine, FaExchangeAlt, FaClock, FaShoppingCart, FaRocket, FaCrown, FaGem, FaSync, FaCog } from 'react-icons/fa';
import './Profile.css';
import WalletGraph from './WalletGraph';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const { 
        currentUser: user, 
        connectWalletToAccount, 
        disconnectWalletFromAccount,
        walletLoading 
    } = useAuth();
    const { active, account, activate, deactivate } = useWeb3React();
    const [isConnecting, setIsConnecting] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
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
        if (walletLoading) return;
        setIsConnecting(true);
        setError('');
        setSuccess('');
        
        try {
            // Check if MetaMask is installed
            if (!window.ethereum) {
                throw new Error('Please install MetaMask to connect your wallet');
            }

            // Check if user is logged in
            if (!user) {
                throw new Error('Please login to connect your wallet');
            }

            // Get current chain ID
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            
            // If not on BSC network (chainId !== '0x38'), show error without disconnecting
            if (chainId !== '0x38') {
                setError('Please switch to Binance Smart Chain network in your wallet');
                setIsConnecting(false);
                return;
            }

            // Request account access
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });

            if (!accounts || accounts.length === 0) {
                throw new Error('No accounts found in MetaMask. Please create or import an account.');
            }

            // Get the selected account
            const newAccount = accounts[0];

            // Check if this exact account is already connected
            const isWalletConnected = user.walletAddresses?.some(
                w => w.address.toLowerCase() === newAccount.toLowerCase()
            );
            
            if (isWalletConnected) {
                throw new Error('This account is already connected. Please select a different account from MetaMask.');
            }

            // Activate Web3React
            try {
                await activate(injected);
            } catch (error) {
                console.error('Activation error:', error);
                throw new Error('Failed to activate wallet connection. Please try again.');
            }

            // Save wallet to user account through AuthContext
            const result = await connectWalletToAccount(newAccount);
            
            if (result && result.user) {
                setSelectedWallet(newAccount);
                setSuccess('Wallet connected successfully');
            } else {
                throw new Error('Failed to connect wallet to your account');
            }
        } catch (error) {
            console.error('Wallet connection error:', error);
            const errorMessage = error.message || 'Failed to connect wallet';
            setError(errorMessage);
            
            // Only deactivate if we actually activated
            if (active) {
                try {
                    await deactivate();
                } catch (deactivateError) {
                    console.error('Error deactivating:', deactivateError);
                }
            }
        } finally {
            setIsConnecting(false);
        }
    };

    // Add network change listener
    useEffect(() => {
        if (window.ethereum) {
            const handleChainChanged = (chainId) => {
                if (chainId !== '0x38') {
                    setError('Please switch to Binance Smart Chain network');
                } else {
                    setError('');
                }
            };

            window.ethereum.on('chainChanged', handleChainChanged);

            return () => {
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            };
        }
    }, []);

    const switchWallet = async (walletAddress) => {
        if (walletLoading) return;
        setError('');
        setSuccess('');
        
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
            setSuccess('Wallet switched successfully');
        } catch (error) {
            console.error('Error switching wallet:', error);
            setError(error.message || 'Failed to switch wallet');
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const disconnectWallet = async (walletAddress) => {
        if (walletLoading) return;
        setError('');
        setSuccess('');
        
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
            setSuccess('Wallet disconnected successfully');
        } catch (error) {
            console.error('Error disconnecting wallet:', error);
            setError(error.message || 'Failed to disconnect wallet');
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

    const handleSettingsClick = () => {
        navigate('/settings', { state: { from: 'profile' } });
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-avatar">
                    {user?.displayName?.[0] || user?.email?.[0] || <FaUser />}
                </div>
                <div className="profile-info">
                    <h1>{user?.displayName || 'User'}</h1>
                    <div className="profile-email">
                        <FaEnvelope />
                        {user?.email}
                    </div>
                </div>
                <button 
                    onClick={handleSettingsClick}
                    className="settings-link" 
                    title="Settings"
                >
                    <FaCog />
                </button>
            </div>

            <div className="profile-grid">
                <div className="profile-card wallets-card">
                    <h3>Your Wallets</h3>
                    <div className="wallet-section">
                        {error && <div className="error-message">{error}</div>}
                        {success && <div className="success-message">{success}</div>}
                        
                        <button 
                            onClick={connectNewWallet}
                            disabled={isConnecting || walletLoading}
                            className={`connect-wallet-btn ${isConnecting || walletLoading ? 'loading' : ''}`}
                        >
                            {isConnecting ? 'Connecting...' : 'Connect New Wallet'}
                        </button>

                        <div className="wallets-list">
                            {user?.walletAddresses?.map((wallet) => (
                                <div
                                    key={wallet.address}
                                    className={`wallet-item ${selectedWallet === wallet.address ? 'selected' : ''}`}
                                    onClick={() => switchWallet(wallet.address)}
                                >
                                    <div className="wallet-info">
                                        <div className="wallet-icon">
                                            <FaWallet />
                                        </div>
                                        <div className="wallet-details">
                                            <div className="wallet-address">
                                                {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                                            </div>
                                            <div className="wallet-network">BSC Network</div>
                                        </div>
                                    </div>
                                    <div className="wallet-actions">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                copyToClipboard(wallet.address);
                                            }} 
                                            title="Copy address"
                                            aria-label="Copy wallet address"
                                        >
                                            {copied ? <FaCheck /> : <FaCopy />}
                                        </button>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                disconnectWallet(wallet.address);
                                            }} 
                                            title="Disconnect wallet"
                                            aria-label="Disconnect wallet"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {selectedWallet && (
                    <div className="profile-card wallet-details-card">
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
                                    </span>
                                    <span className="usd-value">{getWalletData(selectedWallet).profitLoss.usdValue}</span>
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
                )}
            </div>
        </div>
    );
};

export default Profile; 