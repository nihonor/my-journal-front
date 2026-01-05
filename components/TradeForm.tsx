'use client';
import { useState, useEffect } from 'react';
import api from '../utils/api';
import { TrendingUp, TrendingDown } from 'lucide-react';

const EMOTIONS = [
    { value: 'confident', label: 'Confident', emoji: '💪' },
    { value: 'nervous', label: 'Nervous', emoji: '😰' },
    { value: 'greedy', label: 'Greedy', emoji: '🤑' },
    { value: 'patient', label: 'Patient', emoji: '🧘' },
    { value: 'reckless', label: 'Reckless', emoji: '😤' },
    { value: 'disciplined', label: 'Disciplined', emoji: '🎯' },
];

const CURRENCY_PAIRS = [
    'EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD',
    'NZDUSD', 'USDCHF', 'EURJPY', 'GBPJPY', 'EURGBP'
];

export default function TradeForm({ onSuccess, onPairChange }: { onSuccess: () => void; onPairChange?: (pair: string) => void }) {
    const [type, setType] = useState<'Long' | 'Short'>('Long');
    const [formData, setFormData] = useState({
        pair: 'EURUSD',
        lot_size: '0.1',
        entry_price: '',
        stop_loss: '',
        take_profit: '',
        notes: '',
        emotion: 'patient'
    });

    const [calculations, setCalculations] = useState({
        riskReward: 0,
        pips: 0,
        riskPips: 0,
    });

    const calculateMetrics = (data: typeof formData) => {
        const entry = parseFloat(data.entry_price);
        const sl = parseFloat(data.stop_loss);
        const tp = parseFloat(data.take_profit);

        if (entry && sl && tp) {
            const riskPips = Math.abs(entry - sl) * 10000;
            const rewardPips = Math.abs(tp - entry) * 10000;
            const rr = rewardPips / riskPips;

            setCalculations({
                riskReward: parseFloat(rr.toFixed(2)),
                pips: parseFloat(rewardPips.toFixed(1)),
                riskPips: parseFloat(riskPips.toFixed(1)),
            });
        }
    };

    const handleChange = (field: keyof typeof formData, value: string) => {
        const newData = { ...formData, [field]: value };
        setFormData(newData);

        if (field === 'pair' && onPairChange) {
            onPairChange(value);
        }

        if (['entry_price', 'stop_loss', 'take_profit'].includes(field)) {
            calculateMetrics(newData);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/trades', {
                ...formData,
                type,
                risk_reward: `1:${calculations.riskReward}`
            });
            onSuccess();
            // Reset form
            setFormData({
                pair: 'EURUSD',
                lot_size: '0.1',
                entry_price: '',
                stop_loss: '',
                take_profit: '',
                notes: '',
                emotion: 'patient'
            });
            setCalculations({ riskReward: 0, pips: 0, riskPips: 0 });
        } catch (error) {
            alert('Failed to save trade');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Direction Toggle */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={() => setType('Long')}
                    className={`py-4 rounded-lg flex items-center justify-center gap-2 transition-all font-bold ${type === 'Long'
                            ? 'bg-[#00DCA3] text-black'
                            : 'bg-[#161B22] text-[#8B949E] hover:text-white'
                        }`}
                >
                    <TrendingUp className="w-5 h-5" />
                    BUY
                </button>
                <button
                    type="button"
                    onClick={() => setType('Short')}
                    className={`py-4 rounded-lg flex items-center justify-center gap-2 transition-all font-bold ${type === 'Short'
                            ? 'bg-[#da3633] text-white'
                            : 'bg-[#161B22] text-[#8B949E] hover:text-white'
                        }`}
                >
                    <TrendingDown className="w-5 h-5" />
                    SELL
                </button>
            </div>

            {/* Currency Pair */}
            <div>
                <label className="block text-sm text-[#8B949E] mb-2">Currency Pair</label>
                <select
                    value={formData.pair}
                    onChange={(e) => handleChange('pair', e.target.value)}
                    className="pj-input w-full font-mono"
                    required
                >
                    {CURRENCY_PAIRS.map(pair => (
                        <option key={pair} value={pair}>{pair}</option>
                    ))}
                </select>
            </div>

            {/* Price Inputs */}
            <div className="grid grid-cols-3 gap-3">
                <div>
                    <label className="block text-sm text-[#8B949E] mb-2">Entry</label>
                    <input
                        type="number"
                        step="0.00001"
                        value={formData.entry_price}
                        onChange={(e) => handleChange('entry_price', e.target.value)}
                        className="pj-input w-full font-mono"
                        placeholder="1.08500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm text-[#8B949E] mb-2">Stop Loss</label>
                    <input
                        type="number"
                        step="0.00001"
                        value={formData.stop_loss}
                        onChange={(e) => handleChange('stop_loss', e.target.value)}
                        className="pj-input w-full font-mono"
                        placeholder="1.08000"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm text-[#8B949E] mb-2">Take Profit</label>
                    <input
                        type="number"
                        step="0.00001"
                        value={formData.take_profit}
                        onChange={(e) => handleChange('take_profit', e.target.value)}
                        className="pj-input w-full font-mono"
                        placeholder="1.09000"
                        required
                    />
                </div>
            </div>

            {/* Lot Size */}
            <div>
                <label className="block text-sm text-[#8B949E] mb-2">Lot Size</label>
                <input
                    type="number"
                    step="0.01"
                    value={formData.lot_size}
                    onChange={(e) => handleChange('lot_size', e.target.value)}
                    className="pj-input w-full font-mono"
                    placeholder="0.1"
                    required
                />
            </div>

            {/* Auto-Calculations Display */}
            {calculations.riskReward > 0 && (
                <div className="bg-[#0A1A3D]/50 border border-[#00DCA3]/30 rounded-lg p-4 grid grid-cols-3 gap-4">
                    <div>
                        <div className="text-xs text-[#8B949E]">Risk:Reward</div>
                        <div className={`font-mono text-lg ${calculations.riskReward >= 2 ? 'text-[#00DCA3]' : 'text-[#ffb700]'}`}>
                            1:{calculations.riskReward}
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-[#8B949E]">Risk (pips)</div>
                        <div className="font-mono text-lg text-[#da3633]">{calculations.riskPips}</div>
                    </div>
                    <div>
                        <div className="text-xs text-[#8B949E]">Reward (pips)</div>
                        <div className="font-mono text-lg text-[#00DCA3]">{calculations.pips}</div>
                    </div>
                </div>
            )}

            {/* Emotional State */}
            <div>
                <label className="block text-sm text-[#8B949E] mb-2">How do you feel about this trade?</label>
                <div className="grid grid-cols-3 gap-2">
                    {EMOTIONS.map(emotion => (
                        <button
                            key={emotion.value}
                            type="button"
                            onClick={() => handleChange('emotion', emotion.value)}
                            className={`py-3 rounded-lg text-sm transition-all ${formData.emotion === emotion.value
                                    ? 'bg-[#00DCA3] text-black'
                                    : 'bg-[#161B22] text-[#8B949E] hover:text-white'
                                }`}
                        >
                            <div className="text-xl">{emotion.emoji}</div>
                            <div className="text-xs mt-1">{emotion.label}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Notes */}
            <div>
                <label className="block text-sm text-[#8B949E] mb-2">Trade Notes</label>
                <textarea
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    className="pj-input w-full h-24 resize-none"
                    placeholder="Why are you taking this trade? What's your analysis?"
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full bg-[#00DCA3] hover:bg-[#00DCA3]/90 text-black py-4 rounded-lg transition-all font-bold"
            >
                Save Trade
            </button>
        </form>
    );
}
