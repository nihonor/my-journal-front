'use client';
import { useState, useEffect } from 'react';
import api from '../utils/api';
import { TrendingUp, TrendingDown, Smile, Frown, Coffee, Zap, Info, Shield } from 'lucide-react';

export default function TradeForm({ onSuccess }: { onSuccess: () => void }) {
    const [type, setType] = useState('Long');
    const [formData, setFormData] = useState({
        pair: 'EURUSD',
        lot_size: '0.1',
        entry_price: '',
        stop_loss: '',
        take_profit: '',
        notes: '',
        emotion: ''
    });

    const [calculations, setCalculations] = useState({
        risk: 0,
        reward: 0,
        rr: '0:0'
    });

    // Mock Calculation Logic (Simple pip diff)
    useEffect(() => {
        const entry = parseFloat(formData.entry_price);
        const sl = parseFloat(formData.stop_loss);
        const tp = parseFloat(formData.take_profit);

        if (entry && sl && tp) {
            const risk = Math.abs(entry - sl) * 10000; // Mock pip mult
            const reward = Math.abs(tp - entry) * 10000;
            const rr = (reward / risk).toFixed(1);
            setCalculations({ risk: Math.round(risk), reward: Math.round(reward), rr: `1:${rr}` });
        }
    }, [formData.entry_price, formData.stop_loss, formData.take_profit]);

    const emos = [
        { label: 'Confident', icon: Shield },
        { label: 'Nervous', icon: Frown },
        { label: 'Greedy', icon: Zap },
        { label: 'Patient', icon: Coffee },
        { label: 'Reckless', icon: Info },
        { label: 'Disciplined', icon: Target }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/trades', { ...formData, type, risk_reward: calculations.rr });
            setFormData({ pair: 'EURUSD', lot_size: '0.1', entry_price: '', stop_loss: '', take_profit: '', notes: '', emotion: '' });
            onSuccess();
        } catch (error) {
            alert('Failed to save trade');
        }
    };

    return (
        <div className="pj-card p-8 h-full overflow-y-auto">
            <h2 className="text-xl text-white font-medium mb-6">New Trade Entry</h2>

            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setType('Long')}
                    className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${type === 'Long' ? 'bg-[#00DCA3] text-black' : 'bg-[#0D1117] border border-[#30363D] text-[#8B949E]'}`}
                >
                    <TrendingUp size={18} /> BUY
                </button>
                <button
                    onClick={() => setType('Short')}
                    className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${type === 'Short' ? 'bg-[#da3633] text-white' : 'bg-[#0D1117] border border-[#30363D] text-[#8B949E]'}`}
                >
                    <TrendingDown size={18} /> SELL
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="pj-label">Currency Pair</label>
                    <select
                        className="pj-input appearance-none"
                        value={formData.pair}
                        onChange={e => setFormData({ ...formData, pair: e.target.value })}
                    >
                        <option>EURUSD</option>
                        <option>GBPUSD</option>
                        <option>USDJPY</option>
                        <option>BTCUSD</option>
                    </select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="pj-label">Entry</label>
                        <input
                            required type="number" step="0.00001" placeholder="1.0850" className="pj-input"
                            value={formData.entry_price} onChange={e => setFormData({ ...formData, entry_price: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="pj-label">Stop Loss</label>
                        <input
                            type="number" step="0.00001" placeholder="1.0800" className="pj-input text-[#da3633]"
                            value={formData.stop_loss} onChange={e => setFormData({ ...formData, stop_loss: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="pj-label">Take Profit</label>
                        <input
                            type="number" step="0.00001" placeholder="1.0900" className="pj-input text-[#00DCA3]"
                            value={formData.take_profit} onChange={e => setFormData({ ...formData, take_profit: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label className="pj-label">Lot Size</label>
                    <input
                        required type="number" step="0.01" className="pj-input"
                        value={formData.lot_size} onChange={e => setFormData({ ...formData, lot_size: e.target.value })}
                    />
                </div>

                {/* Live Calculator */}
                <div className="bg-[#0D1117] border border-[#30363D] rounded-lg p-4 grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-[10px] text-[#8B949E] uppercase mb-1">Risk:Reward</p>
                        <p className="text-[#ffb700] font-bold font-mono">{calculations.rr}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-[#8B949E] uppercase mb-1">Risk (pips)</p>
                        <p className="text-[#da3633] font-bold font-mono">{calculations.risk}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-[#8B949E] uppercase mb-1">Reward (pips)</p>
                        <p className="text-[#00DCA3] font-bold font-mono">{calculations.reward}</p>
                    </div>
                </div>

                <div>
                    <label className="pj-label mb-3">How do you feel about this trade?</label>
                    <div className="grid grid-cols-3 gap-3">
                        {emos.map((em) => (
                            <div
                                key={em.label}
                                onClick={() => setFormData({ ...formData, emotion: em.label })}
                                className={`cursor-pointer rounded-lg p-3 flex flex-col items-center gap-2 border transition-all ${formData.emotion === em.label ? 'border-[#00DCA3] bg-[#00DCA3]/10 text-[#00DCA3]' : 'border-[#30363D] bg-[#0D1117] text-[#8B949E] hover:border-[#8B949E]'}`}
                            >
                                <em.icon size={18} />
                                <span className="text-[10px] font-medium">{em.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="pj-label">Trade Notes</label>
                    <textarea
                        rows={3}
                        className="pj-input resize-none"
                        placeholder="Why are you taking this trade? What's your analysis?"
                        value={formData.notes}
                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    ></textarea>
                </div>

                <button type="submit" className="pj-btn-primary">Save Trade</button>
            </form>
        </div>
    );
}
import { Target } from 'lucide-react'; 
