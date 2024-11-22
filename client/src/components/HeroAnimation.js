import React, { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../utils/connectors';
import { FaWallet, FaRocket } from 'react-icons/fa';
import { ethers } from 'ethers';
import ICOToken from '../contracts/ICOToken.json';

const HeroAnimation = () => {
    const { active, account, activate, library } = useWeb3React();
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('BNB');
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState('');

    const connectWallet = async () => {
        setIsConnecting(true);
        setError('');
        
        try {
            if (!window.ethereum) {
                throw new Error('Please install MetaMask to connect your wallet');
            }
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            await activate(injected);
        } catch (error) {
            console.error('Connection error:', error);
            setError(error.message);
        } finally {
            setIsConnecting(false);
        }
    };

    const handleContribute = async () => {
        if (!amount || !library || !account) {
            setError('Please enter a valid amount and connect your wallet.');
            return;
        }
        
        try {
            const signer = library.getSigner();
            const contract = new ethers.Contract(
                process.env.REACT_APP_TOKEN_ADDRESS,
                ICOToken.abi,
                signer
            );

            if (currency === 'BNB') {
                const tx = await contract.contributeWithBNB({
                    value: ethers.utils.parseEther(amount)
                });
                await tx.wait();
            } else {
                const tx = await contract.contributeWithUSDT(
                    ethers.utils.parseUnits(amount, 6)
                );
                await tx.wait();
            }

            setAmount('');
            alert('Contribution successful!');
        } catch (error) {
            console.error('Error contributing:', error);
            alert('Error making contribution: ' + error.message);
        }
    };

    return (
        <div className="presale-details-container">
            <div className="presale-card">
                <div className="presale-header">
                    <div className="presale-badge">
                        <span className="pulse-dot"></span>
                        PRESALE LIVE
                    </div>
                    <h3>ICO Round 1</h3>
                </div>

                <div className="presale-info">
                    <div className="info-row">
                        <span>Token Price</span>
                        <span className="value">$0.001</span>
                    </div>
                    <div className="info-row">
                        <span>Minimum Buy</span>
                        <span className="value">0.1 BNB</span>
                    </div>
                    <div className="info-row">
                        <span>Maximum Buy</span>
                        <span className="value">50 BNB</span>
                    </div>
                </div>

                <div className="presale-progress">
                    <div className="progress-header">
                        <span>Progress</span>
                        <span>69.42%</span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: '69.42%' }}></div>
                    </div>
                    <div className="progress-stats">
                        <div>
                            <span className="label">Raised</span>
                            <span className="value">$694,200</span>
                        </div>
                        <div>
                            <span className="label">Goal</span>
                            <span className="value">$1,000,000</span>
                        </div>
                    </div>
                </div>

                <div className="presale-timer">
                    <span className="timer-label">Ends in</span>
                    <div className="timer-grid">
                        <div className="timer-block">
                            <span className="number">14</span>
                            <span className="label">Days</span>
                        </div>
                        <div className="timer-block">
                            <span className="number">22</span>
                            <span className="label">Hours</span>
                        </div>
                        <div className="timer-block">
                            <span className="number">45</span>
                            <span className="label">Minutes</span>
                        </div>
                        <div className="timer-block">
                            <span className="number">30</span>
                            <span className="label">Seconds</span>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {!active ? (
                    <button 
                        onClick={connectWallet} 
                        className="presale-connect-btn"
                        disabled={isConnecting}
                    >
                        <FaWallet />
                        {isConnecting ? 'Connecting...' : 'Connect Wallet to Participate'}
                    </button>
                ) : (
                    <div className="presale-contribution">
                        <div className="wallet-connected">
                            Connected: {account.slice(0, 6)}...{account.slice(-4)}
                        </div>
                        <div className="contribution-input-group">
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Enter amount"
                                className="presale-input"
                            />
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="presale-select"
                            >
                                <option value="BNB">BNB</option>
                                <option value="USDT">USDT</option>
                            </select>
                        </div>
                        <button 
                            onClick={handleContribute} 
                            className="presale-contribute-btn"
                        >
                            <FaRocket /> Buy Tokens
                        </button>
                        <div className="token-estimate">
                            You will receive: {amount ? (currency === 'BNB' ? amount * 1000 : amount * 100) : 0} ICO
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HeroAnimation; 