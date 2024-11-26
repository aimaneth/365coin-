import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaTimes, FaGoogle, FaGithub } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import ForgotPasswordModal from './ForgotPasswordModal';
import './AuthModals.css';

const LoginModal = ({ onClose, onSwitchToSignup }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(formData.email, formData.password);
            onClose();
        } catch (err) {
            setError('Failed to login. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        setShowForgotPassword(true);
    };

    if (showForgotPassword) {
        return (
            <ForgotPasswordModal 
                onClose={onClose}
                onBackToLogin={() => setShowForgotPassword(false)}
            />
        );
    }

    return (
        <div className="auth-modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    <FaTimes />
                </button>
                
                <h2>Welcome Back</h2>
                {error && <div className="error-message">{error}</div>}

                <div className="social-auth-buttons">
                    <button className="social-auth-btn">
                        <FaGoogle /> Google
                    </button>
                    <button className="social-auth-btn">
                        <FaGithub /> GitHub
                    </button>
                </div>

                <div className="modal-divider">
                    <span>or continue with email</span>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <FaEnvelope className="input-icon" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <FaLock className="input-icon" />
                    </div>

                    <div className="form-options">
                        <label className="remember-me">
                            <input type="checkbox" /> Remember me
                        </label>
                        <button 
                            type="button" 
                            className="forgot-password-btn"
                            onClick={handleForgotPassword}
                        >
                            Forgot password?
                        </button>
                    </div>

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="switch-text">
                    Don't have an account?
                    <button onClick={onSwitchToSignup} className="switch-btn">
                        Sign up
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginModal; 