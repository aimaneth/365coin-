import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Create custom axios instance
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://three65coin-backend.onrender.com',
    headers: {
        'Content-Type': 'application/json'
    }
});

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [walletLoading, setWalletLoading] = useState(false);

    useEffect(() => {
        // Check for token in localStorage
        const token = localStorage.getItem('token');
        if (token) {
            // Set axios default header
            api.defaults.headers['Authorization'] = `Bearer ${token}`;
            // Verify token and get user data
            verifyToken();
        } else {
            setLoading(false);
        }
    }, []);

    const verifyToken = async () => {
        try {
            const response = await api.get('/api/auth/verify');
            setCurrentUser(response.data.user);
        } catch (error) {
            localStorage.removeItem('token');
            delete api.defaults.headers['Authorization'];
        } finally {
            setLoading(false);
        }
    };

    const signup = async (email, password, username) => {
        try {
            const response = await api.post('/api/auth/signup', {
                email,
                password,
                username
            });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            api.defaults.headers['Authorization'] = `Bearer ${token}`;
            setCurrentUser(user);
            return user;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to create account';
        }
    };

    const login = async (email, password) => {
        try {
            const response = await api.post('/api/auth/login', {
                email,
                password
            });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            api.defaults.headers['Authorization'] = `Bearer ${token}`;
            setCurrentUser(user);
            return user;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to log in';
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete api.defaults.headers['Authorization'];
        setCurrentUser(null);
    };

    const connectWalletToAccount = async (walletAddress) => {
        try {
            setWalletLoading(true);
            const response = await api.post('/api/auth/connect-wallet', { walletAddress });
            if (response.data.user) {
                setCurrentUser(response.data.user);
                return response.data;
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            throw error.response?.data?.message || 'Failed to connect wallet';
        } finally {
            setWalletLoading(false);
        }
    };

    const disconnectWalletFromAccount = async (walletAddress) => {
        try {
            setWalletLoading(true);
            const response = await api.post('/api/auth/disconnect-wallet', { walletAddress });
            setCurrentUser(response.data.user); // Update user data without the wallet
            return response.data;
        } catch (error) {
            console.error('Wallet Disconnection Error:', error);
            throw error.response?.data?.message || 'Failed to disconnect wallet';
        } finally {
            setWalletLoading(false);
        }
    };

    // New wallet-related functions
    const updateWalletName = async (walletAddress, newName) => {
        try {
            setWalletLoading(true);
            const response = await api.put('/api/auth/wallet/update-name', {
                walletAddress,
                newName
            });
            setCurrentUser(response.data.user);
            return response.data;
        } catch (error) {
            console.error('Wallet Name Update Error:', error);
            throw error.response?.data?.message || 'Failed to update wallet name';
        } finally {
            setWalletLoading(false);
        }
    };

    const getWalletBalance = async (walletAddress) => {
        try {
            setWalletLoading(true);
            const response = await api.get(`/api/auth/wallet/balance/${walletAddress}`);
            return response.data.balance;
        } catch (error) {
            console.error('Wallet Balance Error:', error);
            throw error.response?.data?.message || 'Failed to fetch wallet balance';
        } finally {
            setWalletLoading(false);
        }
    };

    const getWalletTransactions = async (walletAddress, page = 1, limit = 10) => {
        try {
            setWalletLoading(true);
            const response = await api.get(
                `/api/auth/wallet/transactions/${walletAddress}`,
                { params: { page, limit } }
            );
            return response.data;
        } catch (error) {
            console.error('Wallet Transactions Error:', error);
            throw error.response?.data?.message || 'Failed to fetch wallet transactions';
        } finally {
            setWalletLoading(false);
        }
    };

    const verifyWalletOwnership = async (walletAddress, message, signature) => {
        try {
            setWalletLoading(true);
            const response = await api.post('/api/auth/wallet/verify-ownership', {
                walletAddress,
                message,
                signature
            });
            return response.data.isValid;
        } catch (error) {
            console.error('Wallet Verification Error:', error);
            throw error.response?.data?.message || 'Failed to verify wallet ownership';
        } finally {
            setWalletLoading(false);
        }
    };

    const value = {
        currentUser,
        signup,
        login,
        logout,
        loading,
        walletLoading,
        connectWalletToAccount,
        disconnectWalletFromAccount,
        updateWalletName,
        getWalletBalance,
        getWalletTransactions,
        verifyWalletOwnership
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
} 