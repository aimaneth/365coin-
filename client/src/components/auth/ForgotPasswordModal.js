import React, { useState } from 'react';
import { FaEnvelope, FaTimes, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import './AuthModals.css';

const ForgotPasswordModal = ({ onClose, onBackToLogin }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { resetPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            await resetPassword(email);
            setMessage('Check your email for password reset instructions');
            setTimeout(() => {
                onBackToLogin();
            }, 3000);
        } catch (err) {
            setError('Failed to reset password. Please check your email address.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-content has-back-button">
                <button className="close-button" onClick={onClose}>
                    <FaTimes />
                </button>

                <button className="back-button" onClick={onBackToLogin}>
                    <FaArrowLeft /> Back to Login
                </button>
                
                <h2>Reset Password</h2>
                <p className="auth-subtitle">
                    Enter your email address and we'll send you instructions to reset your password.
                </p>

                {error && <div className="error-message">{error}</div>}
                {message && <div className="success-message">{message}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <FaEnvelope className="input-icon" />
                    </div>

                    <button 
                        type="submit" 
                        className="auth-btn" 
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordModal; 