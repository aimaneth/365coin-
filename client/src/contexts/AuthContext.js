import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [walletLoading, setWalletLoading] = useState(false);

    // Use environment variable for API URL
    const API_URL = process.env.REACT_APP_API_URL || 'https://three65coin-backend.onrender.com';

    // Configure axios defaults
    useEffect(() => {
        axios.defaults.baseURL = API_URL;
        axios.defaults.withCredentials = true;
        axios.defaults.headers.common['Content-Type'] = 'application/json';
    }, []);

    useEffect(() => {
        // Check for token in localStorage
        const token = localStorage.getItem('token');
        if (token) {
            // Set axios default header
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // Verify token and get user data
            verifyToken();
        } else {
            setLoading(false);
        }
    }, []);

    const verifyToken = async () => {
        try {
            const response = await axios.get('/api/auth/verify');
            setCurrentUser(response.data.user);
        } catch (error) {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        } finally {
            setLoading(false);
        }
    };

    const signup = async (email, password, username) => {
        try {
            const response = await axios.post('/api/auth/signup', {
                email,
                password,
                username
            });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setCurrentUser(user);
            return user;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to create account';
        }
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post('/api/auth/login', {
                email,
                password
            });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setCurrentUser(user);
            return user;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to log in';
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setCurrentUser(null);
    };

    const connectWalletToAccount = async (walletAddress) => {
        try {
            setWalletLoading(true);
            console.log('Connecting wallet:', walletAddress);
            const response = await axios.post(`${API_URL}/api/auth/connect-wallet`, { walletAddress });
            console.log('Wallet connection response:', response.data);
            
            // Update the user state with the new wallet data
            if (response.data.user) {
                setCurrentUser(response.data.user);
                return response.data;
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Wallet Connection Error:', error.response?.data || error);
            throw error.response?.data?.message || error.message || 'Failed to connect wallet';
        } finally {
            setWalletLoading(false);
        }
    };

    const disconnectWalletFromAccount = async (walletAddress) => {
        try {
            setWalletLoading(true);
            const response = await axios.post(`${API_URL}/api/auth/disconnect-wallet`, { walletAddress });
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
            const response = await axios.put(`${API_URL}/api/auth/wallet/update-name`, {
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
            const response = await axios.get(`${API_URL}/api/auth/wallet/balance/${walletAddress}`);
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
            const response = await axios.get(
                `${API_URL}/api/auth/wallet/transactions/${walletAddress}`,
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
            const response = await axios.post(`${API_URL}/api/auth/wallet/verify-ownership`, {
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