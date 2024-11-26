import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const WalletGraph = ({ data, timeframe = '24h' }) => {
    const chartRef = useRef(null);
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        if (JSON.stringify(data) !== JSON.stringify(chartData)) {
            setChartData(data);
        }
    }, [data]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 0
        },
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(30, 30, 30, 0.95)',
                titleColor: '#f0c000',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
                callbacks: {
                    label: function(context) {
                        return `$${context.parsed.y.toFixed(2)}`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    color: '#B0B0B0',
                    font: {
                        size: 12
                    },
                    maxRotation: 0,
                    maxTicksLimit: 8
                },
                border: {
                    display: false
                }
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                    drawBorder: false
                },
                ticks: {
                    color: '#B0B0B0',
                    font: {
                        size: 12
                    },
                    callback: (value) => `$${value}`,
                    padding: 10,
                    maxTicksLimit: 6
                },
                border: {
                    display: false
                },
                beginAtZero: true
            }
        },
        elements: {
            line: {
                tension: 0.4,
                borderWidth: 2,
                borderColor: '#f0c000',
                fill: true,
                backgroundColor: (context) => {
                    if (!chartRef.current) return 'rgba(240, 192, 0, 0.1)';
                    const ctx = chartRef.current.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(240, 192, 0, 0.2)');
                    gradient.addColorStop(1, 'rgba(240, 192, 0, 0)');
                    return gradient;
                }
            },
            point: {
                radius: 0,
                hoverRadius: 6,
                backgroundColor: '#f0c000',
                borderColor: '#fff',
                borderWidth: 2,
                hitRadius: 6
            }
        }
    };

    if (!chartData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="wallet-graph" style={{ position: 'relative', height: '300px' }}>
            <Line 
                ref={chartRef}
                data={chartData} 
                options={options}
                redraw={false}
            />
        </div>
    );
};

export default React.memo(WalletGraph); 