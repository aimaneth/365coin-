import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Web3ReactProvider, useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import Navbar from './components/Navbar';
import Home from './components/Home';
import PnL from './components/PnL';
import Withdraw from './components/Withdraw';
import Footer from './components/Footer';
import './App.css';

// Initialize Web3
const getLibrary = (provider) => {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
};

const AppContent = () => {
  const location = useLocation();
  const { active } = useWeb3React();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <div className="App">
      {!isDashboard && <Navbar />}
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pnl" element={active ? <PnL /> : <Navigate to="/" />} />
          <Route path="/withdraw" element={active ? <Withdraw /> : <Navigate to="/" />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Router>
        <AppContent />
      </Router>
    </Web3ReactProvider>
  );
}

export default App; 