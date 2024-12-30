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

    // Token refresh mechanism
    useEffect(() => {
        let refreshInterval;
        let refreshTimeout;

        const refreshToken = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await api.post('/api/auth/refresh');
                if (response.data?.token) {
                    localStorage.setItem('token', response.data.token);
                    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                    if (response.data.user) {
                        setCurrentUser(response.data.user);
                    }
                }
            } catch (error) {
                console.error('Token refresh error:', error);
                // Only clear on auth errors
                if (error.response?.status === 401 || error.response?.status === 403) {
                    localStorage.removeItem('token');
                    delete api.defaults.headers.common['Authorization'];
                    setCurrentUser(null);
                } else {
                    // Retry after 5 seconds for non-auth errors
                    refreshTimeout = setTimeout(refreshToken, 5000);
                }
            }
        };

        if (currentUser) {
            // Initial refresh
            refreshToken();
            // Set up interval for subsequent refreshes (every 14 minutes)
            refreshInterval = setInterval(refreshToken, 14 * 60 * 1000);
        }

        return () => {
            if (refreshInterval) clearInterval(refreshInterval);
            if (refreshTimeout) clearTimeout(refreshTimeout);
        };
    }, [currentUser]);

    const signup = async (username, email, password) => {
        try {
            setLoading(true);
            setError('');
            
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