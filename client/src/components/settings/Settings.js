import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FaUser, FaCamera, FaWallet, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import './Settings.css';

const Settings = () => {
    const { user, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        username: user?.username || '',
        email: user?.email || '',
    });
    const [avatar, setAvatar] = useState(user?.avatar || null);
    const [previewAvatar, setPreviewAvatar] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (!isEditing) {
            setProfileData({
                username: user?.username || '',
                email: user?.email || '',
            });
            setPreviewAvatar(null);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
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
                avatar: avatar
            });
            setSuccess('Profile updated successfully!');
            setIsEditing(false);
        } catch (err) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="settings-container">
            <div className="settings-header">
                <h1>Account Settings</h1>
                <p>Manage your profile and preferences</p>
            </div>

            <div className="settings-grid">
                {/* Profile Section */}
                <div className="settings-card">
                    <div className="settings-card-header">
                        <h2>Profile Information</h2>
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

                    <form onSubmit={handleSubmit} className="settings-form">
                        <div className="avatar-section">
                            <div 
                                className="avatar-upload"
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
                                        {user?.username?.charAt(0).toUpperCase() || <FaUser />}
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
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                value={profileData.username}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={profileData.email}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                                required
                            />
                        </div>

                        {isEditing && (
                            <button 
                                type="submit" 
                                className="save-btn"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : (
                                    <>
                                        <FaCheck /> Save Changes
                                    </>
                                )}
                            </button>
                        )}
                    </form>
                </div>

                {/* Connected Wallets Section */}
                <div className="settings-card">
                    <div className="settings-card-header">
                        <h2>Connected Wallets</h2>
                    </div>
                    <div className="wallets-list">
                        {user?.walletAddresses?.map((wallet, index) => (
                            <div key={index} className="wallet-item">
                                <div className="wallet-info">
                                    <FaWallet className="wallet-icon" />
                                    <div className="wallet-details">
                                        <span className="wallet-address">
                                            {`${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`}
                                        </span>
                                        <span className="wallet-network">{wallet.network}</span>
                                    </div>
                                </div>
                                <span className="wallet-date">
                                    Added {new Date(wallet.dateAdded).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                        <button className="add-wallet-btn">
                            <FaWallet /> Connect New Wallet
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings; 