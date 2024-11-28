import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './auth/LoginModal';
import SignupModal from './auth/SignupModal';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowUserDropdown(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setShowUserDropdown(false);
    }, [location]);

    const handleLogout = async () => {
        try {
            await logout();
            setShowUserDropdown(false);
            setIsMobileMenuOpen(false);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <>
            <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
                <div className="navbar-container">
                    <Link to="/" className="navbar-brand">
                        <img src="/images/logo.png" alt="365 Coin" className="brand-logo" />
                    </Link>

                    <button 
                        className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>

                    <div className={`navbar-content ${isMobileMenuOpen ? 'active' : ''}`}>
                        <div className="nav-links">
                            <Link to="/" className="nav-link">Home</Link>
                            <Link to="/pnl" className="nav-link">PnL</Link>
                        </div>

                        <div className="auth-section">
                            {user ? (
                                <div className="user-menu" ref={dropdownRef}>
                                    <button 
                                        className="user-menu-btn"
                                        onClick={() => setShowUserDropdown(!showUserDropdown)}
                                    >
                                        <div className="user-avatar">
                                            {user.username[0].toUpperCase()}
                                        </div>
                                        <span className="username">{user.username}</span>
                                    </button>

                                    <div className={`dropdown-menu ${showUserDropdown ? 'active' : ''}`}>
                                        <Link to="/profile" className="dropdown-item">
                                            <FaUser /> Profile
                                        </Link>
                                        <Link to="/settings" className="dropdown-item">
                                            <FaCog /> Settings
                                        </Link>
                                        <button onClick={handleLogout} className="dropdown-item">
                                            <FaSignOutAlt /> Logout
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="auth-buttons">
                                    <button 
                                        onClick={() => setShowLoginModal(true)} 
                                        className="login-btn"
                                    >
                                        Login
                                    </button>
                                    <button 
                                        onClick={() => setShowSignupModal(true)} 
                                        className="signup-btn"
                                    >
                                        Sign Up
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {showLoginModal && (
                <LoginModal 
                    onClose={() => setShowLoginModal(false)}
                    onSwitchToSignup={() => {
                        setShowLoginModal(false);
                        setShowSignupModal(true);
                    }}
                />
            )}

            {showSignupModal && (
                <SignupModal 
                    onClose={() => setShowSignupModal(false)}
                    onSwitchToLogin={() => {
                        setShowSignupModal(false);
                        setShowLoginModal(true);
                    }}
                />
            )}
        </>
    );
};

export default Navbar; 