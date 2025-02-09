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
                    // Only clear auth state for 401/403 errors
                    if (error.response?.status === 401 || error.response?.status === 403) {
                        localStorage.removeItem('token');
                        delete api.defaults.headers.common['Authorization'];
                        setCurrentUser(null);
                    } else {
                        // For other errors (network, server, etc.), keep retrying
                        console.error('Auth check failed, will retry:', error);
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

            // Validate inputs before making request
            if (!email || !password) {
                throw new Error('Email and password are required');
            }

            // Make the login request
            const response = await api.post('/api/auth/login', {
                email,
                password
            });

            if (!response.data?.token || !response.data?.user) {
                throw new Error('Invalid response from server');
            }

            const { token, user } = response.data;
            
            // Set token and user state
            localStorage.setItem('token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setCurrentUser(user);
            
            return { success: true };
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            
            // Handle specific error cases
            if (error.code === 'ECONNABORTED') {
                return { 
                    success: false, 
                    error: 'Connection timed out. Please check your internet connection and try again.' 
                };
            }
            
            if (error.response?.status === 401) {
                return { 
                    success: false, 
                    error: 'Invalid email or password' 
                };
            }
            
            if (error.response?.status === 429) {
                return { 
                    success: false, 
                    error: 'Too many login attempts. Please try again later.' 
                };
            }

            return { 
                success: false, 
                error: error.response?.data?.message || 'Failed to log in. Please try again.' 
            };
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

            // Verify we have a token
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required. Please log in again.');
            }

            // Ensure the Authorization header is set
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            const response = await api.post('/api/auth/connect-wallet', { 
                walletAddress 
            });

            if (!response.data?.user) {
                throw new Error('Invalid response from server');
            }

            // Update current user with new wallet data
            setCurrentUser(response.data.user);
            return { success: true, user: response.data.user };
        } catch (error) {
            console.error('Connect wallet error:', error);
            
            // Handle specific error cases
            if (error.response?.status === 401) {
                // Token expired or invalid - clear auth state and redirect to login
                localStorage.removeItem('token');
                delete api.defaults.headers.common['Authorization'];
                setCurrentUser(null);
                return { 
                    success: false, 
                    error: 'Session expired. Please log in again.' 
                };
            }
            
            if (error.response?.status === 400) {
                return { 
                    success: false, 
                    error: error.response.data.message || 'Wallet already connected' 
                };
            }

            return { 
                success: false, 
                error: error.response?.data?.message || error.message || 'Failed to connect wallet' 
            };
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