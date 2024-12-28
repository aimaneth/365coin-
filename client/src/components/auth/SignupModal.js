import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaEye, FaEyeSlash, FaTimes, FaGoogle, FaGithub } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import './AuthModals.css';

const SignupModal = ({ onClose, onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({
        email: '',
        username: '',
        general: ''
    });
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear errors when user starts typing
        setErrors({ ...errors, [e.target.name]: '', general: '' });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({ email: '', username: '', general: '' });
        setLoading(true);

        // Basic validation
        if (!formData.username || !formData.email || !formData.password) {
            setErrors({ ...errors, general: 'All fields are required' });
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setErrors({ ...errors, general: 'Password must be at least 6 characters' });
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setErrors({ ...errors, general: 'Passwords do not match' });
            setLoading(false);
            return;
        }

        try {
            await signup(formData.email, formData.password, formData.username);
            onClose();
        } catch (err) {
            console.error('Signup error:', err);
            if (err.response?.data) {
                const { existingEmail, existingUsername } = err.response.data;
                const newErrors = { ...errors };
                
                if (existingEmail) {
                    newErrors.email = 'This email is already registered';
                }
                if (existingUsername) {
                    newErrors.username = 'This username is already taken';
                }
                if (!existingEmail && !existingUsername) {
                    newErrors.general = err.message || 'Failed to create account';
                }
                
                setErrors(newErrors);
            } else {
                setErrors({ ...errors, general: 'An error occurred during signup' });
            }
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
                {errors.general && <div className="error-message">{errors.general}</div>}

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
                        {errors.username && <div className="field-error">{errors.username}</div>}
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
                        {errors.email && <div className="field-error">{errors.email}</div>}
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength="6"
                        />
                        <div 
                            className="input-icon" 
                            onClick={togglePasswordVisibility}
                            style={{ cursor: 'pointer' }}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        <div 
                            className="input-icon" 
                            onClick={toggleConfirmPasswordVisibility}
                            style={{ cursor: 'pointer' }}
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </div>
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