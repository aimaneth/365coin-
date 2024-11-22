import React, { useState } from 'react';
import './Withdraw.css';

const Withdraw = () => {
    const [selectedType, setSelectedType] = useState('turnover');
    const [data, setData] = useState([
        { date: "22.10.2024", turnover: 400000, profit: -250000, change: -5 },
        { date: "23.10.2024", turnover: 400000, profit: -250000, change: -5 },
        { date: "24.10.2024", turnover: 400000, profit: -250000, change: -5 },
        { date: "25.10.2024", turnover: 400000, profit: -250000, change: -5 },
    ]);
    const [availableBalance, setAvailableBalance] = useState(10000); // Example balance
    const [withdrawAmount, setWithdrawAmount] = useState('');

    const handleWithdraw = () => {
        if (withdrawAmount > 0 && withdrawAmount <= availableBalance) {
            alert(`Withdrawing ${withdrawAmount}`);
            setAvailableBalance(availableBalance - withdrawAmount);
            setWithdrawAmount('');
        } else {
            alert('Invalid withdrawal amount');
        }
    };

    const renderTable = (type) => {
        return data.map((row, index) => (
            <tr key={index}>
                <td>{row.date}</td>
                <td>{row[type]}</td>
                <td>{row.change}%</td>
            </tr>
        ));
    };

    return (
        <div className="withdraw-container">
            <h1 className="withdraw-header">Weekly Withdraw</h1>
            <div className="balance-info">
                <p>Available Balance: ${availableBalance}</p>
            </div>
            <div className="withdraw-input">
                <input 
                    type="number" 
                    value={withdrawAmount} 
                    onChange={(e) => setWithdrawAmount(e.target.value)} 
                    placeholder="Enter amount to withdraw" 
                />
                <button onClick={handleWithdraw} className="withdraw-btn">Withdraw</button>
            </div>
            <div className="toggle-buttons">
                <button onClick={() => setSelectedType('turnover')} className={`toggle-btn ${selectedType === 'turnover' ? 'active' : ''}`}>
                    Show Turnover
                </button>
                <button onClick={() => setSelectedType('profit')} className={`toggle-btn ${selectedType === 'profit' ? 'active' : ''}`}>
                    Show Profit
                </button>
            </div>
            <table className="withdraw-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>{selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}</th>
                        <th>Change (%)</th>
                    </tr>
                </thead>
                <tbody>
                    {renderTable(selectedType)}
                </tbody>
            </table>
        </div>
    );
};

export default Withdraw; 