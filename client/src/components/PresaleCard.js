import React, { useState } from 'react';
import { FaEthereum, FaClock, FaUsers, FaChartLine, FaCopy, FaCheck, FaWallet } from 'react-icons/fa';
import { SiBinance } from 'react-icons/si';
import './PresaleCard.css';

const PresaleCard = () => {
    const [paymentMethod, setPaymentMethod] = useState('bnb');
    const [amount, setAmount] = useState('');
    const [copied, setCopied] = useState(false);

    const presaleData = {
        totalRaised: "2,450",
        targetAmount: "5,000",
        participants: "1,245",
        timeLeft: "14 days",
        price: {
            bnb: "0.01",
            usdt: "5"
        },
        minContribution: {
            bnb: "0.1",
            usdt: "50"
        },
        maxContribution: {
            bnb: "5",
            usdt: "2500"
        },
        walletAddresses: {
            bnb: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
            bep20: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
            trc20: "TYQrFeaH8qm1X89EpVHCUaVdB3jCqHKgXp"
        }
    };

    const handleCopyAddress = () => {
        const address = presaleData.walletAddresses[paymentMethod];
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setAmount(value);
        }
    };

    const getPaymentIcon = (method) => {
        switch(method) {
            case 'bnb':
                return <SiBinance />;
            case 'bep20':
            case 'trc20':
                return <FaWallet />;
            default:
                return <FaWallet />;
        }
    };

    return (
        <div className="presale-card">
            <div className="presale-header">
                <h2>Token Presale</h2>
                <div className="presale-status">Live</div>
            </div>

            <div className="progress-section">
                <div className="progress-info">
                    <span>Progress</span>
                    <span>{presaleData.totalRaised}/{presaleData.targetAmount} BNB</span>
                </div>
                <div className="progress-bar">
                    <div 
                        className="progress-fill" 
                        style={{ width: `${(Number(presaleData.totalRaised.replace(',', ''))/Number(presaleData.targetAmount.replace(',', '')))*100}%` }}
                    ></div>
                </div>
            </div>

            <div className="presale-stats">
                <div className="stat-item">
                    <FaUsers className="stat-icon" />
                    <div className="stat-content">
                        <span className="stat-label">Participants</span>
                        <span className="stat-value">{presaleData.participants}</span>
                    </div>
                </div>
                <div className="stat-item">
                    <FaClock className="stat-icon" />
                    <div className="stat-content">
                        <span className="stat-label">Time Left</span>
                        <span className="stat-value">{presaleData.timeLeft}</span>
                    </div>
                </div>
            </div>

            <div className="payment-methods">
                <h3>Select Payment Method</h3>
                <div className="method-buttons">
                    <button 
                        className={`method-btn ${paymentMethod === 'bnb' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('bnb')}
                    >
                        <SiBinance /> BNB
                    </button>
                    <button 
                        className={`method-btn ${paymentMethod === 'bep20' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('bep20')}
                    >
                        <FaWallet /> USDT BEP20
                    </button>
                    <button 
                        className={`method-btn ${paymentMethod === 'trc20' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('trc20')}
                    >
                        <FaWallet /> USDT TRC20
                    </button>
                </div>
            </div>

            <div className="payment-details">
                <div className="detail-row">
                    <span>Price per Token</span>
                    <span className="value">
                        {getPaymentIcon(paymentMethod)} {paymentMethod === 'bnb' ? presaleData.price.bnb + ' BNB' : presaleData.price.usdt + ' USDT'}
                    </span>
                </div>
                <div className="detail-row">
                    <span>Min Contribution</span>
                    <span className="value">
                        {getPaymentIcon(paymentMethod)} {paymentMethod === 'bnb' ? presaleData.minContribution.bnb + ' BNB' : presaleData.minContribution.usdt + ' USDT'}
                    </span>
                </div>
                <div className="detail-row">
                    <span>Max Contribution</span>
                    <span className="value">
                        {getPaymentIcon(paymentMethod)} {paymentMethod === 'bnb' ? presaleData.maxContribution.bnb + ' BNB' : presaleData.maxContribution.usdt + ' USDT'}
                    </span>
                </div>
            </div>

            <div className="wallet-address">
                <h3>Payment Address</h3>
                <div className="address-display">
                    <span className="address">{presaleData.walletAddresses[paymentMethod]}</span>
                    <button 
                        className={`copy-btn ${copied ? 'copied' : ''}`}
                        onClick={handleCopyAddress}
                    >
                        {copied ? <FaCheck /> : <FaCopy />}
                    </button>
                </div>
            </div>

            <div className="contribution-input">
                <input 
                    type="text"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder={`Enter amount in ${paymentMethod === 'bnb' ? 'BNB' : 'USDT'}`}
                />
                <button className="buy-btn">
                    Buy Tokens
                </button>
            </div>
        </div>
    );
};

export default PresaleCard;