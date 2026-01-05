'use client';
import { useEffect, useRef } from 'react';

interface Props {
    symbol: string;
    entryPrice?: number;
    stopLoss?: number;
    takeProfit?: number;
}

export default function SimpleChart({ symbol, entryPrice, stopLoss, takeProfit }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.fillStyle = '#0B0E11';
        ctx.fillRect(0, 0, width, height);

        // Draw grid
        ctx.strokeStyle = '#30363D';
        ctx.lineWidth = 1;
        for (let i = 0; i < 10; i++) {
            const y = (height / 10) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Generate mock candlestick data
        const candleCount = 50;
        const candleWidth = width / candleCount;
        const basePrice = entryPrice || 1.08;

        let currentPrice = basePrice;
        const candles = [];

        for (let i = 0; i < candleCount; i++) {
            const change = (Math.random() - 0.5) * 0.002;
            const open = currentPrice;
            const close = currentPrice + change;
            const high = Math.max(open, close) + Math.random() * 0.001;
            const low = Math.min(open, close) - Math.random() * 0.001;

            candles.push({ open, high, low, close });
            currentPrice = close;
        }

        // Find price range
        const allPrices = candles.flatMap(c => [c.high, c.low]);
        if (stopLoss) allPrices.push(stopLoss);
        if (takeProfit) allPrices.push(takeProfit);

        const maxPrice = Math.max(...allPrices);
        const minPrice = Math.min(...allPrices);
        const priceRange = maxPrice - minPrice;
        const padding = priceRange * 0.1;

        const priceToY = (price: number) => {
            return height - ((price - (minPrice - padding)) / (priceRange + 2 * padding)) * height;
        };

        // Draw candlesticks
        candles.forEach((candle, i) => {
            const x = i * candleWidth + candleWidth / 2;
            const isGreen = candle.close > candle.open;

            // Draw wick
            ctx.strokeStyle = '#8B949E';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, priceToY(candle.high));
            ctx.lineTo(x, priceToY(candle.low));
            ctx.stroke();

            // Draw body
            const bodyTop = priceToY(Math.max(candle.open, candle.close));
            const bodyBottom = priceToY(Math.min(candle.open, candle.close));
            const bodyHeight = bodyBottom - bodyTop;

            ctx.fillStyle = isGreen ? '#00DCA3' : '#da3633';
            ctx.fillRect(x - candleWidth * 0.3, bodyTop, candleWidth * 0.6, Math.max(bodyHeight, 1));
        });

        // Draw entry line
        if (entryPrice) {
            ctx.strokeStyle = '#ffb700';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(0, priceToY(entryPrice));
            ctx.lineTo(width, priceToY(entryPrice));
            ctx.stroke();
            ctx.setLineDash([]);

            // Label
            ctx.fillStyle = '#ffb700';
            ctx.font = '10px monospace';
            ctx.fillText(`Entry: ${entryPrice.toFixed(5)}`, 10, priceToY(entryPrice) - 5);
        }

        // Draw stop loss line
        if (stopLoss) {
            ctx.strokeStyle = '#da3633';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(0, priceToY(stopLoss));
            ctx.lineTo(width, priceToY(stopLoss));
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = '#da3633';
            ctx.font = '10px monospace';
            ctx.fillText(`S/L: ${stopLoss.toFixed(5)}`, 10, priceToY(stopLoss) - 5);
        }

        // Draw take profit line
        if (takeProfit) {
            ctx.strokeStyle = '#00DCA3';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(0, priceToY(takeProfit));
            ctx.lineTo(width, priceToY(takeProfit));
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = '#00DCA3';
            ctx.font = '10px monospace';
            ctx.fillText(`T/P: ${takeProfit.toFixed(5)}`, 10, priceToY(takeProfit) - 5);
        }

    }, [symbol, entryPrice, stopLoss, takeProfit]);

    return (
        <div className="w-full h-full relative">
            <canvas
                ref={canvasRef}
                className="w-full h-full"
                style={{ minHeight: '400px' }}
            />
            <div className="absolute top-4 left-4 bg-[#161B22] px-3 py-2 rounded border border-[#30363D]">
                <p className="text-white font-bold text-sm">{symbol}</p>
                <p className="text-[#8B949E] text-xs">Mock Chart Data</p>
            </div>
        </div>
    );
}
