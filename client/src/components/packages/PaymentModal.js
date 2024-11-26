import React, { useState } from 'react';
import { FaWallet, FaExchangeAlt, FaCopy, FaTimes } from 'react-icons/fa';
import './PaymentModal.css';

const PaymentModal = ({ package: selectedPackage, onClose }) => {
    const [paymentNetwork, setPaymentNetwork] = useState('bep20');
    const [copied, setCopied] = useState(false);

    const walletAddresses = {
        bep20: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        trc20: 'TYQrFeaH8qm1X89EpVHCUaVdB3jCqHKgXp'
    };

    const handleCopyAddress = () => {
        navigator.clipboard.writeText(walletAddresses[paymentNetwork]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmitPayment = () => {
        // Here you would implement the payment verification logic
        console.log('Payment submitted for:', selectedPackage.name);
        // You could also add API calls to your backend here
    };

    return (
        <div className="payment-modal-overlay">
            <div className="payment-modal">
                <button className="close-modal" onClick={onClose}>
                    <FaTimes />
                </button>

                <div className="payment-modal-content">
                    <h2>Complete Your Purchase</h2>
                    
                    <div className="selected-package-info">
                        <div className="package-name">
                            {selectedPackage.icon}
                            <span>{selectedPackage.name} Package</span>
                        </div>
                        <div className="package-price">
                            ${selectedPackage.price}
                        </div>
                    </div>

                    <div className="payment-options">
                        <h3>Select Payment Network</h3>
                        <div className="network-selector">
                            <button 
                                className={`network-btn ${paymentNetwork === 'bep20' ? 'active' : ''}`}
                                onClick={() => setPaymentNetwork('bep20')}
                            >
                                <FaWallet /> USDT BEP20
                            </button>
                            <button 
                                className={`network-btn ${paymentNetwork === 'trc20' ? 'active' : ''}`}
                                onClick={() => setPaymentNetwork('trc20')}
                            >
                                <FaExchangeAlt /> USDT TRC20
                            </button>
                        </div>
                    </div>

                    <div className="payment-address">
                        <h3>Payment Address</h3>
                        <div className="address-display">
                            <span className="wallet-address">{walletAddresses[paymentNetwork]}</span>
                            <button 
                                className={`copy-btn ${copied ? 'copied' : ''}`}
                                onClick={handleCopyAddress}
                            >
                                {copied ? 'Copied!' : <FaCopy />}
                            </button>
                        </div>
                        <p className="payment-note">
                            Please send exactly ${selectedPackage.price} USDT to the address above
                        </p>
                    </div>

                    <div className="payment-instructions">
                        <h3>Important Instructions</h3>
                        <ul>
                            <li>Send only USDT through the selected network</li>
                            <li>Ensure you send the exact amount</li>
                            <li>Transaction may take 5-10 minutes to confirm</li>
                            <li>Keep your transaction hash for reference</li>
                        </ul>
                    </div>

                    <div className="payment-actions">
                        <button 
                            className="submit-payment-btn"
                            onClick={handleSubmitPayment}
                        >
                            I've Sent the Payment
                        </button>
                        <button 
                            className="cancel-payment-btn"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal; 