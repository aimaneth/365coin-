import React, { useState } from 'react';
import { FaDownload } from 'react-icons/fa';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#f0c000',
        },
        background: {
            paper: 'rgba(30, 30, 30, 0.95)',
            default: 'rgba(30, 30, 30, 0.95)',
        },
        text: {
            primary: '#ffffff',
            secondary: 'rgba(255, 255, 255, 0.7)',
        },
    },
});

const TradeHistory = ({ trades }) => {
    const [startDate, setStartDate] = useState(dayjs().subtract(7, 'day'));
    const [endDate, setEndDate] = useState(dayjs());

    const downloadCSV = () => {
        const headers = ['Date', 'Type', 'Entry', 'Exit', 'Amount', 'PnL', 'ROI'];
        const data = trades.map(trade => [
            dayjs(trade.time * 1000).format('MM/DD/YYYY'),
            trade.type,
            trade.entryPrice,
            trade.exitPrice,
            trade.amount,
            trade.pnl,
            trade.roi + '%'
        ]);

        const csvContent = [
            headers.join(','),
            ...data.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'trade_history.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="trade-history-section">
            <div className="trade-history-header">
                <h3>Trade History</h3>
                <div className="trade-history-controls">
                    <ThemeProvider theme={darkTheme}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <div className="date-picker-group">
                                <DatePicker
                                    value={startDate}
                                    onChange={setStartDate}
                                    format="MMM D, YYYY"
                                    slotProps={{
                                        textField: {
                                            size: "small",
                                            className: "date-picker"
                                        }
                                    }}
                                />
                                <span>to</span>
                                <DatePicker
                                    value={endDate}
                                    onChange={setEndDate}
                                    minDate={startDate}
                                    format="MMM D, YYYY"
                                    slotProps={{
                                        textField: {
                                            size: "small",
                                            className: "date-picker"
                                        }
                                    }}
                                />
                            </div>
                        </LocalizationProvider>
                    </ThemeProvider>
                    <button className="download-btn" onClick={downloadCSV}>
                        <FaDownload /> Export CSV
                    </button>
                </div>
            </div>

            <div className="trade-history-table">
                <div className="table-header">
                    <div className="th">Date</div>
                    <div className="th">Type</div>
                    <div className="th">Entry</div>
                    <div className="th">Exit</div>
                    <div className="th">Amount</div>
                    <div className="th">PnL</div>
                    <div className="th">ROI</div>
                </div>
                <div className="table-body">
                    {trades.map((trade, index) => (
                        <div key={index} className="table-row">
                            <div className="td" data-label="Date">
                                {dayjs(trade.time * 1000).format('MMM D, YYYY')}
                            </div>
                            <div className="td" data-label="Type">
                                <span className={`type ${trade.type}`}>
                                    {trade.type.toUpperCase()}
                                </span>
                            </div>
                            <div className="td" data-label="Entry">
                                ${trade.entryPrice.toLocaleString()}
                            </div>
                            <div className="td" data-label="Exit">
                                ${trade.exitPrice.toLocaleString()}
                            </div>
                            <div className="td" data-label="Amount">
                                {trade.amount}
                            </div>
                            <div className={`td ${trade.pnl >= 0 ? 'positive' : 'negative'}`} data-label="PnL">
                                {trade.pnl >= 0 ? '+' : '-'}${Math.abs(trade.pnl).toLocaleString()}
                            </div>
                            <div className={`td ${trade.roi >= 0 ? 'positive' : 'negative'}`} data-label="ROI">
                                {trade.roi >= 0 ? '+' : ''}{trade.roi}%
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TradeHistory; 