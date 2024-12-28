import { createChart } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';

const PerformanceGraph = ({ data = [], timeframe }) => {
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
            // Transform data if needed
            const transformedData = data.map(item => ({
                time: typeof item.time === 'number' ? item.time : Math.floor(new Date(item.time).getTime() / 1000),
                value: typeof item.value === 'number' ? item.value : parseFloat(item.value) || 0
            }));

            // Validate data structure
            const validData = transformedData.filter(item => (
                item &&
                typeof item.time === 'number' &&
                typeof item.value === 'number' &&
                !isNaN(item.time) &&
                !isNaN(item.value)
            ));

            if (validData.length === 0) {
                console.warn('No valid data points for performance chart');
                return;
            }

            // Sort data by time
            validData.sort((a, b) => a.time - b.time);

            // Add area series
            const areaSeries = chart.addAreaSeries({
                lineColor: '#f0c000',
                topColor: 'rgba(240, 192, 0, 0.2)',
                bottomColor: 'rgba(240, 192, 0, 0.0)',
                lineWidth: 2,
                priceFormat: {
                    type: 'price',
                    precision: 2,
                    minMove: 0.01,
                },
            });

            // Set data
            areaSeries.setData(validData);

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
            console.error('Error setting up performance chart:', error);
            return;
        }
    }, [data, timeframe]);

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

export default React.memo(PerformanceGraph); 