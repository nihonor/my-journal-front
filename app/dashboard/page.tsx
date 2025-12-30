'use client';
import { useEffect, useState } from 'react';
import TradeForm from '@/components/TradeForm';
import PerformanceAnalytics from '@/components/PerformanceAnalytics';
import AuthOverlay from '@/components/AuthOverlay';
import TradingViewChart from '@/components/TradingViewChart';
import api from '@/utils/api';
import { Trade, TradeStats } from '@/types';
import { ArrowLeft, Bell, TrendingUp, TrendingDown } from 'lucide-react';

export default function Dashboard() {
    const [view, setView] = useState('dashboard');
    const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
    const [trades, setTrades] = useState<Trade[]>([]);
    const [stats, setStats] = useState<TradeStats>({
        totalTrades: 0,
        totalProfit: 0,
        winningTrades: 0,
        losingTrades: 0,
        winRate: 0,
        dailyPL: []
    });
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const fetchData = async () => {
        try {
            const [tradesRes, statsRes] = await Promise.all([
                api.get('/trades'),
                api.get('/trades/stats')
            ]);
            setTrades(tradesRes.data.trades);
            setStats(statsRes.data);
            setIsAuthenticated(true);

            // Auto-select the first trade if available
            if (tradesRes.data.trades.length > 0 && !selectedTrade) {
                setSelectedTrade(tradesRes.data.trades[0]);
            }
        } catch (error) {
            console.error(error);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, []);

    const handleAuth = async (data: any, isRegister: boolean) => {
        try {
            const endpoint = isRegister ? '/auth/register' : '/auth/login';
            const res = await api.post(endpoint, data);
            localStorage.setItem('token', res.data.token);
            fetchData();
        } catch (error) {
            alert('Authentication failed');
        }
    };

    if (loading) return <div className="text-[#8B949E] flex justify-center items-center h-screen bg-[#0D1117]">Loading...</div>;

    if (!isAuthenticated) {
        return <AuthOverlay onAuth={handleAuth} />;
    }

    return (
        <div className="h-screen bg-[#0D1117] text-[#EAECEF] font-sans flex flex-col overflow-hidden">
            {/* Top Header */}
            <header className="h-16 bg-[#0D1117] border-b border-[#30363D] flex items-center justify-between px-6">
                <div className="flex items-center gap-6">
                    {view !== 'dashboard' && (
                        <button onClick={() => setView('dashboard')} className="text-[#8B949E] hover:text-white">
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <div className="flex items-center gap-3">
                        <span className="text-[#00DCA3] font-black text-xl">PJ</span>
                        <div className="flex flex-col">
                            <span className="text-white font-bold text-xs tracking-wide">PERFECT JOURNAL</span>
                            <span className="text-[#565D68] text-[8px] uppercase tracking-widest">Precision • Performance • Community</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 items-center">
                    <button className="px-4 py-1.5 rounded-lg bg-transparent border border-[#00DCA3] text-[#00DCA3] text-xs hover:bg-[#00DCA3] hover:text-black transition-all flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#00DCA3]"></div> Become a Mentor
                    </button>
                    <button className="px-4 py-1.5 rounded-lg bg-transparent border border-[#00DCA3] text-[#00DCA3] text-xs hover:bg-[#00DCA3] hover:text-black transition-all">
                        Academy
                    </button>
                    <button className="px-6 py-1.5 rounded-lg bg-[#ffb700] text-black font-bold text-xs shadow-lg hover:bg-[#ffc800]">
                        Subscribe
                    </button>
                    <Bell size={18} className="text-[#8B949E] hover:text-white cursor-pointer" />
                    <div className="flex items-center gap-2 ml-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-[#00DCA3]"></div>
                        <span className="text-xs text-white font-medium">Apprentice</span>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <nav className="h-12 bg-[#0D1117] border-b border-[#30363D] flex items-center px-6 gap-8">
                <NavTab icon="📊" label="Dashboard" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
                <NavTab icon="➕" label="New Trade" active={view === 'new-trade'} onClick={() => setView('new-trade')} />
                <NavTab icon="👥" label="Community" />
                <NavTab icon="📈" label="Analytics" />
                <NavTab icon="🏆" label="Challenges" />
            </nav>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden">
                {view === 'new-trade' ? (
                    <div className="h-full flex items-center justify-center p-8">
                        <div className="w-full max-w-2xl">
                            <TradeForm onSuccess={() => { setView('dashboard'); fetchData(); }} />
                        </div>
                    </div>
                ) : (
                    <div className="h-full grid grid-cols-12 gap-4 p-4">
                        {/* Left: Recent Trades */}
                        <div className="col-span-3 flex flex-col gap-4 overflow-hidden">
                            <div className="flex justify-between items-center">
                                <h3 className="text-white font-medium text-sm">Recent Trades</h3>
                                <button
                                    onClick={() => setView('new-trade')}
                                    className="text-[#00DCA3] text-xs hover:underline"
                                >
                                    + New
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto space-y-3">
                                {trades.map((trade) => (
                                    <div
                                        key={trade._id}
                                        onClick={() => setSelectedTrade(trade)}
                                        className={`pj-card p-4 cursor-pointer transition-all ${selectedTrade?._id === trade._id ? 'border-[#00DCA3] bg-[#00DCA3]/5' : 'hover:border-[#474d57]'}`}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-8 h-8 rounded flex items-center justify-center ${trade.type === 'Long' ? 'bg-[#00DCA3]/10' : 'bg-[#da3633]/10'}`}>
                                                    {trade.type === 'Long' ? <TrendingUp size={16} className="text-[#00DCA3]" /> : <TrendingDown size={16} className="text-[#da3633]" />}
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold text-sm">{trade.pair}</p>
                                                    <p className="text-[#8B949E] text-[10px]">{new Date(trade.trade_date).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${trade.type === 'Long' ? 'bg-[#00DCA3]/20 text-[#00DCA3]' : 'bg-[#da3633]/20 text-[#da3633]'}`}>
                                                {trade.type}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 text-[10px]">
                                            <div>
                                                <p className="text-[#8B949E]">Entry</p>
                                                <p className="text-white font-mono">{trade.entry_price}</p>
                                            </div>
                                            <div>
                                                <p className="text-[#da3633]">S/L</p>
                                                <p className="text-white font-mono">{trade.stop_loss || '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[#00DCA3]">T/P</p>
                                                <p className="text-white font-mono">{trade.take_profit || '-'}</p>
                                            </div>
                                        </div>
                                        {trade.profit_loss !== undefined && (
                                            <div className="mt-3 pt-3 border-t border-[#30363D]">
                                                <p className={`text-xs font-bold ${trade.profit_loss >= 0 ? 'text-[#00DCA3]' : 'text-[#da3633]'}`}>
                                                    {trade.profit_loss >= 0 ? '+' : ''}{trade.profit_loss.toFixed(2)} USD
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Center: Chart */}
                        <div className="col-span-6 pj-card p-6 flex flex-col">
                            {selectedTrade ? (
                                <>
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-white font-bold text-lg">{selectedTrade.pair} - {selectedTrade.type.toUpperCase()}</h3>
                                        <div className="flex gap-4 text-xs">
                                            <button className="px-3 py-1 bg-[#161B22] rounded border border-[#30363D] text-[#8B949E]">1h</button>
                                            <button className="px-3 py-1 bg-[#161B22] rounded border border-[#30363D] text-[#8B949E]">4h</button>
                                            <button className="px-3 py-1 bg-[#00DCA3] rounded text-black font-bold">1D</button>
                                            <button className="px-3 py-1 bg-[#161B22] rounded border border-[#30363D] text-[#8B949E]">📊 Indicators</button>
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-[#0B0E11] rounded-lg overflow-hidden">
                                        <TradingViewChart symbol={selectedTrade.pair} theme="dark" />
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center">
                                    <p className="text-[#8B949E] mb-4">Select a trade to view chart</p>
                                    <button
                                        onClick={() => setView('new-trade')}
                                        className="text-[#00DCA3] hover:underline"
                                    >
                                        Or create your first trade
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Right: Analytics */}
                        <div className="col-span-3 overflow-y-auto">
                            <PerformanceAnalytics stats={stats} trades={trades} />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

function NavTab({ icon, label, active = false, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${active ? 'bg-[#00DCA3] text-black' : 'text-[#8B949E] hover:text-white hover:bg-[#161B22]'}`}
        >
            <span>{icon}</span>
            {label}
        </button>
    );
}
