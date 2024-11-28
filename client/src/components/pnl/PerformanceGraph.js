import React, { useEffect, useRef } from 'react';
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
    const chartRef = useRef(null);

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
                padding: 12,
                backgroundColor: 'rgba(30, 30, 30, 0.95)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                titleColor: '#fff',
                bodyColor: '#fff',
                bodySpacing: 8,
                titleSpacing: 8,
                bodyFont: {
                    size: 14
                },
                titleFont: {
                    size: 14,
                    weight: 'bold'
                },
                displayColors: false,
                callbacks: {
                    label: function(context) {
                        return `${context.parsed.y.toFixed(2)}%`;
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
                    callback: function(value) {
                        return value + '%';
                    }
                }
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

    // Handle resize
    useEffect(() => {
        const handleResize = () => {
            if (chartRef.current) {
                chartRef.current.resize();
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="performance-graph">
            <Line 
                ref={chartRef}
                data={data} 
                options={options}
                redraw={false}
            />
        </div>
    );
};

export default React.memo(PerformanceGraph); 