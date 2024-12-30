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

    const fetchCurrentUser = async () => {
        try {
            const response = await api.get('/api/auth/me');
            if (response.data) {
                setCurrentUser(response.data);
            } else {
                localStorage.removeItem('token');
                delete api.defaults.headers.common['Authorization'];
                setCurrentUser(null);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                localStorage.removeItem('token');
                delete api.defaults.headers.common['Authorization'];
                setCurrentUser(null);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                await fetchCurrentUser();
            } else {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    useEffect(() => {
        const handleStorageChange = async (e) => {
            if (e.key === 'token' && e.newValue !== e.oldValue) {
                if (!e.newValue) {
                    setCurrentUser(null);
                    delete api.defaults.headers.common['Authorization'];
                } else {
                    api.defaults.headers.common['Authorization'] = `Bearer ${e.newValue}`;
                    await fetchCurrentUser();
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    useEffect(() => {
        let refreshInterval;

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
                if (error.response?.status === 401 || error.response?.status === 403) {
                    localStorage.removeItem('token');
                    delete api.defaults.headers.common['Authorization'];
                    setCurrentUser(null);
                }
            }
        };

        if (currentUser) {
            refreshToken();
            refreshInterval = setInterval(refreshToken, 14 * 60 * 1000);
        }

        return () => {
            if (refreshInterval) {
                clearInterval(refreshInterval);
            }
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