import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [walletLoading, setWalletLoading] = useState(false);

    const API_URL = 'https://three65coin-backend.onrender.com';

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchCurrentUser(token);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchCurrentUser = async (token) => {
        try {
            const response = await axios.get(`${API_URL}/api/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCurrentUser(response.data);
        } catch (error) {
            console.error('Error fetching user:', error);
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    const signup = async (username, email, password) => {
        try {
            setLoading(true);
            setError('');
            
            const response = await axios.post(`${API_URL}/api/auth/signup`, {
                username,
                email,
                password
            });

            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setCurrentUser(user);
            return { success: true };
        } catch (error) {
            console.error('Signup error:', error.response?.data || error.message);
            setError(error.response?.data?.message || 'Failed to create account');
            return { success: false, error: error.response?.data?.message || 'Failed to create account' };
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            setLoading(true);
            setError('');

            const response = await axios.post(`${API_URL}/api/auth/login`, {
                email,
                password
            });

            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setCurrentUser(user);
            return { success: true };
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            setError(error.response?.data?.message || 'Failed to log in');
            return { success: false, error: error.response?.data?.message || 'Failed to log in' };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await axios.post(`${API_URL}/api/auth/logout`, null, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            setCurrentUser(null);
        }
    };

    const connectWalletToAccount = async (walletAddress) => {
        try {
            setWalletLoading(true);
            setError('');

            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API_URL}/api/auth/connect-wallet`,
                { walletAddress },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setCurrentUser(response.data.user);
            return { success: true };
        } catch (error) {
            console.error('Connect wallet error:', error.response?.data || error.message);
            setError(error.response?.data?.message || 'Failed to connect wallet');
            return { success: false, error: error.response?.data?.message || 'Failed to connect wallet' };
        } finally {
            setWalletLoading(false);
        }
    };

    const disconnectWalletFromAccount = async (walletAddress) => {
        try {
            setWalletLoading(true);
            setError('');

            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API_URL}/api/auth/disconnect-wallet`,
                { walletAddress },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setCurrentUser(response.data.user);
            return { success: true };
        } catch (error) {
            console.error('Disconnect wallet error:', error.response?.data || error.message);
            setError(error.response?.data?.message || 'Failed to disconnect wallet');
            return { success: false, error: error.response?.data?.message || 'Failed to disconnect wallet' };
        } finally {
            setWalletLoading(false);
        }
    };

    const value = {
        currentUser,
        loading,
        error,
        walletLoading,
        signup,
        login,
        logout,
        connectWalletToAccount,
        disconnectWalletFromAccount
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
} 