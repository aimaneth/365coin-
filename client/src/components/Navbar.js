import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './auth/LoginModal';
import SignupModal from './auth/SignupModal';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

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

    const handleMobileMenuClick = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        setShowUserDropdown(false);
    };

    const handleLogout = () => {
        try {
            logout();
            setShowUserDropdown(false);
            closeMobileMenu();
            navigate('/');
            console.log('Successfully logged out');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const getUserInitials = () => {
        return user?.username?.charAt(0).toUpperCase() || 'U';
    };

    return (
        <>
            <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
                <div className="navbar-left">
                    <Link to="/" className="navbar-brand">
                        <img src="/images/logo.png" alt="365 Coin" className="brand-logo" />
                    </Link>
                    <Link to="/" className="nav-item" onClick={closeMobileMenu}>Home</Link>
                    <Link to="/pnl" className="nav-item" onClick={closeMobileMenu}>PnL</Link>
                    <Link to="/packages" className="nav-item" onClick={closeMobileMenu}>Packages</Link>
                </div>

                <button 
                    className="mobile-menu-btn"
                    onClick={handleMobileMenuClick}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>

                <div className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
                    {user ? (
                        <div className="user-menu" ref={dropdownRef}>
                            <div 
                                className="user-avatar"
                                onClick={() => setShowUserDropdown(!showUserDropdown)}
                            >
                                {getUserInitials()}
                            </div>
                            {showUserDropdown && (
                                <div className="user-dropdown">
                                    <Link to="/profile" className="dropdown-item" onClick={closeMobileMenu}>
                                        <FaUser /> Profile
                                    </Link>
                                    <Link to="/settings" className="dropdown-item" onClick={closeMobileMenu}>
                                        <FaCog /> Settings
                                    </Link>
                                    <div className="dropdown-divider"></div>
                                    <button 
                                        className="dropdown-item logout-btn" 
                                        onClick={handleLogout}
                                    >
                                        <FaSignOutAlt /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <button 
                                onClick={() => setShowLoginModal(true)} 
                                className="auth-btn login-btn"
                            >
                                Login
                            </button>
                            <button 
                                onClick={() => setShowSignupModal(true)} 
                                className="auth-btn signup-btn"
                            >
                                Sign Up
                            </button>
                        </div>
                    )}
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