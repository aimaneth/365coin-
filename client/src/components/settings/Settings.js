import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useWeb3React } from '@web3-react/core';
import { FaWallet, FaTrash, FaCheck, FaUser, FaCamera, FaEdit, FaTimes, FaCopy, FaArrowLeft, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import './Settings.css';

const Settings = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const fromProfile = location.state?.from === 'profile';
    const { 
        currentUser: user, 
        disconnectWalletFromAccount, 
        updateProfile, 
        updatePassword,
        walletLoading 
    } = useAuth();
    const { active, account, deactivate } = useWeb3React();
    const [disconnecting, setDisconnecting] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [walletError, setWalletError] = useState('');
    const [success, setSuccess] = useState('');
    const [profileData, setProfileData] = useState({
        displayName: user?.displayName || '',
        email: user?.email || '',
    });
    const [avatar, setAvatar] = useState(user?.photoURL || null);
    const [previewAvatar, setPreviewAvatar] = useState(null);
    const fileInputRef = useRef(null);
    const [copiedAddress, setCopiedAddress] = useState(null);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (!isEditing) {
            setProfileData({
                displayName: user?.displayName || '',
                email: user?.email || '',
            });
            setPreviewAvatar(null);
        }
        setError('');
        setSuccess('');
    };

    const handleAvatarClick = () => {
        if (isEditing) {
            fileInputRef.current?.click();
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setError('Image size should be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewAvatar(reader.result);
            };
            reader.readAsDataURL(file);
            setAvatar(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await updateProfile({
                ...profileData,
                photoURL: avatar
            });
            setSuccess('Profile updated successfully!');
            setIsEditing(false);
        } catch (err) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleDisconnectWallet = async (walletAddress) => {
        try {
            setDisconnecting(walletAddress);
            setWalletError('');
            
            if (active && account?.toLowerCase() === walletAddress.toLowerCase()) {
                await deactivate();
            }

            await disconnectWalletFromAccount(walletAddress);
            setSuccess('Wallet disconnected successfully');
        } catch (error) {
            console.error('Error disconnecting wallet:', error);
            setWalletError(error.message || 'Failed to disconnect wallet');
        } finally {
            setDisconnecting(null);
        }
    };

    const handleCopyAddress = (address) => {
        navigator.clipboard.writeText(address);
        setCopiedAddress(address);
        setTimeout(() => setCopiedAddress(null), 2000);
    };

    const handleBack = () => {
        navigate('/profile');
    };

    const validatePassword = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (password.length < minLength) {
            return 'Password must be at least 8 characters long';
        }
        if (!hasUpperCase) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!hasLowerCase) {
            return 'Password must contain at least one lowercase letter';
        }
        if (!hasNumbers) {
            return 'Password must contain at least one number';
        }
        if (!hasSpecialChar) {
            return 'Password must contain at least one special character';
        }
        return '';
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');
        setIsChangingPassword(true);

        try {
            // Validate new password
            const validationError = validatePassword(passwordData.newPassword);
            if (validationError) {
                throw new Error(validationError);
            }

            // Check if passwords match
            if (passwordData.newPassword !== passwordData.confirmPassword) {
                throw new Error('New passwords do not match');
            }

            // Update password through AuthContext
            await updatePassword(passwordData.currentPassword, passwordData.newPassword);
            
            setPasswordSuccess('Password updated successfully!');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (err) {
            setPasswordError(err.message || 'Failed to update password');
        } finally {
            setIsChangingPassword(false);
        }
    };

    return (
        <div className="settings-container">
            <div className="settings-header">
                {fromProfile && (
                    <button className="back-btn" onClick={handleBack}>
                        <FaArrowLeft />
                        <span>Back to Profile</span>
                    </button>
                )}
                <h1>Settings</h1>
            </div>

            <div className="settings-content">
                {/* Profile Settings Section */}
                <div className="settings-section">
                    <div className="section-header">
                        <h2>Profile Settings</h2>
                        <button 
                            className={`edit-btn ${isEditing ? 'active' : ''}`}
                            onClick={handleEditToggle}
                        >
                            {isEditing ? (
                                <>
                                    <FaTimes /> Cancel
                                </>
                            ) : (
                                <>
                                    <FaEdit /> Edit Profile
                                </>
                            )}
                        </button>
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <form onSubmit={handleSubmit} className="profile-form">
                        <div className="avatar-section">
                            <div 
                                className={`avatar-upload ${isEditing ? 'editable' : ''}`}
                                onClick={handleAvatarClick}
                            >
                                {previewAvatar || avatar ? (
                                    <img 
                                        src={previewAvatar || avatar} 
                                        alt="Profile" 
                                        className="avatar-preview"
                                    />
                                ) : (
                                    <div className="avatar-placeholder">
                                        {user?.displayName?.[0] || user?.email?.[0] || <FaUser />}
                                    </div>
                                )}
                                {isEditing && (
                                    <div className="avatar-overlay">
                                        <FaCamera />
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleAvatarChange}
                                accept="image/*"
                                style={{ display: 'none' }}
                                disabled={!isEditing}
                            />
                        </div>

                        <div className="form-group">
                            <label>Display Name</label>
                            <input
                                type="text"
                                name="displayName"
                                value={profileData.displayName}
                                onChange={(e) => setProfileData(prev => ({
                                    ...prev,
                                    displayName: e.target.value
                                }))}
                                disabled={!isEditing}
                                placeholder="Enter your display name"
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={profileData.email}
                                disabled={true}
                                readOnly
                            />
                        </div>

                        {isEditing && (
                            <button 
                                type="submit" 
                                className="save-btn"
                                disabled={loading}
                            >
                                {loading ? (
                                    'Saving...'
                                ) : (
                                    <>
                                        <FaCheck /> Save Changes
                                    </>
                                )}
                            </button>
                        )}
                    </form>
                </div>

                {/* Password Change Section */}
                <div className="settings-section">
                    <div className="section-header">
                        <h2>Change Password</h2>
                        <div className="password-icon">
                            <FaLock />
                        </div>
                    </div>

                    {passwordError && <div className="error-message">{passwordError}</div>}
                    {passwordSuccess && <div className="success-message">{passwordSuccess}</div>}

                    <form onSubmit={handlePasswordChange} className="password-form">
                        <div className="password-form-inputs">
                            <div className="form-group">
                                <label>Current Password</label>
                                <div className="password-input-container">
                                    <input
                                        type={showCurrentPassword ? "text" : "password"}
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData(prev => ({
                                            ...prev,
                                            currentPassword: e.target.value
                                        }))}
                                        placeholder="Enter current password"
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    >
                                        {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>New Password</label>
                                <div className="password-input-container">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData(prev => ({
                                            ...prev,
                                            newPassword: e.target.value
                                        }))}
                                        placeholder="Enter new password"
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <div className="password-input-container">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData(prev => ({
                                            ...prev,
                                            confirmPassword: e.target.value
                                        }))}
                                        placeholder="Confirm new password"
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className="save-btn"
                                disabled={isChangingPassword}
                            >
                                {isChangingPassword ? (
                                    'Updating Password...'
                                ) : (
                                    <>
                                        <FaLock /> Update Password
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="password-requirements">
                            <p>Password must contain:</p>
                            <ul>
                                <li>At least 8 characters</li>
                                <li>One uppercase letter</li>
                                <li>One lowercase letter</li>
                                <li>One number</li>
                                <li>One special character</li>
                            </ul>
                        </div>
                    </form>
                </div>

                {/* Connected Wallets Section */}
                <div className="settings-section">
                    <div className="section-header">
                        <h2>Connected Wallets</h2>
                        <div className="wallet-count">
                            {user?.walletAddresses?.length || 0} Wallet{user?.walletAddresses?.length !== 1 ? 's' : ''} Connected
                        </div>
                    </div>

                    {walletError && <div className="error-message">{walletError}</div>}

                    <div className="wallet-list">
                        {user?.walletAddresses?.map((wallet) => (
                            <div key={wallet.address} className="wallet-details">
                                <div className="wallet-info">
                                    <div className="wallet-icon">
                                        <FaWallet />
                                    </div>
                                    <div className="wallet-details">
                                        <div className="wallet-name">Wallet {user?.walletAddresses?.indexOf(wallet) + 1}</div>
                                        <div className="wallet-meta">
                                            <div className="wallet-address">
                                                {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                                                <button 
                                                    className="copy-address-btn"
                                                    onClick={() => handleCopyAddress(wallet.address)}
                                                    title="Copy address"
                                                >
                                                    {copiedAddress === wallet.address ? (
                                                        <FaCheck className="copied" />
                                                    ) : (
                                                        <FaCopy />
                                                    )}
                                                </button>
                                            </div>
                                            <div className="wallet-network">BSC Network</div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDisconnectWallet(wallet.address)}
                                    className={`disconnect-btn ${walletLoading || disconnecting === wallet.address ? 'loading' : ''}`}
                                    disabled={walletLoading || disconnecting === wallet.address}
                                >
                                    {disconnecting === wallet.address ? 'Disconnecting...' : 'Disconnect'}
                                </button>
                            </div>
                        ))}
                        {!user?.walletAddresses?.length && (
                            <div className="no-wallets-message">
                                <FaWallet className="empty-wallet-icon" />
                                <p>No wallets connected</p>
                                <span>Add a wallet from your profile page to get started</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings; 