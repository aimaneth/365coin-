import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const TradingGraph = () => {
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);

    // Generate mock candlestick data
    const generateMockData = () => {
        const data = [];
        let basePrice = 45000;
        const now = new Date();

        for (let i = 30; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            
            const volatility = 0.02;
            const open = basePrice * (1 + (Math.random() - 0.5) * volatility);
            const close = open * (1 + (Math.random() - 0.5) * volatility);
            const high = Math.max(open, close) * (1 + Math.random() * 0.01);
            const low = Math.min(open, close) * (1 - Math.random() * 0.01);

            data.push({
                time: date.getTime() / 1000,
                open,
                high,
                low,
                close,
            });

            basePrice = close;
        }
        return data;
    };

    // Generate mock trades
    const generateMockTrades = (candleData) => {
        const trades = [];
        candleData.forEach((candle, index) => {
            if (Math.random() > 0.8) { // 20% chance of trade
                const isLong = Math.random() > 0.5;
                trades.push({
                    time: candle.time,
                    price: isLong ? candle.low : candle.high,
                    type: isLong ? 'buy' : 'sell',
                    size: Math.floor(Math.random() * 5 + 1),
                });
            }
        });
        return trades;
    };

    useEffect(() => {
        if (!chartContainerRef.current) return;

        // Create chart
        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: 'solid', color: 'transparent' },
                textColor: '#B0B0B0',
                fontSize: 12,
                fontFamily: "'Inter', sans-serif",
            },
            grid: {
                vertLines: { color: 'rgba(255, 255, 255, 0.03)' },
                horzLines: { color: 'rgba(255, 255, 255, 0.03)' },
            },
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
                borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            rightPriceScale: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
                scaleMargins: {
                    top: 0.2,
                    bottom: 0.2,
                },
            },
            crosshair: {
                mode: 1,
                vertLine: {
                    color: '#f0c000',
                    labelBackgroundColor: '#f0c000',
                },
                horzLine: {
                    color: '#f0c000',
                    labelBackgroundColor: '#f0c000',
                },
            },
            handleScale: {
                mouseWheel: true,
                pinch: true,
                axisPressedMouseMove: true,
            },
        });

        // Add candlestick series
        const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#00C853',
            downColor: '#FF3E8F',
            borderVisible: false,
            wickUpColor: '#00C853',
            wickDownColor: '#FF3E8F',
        });

        // Add markers series
        const markersSeries = chart.addCandlestickSeries({
            lastValueVisible: false,
            priceLineVisible: false,
        });

        // Generate and set data
        const candleData = generateMockData();
        const trades = generateMockTrades(candleData);

        // Set candlestick data
        candlestickSeries.setData(candleData);

        // Add trade markers
        trades.forEach(trade => {
            const marker = {
                time: trade.time,
                position: trade.type === 'buy' ? 'belowBar' : 'aboveBar',
                color: trade.type === 'buy' ? '#00C853' : '#FF3E8F',
                shape: trade.type === 'buy' ? 'arrowUp' : 'arrowDown',
                text: `${trade.type.toUpperCase()} ${trade.size} BTC`,
                size: 1,
            };
            candlestickSeries.setMarkers([marker]);
        });

        // Fit content
        chart.timeScale().fitContent();

        // Handle resize
        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({
                    width: chartContainerRef.current.clientWidth,
                    height: chartContainerRef.current.clientHeight
                });
            }
        };

        window.addEventListener('resize', handleResize);

        // Store chart reference
        chartRef.current = chart;

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, []);

    return (
        <div 
            ref={chartContainerRef} 
            style={{ 
                width: '100%', 
                height: '100%',
                minHeight: '300px',
                position: 'relative'
            }}
        />
    );
};

export default TradingGraph; 