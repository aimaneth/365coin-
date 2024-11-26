import React, { useState } from 'react';
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

const PerformanceGraph = ({ data, timeframe }) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
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
                        return `$${context.parsed.y.toLocaleString()}`;
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
                    maxRotation: 0
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
                    callback: (value) => `$${value.toLocaleString()}`,
                    padding: 10
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
                    const ctx = context.chart.ctx;
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

    return (
        <div className="performance-graph" style={{ height: '400px' }}>
            <Line data={data} options={options} />
        </div>
    );
};

export default PerformanceGraph; 