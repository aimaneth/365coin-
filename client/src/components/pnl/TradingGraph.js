import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const TradingGraph = ({ data, trades }) => {
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        // Create chart
        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { color: 'transparent' },
                textColor: '#B0B0B0',
                fontFamily: 'Inter, sans-serif',
            },
            grid: {
                vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
                horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
            },
            timeScale: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
                timeVisible: true,
                secondsVisible: false,
                tickMarkFormatter: (time) => {
                    const date = new Date(time * 1000);
                    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                },
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
                    color: 'rgba(240, 192, 0, 0.3)',
                    labelBackgroundColor: '#f0c000',
                },
                horzLine: {
                    color: 'rgba(240, 192, 0, 0.3)',
                    labelBackgroundColor: '#f0c000',
                },
            },
            handleScroll: {
                mouseWheel: true,
                pressedMouseMove: true,
                horzTouchDrag: true,
                vertTouchDrag: true,
            },
            handleScale: {
                axisPressedMouseMove: true,
                mouseWheel: true,
                pinch: true,
            }
        });

        // Add candlestick series
        const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#00C853',
            downColor: '#FF3E8F',
            borderVisible: false,
            wickUpColor: '#00C853',
            wickDownColor: '#FF3E8F',
        });

        // Add volume series
        const volumeSeries = chart.addHistogramSeries({
            color: '#26a69a',
            priceFormat: {
                type: 'volume',
            },
            priceScaleId: '',
            scaleMargins: {
                top: 0.8,
                bottom: 0,
            },
        });

        // Set mock data if no data provided
        if (!data || data.length === 0) {
            const currentTime = Math.floor(Date.now() / 1000);
            const mockData = Array.from({ length: 100 }, (_, i) => {
                const time = currentTime - (100 - i) * 300;
                const basePrice = 100 + Math.sin(i * 0.1) * 20;
                const range = 5 + Math.random() * 5;
                const open = basePrice + (Math.random() - 0.5) * range;
                const close = basePrice + (Math.random() - 0.5) * range;
                const high = Math.max(open, close) + Math.random() * 2;
                const low = Math.min(open, close) - Math.random() * 2;
                const volume = 1000 + Math.random() * 2000;

                return {
                    time,
                    open,
                    high,
                    low,
                    close,
                    volume
                };
            });

            candlestickSeries.setData(mockData);
            volumeSeries.setData(mockData.map(d => ({
                time: d.time,
                value: d.volume,
                color: d.close >= d.open ? '#26a69a55' : '#ef535055'
            })));
        } else {
            candlestickSeries.setData(data);
            // Add actual volume data if available
        }

        // Add trade markers
        if (trades && trades.length > 0) {
            const markers = trades.map(trade => ({
                time: trade.time,
                position: trade.type === 'buy' ? 'belowBar' : 'aboveBar',
                color: trade.type === 'buy' ? '#00C853' : '#FF3E8F',
                shape: trade.type === 'buy' ? 'arrowUp' : 'arrowDown',
                text: `${trade.type.toUpperCase()} ${trade.amount}`,
                size: 2,
            }));
            candlestickSeries.setMarkers(markers);
        } else {
            // Add mock trade markers
            const mockTrades = [
                {
                    time: currentTime - 60,
                    position: 'belowBar',
                    color: '#00C853',
                    shape: 'arrowUp',
                    text: 'BUY 0.5 BTC',
                    size: 2,
                },
                {
                    time: currentTime - 30,
                    position: 'aboveBar',
                    color: '#FF3E8F',
                    shape: 'arrowDown',
                    text: 'SELL 0.5 BTC',
                    size: 2,
                }
            ];
            candlestickSeries.setMarkers(mockTrades);
        }

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
    }, [data, trades]);

    return (
        <div 
            ref={chartContainerRef} 
            className="trading-graph"
            style={{ width: '100%', height: '100%' }}
        />
    );
};

export default React.memo(TradingGraph); 