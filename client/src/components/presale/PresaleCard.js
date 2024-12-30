import React, { useState } from 'react';
import { FaEthereum, FaClock, FaUsers, FaChartLine, FaCopy, FaCheck, FaWallet } from 'react-icons/fa';
import { SiBinance } from 'react-icons/si';
import './PresaleCard.css';

const PresaleCard = () => {
    const [paymentMethod, setPaymentMethod] = useState('bnb');
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
            bnb: "No Limit",
            usdt: "No Limit"
        },
        walletAddresses: {
            bnb: "0x38f785297824A23b7f1B611BAf0723D7Ab522A2f",
            bep20: "0x38f785297824A23b7f1B611BAf0723D7Ab522A2f",
            trc20: "TQjWLJwSHvxzGDKUzGpvWMTgzu2D8cWozJ"
        }
    };

    const handleCopyAddress = () => {
        const address = presaleData.walletAddresses[paymentMethod];
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
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

    const formatAddress = (address) => {
        if (!address) return '';
        return `${address.slice(0, 18)}...${address.slice(-8)}`;
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
                        {getPaymentIcon(paymentMethod)} {paymentMethod === 'bnb' ? presaleData.maxContribution.bnb + ' ' : presaleData.maxContribution.usdt + ' USDT'}
                    </span>
                </div>
            </div>

            <div className="wallet-address">
                <h3>How to Participate</h3>
                
                <div className="instructions">
                    <p>1. Copy the payment address below</p>
                    <p>2. Send {paymentMethod.toUpperCase()} to this address from your wallet</p>
                    <p>3. Tokens will be automatically sent to your wallet</p>
                </div>

                <div className="address-box">
                    <label>Payment Address ({paymentMethod.toUpperCase()})</label>
                    <div className="address-value">
                        {presaleData.walletAddresses[paymentMethod]}
                    </div>
                </div>

                <button 
                    className="copy-address-btn"
                    onClick={handleCopyAddress}
                >
                    {copied ? (
                        <>
                            <FaCheck /> Address Copied!
                        </>
                    ) : (
                        <>
                            <FaCopy /> Copy Address
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default PresaleCard;