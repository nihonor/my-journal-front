'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TradeForm from '@/components/TradeForm';
import PerformanceAnalytics from '@/components/PerformanceAnalytics';
import AuthOverlay from '@/components/AuthOverlay';
import TradingViewChart from '@/components/TradingViewChart';
import api from '@/utils/api';
import { Trade, TradeStats } from '@/types';
import { ArrowLeft, Bell, TrendingUp, TrendingDown, BookOpen, Zap, LogOut } from 'lucide-react';

export default function Dashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('lastView') || 'dashboard';
        }
        return 'dashboard';
    });
    const [history, setHistory] = useState<string[]>(['dashboard']);
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

            // Restore selected trade from localStorage
            const savedTradeId = localStorage.getItem('selectedTradeId');
            if (savedTradeId && tradesRes.data.trades.length > 0) {
                const trade = tradesRes.data.trades.find((t: Trade) => t._id === savedTradeId);
                setSelectedTrade(trade || tradesRes.data.trades[0]);
            } else if (tradesRes.data.trades.length > 0 && !selectedTrade) {
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

    useEffect(() => {
        if (activeTab) {
            localStorage.setItem('lastView', activeTab);
        }
    }, [activeTab]);

    useEffect(() => {
        if (selectedTrade?._id) {
            localStorage.setItem('selectedTradeId', selectedTrade._id);
        }
    }, [selectedTrade]);

    const navigateTo = (tab: string) => {
        if (tab === activeTab) return;
        setHistory(prev => [...prev, tab]);
        setActiveTab(tab);
        window.scrollTo(0, 0);
    };

    const handleBack = () => {
        if (history.length <= 1) return;
        const newHistory = history.slice(0, -1);
        setHistory(newHistory);
        setActiveTab(newHistory[newHistory.length - 1]);
    };

    const handleNavigateHome = () => {
        setHistory(['dashboard']);
        setActiveTab('dashboard');
    };

    const handleAuth = async (data: any, isRegister: boolean) => {
        try {
            const endpoint = isRegister ? '/auth/register' : '/auth/login';
            console.log('Attempting authentication:', { endpoint, email: data.email });
            const res = await api.post(endpoint, data);
            console.log('Authentication successful');
            localStorage.setItem('token', res.data.token);
            fetchData();
        } catch (error: any) {
            console.error('Authentication error:', error.response?.data || error.message);
            const errorMessage = error.response?.data?.msg || error.response?.data?.message || 'Authentication failed';
            alert(errorMessage);
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('lastView');
        localStorage.removeItem('selectedTradeId');
        setIsAuthenticated(false);
        setTrades([]);
        setSelectedTrade(null);
        handleNavigateHome();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-[#00DCA3] font-black text-2xl mb-4">PJ</div>
                    <div className="text-[#8B949E]">Loading your journal...</div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <AuthOverlay onAuth={handleAuth} />;
    }

    return (
        <div className="min-h-screen bg-[#0D1117]">
            {/* Sticky Header */}
            <header className="bg-[#0D1117] border-b border-[#30363D] sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {history.length > 1 && (
                                <button
                                    onClick={handleBack}
                                    className="p-2 -ml-2 text-[#8B949E] hover:text-white rounded-full hover:bg-[#161B22] transition-all"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                            )}

                            <div onClick={handleNavigateHome} className="cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-3">
                                <span className="text-[#00DCA3] font-black text-xl">PJ</span>
                                <div className="flex flex-col">
                                    <span className="text-white font-bold text-xs tracking-wide">PERFECT JOURNAL</span>
                                    <span className="text-[#565D68] text-[8px] uppercase tracking-widest">Precision • Performance • Community</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <a
                                href="https://perfectfxacademy.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#161B22] hover:bg-[#1c2128] rounded-lg transition-all text-sm"
                            >
                                <BookOpen className="w-4 h-4 text-[#00DCA3]" />
                                <span className="text-white">Academy</span>
                            </a>

                            <button
                                onClick={() => navigateTo('analytics')}
                                className="px-4 py-2 bg-[#ffb700] hover:bg-[#ffc800] text-black rounded-lg transition-all text-sm font-bold flex items-center gap-1"
                            >
                                <Zap className="w-4 h-4" />
                                Subscribe
                            </button>

                            <Bell size={18} className="text-[#8B949E] hover:text-white cursor-pointer" />

                            <button
                                onClick={handleSignOut}
                                className="px-4 py-2 bg-[#161B22] hover:bg-[#1c2128] rounded-lg transition-all text-sm flex items-center gap-2 text-[#8B949E] hover:text-white"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            {['dashboard', 'new-trade', 'analytics'].includes(activeTab) && (
                <nav className="bg-[#0D1117] border-b border-[#30363D]">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex items-center gap-8 py-3">
                            <NavTab icon="📊" label="Dashboard" active={activeTab === 'dashboard'} onClick={() => navigateTo('dashboard')} />
                            <NavTab icon="➕" label="New Trade" active={activeTab === 'new-trade'} onClick={() => navigateTo('new-trade')} />
                            <NavTab icon="👥" label="Community" />
                            <NavTab icon="📈" label="Analytics" active={activeTab === 'analytics'} onClick={() => navigateTo('analytics')} />
                            <NavTab icon="🏆" label="Challenges" />
                        </div>
                    </div>
                </nav>
            )}

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-6">
                {activeTab === 'dashboard' && (
                    <div className="grid grid-cols-12 gap-6">
                        {/* Left Panel - Trade List (3 columns) */}
                        <div className="col-span-3 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-white font-medium">Recent Trades</h3>
                                <button
                                    onClick={() => navigateTo('new-trade')}
                                    className="text-sm text-[#00DCA3] hover:text-[#00DCA3]/80"
                                >
                                    + New
                                </button>
                            </div>

                            {trades.length === 0 ? (
                                <div className="pj-card p-6 text-center">
                                    <div className="text-[#8B949E] mb-2">No trades yet</div>
                                    <button
                                        onClick={() => navigateTo('new-trade')}
                                        className="text-sm text-[#00DCA3] hover:text-[#00DCA3]/80"
                                    >
                                        Create your first trade
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
                                    {trades.map((trade) => (
                                        <div
                                            key={trade._id}
                                            onClick={() => setSelectedTrade(trade)}
                                            className={`pj-card p-4 cursor-pointer transition-all ${selectedTrade?._id === trade._id ? 'border-[#00DCA3] bg-[#00DCA3]/5' : 'hover:border-[#474d57]'
                                                }`}
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
                            )}
                        </div>

                        {/* Center Panel - Chart (6 columns) */}
                        <div className="col-span-6">
                            {selectedTrade ? (
                                <div className="pj-card p-4">
                                    <h3 className="text-white font-bold text-lg mb-4">
                                        {selectedTrade.pair} - {selectedTrade.type.toUpperCase()}
                                    </h3>
                                    <div className="h-[600px]">
                                        <TradingViewChart
                                            symbol={selectedTrade.pair}
                                            entryPrice={selectedTrade.entry_price}
                                            stopLoss={selectedTrade.stop_loss}
                                            takeProfit={selectedTrade.take_profit}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="pj-card p-4 h-[650px] flex items-center justify-center">
                                    <div className="text-center text-[#8B949E]">
                                        <div className="mb-2">No trade selected</div>
                                        <button
                                            onClick={() => navigateTo('new-trade')}
                                            className="text-[#00DCA3] hover:text-[#00DCA3]/80"
                                        >
                                            Create your first trade
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Panel - Analytics (3 columns) */}
                        <div className="col-span-3">
                            <PerformanceAnalytics stats={stats} trades={trades} />
                        </div>
                    </div>
                )}

                {activeTab === 'new-trade' && (
                    <div className="grid grid-cols-12 gap-6">
                        {/* Left: Trade Entry Form */}
                        <div className="col-span-5">
                            <div className="pj-card p-6">
                                <h2 className="text-white font-bold text-xl mb-6">New Trade Entry</h2>
                                <TradeForm
                                    onSuccess={() => { navigateTo('dashboard'); fetchData(); }}
                                    onPairChange={(pair) => setSelectedTrade({ ...selectedTrade, pair } as any)}
                                />
                            </div>
                        </div>

                        {/* Right: Live Chart Preview */}
                        <div className="col-span-7">
                            <div className="pj-card p-4">
                                <h3 className="text-white font-bold text-lg mb-4">
                                    {selectedTrade?.pair || 'EURUSD'} - Chart Preview
                                </h3>
                                <div className="h-[700px]">
                                    <TradingViewChart
                                        symbol={selectedTrade?.pair || 'EURUSD'}
                                        entryPrice={selectedTrade?.entry_price}
                                        stopLoss={selectedTrade?.stop_loss}
                                        takeProfit={selectedTrade?.take_profit}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="max-w-5xl mx-auto">
                        <PerformanceAnalytics stats={stats} trades={trades} />
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
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${active ? 'bg-[#00DCA3] text-black' : 'text-[#8B949E] hover:text-white hover:bg-[#161B22]'
                }`}
        >
            <span>{icon}</span>
            {label}
        </button>
    );
}
