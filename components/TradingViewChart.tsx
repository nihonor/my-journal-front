'use client';
import { useEffect, useRef } from 'react';

interface Props {
    symbol: string; // e.g., "EURUSD", "BTCUSD"
    theme?: 'light' | 'dark';
}

export default function TradingViewChart({ symbol, theme = 'dark' }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Clear previous widget
        containerRef.current.innerHTML = '';

        // Create script element
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/tv.js';
        script.async = true;
        script.onload = () => {
            if (typeof window.TradingView !== 'undefined') {
                new window.TradingView.widget({
                    autosize: true,
                    symbol: symbol.includes('USD') ? `FX:${symbol}` : `BINANCE:${symbol}`,
                    interval: 'D',
                    timezone: 'Etc/UTC',
                    theme: theme,
                    style: '1', // Candlestick
                    locale: 'en',
                    toolbar_bg: '#0D1117',
                    enable_publishing: false,
                    hide_side_toolbar: false,
                    allow_symbol_change: false,
                    container_id: containerRef.current?.id || 'tradingview_chart',
                    studies: [],
                    backgroundColor: '#0D1117',
                    gridColor: '#30363D',
                    hide_top_toolbar: false,
                    hide_legend: false,
                    save_image: false,
                });
            }
        };

        containerRef.current.appendChild(script);

        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, [symbol, theme]);

    return (
        <div
            ref={containerRef}
            id="tradingview_chart"
            className="w-full h-full"
            style={{ minHeight: '400px' }}
        />
    );
}

// Add TypeScript declaration for TradingView
declare global {
    interface Window {
        TradingView: any;
    }
}
