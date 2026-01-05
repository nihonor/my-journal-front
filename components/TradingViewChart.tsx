'use client';
import { useEffect, useRef, useState } from 'react';

interface Props {
    symbol: string;
    entryPrice?: number;
    stopLoss?: number;
    takeProfit?: number;
}

export default function TradingViewChart({ symbol, entryPrice, stopLoss, takeProfit }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetRef = useRef<any>(null);
    const scriptRef = useRef<HTMLScriptElement | null>(null);
    const [chartType, setChartType] = useState<number>(1);
    const [interval, setInterval] = useState<string>('D');
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const containerId = useRef(`tradingview_${Math.random().toString(36).substr(2, 9)}`);

    // Load TradingView script once
    useEffect(() => {
        if (typeof window.TradingView !== 'undefined') {
            setIsScriptLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/tv.js';
        script.async = true;
        script.onload = () => setIsScriptLoaded(true);
        script.onerror = () => console.error('Failed to load TradingView script');

        document.head.appendChild(script);
        scriptRef.current = script;

        return () => {
            if (scriptRef.current && scriptRef.current.parentNode) {
                scriptRef.current.parentNode.removeChild(scriptRef.current);
            }
        };
    }, []);

    // Initialize widget when script is loaded
    useEffect(() => {
        if (!isScriptLoaded || !containerRef.current) return;

        const initWidget = () => {
            try {
                // Clear existing content
                if (containerRef.current) {
                    containerRef.current.innerHTML = '';
                }

                // Create widget container
                const widgetDiv = document.createElement('div');
                widgetDiv.id = containerId.current;
                widgetDiv.style.height = '100%';
                widgetDiv.style.width = '100%';

                if (containerRef.current) {
                    containerRef.current.appendChild(widgetDiv);
                }

                // Initialize TradingView widget
                if (window.TradingView && document.getElementById(containerId.current)) {
                    widgetRef.current = new window.TradingView.widget({
                        autosize: true,
                        symbol: `FX:${symbol}`,
                        interval: interval,
                        timezone: 'Etc/UTC',
                        theme: 'dark',
                        style: chartType.toString(),
                        locale: 'en',
                        toolbar_bg: '#0D1117',
                        enable_publishing: false,
                        allow_symbol_change: false,
                        container_id: containerId.current,
                        hide_side_toolbar: false,
                        studies: [],
                        disabled_features: [
                            'use_localstorage_for_settings',
                            'volume_force_overlay'
                        ],
                        enabled_features: [],
                        overrides: {
                            'paneProperties.background': '#0D1117',
                            'paneProperties.backgroundType': 'solid',
                            'mainSeriesProperties.candleStyle.upColor': '#00DCA3',
                            'mainSeriesProperties.candleStyle.downColor': '#da3633',
                            'mainSeriesProperties.candleStyle.borderUpColor': '#00DCA3',
                            'mainSeriesProperties.candleStyle.borderDownColor': '#da3633',
                            'mainSeriesProperties.candleStyle.wickUpColor': '#00DCA3',
                            'mainSeriesProperties.candleStyle.wickDownColor': '#da3633',
                        }
                    });
                }
            } catch (error) {
                console.error('TradingView widget initialization error:', error);
            }
        };

        // Small delay to ensure DOM is ready
        const timer = setTimeout(initWidget, 100);

        return () => {
            clearTimeout(timer);
            if (widgetRef.current && typeof widgetRef.current.remove === 'function') {
                try {
                    widgetRef.current.remove();
                } catch (e) {
                    console.error('Error removing widget:', e);
                }
            }
        };
    }, [isScriptLoaded, symbol, chartType, interval]);

    const chartTypes = [
        { id: 1, name: 'Candlestick', icon: '📊' },
        { id: 0, name: 'Bar', icon: '📈' },
        { id: 3, name: 'Line', icon: '📉' },
        { id: 9, name: 'Hollow Candle', icon: '🕯️' },
        { id: 8, name: 'Heikin Ashi', icon: '🎯' }
    ];

    const timeframes = [
        { label: '1M', value: '1' },
        { label: '5M', value: '5' },
        { label: '15M', value: '15' },
        { label: '1H', value: '60' },
        { label: '4H', value: '240' },
        { label: '1D', value: 'D' },
        { label: '1W', value: 'W' }
    ];

    return (
        <div className="w-full h-full flex flex-col">
            {/* Controls */}
            <div className="flex items-center justify-between mb-3 px-2">
                <div className="flex gap-2">
                    <select
                        value={chartType}
                        onChange={(e) => setChartType(Number(e.target.value))}
                        className="px-3 py-1 bg-[#161B22] rounded border border-[#30363D] text-[#8B949E] text-xs hover:text-white focus:outline-none focus:border-[#00DCA3]"
                    >
                        {chartTypes.map(type => (
                            <option key={type.id} value={type.id}>
                                {type.icon} {type.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-2">
                    {timeframes.map(tf => (
                        <button
                            key={tf.value}
                            onClick={() => setInterval(tf.value)}
                            className={`px-3 py-1 rounded text-xs font-medium transition-all ${interval === tf.value
                                    ? 'bg-[#00DCA3] text-black'
                                    : 'bg-[#161B22] border border-[#30363D] text-[#8B949E] hover:text-white'
                                }`}
                        >
                            {tf.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart Container */}
            <div className="flex-1 relative bg-[#0B0E11] rounded-lg overflow-hidden">
                <div ref={containerRef} className="w-full h-full" />

                {!isScriptLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-[#8B949E] text-sm">Loading chart...</div>
                    </div>
                )}

                {/* Watermark */}
                <div className="absolute bottom-4 left-4 bg-[#161B22]/80 px-3 py-2 rounded border border-[#30363D] pointer-events-none">
                    <p className="text-[#8B949E] text-xs">Chart for visual reference only - Not for analysis</p>
                </div>

                {/* Trade Levels Overlay */}
                {(entryPrice || stopLoss || takeProfit) && (
                    <div className="absolute top-4 right-4 bg-[#161B22]/90 px-4 py-3 rounded border border-[#30363D] space-y-2 pointer-events-none">
                        {entryPrice && (
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#ffb700]"></div>
                                <span className="text-[#ffb700] text-xs font-mono">Entry: {entryPrice.toFixed(5)}</span>
                            </div>
                        )}
                        {stopLoss && (
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#da3633]"></div>
                                <span className="text-[#da3633] text-xs font-mono">S/L: {stopLoss.toFixed(5)}</span>
                            </div>
                        )}
                        {takeProfit && (
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#00DCA3]"></div>
                                <span className="text-[#00DCA3] text-xs font-mono">T/P: {takeProfit.toFixed(5)}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// TypeScript declaration for TradingView
declare global {
    interface Window {
        TradingView: any;
    }
}
