import React, { useCallback, useEffect } from 'react';
import { 
    BrowserRouter as Router, 
    Routes, 
    Route, 
    Navigate, 
    useLocation,
    UNSAFE_NavigationContext
} from 'react-router-dom';
import { Web3ReactProvider, useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Profile from './components/profile/Profile';
import Settings from './components/settings/Settings';
import PnL from './components/pnl/PnL';
import WeeklyWithdrawal from './components/withdrawal/WeeklyWithdrawal';
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';
import debounce from 'lodash/debounce';
import Terms from './components/legal/Terms';
import Privacy from './components/legal/Privacy';
import Disclaimer from './components/legal/Disclaimer';
import Cookies from './components/legal/Cookies';

// Protected Route component
const ProtectedRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!currentUser) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
};

// Initialize Web3
const getLibrary = (provider) => {
    const library = new ethers.providers.Web3Provider(provider);
    library.pollingInterval = 12000;
    return library;
};

const AppContent = () => {
    const location = useLocation();
    const { active } = useWeb3React();
    const { currentUser } = useAuth();
    const navigation = React.useContext(UNSAFE_NavigationContext).navigator;

    // Use React.startTransition for route changes
    const navigate = React.useCallback((to) => {
        React.startTransition(() => {
            navigation.push(to);
        });
    }, [navigation]);

    // Debounced scroll handler
    const handleScroll = useCallback(
        debounce(() => {
            // Your scroll handling logic
        }, 16),
        []
    );

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return (
        <div className="App">
            <Navbar />
            <div className="container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/pnl" element={<PnL />} />
                    <Route path="/weekly-withdrawal" element={<WeeklyWithdrawal />} />
                    <Route 
                        path="/profile" 
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/settings" 
                        element={
                            <ProtectedRoute>
                                <Settings />
                            </ProtectedRoute>
                        } 
                    />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/disclaimer" element={<Disclaimer />} />
                    <Route path="/cookies" element={<Cookies />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
            <Footer />
        </div>
    );
};

function App() {
    return (
        <Router future={{ v7_startTransition: true }}>
            <AuthProvider>
                <Web3ReactProvider getLibrary={getLibrary}>
                    <AppContent />
                </Web3ReactProvider>
            </AuthProvider>
        </Router>
    );
}

export default App; 