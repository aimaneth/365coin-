import React, { useState } from 'react';
import { FaRocket, FaCrown, FaGem, FaCheck, FaWallet, FaExchangeAlt, FaChartLine, FaLock, FaUserShield, FaRobot, FaBrain, FaServer } from 'react-icons/fa';
import { useWeb3React } from '@web3-react/core';
import { useAuth } from '../../contexts/AuthContext';
import LoginModal from '../auth/LoginModal';
import PaymentModal from './PaymentModal';
import './Packages.css';

const Packages = () => {
    const { user } = useAuth();
    const { active, account } = useWeb3React();
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [paymentNetwork, setPaymentNetwork] = useState('bep20');
    const [roiTimeframe, setRoiTimeframe] = useState('monthly');
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const calculateROI = (basePrice, percentage, timeframe) => {
        const dailyROI = percentage / 100;
        switch(timeframe) {
            case 'daily':
                return basePrice * dailyROI;
            case 'weekly':
                return basePrice * dailyROI * 7;
            case 'monthly':
                return basePrice * dailyROI * 30;
            default:
                return 0;
        }
    };

    const packages = [
        {
            id: 'starter',
            name: 'Starter',
            icon: <FaRocket />,
            price: 99,
            duration: '30 days',
            roiPercentage: 0.5, // 0.5% daily ROI
            features: [
                {
                    icon: <FaChartLine />,
                    title: 'Basic Trading Analytics',
                    description: 'Real-time market data and basic portfolio tracking'
                },
                {
                    icon: <FaRobot />,
                    title: 'Basic Trading Signals',
                    description: 'Access to entry-level trading signals'
                },
                {
                    icon: <FaWallet />,
                    title: 'Basic Portfolio Management',
                    description: 'Track up to 5 wallets'
                },
                {
                    icon: <FaUserShield />,
                    title: 'Email Support',
                    description: '24/7 email support'
                }
            ],
            color: '#3498db',
            benefits: [
                'Up to 0.5% Daily ROI',
                'Basic Risk Management',
                'Market Analysis Tools',
                'Community Access'
            ]
        },
        {
            id: 'pro',
            name: 'Professional',
            icon: <FaCrown />,
            price: 199,
            duration: '30 days',
            roiPercentage: 1.0, // 1% daily ROI
            features: [
                {
                    icon: <FaBrain />,
                    title: 'Advanced AI Analytics',
                    description: 'AI-powered market analysis and predictions'
                },
                {
                    icon: <FaRobot />,
                    title: 'Premium Trading Signals',
                    description: 'High-accuracy trading signals with alerts'
                },
                {
                    icon: <FaServer />,
                    title: 'Advanced API Access',
                    description: 'Direct API integration capabilities'
                },
                {
                    icon: <FaLock />,
                    title: 'Priority Support',
                    description: 'Priority 24/7 support with dedicated manager'
                }
            ],
            color: '#f0c000',
            popular: true,
            benefits: [
                'Up to 1% Daily ROI',
                'Advanced Risk Management',
                'Premium Market Analysis',
                'VIP Community Access',
                'Priority Support'
            ]
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            icon: <FaGem />,
            price: 499,
            duration: '30 days',
            roiPercentage: 2.0, // 2% daily ROI
            features: [
                {
                    icon: <FaBrain />,
                    title: 'Elite AI Trading Suite',
                    description: 'Full access to our AI trading ecosystem'
                },
                {
                    icon: <FaRobot />,
                    title: 'Elite Trading Signals',
                    description: 'Exclusive high-profit trading opportunities'
                },
                {
                    icon: <FaServer />,
                    title: 'Enterprise API & Tools',
                    description: 'Full API access with custom integrations'
                },
                {
                    icon: <FaLock />,
                    title: 'Dedicated Support Team',
                    description: '24/7 dedicated support team'
                }
            ],
            color: '#9b59b6',
            benefits: [
                'Up to 2% Daily ROI',
                'Elite Risk Management',
                'Custom Analysis Tools',
                'Private Trading Community',
                'Dedicated Account Manager',
                'Custom API Integration'
            ]
        }
    ];

    const handlePackageSelect = (pkg) => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }
        setSelectedPackage(pkg);
        setShowPaymentModal(true);
    };

    return (
        <div className="packages-container">
            <div className="packages-header">
                <h1>Choose Your Trading Package</h1>
                <p>Select the perfect package to maximize your trading potential</p>
                
                <div className="roi-calculator">
                    <div className="roi-tabs">
                        {['daily', 'weekly', 'monthly'].map((timeframe) => (
                            <button
                                key={timeframe}
                                className={`roi-tab ${roiTimeframe === timeframe ? 'active' : ''}`}
                                onClick={() => setRoiTimeframe(timeframe)}
                            >
                                {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} ROI
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="packages-grid">
                {packages.map((pkg) => (
                    <div 
                        key={pkg.id} 
                        className={`package-card ${pkg.popular ? 'popular' : ''}`}
                        style={{ '--package-color': pkg.color }}
                    >
                        {pkg.popular && (
                            <div className="popular-badge">Most Popular</div>
                        )}
                        <div className="package-icon" style={{ color: pkg.color }}>
                            {pkg.icon}
                        </div>
                        <h3>{pkg.name}</h3>
                        <div className="package-price">
                            <span className="currency">$</span>
                            <span className="amount">{pkg.price}</span>
                            <span className="duration">/{pkg.duration}</span>
                        </div>

                        <div className="roi-preview">
                            <div className="roi-label">Estimated {roiTimeframe} ROI:</div>
                            <div className="roi-amount">
                                ${calculateROI(pkg.price, pkg.roiPercentage, roiTimeframe).toFixed(2)}
                            </div>
                            <div className="roi-percentage">
                                {pkg.roiPercentage}% Daily Return
                            </div>
                        </div>

                        <div className="package-features">
                            {pkg.features.map((feature, index) => (
                                <div key={index} className="feature-item">
                                    <div className="feature-icon">{feature.icon}</div>
                                    <div className="feature-content">
                                        <h4>{feature.title}</h4>
                                        <p>{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="benefits-list">
                            {pkg.benefits.map((benefit, index) => (
                                <div key={index} className="benefit-item">
                                    <FaCheck className="benefit-icon" />
                                    <span>{benefit}</span>
                                </div>
                            ))}
                        </div>

                        <button 
                            className="select-package-btn"
                            onClick={() => handlePackageSelect(pkg)}
                        >
                            Get Started Now
                        </button>
                    </div>
                ))}
            </div>

            {showPaymentModal && selectedPackage && (
                <PaymentModal 
                    package={selectedPackage}
                    onClose={() => {
                        setShowPaymentModal(false);
                        setSelectedPackage(null);
                    }}
                />
            )}

            {showLoginModal && (
                <LoginModal 
                    onClose={() => setShowLoginModal(false)}
                    onSwitchToSignup={() => {
                        setShowLoginModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default Packages; 