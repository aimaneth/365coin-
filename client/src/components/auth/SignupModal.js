import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaTimes, FaGoogle, FaGithub } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import './AuthModals.css';

const SignupModal = ({ onClose, onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);
        try {
            await signup(formData.email, formData.password, formData.username);
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    <FaTimes />
                </button>

                <h2>Create Account</h2>
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
                    <span>or register with email</span>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Choose a username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                        <FaUser className="input-icon" />
                    </div>
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
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength="6"
                        />
                        <FaLock className="input-icon" />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        <FaLock className="input-icon" />
                    </div>

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="switch-text">
                    Already have an account?
                    <button onClick={onSwitchToLogin} className="switch-btn">
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default SignupModal; 