import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const TradingGraph = ({ data = [], trades = [] }) => {
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);

    const getChartHeight = () => {
        if (window.innerWidth <= 480) return 180;
        if (window.innerWidth <= 768) return 200;
        if (window.innerWidth <= 1200) return 220;
        return 240;
    };

    useEffect(() => {
        if (!chartContainerRef.current || !Array.isArray(data) || data.length === 0) return;

        const chartHeight = getChartHeight();
        const containerWidth = chartContainerRef.current.clientWidth;

        // Create chart with responsive height
        const chart = createChart(chartContainerRef.current, {
            width: containerWidth,
            height: chartHeight,
            layout: {
                background: { type: 'solid', color: 'transparent' },
                textColor: '#B0B0B0',
                fontFamily: 'Inter, sans-serif',
                fontSize: 12,
            },
            grid: {
                vertLines: { color: 'rgba(255, 255, 255, 0.03)' },
                horzLines: { color: 'rgba(255, 255, 255, 0.03)' }
            },
            rightPriceScale: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
                scaleMargins: {
                    top: 0.2,
                    bottom: 0.2,
                },
                ticksVisible: false,
                borderVisible: false,
            },
            timeScale: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
                timeVisible: true,
                secondsVisible: false,
                ticksVisible: false,
                borderVisible: false,
                fixLeftEdge: true,
                fixRightEdge: true,
            },
            handleScale: {
                mouseWheel: false,
                pinch: false,
                axisPressedMouseMove: {
                    time: true,
                    price: false
                },
            },
        });

        try {
            // Add candlestick series
            const candlestickSeries = chart.addCandlestickSeries({
                upColor: 'rgba(0, 200, 83, 0.8)',
                downColor: 'rgba(255, 62, 143, 0.8)',
                borderVisible: false,
                wickUpColor: 'rgba(0, 200, 83, 0.4)',
                wickDownColor: 'rgba(255, 62, 143, 0.4)',
            });

            // Set candlestick data
            candlestickSeries.setData(data);

            // Add markers for trades
            if (trades && trades.length > 0) {
                const markers = trades.map(trade => ({
                    time: trade.time,
                    position: trade.type === 'buy' ? 'belowBar' : 'aboveBar',
                    color: trade.type === 'buy' ? '#00C853' : '#FF3E8F',
                    shape: trade.type === 'buy' ? 'arrowUp' : 'arrowDown',
                    text: `${trade.type.toUpperCase()} ${trade.amount}`,
                }));
                candlestickSeries.setMarkers(markers);
            }

            // Fit content
            chart.timeScale().fitContent();

            // Handle resize
            const handleResize = () => {
                if (chartContainerRef.current) {
                    const newHeight = getChartHeight();
                    const newWidth = chartContainerRef.current.clientWidth;
                    
                    chart.applyOptions({
                        width: newWidth,
                        height: newHeight
                    });
                    
                    chart.timeScale().fitContent();
                }
            };

            // Add resize listener
            const resizeObserver = new ResizeObserver(handleResize);
            resizeObserver.observe(chartContainerRef.current);
            window.addEventListener('resize', handleResize);

            // Store chart reference
            chartRef.current = chart;

            return () => {
                resizeObserver.disconnect();
                window.removeEventListener('resize', handleResize);
                chart.remove();
            };
        } catch (error) {
            console.error('Error setting up trading chart:', error);
            return;
        }
    }, [data, trades]);

    return (
        <div 
            ref={chartContainerRef} 
            style={{ 
                width: '100%',
                height: `${getChartHeight()}px`,
                position: 'relative',
                overflow: 'hidden'
            }}
        />
    );
};

export default React.memo(TradingGraph); 