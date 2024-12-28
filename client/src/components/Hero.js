import React from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaChartLine, FaShieldAlt, FaArrowRight } from 'react-icons/fa';
import { FaUsers, FaClock } from 'react-icons/fa';
import { SiBinance } from 'react-icons/si';
import PresaleCard from './presale/PresaleCard';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero-section">
            <div className="hero-container">
                <div className="hero-content">
                    <div className="hero-text">
                        <h1>
                            <span className="gradient-text">365coin</span>
                            <br />Make Better Life With Trusted CryptoCoin
                        </h1>
                        <p>Use modern progressive technologies of Bitcoin to earn money. Join thousands of successful traders today.</p>
                    </div>
                    
                    <div className="hero-cta">
                        <Link to="/pnl" className="primary-btn">
                            View Live PnL <FaArrowRight />
                        </Link>
                    </div>

                    <div className="hero-stats">
                        <div className="stat-item">
                            <span className="stat-value">$2.5M+</span>
                            <span className="stat-label">Trading Volume</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-value">15K+</span>
                            <span className="stat-label">Active Traders</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-value">98%</span>
                            <span className="stat-label">Success Rate</span>
                        </div>
                    </div>

                    <div className="hero-features">
                        <div className="feature-item">
                            <div className="feature-icon">
                                <FaRocket />
                            </div>
                            <div className="feature-text">
                                <h3>Fast Execution</h3>
                                <p>Lightning-fast trade execution with minimal slippage</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">
                                <FaChartLine />
                            </div>
                            <div className="feature-text">
                                <h3>Advanced Analytics</h3>
                                <p>Real-time market analysis and AI-powered insights</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">
                                <FaShieldAlt />
                            </div>
                            <div className="feature-text">
                                <h3>Secure Trading</h3>
                                <p>Enterprise-grade security for your investments</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="presale-wrapper">
                    <PresaleCard />
                </div>
            </div>
        </section>
    );
};

export default Hero; 