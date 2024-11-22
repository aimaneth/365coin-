import React from 'react';
import { FaChartLine, FaSync, FaSearchPlus } from 'react-icons/fa';
import './Features.css';

const Features = () => {
    const features = [
        {
            icon: <FaChartLine />,
            title: "Real-Time Market Data",
            description: "Get live cryptocurrency prices, market trends, and portfolio valuation updates."
        },
        {
            icon: <FaSync />,
            title: "Transaction Management",
            description: "Sync your transactions automatically via APIs or enter them manually for trades, staking, and airdrops."
        },
        {
            icon: <FaSearchPlus />,
            title: "Advanced Analytics",
            description: "Access in-depth analytics for risk assessment, diversification scores, and profit/loss tracking by timeframe."
        }
    ];

    return (
        <div className="features-container">
            <h2 className="features-title">Our Features</h2>
            <div className="features-flex">
                {features.map((feature, index) => (
                    <div key={index} className="feature-card">
                        <div className="feature-icon">{feature.icon}</div>
                        <h4 className="feature-title">{feature.title}</h4>
                        <p className="feature-description">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Features; 