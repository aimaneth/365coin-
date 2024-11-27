import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const API_URL = process.env.NODE_ENV === 'production' 
        ? '/api'
        : process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }
            
            const data = await response.json();
            setUser(data.user);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            return data;
        } catch (error) {
            throw error;
        }
    };

    const signup = async (email, password, username) => {
        try {
            console.log('Attempting signup with:', { email, username });
            
            // Use the correct API URL
            const API_URL = process.env.REACT_APP_API_URL;
            console.log('Using API URL:', API_URL); // Debug log
            
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password, username })
            });
            
            const data = await response.json();
            console.log('Response:', data); // Debug log
            
            if (!response.ok) {
                throw new Error(data.message || 'Signup failed');
            }
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            return data;
        } catch (error) {
            console.error('Signup Error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            // Clear user data
            setUser(null);
            localStorage.removeItem('user');
            localStorage.removeItem('token');

            // If using Web3React, you can access it here to disconnect the wallet
            if (window.ethereum) {
                try {
                    // Reset the connection
                    await window.ethereum.request({
                        method: 'wallet_requestPermissions',
                        params: [{ eth_accounts: {} }]
                    });
                } catch (error) {
                    console.log('Error resetting wallet connection:', error);
                }
            }
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    };

    const resetPassword = async (email) => {
        try {
            const response = await fetch(`${API_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }
            
            return true;
        } catch (error) {
            throw error;
        }
    };

    const connectWalletToAccount = async (walletAddress) => {
        try {
            if (!user) {
                throw new Error('Must be logged in to connect wallet');
            }

            console.log('Connecting wallet:', walletAddress);

            const response = await fetch(`${API_URL}/auth/connect-wallet`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    userId: user.id,
                    walletAddress
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to connect wallet');
            }

            const data = await response.json();
            
            // Update user state with new wallet info
            setUser(prevUser => ({
                ...prevUser,
                walletAddresses: data.walletAddresses
            }));

            // Update localStorage
            localStorage.setItem('user', JSON.stringify({
                ...user,
                walletAddresses: data.walletAddresses
            }));

            console.log('Wallet connected successfully:', data);
            return data;
        } catch (error) {
            console.error('Wallet connection error:', error);
            throw error;
        }
    };

    const disconnectWalletFromAccount = async (walletAddress) => {
        try {
            if (!user) {
                throw new Error('Must be logged in to disconnect wallet');
            }

            console.log('Disconnecting wallet:', walletAddress);

            const response = await fetch(`${API_URL}/auth/disconnect-wallet`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    userId: user.id,
                    walletAddress
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to disconnect wallet');
            }

            const data = await response.json();
            
            // Update user state with updated wallet list
            setUser(prevUser => ({
                ...prevUser,
                walletAddresses: data.walletAddresses
            }));

            // Update localStorage
            localStorage.setItem('user', JSON.stringify({
                ...user,
                walletAddresses: data.walletAddresses
            }));

            console.log('Wallet disconnected successfully');
            return data;
        } catch (error) {
            console.error('Wallet disconnection error:', error);
            throw error;
        }
    };

    // Add this method to verify token on app load
    const verifyToken = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return null;

            const response = await fetch(`${API_URL}/auth/verify-token`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                return null;
            }

            const data = await response.json();
            return data.user;
        } catch (error) {
            console.error('Token verification error:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return null;
        }
    };

    // Add to useEffect in AuthProvider
    useEffect(() => {
        const initAuth = async () => {
            setLoading(true);
            const verifiedUser = await verifyToken();
            if (verifiedUser) {
                setUser(verifiedUser);
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            signup, 
            logout, 
            resetPassword, 
            loading,
            connectWalletToAccount,
            disconnectWalletFromAccount
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 