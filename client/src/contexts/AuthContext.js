import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/axios';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [walletLoading, setWalletLoading] = useState(false);
    const navigate = useNavigate();

    // Initialize auth state
    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                try {
                    const response = await api.get('/api/auth/me');
                    if (response.data) {
                        setCurrentUser(response.data);
                    }
                } catch (error) {
                    // Only clear on auth errors
                    if (error.response?.status === 401 || error.response?.status === 403) {
                        localStorage.removeItem('token');
                        delete api.defaults.headers.common['Authorization'];
                        setCurrentUser(null);
                    }
                    // For other errors, keep the token and retry later
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    // Add retry mechanism for failed auth checks
    useEffect(() => {
        let retryTimeout;
        const retryAuth = async () => {
            const token = localStorage.getItem('token');
            if (token && !currentUser) {
                try {
                    const response = await api.get('/api/auth/me');
                    if (response.data) {
                        setCurrentUser(response.data);
                    }
                } catch (error) {
                    if (error.response?.status === 401 || error.response?.status === 403) {
                        localStorage.removeItem('token');
                        delete api.defaults.headers.common['Authorization'];
                        setCurrentUser(null);
                    } else {
                        // Retry after 5 seconds for non-auth errors
                        retryTimeout = setTimeout(retryAuth, 5000);
                    }
                }
            }
        };

        if (!currentUser && localStorage.getItem('token')) {
            retryTimeout = setTimeout(retryAuth, 5000);
        }

        return () => {
            if (retryTimeout) {
                clearTimeout(retryTimeout);
            }
        };
    }, [currentUser]);

    const signup = async (username, email, password) => {
        try {
            setLoading(true);
            setError('');
            
            // Check cache first
            const cache = localStorage.getItem('apiCache') ? JSON.parse(localStorage.getItem('apiCache')) : {};
            const cacheKey = '/api/auth/signup';
            const cachedData = cache[cacheKey];
            
            // If we have cached data and it's less than 5 minutes old, use it
            if (cachedData && Date.now() - cachedData.timestamp < 5 * 60 * 1000) {
                const { token, user } = cachedData.data;
                localStorage.setItem('token', token);
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setCurrentUser(user);
                return { success: true };
            }

            const response = await api.post('/api/auth/signup', {
                username,
                email,
                password
            });

            const { token, user } = response.data;
            localStorage.setItem('token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setCurrentUser(user);
            return { success: true };
        } catch (error) {
            console.error('Signup error:', error.response?.data || error.message);
            let errorMessage = error.response?.data?.message || 'Failed to create account';
            
            // Handle timeout errors
            if (error.code === 'ECONNABORTED') {
                errorMessage = 'Request timed out. Please try again.';
            }
            
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            setLoading(true);
            setError('');

            // Check cache first
            const cache = localStorage.getItem('apiCache') ? JSON.parse(localStorage.getItem('apiCache')) : {};
            const cacheKey = '/api/auth/login';
            const cachedData = cache[cacheKey];
            
            // If we have cached data and it's less than 5 minutes old, use it
            if (cachedData && Date.now() - cachedData.timestamp < 5 * 60 * 1000) {
                const { token, user } = cachedData.data;
                localStorage.setItem('token', token);
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setCurrentUser(user);
                return { success: true };
            }

            const response = await api.post('/api/auth/login', {
                email,
                password
            });

            const { token, user } = response.data;
            localStorage.setItem('token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setCurrentUser(user);
            return { success: true };
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            let errorMessage = error.response?.data?.message || 'Failed to log in';
            
            // Handle timeout errors
            if (error.code === 'ECONNABORTED') {
                errorMessage = 'Request timed out. Please try again.';
            }
            
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await api.post('/api/auth/logout');
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
            setCurrentUser(null);
            navigate('/');
        }
    };

    const connectWalletToAccount = async (walletAddress) => {
        try {
            setWalletLoading(true);
            setError('');

            const response = await api.post('/api/auth/connect-wallet', { walletAddress });
            setCurrentUser(response.data.user);
            return { success: true, user: response.data.user };
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

            const response = await api.post('/api/auth/disconnect-wallet', { walletAddress });
            setCurrentUser(response.data.user);
            return { success: true, user: response.data.user };
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
            {children}
        </AuthContext.Provider>
    );
} 