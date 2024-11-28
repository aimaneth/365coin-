import React from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaTelegram, FaDiscord, FaGithub } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-main">
                    {/* Brand Section */}
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <img src="/images/logo.png" alt="365 Coin" />
                        </Link>
                        <p className="footer-description">
                            365 Coin is revolutionizing DeFi with innovative solutions and sustainable returns. 
                            Join our community and be part of the future of finance.
                        </p>
                        <div className="footer-social">
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                <FaTwitter size={20} />
                            </a>
                            <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="social-link">
                                <FaTelegram size={20} />
                            </a>
                            <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" className="social-link">
                                <FaDiscord size={20} />
                            </a>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                <FaGithub size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-links-section">
                        <h4>Quick Links</h4>
                        <div className="footer-links">
                            <Link to="/about" className="footer-link">About Us</Link>
                            <Link to="/tokenomics" className="footer-link">Tokenomics</Link>
                            <Link to="/roadmap" className="footer-link">Roadmap</Link>
                            <Link to="/whitepaper" className="footer-link">Whitepaper</Link>
                        </div>
                    </div>

                    {/* Resources */}
                    <div className="footer-links-section">
                        <h4>Resources</h4>
                        <div className="footer-links">
                            <a href="/docs" className="footer-link">Documentation</a>
                            <a href="/blog" className="footer-link">Blog</a>
                            <a href="/faq" className="footer-link">FAQs</a>
                            <a href="/support" className="footer-link">Support</a>
                        </div>
                    </div>

                    {/* Legal */}
                    <div className="footer-links-section">
                        <h4>Legal</h4>
                        <div className="footer-links">
                            <Link to="/privacy" className="footer-link">Privacy Policy</Link>
                            <Link to="/terms" className="footer-link">Terms of Service</Link>
                            <Link to="/disclaimer" className="footer-link">Disclaimer</Link>
                            <Link to="/cookies" className="footer-link">Cookie Policy</Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="footer-bottom">
                    <p className="footer-copyright">
                        © {new Date().getFullYear()} 365 Coin. All rights reserved.
                    </p>
                    <div className="footer-bottom-links">
                        <Link to="/terms" className="footer-bottom-link">Terms</Link>
                        <Link to="/privacy" className="footer-bottom-link">Privacy</Link>
                        <Link to="/cookies" className="footer-bottom-link">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 