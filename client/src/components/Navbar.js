import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { FaWallet, FaBars, FaTimes } from 'react-icons/fa';
import { injected } from '../utils/connectors';
import './Navbar.css';

const Navbar = () => {
    const { active, account, activate, deactivate } = useWeb3React();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const desiredNetworkId = '0x38'; // Binance Smart Chain Mainnet

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        console.log(`Wallet connection status: ${active ? 'Connected' : 'Not connected'}`);
        if (active && account) {
            console.log(`Connected with account: ${account}`);
        }
    }, [active, account]);

    const connectWallet = async () => {
        try {
            if (!window.ethereum) {
                alert('Please install MetaMask to connect your wallet');
                return;
            }

            const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
            if (currentChainId !== desiredNetworkId) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: desiredNetworkId }],
                    });
                } catch (switchError) {
                    if (switchError.code === 4902) {
                        alert('Network not available in MetaMask. Please add it manually.');
                    } else {
                        console.error('Failed to switch network:', switchError);
                        alert('Failed to switch network. Please try again.');
                        return;
                    }
                }
            }

            await activate(injected);
        } catch (error) {
            console.error('Connection error:', error);
            alert('Failed to connect wallet');
        }
    };

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="navbar-brand">
                <Link to="/">
                    <img src="/images/logo.png" className="brand-logo" />
                </Link>
            </div>

            <button 
                className="mobile-menu-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>

            <div className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
                <Link to="/" className={`nav-item ${isActive('/')}`}>Home</Link>
                {active && (
                    <>
                        <Link to="/pnl" className={`nav-item ${isActive('/pnl')}`}>PnL</Link>
                        <Link to="/withdraw" className={`nav-item ${isActive('/withdraw')}`}>Withdraw</Link>
                    </>
                )}
                {!active ? (
                    <button onClick={connectWallet} className="connect-wallet-btn">
                        <FaWallet className="wallet-icon" />
                        Connect Wallet
                    </button>
                ) : (
                    <div className="wallet-info">
                        <span className="address">
                            <FaWallet style={{ marginRight: '8px' }} />
                            {account.slice(0, 6)}...{account.slice(-4)}
                        </span>
                        <button onClick={deactivate} className="disconnect-btn">
                            Disconnect
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar; 