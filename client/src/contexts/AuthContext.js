import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Check token and restore session on mount
    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    // Set default axios header
                    axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                    
                    // Verify token and get user data
                    const response = await axios.get('/api/auth/me');
                    setUser(response.data);
                    setToken(storedToken);
                } catch (error) {
                    console.error('Session restoration failed:', error);
                    // If token is invalid, clear everything
                    localStorage.removeItem('token');
                    delete axios.defaults.headers.common['Authorization'];
                    setUser(null);
                    setToken(null);
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    // Add axios default header when token exists
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    const signup = async (email, password, username) => {
        try {
            const response = await axios.post('/api/auth/signup', {
                email,
                password,
                username
            });
            setUser(response.data.user);
            setToken(response.data.token);
            localStorage.setItem('token', response.data.token);
            return response.data;
        } catch (error) {
            console.error('Signup Error:', error);
            throw error.response?.data?.message || 'Signup failed';
        }
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post('/api/auth/login', {
                email,
                password
            });
            setUser(response.data.user);
            setToken(response.data.token);
            localStorage.setItem('token', response.data.token);
            return response.data;
        } catch (error) {
            console.error('Login Error:', error);
            throw error.response?.data?.message || 'Login failed';
        }
    };

    const logout = async () => {
        try {
            if (token) {
                await axios.post('/api/auth/logout');
            }
        } catch (error) {
            console.error('Logout Error:', error);
        } finally {
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            window.location.href = '/';
        }
    };

    const connectWalletToAccount = async (walletAddress) => {
        try {
            console.log('Connecting wallet:', walletAddress);
            const response = await axios.post('/api/auth/connect-wallet', { walletAddress });
            console.log('Wallet connection response:', response.data);
            
            // Update the user state with the new wallet data
            if (response.data.user) {
                setUser(response.data.user);
                return response.data;
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Wallet Connection Error:', error.response?.data || error);
            throw error.response?.data?.message || error.message || 'Failed to connect wallet';
        }
    };

    const disconnectWalletFromAccount = async (walletAddress) => {
        try {
            const response = await axios.post('/api/auth/disconnect-wallet', { walletAddress });
            setUser(response.data.user); // Update user data without the wallet
            return response.data;
        } catch (error) {
            console.error('Wallet Disconnection Error:', error);
            throw error.response?.data?.message || 'Failed to disconnect wallet';
        }
    };

    const value = {
        user,
        token,
        loading,
        signup,
        login,
        logout,
        connectWalletToAccount,
        disconnectWalletFromAccount
    };

    if (loading) {
        return <div className="loading-spinner" />;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
} 