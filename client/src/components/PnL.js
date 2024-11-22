import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import './PnL.css';
import jsPDF from 'jspdf';
import { CSVLink } from 'react-csv';

// Dummy Data
const data = [
    { date: "22.10.2024", turnover: 400000, profit: -250000 },
    { date: "23.10.2024", turnover: 400000, profit: -250000 },
    { date: "24.10.2024", turnover: 400000, profit: -250000 },
    { date: "25.10.2024", turnover: 400000, profit: -250000 },
];

const PnL = () => {
    const [selectedType, setSelectedType] = useState('turnover');
    const [chart1, setChart1] = useState(null);
    const [chart2, setChart2] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reportType, setReportType] = useState('Summary');
    const [filteredData, setFilteredData] = useState(data);
    const [chartType, setChartType] = useState('line');

    useEffect(() => {
        const ctx1 = document.getElementById("chart1").getContext("2d");
        const ctx2 = document.getElementById("chart2").getContext("2d");

        if (chart1) chart1.destroy();
        if (chart2) chart2.destroy();

        const newChart1 = new Chart(ctx1, {
            type: chartType,
            data: {
                labels: filteredData.map(row => row.date),
                datasets: [{
                    label: 'Turnover',
                    data: filteredData.map(row => row.turnover),
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.2)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: '#fff',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: '#4CAF50',
                        borderWidth: 1,
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                        },
                        ticks: {
                            color: '#fff',
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                        },
                        ticks: {
                            color: '#fff',
                        }
                    }
                }
            }
        });

        const newChart2 = new Chart(ctx2, {
            type: chartType,
            data: {
                labels: filteredData.map(row => row.date),
                datasets: [{
                    label: 'Profit',
                    data: filteredData.map(row => row.profit),
                    borderColor: '#FF5722',
                    backgroundColor: 'rgba(255, 87, 34, 0.2)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: '#fff',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        }
                    },
                    tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: '#FF5722',
                        borderWidth: 1,
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                        },
                        ticks: {
                            color: '#fff',
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                        },
                        ticks: {
                            color: '#fff',
                        }
                    }
                }
            }
        });

        setChart1(newChart1);
        setChart2(newChart2);

        return () => {
            newChart1.destroy();
            newChart2.destroy();
        };
    }, [selectedType, filteredData, chartType]);

    const renderTable = (type) => {
        return filteredData.map((row, index) => (
            <tr key={index}>
                <td>{row.date}</td>
                <td>{row[type]}</td>
            </tr>
        ));
    };

    const downloadReport = () => {
        const doc = new jsPDF();
        doc.text('Profit and Loss Report', 20, 20);
        doc.text(`Date Range: ${startDate} to ${endDate}`, 20, 30);
        doc.text(`Report Type: ${reportType}`, 20, 40);
        doc.save('PnL_Report.pdf');
    };

    const filterData = () => {
        const filtered = data.filter(row => {
            const rowDate = new Date(row.date.split('.').reverse().join('-'));
            const start = new Date(startDate);
            const end = new Date(endDate);
            return rowDate >= start && rowDate <= end;
        });
        setFilteredData(filtered);
    };

    return (
        <div className="pnl-container">
            <h1 className="pnl-header">Profit and Loss</h1>
            <div className="date-range">
                <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                    placeholder="Start Date" 
                />
                <input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} 
                    placeholder="End Date" 
                />
                <button onClick={filterData} className="filter-btn">Filter</button>
            </div>
            <div className="report-type">
                <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                    <option value="Summary">Summary</option>
                    <option value="Detailed">Detailed</option>
                </select>
            </div>
            <div className="chart-type">
                <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
                    <option value="line">Line</option>
                    <option value="bar">Bar</option>
                    <option value="radar">Radar</option>
                </select>
            </div>
            <div className="toggle-section">
                <div className="toggle-container">
                    <button 
                        onClick={() => setSelectedType('turnover')} 
                        className={`toggle-btn ${selectedType === 'turnover' ? 'active' : ''}`}
                    >
                        Turnover
                    </button>
                    <button 
                        onClick={() => setSelectedType('profit')} 
                        className={`toggle-btn ${selectedType === 'profit' ? 'active' : ''}`}
                    >
                        Profit
                    </button>
                    <div className={`toggle-pill ${selectedType}`}></div>
                </div>
            </div>
            <div className="export-buttons">
                <button onClick={downloadReport} className="download-btn">Download PDF</button>
                <CSVLink data={filteredData} filename={"PnL_Report.csv"} className="download-btn">Download CSV</CSVLink>
            </div>
            <table className="pnl-table" id="data-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>{selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}</th>
                    </tr>
                </thead>
                <tbody>
                    {renderTable(selectedType)}
                </tbody>
            </table>
            <div className="charts">
                <canvas id="chart1"></canvas>
                <canvas id="chart2"></canvas>
            </div>
        </div>
    );
};

export default PnL; 